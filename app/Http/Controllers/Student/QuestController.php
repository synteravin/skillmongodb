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

    public function index(Request $request)
    {
        $search = $request->input('search');
        $status = $request->input('status');
        $limit = (int) $request->input('limit', 12);

        $questsData = $this->questService->listQuests($search, $status, $limit);

        $user = $request->user();
        $bids = QuestBid::where('student_id', (string) $user->_id)->get();
        $biddedQuestIds = $bids->pluck('quest_id')->toArray();
        $completedQuestsCount = Quest::where(function ($query) use ($user, $biddedQuestIds) {
            $query->where('worker_id', (string) $user->_id)
                ->orWhere('creator_id', (string) $user->_id)
                ->orWhereIn('_id', $biddedQuestIds);
        })->where('status', 'completed')->count();

        $myQuests = Quest::with('creator')
            ->where(function ($query) use ($user) {
                $query->where('creator_id', (string) $user->_id)
                    ->orWhere(function ($q) use ($user) {
                        $q->where('worker_id', (string) $user->_id)
                            ->whereNotIn('status', ['draft', 'rejected']);
                    });
            })
            ->latest()
            ->get()
            ->map(function ($quest) {
                return [
                    '_id' => (string) $quest->_id,
                    'title' => $quest->title,
                    'description' => $quest->description,
                    'min_budget' => $quest->min_budget,
                    'max_budget' => $quest->max_budget,
                    'min_salary' => $quest->min_budget,
                    'max_salary' => $quest->max_budget,
                    'deadline' => $quest->deadline?->toISOString(),
                    'status' => $quest->status,
                    'creator_id' => $quest->creator_id ? (string) $quest->creator_id : null,
                    'worker_id' => $quest->worker_id ? (string) $quest->worker_id : null,
                    'rejection_note' => $quest->rejection_note,
                    'creator' => [
                        'name' => $quest->creator?->name ?? 'Unknown User',
                        'role' => $quest->creator?->role ?? 'unknown',
                    ],
                    'bids_count' => QuestBid::where('quest_id', $quest->_id)->count(),
                ];
            })
            ->toArray();

        return Inertia::render('Student/Quests/Index', [
            'quests' => $questsData['items'],
            'totalQuests' => $questsData['total'],
            'currentLimit' => $limit,
            'completedQuestsCount' => $completedQuestsCount,
            'myQuests' => $myQuests,
            'filters' => [
                'search' => $search,
                'status' => $status,
                'limit' => $limit,
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

        $updateData = [
            'status' => 'approved',
            'rating' => (int) $request->rating,
            'rating_comment' => $request->rating_comment,
            'revision_note' => null, // clear any past revision note
        ];

        $quest->update($updateData);

        $msg = 'Hasil tinjauan pekerjaan disetujui! Silakan lanjutkan dengan melakukan transfer pembayaran dan unggah bukti transfer.';

        return redirect()->route('student.quests.show', $quest->_id)
            ->with('success', $msg);
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
    public function submitFinalZip(Request $request, Quest $quest)
    {
        $user = $request->user();

        // Must be the chosen worker
        if ($quest->worker_id !== $user->_id) {
            abort(403, 'Hanya pekerja terpilih yang dapat mengunggah berkas final.');
        }

        // Must be payment status
        if ($quest->status !== 'payment') {
            abort(400, 'Berkas ZIP final hanya dapat diunggah setelah bukti transfer pembayaran diunggah.');
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
            'submission_note' => 'Final ZIP Deliverable Uploaded and Payment Confirmed',
            'submission_file' => $submissionFile,
        ];

        $quest->update([
            'submission_file' => $submissionFile,
            'completed_at' => now(),
            'payment_confirmed_at' => now(),
            'status' => 'completed',
            'submission_history' => $history,
        ]);

        // Award gamification rewards to worker (Student)
        if ($quest->worker_id) {
            $this->questService->awardQuestRewards($quest, $quest->worker_id);
        }

        return redirect()->route('student.quests.show', $quest->_id)
            ->with('success', 'Konfirmasi pembayaran berhasil! Berkas final berhasil diunggah, quest selesai, dan hadiah telah ditambahkan ke profil Anda.');
    }

    /**
     * Upload payment proof receipt by the creator.
     */
    public function uploadPaymentProof(Request $request, Quest $quest)
    {
        $user = $request->user();

        // Must be the quest creator or admin
        if ($quest->creator_id !== $user->_id && ! $user->isAdmin()) {
            abort(403, 'Hanya pembuat quest atau admin yang dapat mengunggah bukti transfer.');
        }

        // Must be in approved status
        if ($quest->status !== 'approved') {
            abort(400, 'Bukti transfer hanya dapat diunggah setelah pekerjaan disetujui.');
        }

        $request->validate([
            'payment_proof' => 'required|file|image|max:5120',
        ], [
            'payment_proof.required' => 'Bukti transfer wajib diunggah.',
            'payment_proof.file' => 'Bukti transfer harus berupa file valid.',
            'payment_proof.image' => 'Bukti transfer harus berupa gambar (JPG, JPEG, PNG).',
            'payment_proof.max' => 'Ukuran bukti transfer maksimal adalah 5MB.',
        ]);

        // Upload to S3
        $file = $request->file('payment_proof');
        $originalName = $file->getClientOriginalName();
        $path = $file->store('quests/payments', 's3');
        $size = $file->getSize();

        $paymentProof = [
            'name' => $originalName,
            'path' => $path,
            'size' => $size,
        ];

        $quest->update([
            'payment_proof' => $paymentProof,
            'payment_uploaded_at' => now(),
            'status' => 'payment',
        ]);

        return redirect()->route('student.quests.show', $quest->_id)
            ->with('success', 'Bukti transfer pembayaran berhasil diunggah! Menunggu konfirmasi dari pekerja.');
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

    public function history(Request $request)
    {
        $user = $request->user();
        $search = $request->input('search');
        $role = $request->input('role', 'all');
        $status = $request->input('status', 'all');

        $bids = QuestBid::where('student_id', (string) $user->_id)->get();
        $biddedQuestIds = $bids->pluck('quest_id')->toArray();

        $query = Quest::with(['creator', 'worker']);

        // Filter by Role
        if ($role === 'creator') {
            $query->where('creator_id', (string) $user->_id);
        } elseif ($role === 'worker') {
            $query->where('worker_id', (string) $user->_id);
        } elseif ($role === 'bidder') {
            $query->whereIn('_id', $biddedQuestIds)
                ->where('worker_id', '!=', (string) $user->_id)
                ->where('creator_id', '!=', (string) $user->_id);
        } else {
            $query->where(function ($q) use ($user, $biddedQuestIds) {
                $q->where('worker_id', (string) $user->_id)
                    ->orWhere('creator_id', (string) $user->_id)
                    ->orWhereIn('_id', $biddedQuestIds);
            });
        }

        // Filter by Status
        if ($status && $status !== 'all') {
            $query->where('status', $status);
        }

        // Filter by Search Query
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $paginatedQuests = $query->latest()->paginate(10)->withQueryString();

        $paginatedQuestIds = $paginatedQuests->pluck('id')->toArray();
        $allBidsCounts = QuestBid::whereIn('quest_id', $paginatedQuestIds)
            ->select('quest_id')
            ->get()
            ->groupBy('quest_id')
            ->map(fn ($groupedBids) => $groupedBids->count());

        $acceptedBids = QuestBid::whereIn('quest_id', $paginatedQuestIds)
            ->where('status', 'accepted')
            ->get()
            ->keyBy('quest_id');

        // Calculate Accumulative Stats for RPG HUD
        // Completed Quests count
        $completedQuestsCount = Quest::where('worker_id', (string) $user->_id)
            ->where('status', 'completed')
            ->count();

        // Total Anggaran Bid (Pekerja & Pembuat) yang disetujui (accepted)
        $totalBidsPlaced = QuestBid::where('student_id', (string) $user->_id)
            ->where('status', 'accepted')
            ->sum('bid_amount');

        $myCreatedQuestIds = Quest::where('creator_id', (string) $user->_id)->pluck('id')->toArray();
        $totalBidsReceived = empty($myCreatedQuestIds) ? 0 : QuestBid::whereIn('quest_id', $myCreatedQuestIds)
            ->where('status', 'accepted')
            ->sum('bid_amount');

        // Map items
        $quests = $paginatedQuests->through(function ($quest) use ($user, $bids, $allBidsCounts, $acceptedBids) {
            $myBid = $bids->firstWhere('quest_id', (string) $quest->_id);

            $submissionFile = null;
            if ($quest->submission_file) {
                $subFile = $quest->submission_file;
                $submissionFile = [
                    'name' => $subFile['name'] ?? 'project.zip',
                    'size' => $subFile['size'] ?? 0,
                    'url' => isset($subFile['path']) ? Storage::disk('s3')->temporaryUrl($subFile['path'], now()->addMinutes(30)) : null,
                ];
            }

            $rewards = $this->questService->getRewardsForQuest($quest);

            return [
                '_id' => (string) $quest->_id,
                'title' => $quest->title,
                'description' => $quest->description,
                'min_salary' => $quest->min_salary,
                'max_salary' => $quest->max_salary,
                'deadline' => $quest->deadline?->toISOString(),
                'status' => $quest->status,
                'creator' => [
                    'name' => $quest->creator?->name ?? 'Unknown User',
                    'role' => $quest->creator?->role ?? 'unknown',
                ],
                'worker' => $quest->worker ? [
                    'name' => $quest->worker->name,
                    'email' => $quest->worker->email,
                ] : null,
                'worker_id' => $quest->worker_id,
                'is_worker' => $quest->worker_id === (string) $user->_id,
                'is_creator' => $quest->creator_id === (string) $user->_id,
                'my_bid' => $myBid ? [
                    'bid_amount' => $myBid->bid_amount,
                    'status' => $myBid->status,
                    'proposal' => $myBid->proposal,
                    'cv' => $myBid->cv,
                    'portfolio' => $myBid->portfolio,
                ] : null,
                'bids_count' => $allBidsCounts[(string) $quest->_id] ?? 0,
                'accepted_bid_amount' => ($acceptedBid = $acceptedBids->get((string) $quest->_id)) ? (int) $acceptedBid->bid_amount : null,
                'rewards' => $rewards,
                'submission_file' => $submissionFile,
            ];
        });

        return Inertia::render('Student/Quests/History', [
            'quests' => $quests,
            'stats' => [
                'completed_quests_count' => $completedQuestsCount,
                'total_bids_placed' => $totalBidsPlaced,
                'total_bids_received' => $totalBidsReceived,
            ],
            'filters' => [
                'search' => $search,
                'role' => $role,
                'status' => $status,
            ],
        ]);
    }
}
