import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';
import {
    ArrowLeft,
    User as UserIcon,
    Mail,
    Shield,
    ShieldCheck,
    Trophy,
    Target,
    BookOpen,
    Clock,
    Activity,
    Briefcase,
    FileText,
    CheckCircle,
    XCircle,
    Eye,
    X,
    MessageSquare,
    Link as LinkIcon,
    Download,
} from 'lucide-react';
import { useState } from 'react';

export default function Show({ user, details }: { user: any; details: any }) {
    const [selectedDetail, setSelectedDetail] = useState<{
        type: 'quiz' | 'submission' | 'mentor_submission';
        data: any;
    } | null>(null);

    const StudentDetails = () => (
        <div className="space-y-6">
            {/* Gamification Stats */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
                    <Trophy className="text-yellow-500" size={20} />
                    Gamification Status
                </h3>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4">
                        <p className="mb-1 text-xs text-slate-400">Level</p>
                        <p className="text-2xl font-bold text-white">
                            {details.gamification.level}
                        </p>
                    </div>
                    <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4">
                        <p className="mb-1 text-xs text-slate-400">EXP</p>
                        <p className="text-2xl font-bold text-indigo-400">
                            {details.gamification.exp}
                        </p>
                    </div>
                    <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4">
                        <p className="mb-1 text-xs text-slate-400">
                            Total Gold
                        </p>
                        <p className="text-2xl font-bold text-yellow-400">
                            {details.gamification.gold}
                        </p>
                    </div>
                    {details.gamification.rank ? (
                        <div className="flex flex-col items-center justify-center rounded-xl border border-slate-700/50 bg-slate-800/50 p-4">
                            {details.gamification.rank.image ? (
                                <img
                                    src={details.gamification.rank.image}
                                    alt={details.gamification.rank.name}
                                    className="mb-1 h-8 w-8 object-contain"
                                />
                            ) : (
                                <Trophy
                                    className="mb-1 text-yellow-500"
                                    size={24}
                                />
                            )}
                            <p className="text-xs font-bold text-white uppercase">
                                {details.gamification.rank.name}
                            </p>
                            <div className="mt-1 flex gap-1">
                                {[...Array(3)].map((_, i) => (
                                    <span
                                        key={i}
                                        className={`h-2 w-2 rounded-full ${i < details.gamification.rank.star ? 'bg-yellow-400' : 'bg-slate-700'}`}
                                    ></span>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4">
                            <p className="mb-1 text-xs text-slate-400">Rank</p>
                            <p className="text-lg font-bold text-slate-500">
                                Unranked
                            </p>
                        </div>
                    )}
                    <div className="relative col-span-2 flex flex-col items-center gap-4 overflow-hidden rounded-xl border border-slate-700/50 bg-slate-800/50 p-4 sm:flex-row md:col-span-full lg:col-span-2">
                        {/* Glow effect for background */}
                        <div className="pointer-events-none absolute -top-8 -right-8 h-32 w-32 rounded-full bg-indigo-500/10 blur-2xl"></div>

                        <div className="z-10 flex-shrink-0">
                            {details.gamification.character_avatar ? (
                                <div className="flex h-16 w-auto items-center justify-center rounded-lg border border-slate-700/50 bg-slate-900/40 p-1 shadow-inner">
                                    <img
                                        src={
                                            details.gamification
                                                .character_avatar
                                        }
                                        alt={details.gamification.character}
                                        className="h-full w-auto object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]"
                                    />
                                </div>
                            ) : (
                                <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-slate-700 bg-slate-900/80">
                                    <UserIcon
                                        size={24}
                                        className="text-slate-500"
                                    />
                                </div>
                            )}
                        </div>
                        <div className="z-10">
                            <p className="mb-1 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                                Active Character
                            </p>
                            <p className="truncate bg-gradient-to-r from-indigo-300 to-purple-400 bg-clip-text text-lg font-black text-transparent">
                                {details.gamification.character}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Additional Stats Details */}
                {Object.keys(details.gamification.exp_breakdown || {}).length >
                    0 && (
                    <div className="mt-6 border-t border-slate-800 pt-6">
                        <p className="mb-4 text-xs font-bold tracking-widest text-slate-500 uppercase">
                            EXP Distribution Breakdown
                        </p>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                            {Object.entries(
                                details.gamification.exp_breakdown,
                            ).map(
                                ([pathName, expValue]: [string, any], idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center justify-between rounded-xl border border-slate-700/50 bg-slate-800/30 px-4 py-3 transition-colors hover:bg-slate-800/50"
                                    >
                                        <span
                                            className="truncate pr-3 text-sm text-slate-300"
                                            title={pathName}
                                        >
                                            {pathName}
                                        </span>
                                        <span className="text-sm font-black text-indigo-400">
                                            +{expValue}
                                        </span>
                                    </div>
                                ),
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Active Course */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
                    <Target className="text-emerald-500" size={20} />
                    Active Learning Path
                </h3>
                {details.active_course ? (
                    <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-slate-700/50 bg-slate-800/50 p-4 md:flex-row md:items-center">
                        <div className="flex items-center gap-4">
                            {details.active_course.thumbnail_url ? (
                                <img
                                    src={details.active_course.thumbnail_url}
                                    alt="Course Thumbnail"
                                    className="h-16 w-16 rounded-lg border border-slate-700 object-cover shadow-md"
                                />
                            ) : (
                                <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-slate-700 bg-slate-900">
                                    <BookOpen
                                        size={24}
                                        className="text-slate-500"
                                    />
                                </div>
                            )}
                            <div>
                                <h4 className="text-lg font-bold text-white">
                                    {details.active_course.course_name}
                                </h4>
                                <p className="mt-1 text-sm text-slate-400">
                                    {details.active_course.career_group}
                                </p>
                            </div>
                        </div>
                        <div className="mt-3 text-right md:mt-0">
                            <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold tracking-wider text-emerald-400 uppercase">
                                {details.active_course.status}
                            </span>
                            <p className="mt-2 text-xs text-slate-500">
                                Enrolled:{' '}
                                {new Date(
                                    details.active_course.enrolled_at,
                                ).toLocaleDateString('en-US', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                })}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="rounded-xl border border-dashed border-slate-800 bg-slate-800/30 py-6 text-center">
                        <p className="text-sm text-slate-400">
                            No active course.
                        </p>
                    </div>
                )}
            </div>

            {/* Course History */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
                    <BookOpen className="text-blue-500" size={20} />
                    All Course History
                </h3>
                {details.course_history?.length > 0 ? (
                    <div className="custom-scrollbar max-h-96 space-y-3 overflow-y-auto pr-2">
                        {details.course_history.map(
                            (course: any, idx: number) => (
                                <div
                                    key={idx}
                                    className="flex items-center justify-between gap-4 rounded-xl border border-slate-700/50 bg-slate-800/50 p-3"
                                >
                                    <div className="flex items-center gap-3">
                                        {course.thumbnail_url ? (
                                            <img
                                                src={course.thumbnail_url}
                                                alt="Thumbnail"
                                                className="h-10 w-10 rounded-md border border-slate-700 object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-700 bg-slate-900">
                                                <BookOpen
                                                    size={16}
                                                    className="text-slate-500"
                                                />
                                            </div>
                                        )}
                                        <div>
                                            <h4 className="text-sm font-medium text-white">
                                                {course.course_name}
                                            </h4>
                                            <p className="text-xs text-slate-500">
                                                {course.career_group}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs text-slate-400 capitalize">
                                            {course.status}
                                        </span>
                                    </div>
                                </div>
                            ),
                        )}
                    </div>
                ) : (
                    <div className="rounded-xl border border-dashed border-slate-800 bg-slate-800/30 py-6 text-center">
                        <p className="text-sm text-slate-400">
                            No course history available.
                        </p>
                    </div>
                )}
            </div>

            {/* Recent Submissions & Quizzes */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
                    <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
                        <FileText className="text-indigo-500" size={20} />
                        All Submissions
                    </h3>
                    {details.recent_submissions?.length > 0 ? (
                        <div className="custom-scrollbar max-h-96 space-y-3 overflow-y-auto pr-2">
                            {details.recent_submissions.map(
                                (sub: any, idx: number) => (
                                    <div
                                        key={idx}
                                        className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-3"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <h4 className="text-sm font-medium text-white">
                                                    {sub.title}
                                                </h4>
                                                <p className="mt-0.5 text-[10px] text-slate-400">
                                                    {sub.career_group}
                                                </p>
                                                <p className="mt-2 text-xs text-slate-500">
                                                    Submitted:{' '}
                                                    {new Date(
                                                        sub.submitted_at,
                                                    ).toLocaleDateString(
                                                        'en-US',
                                                    )}
                                                </p>
                                            </div>
                                            <div className="flex flex-col items-end gap-2 text-right">
                                                <span
                                                    className={`rounded border px-2 py-1 text-[10px] font-bold uppercase ${sub.status === 'graded' || sub.status === 'approved' ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400' : 'border-amber-500/20 bg-amber-500/10 text-amber-400'}`}
                                                >
                                                    {sub.status}
                                                </span>
                                                {sub.grade && (
                                                    <p className="text-sm font-bold text-white">
                                                        Score: {sub.grade}
                                                    </p>
                                                )}
                                                <button
                                                    onClick={() =>
                                                        setSelectedDetail({
                                                            type: 'submission',
                                                            data: sub,
                                                        })
                                                    }
                                                    className="mt-1 flex items-center gap-1.5 rounded-md bg-indigo-500/10 px-2 py-1 text-xs text-indigo-400 transition-colors hover:text-indigo-300"
                                                >
                                                    <Eye size={12} /> View
                                                    Details
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ),
                            )}
                        </div>
                    ) : (
                        <div className="rounded-xl border border-dashed border-slate-800 bg-slate-800/30 py-6 text-center">
                            <p className="text-sm text-slate-400">
                                No submissions found.
                            </p>
                        </div>
                    )}
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
                    <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
                        <CheckCircle className="text-emerald-500" size={20} />
                        All Quiz Results
                    </h3>
                    {details.recent_quizzes?.length > 0 ? (
                        <div className="custom-scrollbar max-h-96 space-y-3 overflow-y-auto pr-2">
                            {details.recent_quizzes.map(
                                (quiz: any, idx: number) => (
                                    <div
                                        key={idx}
                                        className="flex items-center justify-between rounded-xl border border-slate-700/50 bg-slate-800/50 p-3"
                                    >
                                        <div className="flex items-center gap-3">
                                            {quiz.passed ? (
                                                <CheckCircle
                                                    className="text-emerald-500"
                                                    size={16}
                                                />
                                            ) : (
                                                <XCircle
                                                    className="text-rose-500"
                                                    size={16}
                                                />
                                            )}
                                            <div>
                                                <h4 className="text-sm font-medium text-white">
                                                    Quiz: {quiz.path_name}
                                                </h4>
                                                <p className="mt-1 text-xs text-slate-500">
                                                    {new Date(
                                                        quiz.completed_at,
                                                    ).toLocaleDateString(
                                                        'en-US',
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2 text-right">
                                            <span
                                                className={`text-sm font-bold ${quiz.passed ? 'text-emerald-400' : 'text-rose-400'}`}
                                            >
                                                {quiz.score} / 100
                                            </span>
                                            <button
                                                onClick={() =>
                                                    setSelectedDetail({
                                                        type: 'quiz',
                                                        data: quiz,
                                                    })
                                                }
                                                className="flex items-center gap-1.5 rounded-md bg-emerald-500/10 px-2 py-1 text-xs text-emerald-400 transition-colors hover:text-emerald-300"
                                            >
                                                <Eye size={12} /> See Answers
                                            </button>
                                        </div>
                                    </div>
                                ),
                            )}
                        </div>
                    ) : (
                        <div className="rounded-xl border border-dashed border-slate-800 bg-slate-800/30 py-6 text-center">
                            <p className="text-sm text-slate-400">
                                No quiz attempts found.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    const MentorDetails = () => (
        <div className="space-y-6">
            {/* Mentor Workload & Stats */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
                    <Activity className="text-rose-500" size={20} />
                    Mentor Workload & Statistics
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-5">
                        <p className="mb-1 text-sm text-slate-400">
                            Total Mentored
                        </p>
                        <p className="text-3xl font-bold text-white">
                            {details.stats.total_students}
                        </p>
                    </div>
                    <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-5">
                        <p className="mb-1 text-sm text-slate-400">
                            Active Students
                        </p>
                        <p className="text-3xl font-bold text-indigo-400">
                            {details.stats.active_students}
                        </p>
                    </div>
                    <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-5">
                        <p className="mb-1 text-sm text-slate-400">
                            Graduated Students
                        </p>
                        <p className="text-3xl font-bold text-emerald-400">
                            {details.stats.graduated_students}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Pending Submissions Queue */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="flex items-center gap-2 text-lg font-bold text-white">
                            <Clock className="text-amber-500" size={20} />
                            Submission Queue
                        </h3>
                        <span className="rounded border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-xs font-bold text-amber-400">
                            {details.stats.pending_submissions_count} Pending
                        </span>
                    </div>
                    {details.recent_pending_submissions?.length > 0 ? (
                        <div className="custom-scrollbar max-h-96 space-y-3 overflow-y-auto pr-2">
                            {details.recent_pending_submissions.map(
                                (sub: any, idx: number) => (
                                    <div
                                        key={idx}
                                        className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-3"
                                    >
                                        <div className="mb-2 flex items-start justify-between">
                                            <div>
                                                <h4 className="text-sm font-medium text-white">
                                                    {sub.task_title}
                                                </h4>
                                                <p className="mt-0.5 text-[10px] text-slate-400">
                                                    {sub.career_group}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() =>
                                                    setSelectedDetail({
                                                        type: 'mentor_submission',
                                                        data: sub,
                                                    })
                                                }
                                                className="flex items-center gap-1 rounded border border-amber-500/20 bg-amber-500/10 px-2 py-1 text-xs text-amber-400 transition-colors hover:text-amber-300"
                                            >
                                                <Eye size={12} /> Detail
                                            </button>
                                        </div>
                                        <div className="mt-2 flex items-center justify-between border-t border-slate-700/50 pt-2">
                                            <p className="flex items-center gap-1 text-xs text-slate-400">
                                                <UserIcon size={12} />{' '}
                                                {sub.student_name}
                                            </p>
                                            <p className="text-[10px] text-slate-500">
                                                {new Date(
                                                    sub.submitted_at,
                                                ).toLocaleDateString('en-US')}
                                            </p>
                                        </div>
                                    </div>
                                ),
                            )}
                        </div>
                    ) : (
                        <div className="rounded-xl border border-dashed border-slate-800 bg-slate-800/30 py-6 text-center">
                            <p className="text-sm text-slate-400">
                                No pending submissions.
                            </p>
                        </div>
                    )}
                </div>

                {/* Assigned Career Groups */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
                    <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
                        <Briefcase className="text-indigo-500" size={20} />
                        Assigned Career Groups
                    </h3>
                    {details.career_groups?.length > 0 ? (
                        <div className="custom-scrollbar grid max-h-96 grid-cols-1 gap-3 overflow-y-auto pr-2">
                            {details.career_groups.map((group: any) => (
                                <div
                                    key={group.id}
                                    className="flex items-center gap-3 rounded-xl border border-slate-700/50 bg-slate-800/50 p-4"
                                >
                                    <div className="h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]"></div>
                                    <span className="font-medium text-white">
                                        {group.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-xl border border-dashed border-slate-800 bg-slate-800/30 py-6 text-center">
                            <p className="text-sm text-slate-400">
                                No career groups assigned yet.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Active Students List */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
                    <UserIcon className="text-cyan-500" size={20} />
                    Active Students Under Guidance
                </h3>
                {details.active_students_list?.length > 0 ? (
                    <div className="custom-scrollbar grid max-h-96 grid-cols-1 gap-4 overflow-y-auto pr-2 md:grid-cols-2 lg:grid-cols-3">
                        {details.active_students_list.map(
                            (student: any, idx: number) => (
                                <div
                                    key={idx}
                                    className="flex items-center gap-4 rounded-xl border border-slate-700/50 bg-slate-800/50 p-4"
                                >
                                    <img
                                        src={
                                            student.avatar ||
                                            `https://ui-avatars.com/api/?name=${student.name}&background=6366f1&color=fff`
                                        }
                                        alt={student.name}
                                        className="h-10 w-10 rounded-full border border-slate-700 bg-slate-900 object-cover"
                                    />
                                    <div>
                                        <p className="text-sm font-medium text-white">
                                            {student.name}
                                        </p>
                                        <p className="text-[10px] text-slate-400">
                                            @{student.username}
                                        </p>
                                    </div>
                                </div>
                            ),
                        )}
                    </div>
                ) : (
                    <div className="rounded-xl border border-dashed border-slate-800 bg-slate-800/30 py-6 text-center">
                        <p className="text-sm text-slate-400">
                            No active students currently.
                        </p>
                    </div>
                )}
            </div>

            {/* Signature Management */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
                    <ShieldCheck className="text-emerald-500" size={20} />
                    Digital Signature Preview
                </h3>
                <div className="flex min-h-[200px] flex-col items-center justify-center rounded-xl border border-slate-700/50 bg-slate-800/50 p-6">
                    {details.signature_url ? (
                        <div className="text-center">
                            <img
                                src={details.signature_url}
                                alt="Mentor Signature"
                                className="mx-auto mb-4 h-auto max-w-[300px] rounded-lg bg-white/5 object-contain p-4"
                            />
                            <p className="mt-2 text-xs text-slate-400">
                                Signature is used for generating valid PDF
                                certificates.
                            </p>
                        </div>
                    ) : (
                        <div className="text-center">
                            <Shield
                                className="mx-auto mb-3 text-slate-600"
                                size={40}
                            />
                            <p className="text-sm text-slate-400">
                                No digital signature uploaded yet.
                            </p>
                            <p className="mt-1 text-xs text-rose-400">
                                Warning: Certificates signed by this mentor may
                                fail to generate.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <AppLayout>
            <div className="mx-auto min-h-screen max-w-[1200px] space-y-6 px-6 py-6 sm:space-y-8 sm:px-6 lg:px-10">
                {/* BACK BUTTON */}
                <div>
                    <Link
                        href="/admin/users"
                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition-colors hover:text-white"
                    >
                        <ArrowLeft size={16} />
                        Back to Users
                    </Link>
                </div>

                {/* USER PROFILE HEADER */}
                <div className="flex flex-col items-center gap-6 rounded-2xl border border-slate-800/80 bg-slate-900 p-6 shadow-xl sm:p-8 md:flex-row md:items-start">
                    <img
                        src={
                            user.avatar ||
                            `https://ui-avatars.com/api/?name=${user.name}&background=6366f1&color=fff`
                        }
                        alt={user.name}
                        className="h-24 w-24 rounded-full border-4 border-slate-800 bg-slate-800 object-cover sm:h-32 sm:w-32"
                    />
                    <div className="flex-1 text-center md:text-left">
                        <div className="mb-2 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                            <div>
                                <h1 className="text-2xl font-bold text-white sm:text-3xl">
                                    {user.name}
                                </h1>
                                <p className="text-slate-400">
                                    @{user.username}
                                </p>
                            </div>
                            <span
                                className={`inline-flex self-center rounded-full border px-4 py-1.5 text-sm font-bold md:self-start ${
                                    user.role === 'admin'
                                        ? 'border-rose-500/20 bg-rose-500/10 text-rose-400'
                                        : user.role === 'mentor'
                                          ? 'border-blue-500/20 bg-blue-500/10 text-blue-400'
                                          : 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                                }`}
                            >
                                {user.role.toUpperCase()}
                            </span>
                        </div>
                        <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm text-slate-400 md:justify-start">
                            <div className="flex items-center gap-1.5">
                                <Mail size={16} />
                                {user.email}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Clock size={16} />
                                Joined{' '}
                                {new Date(user.created_at).toLocaleDateString(
                                    'en-US',
                                    {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                    },
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* DYNAMIC CONTENT BASED ON ROLE */}
                {user.role === 'student' && <StudentDetails />}
                {user.role === 'mentor' && <MentorDetails />}
                {user.role === 'admin' && (
                    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center shadow-xl">
                        <Shield
                            className="mx-auto mb-4 text-indigo-500/50"
                            size={48}
                        />
                        <h3 className="text-xl font-bold text-white">
                            Administrator Account
                        </h3>
                        <p className="mt-2 text-slate-400">
                            This account has full access to the system. No
                            specific operational details to show.
                        </p>
                    </div>
                )}
            </div>
            {/* Detail Modal */}
            {selectedDetail && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
                    onClick={() => setSelectedDetail(null)}
                >
                    <div
                        className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-800 bg-[#0B1120] shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-900/50 p-6">
                            <div>
                                <h2 className="text-xl font-bold text-white capitalize">
                                    {selectedDetail.type.replace('_', ' ')}{' '}
                                    Details
                                </h2>
                                <p className="mt-1 text-xs text-slate-400">
                                    Deep dive into the records.
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedDetail(null)}
                                className="rounded-lg bg-slate-950/50 p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="custom-scrollbar overflow-y-auto p-6">
                            {/* Quiz Detail */}
                            {selectedDetail.type === 'quiz' && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-900 p-4">
                                        <div>
                                            <h3 className="text-lg font-bold text-white">
                                                {selectedDetail.data.path_name}
                                            </h3>
                                            <p className="text-sm text-slate-400">
                                                Completed at{' '}
                                                {new Date(
                                                    selectedDetail.data
                                                        .completed_at,
                                                ).toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-black text-white">
                                                {selectedDetail.data.score}{' '}
                                                <span className="text-sm font-normal text-slate-500">
                                                    / 100
                                                </span>
                                            </p>
                                            <p
                                                className={`mt-1 text-xs font-bold tracking-widest uppercase ${selectedDetail.data.passed ? 'text-emerald-400' : 'text-rose-400'}`}
                                            >
                                                {selectedDetail.data.passed
                                                    ? 'PASSED'
                                                    : 'FAILED'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="mb-2 border-b border-slate-800 pb-2 text-sm font-bold tracking-wider text-slate-300 uppercase">
                                            Questions & Answers
                                        </h4>
                                        {selectedDetail.data.questions?.map(
                                            (q: any, qIdx: number) => {
                                                // Find the chosen answer logic
                                                // quiz_results answers array typically stores [question_id => answer_id]
                                                let chosenAnswerId = null;
                                                if (
                                                    Array.isArray(
                                                        selectedDetail.data
                                                            .answers,
                                                    )
                                                ) {
                                                    const found =
                                                        selectedDetail.data.answers.find(
                                                            (a: any) =>
                                                                a.question_id ===
                                                                q._id,
                                                        );
                                                    chosenAnswerId = found
                                                        ? found.answer_id
                                                        : null;
                                                } else if (
                                                    typeof selectedDetail.data
                                                        .answers === 'object'
                                                ) {
                                                    chosenAnswerId =
                                                        selectedDetail.data
                                                            .answers[q._id];
                                                }

                                                return (
                                                    <div
                                                        key={q._id}
                                                        className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-4"
                                                    >
                                                        <p className="mb-3 font-medium text-white">
                                                            <span className="mr-2 text-slate-500">
                                                                {qIdx + 1}.
                                                            </span>{' '}
                                                            {q.question_text}
                                                        </p>
                                                        <div className="space-y-2 pl-6">
                                                            {q.answers?.map(
                                                                (ans: any) => {
                                                                    const isChosen =
                                                                        ans._id ===
                                                                        chosenAnswerId;
                                                                    const isCorrect =
                                                                        ans.is_correct;

                                                                    let highlightClass =
                                                                        'text-slate-400';
                                                                    let icon =
                                                                        null;

                                                                    if (
                                                                        isChosen &&
                                                                        isCorrect
                                                                    ) {
                                                                        highlightClass =
                                                                            'text-emerald-400 font-medium bg-emerald-500/10 border-emerald-500/20';
                                                                        icon = (
                                                                            <CheckCircle
                                                                                size={
                                                                                    14
                                                                                }
                                                                                className="text-emerald-500"
                                                                            />
                                                                        );
                                                                    } else if (
                                                                        isChosen &&
                                                                        !isCorrect
                                                                    ) {
                                                                        highlightClass =
                                                                            'text-rose-400 font-medium bg-rose-500/10 border-rose-500/20';
                                                                        icon = (
                                                                            <XCircle
                                                                                size={
                                                                                    14
                                                                                }
                                                                                className="text-rose-500"
                                                                            />
                                                                        );
                                                                    } else if (
                                                                        !isChosen &&
                                                                        isCorrect
                                                                    ) {
                                                                        highlightClass =
                                                                            'text-emerald-400 border-emerald-500/20 border-dashed';
                                                                    }

                                                                    return (
                                                                        <div
                                                                            key={
                                                                                ans._id
                                                                            }
                                                                            className={`flex items-start gap-2 rounded-lg border border-transparent p-2 ${highlightClass}`}
                                                                        >
                                                                            <div className="mt-0.5">
                                                                                {icon ? (
                                                                                    icon
                                                                                ) : (
                                                                                    <div className="h-3.5 w-3.5 rounded-full border border-slate-600"></div>
                                                                                )}
                                                                            </div>
                                                                            <span className="text-sm">
                                                                                {
                                                                                    ans.answer_text
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                    );
                                                                },
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            },
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Submission Detail (For Student History OR Mentor Pending) */}
                            {(selectedDetail.type === 'submission' ||
                                selectedDetail.type ===
                                    'mentor_submission') && (
                                <div className="space-y-6">
                                    <div className="rounded-xl border border-slate-700 bg-slate-900 p-4">
                                        <h3 className="text-lg font-bold text-white">
                                            {selectedDetail.data.title ||
                                                selectedDetail.data.task_title}
                                        </h3>
                                        <p className="mt-1 text-sm text-slate-400">
                                            {selectedDetail.data.career_group}
                                        </p>

                                        {selectedDetail.data.student_name && (
                                            <div className="mt-3 flex items-center gap-2 border-t border-slate-800 pt-3 text-sm text-slate-300">
                                                <UserIcon
                                                    size={14}
                                                    className="text-indigo-400"
                                                />
                                                Submitted by:{' '}
                                                <span className="font-medium text-white">
                                                    {
                                                        selectedDetail.data
                                                            .student_name
                                                    }
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-4">
                                            <h4 className="mb-2 flex items-center gap-1.5 text-xs font-bold tracking-wider text-slate-500 uppercase">
                                                <MessageSquare size={14} />{' '}
                                                Student Notes
                                            </h4>
                                            <p className="text-sm whitespace-pre-wrap text-slate-300">
                                                {selectedDetail.data.notes || (
                                                    <span className="text-slate-600 italic">
                                                        No notes provided.
                                                    </span>
                                                )}
                                            </p>
                                        </div>

                                        <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-4">
                                            <h4 className="mb-2 flex items-center gap-1.5 text-xs font-bold tracking-wider text-slate-500 uppercase">
                                                <FileText size={14} />{' '}
                                                Attachments
                                            </h4>
                                            <div className="space-y-2">
                                                {selectedDetail.data.link ? (
                                                    <a
                                                        href={
                                                            selectedDetail.data
                                                                .link
                                                        }
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="flex items-center gap-2 rounded-lg bg-blue-500/10 p-2 text-sm text-blue-400 transition-colors hover:text-blue-300"
                                                    >
                                                        <LinkIcon size={16} />{' '}
                                                        Open External Link
                                                    </a>
                                                ) : null}
                                                {selectedDetail.data
                                                    .file_path ? (
                                                    <a
                                                        href={`/storage/${selectedDetail.data.file_path}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="flex items-center gap-2 rounded-lg bg-emerald-500/10 p-2 text-sm text-emerald-400 transition-colors hover:text-emerald-300"
                                                    >
                                                        <Download size={16} />{' '}
                                                        Download Attached File
                                                    </a>
                                                ) : null}
                                                {!selectedDetail.data.link &&
                                                    !selectedDetail.data
                                                        .file_path && (
                                                        <p className="text-sm text-slate-500 italic">
                                                            No attachments.
                                                        </p>
                                                    )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Evaluation section if it exists */}
                                    {selectedDetail.type === 'submission' &&
                                        (selectedDetail.data.feedback ||
                                            selectedDetail.data.grade) && (
                                            <div className="rounded-xl border border-indigo-500/30 bg-indigo-900/20 p-4">
                                                <h4 className="mb-3 flex items-center gap-1.5 text-xs font-bold tracking-wider text-indigo-400 uppercase">
                                                    <CheckCircle size={14} />{' '}
                                                    Mentor Evaluation
                                                </h4>

                                                {selectedDetail.data.grade && (
                                                    <div className="mb-3">
                                                        <span className="text-sm text-slate-400">
                                                            Score Awarded:{' '}
                                                        </span>
                                                        <span className="text-lg font-bold text-white">
                                                            {
                                                                selectedDetail
                                                                    .data.grade
                                                            }
                                                        </span>
                                                    </div>
                                                )}

                                                {selectedDetail.data
                                                    .feedback && (
                                                    <div>
                                                        <span className="mb-1 block text-sm text-slate-400">
                                                            Feedback:
                                                        </span>
                                                        <div className="rounded-lg border border-slate-700/50 bg-slate-900/50 p-3 text-sm whitespace-pre-wrap text-slate-300">
                                                            {
                                                                selectedDetail
                                                                    .data
                                                                    .feedback
                                                            }
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
