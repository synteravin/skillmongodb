import { useState, useEffect } from "react";
import { Link, router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Loader2, Plus, Edit2, Trash2, Shield, UserCheck, Award, X, Zap, Sparkles, Quote, BookOpen } from "lucide-react";
import ConfirmModal from "@/components/ui/ConfirmModal";

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

export default function AssetsPage({ stats, ranks = [], characters = [], badges = [] }: AssetsPageProps) {
    const [activeTab, setActiveTab] = useState<'ranks' | 'characters' | 'badges'>('ranks');

    // State for drag & drop lists
    const [rankItems, setRankItems] = useState<Rank[]>(ranks);
    const [badgeItems, setBadgeItems] = useState<LevelBadge[]>(badges);
    const [characterItems, setCharacterItems] = useState<Character[]>(characters);
    
    // Character Modal state
    const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

    const [isSavingRankOrder, setIsSavingRankOrder] = useState(false);
    const [isSavingBadgeOrder, setIsSavingBadgeOrder] = useState(false);

    useEffect(() => { setRankItems(ranks); }, [ranks]);
    useEffect(() => { setBadgeItems(badges); }, [badges]);
    useEffect(() => { setCharacterItems(characters); }, [characters]);

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
        router.post('/admin/assets/ranks/reorder', { ranks: payload }, {
            onFinish: () => setIsSavingRankOrder(false),
        });
    };

    const saveBadgeOrder = () => {
        setIsSavingBadgeOrder(true);
        const payload = badgeItems.map((item, index) => ({
            id: item.id,
            order: index + 1,
        }));
        router.post('/admin/assets/badges/reorder', { badges: payload }, {
            onFinish: () => setIsSavingBadgeOrder(false),
        });
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
            <div className="relative min-h-screen bg-[#f8fafc] dark:bg-[#030712] text-slate-800 dark:text-white px-4 py-6 sm:px-6 lg:px-10 overflow-hidden transition-colors duration-200" style={{ fontFamily: "'Outfit', sans-serif" }}>
                {/* Ambient Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] pointer-events-none select-none z-0 bg-indigo-500/[0.04] dark:bg-[radial-gradient(circle_at_top_center,rgba(59,40,246,0.12),transparent_50%)]" />

                <div className="relative z-10 mx-auto max-w-7xl space-y-6">
                    {/* HEADER */}
                    {/* HEADER */}
                    <div className="relative overflow-hidden rounded-xl border border-slate-200/80 p-6 sm:p-8 md:p-10 bg-[#f5f6ff] dark:bg-[#0d0f17] dark:border-slate-800 shadow-sm">
                        {/* Grid Pattern Motif */}
                        <div 
                            className="absolute inset-0 z-0 pointer-events-none"
                            style={{
                                backgroundImage: `
                                    linear-gradient(rgba(59, 40, 246, 0.07) 1px, transparent 1px),
                                    linear-gradient(90deg, rgba(59, 40, 246, 0.07) 1px, transparent 1px)
                                `,
                                backgroundSize: '40px 40px',
                            }}
                        />

                        <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700 z-0" />

                        <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                            <div className="max-w-2xl space-y-3">
                                <span className="inline-block text-[0.6rem] font-semibold tracking-[0.2em] text-slate-500 uppercase dark:text-slate-500">
                                    Assets Dashboard
                                </span>
                                <h1 className="text-2xl md:text-[28px] font-semibold tracking-tight text-slate-800 dark:text-white leading-snug">
                                    Assets Management
                                </h1>
                                <p className="text-slate-500 dark:text-slate-400/60 text-sm md:text-[15px] leading-relaxed">
                                    Click on any category below to inspect and manage game assets directly inline.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* CATEGORY CARDS (TABS) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* RANK CARD */}
                        <button
                            type="button"
                            onClick={() => setActiveTab('ranks')}
                            className={`group relative text-left overflow-hidden rounded-xl border p-5 transition-all duration-200 cursor-pointer ${
                                activeTab === 'ranks'
                                    ? 'border-[#7C5CFF] bg-white dark:bg-[#0d0f1a] shadow-lg shadow-[#7C5CFF]/10 dark:shadow-[#7C5CFF]/15 ring-2 ring-[#7C5CFF]/30'
                                    : 'border-slate-200 dark:border-white/8 bg-white dark:bg-[#060B1A]/80 hover:border-[#7C5CFF]/40 hover:bg-slate-50 dark:hover:bg-[#090e22]'
                            }`}
                        >
                            <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-[#7C5CFF]/40 to-transparent" />
                            <div className="flex justify-between items-center mb-3">
                                <div className="flex items-center gap-2.5">
                                    <div className={`p-2 rounded-lg border ${activeTab === 'ranks' ? 'bg-[#7C5CFF]/20 text-[#7C5CFF] border-[#7C5CFF]/40' : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-white/10'}`}>
                                        <Shield size={20} />
                                    </div>
                                    <h2 className="font-semibold text-lg text-slate-900 dark:text-white">Level Rank</h2>
                                </div>
                                <span className="text-xs text-[#7C5CFF] font-semibold bg-[#7C5CFF]/10 px-2.5 py-1 rounded-lg border border-[#7C5CFF]/20">
                                    {stats?.ranks ?? rankItems.length}
                                </span>
                            </div>
                            <p className="text-sm text-slate-550 dark:text-slate-400 leading-relaxed">
                                Manage progression tiers and student ranking system
                            </p>
                        </button>

                        {/* CHARACTER CARD */}
                        <button
                            type="button"
                            onClick={() => setActiveTab('characters')}
                            className={`group relative text-left overflow-hidden rounded-xl border p-5 transition-all duration-200 cursor-pointer ${
                                activeTab === 'characters'
                                    ? 'border-[#7C5CFF] bg-white dark:bg-[#0d0f1a] shadow-lg shadow-[#7C5CFF]/10 dark:shadow-[#7C5CFF]/15 ring-2 ring-[#7C5CFF]/30'
                                    : 'border-slate-200 dark:border-white/8 bg-white dark:bg-[#060B1A]/80 hover:border-[#7C5CFF]/40 hover:bg-slate-50 dark:hover:bg-[#090e22]'
                            }`}
                        >
                            <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-[#7C5CFF]/40 to-transparent" />
                            <div className="flex justify-between items-center mb-3">
                                <div className="flex items-center gap-2.5">
                                    <div className={`p-2 rounded-lg border ${activeTab === 'characters' ? 'bg-[#7C5CFF]/20 text-[#7C5CFF] border-[#7C5CFF]/40' : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-white/10'}`}>
                                        <UserCheck size={20} />
                                    </div>
                                    <h2 className="font-semibold text-lg text-slate-900 dark:text-white">Character</h2>
                                </div>
                                <span className="text-xs text-[#7C5CFF] font-semibold bg-[#7C5CFF]/10 px-2.5 py-1 rounded-lg border border-[#7C5CFF]/20">
                                    {stats?.characters ?? characterItems.length}
                                </span>
                            </div>
                            <p className="text-sm text-slate-550 dark:text-slate-400 leading-relaxed">
                                Manage avatars and playable student identities
                            </p>
                        </button>

                        {/* BADGE CARD */}
                        <button
                            type="button"
                            onClick={() => setActiveTab('badges')}
                            className={`group relative text-left overflow-hidden rounded-xl border p-5 transition-all duration-200 cursor-pointer ${
                                activeTab === 'badges'
                                    ? 'border-[#7C5CFF] bg-white dark:bg-[#0d0f1a] shadow-lg shadow-[#7C5CFF]/10 dark:shadow-[#7C5CFF]/15 ring-2 ring-[#7C5CFF]/30'
                                    : 'border-slate-200 dark:border-white/8 bg-white dark:bg-[#060B1A]/80 hover:border-[#7C5CFF]/40 hover:bg-slate-50 dark:hover:bg-[#090e22]'
                            }`}
                        >
                            <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-[#7C5CFF]/40 to-transparent" />
                            <div className="flex justify-between items-center mb-3">
                                <div className="flex items-center gap-2.5">
                                    <div className={`p-2 rounded-lg border ${activeTab === 'badges' ? 'bg-[#7C5CFF]/20 text-[#7C5CFF] border-[#7C5CFF]/40' : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-white/10'}`}>
                                        <Award size={20} />
                                    </div>
                                    <h2 className="font-semibold text-lg text-slate-900 dark:text-white">Level Badge</h2>
                                </div>
                                <span className="text-xs text-[#7C5CFF] font-semibold bg-[#7C5CFF]/10 px-2.5 py-1 rounded-lg border border-[#7C5CFF]/20">
                                    {stats?.badges ?? badgeItems.length}
                                </span>
                            </div>
                            <p className="text-sm text-slate-550 dark:text-slate-400 leading-relaxed">
                                Manage achievements, icons, and level milestones
                            </p>
                        </button>
                    </div>

                    {/* DYNAMIC CONTENT CONTAINER (BELOW CARDS) */}
                    <div className="relative overflow-hidden rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#060B1A]/90 p-6 shadow-xl backdrop-blur-md transition-all text-slate-855 dark:text-white">
                        <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-[#7C5CFF]/30 to-transparent" />

                        {/* TAB 1: LEVEL RANKS */}
                        {activeTab === 'ranks' && (
                            <div className="space-y-6">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-200 dark:border-white/8">
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                                            <Shield className="text-[#7C5CFF]" size={22} />
                                            Rank Management
                                        </h2>
                                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                            Drag and drop rows to reorder rank progression hierarchy.
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={saveRankOrder}
                                            disabled={isSavingRankOrder}
                                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-white transition-all hover:bg-slate-100 dark:hover:bg-white/10 disabled:opacity-50 cursor-pointer"
                                        >
                                            {isSavingRankOrder && <Loader2 size={14} className="animate-spin" />}
                                            {isSavingRankOrder ? 'Saving...' : 'Save Order'}
                                        </button>
                                        <Link
                                            href="/admin/assets/ranks/create"
                                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#7C5CFF] hover:bg-[#6A4BE0] px-4 py-2 text-xs font-semibold text-white shadow-md transition-all cursor-pointer"
                                        >
                                            <Plus size={14} /> Add Rank
                                        </Link>
                                    </div>
                                </div>

                                {rankItems.length === 0 ? (
                                    <div className="py-12 text-center text-slate-400 dark:text-slate-550">
                                        No ranks created yet. Click "+ Add Rank" above.
                                    </div>
                                ) : (
                                    <div className="divide-y divide-slate-100 dark:divide-white/5 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-[#030712]/50">
                                        {rankItems.map((rank, index) => (
                                            <div
                                                key={rank.id}
                                                draggable
                                                onDragStart={(e) => {
                                                    e.dataTransfer.setData('index', index.toString());
                                                    e.currentTarget.classList.add('opacity-50');
                                                }}
                                                onDragEnd={(e) => {
                                                    e.currentTarget.classList.remove('opacity-50');
                                                }}
                                                onDragOver={(e) => e.preventDefault()}
                                                onDrop={(e) => {
                                                    const dragIndex = Number(e.dataTransfer.getData('index'));
                                                    handleRankDrag(dragIndex, index);
                                                }}
                                                className="flex cursor-grab items-center justify-between p-4 transition-colors hover:bg-slate-100/50 dark:hover:bg-white/[0.02] active:cursor-grabbing"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-2">
                                                        <img
                                                            src={rank.image_url}
                                                            onError={(e) => {
                                                                (e.currentTarget as HTMLImageElement).src = '/images/default-rank.png';
                                                            }}
                                                            className="h-full w-full object-contain"
                                                            alt={rank.name}
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="flex h-5 w-5 items-center justify-center rounded bg-slate-200 dark:bg-white/10 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                                                                {index + 1}
                                                            </span>
                                                            <p className="text-sm font-semibold text-slate-800 dark:text-white">
                                                                {rank.name}
                                                            </p>
                                                        </div>
                                                        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                                            Drag to reorder rank level
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Link
                                                        href={`/admin/assets/ranks/${rank.id}/edit`}
                                                        className="p-2 text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                                                        title="Edit Rank"
                                                    >
                                                        <Edit2 size={16} />
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => deleteRank(rank.id, rank.name)}
                                                        className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
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
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-200 dark:border-white/8">
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                                            <UserCheck className="text-[#7C5CFF]" size={22} />
                                            Character Roster
                                        </h2>
                                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                            Click any character to inspect full profile details in a modal.
                                        </p>
                                    </div>
                                    <Link
                                        href="/admin/assets/characters/create"
                                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#7C5CFF] hover:bg-[#6A4BE0] px-4 py-2 text-xs font-semibold text-white shadow-md transition-all cursor-pointer"
                                    >
                                        <Plus size={14} /> Add Character
                                    </Link>
                                </div>

                                {characterItems.length === 0 ? (
                                    <div className="py-12 text-center text-slate-400 dark:text-slate-500">
                                        No characters created yet. Click "+ Add Character" above.
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {characterItems.map((char) => (
                                            <div
                                                key={char.id}
                                                onClick={() => setSelectedCharacter(char)}
                                                className="group relative overflow-hidden rounded-xl border border-slate-200 dark:border-white/8 bg-white dark:bg-[#030712]/60 p-4 hover:border-[#7C5CFF]/50 hover:bg-slate-50/50 dark:hover:bg-[#090e22] transition-all flex flex-col justify-between cursor-pointer shadow-sm dark:shadow-none"
                                            >
                                                {/* Full Display Image (No bounding box/padding/cropped aspect ratio) */}
                                                <div className="w-full h-48 mb-4 flex items-center justify-center bg-slate-50 dark:bg-white/5 rounded-lg overflow-hidden group-hover:border-[#7C5CFF]/30 border border-slate-200 dark:border-white/10 transition-colors">
                                                    <img
                                                        src={char.avatar_url || '/images/default-avatar.png'}
                                                        onError={(e) => {
                                                            (e.currentTarget as HTMLImageElement).src = '/images/default-avatar.png';
                                                        }}
                                                        className="h-full max-w-full object-contain"
                                                        alt={char.name}
                                                    />
                                                </div>

                                                <div>
                                                    <h3 className="font-semibold text-slate-800 dark:text-white text-base group-hover:text-[#7C5CFF] transition-colors">
                                                        {char.name}
                                                    </h3>
                                                    {char.tagline && (
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                                                            {char.tagline}
                                                        </p>
                                                    )}
                                                </div>

                                                {char.backstory && (
                                                    <p className="text-xs text-slate-500 dark:text-slate-400/90 line-clamp-2 my-3 italic leading-relaxed">
                                                        "{char.backstory}"
                                                    </p>
                                                )}

                                                <div className="flex items-center justify-between pt-3 border-t border-slate-105 dark:border-white/5 mt-auto text-xs text-[#7C5CFF] font-medium">
                                                    <span>View Character Profile &rarr;</span>
                                                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                                        <Link
                                                            href={`/admin/assets/characters/${char.id}/edit`}
                                                            className="p-1.5 hover:bg-slate-100 dark:hover:bg-[#7C5CFF]/20 text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-lg transition-colors"
                                                            title="Edit Character"
                                                        >
                                                            <Edit2 size={14} />
                                                        </Link>
                                                        <button
                                                            type="button"
                                                            onClick={() => deleteCharacter(char.id, char.name)}
                                                            className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-500/20 text-slate-400 hover:text-rose-600 dark:hover:text-rose-455 rounded-lg transition-colors"
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
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-200 dark:border-white/8">
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                                            <Award className="text-[#7C5CFF]" size={22} />
                                            Level Badges
                                        </h2>
                                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                            Drag and drop to reorder student achievement badges.
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={saveBadgeOrder}
                                            disabled={isSavingBadgeOrder}
                                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-white transition-all hover:bg-slate-100 dark:hover:bg-white/10 disabled:opacity-50 cursor-pointer"
                                        >
                                            {isSavingBadgeOrder && <Loader2 size={14} className="animate-spin" />}
                                            {isSavingBadgeOrder ? 'Saving...' : 'Save Order'}
                                        </button>
                                        <Link
                                            href="/admin/assets/badges/create"
                                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#7C5CFF] hover:bg-[#6A4BE0] px-4 py-2 text-xs font-semibold text-white shadow-md transition-all cursor-pointer"
                                        >
                                            <Plus size={14} /> Add Badge
                                        </Link>
                                    </div>
                                </div>

                                {badgeItems.length === 0 ? (
                                    <div className="py-12 text-center text-slate-400 dark:text-slate-550">
                                        No badges created yet. Click "+ Add Badge" above.
                                    </div>
                                ) : (
                                    <div className="divide-y divide-slate-100 dark:divide-white/5 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-[#030712]/50">
                                        {badgeItems.map((badge, index) => (
                                            <div
                                                key={badge.id}
                                                draggable
                                                onDragStart={(e) => {
                                                    e.dataTransfer.setData('index', index.toString());
                                                    e.currentTarget.classList.add('opacity-50');
                                                }}
                                                onDragEnd={(e) => {
                                                    e.currentTarget.classList.remove('opacity-50');
                                                }}
                                                onDragOver={(e) => e.preventDefault()}
                                                onDrop={(e) => {
                                                    const dragIndex = Number(e.dataTransfer.getData('index'));
                                                    handleBadgeDrag(dragIndex, index);
                                                }}
                                                className="flex cursor-grab items-center justify-between p-4 transition-colors hover:bg-slate-100/50 dark:hover:bg-white/[0.02] active:cursor-grabbing"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-2">
                                                        <img
                                                            src={badge.icon_url || '/images/default-badge.png'}
                                                            onError={(e) => {
                                                                (e.currentTarget as HTMLImageElement).src = '/images/default-badge.png';
                                                            }}
                                                            className="h-full w-full object-contain"
                                                            alt={badge.name}
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="flex h-5 w-5 items-center justify-center rounded bg-slate-200 dark:bg-white/10 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                                                                {index + 1}
                                                            </span>
                                                            <p className="text-sm font-semibold text-slate-800 dark:text-white">
                                                                {badge.name}
                                                            </p>
                                                        </div>
                                                        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                                            Drag to reorder badge position
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Link
                                                        href={`/admin/assets/badges/${badge.id}/edit`}
                                                        className="p-2 text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                                                        title="Edit Badge"
                                                    >
                                                        <Edit2 size={16} />
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => deleteBadge(badge.id, badge.name)}
                                                        className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-md p-4 animate-fade-in">
                    <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 dark:border-white/15 bg-white dark:bg-[#0a0d18] text-slate-800 dark:text-white shadow-2xl">
                        {/* Top Accent line & header */}
                        <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                        
                        <div className="relative p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
                            <button
                                type="button"
                                onClick={() => setSelectedCharacter(null)}
                                className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-400 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>

                            {/* Main Info */}
                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pt-2">
                                <div className="h-48 w-48 shrink-0 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 overflow-hidden flex items-center justify-center p-2">
                                    <img
                                        src={selectedCharacter.avatar_url || '/images/default-avatar.png'}
                                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/default-avatar.png'; }}
                                        className="h-full max-w-full object-contain"
                                        alt={selectedCharacter.name}
                                    />
                                </div>
                                <div className="text-center sm:text-left space-y-1.5 flex-1">
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center justify-center sm:justify-start gap-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                                        {selectedCharacter.name}
                                    </h2>
                                    {selectedCharacter.tagline && (
                                        <p className="text-sm font-medium text-[#7C5CFF]">
                                            {selectedCharacter.tagline}
                                        </p>
                                    )}
                                    {selectedCharacter.quote && (
                                        <p className="text-xs text-slate-500 dark:text-slate-400 italic flex items-center justify-center sm:justify-start gap-1.5 pt-1">
                                            <Quote size={12} className="text-slate-400 dark:text-slate-500 shrink-0" />
                                            "{selectedCharacter.quote}"
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Backstory */}
                            {selectedCharacter.backstory && (
                                <div className="space-y-2 p-4 rounded-xl border border-slate-150 dark:border-white/8 bg-slate-50 dark:bg-white/[0.02]">
                                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                                        <BookOpen size={14} className="text-[#7C5CFF]" /> Backstory
                                    </h4>
                                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                                        {selectedCharacter.backstory}
                                    </p>
                                </div>
                            )}

                            {/* Guide Power & Bonuses */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {selectedCharacter.guide_power?.title && (
                                    <div className="p-4 rounded-xl border border-slate-150 dark:border-white/8 bg-slate-50 dark:bg-white/[0.02] space-y-1">
                                        <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                                            <Zap size={14} /> Guide Power: {selectedCharacter.guide_power.title}
                                        </h4>
                                        <p className="text-xs text-slate-650 dark:text-slate-300">
                                            {selectedCharacter.guide_power.description}
                                        </p>
                                    </div>
                                )}

                                {(selectedCharacter.system_bonus?.exp_boost || selectedCharacter.system_bonus?.gold_boost) && (
                                    <div className="p-4 rounded-xl border border-slate-150 dark:border-white/8 bg-slate-50 dark:bg-white/[0.02] space-y-1">
                                        <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                                            <Sparkles size={14} /> System Bonus
                                        </h4>
                                        <div className="flex gap-4 text-xs text-slate-650 dark:text-slate-300 font-medium">
                                            {selectedCharacter.system_bonus.exp_boost && (
                                                <span>EXP Boost: <strong className="text-slate-800 dark:text-white">+{selectedCharacter.system_bonus.exp_boost}%</strong></span>
                                            )}
                                            {selectedCharacter.system_bonus.gold_boost && (
                                                <span>Gold Boost: <strong className="text-slate-800 dark:text-white">+{selectedCharacter.system_bonus.gold_boost}%</strong></span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Tags */}
                            <div className="space-y-3 pt-2">
                                {Array.isArray(selectedCharacter.character_type) && selectedCharacter.character_type.length > 0 && (
                                    <div>
                                        <span className="text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400 block mb-1">Character Types</span>
                                        <div className="flex flex-wrap gap-1.5">
                                            {selectedCharacter.character_type.map((t, i) => (
                                                <span key={i} className="px-2.5 py-0.5 rounded-md bg-[#7C5CFF]/10 dark:bg-[#7C5CFF]/15 border border-[#7C5CFF]/20 dark:border-[#7C5CFF]/30 text-xs text-[#7C5CFF]">
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {Array.isArray(selectedCharacter.abilities) && selectedCharacter.abilities.length > 0 && (
                                    <div>
                                        <span className="text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400 block mb-1">Abilities</span>
                                        <div className="flex flex-wrap gap-1.5">
                                            {selectedCharacter.abilities.map((a, i) => (
                                                <span key={i} className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/15 text-xs text-slate-700 dark:text-slate-200">
                                                    {a}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Actions Footer */}
                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-white/10">
                                <Link
                                    href={`/admin/assets/characters/${selectedCharacter.id}/edit`}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#7C5CFF] hover:bg-[#6A4BE0] text-white text-sm font-medium transition-colors cursor-pointer shadow-lg shadow-[#7C5CFF]/20"
                                >
                                    <Edit2 size={16} /> Edit Character
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => deleteCharacter(selectedCharacter.id, selectedCharacter.name)}
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-sm font-medium transition-colors border border-rose-200 dark:border-rose-500/20 cursor-pointer"
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
                onClose={() => setConfirmModal((prev) => ({ ...prev, open: false }))}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
                confirmText={confirmModal.confirmText}
                variant={confirmModal.variant}
            />
        </AppLayout>
    );
}