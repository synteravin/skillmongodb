<?php

namespace App\Actions\Quest;

use App\Enums\QuestStatus;
use App\Models\Notification;
use App\Models\Quest;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

class SubmitFinalZipAction
{
    /**
     * Execute submission of the final master ZIP archive by worker.
     */
    public function execute(User $worker, Quest $quest, UploadedFile $finalZipFile): Quest
    {
        if ((string) $quest->worker_id !== (string) $worker->_id) {
            abort(403, 'Hanya pekerja terpilih yang dapat mengunggah berkas final.');
        }

        if (! in_array($quest->status, [QuestStatus::PAYMENT->value, QuestStatus::DELIVERED->value])) {
            abort(400, 'Berkas ZIP final hanya dapat diunggah setelah bukti transfer pembayaran diunggah.');
        }

        $originalName = $finalZipFile->getClientOriginalName();
        $path = $finalZipFile->store('quests/deliverables', 's3');
        $size = $finalZipFile->getSize();

        $submissionFile = [
            'name' => $originalName,
            'path' => $path,
            'size' => $size,
        ];

        $history = $quest->submission_history ?? [];
        $nextVersion = count($history) + 1;
        $history[] = [
            'version' => $nextVersion,
            'submitted_at' => now()->toIso8601String(),
            'submission_link' => $quest->submission_link,
            'submission_note' => 'Master ZIP Deliverable Diunggah (Menunggu Verifikasi & Konfirmasi Akhir)',
            'submission_file' => $submissionFile,
        ];

        $quest->update([
            'submission_file' => $submissionFile,
            'status' => QuestStatus::DELIVERED->value,
            'submission_history' => $history,
            'revision_note' => null,
        ]);

        if ($quest->creator_id) {
            try {
                Notification::create([
                    'notifiable_type' => User::class,
                    'notifiable_id' => (string) $quest->creator_id,
                    'data' => [
                        'quest_id' => (string) $quest->_id,
                        'quest_slug' => $quest->slug ?: Str::slug($quest->title),
                        'title' => $quest->title,
                        'message' => "Pekerja '{$worker->name}' telah mengunggah berkas Master ZIP final untuk quest '{$quest->title}'. Silakan periksa kelayakan berkas dan berikan konfirmasi akhir!",
                        'type' => 'work_delivered',
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
