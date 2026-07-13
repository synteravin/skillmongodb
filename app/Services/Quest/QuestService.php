<?php

namespace App\Services\Quest;

use App\Models\Notification;
use App\Models\Quest;
use App\Models\QuestBid;
use App\Models\QuestMessage;
use App\Models\QuestTransaction;
use App\Models\User;
use App\Models\UserStat;
use Illuminate\Support\Facades\Storage;

class QuestService
{
    /**
     * Get list of quests with filters.
     */
    public function listQuests(?string $search = null, ?string $status = null)
    {
        // On-the-fly expiration check
        $expiredQuests = Quest::where('status', 'ongoing')
            ->where('deadline', '<', now())
            ->get();

        foreach ($expiredQuests as $eq) {
            $eq->status = 'expired';
            $wId = $eq->worker_id;
            $eq->worker_id = null;
            $eq->save();

            if ($wId) {
                $progress = UserStat::where('user_id', $wId)->first();
                if ($progress) {
                    $progress->erp = max(0, ($progress->erp ?? 0) - 10);
                    $progress->save();
                }

                Notification::create([
                    'notifiable_type' => User::class,
                    'notifiable_id' => $wId,
                    'data' => [
                        'quest_id' => $eq->_id,
                        'title' => $eq->title,
                        'message' => "Quest '{$eq->title}' telah kadaluarsa karena melewati tenggat waktu. Reputasi ERP Anda berkurang -10.",
                        'type' => 'quest_expired_worker',
                    ],
                    'read_at' => null,
                ]);
            }

            if ($eq->creator_id) {
                Notification::create([
                    'notifiable_type' => User::class,
                    'notifiable_id' => $eq->creator_id,
                    'data' => [
                        'quest_id' => $eq->_id,
                        'title' => $eq->title,
                        'message' => "Quest '{$eq->title}' telah kadaluarsa karena melewati tenggat waktu dan pekerja dilepaskan.",
                        'type' => 'quest_expired_creator',
                    ],
                    'read_at' => null,
                ]);
            }
        }

        $query = Quest::with('creator')
            ->whereNotIn('status', ['draft', 'rejected']);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($status) {
            $query->where('status', $status);
        }

        return $query->latest()->get()->map(function ($quest) {
            return [
                '_id' => (string) $quest->_id,
                'title' => $quest->title,
                'description' => $quest->description,
                'min_salary' => $quest->min_salary,
                'max_salary' => $quest->max_salary,
                'deadline' => $quest->deadline->toISOString(),
                'status' => $quest->status,
                'creator' => [
                    'name' => $quest->creator?->name ?? 'Unknown User',
                    'role' => $quest->creator?->role ?? 'unknown',
                ],
                'bids_count' => QuestBid::where('quest_id', $quest->_id)->count(),
            ];
        });
    }

