<?php

namespace App\Enums;

enum QuestStatus: string
{
    case DRAFT = 'draft';
    case OPEN = 'open';
    case DOWN_PAYMENT = 'down_payment';
    case ONGOING = 'ongoing';
    case SUBMITTED = 'submitted';
    case REVISION = 'revision';
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
            self::DOWN_PAYMENT => 'Pembayaran Awal',
            self::ONGOING => 'Sedang Dikerjakan',
            self::SUBMITTED => 'Menunggu Peninjauan',
            self::REVISION => 'Dalam Perbaikan Revisi',
            self::APPROVED => 'Disetujui',
            self::PAYMENT => 'Pembayaran Akhir',
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
        return in_array($this, [self::DOWN_PAYMENT, self::ONGOING, self::SUBMITTED, self::REVISION, self::APPROVED, self::PAYMENT, self::DELIVERED]);
    }
}
