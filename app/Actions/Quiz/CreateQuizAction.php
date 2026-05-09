<?php

namespace App\Actions\Quiz;

use App\Models\Quiz;
use App\Models\QuizAnswer;
use App\Models\QuizQuestion;

class CreateQuizAction
{
    public function execute(array $data): Quiz
    {
        /* ================= VALIDATION SAFETY ================= */
        if (empty($data['path_id'])) {
            throw new \Exception('path_id is required');
        }

        if (! isset($data['questions']) || ! is_array($data['questions'])) {
            throw new \Exception('questions must be an array');
        }

        /* ================= PREVENT DUPLICATE QUIZ ================= */
        if (Quiz::where('path_id', (string) $data['path_id'])->exists()) {
            throw new \Exception('Path ini sudah memiliki quiz');
        }

        /* ================= CREATE QUIZ ================= */
        $quiz = Quiz::create([
            'path_id' => (string) $data['path_id'], // 🔥 FIX FINAL (STRING)
            'difficulty' => $data['difficulty'] ?? 'easy',
        ]);

        /* ================= CREATE QUESTIONS ================= */
        foreach ($data['questions'] as $qIndex => $q) {

            $mediaPath = null;
            $mediaS3Path = null;

            /* ================= HANDLE MEDIA ================= */
            if (request()->hasFile("questions.$qIndex.media")) {
                $file = request()->file("questions.$qIndex.media");
                $mediaS3Path = $file->store('quiz-images', 's3');
                
                /** @var \Illuminate\Filesystem\FilesystemAdapter $disk */
                $disk = \Illuminate\Support\Facades\Storage::disk('s3');
                $mediaPath = $disk->url($mediaS3Path);
            }

            /* ================= CREATE QUESTION ================= */
            $question = QuizQuestion::create([
                'quiz_id' => (string) $quiz->_id, // 🔥 CONSISTENT STRING
                'question_text' => $q['question_text'] ?? '',
                'media_url' => $mediaPath,
                'media_path' => $mediaS3Path,
                'order' => $qIndex + 1,
            ]);

            /* ================= CREATE ANSWERS ================= */
            foreach ($q['answers'] as $a) {

                QuizAnswer::create([
                    'question_id' => (string) $question->_id, // 🔥 CONSISTENT
                    'answer_text' => $a['answer_text'] ?? '',
                    'is_correct' => (bool) ($a['is_correct'] ?? false),
                ]);
            }
        }

        /* ================= RETURN ================= */
        return $quiz->load('questions.answers');
    }
}
