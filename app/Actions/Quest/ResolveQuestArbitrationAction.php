<?php

namespace App\Actions\Quest;

use App\Models\Notification;
use App\Models\Quest;
use App\Models\QuestBid;
use App\Models\User;
use App\Models\UserStat;

class ResolveQuestArbitrationAction
{
    public function __construct(
        protected AwardQuestRewardsAction $awardQuestRewardsAction,
        protected RecordQuestTransactionAction $recordTransactionAction
    ) {}

    /**
     * Execute the action to resolve arbitration for the quest.
     */
    public function execute(Quest $quest, string $ruling, ?string $note, ?int $splitPercentage = null): void
    {
        if ($quest->status !== 'disputed') {
            abort(400, 'Hanya quest berstatus disputed yang dapat diarbiatrase.');
        }

        $acceptedBid = QuestBid::where('quest_id', $quest->_id)->where('status', 'accepted')->first();
        $bidAmount = $acceptedBid ? (int) $acceptedBid->bid_amount : (int) $quest->max_salary;

        $dispute = $quest->dispute ?? [];
        $dispute['status'] = 'resolved_'.$ruling;
        $dispute['ruling'] = $ruling;
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
                $this->awardQuestRewardsAction->execute($quest, $quest->worker_id);
            }
        } elseif ($ruling === 'refund_creator') {
            $quest->update([
                'status' => 'cancelled',
                'completed_at' => now(),
                'dispute' => $dispute,
            ]);
        } elseif ($ruling === 'split') {
            $splitPercentage = (int) $splitPercentage;

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

                $pathStats = $progress->path_stats ?? [];
                if (is_string($pathStats)) {
                    $pathStats = json_decode($pathStats, true) ?: [];
                } else {
                    $pathStats = (array) $pathStats;
                }

                $questKey = (string) $quest->_id;
                if (! isset($pathStats[$questKey])) {
                    $rewards = $this->awardQuestRewardsAction->getRewardsForQuest($quest);
                    $partialExp = (int) round(($rewards['exp'] * $splitPercentage) / 100);
                    $partialGold = (int) round(($rewards['gold'] * $splitPercentage) / 100);
                    $partialErp = (int) round(($rewards['erp'] * $splitPercentage) / 100);

                    $pathStats[$questKey] = [
                        'exp' => $partialExp,
                        'gold' => $partialGold,
                        'quiz_score' => $partialErp,
                    ];

                    $progress->path_stats = $pathStats;
                    $progress->exp = (int) ($progress->exp ?? 0) + $partialExp;
                    $progress->erp = (int) ($progress->erp ?? 0) + $partialErp;
                    $progress->level = (int) max(($progress->level ?? 1), floor($progress->exp / 500) + 1);
                    $progress->save();

                    $this->recordTransactionAction->execute($quest->_id, $quest->worker_id, $partialGold, 'release_payout', "Split payout release (Share: {$splitPercentage}%) for quest: {$quest->title}");
                }
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
}
