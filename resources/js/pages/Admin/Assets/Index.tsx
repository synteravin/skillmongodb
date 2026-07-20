import { useState, useEffect } from 'react';
import { Link, router, useForm } from '@inertiajs/react';
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
    Quote,
    BookOpen,
    FileCheck,
    CheckCircle2,
    Eye,
    Upload,
    ImageIcon,
    Sparkles,
    Check,
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

type CertificateDesign = {
    id: string;
    title: string;
    background_path?: string;
    background_url?: string;
    logo_path?: string;
    logo_url?: string;
    is_active: boolean;
    created_at?: string;
};

interface AssetsPageProps {
    stats: {
        ranks: number;
        characters: number;
        badges: number;
        certificates?: number;
    };
    ranks?: Rank[];
    characters?: Character[];
    badges?: LevelBadge[];
    certificates?: CertificateDesign[];
}

export default function AssetsPage({
    stats,
    ranks = [],
    characters = [],
    badges = [],
    certificates = [],
}: AssetsPageProps) {
    const [activeTab, setActiveTab] = useState<
        'ranks' | 'characters' | 'badges' | 'certificates'
    >('ranks');

    // State for drag & drop lists
    const [rankItems, setRankItems] = useState<Rank[]>(ranks);
    const [badgeItems, setBadgeItems] = useState<LevelBadge[]>(badges);
    const [characterItems, setCharacterItems] =
        useState<Character[]>(characters);
    const [certificateItems, setCertificateItems] =
        useState<CertificateDesign[]>(certificates);

    // Character Modal state
    const [selectedCharacter, setSelectedCharacter] =
        useState<Character | null>(null);

    // Certificate Modals state
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [uploadPreview, setUploadPreview] = useState<string | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [previewModalDesign, setPreviewModalDesign] =
        useState<CertificateDesign | null>(null);
    const [showSampleTextOverlay, setShowSampleTextOverlay] = useState(true);

    const [isSavingRankOrder, setIsSavingRankOrder] = useState(false);
    const [isSavingBadgeOrder, setIsSavingBadgeOrder] = useState(false);

    const uploadForm = useForm<{
        title: string;
        background: File | null;
        logo: File | null;
    }>({
        title: '',
        background: null,
        logo: null,
    });

    useEffect(() => {
        setRankItems(ranks);
    }, [ranks]);
    useEffect(() => {
        setBadgeItems(badges);
    }, [badges]);
    useEffect(() => {
        setCharacterItems(characters);
    }, [characters]);
    useEffect(() => {
        setCertificateItems(certificates);
    }, [certificates]);

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

    /* ================= CERTIFICATE HANDLERS ================= */
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            uploadForm.setData('background', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            uploadForm.setData('logo', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUploadCertificate = (e: React.FormEvent) => {
        e.preventDefault();
        uploadForm.post('/admin/assets/certificate-designs', {
            preserveScroll: true,
            onSuccess: () => {
                setIsUploadModalOpen(false);
                uploadForm.reset();
                setUploadPreview(null);
                setLogoPreview(null);
            },
        });
    };

    const handleSetActiveCertificate = (id: string, title: string) => {
        router.post(
            `/admin/assets/certificate-designs/${id}/active`,
            {},
            {
                preserveScroll: true,
            },
        );
    };

    const handleDeleteCertificate = (id: string, title: string) => {
        setConfirmModal({
            open: true,
            title: 'Hapus Desain Sertifikat',
            message: `Apakah Anda yakin ingin menghapus desain sertifikat "${title}"?`,
            confirmText: 'Hapus Desain',
            variant: 'danger',
            onConfirm: () => {
                router.delete(`/admin/assets/certificate-designs/${id}`, {
                    preserveScroll: true,
                    onSuccess: () => {
                        if (previewModalDesign?.id === id) {
                            setPreviewModalDesign(null);
                        }
                    },
                });
            },
        });
    };

    const activeCertificate = certificateItems.find((item) => item.is_active);

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
                                    manage game assets and custom certificate designs.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* CATEGORY CARDS (TABS - 4 COLUMNS) */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
                                    <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                                        Level Rank
                                    </h2>
                                </div>
                                <span className="rounded-lg border border-[#7C5CFF]/20 bg-[#7C5CFF]/10 px-2.5 py-1 text-xs font-semibold text-[#7C5CFF]">
                                    {stats?.ranks ?? rankItems.length}
                                </span>
                            </div>
                            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                                Manage progression tiers and student ranking system
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
                                    <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                                        Character
                                    </h2>
                                </div>
                                <span className="rounded-lg border border-[#7C5CFF]/20 bg-[#7C5CFF]/10 px-2.5 py-1 text-xs font-semibold text-[#7C5CFF]">
                                    {stats?.characters ?? characterItems.length}
                                </span>
                            </div>
                            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
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
                                    <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                                        Level Badge
                                    </h2>
                                </div>
                                <span className="rounded-lg border border-[#7C5CFF]/20 bg-[#7C5CFF]/10 px-2.5 py-1 text-xs font-semibold text-[#7C5CFF]">
                                    {stats?.badges ?? badgeItems.length}
                                </span>
                            </div>
                            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                                Manage achievements, icons, and level milestones
                            </p>
                        </button>

                        {/* CERTIFICATE CARD */}
                        <button
                            type="button"
                            onClick={() => setActiveTab('certificates')}
                            className={`group relative cursor-pointer overflow-hidden rounded-xl border p-5 text-left transition-all duration-200 ${
                                activeTab === 'certificates'
                                    ? 'border-[#7C5CFF] bg-white shadow-lg ring-2 shadow-[#7C5CFF]/10 ring-[#7C5CFF]/30 dark:bg-[#0d0f1a] dark:shadow-[#7C5CFF]/15'
                                    : 'border-slate-200 bg-white hover:border-[#7C5CFF]/40 hover:bg-slate-50 dark:border-white/8 dark:bg-[#060B1A]/80 dark:hover:bg-[#090e22]'
                            }`}
                        >
                            <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-[#7C5CFF]/40 to-transparent" />
                            <div className="mb-3 flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <div
                                        className={`rounded-lg border p-2 ${activeTab === 'certificates' ? 'border-[#7C5CFF]/40 bg-[#7C5CFF]/20 text-[#7C5CFF]' : 'border-slate-200 bg-slate-100 text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400'}`}
                                    >
                                        <FileCheck size={20} />
                                    </div>
                                    <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                                        Desain Sertifikat
                                    </h2>
                                </div>
                                <span className="rounded-lg border border-[#7C5CFF]/20 bg-[#7C5CFF]/10 px-2.5 py-1 text-xs font-semibold text-[#7C5CFF]">
                                    {stats?.certificates ?? certificateItems.length}
                                </span>
                            </div>
                            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                                Upload background & logo custom sertifikat
                            </p>
                        </button>
                    </div>

                    {/* DYNAMIC CONTENT CONTAINER (BELOW CARDS) */}
                    <div className="text-slate-855 relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-xl backdrop-blur-md transition-all dark:border-white/10 dark:bg-[#060B1A]/90 dark:text-white">
                        <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-[#7C5CFF]/30 to-transparent" />

                        {/* TAB 1: LEVEL RANKS */}
                        {activeTab === 'ranks' && (
                            <div className="space-y-6">
                                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                            Level Rank List
                                        </h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            Drag and drop to reorder rank positions
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={saveRankOrder}
                                            disabled={isSavingRankOrder}
                                            className="flex cursor-pointer items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-200 disabled:opacity-50 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/20"
                                        >
                                            {isSavingRankOrder ? (
                                                <Loader2
                                                    size={14}
                                                    className="animate-spin"
                                                />
                                            ) : null}
                                            Save Order
                                        </button>
                                        <Link
                                            href="/admin/assets/ranks/create"
                                            className="flex cursor-pointer items-center gap-2 rounded-xl bg-[#7C5CFF] px-4 py-2 text-xs font-medium text-white shadow-lg shadow-[#7C5CFF]/20 transition-colors hover:bg-[#6A4BE0]"
                                        >
                                            <Plus size={14} /> Add Rank
                                        </Link>
                                    </div>
                                </div>

                                {rankItems.length === 0 ? (
                                    <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center dark:border-white/10">
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            No ranks found. Create your first rank to get started.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 dark:divide-white/5 dark:border-white/10">
                                        {rankItems.map((rank, index) => (
                                            <div
                                                key={rank.id}
                                                draggable
                                                onDragStart={(e) =>
                                                    e.dataTransfer.setData(
                                                        'text/plain',
                                                        index.toString(),
                                                    )
                                                }
                                                onDragOver={(e) =>
                                                    e.preventDefault()
                                                }
                                                onDrop={(e) => {
                                                    e.preventDefault();
                                                    const dragIndex = Number(
                                                        e.dataTransfer.getData(
                                                            'text/plain',
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
                                                            src={
                                                                rank.image_url ||
                                                                '/images/default-rank.png'
                                                            }
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
                                                            Drag to reorder position
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
                                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                            Characters List
                                        </h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            Manage game avatars and student characters
                                        </p>
                                    </div>
                                    <Link
                                        href="/admin/assets/characters/create"
                                        className="flex cursor-pointer items-center gap-2 rounded-xl bg-[#7C5CFF] px-4 py-2 text-xs font-medium text-white shadow-lg shadow-[#7C5CFF]/20 transition-colors hover:bg-[#6A4BE0]"
                                    >
                                        <Plus size={14} /> Add Character
                                    </Link>
                                </div>

                                {characterItems.length === 0 ? (
                                    <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center dark:border-white/10">
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            No characters found. Create your first character.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                        {characterItems.map((char) => (
                                            <div
                                                key={char.id}
                                                onClick={() =>
                                                    setSelectedCharacter(char)
                                                }
                                                className="group relative cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-slate-50/50 p-4 transition-all hover:border-[#7C5CFF]/40 hover:bg-slate-100/50 hover:shadow-md dark:border-white/10 dark:bg-white/[0.02] dark:hover:bg-white/[0.05]"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 dark:border-white/10 dark:bg-white/5">
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
                                                            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                                                            alt={char.name}
                                                        />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <h4 className="truncate text-base font-semibold text-slate-800 dark:text-white">
                                                            {char.name}
                                                        </h4>
                                                        {char.tagline && (
                                                            <p className="truncate text-xs font-medium text-[#7C5CFF]">
                                                                {char.tagline}
                                                            </p>
                                                        )}
                                                        <span className="mt-2 inline-block rounded-md bg-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-white/10 dark:text-slate-300">
                                                            Click details
                                                        </span>
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
                                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                            Level Badge List
                                        </h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            Drag and drop to reorder badge milestones
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={saveBadgeOrder}
                                            disabled={isSavingBadgeOrder}
                                            className="flex cursor-pointer items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-200 disabled:opacity-50 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/20"
                                        >
                                            {isSavingBadgeOrder ? (
                                                <Loader2
                                                    size={14}
                                                    className="animate-spin"
                                                />
                                            ) : null}
                                            Save Order
                                        </button>
                                        <Link
                                            href="/admin/assets/badges/create"
                                            className="flex cursor-pointer items-center gap-2 rounded-xl bg-[#7C5CFF] px-4 py-2 text-xs font-medium text-white shadow-lg shadow-[#7C5CFF]/20 transition-colors hover:bg-[#6A4BE0]"
                                        >
                                            <Plus size={14} /> Add Badge
                                        </Link>
                                    </div>
                                </div>

                                {badgeItems.length === 0 ? (
                                    <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center dark:border-white/10">
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            No badges found. Create your first badge.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 dark:divide-white/5 dark:border-white/10">
                                        {badgeItems.map((badge, index) => (
                                            <div
                                                key={badge.id}
                                                draggable
                                                onDragStart={(e) =>
                                                    e.dataTransfer.setData(
                                                        'text/plain',
                                                        index.toString(),
                                                    )
                                                }
                                                onDragOver={(e) =>
                                                    e.preventDefault()
                                                }
                                                onDrop={(e) => {
                                                    e.preventDefault();
                                                    const dragIndex = Number(
                                                        e.dataTransfer.getData(
                                                            'text/plain',
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
                                                            Drag to reorder badge position
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

                        {/* TAB 4: DESAIN SERTIFIKAT */}
                        {activeTab === 'certificates' && (
                            <div className="space-y-6">
                                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                            Kelola Desain Latar Belakang & Logo Sertifikat
                                        </h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            Upload gambar latar belakang (A4 Landscape) & logo custom untuk template sertifikat siswa.
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setIsUploadModalOpen(true)}
                                        className="flex cursor-pointer items-center gap-2 rounded-xl bg-[#7C5CFF] px-4 py-2.5 text-xs font-medium text-white shadow-lg shadow-[#7C5CFF]/20 transition-colors hover:bg-[#6A4BE0]"
                                    >
                                        <Plus size={16} /> Upload Desain Baru
                                    </button>
                                </div>

                                {/* ACTIVE CERTIFICATE BANNER */}
                                {activeCertificate ? (
                                    <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5 dark:border-emerald-500/20 dark:bg-emerald-500/10">
                                        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="relative aspect-[1.414/1] w-36 overflow-hidden rounded-xl border border-emerald-500/40 shadow-sm bg-slate-100">
                                                    <img
                                                        src={
                                                            activeCertificate.background_url ||
                                                            '/images/Sertifikat Course LMS SkillVentura.png'
                                                        }
                                                        alt={activeCertificate.title}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                                            <CheckCircle2 size={12} /> SEDANG DIGUNAKAN
                                                        </span>
                                                        {activeCertificate.logo_url && (
                                                            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/20 px-2.5 py-0.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                                                                Logo Custom
                                                            </span>
                                                        )}
                                                    </div>
                                                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                                                        {activeCertificate.title}
                                                    </h4>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                                        Diunggah pada: {activeCertificate.created_at || '-'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => setPreviewModalDesign(activeCertificate)}
                                                    className="flex cursor-pointer items-center gap-2 rounded-xl border border-emerald-500/30 bg-white px-4 py-2 text-xs font-semibold text-emerald-700 shadow-sm hover:bg-emerald-50 dark:bg-slate-900 dark:text-emerald-400 dark:hover:bg-slate-800"
                                                >
                                                    <Eye size={14} /> Preview Contoh Sertifikat
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300">
                                        <div className="flex items-center gap-3">
                                            <Sparkles size={20} className="text-amber-500" />
                                            <div>
                                                <h4 className="text-sm font-bold">Menggunakan Template Bawaan Sistem</h4>
                                                <p className="text-xs opacity-90">
                                                    Saat ini belum ada desain custom yang diaktifkan. Sistem otomatis menggunakan desain latar belakang bawaan SkillVentura.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* GALLERY GRID */}
                                <div>
                                    <h4 className="mb-4 text-sm font-semibold text-slate-800 dark:text-slate-200">
                                        Galeri Desain Sertifikat ({certificateItems.length})
                                    </h4>

                                    {certificateItems.length === 0 ? (
                                        <div className="rounded-xl border border-dashed border-slate-200 p-10 text-center dark:border-white/10">
                                            <ImageIcon size={36} className="mx-auto mb-2 text-slate-400 opacity-60" />
                                            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                                                Belum ada desain sertifikat custom yang diunggah.
                                            </p>
                                            <p className="mt-1 text-xs text-slate-400">
                                                Klik "+ Upload Desain Baru" untuk mengunggah gambar background & logo sertifikat.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                            {certificateItems.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className={`group relative flex flex-col overflow-hidden rounded-2xl border transition-all duration-200 ${
                                                        item.is_active
                                                            ? 'border-emerald-500/50 bg-emerald-500/[0.02] shadow-md ring-2 ring-emerald-500/30 dark:border-emerald-500/40 dark:bg-emerald-500/[0.04]'
                                                            : 'border-slate-200 bg-white hover:border-[#7C5CFF]/40 hover:shadow-md dark:border-white/10 dark:bg-white/[0.02] dark:hover:border-white/20'
                                                    }`}
                                                >
                                                    {/* Card Header Thumbnail */}
                                                    <div className="relative aspect-[1.414/1] w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
                                                        <img
                                                            src={item.background_url || ''}
                                                            alt={item.title}
                                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                        />
                                                        {item.is_active && (
                                                            <div className="absolute top-3 left-3 rounded-full bg-emerald-500 px-3 py-1 text-[11px] font-bold text-white shadow-md">
                                                                ✓ Aktif Digunakan
                                                            </div>
                                                        )}
                                                        {item.logo_url && (
                                                            <div className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-lg bg-white/90 p-1 shadow-md backdrop-blur-sm">
                                                                <img
                                                                    src={item.logo_url}
                                                                    alt="Custom Logo"
                                                                    className="max-h-full max-w-full object-contain"
                                                                />
                                                            </div>
                                                        )}
                                                        {/* Hover Quick Overlay Action */}
                                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-[2px] transition-opacity group-hover:opacity-100">
                                                            <button
                                                                type="button"
                                                                onClick={() => setPreviewModalDesign(item)}
                                                                className="flex items-center gap-2 rounded-xl bg-white/90 px-4 py-2 text-xs font-bold text-slate-900 shadow-lg hover:bg-white"
                                                            >
                                                                <Eye size={14} /> Preview Mockup
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Card Body */}
                                                    <div className="flex flex-1 flex-col justify-between p-4">
                                                        <div>
                                                            <h5 className="font-bold text-slate-900 dark:text-white">
                                                                {item.title}
                                                            </h5>
                                                            <p className="mt-1 text-xs text-slate-400">
                                                                Diupload: {item.created_at || '-'}
                                                            </p>
                                                        </div>

                                                        {/* Card Footer Actions */}
                                                        <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-3 dark:border-white/10">
                                                            {item.is_active ? (
                                                                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                                                    <CheckCircle2 size={14} /> Digunakan saat ini
                                                                </span>
                                                            ) : (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleSetActiveCertificate(item.id, item.title)}
                                                                    className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-600 transition-colors hover:bg-emerald-500 hover:text-white dark:bg-emerald-500/20 dark:text-emerald-400 dark:hover:bg-emerald-500 dark:hover:text-white"
                                                                >
                                                                    <Check size={14} /> Gunakan Desain Ini
                                                                </button>
                                                            )}

                                                            <div className="flex items-center gap-1">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setPreviewModalDesign(item)}
                                                                    className="cursor-pointer rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-white/10 dark:hover:text-white"
                                                                    title="Preview"
                                                                >
                                                                    <Eye size={16} />
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleDeleteCertificate(item.id, item.title)}
                                                                    className="cursor-pointer rounded-lg p-2 text-slate-400 transition-colors hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400"
                                                                    title="Hapus Desain"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
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
                                            System Bonus
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

            {/* UPLOAD CERTIFICATE DESIGN MODAL */}
            {isUploadModalOpen && (
                <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md dark:bg-black/80">
                    <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-800 shadow-2xl dark:border-white/15 dark:bg-[#0a0d18] dark:text-white">
                        <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-[#7C5CFF] to-indigo-500" />
                        <div className="p-6">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-white/10">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                    Upload Desain Sertifikat Baru
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsUploadModalOpen(false);
                                        uploadForm.reset();
                                        setUploadPreview(null);
                                        setLogoPreview(null);
                                    }}
                                    className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-white/10 dark:hover:text-white"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <form onSubmit={handleUploadCertificate} className="mt-4 space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                                        Judul / Nama Template <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={uploadForm.data.title}
                                        onChange={(e) => uploadForm.setData('title', e.target.value)}
                                        placeholder="Contoh: Desain Sertifikat Standard 2026"
                                        className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:border-[#7C5CFF] focus:bg-white dark:border-white/10 dark:bg-white/5 dark:focus:border-[#7C5CFF]"
                                    />
                                    {uploadForm.errors.title && (
                                        <p className="mt-1 text-xs text-rose-500">{uploadForm.errors.title}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                                        Gambar Latar Belakang (PNG, JPG max 5MB) <span className="text-rose-500">*</span>
                                    </label>

                                    <div className="mt-1.5 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 p-4 transition-colors hover:border-[#7C5CFF] dark:border-white/10 dark:hover:border-[#7C5CFF]">
                                        {uploadPreview ? (
                                            <div className="relative aspect-[1.414/1] w-full overflow-hidden rounded-lg border border-slate-200 dark:border-white/10">
                                                <img
                                                    src={uploadPreview}
                                                    alt="Preview Upload"
                                                    className="h-full w-full object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        uploadForm.setData('background', null);
                                                        setUploadPreview(null);
                                                    }}
                                                    className="absolute top-2 right-2 rounded-full bg-rose-500 p-1 text-white shadow-md hover:bg-rose-600"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ) : (
                                            <label className="flex cursor-pointer flex-col items-center py-4 text-center">
                                                <Upload size={32} className="text-[#7C5CFF] mb-2" />
                                                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                                    Pilih file gambar background
                                                </span>
                                                <span className="mt-1 text-xs text-slate-400">
                                                    Rekomendasi rasio A4 Landscape (3508 x 2480 px)
                                                </span>
                                                <input
                                                    type="file"
                                                    accept="image/png,image/jpeg,image/jpg,image/webp"
                                                    onChange={handleFileChange}
                                                    className="hidden"
                                                    required
                                                />
                                            </label>
                                        )}
                                    </div>
                                    {uploadForm.errors.background && (
                                        <p className="mt-1 text-xs text-rose-500">{uploadForm.errors.background}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                                        Logo Sertifikat Kustom (Opsional - PNG, SVG, JPG max 2MB)
                                    </label>
                                    <p className="text-[11px] text-slate-400">
                                        Jika diisi, logo ini akan menggantikan logo bawaan SkillVentura di posisi atas sertifikat.
                                    </p>

                                    <div className="mt-1.5 flex items-center gap-3">
                                        {logoPreview ? (
                                            <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-white/10 dark:bg-white/5">
                                                <img
                                                    src={logoPreview}
                                                    alt="Preview Logo"
                                                    className="max-h-full max-w-full object-contain"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        uploadForm.setData('logo', null);
                                                        setLogoPreview(null);
                                                    }}
                                                    className="absolute -top-1 -right-1 rounded-full bg-rose-500 p-0.5 text-white shadow-md hover:bg-rose-600"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        ) : null}

                                        <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10">
                                            <Upload size={14} className="text-[#7C5CFF]" />
                                            <span>{logoPreview ? 'Ganti Logo' : 'Pilih File Logo Kustom'}</span>
                                            <input
                                                type="file"
                                                accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                                                onChange={handleLogoFileChange}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                    {uploadForm.errors.logo && (
                                        <p className="mt-1 text-xs text-rose-500">{uploadForm.errors.logo}</p>
                                    )}
                                </div>

                                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-white/10">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsUploadModalOpen(false);
                                            uploadForm.reset();
                                            setUploadPreview(null);
                                            setLogoPreview(null);
                                        }}
                                        className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={uploadForm.processing}
                                        className="flex items-center gap-2 rounded-xl bg-[#7C5CFF] px-5 py-2 text-xs font-semibold text-white shadow-md hover:bg-[#6A4BE0] disabled:opacity-50"
                                    >
                                        {uploadForm.processing ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                                        Upload & Simpan
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* MOCKUP PREVIEW MODAL */}
            {previewModalDesign && (
                <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-2 sm:p-4 backdrop-blur-md">
                    <div className="relative flex flex-col w-[96vw] max-w-5xl h-[88vh] overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-800 shadow-2xl dark:border-white/15 dark:bg-[#0a0d18] dark:text-white">
                        {/* Modal Header */}
                        <div className="shrink-0 flex items-center justify-between border-b border-slate-200 p-4 sm:px-6 dark:border-white/10">
                            <div>
                                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                                    Simulasi Preview Sertifikat: {previewModalDesign.title}
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Preview tampilan jika desain ini dipakai untuk mencetak sertifikat siswa
                                </p>
                            </div>
                            <div className="flex items-center gap-2 sm:gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowSampleTextOverlay(!showSampleTextOverlay)}
                                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                                        showSampleTextOverlay
                                            ? 'bg-[#7C5CFF] text-white'
                                            : 'bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-300'
                                    }`}
                                >
                                    <Eye size={14} /> {showSampleTextOverlay ? 'Simulasi Teks' : 'Latar Belakang'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPreviewModalDesign(null)}
                                    className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-white/10 dark:hover:text-white"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Certificate Render Container (NO SCROLLBAR) */}
                        <div className="relative flex-1 min-h-0 p-3 sm:p-5 bg-slate-950 flex justify-center items-center overflow-hidden">
                            <div
                                className="relative aspect-[1.414/1] h-full max-h-full max-w-full w-auto overflow-hidden rounded-xl shadow-2xl bg-white text-[#0f294a]"
                                style={{ aspectRatio: '1.414 / 1' }}
                            >
                                {/* Background Image */}
                                <img
                                    src={previewModalDesign.background_url || '/images/Sertifikat Course LMS SkillVentura.png'}
                                    alt="Certificate Background"
                                    className="absolute inset-0 h-full w-full object-cover"
                                />

                                {/* Simulated Overlay Text (Matches certificate.blade.php layout) */}
                                {showSampleTextOverlay && (
                                    <div className="absolute inset-0 flex flex-col justify-between p-3 sm:p-6 text-center select-none pointer-events-none">
                                        {/* Center Semi-transparent Card */}
                                         <div className="mx-auto mt-[6%] w-[84%] rounded-xl sm:rounded-2xl border border-white/70 bg-white/95 p-2.5 sm:p-4 shadow-sm">
                                             {/* Logo Container */}
                                             <div className="mb-1 flex justify-center">
                                                 <img
                                                     src={
                                                         previewModalDesign.logo_url ||
                                                         '/images/[WithoutBG]SVLogo (2).png'
                                                     }
                                                     alt="Logo"
                                                     className="h-12 sm:h-20 w-auto object-contain"
                                                     onError={(e) => {
                                                         (e.currentTarget as HTMLImageElement).style.display = 'none';
                                                     }}
                                                 />
                                             </div>

                                             <div className="text-[10px] sm:text-xs font-extrabold tracking-[0.2em] uppercase text-[#0f294a]">
                                                 CERTIFICATE OF RECOGNITION
                                             </div>
                                             <div className="mx-auto my-1 sm:my-1.5 h-0.5 w-20 sm:w-32 bg-amber-500 rounded" />
                                             <div className="text-[8px] sm:text-[10px] font-bold tracking-wider uppercase text-slate-500">
                                                 This Certificate is proudly awarded to:
                                             </div>
                                             <div
                                                 className="my-1 sm:my-1.5 text-base sm:text-2xl font-bold text-blue-900 italic"
                                                 style={{ fontFamily: "'Dancing Script', 'Brush Script MT', cursive, serif" }}
                                             >
                                                 Alexander Morgan
                                             </div>
                                             <div className="text-[8.5px] sm:text-[11px] leading-tight sm:leading-relaxed text-slate-600">
                                                 This certificate is given to <strong>Alexander Morgan</strong> for their achievement in <strong>Fullstack Web Development Mastery</strong> and proves that they are competent in their field.
                                             </div>
                                         </div>

                                         {/* Footer Signatures */}
                                         <div className="mb-2 sm:mb-4 flex items-end justify-between px-4 sm:px-10 text-[8px] sm:text-[11px]">
                                             <div className="w-24 sm:w-40 text-center">
                                                 <div className="h-5 sm:h-9 flex items-end justify-center">
                                                     <span className="font-serif italic text-[8.5px] sm:text-xs text-slate-700">Guild Master</span>
                                                 </div>
                                                 <div className="my-0.5 sm:my-1 border-t border-amber-800/60" />
                                                 <div className="font-bold text-slate-900">Guild Master</div>
                                                 <div className="text-[7px] sm:text-[9px] uppercase tracking-wider text-slate-500">Admin</div>
                                             </div>

                                             <div className="w-20 sm:w-32 text-center">
                                                 <div className="font-bold text-slate-900">July 20, 2026</div>
                                                 <div className="my-0.5 sm:my-1 border-t border-amber-800/60" />
                                                 <div className="text-[7px] sm:text-[9px] uppercase tracking-wider text-slate-500">Date Issued</div>
                                             </div>

                                             <div className="w-24 sm:w-40 text-center">
                                                 <div className="h-5 sm:h-9 flex items-end justify-center">
                                                     <span className="font-serif italic text-[8.5px] sm:text-xs text-slate-700">Synteravin</span>
                                                 </div>
                                                 <div className="my-0.5 sm:my-1 border-t border-amber-800/60" />
                                                 <div className="font-bold text-slate-900">Synteravin</div>
                                                 <div className="text-[7px] sm:text-[9px] uppercase tracking-wider text-slate-500">Mentor</div>
                                             </div>
                                         </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Modal Footer Actions */}
                        <div className="shrink-0 flex items-center justify-between border-t border-slate-200 p-4 sm:px-6 dark:border-white/10">
                            <div>
                                {previewModalDesign.is_active ? (
                                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                        <CheckCircle2 size={16} /> Desain ini sedang aktif digunakan sistem
                                    </span>
                                ) : (
                                    <span className="text-xs text-slate-500 dark:text-slate-400">
                                        Desain ini siap untuk diaktifkan
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setPreviewModalDesign(null)}
                                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
                                >
                                    Tutup
                                </button>
                                {!previewModalDesign.is_active && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            handleSetActiveCertificate(previewModalDesign.id, previewModalDesign.title);
                                            setPreviewModalDesign(null);
                                        }}
                                        className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-emerald-600"
                                    >
                                        <Check size={16} /> Gunakan Desain Ini Sekarang
                                    </button>
                                )}
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
