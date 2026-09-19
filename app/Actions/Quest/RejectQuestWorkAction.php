<?php

namespace App\Actions\Quest;

use App\Models\Quest;
use App\Models\User;

class RejectQuestWorkAction
{
    public function __construct(
        protected RequestQuestRevisionAction $requestQuestRevisionAction
    ) {}

    /**
     * Execute rejection/revision request of submitted work by creator or admin.
     *
     * @param  array{revision_note: string}  $data
     */
    public function execute(User $actor, Quest $quest, array $data): Quest
    {
        return $this->requestQuestRevisionAction->execute($actor, $quest, $data);
    }
}
