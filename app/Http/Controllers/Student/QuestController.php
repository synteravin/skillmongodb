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

        return Inertia::render('Student/Quests/Index', [
            'quests' => $quests,
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
        $quest = $this->questService->createQuest(
            $request->user(),
            $request->validated()
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
            'submission_link' => 'required|url',
            'submission_note' => 'nullable|string|max:1000',
        ], [
            'submission_link.required' => 'Link hasil pekerjaan wajib diisi.',
            'submission_link.url' => 'Format link harus berupa URL valid.',
        ]);

        $quest->update([
            'submission_link' => $request->submission_link,
            'submission_note' => $request->submission_note,
            'submitted_at' => now(),
            'status' => 'submitted',
        ]);

        return redirect()->route('student.quests.show', $quest->_id)
            ->with('success', 'Hasil pekerjaan berhasil dikirim dan menunggu tinjauan!');
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
            ]);

            $progress->increment('exp', 250);
            $progress->increment('gold', 150);
            $progress->increment('erp', 100);
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
