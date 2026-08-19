<?php

namespace App\Console\Commands;

use App\Models\Notification;
use App\Models\Quest;
use App\Models\QuestBid;
use App\Models\User;
use Illuminate\Console\Command;

class CheckExpiredQuests extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'quests:check-expiry';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Mencari quest open yang telah melewati tenggat waktu dan mengubah statusnya menjadi expired serta membersihkan tawaran pending.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Memulai pengecekan quest kadaluarsa...');

        $expiredQuests = Quest::where('status', 'open')
            ->where('deadline', '<', now())
            ->get();

        $count = 0;

        foreach ($expiredQuests as $quest) {
            $creatorId = $quest->creator_id;

            // 1. Ubah status quest ke 'expired'
            $quest->status = 'expired';
            $quest->save();

            // 2. Kirim notifikasi ke pembuat quest
            if ($creatorId) {
                Notification::create([
                    'notifiable_type' => User::class,
                    'notifiable_id' => $creatorId,
                    'data' => [
                        'quest_id' => $quest->_id,
                        'title' => $quest->title,
                        'message' => "Quest Anda '{$quest->title}' telah kadaluarsa karena tidak ada pekerja yang dipilih hingga melewati batas tenggat waktu.",
                        'type' => 'quest_expired_creator',
                    ],
                    'read_at' => null,
                ]);
            }

            // 3. Bersihkan penawaran pending dan beri tahu pelamar
            $pendingBids = QuestBid::where('quest_id', $quest->_id)->where('status', 'pending')->get();
            foreach ($pendingBids as $pBid) {
                $pBid->update(['status' => 'rejected']);
                if ($pBid->student_id) {
                    Notification::create([
                        'notifiable_type' => User::class,
                        'notifiable_id' => (string) $pBid->student_id,
                        'data' => [
                            'quest_id' => (string) $quest->_id,
                            'title' => $quest->title,
                            'message' => "Quest '{$quest->title}' telah kadaluarsa melewati batas tenggat waktu.",
                            'type' => 'quest_expired_bidder',
                        ],
                        'read_at' => null,
                    ]);
                }
            }

            $count++;
            $this->info("Quest ID {$quest->_id} ('{$quest->title}') dinyatakan kadaluarsa.");
        }

        $this->info("Pengecekan selesai. Total {$count} quest kadaluarsa diproses.");

        return Command::SUCCESS;
    }
}
