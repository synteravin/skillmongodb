import { useState, useEffect } from 'react';
import { Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import {
    Loader2,
    Plus,
    Edit2,
    Trash2,
    Shield,
    UserCheck,
    Award,
    X,
    Zap,
    Sparkles,
    Quote,
    BookOpen,
} from 'lucide-react';
import ConfirmModal from '@/components/ui/ConfirmModal';

type Rank = {
    id: string;
    name: string;
    image: string;
    image_url: string;
    order: number;
};

type Character = {
    id: string;
    name: string;
    tagline?: string;
    avatar?: string;
    avatar_url?: string;
    backstory?: string;
    quote?: string;
    character_type?: string[];
    abilities?: string[];
    personality?: string[];
    cosmetic_bonus?: string[];
    guide_power?: {
        title?: string;
        description?: string;
    };
    system_bonus?: {
        exp_boost?: string;
        gold_boost?: string;
    };
};

type LevelBadge = {
    id: string;
    name: string;
    icon?: string;
    icon_url?: string;
    order: number;
};

interface AssetsPageProps {
    stats: {
        ranks: number;
        characters: number;
        badges: number;
    };
    ranks?: Rank[];
    characters?: Character[];
    badges?: LevelBadge[];
}

export default function AssetsPage({
    stats,
    ranks = [],
    characters = [],
    badges = [],
}: AssetsPageProps) {
    const [activeTab, setActiveTab] = useState<
        'ranks' | 'characters' | 'badges'
    >('ranks');

    // State for drag & drop lists
    const [rankItems, setRankItems] = useState<Rank[]>(ranks);
    const [badgeItems, setBadgeItems] = useState<LevelBadge[]>(badges);
    const [characterItems, setCharacterItems] =
        useState<Character[]>(characters);

    // Character Modal state
    const [selectedCharacter, setSelectedCharacter] =
        useState<Character | null>(null);

    const [isSavingRankOrder, setIsSavingRankOrder] = useState(false);
    const [isSavingBadgeOrder, setIsSavingBadgeOrder] = useState(false);

    useEffect(() => {
        setRankItems(ranks);
    }, [ranks]);
    useEffect(() => {
        setBadgeItems(badges);
    }, [badges]);
    useEffect(() => {
        setCharacterItems(characters);
    }, [characters]);

    const [confirmModal, setConfirmModal] = useState<{
        open: boolean;
        title: string;
        message: string;
        confirmText: string;
        variant: 'danger' | 'info' | 'primary';
        onConfirm: () => void;
    }>({
        open: false,
        title: '',
        message: '',
        confirmText: 'Confirm',
        variant: 'danger',
        onConfirm: () => {},
    });

    /* ================= DRAG & DROP HANDLERS ================= */
    const handleRankDrag = (dragIndex: number, hoverIndex: number) => {
        const updated = [...rankItems];
        const dragged = updated[dragIndex];
        updated.splice(dragIndex, 1);
        updated.splice(hoverIndex, 0, dragged);
        setRankItems(updated);
    };

    const handleBadgeDrag = (dragIndex: number, hoverIndex: number) => {
        const updated = [...badgeItems];
        const dragged = updated[dragIndex];
        updated.splice(dragIndex, 1);
        updated.splice(hoverIndex, 0, dragged);
        setBadgeItems(updated);
    };

    const saveRankOrder = () => {
        setIsSavingRankOrder(true);
        const payload = rankItems.map((item, index) => ({
            id: item.id,
            order: index + 1,
        }));
        router.post(
            '/admin/assets/ranks/reorder',
            { ranks: payload },
            {
                onFinish: () => setIsSavingRankOrder(false),
            },
        );
    };

    const saveBadgeOrder = () => {
        setIsSavingBadgeOrder(true);
        const payload = badgeItems.map((item, index) => ({
            id: item.id,
            order: index + 1,
        }));
        router.post(
            '/admin/assets/badges/reorder',
            { badges: payload },
            {
                onFinish: () => setIsSavingBadgeOrder(false),
            },
        );
    };

    /* ================= DELETE HANDLERS ================= */
    const deleteRank = (id: string, name: string) => {
        setConfirmModal({
            open: true,
            title: 'Hapus Rank',
            message: `Apakah Anda yakin ingin menghapus rank "${name}"? Tindakan ini tidak dapat dibatalkan.`,
            confirmText: 'Hapus Rank',
            variant: 'danger',
            onConfirm: () => {
                router.delete(`/admin/assets/ranks/${id}`);
            },
        });
    };

    const deleteCharacter = (id: string, name: string) => {
        setConfirmModal({
            open: true,
            title: 'Hapus Karakter',
            message: `Apakah Anda yakin ingin menghapus karakter "${name}"?`,
            confirmText: 'Hapus Karakter',
            variant: 'danger',
            onConfirm: () => {
                router.delete(`/admin/assets/characters/${id}`);
                if (selectedCharacter?.id === id) setSelectedCharacter(null);
            },
        });
    };

    const deleteBadge = (id: string, name: string) => {
        setConfirmModal({
            open: true,
            title: 'Hapus Badge',
            message: `Apakah Anda yakin ingin menghapus badge "${name}"?`,
            confirmText: 'Hapus Badge',
            variant: 'danger',
            onConfirm: () => {
                router.delete(`/admin/assets/badges/${id}`);
            },
        });
    };

    return (
        <AppLayout>
            <div
                className="relative min-h-screen overflow-hidden bg-[#f8fafc] px-4 py-6 text-slate-800 transition-colors duration-200 sm:px-6 lg:px-10 dark:bg-[#030712] dark:text-white"
                style={{ fontFamily: "'Outfit', sans-serif" }}
            >
                {/* Ambient Glow */}
                <div className="pointer-events-none absolute top-0 left-1/2 z-0 h-[450px] w-full max-w-7xl -translate-x-1/2 bg-indigo-500/[0.04] select-none dark:bg-[radial-gradient(circle_at_top_center,rgba(59,40,246,0.12),transparent_50%)]" />

                <div className="relative z-10 mx-auto max-w-7xl space-y-6">
                    {/* HEADER */}
                    {/* HEADER */}
                    <div className="relative overflow-hidden rounded-xl border border-slate-200/80 bg-[#f5f6ff] p-6 shadow-sm sm:p-8 md:p-10 dark:border-slate-800 dark:bg-[#0d0f17]">
                        {/* Grid Pattern Motif */}
                        <div
                            className="pointer-events-none absolute inset-0 z-0"
                            style={{
                                backgroundImage: `
                                    linear-gradient(rgba(59, 40, 246, 0.07) 1px, transparent 1px),
                                    linear-gradient(90deg, rgba(59, 40, 246, 0.07) 1px, transparent 1px)
                                `,
                                backgroundSize: '40px 40px',
                            }}
                        />

                        <div className="absolute top-0 right-8 left-8 z-0 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />

                        <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                            <div className="max-w-2xl space-y-3">
                                <span className="inline-block text-[0.6rem] font-semibold tracking-[0.2em] text-slate-500 uppercase dark:text-slate-500">
                                    Assets Dashboard
                                </span>
                                <h1 className="text-2xl leading-snug font-semibold tracking-tight text-slate-800 md:text-[28px] dark:text-white">
                                    Assets Management
                                </h1>
                                <p className="text-sm leading-relaxed text-slate-500 md:text-[15px] dark:text-slate-400/60">
                                    Click on any category below to inspect and
                                    manage game assets directly inline.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* CATEGORY CARDS (TABS) */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {/* RANK CARD */}
                        <button
                            type="button"
                            onClick={() => setActiveTab('ranks')}
                            className={`group relative cursor-pointer overflow-hidden rounded-xl border p-5 text-left transition-all duration-200 ${
                                activeTab === 'ranks'
                                    ? 'border-[#7C5CFF] bg-white shadow-lg ring-2 shadow-[#7C5CFF]/10 ring-[#7C5CFF]/30 dark:bg-[#0d0f1a] dark:shadow-[#7C5CFF]/15'
                                    : 'border-slate-200 bg-white hover:border-[#7C5CFF]/40 hover:bg-slate-50 dark:border-white/8 dark:bg-[#060B1A]/80 dark:hover:bg-[#090e22]'
                            }`}
                        >
                            <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-[#7C5CFF]/40 to-transparent" />
                            <div className="mb-3 flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <div
                                        className={`rounded-lg border p-2 ${activeTab === 'ranks' ? 'border-[#7C5CFF]/40 bg-[#7C5CFF]/20 text-[#7C5CFF]' : 'border-slate-200 bg-slate-100 text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400'}`}
                                    >
                                        <Shield size={20} />
                                    </div>
                                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                                        Level Rank
                                    </h2>
                                </div>
                                <span className="rounded-lg border border-[#7C5CFF]/20 bg-[#7C5CFF]/10 px-2.5 py-1 text-xs font-semibold text-[#7C5CFF]">
                                    {stats?.ranks ?? rankItems.length}
                                </span>
                            </div>
                            <p className="text-slate-550 text-sm leading-relaxed dark:text-slate-400">
                                Manage progression tiers and student ranking
                                system
                            </p>
                        </button>

                        {/* CHARACTER CARD */}
                        <button
                            type="button"
                            onClick={() => setActiveTab('characters')}
                            className={`group relative cursor-pointer overflow-hidden rounded-xl border p-5 text-left transition-all duration-200 ${
                                activeTab === 'characters'
                                    ? 'border-[#7C5CFF] bg-white shadow-lg ring-2 shadow-[#7C5CFF]/10 ring-[#7C5CFF]/30 dark:bg-[#0d0f1a] dark:shadow-[#7C5CFF]/15'
                                    : 'border-slate-200 bg-white hover:border-[#7C5CFF]/40 hover:bg-slate-50 dark:border-white/8 dark:bg-[#060B1A]/80 dark:hover:bg-[#090e22]'
                            }`}
                        >
                            <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-[#7C5CFF]/40 to-transparent" />
                            <div className="mb-3 flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <div
                                        className={`rounded-lg border p-2 ${activeTab === 'characters' ? 'border-[#7C5CFF]/40 bg-[#7C5CFF]/20 text-[#7C5CFF]' : 'border-slate-200 bg-slate-100 text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400'}`}
                                    >
                                        <UserCheck size={20} />
                                    </div>
                                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                                        Character
                                    </h2>
                                </div>
                                <span className="rounded-lg border border-[#7C5CFF]/20 bg-[#7C5CFF]/10 px-2.5 py-1 text-xs font-semibold text-[#7C5CFF]">
                                    {stats?.characters ?? characterItems.length}
                                </span>
                            </div>
                            <p className="text-slate-550 text-sm leading-relaxed dark:text-slate-400">
                                Manage avatars and playable student identities
                            </p>
                        </button>

                        {/* BADGE CARD */}
                        <button
                            type="button"
                            onClick={() => setActiveTab('badges')}
                            className={`group relative cursor-pointer overflow-hidden rounded-xl border p-5 text-left transition-all duration-200 ${
                                activeTab === 'badges'
                                    ? 'border-[#7C5CFF] bg-white shadow-lg ring-2 shadow-[#7C5CFF]/10 ring-[#7C5CFF]/30 dark:bg-[#0d0f1a] dark:shadow-[#7C5CFF]/15'
                                    : 'border-slate-200 bg-white hover:border-[#7C5CFF]/40 hover:bg-slate-50 dark:border-white/8 dark:bg-[#060B1A]/80 dark:hover:bg-[#090e22]'
                            }`}
                        >
                            <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-[#7C5CFF]/40 to-transparent" />
                            <div className="mb-3 flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <div
                                        className={`rounded-lg border p-2 ${activeTab === 'badges' ? 'border-[#7C5CFF]/40 bg-[#7C5CFF]/20 text-[#7C5CFF]' : 'border-slate-200 bg-slate-100 text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400'}`}
                                    >
                                        <Award size={20} />
                                    </div>
                                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                                        Level Badge
                                    </h2>
                                </div>
                                <span className="rounded-lg border border-[#7C5CFF]/20 bg-[#7C5CFF]/10 px-2.5 py-1 text-xs font-semibold text-[#7C5CFF]">
                                    {stats?.badges ?? badgeItems.length}
                                </span>
                            </div>
                            <p className="text-slate-550 text-sm leading-relaxed dark:text-slate-400">
                                Manage achievements, icons, and level milestones
                            </p>
                        </button>
                    </div>

                    {/* DYNAMIC CONTENT CONTAINER (BELOW CARDS) */}
                    <div className="text-slate-855 relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-xl backdrop-blur-md transition-all dark:border-white/10 dark:bg-[#060B1A]/90 dark:text-white">
                        <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-[#7C5CFF]/30 to-transparent" />

                        {/* TAB 1: LEVEL RANKS */}
                        {activeTab === 'ranks' && (
                            <div className="space-y-6">
                                <div className="flex flex-col gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/8">
                                    <div>
                                        <h2
                                            className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white"
                                            style={{
                                                fontFamily:
                                                    'Orbitron, sans-serif',
                                            }}
                                        >
                                            <Shield
                                                className="text-[#7C5CFF]"
                                                size={22}
                                            />
                                            Rank Management
                                        </h2>
                                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                            Drag and drop rows to reorder rank
                                            progression hierarchy.
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={saveRankOrder}
                                            disabled={isSavingRankOrder}
                                            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 transition-all hover:bg-slate-100 disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                                        >
                                            {isSavingRankOrder && (
                                                <Loader2
                                                    size={14}
                                                    className="animate-spin"
                                                />
                                            )}
                                            {isSavingRankOrder
                                                ? 'Saving...'
                                                : 'Save Order'}
                                        </button>
                                        <Link
                                            href="/admin/assets/ranks/create"
                                            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#7C5CFF] px-4 py-2 text-xs font-semibold text-white shadow-md transition-all hover:bg-[#6A4BE0]"
                                        >
                                            <Plus size={14} /> Add Rank
                                        </Link>
                                    </div>
                                </div>

                                {rankItems.length === 0 ? (
                                    <div className="dark:text-slate-550 py-12 text-center text-slate-400">
                                        No ranks created yet. Click "+ Add Rank"
                                        above.
                                    </div>
                                ) : (
                                    <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-slate-50/50 dark:divide-white/5 dark:border-white/5 dark:bg-[#030712]/50">
                                        {rankItems.map((rank, index) => (
                                            <div
                                                key={rank.id}
                                                draggable
                                                onDragStart={(e) => {
                                                    e.dataTransfer.setData(
                                                        'index',
                                                        index.toString(),
                                                    );
                                                    e.currentTarget.classList.add(
                                                        'opacity-50',
                                                    );
                                                }}
                                                onDragEnd={(e) => {
                                                    e.currentTarget.classList.remove(
                                                        'opacity-50',
                                                    );
                                                }}
                                                onDragOver={(e) =>
                                                    e.preventDefault()
                                                }
                                                onDrop={(e) => {
                                                    const dragIndex = Number(
                                                        e.dataTransfer.getData(
                                                            'index',
                                                        ),
                                                    );
                                                    handleRankDrag(
                                                        dragIndex,
                                                        index,
                                                    );
                                                }}
                                                className="flex cursor-grab items-center justify-between p-4 transition-colors hover:bg-slate-100/50 active:cursor-grabbing dark:hover:bg-white/[0.02]"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white p-2 dark:border-white/10 dark:bg-white/5">
                                                        <img
                                                            src={rank.image_url}
                                                            onError={(e) => {
                                                                (
                                                                    e.currentTarget as HTMLImageElement
                                                                ).src =
                                                                    '/images/default-rank.png';
                                                            }}
                                                            className="h-full w-full object-contain"
                                                            alt={rank.name}
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="flex h-5 w-5 items-center justify-center rounded bg-slate-200 text-[10px] font-bold text-slate-600 dark:bg-white/10 dark:text-slate-300">
                                                                {index + 1}
                                                            </span>
                                                            <p className="text-sm font-semibold text-slate-800 dark:text-white">
                                                                {rank.name}
                                                            </p>
                                                        </div>
                                                        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                                            Drag to reorder rank
                                                            level
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Link
                                                        href={`/admin/assets/ranks/${rank.id}/edit`}
                                                        className="cursor-pointer rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-white/10 dark:hover:text-white"
                                                        title="Edit Rank"
                                                    >
                                                        <Edit2 size={16} />
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            deleteRank(
                                                                rank.id,
                                                                rank.name,
                                                            )
                                                        }
                                                        className="cursor-pointer rounded-lg p-2 text-slate-400 transition-colors hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400"
                                                        title="Delete Rank"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* TAB 2: CHARACTERS */}
                        {activeTab === 'characters' && (
                            <div className="space-y-6">
                                <div className="flex flex-col gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/8">
                                    <div>
                                        <h2
                                            className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white"
                                            style={{
                                                fontFamily:
                                                    'Orbitron, sans-serif',
                                            }}
                                        >
                                            <UserCheck
                                                className="text-[#7C5CFF]"
                                                size={22}
                                            />
                                            Character Roster
                                        </h2>
                                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                            Click any character to inspect full
                                            profile details in a modal.
                                        </p>
                                    </div>
                                    <Link
                                        href="/admin/assets/characters/create"
                                        className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#7C5CFF] px-4 py-2 text-xs font-semibold text-white shadow-md transition-all hover:bg-[#6A4BE0]"
                                    >
                                        <Plus size={14} /> Add Character
                                    </Link>
                                </div>

                                {characterItems.length === 0 ? (
                                    <div className="py-12 text-center text-slate-400 dark:text-slate-500">
                                        No characters created yet. Click "+ Add
                                        Character" above.
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                        {characterItems.map((char) => (
                                            <div
                                                key={char.id}
                                                onClick={() =>
                                                    setSelectedCharacter(char)
                                                }
                                                className="group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-[#7C5CFF]/50 hover:bg-slate-50/50 dark:border-white/8 dark:bg-[#030712]/60 dark:shadow-none dark:hover:bg-[#090e22]"
                                            >
                                                {/* Full Display Image (No bounding box/padding/cropped aspect ratio) */}
                                                <div className="mb-4 flex h-48 w-full items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50 transition-colors group-hover:border-[#7C5CFF]/30 dark:border-white/10 dark:bg-white/5">
                                                    <img
                                                        src={
                                                            char.avatar_url ||
                                                            '/images/default-avatar.png'
                                                        }
                                                        onError={(e) => {
                                                            (
                                                                e.currentTarget as HTMLImageElement
                                                            ).src =
                                                                '/images/default-avatar.png';
                                                        }}
                                                        className="h-full max-w-full object-contain"
                                                        alt={char.name}
                                                    />
                                                </div>

                                                <div>
                                                    <h3 className="text-base font-semibold text-slate-800 transition-colors group-hover:text-[#7C5CFF] dark:text-white">
                                                        {char.name}
                                                    </h3>
                                                    {char.tagline && (
                                                        <p className="mt-0.5 line-clamp-1 text-xs text-slate-500 dark:text-slate-400">
                                                            {char.tagline}
                                                        </p>
                                                    )}
                                                </div>

                                                {char.backstory && (
                                                    <p className="my-3 line-clamp-2 text-xs leading-relaxed text-slate-500 italic dark:text-slate-400/90">
                                                        "{char.backstory}"
                                                    </p>
                                                )}

                                                <div className="border-slate-105 mt-auto flex items-center justify-between border-t pt-3 text-xs font-medium text-[#7C5CFF] dark:border-white/5">
                                                    <span>
                                                        View Character Profile
                                                        &rarr;
                                                    </span>
                                                    <div
                                                        className="flex items-center gap-1"
                                                        onClick={(e) =>
                                                            e.stopPropagation()
                                                        }
                                                    >
                                                        <Link
                                                            href={`/admin/assets/characters/${char.id}/edit`}
                                                            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-[#7C5CFF]/20 dark:hover:text-white"
                                                            title="Edit Character"
                                                        >
                                                            <Edit2 size={14} />
                                                        </Link>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                deleteCharacter(
                                                                    char.id,
                                                                    char.name,
                                                                )
                                                            }
                                                            className="dark:hover:text-rose-455 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/20"
                                                            title="Delete Character"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* TAB 3: LEVEL BADGES */}
                        {activeTab === 'badges' && (
                            <div className="space-y-6">
                                <div className="flex flex-col gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/8">
                                    <div>
                                        <h2
                                            className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white"
                                            style={{
                                                fontFamily:
                                                    'Orbitron, sans-serif',
                                            }}
                                        >
                                            <Award
                                                className="text-[#7C5CFF]"
                                                size={22}
                                            />
                                            Level Badges
                                        </h2>
                                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                            Drag and drop to reorder student
                                            achievement badges.
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={saveBadgeOrder}
                                            disabled={isSavingBadgeOrder}
                                            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 transition-all hover:bg-slate-100 disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                                        >
                                            {isSavingBadgeOrder && (
                                                <Loader2
                                                    size={14}
                                                    className="animate-spin"
                                                />
                                            )}
                                            {isSavingBadgeOrder
                                                ? 'Saving...'
                                                : 'Save Order'}
                                        </button>
                                        <Link
                                            href="/admin/assets/badges/create"
                                            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#7C5CFF] px-4 py-2 text-xs font-semibold text-white shadow-md transition-all hover:bg-[#6A4BE0]"
                                        >
                                            <Plus size={14} /> Add Badge
                                        </Link>
                                    </div>
                                </div>

                                {badgeItems.length === 0 ? (
                                    <div className="dark:text-slate-550 py-12 text-center text-slate-400">
                                        No badges created yet. Click "+ Add
                                        Badge" above.
                                    </div>
                                ) : (
                                    <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-slate-50/50 dark:divide-white/5 dark:border-white/5 dark:bg-[#030712]/50">
                                        {badgeItems.map((badge, index) => (
                                            <div
                                                key={badge.id}
                                                draggable
                                                onDragStart={(e) => {
                                                    e.dataTransfer.setData(
                                                        'index',
                                                        index.toString(),
                                                    );
                                                    e.currentTarget.classList.add(
                                                        'opacity-50',
                                                    );
                                                }}
                                                onDragEnd={(e) => {
                                                    e.currentTarget.classList.remove(
                                                        'opacity-50',
                                                    );
                                                }}
                                                onDragOver={(e) =>
                                                    e.preventDefault()
                                                }
                                                onDrop={(e) => {
                                                    const dragIndex = Number(
                                                        e.dataTransfer.getData(
                                                            'index',
                                                        ),
                                                    );
                                                    handleBadgeDrag(
                                                        dragIndex,
                                                        index,
                                                    );
                                                }}
                                                className="flex cursor-grab items-center justify-between p-4 transition-colors hover:bg-slate-100/50 active:cursor-grabbing dark:hover:bg-white/[0.02]"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white p-2 dark:border-white/10 dark:bg-white/5">
                                                        <img
                                                            src={
                                                                badge.icon_url ||
                                                                '/images/default-badge.png'
                                                            }
                                                            onError={(e) => {
                                                                (
                                                                    e.currentTarget as HTMLImageElement
                                                                ).src =
                                                                    '/images/default-badge.png';
                                                            }}
                                                            className="h-full w-full object-contain"
                                                            alt={badge.name}
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="flex h-5 w-5 items-center justify-center rounded bg-slate-200 text-[10px] font-bold text-slate-600 dark:bg-white/10 dark:text-slate-300">
                                                                {index + 1}
                                                            </span>
                                                            <p className="text-sm font-semibold text-slate-800 dark:text-white">
                                                                {badge.name}
                                                            </p>
                                                        </div>
                                                        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                                            Drag to reorder
                                                            badge position
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Link
                                                        href={`/admin/assets/badges/${badge.id}/edit`}
                                                        className="cursor-pointer rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-white/10 dark:hover:text-white"
                                                        title="Edit Badge"
                                                    >
                                                        <Edit2 size={16} />
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            deleteBadge(
                                                                badge.id,
                                                                badge.name,
                                                            )
                                                        }
                                                        className="cursor-pointer rounded-lg p-2 text-slate-400 transition-colors hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400"
                                                        title="Delete Badge"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* CHARACTER DETAIL MODAL */}
            {selectedCharacter && (
                <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md dark:bg-black/80">
                    <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-800 shadow-2xl dark:border-white/15 dark:bg-[#0a0d18] dark:text-white">
                        {/* Top Accent line & header */}
                        <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

                        <div className="relative max-h-[90vh] space-y-6 overflow-y-auto p-6 sm:p-8">
                            <button
                                type="button"
                                onClick={() => setSelectedCharacter(null)}
                                className="absolute top-5 right-5 rounded-full bg-slate-100 p-2 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-800 dark:bg-white/5 dark:text-slate-400 dark:hover:bg-white/15 dark:hover:text-white"
                            >
                                <X size={20} />
                            </button>

                            {/* Main Info */}
                            <div className="flex flex-col items-center gap-6 pt-2 sm:flex-row sm:items-start">
                                <div className="flex h-48 w-48 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-2 dark:border-white/10 dark:bg-white/5">
                                    <img
                                        src={
                                            selectedCharacter.avatar_url ||
                                            '/images/default-avatar.png'
                                        }
                                        onError={(e) => {
                                            (
                                                e.currentTarget as HTMLImageElement
                                            ).src =
                                                '/images/default-avatar.png';
                                        }}
                                        className="h-full max-w-full object-contain"
                                        alt={selectedCharacter.name}
                                    />
                                </div>
                                <div className="flex-1 space-y-1.5 text-center sm:text-left">
                                    <h2
                                        className="flex items-center justify-center gap-2 text-2xl font-bold text-slate-900 sm:justify-start dark:text-white"
                                        style={{
                                            fontFamily: 'Orbitron, sans-serif',
                                        }}
                                    >
                                        {selectedCharacter.name}
                                    </h2>
                                    {selectedCharacter.tagline && (
                                        <p className="text-sm font-medium text-[#7C5CFF]">
                                            {selectedCharacter.tagline}
                                        </p>
                                    )}
                                    {selectedCharacter.quote && (
                                        <p className="flex items-center justify-center gap-1.5 pt-1 text-xs text-slate-500 italic sm:justify-start dark:text-slate-400">
                                            <Quote
                                                size={12}
                                                className="shrink-0 text-slate-400 dark:text-slate-500"
                                            />
                                            "{selectedCharacter.quote}"
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Backstory */}
                            {selectedCharacter.backstory && (
                                <div className="border-slate-150 space-y-2 rounded-xl border bg-slate-50 p-4 dark:border-white/8 dark:bg-white/[0.02]">
                                    <h4 className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                        <BookOpen
                                            size={14}
                                            className="text-[#7C5CFF]"
                                        />{' '}
                                        Backstory
                                    </h4>
                                    <p className="text-sm leading-relaxed whitespace-pre-line text-slate-600 dark:text-slate-300">
                                        {selectedCharacter.backstory}
                                    </p>
                                </div>
                            )}

                            {/* Guide Power & Bonuses */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                {selectedCharacter.guide_power?.title && (
                                    <div className="border-slate-150 space-y-1 rounded-xl border bg-slate-50 p-4 dark:border-white/8 dark:bg-white/[0.02]">
                                        <h4 className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-amber-600 uppercase dark:text-amber-400">
                                            <Zap size={14} /> Guide Power:{' '}
                                            {
                                                selectedCharacter.guide_power
                                                    .title
                                            }
                                        </h4>
                                        <p className="text-slate-650 text-xs dark:text-slate-300">
                                            {
                                                selectedCharacter.guide_power
                                                    .description
                                            }
                                        </p>
                                    </div>
                                )}

                                {(selectedCharacter.system_bonus?.exp_boost ||
                                    selectedCharacter.system_bonus
                                        ?.gold_boost) && (
                                    <div className="border-slate-150 space-y-1 rounded-xl border bg-slate-50 p-4 dark:border-white/8 dark:bg-white/[0.02]">
                                        <h4 className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-emerald-600 uppercase dark:text-emerald-400">
                                            <Sparkles size={14} /> System Bonus
                                        </h4>
                                        <div className="text-slate-650 flex gap-4 text-xs font-medium dark:text-slate-300">
                                            {selectedCharacter.system_bonus
                                                .exp_boost && (
                                                <span>
                                                    EXP Boost:{' '}
                                                    <strong className="text-slate-800 dark:text-white">
                                                        +
                                                        {
                                                            selectedCharacter
                                                                .system_bonus
                                                                .exp_boost
                                                        }
                                                        %
                                                    </strong>
                                                </span>
                                            )}
                                            {selectedCharacter.system_bonus
                                                .gold_boost && (
                                                <span>
                                                    Gold Boost:{' '}
                                                    <strong className="text-slate-800 dark:text-white">
                                                        +
                                                        {
                                                            selectedCharacter
                                                                .system_bonus
                                                                .gold_boost
                                                        }
                                                        %
                                                    </strong>
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Tags */}
                            <div className="space-y-3 pt-2">
                                {Array.isArray(
                                    selectedCharacter.character_type,
                                ) &&
                                    selectedCharacter.character_type.length >
                                        0 && (
                                        <div>
                                            <span className="mb-1 block text-[11px] font-semibold text-slate-500 uppercase dark:text-slate-400">
                                                Character Types
                                            </span>
                                            <div className="flex flex-wrap gap-1.5">
                                                {selectedCharacter.character_type.map(
                                                    (t, i) => (
                                                        <span
                                                            key={i}
                                                            className="rounded-md border border-[#7C5CFF]/20 bg-[#7C5CFF]/10 px-2.5 py-0.5 text-xs text-[#7C5CFF] dark:border-[#7C5CFF]/30 dark:bg-[#7C5CFF]/15"
                                                        >
                                                            {t}
                                                        </span>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    )}

                                {Array.isArray(selectedCharacter.abilities) &&
                                    selectedCharacter.abilities.length > 0 && (
                                        <div>
                                            <span className="mb-1 block text-[11px] font-semibold text-slate-500 uppercase dark:text-slate-400">
                                                Abilities
                                            </span>
                                            <div className="flex flex-wrap gap-1.5">
                                                {selectedCharacter.abilities.map(
                                                    (a, i) => (
                                                        <span
                                                            key={i}
                                                            className="rounded-md border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-xs text-slate-700 dark:border-white/15 dark:bg-white/10 dark:text-slate-200"
                                                        >
                                                            {a}
                                                        </span>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    )}
                            </div>

                            {/* Actions Footer */}
                            <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4 dark:border-white/10">
                                <Link
                                    href={`/admin/assets/characters/${selectedCharacter.id}/edit`}
                                    className="flex cursor-pointer items-center gap-2 rounded-xl bg-[#7C5CFF] px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-[#7C5CFF]/20 transition-colors hover:bg-[#6A4BE0]"
                                >
                                    <Edit2 size={16} /> Edit Character
                                </Link>
                                <button
                                    type="button"
                                    onClick={() =>
                                        deleteCharacter(
                                            selectedCharacter.id,
                                            selectedCharacter.name,
                                        )
                                    }
                                    className="flex cursor-pointer items-center gap-2 rounded-xl border border-rose-200 bg-rose-500/10 px-4 py-2.5 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-500/20 dark:border-rose-500/20 dark:text-rose-400"
                                >
                                    <Trash2 size={16} /> Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmModal
                open={confirmModal.open}
                onClose={() =>
                    setConfirmModal((prev) => ({ ...prev, open: false }))
                }
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
                confirmText={confirmModal.confirmText}
                variant={confirmModal.variant}
            />
        </AppLayout>
    );
}
