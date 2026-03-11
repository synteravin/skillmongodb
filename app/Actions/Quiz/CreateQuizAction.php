<?php

namespace App\Actions\Quiz;

use App\Models\Quiz;

class CreateQuizAction
{

    public function execute(array $data): Quiz
    {

        return Quiz::create([

            'module_id' => $data['module_id'],

            'difficulty' => $data['difficulty'] ?? 'easy'

        ]);

    }

}