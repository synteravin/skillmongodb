<?php

namespace App\Enums;

enum QuestIssueCategory: string
{
    case BREACH_OF_DEADLINE = 'breach_of_deadline';
    case SCOPE_DISPUTE = 'scope_dispute';
    case QUALITY_OR_DEFECT = 'quality_or_defect';
    case NON_PAYMENT = 'non_payment';
    case MISCONDUCT_OR_FRAUD = 'misconduct_or_fraud';
    case MUTUAL_CANCELLATION = 'mutual_cancellation';

    public function label(): string
    {
        return match ($this) {
            self::BREACH_OF_DEADLINE => 'Keterlambatan Fatal / Gagal Memenuhi Tenggat Waktu',
            self::SCOPE_DISPUTE => 'Perbedaan Penafsiran Lingkup Tugas (Scope Creep)',
            self::QUALITY_OR_DEFECT => 'Hasil Kerja Cacat / Tidak Sesuai Standar / Plagiarisme',
            self::NON_PAYMENT => 'Penolakan Persetujuan / Pelunasan Tanpa Alasan Sah',
            self::MISCONDUCT_OR_FRAUD => 'Pelanggaran Etika / Bukti Transfer Palsu / Penipuan',
            self::MUTUAL_CANCELLATION => 'Pembatalan Kesepakatan Bersama',
        };
    }
}
