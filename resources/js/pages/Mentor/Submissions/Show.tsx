import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';
import {
    ArrowLeft, FileText, Calendar, CheckCircle2, Clock, Users, ChevronRight, Search, Inbox, ChevronDown
} from 'lucide-react';
import { useState, useMemo } from 'react';

type Submission = {
    id: string;
    group_id?: string;
    title: string;
    description: string;
    deadline: string;
    status: 'draft' | 'published';
};

type StudentSubmission = {
    id: string;
    student_name: string;
    status: 'submitted' | 'late' | 'graded';
    submitted_at: string;
};

interface Props {
    submission: Submission;
    studentSubmissions: StudentSubmission[];
}

export default function SubmissionShow({ submission, studentSubmissions }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'graded'>('all');
    const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);

    const statusBadge = {
        submitted: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-450 border border-amber-200 dark:border-amber-500/20',
        late: 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-450 border border-rose-200 dark:border-rose-500/20',
        graded: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-450 border border-emerald-200 dark:border-emerald-500/20',
    };

    // Statistik Perhitungan
    const totalCount = studentSubmissions.length;
    const gradedCount = useMemo(() => studentSubmissions.filter(s => s.status === 'graded').length, [studentSubmissions]);
    const pendingCount = totalCount - gradedCount;
    const completionRate = totalCount > 0 ? Math.round((gradedCount / totalCount) * 100) : 0;

    // Filter & Search Logic
    const filteredSubmissions = useMemo(() => {
        return studentSubmissions.filter(item => {
            // Filter by Search Term
            const matchesSearch = item.student_name.toLowerCase().includes(searchTerm.toLowerCase());
            
            // Filter by Status Tab
            let matchesTab = true;
            if (activeTab === 'pending') {
                matchesTab = item.status === 'submitted' || item.status === 'late';
            } else if (activeTab === 'graded') {
                matchesTab = item.status === 'graded';
            }

            return matchesSearch && matchesTab;
        });
    }, [studentSubmissions, searchTerm, activeTab]);

    return (
        <AppLayout>
            <div className="w-full mx-auto space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl" style={{ fontFamily: "'Outfit', sans-serif" }}>
                
                {/* Page Header */}
                <div className="flex items-center gap-4">
                    <Link
                        href={`/mentor/career-groups/${submission.group_id}/submissions`}
                        className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all shadow-xs"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                            {submission.title}
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Submission Dashboard &bull; Monitor and evaluate student work
                        </p>
                    </div>
                </div>

                {/* Collapsible Assignment Details Card */}
                <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/75 shadow-sm shadow-slate-100/50 dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#0e0e1a]/85 dark:to-[#090910]/40 backdrop-blur-xs">
                    <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-slate-800" />
                    
                    <button
                        type="button"
                        onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
                        className="w-full flex items-center justify-between p-5 text-left font-bold text-slate-900 dark:text-white hover:bg-slate-50/50 dark:hover:bg-slate-900/35 transition-colors cursor-pointer"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-extrabold uppercase tracking-wider text-slate-550 dark:text-slate-400">
                                Assignment Instructions
                            </span>
                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                submission.status === 'published'
                                    ? 'bg-emerald-100/50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-450 border border-emerald-200/50 dark:border-emerald-500/20'
                                    : 'bg-amber-100/50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-450 border border-amber-200/50 dark:border-amber-500/20'
                            }`}>
                                {submission.status}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400 dark:text-slate-550">
                            <span className="text-xs font-semibold">
                                {isDetailsExpanded ? 'Hide Details' : 'Show Details'}
                            </span>
                            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isDetailsExpanded ? 'rotate-180' : ''}`} />
                        </div>
                    </button>

                    {isDetailsExpanded && (
                        <div className="px-5 pb-5 pt-1 border-t border-slate-100 dark:border-slate-800/40 space-y-4">
                            <p className="text-sm text-slate-600 dark:text-slate-355 leading-relaxed whitespace-pre-line">
                                {submission.description}
                            </p>

                            <div className="flex flex-wrap gap-4 pt-1">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 shadow-xs">
                                    <Calendar className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                                    <span className="text-[11px] font-semibold text-slate-505 dark:text-slate-400">Deadline:</span>
                                    <span className="text-[11px] font-bold text-slate-800 dark:text-white">
                                        {submission.deadline ? new Date(submission.deadline).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Not Set'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Overview Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {/* Card: Total Submissions */}
                    <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/75 p-5 shadow-sm shadow-slate-100/50 dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#0e0e1a]/85 dark:to-[#090910]/40 backdrop-blur-xs">
                        <div className="absolute top-0 right-4 left-4 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-slate-800" />
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">Total Submissions</span>
                                <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{totalCount}</span>
                            </div>
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 shrink-0">
                                <Users className="w-5 h-5" />
                            </div>
                        </div>
                    </div>

                    {/* Card: Graded Submissions */}
                    <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/75 p-5 shadow-sm shadow-slate-100/50 dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#0e0e1a]/85 dark:to-[#090910]/40 backdrop-blur-xs">
                        <div className="absolute top-0 right-4 left-4 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-slate-800" />
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">Graded Submissions</span>
                                <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{gradedCount}</span>
                            </div>
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 shrink-0">
                                <CheckCircle2 className="w-5 h-5" />
                            </div>
                        </div>
                    </div>

                    {/* Card: Completion Rate */}
                    <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/75 p-5 shadow-sm shadow-slate-100/50 dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#0e0e1a]/85 dark:to-[#090910]/40 backdrop-blur-xs">
                        <div className="absolute top-0 right-4 left-4 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-slate-800" />
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Completion Rate</span>
                                <span className="text-xs font-black text-slate-900 dark:text-white">{completionRate}%</span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500" 
                                    style={{ width: `${completionRate}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Panel Tabel Tugas Siswa */}
                <div className="rounded-2xl border border-slate-200/80 bg-white/75 shadow-sm shadow-slate-100/50 dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910] overflow-hidden backdrop-blur-xs">
                    
                    {/* Header Kontrol: Tab Filter & Cari */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-6 py-5 border-b border-slate-100 dark:border-slate-800/60">
                        
                        {/* Tab Filter */}
                        <div className="flex gap-1 border-b md:border-b-0 pb-2 md:pb-0 border-slate-100 dark:border-slate-800/50">
                            {[
                                { key: 'all', label: 'All', count: totalCount },
                                { key: 'pending', label: 'Pending Review', count: pendingCount },
                                { key: 'graded', label: 'Graded', count: gradedCount }
                            ].map((tab) => (
                                <button
                                    key={tab.key}
                                    type="button"
                                    onClick={() => setActiveTab(tab.key as any)}
                                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                                        activeTab === tab.key
                                            ? 'bg-indigo-600 text-white shadow-xs'
                                            : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900/60'
                                    }`}
                                >
                                    {tab.label}
                                    <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-black ${
                                        activeTab === tab.key
                                            ? 'bg-white/20 text-white'
                                            : 'bg-slate-200 text-slate-600 dark:bg-slate-900 dark:text-slate-450'
                                    }`}>
                                        {tab.count}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Search Input */}
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search student name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full md:w-64 pl-9 pr-4 py-2 bg-slate-100/40 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-900 dark:text-white placeholder-slate-400 transition-all shadow-inner"
                            />
                        </div>
                    </div>

                    {/* Responsive Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left">
                            <thead className="bg-slate-50/55 dark:bg-slate-900/40 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800/85">
                                <tr>
                                    <th className="px-6 py-4 whitespace-nowrap">Student</th>
                                    <th className="px-6 py-4 whitespace-nowrap">Evaluation Status</th>
                                    <th className="px-6 py-4 whitespace-nowrap">Submitted At</th>
                                    <th className="px-6 py-4 text-right whitespace-nowrap">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                {filteredSubmissions.length > 0 ? (
                                    filteredSubmissions.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-slate-100/40 dark:hover:bg-slate-900/20 transition-colors group"
                                        >
                                            {/* Student Profil */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-extrabold text-[11px] shrink-0 shadow-xs">
                                                        {item.student_name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="font-bold text-slate-900 dark:text-white whitespace-nowrap">
                                                        {item.student_name}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Status Badge */}
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold ${statusBadge[item.status]}`}>
                                                    <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
                                                    <span className="capitalize">{item.status}</span>
                                                </span>
                                            </td>

                                            {/* Tanggal Submitted */}
                                            <td className="px-6 py-4 text-slate-500 dark:text-slate-400 whitespace-nowrap font-medium">
                                                {item.submitted_at 
                                                    ? new Date(item.submitted_at).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) 
                                                    : '—'}
                                            </td>

                                            {/* Tombol Review */}
                                            <td className="px-6 py-4 text-right">
                                                <Link
                                                    href={`/mentor/student-submissions/${item.id}`}
                                                    className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-900/60 hover:shadow-xs font-bold transition-all whitespace-nowrap"
                                                >
                                                    Evaluate
                                                    <ChevronRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-16 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="p-4 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 w-fit">
                                                    <Inbox className="w-8 h-8 text-slate-350 dark:text-slate-600" />
                                                </div>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                                                    {searchTerm ? 'No students match your search criteria.' : 'No student submissions found in this category.'}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}