    /**
     * Get detailed quest by ID.
     */
    public function getQuestDetails(string $id, ?User $currentUser = null)
    {
        $quest = Quest::with(['creator', 'worker'])->findOrFail($id);

        if ($quest->status === 'ongoing' && $quest->deadline < now()) {
            $quest->status = 'expired';
            $workerId = $quest->worker_id;
            $quest->worker_id = null;
            $quest->save();

            if ($workerId) {
                $progress = UserStat::where('user_id', $workerId)->first();
                if ($progress) {
                    $progress->erp = max(0, ($progress->erp ?? 0) - 10);
                    $progress->save();
                }

                Notification::create([
                    'notifiable_type' => User::class,
                    'notifiable_id' => $workerId,
                    'data' => [
                        'quest_id' => $quest->_id,
                        'title' => $quest->title,
                        'message' => "Quest '{$quest->title}' telah kadaluarsa karena melewati tenggat waktu. Reputasi ERP Anda berkurang -10.",
                        'type' => 'quest_expired_worker',
                    ],
                    'read_at' => null,
                ]);
            }

            if ($quest->creator_id) {
                Notification::create([
                    'notifiable_type' => User::class,
                    'notifiable_id' => $quest->creator_id,
                    'data' => [
                        'quest_id' => $quest->_id,
                        'title' => $quest->title,
                        'message' => "Quest '{$quest->title}' telah kadaluarsa karena melewati tenggat waktu dan pekerja dilepaskan.",
                        'type' => 'quest_expired_creator',
                    ],
                    'read_at' => null,
                ]);
            }

            $quest->load('worker');
        }

        $bids = QuestBid::with('student')
            ->where('quest_id', $id)
            ->latest()
            ->get()
            ->map(function ($bid) use ($currentUser) {
                $unreadCount = 0;
                if ($currentUser) {
                    $unreadCount = QuestMessage::where('quest_bid_id', $bid->_id)
                        ->where('sender_id', '!=', $currentUser->_id)
                        ->where('read_by', '!=', $currentUser->_id)
                        ->count();
                }

                return [
                    '_id' => (string) $bid->_id,
                    'bid_amount' => $bid->bid_amount,
                    'cv' => $bid->cv,
                    'portfolio' => $bid->portfolio,
                    'proposal' => $bid->proposal,
                    'status' => $bid->status,
                    'created_at' => $bid->created_at->toISOString(),
                    'student' => [
                        '_id' => (string) ($bid->student?->_id ?? ''),
                        'name' => $bid->student?->name ?? 'Deleted User',
                        'email' => $bid->student?->email ?? '',
                    ],
                    'unread_messages_count' => $unreadCount,
                ];
            });

        $disk = Storage::disk('s3');
        $resolvedImages = array_map(function ($img) use ($disk) {
            return [
                'name' => $img['name'] ?? 'image.jpg',
                'url' => $disk->url($img['path']),
            ];
        }, $quest->images ?? []);

        $resolvedFiles = array_map(function ($file) use ($disk) {
            return [
                'name' => $file['name'] ?? 'file.dat',
                'url' => $disk->url($file['path']),
                'size' => $file['size'] ?? 0,
            ];
        }, $quest->files ?? []);

        $resolvedSubmissionFile = null;
        if ($quest->submission_file) {
            $resolvedSubmissionFile = [
                'name' => $quest->submission_file['name'] ?? 'deliverable.zip',
                'url' => $disk->url($quest->submission_file['path']),
                'size' => $quest->submission_file['size'] ?? 0,
            ];
        }

        $resolvedSubmissionHistory = array_map(function ($sub) use ($disk) {
            return [
                'version' => $sub['version'] ?? 1,
                'submitted_at' => $sub['submitted_at'] ?? null,
                'submission_link' => $sub['submission_link'] ?? null,
                'submission_note' => $sub['submission_note'] ?? null,
                'submission_file' => isset($sub['submission_file']['path']) ? [
                    'name' => $sub['submission_file']['name'] ?? 'deliverable.zip',
                    'url' => $disk->url($sub['submission_file']['path']),
                    'size' => $sub['submission_file']['size'] ?? 0,
                ] : null,
            ];
        }, $quest->submission_history ?? []);

        $rewards = $this->getRewardsForQuest($quest);
        $acceptedBid = QuestBid::where('quest_id', $quest->_id)->where('status', 'accepted')->first();
        if ($acceptedBid) {
            $rewards['gold'] = (int) $acceptedBid->bid_amount;
        }

        return [
            'quest' => [
                '_id' => (string) $quest->_id,
                'title' => $quest->title,
                'description' => $quest->description,
                'min_salary' => $quest->min_salary,
                'max_salary' => $quest->max_salary,
                'deadline' => $quest->deadline->toISOString(),
                'status' => $quest->status,
                'creator_id' => $quest->creator_id,
                'creator' => [
                    'name' => $quest->creator?->name ?? 'Unknown User',
                    'role' => $quest->creator?->role ?? 'unknown',
                ],
                'worker' => $quest->worker ? [
                    'name' => $quest->worker->name,
                    'email' => $quest->worker->email,
                ] : null,
                'worker_id' => $quest->worker_id,
                'submission_link' => $quest->submission_link,
                'submission_note' => $quest->submission_note,
                'submitted_at' => $quest->submitted_at ? $quest->submitted_at->toISOString() : null,
                'completed_at' => $quest->completed_at ? $quest->completed_at->toISOString() : null,
                'revision_note' => $quest->revision_note,
                'revisions' => $quest->revisions ?? [],
                'rejection_note' => $quest->rejection_note,
                'rating' => $quest->rating,
                'rating_comment' => $quest->rating_comment,
                'images' => $resolvedImages,
                'files' => $resolvedFiles,
                'submission_file' => $resolvedSubmissionFile,
                'tier' => $quest->tier ?? 'C',
                'custom_rewards' => $quest->custom_rewards,
                'dispute' => $this->resolveDispute($quest),
                'submission_history' => $resolvedSubmissionHistory,
                'rewards' => $rewards,
            ],
            'bids' => $bids,
        ];
    }

