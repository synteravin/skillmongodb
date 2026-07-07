<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Http\Requests\Quest\StoreQuestBidRequest;
use App\Http\Requests\Quest\StoreQuestRequest;
use App\Models\Quest;
use App\Models\QuestBid;
use App\Models\QuestMessage;
use App\Models\UserStat;
use App\Services\Quest\QuestService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class QuestController extends Controller
{
    public function __construct(protected QuestService $questService) {}

    /**
     * Display a listing of the quests.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        $status = $request->input('status');

        $quests = $this->questService->listQuests($search, $status);
        $historyQuests = $this->questService->getStudentQuestHistory($request->user());

        return Inertia::render('Student/Quests/Index', [
            'quests' => $quests,
            'historyQuests' => $historyQuests,
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
        ]);
    }

    /**
     * Show the form for creating a new quest.
     */
    public function create()
    {
        return Inertia::render('Student/Quests/Create');
    }

    /**
     * Store a newly created quest in storage.
     */
    public function store(StoreQuestRequest $request)
    {
        $data = $request->validated();

        $images = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                if ($image->isValid()) {
                    $path = $image->store('quests/images', 's3');
                    $images[] = [
                        'path' => $path,
                        'name' => $image->getClientOriginalName(),
                    ];
                }
            }
        }

        $files = [];
        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                if ($file->isValid()) {
                    $path = $file->store('quests/files', 's3');
                    $files[] = [
                        'path' => $path,
                        'name' => $file->getClientOriginalName(),
                        'size' => $file->getSize(),
                    ];
                }
            }
        }

        $data['images'] = $images;
        $data['files'] = $files;

        $quest = $this->questService->createQuest(
            $request->user(),
            $data
        );

        return redirect()->route('student.quests.show', $quest->_id)
            ->with('success', 'Quest berhasil dipublikasikan!');
    }

    /**
     * Display the specified quest details.
     */
    public function show(string $id)
    {
        $user = auth()->user();
        $details = $this->questService->getQuestDetails($id, $user);

        $quest = Quest::findOrFail($id);

        // Check if user has already placed a bid
        $myBid = null;
        if ($user->isStudent()) {
            $bidRecord = QuestBid::where('quest_id', $quest->_id)
                ->where('student_id', $user->_id)
                ->first();

            if ($bidRecord) {
                $unreadCount = QuestMessage::where('quest_bid_id', $bidRecord->_id)
                    ->where('sender_id', '!=', $user->_id)
                    ->where('read_by', '!=', $user->_id)
                    ->count();

                $myBid = [
                    '_id' => (string) $bidRecord->_id,
                    'bid_amount' => $bidRecord->bid_amount,
                    'cv' => $bidRecord->cv,
                    'portfolio' => $bidRecord->portfolio,
                    'proposal' => $bidRecord->proposal,
                    'status' => $bidRecord->status,
                    'created_at' => $bidRecord->created_at->toISOString(),
                    'unread_messages_count' => $unreadCount,
                ];
            }
        }

        // Authorizations to pass to frontend
        $canBid = Gate::allows('bid', $quest);
        $canAccept = Gate::allows('acceptBid', $quest);

        return Inertia::render('Student/Quests/Show', [
            'quest' => $details['quest'],
            'bids' => $details['bids'],
            'myBid' => $myBid,
            'can' => [
                'bid' => $canBid,
                'accept' => $canAccept,
            ],
        ]);
    }

    /**
     * Submit a bid/application for a quest.
     */
    public function storeBid(StoreQuestBidRequest $request, Quest $quest)
    {
        Gate::authorize('bid', $quest);

        $this->questService->placeBid(
            $request->user(),
            $quest,
            $request->validated()
        );

        return redirect()->route('student.quests.show', $quest->_id)
            ->with('success', 'Tawaran Anda berhasil diajukan!');
    }

    /**
     * Accept a bid for a quest.
     */
    public function acceptBid(Request $request, Quest $quest, QuestBid $bid)
    {
        Gate::authorize('acceptBid', $quest);

        $this->questService->acceptBid(
            $request->user(),
            $quest,
            $bid->_id
        );

        return redirect()->route('student.quests.show', $quest->_id)
            ->with('success', 'Pekerja berhasil dipilih dan Quest dimulai!');
    }

    /**
     * Submit completed work for the quest.
     */
    public function submitWork(Request $request, Quest $quest)
    {
        $user = $request->user();

        // Must be the chosen worker
        if ($quest->worker_id !== $user->_id) {
            abort(403, 'Hanya pekerja terpilih yang dapat mengirimkan hasil pekerjaan.');
        }

        // Must be ongoing
        if ($quest->status !== 'ongoing') {
            abort(400, 'Hasil pekerjaan hanya dapat dikirimkan jika status quest sedang berjalan.');
        }

        $request->validate([
            'submission_file' => 'required|file|mimes:zip|max:51200',
            'submission_link' => 'nullable|url',
            'submission_note' => 'nullable|string|max:1000',
        ], [
            'submission_file.required' => 'Berkas pekerjaan (ZIP) wajib diunggah.',
            'submission_file.file' => 'Berkas pengiriman harus berupa file valid.',
            'submission_file.mimes' => 'Berkas pengiriman harus berformat ZIP.',
            'submission_file.max' => 'Ukuran berkas pengiriman maksimal adalah 50MB.',
            'submission_link.url' => 'Format link harus berupa URL valid.',
        ]);

        $submissionFile = null;
        if ($request->hasFile('submission_file')) {
            // Delete old ZIP if exists
            if ($quest->submission_file && isset($quest->submission_file['path'])) {
                Storage::disk('s3')->delete($quest->submission_file['path']);
            }

            $file = $request->file('submission_file');
            $originalName = $file->getClientOriginalName();
            $path = $file->store('quests/deliverables', 's3');
            $size = $file->getSize();

            $submissionFile = [
                'name' => $originalName,
                'path' => $path,
                'size' => $size,
            ];
        }

        $quest->update([
            'submission_file' => $submissionFile,
            'submission_link' => $request->submission_link,
            'submission_note' => $request->submission_note,
            'submitted_at' => now(),
            'status' => 'submitted',
        ]);

        return redirect()->route('student.quests.show', $quest->_id)
            ->with('success', 'Hasil pekerjaan (ZIP) berhasil dikirim dan menunggu tinjauan!');
    }

    public function approveWork(Request $request, Quest $quest)
    {
        $user = $request->user();

        // Must be creator or admin
        if ($quest->creator_id !== $user->_id && ! $user->isAdmin()) {
            abort(403, 'Hanya pembuat quest atau admin yang dapat menyetujui hasil pekerjaan.');
        }

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

        $quest->update([
            'completed_at' => now(),
            'status' => 'completed',
            'rating' => (int) $request->rating,
            'rating_comment' => $request->rating_comment,
            'revision_note' => null, // clear any past revision note
        ]);

        // Award gamification rewards to worker (Student)
        if ($quest->worker_id) {
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

        return redirect()->route('student.quests.show', $quest->_id)
            ->with('success', 'Pekerjaan disetujui! Quest selesai dan hadiah telah ditambahkan ke profil pekerja.');
    }

    /**
     * Reject submission and request revision.
     */
    public function rejectWork(Request $request, Quest $quest)
    {
        $user = $request->user();

        // Must be creator or admin
        if ($quest->creator_id !== $user->_id && ! $user->isAdmin()) {
            abort(403, 'Hanya pembuat quest atau admin yang dapat meminta revisi.');
        }

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

        return redirect()->route('student.quests.show', $quest->_id)
            ->with('warning', 'Pekerjaan ditolak dan revisi diminta dari pekerja.');
    }
}
