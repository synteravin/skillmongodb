import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import {
    Briefcase,
    MessageSquare,
    Send,
    Link as LinkIcon,
    FileText,
    XCircle,
    Clock,
    Upload,
    X,
} from 'lucide-react';
import { Quest, Bid } from '@/types/quest';

interface Props {
    quest: Quest;
    myBid: Bid | null;
    can: {
        bid: boolean;
    };
    setSelectedChatBid: (bid: { id: string; name: string } | null) => void;
}

export default function WorkerBidPanel({
    quest,
    myBid,
    can,
    setSelectedChatBid,
}: Props) {
    const [cvMode, setCvMode] = useState<'url' | 'file'>('url');
    const [portfolioMode, setPortfolioMode] = useState<'url' | 'file'>('url');

    const { data, setData, post, processing, errors, reset } = useForm<{
        bid_amount: string;
        cv: string;
        cv_file: File | null;
        portfolio: string;
        portfolio_file: File | null;
        proposal: string;
    }>({
        bid_amount: '',
        cv: '',
        cv_file: null,
        portfolio: '',
        portfolio_file: null,
        proposal: '',
    });

    const handleBidSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/student/quests/${quest._id}/bid`, {
            onSuccess: () => reset(),
        });
    };

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    const minBudget = quest.min_budget ?? quest.min_salary ?? 0;
    const maxBudget = quest.max_budget ?? quest.max_salary ?? 0;

    return (
        <div className="relative overflow-hidden space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]">
            <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700 pointer-events-none select-none z-0" />
            <div className="relative z-10 flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                <h3 className="flex items-center gap-2 text-sm font-bold tracking-wider text-slate-800 uppercase dark:text-slate-100">
                    <Send className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    Proposal Penawaran Proyek
                </h3>
            </div>

            {/* Case A: Already Bid */}
            {myBid ? (
                <div className="space-y-4">
                    <div
                        className={`flex items-start gap-3 rounded-xl border p-4 ${
                            myBid.status === 'rejected'
                                ? 'border-red-200 bg-red-50/50 text-red-800 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-300'
                                : 'border-amber-200 bg-amber-50/50 text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-300'
                        }`}
                    >
                        {myBid.status === 'rejected' ? (
                            <XCircle size={18} className="mt-0.5 shrink-0 text-red-600 dark:text-red-400" />
                        ) : (
                            <Clock size={18} className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
                        )}
                        <div className="text-left">
                            <span
                                className={`block text-xs font-bold uppercase tracking-wide ${
                                    myBid.status === 'rejected'
                                        ? 'text-red-700 dark:text-red-300'
                                        : 'text-amber-800 dark:text-amber-300'
                                }`}
                            >
                                {myBid.status === 'rejected'
                                    ? 'Penawaran Belum Terpilih'
                                    : 'Penawaran Sedang Ditinjau'}
                            </span>
                            <p className="mt-0.5 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                                {myBid.status === 'rejected'
                                    ? 'Maaf, proposal penawaran Anda belum terpilih untuk proyek ini.'
                                    : 'Proposal penawaran Anda telah terkirim dan sedang ditinjau oleh pemilik proyek.'}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3.5 rounded-xl border border-slate-200 bg-slate-50/80 p-4 text-xs dark:border-slate-800 dark:bg-[#040812]">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <strong className="block text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                    Harga Penawaran
                                </strong>
                                <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                                    Rp {myBid.bid_amount.toLocaleString('id-ID')}
                                </span>
                            </div>
                            <div>
                                <strong className="block text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                    Tanggal Pengajuan
                                </strong>
                                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    {formatDate(myBid.created_at)}
                                </span>
                            </div>
                        </div>

                        <div className="border-t border-slate-200/80 pt-2 dark:border-slate-800">
                            <strong className="block text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                Proposal Penawaran
                            </strong>
                            <p className="mt-1 leading-relaxed whitespace-pre-wrap text-slate-700 dark:text-slate-300">
                                {myBid.proposal}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-2 border-t border-slate-200/80 pt-2 dark:border-slate-800">
                            {myBid.cv && (
                                <a
                                    href={myBid.cv.startsWith('http') ? myBid.cv : '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white py-2 text-center text-[11px] font-bold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-indigo-400 dark:hover:bg-slate-800"
                                >
                                    <FileText size={13} />
                                    Tautan CV
                                </a>
                            )}
                            {myBid.portfolio && (
                                <a
                                    href={
                                        myBid.portfolio.startsWith('http')
                                            ? myBid.portfolio
                                            : '#'
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white py-2 text-center text-[11px] font-bold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-indigo-400 dark:hover:bg-slate-800"
                                >
                                    <LinkIcon size={13} />
                                    Portofolio
                                </a>
                            )}
                        </div>
                    </div>

                    {myBid.status !== 'rejected' && (
                        <button
                            type="button"
                            onClick={() =>
                                setSelectedChatBid({
                                    id: myBid._id,
                                    name: quest.creator.name,
                                })
                            }
                            className="flex w-full items-center justify-center gap-2 cursor-pointer rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all hover:from-indigo-500 hover:to-indigo-600 dark:from-indigo-600 dark:to-indigo-500"
                        >
                            <MessageSquare size={15} />
                            Hubungi Klien
                        </button>
                    )}
                </div>
            ) : quest.status === 'open' && can.bid ? (
                /* Case B: Place Bid Form */
                <form onSubmit={handleBidSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="block text-xs font-semibold tracking-wider text-slate-700 uppercase dark:text-slate-300">
                            Harga Penawaran (IDR) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <span className="absolute top-2.5 left-3.5 text-xs font-bold text-slate-500 dark:text-slate-400">
                                Rp
                            </span>
                            <input
                                type="number"
                                required
                                placeholder={`Rentang anggaran: Rp ${minBudget.toLocaleString('id-ID')} - Rp ${maxBudget.toLocaleString('id-ID')}`}
                                value={data.bid_amount}
                                onChange={(e) => setData('bid_amount', e.target.value)}
                                className="w-full rounded-lg border border-slate-300 bg-slate-50 py-2.5 pr-3.5 pl-10 text-xs font-bold text-slate-900 placeholder:font-normal placeholder:text-slate-400 transition-colors focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600 dark:border-slate-700 dark:bg-[#030712] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-500"
                            />
                        </div>
                        {errors.bid_amount && (
                            <p className="text-xs font-semibold text-red-500">
                                {errors.bid_amount}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-xs font-semibold tracking-wider text-slate-700 uppercase dark:text-slate-300">
                            Proposal / Penjelasan Kemampuan Pekerjaan{' '}
                            <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            required
                            placeholder="Jelaskan mengapa Anda kandidat terbaik dan bagaimana Anda berencana menyelesaikan proyek ini secara profesional..."
                            rows={8}
                            value={data.proposal}
                            onChange={(e) => setData('proposal', e.target.value)}
                            className="w-full min-h-[180px] rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-xs leading-relaxed text-slate-900 placeholder:text-slate-400 transition-colors focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600 dark:border-slate-700 dark:bg-[#030712] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-500"
                        />
                        {errors.proposal && (
                            <p className="text-xs font-semibold text-red-500">
                                {errors.proposal}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {/* FIELD 1: BERKAS / LINK CV */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="block text-xs font-semibold tracking-wider text-slate-700 uppercase dark:text-slate-300">
                                    Berkas / Tautan CV <span className="text-red-500">*</span>
                                </label>
                                <div className="flex items-center rounded-lg bg-slate-100 p-0.5 dark:bg-slate-800">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setCvMode('url');
                                            setData('cv_file', null);
                                        }}
                                        className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold transition-all ${
                                            cvMode === 'url'
                                                ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-900 dark:text-indigo-400'
                                                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                                        }`}
                                    >
                                        <LinkIcon size={10} />
                                        URL
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setCvMode('file');
                                            setData('cv', '');
                                        }}
                                        className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold transition-all ${
                                            cvMode === 'file'
                                                ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-900 dark:text-indigo-400'
                                                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                                        }`}
                                    >
                                        <Upload size={10} />
                                        Dokumen
                                    </button>
                                </div>
                            </div>

                            {cvMode === 'url' ? (
                                <input
                                    type="url"
                                    required={!data.cv_file}
                                    placeholder="https://drive.google.com/... (Tautan CV Publik)"
                                    value={data.cv}
                                    onChange={(e) => setData('cv', e.target.value)}
                                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 transition-colors focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600 dark:border-slate-700 dark:bg-[#030712] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-500"
                                />
                            ) : (
                                <div>
                                    {data.cv_file ? (
                                        <div className="flex items-center justify-between rounded-lg border border-indigo-200 bg-indigo-50/60 p-2 text-xs dark:border-indigo-900/60 dark:bg-indigo-950/40">
                                            <div className="flex min-w-0 items-center gap-2">
                                                <FileText size={16} className="shrink-0 text-indigo-600 dark:text-indigo-400" />
                                                <div className="min-w-0">
                                                    <span className="block truncate text-xs font-semibold text-slate-800 dark:text-slate-200">
                                                        {data.cv_file.name}
                                                    </span>
                                                    <span className="block text-[10px] text-slate-400">
                                                        {formatFileSize(data.cv_file.size)}
                                                    </span>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setData('cv_file', null)}
                                                className="rounded p-1 text-slate-400 hover:bg-white hover:text-red-500 dark:hover:bg-slate-800"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50/80 p-3 text-center transition-colors hover:border-indigo-500 hover:bg-slate-100 dark:border-slate-700 dark:bg-[#030712]/60 dark:hover:border-indigo-500 dark:hover:bg-slate-900/60">
                                            <Upload className="mb-1 h-5 w-5 text-indigo-500 dark:text-indigo-400" />
                                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                Pilih Berkas CV
                                            </span>
                                            <span className="text-[10px] text-slate-400">
                                                Format: PDF, DOC, DOCX, JPG, PNG (Maks 5MB)
                                            </span>
                                            <input
                                                type="file"
                                                required={!data.cv}
                                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                                className="hidden"
                                                onChange={(e) => {
                                                    if (e.target.files && e.target.files[0]) {
                                                        setData('cv_file', e.target.files[0]);
                                                    }
                                                }}
                                            />
                                        </label>
                                    )}
                                </div>
                            )}
                            {errors.cv && (
                                <p className="text-xs font-semibold text-red-500">
                                    {errors.cv}
                                </p>
                            )}
                            {errors.cv_file && (
                                <p className="text-xs font-semibold text-red-500">
                                    {errors.cv_file}
                                </p>
                            )}
                        </div>

                        {/* FIELD 2: BERKAS / LINK PORTOFOLIO */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="block text-xs font-semibold tracking-wider text-slate-700 uppercase dark:text-slate-300">
                                    Berkas / Tautan Portofolio <span className="text-red-500">*</span>
                                </label>
                                <div className="flex items-center rounded-lg bg-slate-100 p-0.5 dark:bg-slate-800">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setPortfolioMode('url');
                                            setData('portfolio_file', null);
                                        }}
                                        className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold transition-all ${
                                            portfolioMode === 'url'
                                                ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-900 dark:text-indigo-400'
                                                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                                        }`}
                                    >
                                        <LinkIcon size={10} />
                                        URL
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setPortfolioMode('file');
                                            setData('portfolio', '');
                                        }}
                                        className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold transition-all ${
                                            portfolioMode === 'file'
                                                ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-900 dark:text-indigo-400'
                                                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                                        }`}
                                    >
                                        <Upload size={10} />
                                        Dokumen
                                    </button>
                                </div>
                            </div>

                            {portfolioMode === 'url' ? (
                                <input
                                    type="url"
                                    required={!data.portfolio_file}
                                    placeholder="https://github.com/... atau behance.net/..."
                                    value={data.portfolio}
                                    onChange={(e) => setData('portfolio', e.target.value)}
                                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 transition-colors focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600 dark:border-slate-700 dark:bg-[#030712] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-500"
                                />
                            ) : (
                                <div>
                                    {data.portfolio_file ? (
                                        <div className="flex items-center justify-between rounded-lg border border-purple-200 bg-purple-50/60 p-2 text-xs dark:border-purple-900/60 dark:bg-purple-950/40">
                                            <div className="flex min-w-0 items-center gap-2">
                                                <FileText size={16} className="shrink-0 text-purple-600 dark:text-purple-400" />
                                                <div className="min-w-0">
                                                    <span className="block truncate text-xs font-semibold text-slate-800 dark:text-slate-200">
                                                        {data.portfolio_file.name}
                                                    </span>
                                                    <span className="block text-[10px] text-slate-400">
                                                        {formatFileSize(data.portfolio_file.size)}
                                                    </span>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setData('portfolio_file', null)}
                                                className="rounded p-1 text-slate-400 hover:bg-white hover:text-red-500 dark:hover:bg-slate-800"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50/80 p-3 text-center transition-colors hover:border-purple-500 hover:bg-slate-100 dark:border-slate-700 dark:bg-[#030712]/60 dark:hover:border-purple-500 dark:hover:bg-slate-900/60">
                                            <Upload className="mb-1 h-5 w-5 text-purple-500 dark:text-purple-400" />
                                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                Pilih Berkas Portofolio
                                            </span>
                                            <span className="text-[10px] text-slate-400">
                                                Format: PDF, DOC, ZIP, RAR, PNG (Maks 10MB)
                                            </span>
                                            <input
                                                type="file"
                                                required={!data.portfolio}
                                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.zip,.rar"
                                                className="hidden"
                                                onChange={(e) => {
                                                    if (e.target.files && e.target.files[0]) {
                                                        setData('portfolio_file', e.target.files[0]);
                                                    }
                                                }}
                                            />
                                        </label>
                                    )}
                                </div>
                            )}
                            {errors.portfolio && (
                                <p className="text-xs font-semibold text-red-500">
                                    {errors.portfolio}
                                </p>
                            )}
                            {errors.portfolio_file && (
                                <p className="text-xs font-semibold text-red-500">
                                    {errors.portfolio_file}
                                </p>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="flex w-full items-center justify-center gap-2 cursor-pointer rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 py-3 text-xs font-bold tracking-wider text-white uppercase shadow-md shadow-indigo-500/20 transition-all hover:from-indigo-500 hover:to-indigo-600 disabled:opacity-50 dark:from-indigo-600 dark:to-indigo-500"
                    >
                        <Send className="h-4 w-4" />
                        {processing ? 'Mengirim Proposal...' : 'Kirim Proposal Proyek'}
                    </button>
                </form>
            ) : (
                /* Case C: Bidding Closed */
                <div className="py-8 text-center text-slate-400 dark:text-slate-500">
                    <Briefcase className="mx-auto mb-2 h-9 w-9 text-slate-300 dark:text-slate-700" />
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                        Penerimaan Proposal Ditutup
                    </p>
                    <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                        Proyek ini sudah terisi atau sudah melewati masa bidding aktif.
                    </p>
                </div>
            )}
        </div>
    );
}
