<?php

namespace App\Actions\Quiz;

use App\Models\Quiz;
use App\Models\QuizAnswer;
use App\Models\QuizQuestion;

class UpdateQuizAction
{
    public function execute(Quiz $quiz, array $data)
    {
        $quiz->update([
            'difficulty' => $data['difficulty'],
        ]);

        $oldQuestions = QuizQuestion::where('quiz_id', $quiz->_id)->get();
        foreach ($oldQuestions as $q) {
            if (isset($q->media_path)) {
                \Illuminate\Support\Facades\Storage::disk('s3')->delete($q->media_path);
            } elseif ($q->media_url && !str_starts_with($q->media_url, 'http')) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($q->media_url);
            }
        }
        QuizQuestion::where('quiz_id', $quiz->_id)->delete();

        foreach ($data['questions'] as $qIndex => $q) {

            $question = QuizQuestion::create([
                'quiz_id' => $quiz->_id,
                'question_text' => $q['question_text'],
                'order' => $qIndex + 1,
            ]);

            foreach ($q['answers'] as $a) {
                QuizAnswer::create([
                    'question_id' => $question->_id,
                    'answer_text' => $a['answer_text'],
                    'is_correct' => $a['is_correct'],
                ]);
            }
        }

        return $quiz->load('questions.answers');
    }
}
