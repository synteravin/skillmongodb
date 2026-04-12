<?php

namespace App\Actions\Quiz;

use App\Models\Quiz;
use App\Models\QuizQuestion;
use App\Models\QuizAnswer;

class CreateQuizAction
{
    public function execute(array $data): Quiz
    {
        $quiz = Quiz::create([
            'module_id' => $data['module_id'],
            'difficulty' => $data['difficulty'] ?? 'easy'
        ]);

        foreach ($data['questions'] as $qIndex => $q) {

            $mediaPath = null;

            if (request()->hasFile("questions.$qIndex.media")) {
                $file = request()->file("questions.$qIndex.media");
                $mediaPath = $file->store('quiz-images', 'public');
            }

            $question = QuizQuestion::create([
                'quiz_id' => (string) $quiz->_id,
                'question_text' => $q['question_text'],
                'media_url' => $mediaPath,
                'order' => $qIndex + 1
            ]);

            foreach ($q['answers'] as $a) {
                QuizAnswer::create([
                    'question_id' => (string) $question->_id,
                    'answer_text' => $a['answer_text'],
                    'is_correct' => $a['is_correct']
                ]);
            }
        }

        return $quiz->load('questions.answers');
    }
}