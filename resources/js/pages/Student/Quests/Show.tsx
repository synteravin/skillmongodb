import { useForm, Link, router, usePage } from '@inertiajs/react';
import React, { useState } from 'react';
import {
    ArrowLeft,
    Send,
    Check,
    Calendar,
    DollarSign,
    Briefcase,
    FileText,
    User,
    Star,
    Paperclip,
    Download,
    Image as ImageIcon,
    FileArchive,
    CheckCircle2,
    MessageSquare,
    Eye,
    EyeOff,
    Clock,
    Award,
    ShieldAlert,
} from 'lucide-react';
import QuestChatPanel from '@/components/Quest/QuestChatPanel';
import ConfirmModal from '@/components/ConfirmModal';
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
        return `${datePart} pukul ${timePart}`;
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
                    'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
                isExpired: false,
                isLate: false,
            };
        }

        if (quest.status === 'cancelled') {
            return {
                text: 'Dibatalkan',
                className:
                    'bg-red-500/10 text-red-650 dark:text-red-400 border border-red-500/20',
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
                timeStr = `${days}h ${hours}j Tersisa`;
            } else if (hours > 0) {
                timeStr = `${hours}j ${minutes}m ...`;
            } else {
                timeStr = `${minutes}m Tersisa`;
            }

            return {
                text: timeStr,
                className:
                    'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20',
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
                lateStr = `${days}h ${hours}j`;
            } else {
                lateStr = `${hours}j`;
            }

            if (quest.status === 'open' || quest.status === 'draft') {
                return {
                    text: 'Pendaftaran Ditutup (Expired)',
                    className:
                        'bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20',
                    isExpired: true,
                    isLate: false,
                };
            } else {
                return {
                    text: `Terlambat ${lateStr}`,
                    className:
                        'bg-rose-500/10 text-rose-650 dark:text-rose-400 border border-rose-500/20 font-bold',
                    isExpired: true,
                    isLate: true,
                };
            }
        }
    };

    return (
        <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-slate-50 p-4 font-sans text-slate-800 transition-colors duration-300 sm:p-6 md:p-8 dark:bg-[#060813] dark:text-slate-100">
            {/* Ambient Background Glows */}
            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
                <div className="absolute top-0 right-1/4 h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-[150px]" />
                <div className="absolute bottom-10 left-1/4 h-[400px] w-[400px] rounded-full bg-purple-500/10 blur-[150px]" />
            </div>

            <div className="z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6">
                {/* 1. RPG HERO QUEST HEADER */}
                <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50/50 p-6 shadow-xl dark:border-[#1d2645] dark:from-[#0d1226]/85 dark:to-[#090d1a]/95">
                    {/* Decorative abstract glows */}
                    <div className="absolute top-0 right-0 -z-10 h-32 w-32 rounded-full bg-indigo-500/10 blur-2xl" />
                    <div className="absolute bottom-0 left-0 -z-10 h-24 w-24 rounded-full bg-purple-500/10 blur-xl" />

                    <div className="space-y-6">
                        {/* Breadcrumbs & Badge */}
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <Link
                                href="/student/quests"
                                className="inline-flex items-center gap-2 font-['Orbitron'] text-xs font-bold tracking-widest text-slate-500 uppercase transition-colors hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                            >
                                <ArrowLeft size={14} />
                                Kembali ke Board
                            </Link>

                            <div>
                                <span
                                    className={`rounded-xl border px-4 py-1.5 font-['Orbitron'] text-xs font-black tracking-wider uppercase ${
                                        quest.status === 'open'
                                            ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                            : quest.status === 'draft'
                                              ? 'border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                              : quest.status === 'rejected'
                                                ? 'border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400'
                                                : quest.status === 'expired'
                                                  ? 'text-red-650 border-red-500/20 bg-red-500/10 dark:text-red-400'
                                                  : quest.status === 'ongoing'
                                                    ? 'border-indigo-500/20 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                                                    : quest.status ===
                                                        'approved'
                                                      ? 'border-purple-500/20 bg-purple-500/10 text-purple-600 dark:text-purple-400'
                                                      : quest.status ===
                                                          'payment'
                                                        ? 'text-amber-650 border-amber-500/25 bg-amber-500/10 dark:text-amber-400'
                                                        : quest.status ===
                                                            'submitted'
                                                          ? 'border-yellow-500/20 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
                                                          : 'border-slate-500/20 bg-slate-500/10 text-slate-600 dark:text-slate-400'
                                    }`}
                                >
                                    {quest.status === 'open'
                                        ? 'Tersedia'
                                        : quest.status === 'draft'
                                          ? 'Menunggu Review'
                                          : quest.status === 'rejected'
                                            ? 'Ditolak'
                                            : quest.status === 'expired'
                                              ? 'Kadaluarsa'
                                              : quest.status === 'ongoing'
                                                ? 'Pengerjaan'
                                                : quest.status === 'approved'
                                                  ? 'Disetujui'
                                                  : quest.status === 'payment'
                                                    ? 'Pembayaran'
                                                    : quest.status ===
                                                        'submitted'
                                                      ? 'Ditinjau'
                                                      : 'Selesai'}
                                </span>
                            </div>
                        </div>

                        {/* Title and Creator Info */}
                        <div className="space-y-3 font-['Oxanium']">
                            <h1 className="text-2xl leading-tight font-extrabold tracking-tight text-slate-900 sm:text-3xl md:text-4xl dark:text-white">
                                {quest.title}
                            </h1>

                            <div className="flex items-center gap-2.5 text-xs text-slate-500 sm:text-sm dark:text-blue-300/80">
                                <div className="flex h-7 w-7 items-center justify-center rounded-full border border-indigo-500/20 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                                    <User className="h-3.5 w-3.5" />
                                </div>
                                <div>
                                    <span className="mr-1 text-[10px] font-semibold text-slate-400 uppercase">
                                        Pembuat:
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

                        {/* Status Banners */}
                        {quest.status === 'draft' && (
                            <div className="flex gap-3 rounded-xl border border-amber-500/25 bg-amber-500/10 p-4 font-['Oxanium']">
                                <Clock className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
                                <div>
                                    <span className="block font-['Orbitron'] text-xs font-bold tracking-wider text-amber-600 uppercase dark:text-amber-400">
                                        ⏳ Menunggu Persetujuan Admin
                                    </span>
                                    <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-300">
                                        Quest Anda telah berhasil diajukan and
                                        sedang menunggu moderasi/persetujuan
                                        dari pihak Admin sebelum dipublikasikan
                                        ke papan quest umum.
                                    </p>
                                </div>
                            </div>
                        )}

                        {quest.status === 'rejected' && (
                            <div className="space-y-3 rounded-xl border border-red-500/25 bg-red-500/10 p-4 font-['Oxanium']">
                                <div className="flex gap-3">
                                    <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                                    <div>
                                        <span className="text-red-650 block font-['Orbitron'] text-xs font-bold tracking-wider uppercase dark:text-red-400">
                                            ❌ Quest Ditolak Oleh Admin
                                        </span>
                                        <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-300">
                                            Pihak administrator telah menolak
                                            pengajuan quest ini. Anda dapat
                                            memperbaiki detail quest di bawah
                                            ini sesuai alasan penolakannya.
                                        </p>
                                    </div>
                                </div>
                                {quest.rejection_note && (
                                    <div className="rounded-lg border border-red-500/10 bg-red-500/5 p-3">
                                        <strong className="block font-['Orbitron'] text-[10px] tracking-wider text-red-500 uppercase">
                                            Alasan Penolakan:
                                        </strong>
                                        <p className="mt-1 text-xs leading-relaxed whitespace-pre-wrap text-slate-600 dark:text-slate-300">
                                            {quest.rejection_note}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {quest.status === 'expired' && (
                            <div className="flex gap-3 rounded-xl border border-red-500/25 bg-red-500/10 p-4 font-['Oxanium']">
                                <Clock className="text-red-650 mt-0.5 h-5 w-5 shrink-0 dark:text-red-400" />
                                <div>
                                    <span className="block font-['Orbitron'] text-xs font-bold tracking-wider text-red-600 uppercase dark:text-red-400">
                                        🚨 Quest Kadaluarsa (Expired)
                                    </span>
                                    <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-300">
                                        Quest ini telah kadaluarsa karena
                                        melewati tenggat waktu pengerjaan
                                        sebelum selesai. Pekerja dibebaskan dari
                                        tugas ini secara otomatis oleh sistem.
                                    </p>
                                </div>
                            </div>
                        )}

                        {['open', 'ongoing'].includes(quest.status) &&
                            new Date(quest.deadline).getTime() <
                                new Date().getTime() && (
                                <div className="flex gap-3 rounded-xl border border-red-500/25 bg-red-500/10 p-4 font-['Oxanium']">
                                    <Clock className="mt-0.5 h-5 w-5 shrink-0 animate-pulse text-red-600 dark:text-red-400" />
                                    <div>
                                        <span className="block font-['Orbitron'] text-xs font-bold tracking-wider text-red-600 uppercase dark:text-red-400">
                                            ⚠️ Peringatan: Tenggat Waktu
                                            Terlewati
                                        </span>
                                        <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-300">
                                            {quest.status === 'open'
                                                ? 'Batas waktu pendaftaran untuk quest ini telah berakhir.'
                                                : 'Pekerja telah melewati batas waktu pengerjaan proyek. Harap hubungi admin atau lakukan arbitrase jika diperlukan.'}
                                        </p>
                                    </div>
                                </div>
                            )}

                        {/* Stepper Progress Timeline */}
                        <QuestStepper status={quest.status} />
                    </div>
                </div>

                {/* 3. MAIN CONTENT GRID */}
                <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
                    {/* LEFT COLUMN: TAB NAVIGATION & TAB PANELS (col-span-8) */}
                    <div className="space-y-6 lg:col-span-8">
                        {/* Tab Buttons */}
                        <div className="flex shrink-0 gap-6 border-b border-slate-200 font-['Orbitron'] text-xs font-black tracking-wider dark:border-slate-800/80">
                            <button
                                onClick={() => setActiveTab('detail')}
                                className={`relative cursor-pointer pb-3 transition-colors ${
                                    activeTab === 'detail'
                                        ? 'font-extrabold text-indigo-600 dark:text-indigo-400'
                                        : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                                }`}
                            >
                                <span className="flex items-center gap-1.5">
                                    <FileText size={14} />
                                    Deskripsi Quest
                                </span>
                                {activeTab === 'detail' && (
                                    <span className="absolute right-0 bottom-0 left-0 h-0.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                                )}
                            </button>

                            <button
                                onClick={() => setActiveTab('project')}
                                className={`relative cursor-pointer pb-3 transition-colors ${
                                    activeTab === 'project'
                                        ? 'font-extrabold text-indigo-600 dark:text-indigo-400'
                                        : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                                }`}
                            >
                                <span className="flex items-center gap-1.5 font-['Orbitron']">
                                    <Briefcase size={14} />
                                    {isCreator
                                        ? 'Manajemen Proyek'
                                        : isWorker
                                          ? 'Pengerjaan Proyek'
                                          : 'Status & Penawaran'}
                                </span>
                                {activeTab === 'project' && (
                                    <span className="absolute right-0 bottom-0 left-0 h-0.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                                )}
                            </button>

                            {isCreator && quest.status === 'open' && (
                                <button
                                    onClick={() => setActiveTab('bids')}
                                    className={`relative cursor-pointer pb-3 transition-colors ${
                                        activeTab === 'bids'
                                            ? 'font-extrabold text-indigo-600 dark:text-indigo-400'
                                            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                                    }`}
                                >
                                    <span className="flex items-center gap-1.5">
                                        <MessageSquare size={14} />
                                        Pelamar ({bids.length})
                                    </span>
                                    {activeTab === 'bids' && (
                                        <span className="absolute right-0 bottom-0 left-0 h-0.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                                    )}
                                </button>
                            )}
                        </div>
                        {/* TAB 1: DETAILS */}
                        {activeTab === 'detail' && (
                            <div className="space-y-6 rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-md backdrop-blur-md transition-all duration-300 dark:border-slate-800/80 dark:bg-[#0c122c]/40">
                                <div className="space-y-3">
                                    <h3 className="font-['Orbitron'] text-xs font-bold tracking-wider text-slate-400 uppercase dark:text-blue-300/60">
                                        Deskripsi Pekerjaan
                                    </h3>
                                    <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 font-['Oxanium'] text-sm leading-relaxed whitespace-pre-wrap text-slate-700 sm:text-base dark:border-slate-800/40 dark:bg-black/10 dark:text-slate-200">
                                        {quest.description}
                                    </div>
                                </div>

                                {/* Lampiran Quest (Gambar & File) */}
                                <QuestAttachments
                                    images={quest.images}
                                    files={quest.files}
                                    onPreviewImage={setPreviewImage}
                                />
                            </div>
                        )}{' '}
                        {/* TAB 2: PROJECT MANAGEMENT */}
                        {activeTab === 'project' && (
                            <div className="space-y-6">
                                {/* DISPUTE STATUS ALERT */}
                                {quest.dispute && (
                                    <div
                                        className={`flex gap-3 rounded-xl border p-4 font-['Oxanium'] ${
                                            quest.status === 'disputed'
                                                ? 'border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400'
                                                : 'border-green-500/20 bg-green-500/10 text-green-600 dark:text-green-400'
                                        }`}
                                    >
                                        <ShieldAlert className="h-5 w-5 shrink-0 text-red-500" />
                                        <div className="space-y-1 text-xs">
                                            <span className="block font-['Orbitron'] font-bold tracking-wider uppercase">
                                                {quest.status === 'disputed'
                                                    ? 'Quest Ditangguhkan (Dispute Diajukan)'
                                                    : 'Arbitrase Sengketa Selesai'}
                                            </span>
                                            <p className="leading-relaxed text-slate-500 dark:text-slate-400">
                                                {quest.status === 'disputed'
                                                    ? `Dispute diajukan oleh ${quest.dispute.filer_name} dengan alasan: "${quest.dispute.reason}". Pemberian reward ditangguhkan sementara menunggu keputusan arbitrase admin.`
                                                    : `Perselisihan telah diselesaikan oleh Admin dengan putusan: ${
                                                          [
                                                              'refund',
                                                              'refund_creator',
                                                          ].includes(
                                                              quest.dispute
                                                                  .ruling ?? '',
                                                          )
                                                              ? 'Pembatalan quest dan seluruh reward dibatalkan.'
                                                              : [
                                                                      'pay_worker',
                                                                      'release_payout',
                                                                  ].includes(
                                                                      quest
                                                                          .dispute
                                                                          .ruling ??
                                                                          '',
                                                                  )
                                                                ? 'Pemberian reward penuh diserahkan kepada pekerja.'
                                                                : `Bagi hasil (${quest.dispute.split_percentage}% untuk pekerja).`
                                                      } Catatan: "${quest.dispute.note}".`}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {/* REPLACE_ME_WORKFLOW */}
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
                        {/* TAB 3: BIDS / APPLICANTS LIST (Creator Only, Quest Open) */}
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

                    {/* RIGHT COLUMN: SIDEBAR SPECIFICATION CARDS (col-span-4) */}
                    <div className="space-y-6 lg:col-span-4">
                        {/* WORKER SUMMARY (Right column shortcut) */}
                        {quest.worker && (
                            <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 font-['Oxanium'] shadow-sm">
                                <div className="flex min-w-0 items-center gap-2.5">
                                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                                    <div className="min-w-0">
                                        <span className="block text-[8px] font-semibold tracking-wider text-slate-400 uppercase">
                                            Status Pekerja
                                        </span>
                                        <span className="block truncate text-xs font-bold text-slate-800 dark:text-white">
                                            {quest.worker.name}
                                        </span>
                                    </div>
                                </div>
                                <span className="shrink-0 rounded bg-emerald-500/20 px-2 py-0.5 font-['Orbitron'] text-[9px] font-bold text-emerald-600 uppercase dark:text-emerald-400">
                                    Aktif
                                </span>
                            </div>
                        )}
                        {/* SPECIFICATION CARD */}
                        <div className="space-y-5 rounded-2xl border border-slate-200 bg-white/70 p-6 font-['Oxanium'] shadow-md backdrop-blur-md transition-all duration-300 dark:border-slate-800/80 dark:bg-[#0c122c]/40">
                            <h3 className="border-b border-slate-100 pb-3 font-['Orbitron'] text-xs font-bold tracking-wider text-slate-700 uppercase dark:border-slate-800 dark:text-blue-200">
                                Rincian Quest
                            </h3>

                            {/* Budget Spec */}
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-purple-500/20 bg-purple-500/10 text-purple-600 dark:text-purple-400">
                                    <DollarSign className="h-5 w-5" />
                                </div>
                                <div>
                                    <span className="block text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                                        Gaji / Anggaran
                                    </span>
                                    <span className="font-['Orbitron'] text-sm font-bold text-slate-800 dark:text-white">
                                        {formatCurrency(quest.min_salary)} -{' '}
                                        {formatCurrency(quest.max_salary)}
                                    </span>
                                </div>
                            </div>

                            {/* Deadline Spec */}
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                                    <Calendar className="h-5 w-5" />
                                </div>
                                <div>
                                    <span className="text-slate-405 block text-[10px] font-semibold tracking-wider uppercase">
                                        Tenggat Waktu
                                    </span>
                                    <span className="text-xs font-bold text-slate-800 sm:text-sm dark:text-white">
                                        {formatDate(quest.deadline)}
                                    </span>
                                </div>
                            </div>

                            {/* Countdown Progress */}
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
                                        <div className="pt-2">
                                            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase">
                                                <span>
                                                    {remaining.isLate
                                                        ? 'Status Keterlambatan'
                                                        : 'Sisa Waktu'}
                                                </span>
                                                <span
                                                    className={`rounded px-2 py-0.5 font-['Orbitron'] text-[10px] font-bold tracking-wider ${remaining.className}`}
                                                >
                                                    {remaining.text}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })()}

                            {/* RPG Rewards Container */}
                            <div className="space-y-3 border-t border-slate-100 pt-4 dark:border-slate-800">
                                <span className="block font-['Orbitron'] text-[10px] font-bold tracking-wider text-purple-600 uppercase dark:text-purple-400">
                                    RPG Quest Rewards
                                </span>
                                <div className="grid grid-cols-3 gap-2 text-center font-['Orbitron'] text-xs font-bold">
                                    <div className="flex flex-col items-center rounded-xl border border-purple-500/20 bg-purple-500/10 py-2.5 text-purple-600 transition-transform hover:scale-[1.03] dark:text-purple-300">
                                        <Award className="mb-1 h-3.5 w-3.5 text-purple-500" />
                                        <span className="font-['Oxanium'] text-[9px] font-semibold text-slate-400">
                                            EXP
                                        </span>
                                        <span className="text-[11px] font-black">
                                            +{quest.rewards?.exp ?? 250}
                                        </span>
                                    </div>
                                    <div className="flex flex-col items-center rounded-xl border border-amber-500/20 bg-amber-500/10 py-2.5 text-amber-600 transition-transform hover:scale-[1.03] dark:text-amber-400">
                                        <Award className="mb-1 h-3.5 w-3.5 text-amber-500" />
                                        <span className="font-['Oxanium'] text-[9px] font-semibold text-slate-400">
                                            GOLD
                                        </span>
                                        <span className="text-[11px] font-black">
                                            +{quest.rewards?.gold ?? 150}
                                        </span>
                                    </div>
                                    <div className="flex flex-col items-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 py-2.5 text-indigo-600 transition-transform hover:scale-[1.03] dark:text-indigo-300">
                                        <Award className="mb-1 h-3.5 w-3.5 text-indigo-500" />
                                        <span className="font-['Oxanium'] text-[9px] font-semibold text-slate-400">
                                            ERP
                                        </span>
                                        <span className="text-[11px] font-black">
                                            +{quest.rewards?.erp ?? 100}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat Panel Overlay */}
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

                    <div className="relative z-10 flex max-h-[85vh] w-full max-w-4xl flex-col items-center overflow-hidden rounded-2xl border border-white/10 bg-slate-900/90 p-4 font-['Oxanium'] shadow-2xl dark:bg-slate-950/95">
                        <div className="mb-3 flex w-full items-center justify-between border-b border-white/10 pb-2">
                            <span className="max-w-xs truncate text-sm font-bold text-white sm:max-w-md">
                                {previewImage.name}
                            </span>
                            <button
                                onClick={() => setPreviewImage(null)}
                                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="flex min-h-0 w-full flex-1 items-center justify-center">
                            <img
                                src={previewImage.url}
                                alt={previewImage.name}
                                className="max-h-[70vh] max-w-full rounded-lg object-contain shadow-md"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
