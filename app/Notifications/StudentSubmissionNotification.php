<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class StudentSubmissionNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public string $studentSubmissionId,
        public string $studentName,
        public string $submissionTitle,
        public string $careerGroupName
    ) {}

    public function via(object $notifiable): array
    {
        return ['database', 'mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $actionUrl = url('/mentor/student-submissions/'.$this->studentSubmissionId);

        return (new MailMessage)
            ->subject('Tugas Baru Menunggu Penilaian - '.$this->studentName)
            ->withSymfonyMessage(function ($message) {
                // Menambahkan header High Priority agar Gmail membunyikan notifikasi HP
                $message->getHeaders()->addTextHeader('X-Priority', '1 (Highest)');
                $message->getHeaders()->addTextHeader('Importance', 'High');
            })
            ->view('emails.student-submission', [
                'studentSubmissionId' => $this->studentSubmissionId,
                'studentName' => $this->studentName,
                'submissionTitle' => $this->submissionTitle,
                'careerGroupName' => $this->careerGroupName,
                'actionUrl' => $actionUrl,
                'notifiable' => $notifiable,
            ]);
    }

    public function toDatabase(object $notifiable): array
    {
        return [
            'student_submission_id' => $this->studentSubmissionId,
            'student_name' => $this->studentName,
            'submission_title' => $this->submissionTitle,
            'career_group_name' => $this->careerGroupName,
            'message' => "{$this->studentName} mengumpulkan tugas pada branch {$this->careerGroupName}",
            'type' => 'student_submission',
        ];
    }
}
