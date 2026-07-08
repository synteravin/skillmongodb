<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Quest\StoreQuestRequest;
use App\Models\Quest;
use App\Models\QuestBid;
use App\Models\QuestMessage;
use App\Models\UserStat;
use App\Services\Quest\QuestService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class QuestController extends Controller
{
    public function index(Request $request)
    {
        $quests = Quest::with(['creator', 'worker'])->latest()->get()->map(function ($quest) {
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
            ];
        });

        return Inertia::render('Admin/Quests/Index', [
            'quests' => $quests,
        ]);
    }

    public function store(StoreQuestRequest $request)
    {
        $data = $request->validated();

        Quest::create([
            'title' => $data['title'],
            'description' => $data['description'],
            'min_salary' => (int) $data['min_salary'],
            'max_salary' => (int) $data['max_salary'],
            'deadline' => now()->parse($data['deadline']),
            'status' => 'open',
            'creator_id' => auth()->id(),
        ]);

        return redirect()->route('admin.quests.index')->with('success', 'Quest berhasil dibuat!');
    }

    public function show(string $id)
    {
        $quest = Quest::with(['creator', 'worker'])->findOrFail($id);
        $user = auth()->user();

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
            ],
            'bids' => $bids,
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

        $quest->update([
            'title' => $data['title'],
            'description' => $data['description'],
            'min_salary' => (int) $data['min_salary'],
            'max_salary' => (int) $data['max_salary'],
            'deadline' => now()->parse($data['deadline']),
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

    public function approveWork(Request $request, string $questId)
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
            $progress = UserStat::firstOrCreate([
                'user_id' => $quest->worker_id,
                'course_id' => 'quest_rewards',
            ], [
                'completed_modules' => [],
                'completed_paths' => [],
                'exp' => 0,
                'gold' => 0,
                'erp' => 0,
                'level' => 1,
                'path_stats' => [],
            ]);

            $pathStats = $progress->path_stats ?? [];
            if (is_string($pathStats)) {
                $pathStats = json_decode($pathStats, true) ?: [];
            } else {
                $pathStats = (array) $pathStats;
            }

            $questKey = (string) $quest->_id;
            $pathStats[$questKey] = [
                'exp' => 250,
                'gold' => 150,
                'quiz_score' => 100,
            ];

            $progress->path_stats = $pathStats;
            $progress->save();
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

        $quest->update([
            'status' => 'ongoing',
            'revision_note' => $request->revision_note,
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
}
