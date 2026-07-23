import { Link, router, usePage } from '@inertiajs/react';
import React, { useState } from 'react';
import {
    Calendar,
    DollarSign,
    Briefcase,
    FileText,
    User,
    CheckCircle2,
    MessageSquare,
    Clock,
    Award,
    ShieldAlert,
} from 'lucide-react';
import QuestChatPanel from '@/components/Quest/QuestChatPanel';
import RevisionHistory from '@/components/Quest/RevisionHistory';
import QuestStepper from '@/components/Quest/QuestStepper';
import QuestAttachments from '@/components/Quest/QuestAttachments';
import CreatorProjectPanel from '@/components/Quest/CreatorProjectPanel';
import WorkerProjectPanel from '@/components/Quest/WorkerProjectPanel';
import VisitorBidPanel from '@/components/Quest/VisitorBidPanel';
import BidsTabPanel from '@/components/Quest/BidsTabPanel';
import DisputePanel from '@/components/Quest/DisputePanel';
import VersionControlHistory from '@/components/Quest/VersionControlHistory';
import { Quest, Bid } from '@/types/quest';

interface Props {
    quest: Quest;
    bids: Bid[];
    myBid: Bid | null;
    can: {
        bid: boolean;
        accept: boolean;
    };
}

export default function Show({ quest, bids, myBid, can }: Props) {
    const { props } = usePage<any>();
    const currentUser = props.auth?.user;
    const isCreator = currentUser?.id === quest.creator_id;
    const isWorker = currentUser?.id === quest.worker_id;

    // Define initial active tab
    const [activeTab, setActiveTab] = useState<'detail' | 'project' | 'bids'>(
        isCreator && quest.status === 'open' ? 'bids' : 'detail',
    );
    const [selectedChatBid, setSelectedChatBid] = useState<{
        id: string;
        name: string;
    } | null>(null);
    const [previewImage, setPreviewImage] = useState<{
        url: string;
        name: string;
    } | null>(null);

    const formatCurrency = (num: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(num);
    };

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = 2;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return (
            parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
        );
    };

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        const datePart = d.toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
        const timePart = d.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
        });
        return `${datePart} ${timePart}`;
    };

    // Calculate days remaining
    const calculateDaysRemaining = () => {
        const now = new Date();
        const deadlineDate = new Date(quest.deadline);
        const diff = deadlineDate.getTime() - now.getTime();

        if (['completed', 'approved'].includes(quest.status)) {
            return {
                text: 'Selesai',
                className:
                    'bg-emerald-50 text-emerald-700 dark:bg-slate-950 dark:text-emerald-450 border border-slate-205 dark:border-slate-800',
                isExpired: false,
                isLate: false,
            };
        }

        if (quest.status === 'cancelled') {
            return {
                text: 'Dibatalkan',
                className:
                    'bg-red-55 text-red-700 dark:bg-slate-950 dark:text-red-400 border border-slate-205 dark:border-slate-800',
                isExpired: false,
                isLate: false,
            };
        }

        if (diff > 0) {
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor(
                (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
            );
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

            let timeStr = '';
            if (days > 0) {
                timeStr = `${days} Hari ${hours} Jam`;
            } else if (hours > 0) {
                timeStr = `${hours} Jam ${minutes} Menit`;
            } else {
                timeStr = `${minutes} Menit`;
            }

            return {
                text: `${timeStr} Tersisa`,
                className:
                    'bg-indigo-50 text-indigo-700 dark:bg-slate-950 dark:text-indigo-400 border border-slate-205 dark:border-slate-800',
                isExpired: false,
                isLate: false,
            };
        } else {
            const absDiff = Math.abs(diff);
            const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
            const hours = Math.floor(
                (absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
            );

            let lateStr = '';
            if (days > 0) {
                lateStr = `${days} Hari ${hours} Jam`;
            } else {
                lateStr = `${hours} Jam`;
            }

            if (quest.status === 'open' || quest.status === 'draft') {
                return {
                    text: 'Pendaftaran Ditutup',
                    className:
                        'bg-slate-100 text-slate-700 dark:bg-slate-950 dark:text-slate-400 border border-slate-205 dark:border-slate-800',
                    isExpired: true,
                    isLate: false,
                };
            } else {
                return {
                    text: `Terlambat ${lateStr}`,
                    className:
                        'bg-red-50 text-red-705 dark:bg-slate-950 dark:text-red-400 border border-slate-205 dark:border-slate-800 font-semibold',
                    isExpired: true,
                    isLate: true,
                };
            }
        }
    };

    return (
        <div
            className="flex min-h-screen w-full flex-col overflow-x-hidden bg-[#f8fafc] text-slate-800 transition-colors duration-250 dark:bg-[#030712] dark:text-white"
            style={{ fontFamily: "'Outfit', sans-serif" }}
        >
            {/* HEADER - Gaming style, consistent with other pages */}
            <div className="w-full flex-shrink-0 px-1 pt-0.5">
                <div
                    className="relative rounded-md p-[2px] md:p-[3px]"
                    style={{
                        backgroundImage:
                            'linear-gradient(to bottom, #3B28F6 0%, #4c2fff 30%, #7c3aed 50%, #facc15 100%)',
                    }}
                >
                    <div className="relative flex items-center justify-between gap-2 rounded-[4px] bg-white px-3 py-3 md:px-6 md:py-4 dark:bg-[#040812]">
                        {/* Back Button */}
                        <Link
                            href="/student/quests"
                            className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded border-2 border-blue-500 bg-blue-100 transition-colors hover:border-blue-600 hover:bg-blue-200 md:h-12 md:w-12 dark:border-blue-800 dark:bg-[#0b1021] dark:hover:border-blue-600 dark:hover:bg-blue-900/40"
                        >
                            <svg
                                viewBox="0 0 48 48"
                                className="h-7 w-7 scale-125 text-indigo-600 transition-transform duration-200 hover:scale-150 md:h-9 md:w-9 dark:text-indigo-500"
                            >
                                <rect
                                    x="12"
                                    y="20"
                                    width="29"
                                    height="4"
                                    fill="currentColor"
                                />
                                <rect
                                    x="8"
                                    y="20"
                                    width="4"
                                    height="4"
                                    fill="currentColor"
                                />
                                <rect
                                    x="5"
                                    y="20"
                                    width="5"
                                    height="4"
                                    fill="currentColor"
                                />
                                <rect
                                    x="8"
                                    y="16"
                                    width="4"
                                    height="4"
                                    fill="currentColor"
                                />
                                <rect
                                    x="8"
                                    y="24"
                                    width="4"
                                    height="4"
                                    fill="currentColor"
                                />
                                <rect
                                    x="12"
                                    y="12"
                                    width="4"
                                    height="4"
                                    fill="currentColor"
                                />
                                <rect
                                    x="12"
                                    y="28"
                                    width="4"
                                    height="4"
                                    fill="currentColor"
                                />
                                <rect
                                    x="16"
                                    y="8"
                                    width="4"
                                    height="4"
                                    fill="currentColor"
                                />
                                <rect
                                    x="16"
                                    y="32"
                                    width="4"
                                    height="4"
                                    fill="currentColor"
                                />
                            </svg>
                        </Link>

                        {/* Title */}
                        <h1 className="flex-1 text-center font-['Orbitron'] text-sm font-bold tracking-[0.05em] text-[#1e3a8a] uppercase min-[390px]:text-base min-[390px]:tracking-[0.1em] sm:text-xl md:text-2xl md:tracking-[0.15em] lg:text-3xl 2xl:text-4xl dark:text-white">
                            DETAIL PROYEK
                        </h1>

                        {/* Spacer to center title on mobile */}
                        <div className="h-10 w-10 shrink-0 md:hidden" />
                    </div>
                </div>
            </div>

            <div className="relative z-10 flex min-h-0 w-full max-w-none flex-1 flex-col space-y-6 px-4 py-4 sm:px-6 lg:px-10">
                {/* 1. CONTRACT HEADER CARD */}
                <div className="relative overflow-hidden rounded-xl border border-slate-300 bg-slate-50/70 p-6 shadow-sm dark:border-slate-800/80 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]">
                    {/* Grid Pattern Motif */}
                    <div
                        className="pointer-events-none absolute inset-0 z-0"
                        style={{
                            backgroundImage: `
                                linear-gradient(rgba(59, 40, 246, 0.05) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(59, 40, 246, 0.05) 1px, transparent 1px)
                            `,
                            backgroundSize: '35px 35px',
                        }}
                    />

                    <div className="relative z-10 space-y-4">
                        {/* Status pill top row */}
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-[10px] font-bold tracking-widest text-indigo-600 uppercase dark:text-indigo-400">
                                PROYEK FREELANCE
                            </span>

                            <div>
                                <span
                                    className={`rounded-lg border px-3 py-1 text-xs font-bold uppercase ${
                                        quest.status === 'open'
                                            ? 'border-emerald-250 text-emerald-705 bg-emerald-50 dark:border-slate-800 dark:bg-slate-950 dark:text-emerald-400'
                                            : quest.status === 'draft'
                                              ? 'border-amber-250 text-amber-705 bg-amber-50 dark:border-slate-800 dark:bg-slate-950 dark:text-amber-400'
                                              : quest.status === 'rejected'
                                                ? 'border-red-255 text-red-705 bg-red-50 dark:border-slate-800 dark:bg-slate-950 dark:text-red-400'
                                                : quest.status === 'expired'
                                                  ? 'border-red-255 text-red-705 bg-red-50 dark:border-slate-800 dark:bg-slate-950 dark:text-red-400'
                                                  : quest.status === 'ongoing'
                                                    ? 'border-indigo-250 text-indigo-707 bg-indigo-50 dark:border-slate-800 dark:bg-slate-950 dark:text-indigo-400'
                                                    : quest.status ===
                                                        'approved'
                                                      ? 'border-purple-250 text-purple-707 bg-purple-50 dark:border-slate-800 dark:bg-slate-950 dark:text-purple-400'
                                                      : quest.status ===
                                                          'payment'
                                                        ? 'border-amber-250 text-amber-750 bg-amber-50 dark:border-slate-800 dark:bg-slate-950 dark:text-amber-400'
                                                        : quest.status ===
                                                            'submitted'
                                                          ? 'border-yellow-255 text-yellow-750 bg-yellow-50 dark:border-slate-800 dark:bg-slate-950 dark:text-yellow-400'
                                                          : 'border-slate-250 bg-slate-100 text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400'
                                    }`}
                                >
                                    {quest.status === 'open'
                                        ? 'Pendaftaran Dibuka'
                                        : quest.status === 'draft'
                                          ? 'Menunggu Moderasi'
                                          : quest.status === 'rejected'
                                            ? 'Ditolak'
                                            : quest.status === 'expired'
                                              ? 'Kadaluarsa'
                                              : quest.status === 'ongoing'
                                                ? 'Pengerjaan Proyek'
                                                : quest.status === 'approved'
                                                  ? 'Draf Disetujui'
                                                  : quest.status === 'payment'
                                                    ? 'Proses Transfer'
                                                    : quest.status ===
                                                        'submitted'
                                                      ? 'Ditinjau Klien'
                                                      : 'Proyek Selesai'}
                                </span>
                            </div>
                        </div>

                        {/* Title and Client Details */}
                        <div className="space-y-3">
                            <h1 className="w-full text-xl leading-snug font-extrabold tracking-tight break-words whitespace-normal text-slate-900 sm:text-2xl md:text-3xl dark:text-white">
                                {quest.title}
                            </h1>

                            <div className="text-slate-505 flex items-center gap-2.5 text-xs dark:text-slate-400">
                                <div className="text-slate-655 flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 font-bold dark:bg-slate-950 dark:text-slate-300">
                                    <User className="h-3.5 w-3.5" />
                                </div>
                                <div>
                                    <span className="mr-1 text-[10px] font-bold text-slate-400 uppercase">
                                        Pemilik Lowongan:
                                    </span>
                                    <span className="font-bold text-slate-800 dark:text-white">
                                        {quest.creator.name}
                                    </span>
                                    <span className="ml-1.5 text-xs font-normal text-slate-400">
                                        (
                                        {quest.creator.role === 'admin'
                                            ? 'Administrator'
                                            : 'Siswa'}
                                        )
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Warning/Status Cards */}
                        {quest.status === 'draft' && (
                            <div className="border-amber-250 flex flex-col gap-3 rounded-xl border bg-amber-50/20 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-amber-900/40 dark:bg-amber-950/20">
                                <div className="flex items-start gap-3">
                                    <Clock className="mt-0.5 h-5 w-5 shrink-0 animate-pulse text-amber-600 dark:text-amber-400" />
                                    <div>
                                        <span className="block text-xs font-bold text-amber-800 dark:text-amber-300">
                                            Menunggu Persetujuan Admin
                                        </span>
                                        <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                                            Papan proyek ini masih dalam tahap
                                            pengajuan. Administrator akan
                                            memeriksa deskripsi dan budget
                                            penawaran sebelum lowongan ini
                                            dipublikasikan secara umum.
                                        </p>
                                    </div>
                                </div>
                                {isCreator && (
                                    <div className="flex shrink-0 items-center gap-2 pt-2 sm:pt-0">
                                        <Link
                                            href={`/student/quests/${quest._id}/edit`}
                                            className="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-amber-700"
                                        >
                                            Edit Draf Quest
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (
                                                    confirm(
                                                        'Apakah Anda yakin ingin membatalkan dan menghapus draf quest ini?',
                                                    )
                                                ) {
                                                    router.delete(
                                                        `/student/quests/${quest._id}`,
                                                    );
                                                }
                                            }}
                                            className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 dark:border-red-900/50 dark:bg-[#030712] dark:text-red-400 dark:hover:bg-red-950/40"
                                        >
                                            Hapus Draf
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {quest.status === 'rejected' && (
                            <div className="space-y-3 rounded-xl border border-red-200 bg-red-50/20 p-4 dark:border-red-900/40 dark:bg-red-950/20">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex items-start gap-3">
                                        <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
                                        <div>
                                            <span className="block text-xs font-bold text-red-800 dark:text-red-300">
                                                Pengajuan Proyek Ditolak
                                                Administrator
                                            </span>
                                            <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                                                Pihak administrator meminta
                                                perbaikan pada rilis lowongan
                                                proyek ini. Silakan perbaiki
                                                parameter quest atau tambahkan
                                                berkas sesuai catatan penolakan.
                                            </p>
                                        </div>
                                    </div>
                                    {isCreator && (
                                        <div className="flex shrink-0 items-center gap-2 pt-2 sm:pt-0">
                                            <Link
                                                href={`/student/quests/${quest._id}/edit`}
                                                className="rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-indigo-700"
                                            >
                                                Perbaiki & Ajukan Ulang
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (
                                                        confirm(
                                                            'Apakah Anda yakin ingin membatalkan dan menghapus draf quest ini?',
                                                        )
                                                    ) {
                                                        router.delete(
                                                            `/student/quests/${quest._id}`,
                                                        );
                                                    }
                                                }}
                                                className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 dark:border-red-900/50 dark:bg-[#030712] dark:text-red-400 dark:hover:bg-red-950/40"
                                            >
                                                Hapus Draf
                                            </button>
                                        </div>
                                    )}
                                </div>
                                {quest.rejection_note && (
                                    <div className="rounded-lg border border-red-200/60 bg-red-50/50 p-3 dark:border-red-900/30 dark:bg-[#040812]">
                                        <strong className="block text-[10px] tracking-wider text-red-600 uppercase dark:text-red-400">
                                            Catatan Alasan Penolakan Admin:
                                        </strong>
                                        <p className="mt-1 text-xs leading-relaxed whitespace-pre-wrap text-slate-700 dark:text-slate-300">
                                            {quest.rejection_note}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {quest.status === 'expired' && (
                            <div className="dark:border-slate-805 flex gap-3 rounded-lg border border-red-200 bg-red-50/15 p-4 dark:bg-slate-950">
                                <Clock className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                                <div>
                                    <span className="text-red-705 block text-xs font-bold dark:text-red-400">
                                        Proyek Kadaluarsa (Expired)
                                    </span>
                                    <p className="dark:text-slate-405 mt-1 text-xs leading-relaxed text-slate-500">
                                        Proyek ini telah melewati batas masa
                                        pendaftaran atau tenggat kerja tanpa
                                        adanya deliverables diserahkan. Kontrak
                                        dibatalkan secara otomatis oleh sistem.
                                    </p>
                                </div>
                            </div>
                        )}

                        {['open', 'ongoing'].includes(quest.status) &&
                            new Date(quest.deadline).getTime() <
                                new Date().getTime() && (
                                <div className="dark:border-slate-805 flex gap-3 rounded-lg border border-red-200 bg-red-50/15 p-4 dark:bg-slate-950">
                                    <Clock className="text-red-650 mt-0.5 h-5 w-5 shrink-0 animate-pulse" />
                                    <div>
                                        <span className="block text-xs font-bold text-red-700 dark:text-red-400">
                                            Batas Waktu Telah Terlewati
                                        </span>
                                        <p className="text-slate-505 mt-1 text-xs leading-relaxed dark:text-slate-400">
                                            {quest.status === 'open'
                                                ? 'Pendaftaran proyek ini sudah berakhir karena melewati deadline yang ditentukan.'
                                                : 'Pekerja telah melewati batas pengerjaan proyek. Hubungi admin atau buat laporan dispute jika dibutuhkan.'}
                                        </p>
                                    </div>
                                </div>
                            )}
                    </div>
                </div>

                {/* 2. STEPPER TIMELINE BOX (SEPARATED CARD) */}
                <QuestStepper status={quest.status} />

                {/* 3. MAIN WORKSPACE GRID */}
                <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
                    {/* LEFT AREA: WORKSPACE CONTROL (col-span-8) */}
                    <div className="space-y-6 lg:col-span-8">
                        {/* Tabs */}
                        <div className="border-slate-205 flex shrink-0 gap-6 border-b pb-px text-xs font-bold dark:border-slate-800">
                            <button
                                onClick={() => setActiveTab('detail')}
                                className={`relative cursor-pointer pb-2.5 transition-colors ${
                                    activeTab === 'detail'
                                        ? 'text-indigo-650 dark:text-indigo-400'
                                        : 'text-slate-455 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
                                }`}
                            >
                                <span className="flex items-center gap-1.5">
                                    <FileText size={13} />
                                    Spesifikasi Proyek
                                </span>
                                {activeTab === 'detail' && (
                                    <span className="bg-indigo-650 absolute right-0 bottom-0 left-0 h-0.5 rounded dark:bg-indigo-400" />
                                )}
                            </button>

                            <button
                                onClick={() => setActiveTab('project')}
                                className={`relative cursor-pointer pb-2.5 transition-colors ${
                                    activeTab === 'project'
                                        ? 'text-indigo-650 dark:text-indigo-400'
                                        : 'text-slate-455 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
                                }`}
                            >
                                <span className="flex items-center gap-1.5">
                                    <Briefcase size={13} />
                                    {isCreator
                                        ? 'Manajemen Proyek'
                                        : isWorker
                                          ? 'Workspace Pengerjaan'
                                          : 'Status & Pengajuan'}
                                </span>
                                {activeTab === 'project' && (
                                    <span className="bg-indigo-650 absolute right-0 bottom-0 left-0 h-0.5 rounded dark:bg-indigo-400" />
                                )}
                            </button>

                            {isCreator && quest.status === 'open' && (
                                <button
                                    onClick={() => setActiveTab('bids')}
                                    className={`relative cursor-pointer pb-2.5 transition-colors ${
                                        activeTab === 'bids'
                                            ? 'text-indigo-650 dark:text-indigo-400'
                                            : 'text-slate-455 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
                                    }`}
                                >
                                    <span className="flex items-center gap-1.5">
                                        <MessageSquare size={13} />
                                        Pelamar Kerja ({bids.length})
                                    </span>
                                    {activeTab === 'bids' && (
                                        <span className="bg-indigo-650 absolute right-0 bottom-0 left-0 h-0.5 rounded dark:bg-indigo-400" />
                                    )}
                                </button>
                            )}
                        </div>

                        {/* TAB CONTENT: DETAIL */}
                        {activeTab === 'detail' && (
                            <div className="relative space-y-3 overflow-hidden rounded-xl border border-slate-300 bg-white p-6 shadow-sm dark:border-slate-800/80 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]">
                                <div className="pointer-events-none absolute top-0 right-8 left-8 z-0 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent select-none dark:via-slate-700" />
                                <div className="relative z-10 space-y-3">
                                    <h3 className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                                        Detail Penugasan & Deskripsi
                                    </h3>
                                    <div className="text-slate-755 dark:text-slate-250 rounded-lg border border-slate-200/60 bg-slate-50/50 p-4 text-xs leading-relaxed whitespace-pre-wrap dark:border-slate-800 dark:bg-[#030712]/40">
                                        {quest.description}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB CONTENT: PROJECT MANAGEMENT */}
                        {activeTab === 'project' && (
                            <div className="space-y-6">
                                {quest.dispute && (
                                    <div
                                        className={`flex gap-3 rounded-lg border p-4 ${
                                            quest.status === 'disputed'
                                                ? 'text-red-655 border-red-200 bg-red-50/15 dark:border-slate-800 dark:bg-slate-950/40 dark:text-red-400'
                                                : 'border-green-200 bg-green-50/15 text-green-700 dark:border-slate-800 dark:bg-slate-950/40 dark:text-green-400'
                                        }`}
                                    >
                                        <ShieldAlert className="h-5 w-5 shrink-0 text-red-600" />
                                        <div className="space-y-1 text-xs">
                                            <span className="block font-bold tracking-wider uppercase">
                                                {quest.status === 'disputed'
                                                    ? 'Proyek Ditangguhkan (Dalam Proses Banding)'
                                                    : 'Arbitrase Diselesaikan'}
                                            </span>
                                            <p className="text-slate-505 leading-relaxed dark:text-slate-400">
                                                {quest.status === 'disputed'
                                                    ? `Dispute diajukan oleh ${quest.dispute.filer_name} dengan alasan: "${quest.dispute.reason}". Penyerahan poin/hadiah ditangguhkan sementara menunggu peninjauan administrator.`
                                                    : `Perselisihan diselesaikan dengan keputusan mediator: ${
                                                          [
                                                              'refund',
                                                              'refund_creator',
                                                          ].includes(
                                                              quest.dispute
                                                                  .ruling ?? '',
                                                          )
                                                              ? 'Proyek dibatalkan dan seluruh budget/hadiah dikembalikan ke klien.'
                                                              : [
                                                                      'pay_worker',
                                                                      'release_payout',
                                                                  ].includes(
                                                                      quest
                                                                          .dispute
                                                                          .ruling ??
                                                                          '',
                                                                  )
                                                                ? 'Seluruh poin & reputasi penuh diserahkan kepada pekerja.'
                                                                : `Bagi hasil (Kontraktor mendapat ${quest.dispute.split_percentage}%).`
                                                      } Penjelasan: "${quest.dispute.note}".`}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {isCreator ? (
                                    <CreatorProjectPanel
                                        quest={quest}
                                        bids={bids}
                                        setSelectedChatBid={setSelectedChatBid}
                                        formatBytes={formatBytes}
                                    />
                                ) : isWorker ? (
                                    <WorkerProjectPanel
                                        quest={quest}
                                        myBid={myBid}
                                        setSelectedChatBid={setSelectedChatBid}
                                        formatBytes={formatBytes}
                                    />
                                ) : (
                                    <VisitorBidPanel
                                        quest={quest}
                                        myBid={myBid}
                                        can={can}
                                        setSelectedChatBid={setSelectedChatBid}
                                    />
                                )}

                                <VersionControlHistory quest={quest} />

                                <DisputePanel
                                    quest={quest}
                                    isCreator={isCreator}
                                    isWorker={isWorker}
                                />
                            </div>
                        )}

                        {/* TAB CONTENT: BIDS / APPLICANTS LIST */}
                        {activeTab === 'bids' &&
                            isCreator &&
                            quest.status === 'open' && (
                                <BidsTabPanel
                                    quest={quest}
                                    bids={bids}
                                    setSelectedChatBid={setSelectedChatBid}
                                />
                            )}
                    </div>

                    {/* RIGHT AREA: SPECIFICATIONS SIDEBAR (col-span-4) */}
                    <div className="space-y-6 lg:col-span-4">
                        {/* Worker assigned info shortcut */}
                        {quest.worker && (
                            <div className="relative flex items-center justify-between gap-3 overflow-hidden rounded-xl border border-emerald-300 bg-emerald-50/50 p-4 shadow-sm dark:border-slate-800/80 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]">
                                <div className="pointer-events-none absolute top-0 right-8 left-8 z-0 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent select-none dark:via-slate-700" />
                                <div className="relative z-10 flex min-w-0 items-center gap-2.5">
                                    <CheckCircle2 className="text-emerald-650 h-5 w-5 shrink-0" />
                                    <div className="min-w-0">
                                        <span className="block text-[8px] font-bold tracking-wider text-slate-400 uppercase">
                                            Kontraktor Ditunjuk
                                        </span>
                                        <span className="block truncate text-xs font-bold text-slate-800 dark:text-white">
                                            {quest.worker.name}
                                        </span>
                                    </div>
                                </div>
                                <span className="relative z-10 shrink-0 rounded bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-700 uppercase dark:bg-[#030712] dark:text-emerald-400">
                                    Aktif
                                </span>
                            </div>
                        )}

                        {/* Rincian Quest Side Panel */}
                        <div className="relative space-y-5 overflow-hidden rounded-xl border border-slate-300 bg-white p-6 shadow-sm dark:border-slate-800/80 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]">
                            <div className="pointer-events-none absolute top-0 right-8 left-8 z-0 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent select-none dark:via-slate-700" />
                            <h3 className="relative z-10 border-b border-slate-100 pb-3 text-xs font-bold text-slate-800 uppercase dark:border-slate-800 dark:text-slate-200">
                                Detail Spesifikasi
                            </h3>

                            {/* Budget Spec */}
                            <div className="flex items-center gap-3">
                                <div>
                                    <span className="block text-[10px] font-bold text-slate-400 uppercase">
                                        Estimasi Anggaran
                                    </span>
                                    <span className="text-xs font-bold text-slate-800 dark:text-white">
                                        {formatCurrency(
                                            quest.min_budget ??
                                                quest.min_salary ??
                                                0,
                                        )}{' '}
                                        -{' '}
                                        {formatCurrency(
                                            quest.max_budget ??
                                                quest.max_salary ??
                                                0,
                                        )}
                                    </span>
                                </div>
                            </div>

                            {/* Deadline Spec */}
                            <div className="flex items-center gap-3">
                                <div>
                                    <span className="block text-[10px] font-bold text-slate-400 uppercase">
                                        Tenggat Waktu
                                    </span>
                                    <span className="text-slate-805 text-xs font-bold dark:text-white">
                                        {formatDate(quest.deadline)}
                                    </span>
                                </div>
                            </div>

                            {/* Remaining Time */}
                            {[
                                'open',
                                'ongoing',
                                'submitted',
                                'disputed',
                                'expired',
                            ].includes(quest.status) &&
                                (() => {
                                    const remaining = calculateDaysRemaining();
                                    return (
                                        <div className="border-t border-slate-100 pt-2 dark:border-slate-800">
                                            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase">
                                                <span>
                                                    {remaining.isLate
                                                        ? 'Keterlambatan'
                                                        : 'Sisa Waktu'}
                                                </span>
                                                <span
                                                    className={`rounded px-2.5 py-0.5 text-[9px] font-bold tracking-wider uppercase ${remaining.className}`}
                                                >
                                                    {remaining.text}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })()}

                            {/* Project Contribution & Value Metrics (EXP/GOLD/ERP) */}
                            <div className="space-y-3 border-t border-slate-100 pt-4 dark:border-slate-800">
                                <span className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                    Metrik Kontribusi & Reputasi
                                </span>
                                <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold">
                                    <div className="flex flex-col items-center rounded-lg border border-slate-200/65 bg-slate-50 py-2.5 dark:border-slate-800/80 dark:bg-[#030712]/40">
                                        <span className="text-[9px] font-semibold text-slate-400 uppercase">
                                            EXP
                                        </span>
                                        <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                                            +{quest.rewards?.exp ?? 250}
                                        </span>
                                    </div>
                                    <div className="flex flex-col items-center rounded-lg border border-slate-200/65 bg-slate-50 py-2.5 dark:border-slate-800/80 dark:bg-[#030712]/40">
                                        <span className="text-[9px] font-semibold text-slate-400 uppercase">
                                            GOLD
                                        </span>
                                        <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                                            +{quest.rewards?.gold ?? 150}
                                        </span>
                                    </div>
                                    <div className="flex flex-col items-center rounded-lg border border-slate-200/65 bg-slate-50 py-2.5 dark:border-slate-800/80 dark:bg-[#030712]/40">
                                        <span className="text-[9px] font-semibold text-slate-400 uppercase">
                                            ERP
                                        </span>
                                        <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                                            +{quest.rewards?.erp ?? 100}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Lampiran Pendukung Card (Positioned directly under Detail Spesifikasi) */}
                        {((quest.images && quest.images.length > 0) ||
                            (quest.files && quest.files.length > 0)) && (
                            <div className="relative overflow-hidden rounded-xl border border-slate-300 bg-white p-6 shadow-sm dark:border-slate-800/80 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]">
                                <div className="pointer-events-none absolute top-0 right-8 left-8 z-0 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent select-none dark:via-slate-700" />
                                <QuestAttachments
                                    images={quest.images}
                                    files={quest.files}
                                    onPreviewImage={setPreviewImage}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Chat Panel Modal Overlay */}
            {selectedChatBid && (
                <QuestChatPanel
                    bidId={selectedChatBid.id}
                    questTitle={quest.title}
                    targetUserName={selectedChatBid.name}
                    isDisputed={quest.status === 'disputed'}
                    creatorId={quest.creator_id}
                    workerId={quest.worker_id ?? undefined}
                    onClose={() => {
                        setSelectedChatBid(null);
                        router.reload({ only: ['bids', 'myBid'] });
                    }}
                />
            )}

            {/* Image Preview Modal */}
            {previewImage && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div
                        onClick={() => setPreviewImage(null)}
                        className="absolute inset-0 cursor-pointer bg-black/80 backdrop-blur-md transition-all"
                    />

                    <div className="relative z-10 flex max-h-[85vh] w-full max-w-4xl flex-col items-center overflow-hidden rounded-xl border border-slate-800 bg-[#0d1117] p-4 shadow-2xl">
                        <div className="mb-3 flex w-full items-center justify-between border-b border-slate-800/80 pb-2">
                            <span className="max-w-xs truncate text-xs font-bold text-white sm:max-w-md">
                                {previewImage.name}
                            </span>
                            <button
                                onClick={() => setPreviewImage(null)}
                                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded text-slate-400 hover:bg-white/10 hover:text-white"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="flex min-h-0 w-full flex-1 items-center justify-center">
                            <img
                                src={previewImage.url}
                                alt={previewImage.name}
                                className="max-h-[70vh] max-w-full rounded object-contain"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
