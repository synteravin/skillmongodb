<?php

namespace App\Services\Quest;

use App\Actions\Quest\AcceptQuestBidAction;
use App\Actions\Quest\AwardQuestRewardsAction;
use App\Actions\Quest\CreateQuestAction;
use App\Actions\Quest\FileQuestDisputeAction;
use App\Actions\Quest\PlaceQuestBidAction;
use App\Actions\Quest\RecordQuestTransactionAction;
use App\Actions\Quest\ResolveQuestArbitrationAction;
use App\Enums\QuestBidStatus;
use App\Enums\QuestStatus;
use App\Models\Notification;
use App\Models\Quest;
use App\Models\QuestBid;
use App\Models\QuestMessage;
use App\Models\QuestTransaction;
use App\Models\User;
use Illuminate\Support\Facades\Storage;

class QuestService
{
    public function __construct(
        protected CreateQuestAction $createQuestAction,
        protected PlaceQuestBidAction $placeQuestBidAction,
        protected AcceptQuestBidAction $acceptQuestBidAction,
        protected AwardQuestRewardsAction $awardQuestRewardsAction,
        protected FileQuestDisputeAction $fileQuestDisputeAction,
        protected ResolveQuestArbitrationAction $resolveQuestArbitrationAction,
        protected RecordQuestTransactionAction $recordQuestTransactionAction
    ) {}

    /**
     * Get list of quests with filters.
     */
    public function listQuests(?string $search = null, ?string $status = null, ?int $limit = null): array
    {
        // On-the-fly expiration check for open quests
        $expiredQuests = Quest::where('status', QuestStatus::OPEN->value)
            ->where('deadline', '<', now())
            ->get();

        foreach ($expiredQuests as $eq) {
            $eq->status = QuestStatus::EXPIRED->value;
            $eq->save();

            if ($eq->creator_id) {
                Notification::create([
                    'notifiable_type' => User::class,
                    'notifiable_id' => $eq->creator_id,
                    'data' => [
                        'quest_id' => $eq->_id,
                        'title' => $eq->title,
                        'message' => "Quest Anda '{$eq->title}' telah kadaluarsa karena tidak ada pekerja yang dipilih hingga melewati batas tenggat waktu.",
                        'type' => 'quest_expired_creator',
                    ],
                    'read_at' => null,
                ]);
            }
        }

        $query = Quest::with('creator')
            ->whereNotIn('status', [QuestStatus::DRAFT->value, QuestStatus::REJECTED->value]);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($status) {
            $query->where('status', $status);
        }

        $total = $query->count();

        if ($limit) {
            $query->limit($limit);
        }

        $items = $query->latest()->get()->map(function ($quest) {
            $statusVal = $quest->status instanceof QuestStatus ? $quest->status->value : $quest->status;

            return [
                '_id' => (string) $quest->_id,
                'title' => $quest->title,
                'description' => $quest->description,
                'min_budget' => $quest->min_budget,
                'max_budget' => $quest->max_budget,
                'min_salary' => $quest->min_budget,
                'max_salary' => $quest->max_budget,
                'deadline' => $quest->deadline?->toISOString(),
                'status' => $statusVal,
                'creator_id' => $quest->creator_id ? (string) $quest->creator_id : null,
                'worker_id' => $quest->worker_id ? (string) $quest->worker_id : null,
                'creator' => [
                    'name' => $quest->creator?->name ?? 'Unknown User',
                    'role' => $quest->creator?->role ?? 'unknown',
                ],
                'bids_count' => QuestBid::where('quest_id', $quest->_id)->count(),
            ];
        })->toArray();

        return [
            'items' => $items,
            'total' => $total,
        ];
    }

