<?php

namespace App\Actions\Quiz;

use App\Models\Quiz;
use App\Models\QuizAnswer;
use App\Models\QuizQuestion;

class DeleteQuizAction
{
    public function execute(Quiz $quiz)
    {
        $questions = QuizQuestion::where('quiz_id', $quiz->_id)->pluck('_id');

        QuizAnswer::whereIn('question_id', $questions)->delete();
        QuizQuestion::where('quiz_id', $quiz->_id)->delete();

        $quiz->delete();
    }
}
