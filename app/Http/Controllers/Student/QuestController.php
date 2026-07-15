<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Http\Requests\Quest\FileDisputeRequest;
use App\Http\Requests\Quest\StoreQuestBidRequest;
use App\Http\Requests\Quest\StoreQuestRequest;
use App\Models\Quest;
use App\Models\QuestBid;
use App\Models\QuestMessage;
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
    public function create(Request $request)
    {
        $template = null;
        $templateId = $request->query('template_id');

        if ($templateId) {
            $tq = Quest::find($templateId);
            if ($tq && ($tq->creator_id === (string) auth()->id() || auth()->user()->isAdmin())) {
                $template = [
                    'title' => $tq->title,
                    'description' => $tq->description,
                    'min_salary' => $tq->min_salary,
                    'max_salary' => $tq->max_salary,
                ];
            }
        }

        return Inertia::render('Student/Quests/Create', [
            'template' => $template,
        ]);
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
            ->with('success', 'Quest berhasil dikirim dan menunggu persetujuan admin!');
    }

    /**
     * Display the specified quest details.
     */
    public function show(string $id)
    {
        $user = auth()->user();
        $details = $this->questService->getQuestDetails($id, $user);

        $quest = Quest::findOrFail($id);

        if (in_array($quest->status, ['draft', 'rejected'])) {
            if ($quest->creator_id !== (string) $user->_id && ! $user->isAdmin()) {
                abort(403, 'Anda tidak memiliki akses untuk melihat quest yang belum disetujui.');
            }
        }

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
            'submission_file' => 'nullable|file|mimes:zip|max:51200',
            'submission_link' => 'required|url',
            'submission_note' => 'nullable|string|max:1000',
        ], [
            'submission_file.file' => 'Berkas pengiriman harus berupa file valid.',
            'submission_file.mimes' => 'Berkas pengiriman harus berformat ZIP.',
            'submission_file.max' => 'Ukuran berkas pengiriman maksimal adalah 50MB.',
            'submission_link.required' => 'Link hasil pekerjaan wajib diisi untuk peninjauan.',
            'submission_link.url' => 'Format link harus berupa URL valid.',
        ]);

        $updateData = [
            'submission_link' => $request->submission_link,
            'submission_note' => $request->submission_note,
            'submitted_at' => now(),
            'status' => 'submitted',
            'revision_note' => null, // clear active revision alert
        ];

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
            $updateData['submission_file'] = $submissionFile;
        } else {
            // Retain old submission file if no new file is uploaded
            $submissionFile = $quest->submission_file;
        }

        $history = $quest->submission_history ?? [];
        $nextVersion = count($history) + 1;
        $history[] = [
            'version' => $nextVersion,
            'submitted_at' => now()->toIso8601String(),
            'submission_link' => $request->submission_link,
            'submission_note' => $request->submission_note,
            'submission_file' => $submissionFile,
        ];

        $updateData['submission_history'] = $history;

        $quest->update($updateData);

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

        $hasFile = $quest->submission_file && isset($quest->submission_file['path']);
        $newStatus = $hasFile ? 'completed' : 'approved';

        $updateData = [
            'status' => $newStatus,
            'rating' => (int) $request->rating,
            'rating_comment' => $request->rating_comment,
            'revision_note' => null, // clear any past revision note
        ];

        if ($hasFile) {
            $updateData['completed_at'] = now();
        }

        $quest->update($updateData);

        // Award gamification rewards to worker (Student) only if completed
        if ($hasFile && $quest->worker_id) {
            $this->questService->awardQuestRewards($quest, $quest->worker_id);
        }

        $msg = $hasFile
            ? 'Pekerjaan disetujui! Quest selesai dan hadiah telah ditambahkan ke profil pekerja.'
            : 'Pekerjaan disetujui! Status menjadi disetujui, menunggu pekerja mengunggah berkas ZIP final untuk menyelesaikan quest.';

        return redirect()->route('student.quests.show', $quest->_id)
            ->with($hasFile ? 'success' : 'warning', $msg);
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

        return redirect()->route('student.quests.show', $quest->_id)
            ->with('warning', 'Pekerjaan ditolak dan revisi diminta dari pekerja.');
    }

    /**
     * Submit final ZIP deliverable for an approved quest.
     */
    public function submitFinalZIP(Request $request, Quest $quest)
    {
        $user = $request->user();

        // Must be the chosen worker
        if ($quest->worker_id !== $user->_id) {
            abort(403, 'Hanya pekerja terpilih yang dapat mengunggah berkas final.');
        }

        // Must be approved status
        if ($quest->status !== 'approved') {
            abort(400, 'Berkas ZIP final hanya dapat diunggah setelah pekerjaan disetujui.');
        }

        $request->validate([
            'submission_file' => 'required|file|mimes:zip|max:51200',
        ], [
            'submission_file.required' => 'Berkas ZIP final wajib diunggah.',
            'submission_file.file' => 'Berkas pengiriman harus berupa file valid.',
            'submission_file.mimes' => 'Berkas pengiriman harus berformat ZIP.',
            'submission_file.max' => 'Ukuran berkas pengiriman maksimal adalah 50MB.',
        ]);

        // Upload ZIP to S3
        $file = $request->file('submission_file');
        $originalName = $file->getClientOriginalName();
        $path = $file->store('quests/deliverables', 's3');
        $size = $file->getSize();

        $submissionFile = [
            'name' => $originalName,
            'path' => $path,
            'size' => $size,
        ];

        $history = $quest->submission_history ?? [];
        $nextVersion = count($history) + 1;
        $history[] = [
            'version' => $nextVersion,
            'submitted_at' => now()->toIso8601String(),
            'submission_link' => $quest->submission_link,
            'submission_note' => 'Final ZIP Deliverable Uploaded',
            'submission_file' => $submissionFile,
        ];

        $quest->update([
            'submission_file' => $submissionFile,
            'completed_at' => now(),
            'status' => 'completed',
            'submission_history' => $history,
        ]);

        // Award gamification rewards to worker (Student)
        if ($quest->worker_id) {
            $this->questService->awardQuestRewards($quest, $quest->worker_id);
        }

        return redirect()->route('student.quests.show', $quest->_id)
            ->with('success', 'Berkas final berhasil diunggah! Quest selesai dan hadiah telah ditambahkan ke profil Anda.');
    }

    /**
     * File a dispute.
     */
    public function fileDispute(FileDisputeRequest $request, string $questId)
    {
        $quest = Quest::findOrFail($questId);
        $user = $request->user();

        // Check authorization (must be creator or worker)
        if ($quest->worker_id !== $user->_id && $quest->creator_id !== $user->_id && ! $user->isAdmin()) {
            abort(403, 'Anda tidak memiliki hak untuk mengajukan dispute pada quest ini.');
        }

        $this->questService->fileDispute($quest, $user, $request->reason);

        return redirect()->route('student.quests.show', $quest->_id)
            ->with('success', 'Banding (dispute) berhasil diajukan! Menunggu peninjauan arbitrase oleh Admin.');
    }

    /**
     * Extend quest deadline.
     */
    public function extendDeadline(Request $request, string $questId)
    {
        $quest = Quest::findOrFail($questId);
        $user = $request->user();

        // Check authorization (must be creator or admin)
        if ($quest->creator_id !== $user->_id && ! $user->isAdmin()) {
            abort(403, 'Hanya pembuat quest atau admin yang dapat memperpanjang tenggat waktu.');
        }

        $request->validate([
            'deadline' => ['required', 'date', 'after:now'],
        ], [
            'deadline.required' => 'Tenggat waktu baru wajib diisi.',
            'deadline.date' => 'Tenggat waktu harus berupa tanggal valid.',
            'deadline.after' => 'Tenggat waktu baru harus berupa waktu di masa depan.',
        ]);

        $updateData = [
            'deadline' => now()->parse($request->deadline),
        ];

        // If the quest was expired, restore its status
        if ($quest->status === 'expired') {
            $updateData['status'] = empty($quest->worker_id) ? 'open' : 'ongoing';
        }

        $quest->update($updateData);

        return redirect()->route('student.quests.show', $quest->_id)
            ->with('success', 'Tenggat waktu quest berhasil diperpanjang!');
    }
}