    /**
     * Resolve and format dispute details for frontend compatibility.
     */
    public function resolveDispute(Quest $quest): ?array
    {
        if (! $quest->dispute) {
            return null;
        }

        $disputer = User::find($quest->dispute['disputer_id'] ?? $quest->dispute['filer_id'] ?? null);

        $resolvedDispute = array_merge([
            'status' => $quest->dispute['status'] ?? 'pending',
            'reason' => $quest->dispute['reason'] ?? '',
            'disputed_at' => $quest->dispute['disputed_at'] ?? null,
            'resolved_at' => $quest->dispute['resolved_at'] ?? null,
            'ruled_at' => $quest->dispute['ruled_at'] ?? $quest->dispute['resolved_at'] ?? null,
            'ruling_note' => $quest->dispute['ruling_note'] ?? null,
            'note' => $quest->dispute['note'] ?? $quest->dispute['ruling_note'] ?? null,
            'split_percentage' => $quest->dispute['split_percentage'] ?? null,
            'disputer_id' => $quest->dispute['disputer_id'] ?? null,
            'filer_id' => $quest->dispute['filer_id'] ?? $quest->dispute['disputer_id'] ?? null,
            'filer_name' => $quest->dispute['filer_name'] ?? ($disputer ? $disputer->name : 'User'),
            'ruling' => $quest->dispute['ruling'] ?? null,
        ], $quest->dispute);

        if (empty($resolvedDispute['ruling']) && isset($quest->dispute['status']) && str_starts_with($quest->dispute['status'], 'resolved_')) {
            $rulingRaw = substr($quest->dispute['status'], 9);
            $resolvedDispute['ruling'] = $rulingRaw === 'release_payout' ? 'pay_worker' : ($rulingRaw === 'refund_creator' ? 'refund' : $rulingRaw);
        }

        return $resolvedDispute;
    }

    /**
     * Create a new Quest.
     */
    public function createQuest(User $creator, array $data): Quest
    {
        $status = $creator->isAdmin() ? 'open' : 'draft';

        $maxSalary = (int) $data['max_salary'];
        if ($maxSalary >= 10000000) {
            $tier = 'S';
        } elseif ($maxSalary >= 5000000) {
            $tier = 'A';
        } elseif ($maxSalary >= 2500000) {
            $tier = 'B';
        } elseif ($maxSalary >= 1000000) {
            $tier = 'C';
        } else {
            $tier = 'D';
        }

        return Quest::create([
            'title' => $data['title'],
            'description' => $data['description'],
            'min_salary' => (int) $data['min_salary'],
            'max_salary' => (int) $data['max_salary'],
            'deadline' => now()->parse($data['deadline']),
            'status' => $status,
            'creator_id' => $creator->_id,
            'images' => $data['images'] ?? [],
            'files' => $data['files'] ?? [],
            'tier' => $tier,
            'custom_rewards' => $data['custom_rewards'] ?? null,
            'submission_history' => [],
        ]);
    }

    /**
     * Submit a bid/application for a quest.
     */
    public function placeBid(User $student, Quest $quest, array $data): QuestBid
    {
        return QuestBid::create([
            'quest_id' => $quest->_id,
            'student_id' => $student->_id,
            'bid_amount' => (int) $data['bid_amount'],
            'cv' => $data['cv'],
            'portfolio' => $data['portfolio'],
            'proposal' => $data['proposal'],
            'status' => 'pending',
        ]);
    }

    /**
     * Accept a bid on a quest (and reject all other bids).
     */
    public function acceptBid(User $creator, Quest $quest, string $bidId): void
    {
        $acceptedBid = QuestBid::findOrFail($bidId);

        if ($acceptedBid->quest_id !== $quest->_id) {
            abort(400, 'Bid tidak cocok dengan Quest ini.');
        }

        // Accept the chosen bid
        $acceptedBid->update(['status' => 'accepted']);

        // Reject all other bids for this quest
        QuestBid::where('quest_id', $quest->_id)
            ->where('_id', '!=', $bidId)
            ->update(['status' => 'rejected']);

        // Update quest worker and status
        $quest->update([
            'status' => 'ongoing',
            'worker_id' => $acceptedBid->student_id,
        ]);
    }

