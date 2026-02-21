<?php

namespace App\Services\Character;

use App\Models\User;
use App\Models\Character;
use Illuminate\Validation\ValidationException;

class AssignCharacterToUser
{
    public function execute(User $user, string $characterId): void
    {
        // 1️⃣ Hanya student yang boleh pilih
        if (! $user->isStudent()) {
            throw ValidationException::withMessages([
                'user' => 'Only student can choose character',
            ]);
        }

        // 2️⃣ Sudah punya character? Stop (idempotent)
        if ($user->hasCharacter()) {
            return;
        }

        // 3️⃣ Pastikan character valid
        $character = Character::find($characterId);

        if (! $character) {
            throw ValidationException::withMessages([
                'character_id' => 'Character not found',
            ]);
        }

        // 4️⃣ Simpan langsung ke user (Mongo way)
        $user->update([
            'character_id' => $character->_id,
        ]);
    }
}
