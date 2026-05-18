<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
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

    public function toMail(object $notifiable)
    {
        return (new \Illuminate\Notifications\Messages\MailMessage)
            ->subject('Tugas Baru Menunggu Penilaian - ' . $this->studentName)
            ->greeting('Halo ' . $notifiable->name . ',')
            ->line('Ada submission (tugas) baru yang butuh direview dari siswa Anda:')
            ->line('**Nama Siswa:** ' . $this->studentName)
            ->line('**Judul Tugas:** ' . $this->submissionTitle)
            ->line('**Career Group:** ' . $this->careerGroupName)
            ->action('Periksa Tugas Sekarang', url('/mentor/student-submissions/' . $this->studentSubmissionId))
            ->line('Harap segera diperiksa dan diberikan penilaian agar siswa dapat melanjutkan ke materi berikutnya. Terima kasih!');
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
