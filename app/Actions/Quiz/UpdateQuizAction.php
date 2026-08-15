<?php

namespace App\Actions\Quiz;

use App\Models\Quiz;
use App\Models\QuizAnswer;
use App\Models\QuizQuestion;
use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Support\Facades\Storage;

class UpdateQuizAction
{
    public function execute(Quiz $quiz, array $data)
    {
        $quiz->update([
            'difficulty' => $data['difficulty'],
            'duration' => isset($data['duration']) ? (int) $data['duration'] : ($quiz->duration ?? 15),
        ]);

        $newQuestionIds = [];

        foreach ($data['questions'] as $qIndex => $q) {
            $questionId = $q['id'] ?? null;

            $mediaPath = null;
            $mediaUrl = null;

            // 1. Check if a new file is uploaded
            if (request()->hasFile("questions.$qIndex.media")) {
                $file = request()->file("questions.$qIndex.media");
                $mediaS3Path = $file->store('quiz-images', 's3');
                /** @var FilesystemAdapter $disk */
                $disk = Storage::disk('s3');
                $mediaUrl = $disk->url($mediaS3Path);
                $mediaPath = $mediaS3Path;

                // Delete old media file if it exists
                if ($questionId) {
                    $oldQ = QuizQuestion::find($questionId);
                    if ($oldQ && $oldQ->media_path) {
                        Storage::disk('s3')->delete($oldQ->media_path);
                    }
                }
            }
            // 2. Otherwise, check if we are preserving the existing image
            elseif (! empty($q['media_url'])) {
                $mediaUrl = $q['media_url'];
                if ($questionId) {
                    $oldQ = QuizQuestion::find($questionId);
                    if ($oldQ) {
                        $mediaPath = $oldQ->media_path;
                        $mediaUrl = $oldQ->media_url;
                    }
                }
            }
            // 3. Otherwise (image was deleted or never existed)
            else {
                if ($questionId) {
                    $oldQ = QuizQuestion::find($questionId);
                    if ($oldQ && $oldQ->media_path) {
                        Storage::disk('s3')->delete($oldQ->media_path);
                    }
                }
            }

            if ($questionId) {
                $question = QuizQuestion::find($questionId);
                if ($question) {
                    $question->update([
                        'question_text' => $q['question_text'],
                        'explanation' => $q['explanation'] ?? null,
                        'media_url' => $mediaUrl,
                        'media_path' => $mediaPath,
                        'order' => $qIndex + 1,
                    ]);
                } else {
                    $question = QuizQuestion::create([
                        'quiz_id' => (string) $quiz->_id,
                        'question_text' => $q['question_text'],
                        'explanation' => $q['explanation'] ?? null,
                        'media_url' => $mediaUrl,
                        'media_path' => $mediaPath,
                        'order' => $qIndex + 1,
                    ]);
                }
            } else {
                $question = QuizQuestion::create([
                    'quiz_id' => (string) $quiz->_id,
                    'question_text' => $q['question_text'],
                    'explanation' => $q['explanation'] ?? null,
                    'media_url' => $mediaUrl,
                    'media_path' => $mediaPath,
                    'order' => $qIndex + 1,
                ]);
            }

            $newQuestionIds[] = (string) $question->_id;

            // Preserve or update answers for this question
            $newAnswerIds = [];
            foreach ($q['answers'] as $a) {
                $ansId = $a['id'] ?? null;
                if ($ansId) {
                    $ans = QuizAnswer::find($ansId);
                    if ($ans) {
                        $ans->update([
                            'answer_text' => $a['answer_text'],
                            'is_correct' => (bool) $a['is_correct'],
                        ]);
                        $newAnswerIds[] = (string) $ans->_id;

                        continue;
                    }
                }

                $createdAns = QuizAnswer::create([
                    'question_id' => (string) $question->_id,
                    'answer_text' => $a['answer_text'],
                    'is_correct' => (bool) $a['is_correct'],
                ]);
                $newAnswerIds[] = (string) $createdAns->_id;
            }

            // Delete removed answers
            QuizAnswer::where('question_id', (string) $question->_id)
                ->whereNotIn('_id', $newAnswerIds)
                ->delete();
        }

        // Delete any old questions that were removed
        $oldQuestions = QuizQuestion::where('quiz_id', $quiz->_id)->get();
        foreach ($oldQuestions as $oq) {
            if (! in_array((string) $oq->_id, $newQuestionIds)) {
                if ($oq->media_path) {
                    Storage::disk('s3')->delete($oq->media_path);
                }
                QuizAnswer::where('question_id', (string) $oq->_id)->delete();
                $oq->delete();
            }
        }

        return $quiz->load('questions.answers');
    }
}
