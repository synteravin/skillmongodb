<?php

namespace App\Enums;

enum DisputeStatus: string
{
    case PENDING = 'pending';
    case RESOLVED_APPROVED = 'resolved_approved';
    case RESOLVED_REFUNDED = 'resolved_refunded';
    case RESOLVED_SPLIT = 'resolved_split';
    case RESOLVED_CANCELLED = 'resolved_cancelled';

    public function label(): string
    {
        return match ($this) {
            self::PENDING => 'Menunggu Arbitrase Admin',
            self::RESOLVED_APPROVED => 'Disetujui (Pelunasan Hak Pekerja)',
            self::RESOLVED_REFUNDED => 'Pembatalan Kontrak & Restitusi ke Pembuat Quest',
            self::RESOLVED_SPLIT => 'Kesepakatan Damai Pembagian Hak (Prorata P2P)',
            self::RESOLVED_CANCELLED => 'Dibatalkan',
        };
    }
}
