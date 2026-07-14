<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Quest\ResolveArbitrationRequest;
use App\Http\Requests\Quest\StoreQuestRequest;
use App\Models\Quest;
use App\Models\QuestBid;
use App\Models\QuestFlag;
use App\Models\QuestMessage;
use App\Models\QuestTransaction;
use App\Services\Quest\QuestService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class QuestController extends Controller
{
    public function index(Request $request)
    {
        $rawQuests = Quest::with(['creator', 'worker'])->latest()->get();
        $acceptedBids = QuestBid::where('status', 'accepted')
            ->whereIn('quest_id', $rawQuests->pluck('_id')->toArray())
            ->get()
            ->keyBy('quest_id');

        $quests = $rawQuests->map(function ($quest) use ($acceptedBids) {
            $acceptedBid = $acceptedBids->get($quest->_id);

            return [
                '_id' => (string) $quest->_id,
                'title' => $quest->title,
                'description' => $quest->description,
                'min_salary' => $quest->min_salary,
                'max_salary' => $quest->max_salary,
                'deadline' => $quest->deadline->toISOString(),
                'status' => $quest->status,
                'creator' => [
                    'name' => $quest->creator?->name ?? 'Unknown',
                    'role' => $quest->creator?->role ?? 'unknown',
                ],
                'worker' => $quest->worker ? [
                    'name' => $quest->worker->name,
                ] : null,
                'bids_count' => QuestBid::where('quest_id', $quest->_id)->count(),
                'accepted_bid_amount' => $acceptedBid ? (int) $acceptedBid->bid_amount : null,
            ];
        });

        return Inertia::render('Admin/Quests/Index', [
            'quests' => $quests,
        ]);
    }

    public function store(StoreQuestRequest $request)
    {
        $data = $request->validated();

        $maxSalary = (int) $data['max_salary'];
        if ($maxSalary >= 10000000) {
            $tier = 'S';
        } elseif ($maxSalary >= 5000000) {
            $tier = 'A';
        } elseif ($maxSalary >= 2500000) {
            $tier = 'B';
        } elseif ($maxSalary >= 1000000) {
            $tier = 'C';
        } else {
            $tier = 'D';
        }

        Quest::create([
            'title' => $data['title'],
            'description' => $data['description'],
            'min_salary' => (int) $data['min_salary'],
            'max_salary' => (int) $data['max_salary'],
            'deadline' => now()->parse($data['deadline']),
            'status' => 'open',
            'creator_id' => auth()->id(),
            'tier' => $tier,
        ]);

        return redirect()->route('admin.quests.index')->with('success', 'Quest berhasil dibuat!');
    }

    public function show(string $id, QuestService $questService)
    {
        $quest = Quest::with(['creator', 'worker'])->findOrFail($id);
        $user = auth()->user();

        $rewards = $questService->getRewardsForQuest($quest);

        $bids = QuestBid::with('student')
            ->where('quest_id', $id)
            ->latest()
            ->get()
            ->map(function ($bid) use ($user) {
                $unreadCount = QuestMessage::where('quest_bid_id', $bid->_id)
                    ->where('sender_id', '!=', $user->_id)
                    ->where('read_by', '!=', $user->_id)
                    ->count();

                return [
                    '_id' => (string) $bid->_id,
                    'bid_amount' => $bid->bid_amount,
                    'cv' => $bid->cv,
                    'portfolio' => $bid->portfolio,
                    'proposal' => $bid->proposal,
                    'status' => $bid->status,
                    'created_at' => $bid->created_at->toISOString(),
                    'student' => [
                        '_id' => (string) ($bid->student?->_id ?? ''),
                        'name' => $bid->student?->name ?? 'Deleted User',
                        'email' => $bid->student?->email ?? '',
                    ],
                    'unread_messages_count' => $unreadCount,
                ];
            });

        $disk = Storage::disk('s3');
        $resolvedImages = array_map(function ($img) use ($disk) {
            return [
                'name' => $img['name'] ?? 'image.jpg',
                'url' => $disk->url($img['path']),
            ];
        }, $quest->images ?? []);

        $resolvedFiles = array_map(function ($file) use ($disk) {
            return [
                'name' => $file['name'] ?? 'file.dat',
                'url' => $disk->url($file['path']),
                'size' => $file['size'] ?? 0,
            ];
        }, $quest->files ?? []);

        $resolvedSubmissionFile = null;
        if ($quest->submission_file) {
            $resolvedSubmissionFile = [
                'name' => $quest->submission_file['name'] ?? 'deliverable.zip',
                'url' => $disk->url($quest->submission_file['path']),
                'size' => $quest->submission_file['size'] ?? 0,
            ];
        }

        $resolvedSubmissionHistory = array_map(function ($sub) use ($disk) {
            return [
                'version' => $sub['version'] ?? 1,
                'submitted_at' => $sub['submitted_at'] ?? null,
                'submission_link' => $sub['submission_link'] ?? null,
                'submission_note' => $sub['submission_note'] ?? null,
                'submission_file' => isset($sub['submission_file']['path']) ? [
                    'name' => $sub['submission_file']['name'] ?? 'deliverable.zip',
                    'url' => $disk->url($sub['submission_file']['path']),
                    'size' => $sub['submission_file']['size'] ?? 0,
                ] : null,
            ];
        }, $quest->submission_history ?? []);

        $transactions = QuestTransaction::with('user')
            ->where('quest_id', $id)
            ->latest()
            ->get()
            ->map(function ($t) {
                return [
                    '_id' => (string) $t->_id,
                    'amount' => $t->amount,
                    'type' => $t->type,
                    'description' => $t->description,
                    'created_at' => $t->created_at->toISOString(),
                    'user' => $t->user ? [
                        'name' => $t->user->name,
                    ] : null,
                ];
            });

        $acceptedBid = QuestBid::where('quest_id', $quest->_id)->where('status', 'accepted')->first();
        $acceptedBidAmount = $acceptedBid ? (int) $acceptedBid->bid_amount : null;

        return Inertia::render('Admin/Quests/Show', [
            'quest' => [
                '_id' => (string) $quest->_id,
                'title' => $quest->title,
                'description' => $quest->description,
                'min_salary' => $quest->min_salary,
                'max_salary' => $quest->max_salary,
                'deadline' => $quest->deadline->toISOString(),
                'status' => $quest->status,
                'creator_id' => $quest->creator_id,
                'creator' => [
                    'name' => $quest->creator?->name ?? 'Unknown',
                ],
                'worker' => $quest->worker ? [
                    'name' => $quest->worker->name,
                    'email' => $quest->worker->email,
                ] : null,
                'worker_id' => $quest->worker_id,
                'submission_link' => $quest->submission_link,
                'submission_note' => $quest->submission_note,
                'submitted_at' => $quest->submitted_at ? $quest->submitted_at->toISOString() : null,
                'completed_at' => $quest->completed_at ? $quest->completed_at->toISOString() : null,
                'revision_note' => $quest->revision_note,
                'rating' => $quest->rating,
                'rating_comment' => $quest->rating_comment,
                'images' => $resolvedImages,
                'files' => $resolvedFiles,
                'submission_file' => $resolvedSubmissionFile,
                'tier' => $quest->tier ?? 'C',
                'custom_rewards' => $quest->custom_rewards,
                'dispute' => $questService->resolveDispute($quest),
                'submission_history' => $resolvedSubmissionHistory,
                'rewards' => $rewards,
                'accepted_bid_amount' => $acceptedBidAmount,
            ],
            'bids' => $bids,
            'transactions' => $transactions,
        ]);
    }

    public function update(Request $request, string $id)
    {
        $quest = Quest::findOrFail($id);

        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'min_salary' => ['required', 'integer', 'min:0'],
            'max_salary' => ['required', 'integer', 'gte:min_salary'],
            'deadline' => ['required', 'date'],
        ], [
            'max_salary.gte' => 'Gaji maksimal harus lebih besar atau sama dengan gaji minimal.',
        ]);

        $maxSalary = (int) $data['max_salary'];
        $minSalary = (int) $data['min_salary'];
        if ($maxSalary >= 10000000) {
            $tier = 'S';
        } elseif ($maxSalary >= 5000000) {
            $tier = 'A';
        } elseif ($maxSalary >= 2500000) {
            $tier = 'B';
        } elseif ($maxSalary >= 1000000) {
            $tier = 'C';
        } else {
            $tier = 'D';
        }

        $avgBudget = ($minSalary + $maxSalary) / 2;

        $exp = (int) min(1000, max(100, round(100 + $avgBudget * 0.0001)));
        $gold = (int) min(500, max(50, round(50 + $maxSalary * 0.00005)));
        $erp = (int) min(200, max(20, round(20 + $avgBudget * 0.00002)));

        $calculatedRewards = [
            'exp' => $exp,
            'gold' => $gold,
            'erp' => $erp,
        ];

        if ($quest->custom_rewards) {
            $calculatedRewards = [
                'exp' => (int) ($quest->custom_rewards['exp'] ?? $calculatedRewards['exp']),
                'gold' => (int) ($quest->custom_rewards['gold'] ?? $calculatedRewards['gold']),
                'erp' => (int) ($quest->custom_rewards['erp'] ?? $calculatedRewards['erp']),
            ];
        }

        $quest->update([
            'title' => $data['title'],
            'description' => $data['description'],
            'min_salary' => $minSalary,
            'max_salary' => $maxSalary,
            'deadline' => now()->parse($data['deadline']),
            'tier' => $tier,
            'rewards' => $calculatedRewards,
        ]);

        return redirect()->route('admin.quests.index')->with('success', 'Quest berhasil diupdate!');
    }

    public function destroy(string $id)
    {
        $quest = Quest::findOrFail($id);

        // Delete associated bids
        QuestBid::where('quest_id', $quest->_id)->delete();

        $quest->delete();

        return redirect()->route('admin.quests.index')->with('success', 'Quest dan penawaran terkait berhasil dihapus!');
    }

    public function destroyBid(string $questId, string $bidId)
    {
        $bid = QuestBid::findOrFail($bidId);
        $bid->delete();

        return back()->with('success', 'Penawaran berhasil dihapus!');
    }

    public function acceptBid(Request $request, string $questId, string $bidId, QuestService $questService)
    {
        $quest = Quest::findOrFail($questId);
        $bid = QuestBid::findOrFail($bidId);

        $questService->acceptBid(
            $request->user(),
            $quest,
            $bid->_id
        );

        return redirect()->route('admin.quests.show', $quest->_id)
            ->with('success', 'Pekerja berhasil dipilih oleh Admin!');
    }

    public function approveWork(Request $request, string $questId, QuestService $questService)
    {
        $quest = Quest::findOrFail($questId);

        if ($quest->status !== 'submitted') {
            abort(400, 'Quest harus dalam status menunggu tinjauan.');
        }

        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'rating_comment' => 'nullable|string|max:1000',
        ], [
            'rating.required' => 'Rating bintang wajib dipilih.',
            'rating.integer' => 'Rating harus berupa angka.',
            'rating.min' => 'Rating minimal 1 bintang.',
            'rating.max' => 'Rating maksimal 5 bintang.',
        ]);

        $hasFile = $quest->submission_file && isset($quest->submission_file['path']);
        $newStatus = $hasFile ? 'completed' : 'approved';

        $updateData = [
            'status' => $newStatus,
            'rating' => (int) $request->rating,
            'rating_comment' => $request->rating_comment,
            'revision_note' => null,
        ];

        if ($hasFile) {
            $updateData['completed_at'] = now();
        }

        $quest->update($updateData);

        if ($hasFile && $quest->worker_id) {
            $questService->awardQuestRewards($quest, $quest->worker_id);
        }

        $msg = $hasFile
            ? 'Pekerjaaan disetujui oleh Admin! Quest selesai dan hadiah telah ditambahkan ke profil pekerja.'
            : 'Pekerjaaan disetujui oleh Admin! Status menjadi disetujui, menunggu pekerja mengunggah berkas ZIP final untuk menyelesaikan quest.';

        return redirect()->route('admin.quests.show', $quest->_id)
            ->with($hasFile ? 'success' : 'warning', $msg);
    }

    public function rejectWork(Request $request, string $questId)
    {
        $quest = Quest::findOrFail($questId);

        if ($quest->status !== 'submitted') {
            abort(400, 'Quest harus dalam status menunggu tinjauan.');
        }

        $request->validate([
            'revision_note' => 'required|string|max:1000',
        ], [
            'revision_note.required' => 'Catatan revisi/feedback wajib diisi agar pekerja tahu apa yang perlu diperbaiki.',
        ]);

        $user = $request->user();
        $revisions = $quest->revisions ?? [];
        $revisions[] = [
            'note' => $request->revision_note,
            'created_at' => now()->toIso8601String(),
            'author_id' => (string) $user->_id,
            'author_name' => $user->name,
        ];

        $quest->update([
            'status' => 'ongoing',
            'revision_note' => $request->revision_note,
            'revisions' => $revisions,
        ]);

        return redirect()->route('admin.quests.show', $quest->_id)
            ->with('warning', 'Pekerjaan ditolak oleh Admin dan revisi diminta dari pekerja.');
    }

    /**
     * Approve a quest post, publishing it to the public quest board.
     */
    public function approvePost(Request $request, string $questId)
    {
        $quest = Quest::findOrFail($questId);

        if ($quest->status !== 'draft') {
            abort(400, 'Hanya quest berstatus draft yang dapat disetujui.');
        }

        $quest->update([
            'status' => 'open',
            'rejection_note' => null,
        ]);

        return redirect()->route('admin.quests.show', $quest->_id)
            ->with('success', 'Quest berhasil disetujui dan dipublikasikan!');
    }

    /**
     * Reject a quest post, giving feedback to the creator.
     */
    public function rejectPost(Request $request, string $questId)
    {
        $quest = Quest::findOrFail($questId);

        if ($quest->status !== 'draft') {
            abort(400, 'Hanya quest berstatus draft yang dapat ditolak.');
        }

        $request->validate([
            'rejection_note' => 'required|string|max:1000',
        ], [
            'rejection_note.required' => 'Catatan penolakan wajib diisi.',
        ]);

        $quest->update([
            'status' => 'rejected',
            'rejection_note' => $request->rejection_note,
        ]);

        return redirect()->route('admin.quests.show', $quest->_id)
            ->with('warning', 'Quest ditolak dan catatan penolakan telah dikirimkan ke pembuat.');
    }

    /**
     * Resolve arbitration for disputed quests.
     */
    public function arbitrate(ResolveArbitrationRequest $request, string $questId, QuestService $questService)
    {
        $quest = Quest::findOrFail($questId);

        $ruling = $request->ruling;
        if ($ruling === 'refund') {
            $ruling = 'refund_creator';
        } elseif ($ruling === 'pay_worker') {
            $ruling = 'release_payout';
        }

        $questService->resolveArbitration($quest, $ruling, $request->note, $request->split_percentage);

        return redirect()->route('admin.quests.show', $quest->_id)
            ->with('success', 'Arbitrase berhasil diselesaikan oleh Admin!');
    }

    /**
     * Force cancel a quest and refund escrow.
     */
    public function forceCancel(Request $request, string $questId, QuestService $questService)
    {
        $quest = Quest::findOrFail($questId);

        $dispute = $quest->dispute;
        if ($dispute && isset($dispute['status']) && $dispute['status'] === 'pending') {
            $dispute['status'] = 'resolved_cancelled';
            $dispute['ruling'] = 'refund';
            $dispute['note'] = 'Quest dibatalkan secara paksa oleh Admin.';
            $dispute['resolved_at'] = now()->toIso8601String();
            $dispute['ruled_at'] = now()->toIso8601String();
        }

        $quest->update([
            'status' => 'cancelled',
            'completed_at' => now(),
            'dispute' => $dispute,
        ]);

        return redirect()->route('admin.quests.show', $quest->_id)
            ->with('success', 'Quest berhasil dibatalkan secara paksa oleh Admin!');
    }

    /**
     * Extend quest deadline.
     */
    public function extendDeadline(Request $request, string $questId)
    {
        $quest = Quest::findOrFail($questId);

        $request->validate([
            'deadline' => ['required', 'date', 'after:now'],
        ], [
            'deadline.required' => 'Tanggal deadline wajib diisi.',
            'deadline.after' => 'Tanggal deadline harus berupa tanggal di masa depan.',
        ]);

        $updateData = [
            'deadline' => now()->parse($request->deadline),
        ];

        if ($quest->status === 'expired') {
            $updateData['status'] = empty($quest->worker_id) ? 'open' : 'ongoing';
        }

        $quest->update($updateData);

        return redirect()->route('admin.quests.show', $quest->_id)
            ->with('success', 'Tenggat waktu pengerjaan berhasil diperpanjang!');
    }

    /**
     * Reopen bidding for a quest.
     */
    public function reopenBidding(Request $request, string $questId, QuestService $questService)
    {
        $quest = Quest::findOrFail($questId);

        $acceptedBid = QuestBid::where('quest_id', $quest->_id)->where('status', 'accepted')->first();
        if ($acceptedBid) {
            $acceptedBid->update(['status' => 'rejected']);
        }

        $quest->update([
            'status' => 'open',
            'worker_id' => null,
            'submission_link' => null,
            'submission_note' => null,
            'submitted_at' => null,
            'completed_at' => null,
            'revision_note' => null,
            'submission_file' => null,
            'dispute' => null,
        ]);

        return redirect()->route('admin.quests.show', $quest->_id)
            ->with('success', 'Bidding quest berhasil dibuka kembali oleh Admin!');
    }

    /**
     * View moderation flag queue.
     */
    public function flagQueue(Request $request)
    {
        $flags = QuestFlag::with(['reporter', 'reportedUser', 'quest'])->latest()->get()->map(function ($flag) {
            return [
                '_id' => (string) $flag->_id,
                'reason' => $flag->reason,
                'details' => $flag->details,
                'status' => $flag->status,
                'action_taken' => $flag->action_taken,
                'created_at' => $flag->created_at->toISOString(),
                'reporter' => $flag->reporter ? [
                    'name' => $flag->reporter->name,
                    'email' => $flag->reporter->email,
                ] : null,
                'reported_user' => $flag->reportedUser ? [
                    'name' => $flag->reportedUser->name,
                ] : null,
                'quest' => $flag->quest ? [
                    '_id' => (string) $flag->quest->_id,
                    'title' => $flag->quest->title,
                ] : null,
            ];
        });

        return Inertia::render('Admin/Quests/Flags', [
            'flags' => $flags,
        ]);
    }

    /**
     * Resolve flag in queue.
     */
    public function resolveFlag(Request $request, string $flagId)
    {
        $flag = QuestFlag::findOrFail($flagId);

        $request->validate([
            'action_taken' => ['required', 'string', 'max:255'],
        ]);

        $flag->update([
            'status' => 'resolved',
            'action_taken' => $request->action_taken,
        ]);

        return redirect()->route('admin.quests.flags')
            ->with('success', 'Laporan moderasi berhasil diselesaikan!');
    }
}
