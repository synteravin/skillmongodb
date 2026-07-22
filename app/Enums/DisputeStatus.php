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
            self::RESOLVED_APPROVED => 'Disetujui (Pembayaran ke Pekerja)',
            self::RESOLVED_REFUNDED => 'Pengembalian Dana ke Pembuat Quest',
            self::RESOLVED_SPLIT => 'Pembagian Dana (Split Escrow)',
            self::RESOLVED_CANCELLED => 'Dibatalkan',
        };
    }
}