    /**
     * Get calculated/custom rewards based on tier or user overrides.
     */
    public function getRewardsForQuest(Quest $quest): array
    {
        if ($quest->custom_rewards) {
            return [
                'exp' => (int) ($quest->custom_rewards['exp'] ?? 250),
                'gold' => (int) ($quest->custom_rewards['gold'] ?? 150),
                'erp' => (int) ($quest->custom_rewards['erp'] ?? 100),
            ];
        }

        // Default reward mapping based on Tier
        $rewards = [
            'D' => ['exp' => 100, 'gold' => 50, 'erp' => 20],
            'C' => ['exp' => 250, 'gold' => 150, 'erp' => 100],
            'B' => ['exp' => 500, 'gold' => 300, 'erp' => 100],
            'A' => ['exp' => 1000, 'gold' => 600, 'erp' => 200],
            'S' => ['exp' => 2500, 'gold' => 1500, 'erp' => 500],
        ];

        $tier = $quest->tier ?? 'C';

        return $rewards[$tier] ?? $rewards['C'];
    }

    /**
     * Award gamification rewards to worker.
     */
    public function awardQuestRewards(Quest $quest, string $workerId): void
    {
        $progress = UserStat::firstOrCreate([
            'user_id' => $workerId,
            'course_id' => 'quest_rewards',
        ], [
            'completed_modules' => [],
            'completed_paths' => [],
            'exp' => 0,
            'gold' => 0,
            'erp' => 0,
            'level' => 1,
            'path_stats' => [],
        ]);

        $rewards = $this->getRewardsForQuest($quest);

        $acceptedBid = QuestBid::where('quest_id', $quest->_id)->where('status', 'accepted')->first();
        if ($acceptedBid) {
            $rewards['gold'] = (int) $acceptedBid->bid_amount;
        }

        $pathStats = $progress->path_stats ?? [];
        if (is_string($pathStats)) {
            $pathStats = json_decode($pathStats, true) ?: [];
        } else {
            $pathStats = (array) $pathStats;
        }

        $questKey = (string) $quest->_id;
        $pathStats[$questKey] = [
            'exp' => $rewards['exp'],
            'gold' => $rewards['gold'],
            'quiz_score' => $rewards['erp'], // quiz_score represents ERP
        ];

        $progress->path_stats = $pathStats;

        $progress->exp = (int) ($progress->exp ?? 0) + $rewards['exp'];
        $progress->gold = (int) ($progress->gold ?? 0) + $rewards['gold'];
        $progress->erp = (int) ($progress->erp ?? 0) + $rewards['erp'];
        $progress->level = (int) max(($progress->level ?? 1), floor($progress->exp / 500) + 1);

        $progress->save();

        // Record Gold transaction: release_payout to worker
        $this->recordTransaction($quest->_id, $workerId, $rewards['gold'], 'release_payout', "Escrow payout release for quest completion: {$quest->title}");
    }

    /**
     * File a dispute for the quest.
     */
    public function fileDispute(Quest $quest, User $user, string $reason): void
    {
        if (! in_array($quest->status, ['submitted', 'ongoing'])) {
            abort(400, 'Quest tidak dalam status aktif atau peninjauan untuk diajukan dispute.');
        }

        $quest->update([
            'status' => 'disputed',
            'dispute' => [
                'disputed_at' => now()->toIso8601String(),
                'disputer_id' => $user->_id,
                'filer_id' => $user->_id,
                'filer_name' => $user->name,
                'reason' => $reason,
                'status' => 'pending',
                'resolved_at' => null,
                'ruled_at' => null,
                'ruling_note' => null,
                'note' => null,
                'ruling' => null,
            ],
        ]);

        if ($quest->creator_id) {
            Notification::create([
                'notifiable_type' => User::class,
                'notifiable_id' => $quest->creator_id,
                'data' => [
                    'quest_id' => $quest->_id,
                    'title' => $quest->title,
                    'message' => "Perselisihan (dispute) telah diajukan pada quest '{$quest->title}' oleh {$user->name}. Status ditangguhkan menunggu keputusan Admin.",
                    'type' => 'quest_disputed',
                ],
                'read_at' => null,
            ]);
        }

        if ($quest->worker_id && $quest->worker_id !== $user->_id) {
            Notification::create([
                'notifiable_type' => User::class,
                'notifiable_id' => $quest->worker_id,
                'data' => [
                    'quest_id' => $quest->_id,
                    'title' => $quest->title,
                    'message' => "Perselisihan (dispute) telah diajukan pada quest '{$quest->title}' oleh {$user->name}. Status ditangguhkan menunggu keputusan Admin.",
                    'type' => 'quest_disputed',
                ],
                'read_at' => null,
            ]);
        }
    }

