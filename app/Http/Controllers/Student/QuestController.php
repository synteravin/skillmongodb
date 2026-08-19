<?php

namespace App\Http\Controllers\Student;

use App\Enums\QuestStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Quest\ApproveQuestWorkRequest;
use App\Http\Requests\Quest\ExtendQuestDeadlineRequest;
use App\Http\Requests\Quest\FileDisputeRequest;
use App\Http\Requests\Quest\RejectQuestWorkRequest;
use App\Http\Requests\Quest\RequestFinalZipRevisionRequest;
use App\Http\Requests\Quest\StoreQuestBidRequest;
use App\Http\Requests\Quest\StoreQuestFlagRequest;
use App\Http\Requests\Quest\StoreQuestRequest;
use App\Http\Requests\Quest\SubmitFinalZipRequest;
use App\Http\Requests\Quest\SubmitQuestWorkRequest;
use App\Http\Requests\Quest\UploadPaymentProofRequest;
use App\Models\Notification;
use App\Models\Quest;
use App\Models\QuestBid;
use App\Models\QuestFlag;
use App\Models\QuestMessage;
use App\Models\User;
use App\Services\Quest\QuestService;
use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
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

        $myQuestsCollection = Quest::with('creator')
            ->where(function ($query) use ($user) {
                $query->where('creator_id', (string) $user->_id)
                    ->orWhere(function ($q) use ($user) {
                        $q->where('worker_id', (string) $user->_id)
                            ->whereNotIn('status', ['draft', 'rejected']);
                    });
            })
            ->latest()
            ->get();

        $myQuestIds = $myQuestsCollection->pluck('_id')->map(fn ($id) => (string) $id)->toArray();
        $myBidCounts = QuestBid::whereIn('quest_id', $myQuestIds)->get()->groupBy('quest_id')->map->count();

        $myQuests = $myQuestsCollection->map(function ($quest) use ($myBidCounts) {
            return [
                '_id' => (string) $quest->_id,
                'id' => (string) $quest->_id,
                'slug' => $quest->slug ?: Str::slug($quest->title),
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
                'bids_count' => $myBidCounts[(string) $quest->_id] ?? 0,
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
            /** @var User $currentUser */
            $currentUser = Auth::user();
            if ($tq && ($tq->creator_id === (string) $currentUser->id || $currentUser->isAdmin())) {
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

        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $att) {
                if ($att->isValid()) {
                    $mime = $att->getMimeType() ?? '';
                    if (str_starts_with($mime, 'image/')) {
                        $path = $att->store('quests/images', 's3');
                        $images[] = [
                            'path' => $path,
                            'name' => $att->getClientOriginalName(),
                        ];
                    } else {
                        $path = $att->store('quests/files', 's3');
                        $files[] = [
                            'path' => $path,
                            'name' => $att->getClientOriginalName(),
                            'size' => $att->getSize(),
                        ];
                    }
                }
            }
        }

        $data['images'] = $images;
        $data['files'] = $files;

        $quest = $this->questService->createQuest(
            $request->user(),
            $data
        );

        return redirect()->route('student.quests.show', $quest->slug ?: $quest->_id)
            ->with('success', 'Quest berhasil dikirim dan menunggu persetujuan admin!');
    }

    /**
     * Show form for editing an unapproved/rejected quest.
     */
    public function edit(Quest $quest)
    {
        /** @var User $user */
        $user = Auth::user();

        if ((string) $quest->creator_id !== (string) $user->_id && ! $user->isAdmin()) {
            abort(403, 'Anda tidak memiliki hak akses untuk mengedit quest ini.');
        }

        $statusVal = $quest->status instanceof QuestStatus ? $quest->status->value : $quest->status;
        if (! in_array($statusVal, [QuestStatus::DRAFT->value, QuestStatus::REJECTED->value])) {
            abort(400, 'Hanya quest berstatus Draf atau Ditolak yang dapat diperbaiki.');
        }

        /** @var FilesystemAdapter $disk */
        $disk = Storage::disk('s3');
        $resolvedImages = array_map(function ($img) use ($disk) {
            return [
                'name' => $img['name'] ?? 'image.jpg',
                'path' => $img['path'] ?? '',
                'url' => isset($img['path']) ? $disk->temporaryUrl($img['path'], now()->addMinutes(60)) : '',
            ];
        }, $quest->images ?? []);

        $resolvedFiles = array_map(function ($file) use ($disk) {
            return [
                'name' => $file['name'] ?? 'file.dat',
                'path' => $file['path'] ?? '',
                'url' => isset($file['path']) ? $disk->temporaryUrl($file['path'], now()->addMinutes(60)) : '',
                'size' => $file['size'] ?? 0,
            ];
        }, $quest->files ?? []);

        return Inertia::render('Student/Quests/Edit', [
            'quest' => [
                '_id' => (string) $quest->_id,
                'id' => (string) $quest->_id,
                'slug' => $quest->slug ?: Str::slug($quest->title),
                'title' => $quest->title,
                'description' => $quest->description,
                'min_budget' => $quest->min_budget,
                'max_budget' => $quest->max_budget,
                'min_salary' => $quest->min_budget,
                'max_salary' => $quest->max_budget,
                'deadline' => $quest->deadline?->toISOString() ? explode('T', $quest->deadline->toISOString())[0] : '',
                'status' => $statusVal,
                'rejection_note' => $quest->rejection_note,
                'images' => $resolvedImages,
                'files' => $resolvedFiles,
            ],
        ]);
    }

    /**
     * Update an existing draft/rejected quest and resubmit to admin.
     */
    public function update(StoreQuestRequest $request, Quest $quest)
    {
        $user = $request->user();

        if ((string) $quest->creator_id !== (string) $user->_id && ! $user->isAdmin()) {
            abort(403, 'Anda tidak memiliki hak akses untuk mengedit quest ini.');
        }

        $statusVal = $quest->status instanceof QuestStatus ? $quest->status->value : $quest->status;
        if (! in_array($statusVal, [QuestStatus::DRAFT->value, QuestStatus::REJECTED->value])) {
            abort(400, 'Hanya quest berstatus Draf atau Ditolak yang dapat diperbaiki.');
        }

        $data = $request->validated();
        $minBudget = (int) ($data['min_budget'] ?? $data['min_salary'] ?? 0);
        $maxBudget = (int) ($data['max_budget'] ?? $data['max_salary'] ?? 0);

        // Retain requested existing images
        $existingImagesInput = $request->input('retained_images', []);
        if (is_string($existingImagesInput)) {
            $existingImagesInput = json_decode($existingImagesInput, true) ?: [];
        }
        $retainedImages = [];
        $currentImages = $quest->images ?? [];
        if (! empty($existingImagesInput) && is_array($existingImagesInput)) {
            foreach ($currentImages as $img) {
                if (in_array($img['path'] ?? '', $existingImagesInput)) {
                    $retainedImages[] = $img;
                }
            }
        } else {
            $retainedImages = $currentImages;
        }

        // Retain requested existing files
        $existingFilesInput = $request->input('retained_files', []);
        if (is_string($existingFilesInput)) {
            $existingFilesInput = json_decode($existingFilesInput, true) ?: [];
        }
        $retainedFiles = [];
        $currentFiles = $quest->files ?? [];
        if (! empty($existingFilesInput) && is_array($existingFilesInput)) {
            foreach ($currentFiles as $file) {
                if (in_array($file['path'] ?? '', $existingFilesInput)) {
                    $retainedFiles[] = $file;
                }
            }
        } else {
            $retainedFiles = $currentFiles;
        }

        // Process newly uploaded images & files
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                if ($image->isValid()) {
                    $path = $image->store('quests/images', 's3');
                    $retainedImages[] = [
                        'path' => $path,
                        'name' => $image->getClientOriginalName(),
                    ];
                }
            }
        }

        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                if ($file->isValid()) {
                    $path = $file->store('quests/files', 's3');
                    $retainedFiles[] = [
                        'path' => $path,
                        'name' => $file->getClientOriginalName(),
                        'size' => $file->getSize(),
                    ];
                }
            }
        }

        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $att) {
                if ($att->isValid()) {
                    $mime = $att->getMimeType() ?? '';
                    if (str_starts_with($mime, 'image/')) {
                        $path = $att->store('quests/images', 's3');
                        $retainedImages[] = [
                            'path' => $path,
                            'name' => $att->getClientOriginalName(),
                        ];
                    } else {
                        $path = $att->store('quests/files', 's3');
                        $retainedFiles[] = [
                            'path' => $path,
                            'name' => $att->getClientOriginalName(),
                            'size' => $att->getSize(),
                        ];
                    }
                }
            }
        }

        // Calculate Tier & Rewards
        if ($maxBudget >= 10000000) {
            $tier = 'S';
        } elseif ($maxBudget >= 5000000) {
            $tier = 'A';
        } elseif ($maxBudget >= 2500000) {
            $tier = 'B';
        } elseif ($maxBudget >= 1000000) {
            $tier = 'C';
        } else {
            $tier = 'D';
        }

        $avgBudget = ($minBudget + $maxBudget) / 2;
        $exp = (int) min(1000, max(100, round(100 + $avgBudget * 0.0001)));
        $gold = (int) min(500, max(50, round(50 + $maxBudget * 0.00005)));
        $rep = (int) min(200, max(20, round(20 + $avgBudget * 0.00002)));

        $calculatedRewards = [
            'exp' => $exp,
            'gold' => $gold,
            'rep' => $rep,
            'erp' => $rep,
        ];

        $quest->update([
            'title' => $data['title'],
            'description' => $data['description'],
            'min_budget' => $minBudget,
            'max_budget' => $maxBudget,
            'min_salary' => $minBudget,
            'max_salary' => $maxBudget,
            'deadline' => now()->parse($data['deadline']),
            'images' => $retainedImages,
            'files' => $retainedFiles,
            'tier' => $tier,
            'rewards' => $calculatedRewards,
            'status' => QuestStatus::DRAFT->value,
            'rejection_note' => null,
        ]);

        return redirect()->route('student.quests.show', $quest->slug ?: $quest->_id)
            ->with('success', 'Quest berhasil diperbarui dan dikirim ulang ke admin untuk ditinjau!');
    }

    /**
     * Delete/cancel a draft or rejected quest.
     */
    public function destroy(Request $request, Quest $quest)
    {
        $user = $request->user();

        if ((string) $quest->creator_id !== (string) $user->_id && ! $user->isAdmin()) {
            abort(403, 'Anda tidak memiliki hak akses untuk menghapus quest ini.');
        }

        $statusVal = $quest->status instanceof QuestStatus ? $quest->status->value : $quest->status;
        if (! in_array($statusVal, [QuestStatus::DRAFT->value, QuestStatus::REJECTED->value])) {
            abort(400, 'Hanya quest berstatus Draf atau Ditolak yang dapat dibatalkan/dihapus.');
        }

        $quest->delete();

        return redirect()->route('student.quests.index')
            ->with('success', 'Draf quest berhasil dibatalkan dan dihapus.');
    }

    /**
     * Display the specified quest details.
     */
    public function show(string $id)
    {
        $quest = Quest::with(['creator', 'worker'])->where('slug', $id)->orWhere('_id', $id)->firstOrFail();
        /** @var User $user */
        $user = Auth::user();
        $details = $this->questService->getQuestDetails($quest, $user);

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

        $validated = $request->validated();
        /** @var FilesystemAdapter $disk */
        $disk = Storage::disk('s3');

        if ($request->hasFile('cv_file') && $request->file('cv_file')->isValid()) {
            $path = $request->file('cv_file')->store('quests/bids/cv', 's3');
            $validated['cv'] = $disk->url($path);
        } elseif ($request->hasFile('cv') && $request->file('cv')->isValid()) {
            $path = $request->file('cv')->store('quests/bids/cv', 's3');
            $validated['cv'] = $disk->url($path);
        }

        if ($request->hasFile('portfolio_file') && $request->file('portfolio_file')->isValid()) {
            $path = $request->file('portfolio_file')->store('quests/bids/portfolio', 's3');
            $validated['portfolio'] = $disk->url($path);
        } elseif ($request->hasFile('portfolio') && $request->file('portfolio')->isValid()) {
            $path = $request->file('portfolio')->store('quests/bids/portfolio', 's3');
            $validated['portfolio'] = $disk->url($path);
        }

        $this->questService->placeBid(
            $request->user(),
            $quest,
            $validated
        );

        return redirect()->route('student.quests.show', $quest->slug ?: $quest->_id)
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

        return redirect()->route('student.quests.show', $quest->slug ?: $quest->_id)
            ->with('success', 'Pekerja berhasil dipilih dan Quest dimulai!');
    }

    /**
     * Submit completed work for the quest.
     */
    public function submitWork(SubmitQuestWorkRequest $request, Quest $quest)
    {
        $this->questService->submitWork(
            $request->user(),
            $quest,
            array_merge($request->validated(), [
                'submission_file' => $request->file('submission_file'),
            ])
        );

        return redirect()->route('student.quests.show', $quest->slug ?: $quest->_id)
            ->with('success', 'Hasil pekerjaan berhasil dikirim dan menunggu tinjauan!');
    }

    /**
     * Approve submitted work.
     */
    public function approveWork(ApproveQuestWorkRequest $request, Quest $quest)
    {
        $this->questService->approveWork($request->user(), $quest, $request->validated());

        return redirect()->route('student.quests.show', $quest->slug ?: $quest->_id)
            ->with('success', 'Hasil tinjauan pekerjaan disetujui! Silakan lanjutkan dengan melakukan transfer pembayaran dan unggah bukti transfer.');
    }

    /**
     * Reject submission and request revision.
     */
    public function rejectWork(RejectQuestWorkRequest $request, Quest $quest)
    {
        $this->questService->rejectWork($request->user(), $quest, $request->validated());

        return redirect()->route('student.quests.show', $quest->slug ?: $quest->_id)
            ->with('warning', 'Pekerjaan ditolak dan revisi diminta dari pekerja.');
    }

    /**
     * Submit final ZIP deliverable for an approved quest.
     */
    public function submitFinalZip(SubmitFinalZipRequest $request, Quest $quest)
    {
        $this->questService->submitFinalZip($request->user(), $quest, $request->file('submission_file'));

        return redirect()->route('student.quests.show', $quest->slug ?: $quest->_id)
            ->with('success', 'Berkas Master ZIP final berhasil diunggah! Menunggu verifikasi dan konfirmasi penerimaan dari pembuat quest.');
    }

    /**
     * Creator confirms final delivery and completes the quest.
     */
    public function confirmFinalDelivery(Request $request, Quest $quest)
    {
        $this->questService->confirmFinalDelivery($request->user(), $quest);

        return redirect()->route('student.quests.show', $quest->slug ?: $quest->_id)
            ->with('success', 'Berkas final berhasil dikonfirmasi! Quest resmi selesai dan hadiah telah dicairkan ke profil pekerja.');
    }

    /**
     * Creator requests revision/re-upload of the final master ZIP file.
     */
    public function requestFinalZipRevision(RequestFinalZipRevisionRequest $request, Quest $quest)
    {
        $this->questService->requestFinalZipRevision($request->user(), $quest, $request->validated()['revision_note']);

        return redirect()->route('student.quests.show', $quest->slug ?: $quest->_id)
            ->with('warning', 'Permintaan perbaikan berkas final telah dikirimkan ke pekerja untuk diunggah ulang.');
    }

    /**
     * Report / flag a quest for moderation review.
     */
    public function storeFlag(StoreQuestFlagRequest $request, Quest $quest)
    {
        $user = $request->user();

        QuestFlag::create([
            'reporter_id' => (string) $user->_id,
            'reported_user_id' => (string) $quest->creator_id,
            'quest_id' => (string) $quest->_id,
            'reason' => $request->reason,
            'details' => $request->details,
            'status' => 'pending',
        ]);

        return redirect()->back()
            ->with('success', 'Laporan Anda telah berhasil dikirimkan ke tim Admin untuk ditinjau.');
    }

    /**
     * Upload payment proof receipt by the creator.
     */
    public function uploadPaymentProof(UploadPaymentProofRequest $request, Quest $quest)
    {
        $this->questService->uploadPaymentProof($request->user(), $quest, $request->file('payment_proof'));

        return redirect()->route('student.quests.show', $quest->slug ?: $quest->_id)
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

        return redirect()->route('student.quests.show', $quest->slug ?: $quest->_id)
            ->with('success', 'Banding (dispute) berhasil diajukan! Menunggu peninjauan arbitrase oleh Admin.');
    }

    /**
     * Extend quest deadline.
     */
    public function extendDeadline(ExtendQuestDeadlineRequest $request, string $questId)
    {
        $quest = Quest::findOrFail($questId);

        $this->questService->extendDeadline($request->user(), $quest, $request->validated()['deadline']);

        return redirect()->route('student.quests.show', $quest->slug ?: $quest->_id)
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
                /** @var FilesystemAdapter $disk */
                $disk = Storage::disk('s3');
                $subFile = $quest->submission_file;
                $submissionFile = [
                    'name' => $subFile['name'] ?? 'project.zip',
                    'size' => $subFile['size'] ?? 0,
                    'url' => isset($subFile['path']) ? $disk->temporaryUrl($subFile['path'], now()->addMinutes(30)) : null,
                ];
            }

            $rewards = $this->questService->getRewardsForQuest($quest);

            return [
                '_id' => (string) $quest->_id,
                'id' => (string) $quest->_id,
                'slug' => $quest->slug ?: Str::slug($quest->title),
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

    /**
     * Mark notification as read.
     */
    public function markNotificationAsRead(Request $request, string $id)
    {
        try {
            $notification = Notification::where('_id', $id)
                ->where('notifiable_id', (string) $request->user()->_id)
                ->first();

            if ($notification) {
                $notification->markAsRead();
            }
        } catch (\Throwable $e) {
            // Ignored on non-mongo DB connections
        }

        return back();
    }
}