    /**
     * Get detailed quest by ID.
     */
    public function getQuestDetails(string $id, ?User $currentUser = null)
    {
        $quest = Quest::with(['creator', 'worker'])->findOrFail($id);

        $statusVal = $quest->status instanceof QuestStatus ? $quest->status->value : $quest->status;

        if ($statusVal === QuestStatus::OPEN->value && $quest->deadline < now()) {
            $quest->status = QuestStatus::EXPIRED->value;
            $quest->save();
            $statusVal = QuestStatus::EXPIRED->value;

            if ($quest->creator_id) {
                Notification::create([
                    'notifiable_type' => User::class,
                    'notifiable_id' => $quest->creator_id,
                    'data' => [
                        'quest_id' => $quest->_id,
                        'title' => $quest->title,
                        'message' => "Quest Anda '{$quest->title}' telah kadaluarsa karena tidak ada pekerja yang dipilih hingga melewati batas tenggat waktu.",
                        'type' => 'quest_expired_creator',
                    ],
                    'read_at' => null,
                ]);
            }
        }

        if ($statusVal === QuestStatus::ONGOING->value && $quest->deadline < now()) {
            $alreadyNotified = Notification::where('notifiable_id', $quest->creator_id)
                ->where('data.quest_id', $quest->_id)
                ->where('data.type', 'quest_overdue_creator')
                ->exists();

            if (! $alreadyNotified && $quest->creator_id) {
                Notification::create([
                    'notifiable_type' => User::class,
                    'notifiable_id' => $quest->creator_id,
                    'data' => [
                        'quest_id' => $quest->_id,
                        'title' => $quest->title,
                        'message' => "Pengerjaan quest '{$quest->title}' telah melewati batas tenggat waktu. Apakah Anda ingin memperpanjang tenggat waktu atau mengajukan dispute?",
                        'type' => 'quest_overdue_creator',
                    ],
                    'read_at' => null,
                ]);
            }
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

                $bidStatusVal = $bid->status instanceof QuestBidStatus ? $bid->status->value : $bid->status;

                return [
                    '_id' => (string) $bid->_id,
                    'bid_amount' => $bid->bid_amount,
                    'cv' => $bid->cv,
                    'portfolio' => $bid->portfolio,
                    'proposal' => $bid->proposal,
                    'status' => $bidStatusVal,
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

        $resolvedPaymentProof = null;
        if ($quest->payment_proof) {
            $resolvedPaymentProof = [
                'name' => $quest->payment_proof['name'] ?? 'receipt.png',
                'url' => $disk->url($quest->payment_proof['path']),
                'size' => $quest->payment_proof['size'] ?? 0,
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

        $acceptedBid = QuestBid::where('quest_id', $quest->_id)->where('status', QuestBidStatus::ACCEPTED->value)->first();
        $acceptedBidAmount = $acceptedBid ? (int) $acceptedBid->bid_amount : null;

        return [
            'quest' => [
                '_id' => (string) $quest->_id,
                'title' => $quest->title,
                'description' => $quest->description,
                'min_budget' => $quest->min_budget,
                'max_budget' => $quest->max_budget,
                'min_salary' => $quest->min_budget,
                'max_salary' => $quest->max_budget,
                'deadline' => $quest->deadline?->toISOString(),
                'status' => $statusVal,
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
                'accepted_bid_amount' => $acceptedBidAmount,
                'payment_proof' => $resolvedPaymentProof,
                'payment_uploaded_at' => $quest->payment_uploaded_at ? $quest->payment_uploaded_at->toISOString() : null,
                'payment_confirmed_at' => $quest->payment_confirmed_at ? $quest->payment_confirmed_at->toISOString() : null,
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
            $resolvedDispute['ruling'] = $rulingRaw;
        }

        if (($resolvedDispute['ruling'] ?? '') === 'pay_worker') {
            $resolvedDispute['ruling'] = 'release_payout';
        }
        if (($resolvedDispute['ruling'] ?? '') === 'refund') {
            $resolvedDispute['ruling'] = 'refund_creator';
        }

        return $resolvedDispute;
    }

    /**
     * Create a new Quest.
     */
    public function createQuest(User $creator, array $data): Quest
    {
        return $this->createQuestAction->execute($creator, $data);
    }

    /**
     * Submit a bid/application for a quest.
     */
    public function placeBid(User $student, Quest $quest, array $data): QuestBid
    {
        return $this->placeQuestBidAction->execute($student, $quest, $data);
    }

    /**
     * Accept a bid on a quest (and reject all other bids).
     */
    public function acceptBid(User $creator, Quest $quest, string $bidId): void
    {
        $this->acceptQuestBidAction->execute($creator, $quest, $bidId);
    }

    /**
     * Get calculated/custom rewards based on tier or user overrides.
     */
    public function getRewardsForQuest(Quest $quest): array
    {
        return $this->awardQuestRewardsAction->getRewardsForQuest($quest);
    }

    /**
     * Award gamification rewards to worker.
     */
    public function awardQuestRewards(Quest $quest, string $workerId): void
    {
        $this->awardQuestRewardsAction->execute($quest, $workerId);
    }

    /**
     * File a dispute for the quest.
     */
    public function fileDispute(Quest $quest, User $user, string $reason): void
    {
        $this->fileQuestDisputeAction->execute($quest, $user, $reason);
    }

    /**
     * Resolve arbitration for the quest.
     */
    public function resolveArbitration(Quest $quest, string $ruling, ?string $note, ?int $splitPercentage = null): void
    {
        $this->resolveQuestArbitrationAction->execute($quest, $ruling, $note, $splitPercentage);
    }

    /**
     * Record a transaction and adjust the target user's Gold balance.
     */
    public function recordTransaction(string $questId, string $userId, int $amount, string $type, string $description): QuestTransaction
    {
        return $this->recordQuestTransactionAction->execute($questId, $userId, $amount, $type, $description);
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

            $statusVal = $quest->status instanceof QuestStatus ? $quest->status->value : $quest->status;
            $myBidStatusVal = $myBid?->status instanceof QuestBidStatus ? $myBid->status->value : $myBid?->status;

            return [
                '_id' => (string) $quest->_id,
                'title' => $quest->title,
                'description' => $quest->description,
                'min_budget' => $quest->min_budget,
                'max_budget' => $quest->max_budget,
                'min_salary' => $quest->min_budget,
                'max_salary' => $quest->max_budget,
                'deadline' => $quest->deadline?->toISOString(),
                'status' => $statusVal,
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
                    'status' => $myBidStatusVal,
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
