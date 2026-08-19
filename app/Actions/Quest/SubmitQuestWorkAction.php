<?php

namespace App\Actions\Quest;

use App\Enums\QuestStatus;
use App\Models\Notification;
use App\Models\Quest;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

class SubmitQuestWorkAction
{
    /**
     * Execute the submission of project preview work.
     *
     * @param  array{submission_link: string, submission_note?: string|null, submission_file?: UploadedFile|null}  $data
     */
    public function execute(User $worker, Quest $quest, array $data): Quest
    {
        if ((string) $quest->worker_id !== (string) $worker->_id) {
            abort(403, 'Hanya pekerja terpilih yang dapat mengumpulkan hasil pekerjaan.');
        }

        if ($quest->status !== QuestStatus::ONGOING->value) {
            abort(400, 'Quest harus dalam status pengerjaan untuk dapat mengumpulkan hasil.');
        }

        $fileData = null;
        if (isset($data['submission_file']) && $data['submission_file'] instanceof UploadedFile) {
            $file = $data['submission_file'];
            $path = $file->store('quests/submissions', 's3');
            $fileData = [
                'name' => $file->getClientOriginalName(),
                'path' => $path,
                'size' => $file->getSize(),
            ];
        }

        $history = $quest->submission_history ?? [];
        $nextVersion = count($history) + 1;
        $history[] = [
            'version' => $nextVersion,
            'submitted_at' => now()->toIso8601String(),
            'submission_link' => $data['submission_link'],
            'submission_note' => $data['submission_note'] ?? null,
            'submission_file' => $fileData,
        ];

        $updateData = [
            'submission_link' => $data['submission_link'],
            'submission_note' => $data['submission_note'] ?? null,
            'submitted_at' => now(),
            'status' => QuestStatus::SUBMITTED->value,
            'revision_note' => null,
            'submission_history' => $history,
        ];

        if ($fileData) {
            $updateData['submission_file'] = $fileData;
        }

        $quest->update($updateData);

        if ($quest->creator_id) {
            try {
                Notification::create([
                    'notifiable_type' => User::class,
                    'notifiable_id' => (string) $quest->creator_id,
                    'data' => [
                        'quest_id' => (string) $quest->_id,
                        'quest_slug' => $quest->slug ?: Str::slug($quest->title),
                        'title' => $quest->title,
                        'message' => "Pekerja '{$worker->name}' telah mengunggah hasil pekerjaan (v{$nextVersion}) untuk quest '{$quest->title}'. Silakan lakukan review!",
                        'type' => 'work_submitted',
                    ],
                    'read_at' => null,
                ]);
            } catch (\Throwable $e) {
                // Ignore fallback
            }
        }

        return $quest;
    }
}