    /**
     * Resolve arbitration for the quest.
     */
    public function resolveArbitration(Quest $quest, string $ruling, ?string $note, ?int $splitPercentage = null): void
    {
        if ($quest->status !== 'disputed') {
            abort(400, 'Hanya quest berstatus disputed yang dapat diarbiatrase.');
        }

        $acceptedBid = QuestBid::where('quest_id', $quest->_id)->where('status', 'accepted')->first();
        $bidAmount = $acceptedBid ? (int) $acceptedBid->bid_amount : (int) $quest->max_salary;

        $dispute = $quest->dispute ?? [];
        $dispute['status'] = 'resolved_'.$ruling;
        $dispute['ruling'] = $ruling === 'release_payout' ? 'pay_worker' : ($ruling === 'refund_creator' ? 'refund' : $ruling);
        $dispute['ruling_note'] = $note;
        $dispute['note'] = $note;
        $dispute['resolved_at'] = now()->toIso8601String();
        $dispute['ruled_at'] = now()->toIso8601String();
        if ($ruling === 'split') {
            $dispute['split_percentage'] = (int) $splitPercentage;
        }

        if ($ruling === 'release_payout') {
            $quest->update([
                'status' => 'completed',
                'completed_at' => now(),
                'dispute' => $dispute,
            ]);

            if ($quest->worker_id) {
                $this->awardQuestRewards($quest, $quest->worker_id);
            }
        } elseif ($ruling === 'refund_creator') {
            $quest->update([
                'status' => 'cancelled',
                'completed_at' => now(),
                'dispute' => $dispute,
            ]);
        } elseif ($ruling === 'split') {
            $splitPercentage = (int) $splitPercentage;
            $workerShare = (int) round(($bidAmount * $splitPercentage) / 100);
            $creatorShare = $bidAmount - $workerShare;

            $quest->update([
                'status' => 'completed',
                'completed_at' => now(),
                'dispute' => $dispute,
            ]);

            if ($quest->worker_id) {
                $progress = UserStat::firstOrCreate([
                    'user_id' => $quest->worker_id,
                    'course_id' => 'quest_rewards',
                ], [
                    'completed_modules' => [],
                    'completed_paths' => [],
                    'exp' => 0,
                    'gold' => 0,
                    'erp' => 0,
                    'level' => 1,
                    'path_stats' => [],
                ]);

                $rewards = $this->getRewardsForQuest($quest);
                $partialExp = (int) round(($rewards['exp'] * $splitPercentage) / 100);
                $partialErp = (int) round(($rewards['erp'] * $splitPercentage) / 100);

                $pathStats = $progress->path_stats ?? [];
                if (is_string($pathStats)) {
                    $pathStats = json_decode($pathStats, true) ?: [];
                } else {
                    $pathStats = (array) $pathStats;
                }

                $questKey = (string) $quest->_id;
                $pathStats[$questKey] = [
                    'exp' => $partialExp,
                    'gold' => $workerShare,
                    'quiz_score' => $partialErp,
                ];

                $progress->path_stats = $pathStats;
                $progress->exp = (int) ($progress->exp ?? 0) + $partialExp;
                $progress->gold = (int) ($progress->gold ?? 0) + $workerShare;
                $progress->erp = (int) ($progress->erp ?? 0) + $partialErp;
                $progress->level = (int) max(($progress->level ?? 1), floor($progress->exp / 500) + 1);
                $progress->save();

                $this->recordTransaction($quest->_id, $quest->worker_id, $workerShare, 'release_payout', "Split payout release (Share: {$splitPercentage}%) for quest: {$quest->title}");
            }
        }

        if ($quest->creator_id) {
            Notification::create([
                'notifiable_type' => User::class,
                'notifiable_id' => $quest->creator_id,
                'data' => [
                    'quest_id' => $quest->_id,
                    'title' => $quest->title,
                    'message' => "Arbitrase quest '{$quest->title}' telah diputuskan oleh Admin: ".strtoupper(str_replace('_', ' ', $ruling)).'.',
                    'type' => 'quest_arbitrated',
                ],
                'read_at' => null,
            ]);
        }

        if ($quest->worker_id) {
            Notification::create([
                'notifiable_type' => User::class,
                'notifiable_id' => $quest->worker_id,
                'data' => [
                    'quest_id' => $quest->_id,
                    'title' => $quest->title,
                    'message' => "Arbitrase quest '{$quest->title}' telah diputuskan oleh Admin: ".strtoupper(str_replace('_', ' ', $ruling)).'.',
                    'type' => 'quest_arbitrated',
                ],
                'read_at' => null,
            ]);
        }
    }

