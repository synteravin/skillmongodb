import AppLayout from '@/layouts/app-layout';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Coins, Trophy, TrendingUp } from 'lucide-react';

interface ActivityTrend {
    date: string;
    label: string;
    users: number;
    submissions: number;
}

interface CareerBranchDistribution {
    id: string;
    name: string;
    count: number;
    percentage: number;
}

interface GamificationStats {
    total_exp: number;
    total_gold: number;
    average_level: number;
}

interface PopularCourse {
    _id: string;
    title: string;
    thumbnail_url: string | null;
    students_count: number;
}

interface DashboardProps {
    metrics: {
        users: {
            student: number;
            mentor: number;
            admin: number;
            total: number;
        };
        courses: { total: number; published: number };
        submissions: { total: number; approved: number };
    };
    popularCourses: PopularCourse[];
    activityTrends: ActivityTrend[];
    careerBranchDistribution: CareerBranchDistribution[];
    gamificationStats: GamificationStats;
}

const PATH_COLORS = [
    {
        bg: 'bg-indigo-500',
        hoverBg: 'hover:bg-indigo-600',
        fill: '#6366f1',
        border: 'border-indigo-500/20',
        text: 'text-indigo-400',
    },
    {
        bg: 'bg-emerald-500',
        hoverBg: 'hover:bg-emerald-600',
        fill: '#10b981',
        border: 'border-emerald-500/20',
        text: 'text-emerald-400',
    },
    {
        bg: 'bg-amber-500',
        hoverBg: 'hover:bg-amber-600',
        fill: '#f59e0b',
        border: 'border-amber-500/20',
        text: 'text-amber-400',
    },
    {
        bg: 'bg-rose-500',
        hoverBg: 'hover:bg-rose-600',
        fill: '#f43f5e',
        border: 'border-rose-500/20',
        text: 'text-rose-400',
    },
    {
        bg: 'bg-cyan-500',
        hoverBg: 'hover:bg-cyan-600',
        fill: '#06b6d4',
        border: 'border-cyan-500/20',
        text: 'text-cyan-400',
    },
];

