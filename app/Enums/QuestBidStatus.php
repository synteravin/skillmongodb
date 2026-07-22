<?php

namespace App\Enums;

enum QuestBidStatus: string
{
    case PENDING = 'pending';
    case ACCEPTED = 'accepted';
    case REJECTED = 'rejected';

    public function label(): string
    {
        return match ($this) {
            self::PENDING => 'Menunggu Keputusan',
            self::ACCEPTED => 'Diterima',
            self::REJECTED => 'Ditolak',
        };
    }
}