    /**
     * Record a transaction and adjust the target user's Gold balance.
     */
    public function recordTransaction(string $questId, string $userId, int $amount, string $type, string $description): QuestTransaction
    {
        $transaction = QuestTransaction::create([
            'quest_id' => $questId,
            'user_id' => $userId,
            'amount' => $amount,
            'type' => $type,
            'description' => $description,
        ]);

        $user = User::find($userId);
        if ($user) {
            $userStat = UserStat::firstOrCreate([
                'user_id' => $userId,
                'course_id' => 'quest_rewards',
            ], [
                'completed_modules' => [],
                'completed_paths' => [],
                'exp' => 0,
                'gold' => 0,
                'erp' => 0,
                'level' => 1,
                'path_stats' => [],
            ]);

            $currentGold = (int) ($userStat->gold ?? 0);
            $userStat->gold = max(0, $currentGold + $amount);
            $userStat->save();
        }

        return $transaction;
    }

    /**
     * Get quest history (taken / bidded / completed) for a student.
     */
    public function getStudentQuestHistory(User $user)
    {
        $bids = QuestBid::where('student_id', (string) $user->_id)->get();
        $biddedQuestIds = $bids->pluck('quest_id')->toArray();

        $quests = Quest::with(['creator', 'worker'])
            ->where(function ($query) use ($user, $biddedQuestIds) {
                $query->where('worker_id', (string) $user->_id)
                    ->orWhere('creator_id', (string) $user->_id)
                    ->orWhereIn('_id', $biddedQuestIds);
            })
            ->latest()
            ->get();

        return $quests->map(function ($quest) use ($user, $bids) {
            $myBid = $bids->firstWhere('quest_id', (string) $quest->_id);

            $submissionFile = null;
            if ($quest->submission_file) {
                $subFile = $quest->submission_file;
                $submissionFile = [
                    'name' => $subFile['name'] ?? 'project.zip',
                    'size' => $subFile['size'] ?? 0,
                    'url' => isset($subFile['path']) ? Storage::disk('s3')->temporaryUrl($subFile['path'], now()->addMinutes(30)) : null,
                ];
            }

            $rewards = $this->getRewardsForQuest($quest);
            $acceptedBid = $bids->firstWhere('quest_id', (string) $quest->_id);
            if ($acceptedBid && $acceptedBid->status === 'accepted') {
                $rewards['gold'] = (int) $acceptedBid->bid_amount;
            }

            return [
                '_id' => (string) $quest->_id,
                'title' => $quest->title,
                'description' => $quest->description,
                'min_salary' => $quest->min_salary,
                'max_salary' => $quest->max_salary,
                'deadline' => $quest->deadline?->toISOString(),
                'status' => $quest->status,
                'creator' => [
                    'name' => $quest->creator?->name ?? 'Unknown User',
                    'role' => $quest->creator?->role ?? 'unknown',
                ],
                'worker' => $quest->worker ? [
                    'name' => $quest->worker->name,
                    'email' => $quest->worker->email,
                ] : null,
                'worker_id' => $quest->worker_id,
                'is_worker' => $quest->worker_id === (string) $user->_id,
                'is_creator' => $quest->creator_id === (string) $user->_id,
                'my_bid' => $myBid ? [
                    'bid_amount' => $myBid->bid_amount,
                    'status' => $myBid->status,
                    'proposal' => $myBid->proposal,
                    'cv' => $myBid->cv,
                    'portfolio' => $myBid->portfolio,
                ] : null,
                'submission_link' => $quest->submission_link,
                'submission_note' => $quest->submission_note,
                'submission_file' => $submissionFile,
                'submitted_at' => $quest->submitted_at?->toISOString(),
                'completed_at' => $quest->completed_at?->toISOString(),
                'rating' => $quest->rating,
                'rating_comment' => $quest->rating_comment,
                'revision_note' => $quest->revision_note,
                'rejection_note' => $quest->rejection_note,
                'rewards' => $rewards,
                'dispute' => $this->resolveDispute($quest),
            ];
        });
    }
}