export default function Dashboard({
    metrics,
    popularCourses,
    activityTrends = [],
    careerBranchDistribution = [],
    gamificationStats,
}: DashboardProps) {
    const { auth } = usePage().props as any;
    const user = auth.user;

    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    // Calculate overall activity-to-submission ratio
    const totalActivity = activityTrends.reduce((sum, t) => sum + t.users, 0);
    const totalSubs = activityTrends.reduce((sum, t) => sum + t.submissions, 0);
    const submissionRatio =
        totalActivity > 0
            ? ((totalSubs / totalActivity) * 100).toFixed(1)
            : '0';

    // Calculate chart boundaries (Dual Y-Axis)
    const maxUsers = Math.max(...activityTrends.map((t) => t.users), 5);
    const maxSubs = Math.max(...activityTrends.map((t) => t.submissions), 5);

    const pointsUsers = activityTrends.map((t, idx) => {
        const x = 40 + (idx / 29) * 540;
        const y = 210 - (t.users / maxUsers) * 190;
        return { x, y };
    });

    const pointsSubmissions = activityTrends.map((t, idx) => {
        const x = 40 + (idx / 29) * 540;
        const y = 210 - (t.submissions / maxSubs) * 190;
        return { x, y };
    });

    const usersPath = pointsUsers
        .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
        .join(' ');
    const usersArea = usersPath
        ? `${usersPath} L ${pointsUsers[pointsUsers.length - 1].x} 210 L ${pointsUsers[0].x} 210 Z`
        : '';

    const subsPath = pointsSubmissions
        .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
        .join(' ');
    const subsArea = subsPath
        ? `${subsPath} L ${pointsSubmissions[pointsSubmissions.length - 1].x} 210 L ${pointsSubmissions[0].x} 210 Z`
        : '';

    const handleMouseMove = (
        e: React.MouseEvent<SVGSVGElement, MouseEvent>,
    ) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const svgWidth = rect.width;
        const relativeX = (x / svgWidth) * 600;
        const paddingLeft = 40;
        const chartWidth = 540;
        const index = Math.round(((relativeX - paddingLeft) / chartWidth) * 29);
        if (index >= 0 && index < activityTrends.length) {
            setHoveredIndex(index);
        } else {
            setHoveredIndex(null);
        }
    };

    const leftGridLines = [0, 0.33, 0.66, 1].map((r) =>
        Math.round(r * maxUsers),
    );
    const rightGridLines = [0, 0.33, 0.66, 1].map((r) =>
        Math.round(r * maxSubs),
    );
    const xAxisIndices = [0, 9, 19, 29];

    return (
        <AppLayout>
            <div className="relative min-h-screen overflow-hidden bg-[#f8fafc] px-6 py-4 text-slate-900 transition-colors duration-200 sm:px-6 lg:px-10 dark:bg-[#030712] dark:text-white">
                <div className="relative z-10 mx-auto max-w-7xl space-y-4 sm:space-y-5">
                    {/* Header */}
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
                                    Administration
                                </span>
                                <h1 className="text-2xl leading-snug font-semibold tracking-tight text-slate-800 md:text-[28px] dark:text-white">
                                    Skill Ventura Dashboard
                                </h1>
                                <p className="text-sm leading-relaxed text-slate-500 md:text-[15px] dark:text-slate-400/60">
                                    Welcome back,{' '}
                                    <span className="font-semibold text-indigo-500 dark:text-indigo-400">
                                        {user.name}
                                    </span>
                                    ! Overview of platform performance, active
                                    student statistics, and task submissions.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* KPI CARDS */}
                    <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <StatCard
                            title="Total Users"
                            value={metrics.users.total.toString()}
                            subtitle={`${metrics.users.student} Students, ${metrics.users.mentor} Mentors`}
                        />
                        <StatCard
                            title="Published Courses"
                            value={metrics.courses.published.toString()}
                            subtitle={`Out of ${metrics.courses.total} total courses`}
                        />
                        <StatCard
                            title="Approved Submissions"
                            value={metrics.submissions.approved.toString()}
                            subtitle={`Out of ${metrics.submissions.total} total submissions`}
                        />
                    </section>

                    {/* ROW 3: ACTIVITY TREND CHART & PATH DISTRIBUTION */}
                    <div className="grid gap-5 lg:grid-cols-3 lg:gap-6">
                        {/* 30-DAY ACTIVITY TRENDS */}
                        <div className="relative flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:col-span-2 dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910] dark:shadow-none">
                            {/* Top accent line */}
                            <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />

                            <div className="relative">
                                <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                                    <div className="flex items-center gap-3">
                                        <h2
                                            className="text-sm font-bold tracking-[0.2em] text-slate-800 uppercase dark:text-white"
                                            style={{
                                                fontFamily:
                                                    "'Outfit', sans-serif",
                                            }}
                                        >
                                            30-Day Activity Trends
                                        </h2>
                                        {totalActivity > 0 && (
                                            <span className="inline-flex items-center gap-1 rounded-full border border-slate-200/20 bg-slate-100 px-2.5 py-0.5 font-sans text-[9px] font-bold tracking-wider text-slate-500 uppercase dark:border-white/5 dark:bg-white/[0.04] dark:text-slate-400">
                                                Ratio: {submissionRatio}%
                                                Subs/Activity
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-4 font-sans text-[10px] font-bold tracking-wider uppercase">
                                        <span className="flex items-center gap-1.5 text-indigo-500">
                                            <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />{' '}
                                            Student Activity
                                        </span>
                                        <span className="flex items-center gap-1.5 text-purple-500">
                                            <span className="h-2.5 w-2.5 rounded-full bg-purple-500" />{' '}
                                            Submissions
                                        </span>
                                    </div>
                                </div>

                                <div className="relative h-64 w-full">
                                    {activityTrends.length > 0 ? (
                                        <>
                                            <svg
                                                viewBox="0 0 600 240"
                                                className="h-full w-full overflow-visible"
                                                onMouseMove={handleMouseMove}
                                                onMouseLeave={() =>
                                                    setHoveredIndex(null)
                                                }
                                            >
                                                <defs>
                                                    <linearGradient
                                                        id="usersGradient"
                                                        x1="0"
                                                        y1="0"
                                                        x2="0"
                                                        y2="1"
                                                    >
                                                        <stop
                                                            offset="0%"
                                                            stopColor="#6366f1"
                                                            stopOpacity="0.25"
                                                        />
                                                        <stop
                                                            offset="100%"
                                                            stopColor="#6366f1"
                                                            stopOpacity="0.00"
                                                        />
                                                    </linearGradient>
                                                    <linearGradient
                                                        id="subsGradient"
                                                        x1="0"
                                                        y1="0"
                                                        x2="0"
                                                        y2="1"
                                                    >
                                                        <stop
                                                            offset="0%"
                                                            stopColor="#a855f7"
                                                            stopOpacity="0.25"
                                                        />
                                                        <stop
                                                            offset="100%"
                                                            stopColor="#a855f7"
                                                            stopOpacity="0.00"
                                                        />
                                                    </linearGradient>
                                                </defs>

                                                {/* Grid Lines & Labels (Dual Axis) */}
                                                {leftGridLines.map(
                                                    (leftVal, idx) => {
                                                        const ratio = idx / 3;
                                                        const y =
                                                            210 - ratio * 190;
                                                        const rightVal =
                                                            rightGridLines[idx];
                                                        return (
                                                            <g key={idx}>
                                                                <line
                                                                    x1="40"
                                                                    y1={y}
                                                                    x2="580"
                                                                    y2={y}
                                                                    stroke="currentColor"
                                                                    strokeWidth="1"
                                                                    strokeDasharray="4 4"
                                                                    className="text-slate-200 opacity-40 dark:text-slate-800/40 dark:opacity-20"
                                                                />
                                                                <text
                                                                    x="30"
                                                                    y={y + 3}
                                                                    textAnchor="end"
                                                                    className="fill-indigo-500/80 font-mono text-[9px] font-bold dark:fill-indigo-400/80"
                                                                >
                                                                    {leftVal}
                                                                </text>
                                                                <text
                                                                    x="590"
                                                                    y={y + 3}
                                                                    textAnchor="start"
                                                                    className="fill-purple-500/80 font-mono text-[9px] font-bold dark:fill-purple-400/80"
                                                                >
                                                                    {rightVal}
                                                                </text>
                                                            </g>
                                                        );
                                                    },
                                                )}

                                                {/* Areas */}
                                                {usersArea && (
                                                    <path
                                                        d={usersArea}
                                                        fill="url(#usersGradient)"
                                                    />
                                                )}
                                                {subsArea && (
                                                    <path
                                                        d={subsArea}
                                                        fill="url(#subsGradient)"
                                                    />
                                                )}

                                                {/* Lines */}
                                                {usersPath && (
                                                    <path
                                                        d={usersPath}
                                                        fill="none"
                                                        stroke="#6366f1"
                                                        strokeWidth="2.5"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                )}
                                                {subsPath && (
                                                    <path
                                                        d={subsPath}
                                                        fill="none"
                                                        stroke="#a855f7"
                                                        strokeWidth="2.5"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                )}

                                                {/* X Axis Labels */}
                                                {xAxisIndices.map((idx) => {
                                                    if (
                                                        idx >=
                                                        activityTrends.length
                                                    )
                                                        return null;
                                                    const x =
                                                        40 + (idx / 29) * 540;
                                                    return (
                                                        <text
                                                            key={idx}
                                                            x={x}
                                                            y="230"
                                                            textAnchor="middle"
                                                            className="fill-slate-400 font-mono text-[9px] font-bold dark:fill-slate-500"
                                                        >
                                                            {
                                                                activityTrends[
                                                                    idx
                                                                ].label
                                                            }
                                                        </text>
                                                    );
                                                })}

                                                {/* Hover Vertical Line */}
                                                {hoveredIndex !== null && (
                                                    <line
                                                        x1={
                                                            40 +
                                                            (hoveredIndex /
                                                                29) *
                                                                540
                                                        }
                                                        y1="20"
                                                        x2={
                                                            40 +
                                                            (hoveredIndex /
                                                                29) *
                                                                540
                                                        }
                                                        y2="210"
                                                        stroke="#6366f1"
                                                        strokeWidth="1"
                                                        strokeDasharray="3 3"
                                                        className="opacity-50"
                                                    />
                                                )}

                                                {/* Hover dots */}
                                                {hoveredIndex !== null &&
                                                    hoveredIndex <
                                                        activityTrends.length && (
                                                        <>
                                                            <circle
                                                                cx={
                                                                    pointsUsers[
                                                                        hoveredIndex
                                                                    ].x
                                                                }
                                                                cy={
                                                                    pointsUsers[
                                                                        hoveredIndex
                                                                    ].y
                                                                }
                                                                r="4.5"
                                                                fill="#6366f1"
                                                                stroke="#fff"
                                                                strokeWidth="1.5"
                                                            />
                                                            <circle
                                                                cx={
                                                                    pointsSubmissions[
                                                                        hoveredIndex
                                                                    ].x
                                                                }
                                                                cy={
                                                                    pointsSubmissions[
                                                                        hoveredIndex
                                                                    ].y
                                                                }
                                                                r="4.5"
                                                                fill="#a855f7"
                                                                stroke="#fff"
                                                                strokeWidth="1.5"
                                                            />
                                                        </>
                                                    )}
                                            </svg>

                                            {/* HTML Tooltip Overlay */}
                                            {hoveredIndex !== null &&
                                                hoveredIndex <
                                                    activityTrends.length && (
                                                    <div
                                                        className="pointer-events-none absolute z-20 space-y-1 rounded-lg border border-slate-700/50 bg-slate-900/95 p-2.5 text-xs text-white shadow-xl backdrop-blur-md dark:bg-slate-950/95"
                                                        style={{
                                                            left: `${Math.max(10, Math.min(90, (hoveredIndex / 29) * 100))}%`,
                                                            top: '10px',
                                                            transform:
                                                                'translateX(-50%)',
                                                        }}
                                                    >
                                                        <p className="text-[9px] font-bold tracking-wider text-slate-400 uppercase">
                                                            {
                                                                activityTrends[
                                                                    hoveredIndex
                                                                ].label
                                                            }
                                                        </p>
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="flex items-center gap-1.5">
                                                                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />{' '}
                                                                Student
                                                                Activity:{' '}
                                                                <strong>
                                                                    {
                                                                        activityTrends[
                                                                            hoveredIndex
                                                                        ].users
                                                                    }
                                                                </strong>
                                                            </span>
                                                            <span className="flex items-center gap-1.5">
                                                                <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />{' '}
                                                                Submissions:{' '}
                                                                <strong>
                                                                    {
                                                                        activityTrends[
                                                                            hoveredIndex
                                                                        ]
                                                                            .submissions
                                                                    }
                                                                </strong>
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                        </>
                                    ) : (
                                        <div
                                            className="flex h-full items-center justify-center text-sm text-slate-400 dark:text-slate-500"
                                            style={{
                                                fontFamily:
                                                    "'Outfit', sans-serif",
                                            }}
                                        >
                                            No activity trend data available.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* CAREER BRANCH DISTRIBUTION */}
                        <div className="relative flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910] dark:shadow-none">
                            <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />

                            <div>
                                <h2
                                    className="mb-5 text-sm font-bold tracking-[0.2em] text-slate-800 uppercase dark:text-white"
                                    style={{
                                        fontFamily: "'Outfit', sans-serif",
                                    }}
                                >
                                    Career Branch Distribution
                                </h2>

                                {careerBranchDistribution.length > 0 ? (
                                    <div
                                        className="space-y-6"
                                        style={{
                                            fontFamily: "'Outfit', sans-serif",
                                        }}
                                    >
                                        {/* Segmented Progress Bar */}
                                        <div className="flex h-3 w-full overflow-hidden rounded-full border border-slate-200/20 bg-slate-100 dark:border-white/5 dark:bg-slate-800/50">
                                            {careerBranchDistribution.map(
                                                (path, idx) => {
                                                    const color =
                                                        PATH_COLORS[
                                                            idx %
                                                                PATH_COLORS.length
                                                        ];
                                                    return (
                                                        <div
                                                            key={path.id}
                                                            className={`h-full transition-all duration-300 ${color.bg}`}
                                                            style={{
                                                                width: `${path.percentage}%`,
                                                            }}
                                                        />
                                                    );
                                                },
                                            )}
                                        </div>

                                        {/* Detailed Legend List */}
                                        <div className="space-y-3.5">
                                            {careerBranchDistribution.map(
                                                (path, idx) => {
                                                    const color =
                                                        PATH_COLORS[
                                                            idx %
                                                                PATH_COLORS.length
                                                        ];
                                                    return (
                                                        <div
                                                            key={path.id}
                                                            className="flex items-center justify-between text-xs"
                                                        >
                                                            <div className="flex min-w-0 items-center gap-2">
                                                                <span
                                                                    className={`h-2.5 w-2.5 shrink-0 rounded-full ${color.bg}`}
                                                                />
                                                                <span className="truncate font-semibold text-slate-700 dark:text-slate-300">
                                                                    {path.name}
                                                                </span>
                                                            </div>
                                                            <div className="flex shrink-0 items-center gap-3 text-slate-500 dark:text-slate-400">
                                                                <span
                                                                    className={`font-bold ${color.text} min-w-[36px] text-right`}
                                                                >
                                                                    {
                                                                        path.percentage
                                                                    }
                                                                    %
                                                                </span>
                                                            </div>
                                                        </div>
                                                    );
                                                },
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        className="py-12 text-center text-sm text-slate-400 dark:text-slate-500"
                                        style={{
                                            fontFamily: "'Outfit', sans-serif",
                                        }}
                                    >
                                        No active career branch selections
                                        found.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ROW 4: GAMIFICATION STATS & POPULAR COURSES */}
                    <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
                        {/* GAMIFICATION ECONOMY */}
                        <div className="relative flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910] dark:shadow-none">
                            <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />

                            <div>
                                <h2
                                    className="mb-5 text-sm font-bold tracking-[0.2em] text-slate-800 uppercase dark:text-white"
                                    style={{
                                        fontFamily: "'Outfit', sans-serif",
                                    }}
                                >
                                    Gamification Economy
                                </h2>

                                <div
                                    className="grid grid-cols-1 gap-5 sm:grid-cols-3"
                                    style={{
                                        fontFamily: "'Outfit', sans-serif",
                                    }}
                                >
                                    {/* EXP Card */}
                                    <div className="group flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-slate-50/30 p-5 transition-all duration-300 hover:border-slate-200 dark:border-white/[0.03] dark:bg-white/[0.01] dark:hover:border-white/10 dark:hover:bg-white/[0.02]">
                                        <div className="relative mb-3 flex h-16 w-16 shrink-0 items-center justify-center">
                                            <div className="absolute inset-0 rounded-full bg-amber-500/15 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />
                                            <img
                                                src="/images/exp.webp"
                                                alt="EXP"
                                                className="relative h-14 w-14 transform object-contain drop-shadow-[0_4px_10px_rgba(245,158,11,0.25)] transition-transform duration-300 group-hover:scale-110"
                                            />
                                        </div>
                                        <span className="mb-1.5 text-[10px] font-bold tracking-[0.15em] text-slate-400 uppercase dark:text-slate-500">
                                            Total EXP
                                        </span>
                                        <span className="font-mono text-2xl font-black tracking-tight text-slate-800 tabular-nums dark:text-white">
                                            {gamificationStats.total_exp.toLocaleString()}
                                        </span>
                                    </div>

                                    {/* Gold Card */}
                                    <div className="group flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-slate-50/30 p-5 transition-all duration-300 hover:border-slate-200 dark:border-white/[0.03] dark:bg-white/[0.01] dark:hover:border-white/10 dark:hover:bg-white/[0.02]">
                                        <div className="relative mb-3 flex h-16 w-16 shrink-0 items-center justify-center">
                                            <div className="absolute inset-0 rounded-full bg-yellow-500/15 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />
                                            <img
                                                src="/images/Gold.webp"
                                                alt="Gold"
                                                className="relative h-14 w-14 transform object-contain drop-shadow-[0_4px_10px_rgba(234,179,8,0.25)] transition-transform duration-300 group-hover:scale-110"
                                            />
                                        </div>
                                        <span className="mb-1.5 text-[10px] font-bold tracking-[0.15em] text-slate-400 uppercase dark:text-slate-500">
                                            Total Gold
                                        </span>
                                        <span className="font-mono text-2xl font-black tracking-tight text-slate-800 tabular-nums dark:text-white">
                                            {gamificationStats.total_gold.toLocaleString()}
                                        </span>
                                    </div>

                                    {/* Level Card */}
                                    <div className="group flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-slate-50/30 p-5 transition-all duration-300 hover:border-slate-200 dark:border-white/[0.03] dark:bg-white/[0.01] dark:hover:border-white/10 dark:hover:bg-white/[0.02]">
                                        <div className="relative mb-3 flex h-16 w-16 shrink-0 items-center justify-center">
                                            <div className="absolute inset-0 rounded-full bg-indigo-500/15 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />
                                            <TrendingUp className="relative h-10 w-10 transform text-indigo-500 drop-shadow-[0_4px_10px_rgba(99,102,241,0.25)] transition-transform duration-300 group-hover:scale-110" />
                                        </div>
                                        <span className="mb-1.5 text-[10px] font-bold tracking-[0.15em] text-slate-400 uppercase dark:text-slate-500">
                                            Avg Level
                                        </span>
                                        <span className="font-mono text-2xl font-black tracking-tight text-slate-800 tabular-nums dark:text-white">
                                            Lv.{gamificationStats.average_level}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* POPULAR COURSES */}
                        <div className="relative flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910] dark:shadow-none">
                            <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />

                            <div>
                                <div className="border-b border-slate-200 px-5 py-3.5 sm:px-6 dark:border-white/5">
                                    <h2
                                        className="text-sm font-bold tracking-[0.2em] text-slate-800 uppercase dark:text-white"
                                        style={{
                                            fontFamily: "'Outfit', sans-serif",
                                        }}
                                    >
                                        Most Popular Courses
                                    </h2>
                                </div>

                                <div className="divide-y divide-slate-100 dark:divide-white/5">
                                    {popularCourses.length > 0 ? (
                                        popularCourses.map((course, i) => (
                                            <div
                                                key={course._id}
                                                className="flex items-center justify-between gap-4 px-5 py-2.5 transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/40"
                                                style={{
                                                    fontFamily:
                                                        "'Outfit', sans-serif",
                                                }}
                                            >
                                                <div className="flex min-w-0 items-center gap-4">
                                                    <span className="shrink-0 text-sm font-black text-slate-400 tabular-nums dark:text-slate-500">
                                                        #{i + 1}
                                                    </span>
                                                    <h3 className="truncate text-sm font-semibold text-slate-800 dark:text-white">
                                                        {course.title}
                                                    </h3>
                                                </div>
                                                <span className="shrink-0 text-xs font-medium text-slate-500 dark:text-slate-400">
                                                    {course.students_count}{' '}
                                                    enrolled
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <div
                                            className="p-8 text-center text-sm text-slate-400 dark:text-slate-500"
                                            style={{
                                                fontFamily:
                                                    "'Outfit', sans-serif",
                                            }}
                                        >
                                            No active courses found.
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="border-t border-slate-200 px-5 py-3 text-center dark:border-white/5">
                                <Link
                                    href="/admin/courses"
                                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                                    style={{
                                        fontFamily: "'Outfit', sans-serif",
                                    }}
                                >
                                    View All Courses{' '}
                                    <span className="text-sm font-normal">
                                        →
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

function StatCard({
    title,
    value,
    subtitle,
}: {
    title: string;
    value: string;
    subtitle: string;
}) {
    return (
        <div
            className="relative overflow-hidden rounded-xl border border-slate-200 p-4 sm:p-5 dark:border-slate-800"
            style={{ fontFamily: "'Outfit', sans-serif" }}
        >
            <div className="absolute inset-0 bg-white dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]" />
            <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />

            <div className="relative z-10">
                <p className="text-[0.6rem] font-semibold tracking-[0.2em] text-slate-500 uppercase dark:text-slate-500">
                    {title}
                </p>

                <p className="mt-2 text-2xl leading-none font-black tracking-tight text-slate-800 sm:text-3xl dark:text-white">
                    {value}
                </p>

                <p className="mt-2 text-xs tracking-wide text-slate-500 dark:text-slate-400/60">
                    {subtitle}
                </p>
            </div>
        </div>
    );
}
