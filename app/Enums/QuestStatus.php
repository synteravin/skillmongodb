<?php

namespace App\Enums;

enum QuestStatus: string
{
    case DRAFT = 'draft';
    case OPEN = 'open';
    case ONGOING = 'ongoing';
    case SUBMITTED = 'submitted';
    case APPROVED = 'approved';
    case PAYMENT = 'payment';
    case DELIVERED = 'delivered';
    case COMPLETED = 'completed';
    case REJECTED = 'rejected';
    case EXPIRED = 'expired';
    case DISPUTED = 'disputed';
    case CANCELLED = 'cancelled';

    public function label(): string
    {
        return match ($this) {
            self::DRAFT => 'Draf',
            self::OPEN => 'Membuka Penawaran',
            self::ONGOING => 'Sedang Dikerjakan',
            self::SUBMITTED => 'Menunggu Peninjauan',
            self::APPROVED => 'Disetujui',
            self::PAYMENT => 'Menunggu Berkas Final',
            self::DELIVERED => 'Menunggu Konfirmasi Berkas Akhir',
            self::COMPLETED => 'Selesai',
            self::REJECTED => 'Ditolak',
            self::EXPIRED => 'Kadaluarsa',
            self::DISPUTED => 'Dalam Perselisihan',
            self::CANCELLED => 'Dibatalkan',
        };
    }

    public function isBiddable(): bool
    {
        return $this === self::OPEN;
    }

    public function isActive(): bool
    {
        return in_array($this, [self::ONGOING, self::SUBMITTED, self::APPROVED, self::PAYMENT, self::DELIVERED]);
    }
}
