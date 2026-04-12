<?php

namespace App\Actions\Quiz;

use App\Models\Quiz;
use App\Models\QuizQuestion;
use App\Models\QuizAnswer;

class UpdateQuizAction
{
    public function execute(Quiz $quiz, array $data)
    {
        $quiz->update([
            'difficulty' => $data['difficulty']
        ]);

        QuizQuestion::where('quiz_id', $quiz->_id)->delete();

        foreach ($data['questions'] as $qIndex => $q) {

            $question = QuizQuestion::create([
                'quiz_id' => $quiz->_id,
                'question_text' => $q['question_text'],
                'order' => $qIndex + 1
            ]);

            foreach ($q['answers'] as $a) {
                QuizAnswer::create([
                    'question_id' => $question->_id,
                    'answer_text' => $a['answer_text'],
                    'is_correct' => $a['is_correct']
                ]);
            }
        }

        return $quiz->load('questions.answers');
    }
}