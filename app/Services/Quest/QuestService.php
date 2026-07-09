<?php

namespace App\Services\Quest;

use App\Models\Notification;
use App\Models\Quest;
use App\Models\QuestBid;
use App\Models\QuestMessage;
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
            ],
            'bids' => $bids,
        ];
    }

    /**
     * Create a new Quest.
     */
    public function createQuest(User $creator, array $data): Quest
    {
        $status = $creator->isAdmin() ? 'open' : 'draft';

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
            ];
        });
    }
}
