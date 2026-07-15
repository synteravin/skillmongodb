<?php

namespace App\Http\Controllers;

use App\Models\QuestBid;
use App\Models\QuestMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class QuestMessageController extends Controller
{
    /**
     * Get messages for a specific quest bid (thread).
     */
    public function getMessages(Request $request, string $bidId): JsonResponse
    {
        $user = $request->user();
        $bid = QuestBid::with('quest')->findOrFail($bidId);

        // Authorization check: user must be admin, quest creator, or bid applicant
        $isCreator = $bid->quest->creator_id === $user->_id;
        $isApplicant = $bid->student_id === $user->_id;
        $isAdmin = $user->isAdmin();

        if (! $isCreator && ! $isApplicant && ! $isAdmin) {
            return response()->json(['error' => 'Unauthorized access to this chat.'], 403);
        }

        // Block access if bid is rejected
        if ($bid->status === 'rejected') {
            return response()->json(['error' => 'Unauthorized access to this chat.'], 403);
        }

        // Mark messages as read by the current user
        $unreadMessages = QuestMessage::where('quest_bid_id', $bidId)
            ->where('sender_id', '!=', $user->_id)
            ->where('read_by', '!=', $user->_id)
            ->get();

        foreach ($unreadMessages as $msg) {
            $readBy = $msg->read_by ?: [];
            if (! in_array((string) $user->_id, $readBy)) {
                $readBy[] = (string) $user->_id;
                $msg->update(['read_by' => $readBy]);
            }
        }

        $query = QuestMessage::where('quest_bid_id', $bidId);

        if ($request->has('after_id') && $request->after_id !== '') {
            $query->where('_id', '>', $request->after_id);
        } else {
            $query->latest('created_at')->limit(50);
        }

        $messages = $query->with('sender')->get();

        if (! $request->has('after_id')) {
            $messages = $messages->reverse()->values();
        }

        $data = $messages->map(function ($msg) {
            $disk = Storage::disk('s3');

            return [
                'id' => (string) $msg->_id,
                'message' => $msg->message,
                'created_at' => $msg->created_at->toIso8601String(),
                'sender' => [
                    'id' => (string) ($msg->sender?->_id ?? ''),
                    'name' => $msg->sender?->name ?? 'Unknown User',
                    'role' => $msg->sender?->role ?? 'unknown',
                ],
                'file' => $msg->file ? [
                    'name' => $msg->file['name'],
                    'url' => $disk->url($msg->file['path']),
                    'size' => $msg->file['size'],
                ] : null,
            ];
        });

        return response()->json($data);
    }

    /**
     * Store a new quest chat message.
     */
    public function store(Request $request, string $bidId): JsonResponse
    {
        $user = $request->user();
        $bid = QuestBid::with('quest')->findOrFail($bidId);

        // Authorization check
        $isCreator = $bid->quest->creator_id === $user->_id;
        $isApplicant = $bid->student_id === $user->_id;
        $isAdmin = $user->isAdmin();

        if (! $isCreator && ! $isApplicant && ! $isAdmin) {
            return response()->json(['error' => 'Unauthorized access to this chat.'], 403);
        }

        // Block access if bid is rejected
        if ($bid->status === 'rejected') {
            return response()->json(['error' => 'Unauthorized access to this chat.'], 403);
        }

        $request->validate([
            'message' => 'nullable|string|max:10000',
            'file' => 'nullable|file|max:10240',
        ]);

        if (empty($request->message) && ! $request->hasFile('file')) {
            return response()->json(['error' => 'Pesan atau file wajib diisi.'], 422);
        }

        $fileData = null;
        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $originalName = $file->getClientOriginalName();
            $path = $file->store('quests/chats', 's3');
            $size = $file->getSize();

            $fileData = [
                'name' => $originalName,
                'path' => $path,
                'size' => $size,
            ];
        }

        $msg = QuestMessage::create([
            'quest_bid_id' => $bidId,
            'sender_id' => $user->_id,
            'message' => $request->message ?? '',
            'read_by' => [(string) $user->_id],
            'file' => $fileData,
        ]);

        $disk = Storage::disk('s3');

        return response()->json([
            'id' => (string) $msg->_id,
            'message' => $msg->message,
            'created_at' => $msg->created_at->toIso8601String(),
            'sender' => [
                'id' => (string) $user->_id,
                'name' => $user->name,
                'role' => $user->role,
            ],
            'file' => $msg->file ? [
                'name' => $msg->file['name'],
                'url' => $disk->url($msg->file['path']),
                'size' => $msg->file['size'],
            ] : null,
        ]);
    }
}
