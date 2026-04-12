<?php

namespace App\Responses\Quiz;

use App\Models\Quiz;

class QuizResponse
{
    public static function make(Quiz $quiz)
    {
        return [
            'id' => (string) $quiz->_id,
            'difficulty' => $quiz->difficulty,

            'questions' => $quiz->questions->map(function ($q) {
                return [
                    'id' => (string) $q->_id,

                    // 🔥 rename biar konsisten frontend
                    'question_text' => $q->question_text,

                    // 🔥 TAMBAHKAN INI (WAJIB)
                    'media_url' => $q->media_url
                        ? url('storage/' . $q->media_url)
                        : null,

                    'answers' => $q->answers->map(fn($a) => [
                        'id' => (string) $a->_id,
                        'answer_text' => $a->answer_text
                    ])
                ];
            })
        ];
    }
}