import { Link, router } from "@inertiajs/react";
import { ArrowLeft, Power, Camera, UserCog, RefreshCw } from "lucide-react";
import { useState } from "react";
 
type Props = {
    user: {
        name: string;
        level: number;
        avatar: string;
        exp_min: number;
        exp: number;
        exp_max: number;
        gold: number;
        courses: number;
        avg_score: number;
        status: "online" | "offline";
        last_course?: {
            course_name: string;
            path_name: string;
            module_name: string;
            url: string;
            thumbnail?: string; // ← tambah ini
        };
    };
};
 
export default function ProfilePage({ user }: Props) {
    const [showImage, setShowImage] = useState(false);
    const progress =
        ((user.exp - user.exp_min) / (user.exp_max - user.exp_min)) * 100;
 
    return (
        <div className="relative w-screen h-screen bg-[#020202] text-white overflow-hidden flex flex-col">
 
            {/* ── BACKGROUND GLOW ── */}
            <div className="absolute inset-0 flex justify-center items-center pointer-events-none z-0">
                <div className="w-[600px] h-[300px] bg-blue-500 opacity-20 blur-[180px]" />
            </div>
 
            {/* ── TOP BAR ── */}
            <div className="relative z-10 flex items-center justify-between px-4 md:px-6 pt-3 pb-2 flex-shrink-0">
 
                {/* BACK */}
                <Link
                    href="/student/dashboard"
                    className="flex items-center gap-2 group"
                >
                    <div className="w-8 h-8 flex items-center justify-center border border-[#1e2759] rounded text-blue-500 transition-all duration-300 group-hover:border-blue-500 group-hover:shadow-[0_0_10px_rgba(59,130,246,0.6)]">
                        <ArrowLeft size={16} />
                    </div>
                    <span className="text-blue-400 text-sm font-medium tracking-wide transition-all duration-300 group-hover:text-blue-300">
                        Back
                    </span>
                </Link>
 
                {/* SWITCH / TUKAR ICON — pojok kanan atas */}
                <Link
                    href="/student/profile/switch"
                    className="w-9 h-9 flex items-center justify-center border border-[#3B28F6] rounded text-[#3B28F6] hover:border-cyan-400 hover:text-cyan-400 hover:shadow-[0_0_12px_rgba(0,212,255,0.5)] transition-all duration-300"
                    title="Switch Account"
                >
                    <RefreshCw size={17} strokeWidth={2} />
                </Link>
            </div>
 
            {/* ── MAIN CONTENT ── */}
            <div className="relative z-10 flex-1 flex flex-col md:flex-row gap-3 md:gap-4 px-4 md:px-6 pb-3 min-h-0">
 
                {/* ══════════ LEFT PANEL WRAPPER ══════════ */}
                <div className=" right-2.5
                    w-full md:w-[260px] lg:w-[280px] xl:w-[295px] 2xl:w-[310px]
                    flex-shrink-0 flex flex-col gap-3
                ">
                    {/* PROFILE CARD */}
                    <div className="h-[320px] border-2 border-[#3B28F6] bg-[#050619] p-4 md:p-5 flex flex-col items-center text-center">

                        {/* AVATAR */}
                        <div
                            className="relative mb-3 cursor-pointer flex-shrink-0"
                            style={{ width: '130px', height: '148px' }}
                            onClick={() => setShowImage(true)}
                        >
                            <div
                                className="w-full h-full overflow-hidden"
                                style={{ clipPath: "polygon(0% 25%, 50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%)" }}
                            >
                                <img
                                    src={user.avatar ?? "/images/iam.jpeg"}
                                    className="w-full h-full object-cover"
                                    alt="avatar"
                                />
                            </div>
                            <button className="absolute bottom-2 right-2 bg-[#FACC15] w-7 h-7 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition z-10">
                                <Camera size={13} strokeWidth={3} className="text-black" />
                            </button>
                        </div>

                        {/* NAME */}
                        <h2 className="text-base font-extrabold font-['Orbitron'] tracking-wide break-words leading-tight mb-1">
                            {user.name}
                        </h2>

                        {/* LEVEL */}
                        <p className="text-[#3B28F6] font-extrabold text-sm mb-3">
                            Level {user.level}
                        </p>

                        {/* STATS */}
                        <div className="w-full border-t border-gray-700 pt-3 flex items-center text-sm">
                            <div className="flex-1 text-center">
                                <p className="text-yellow-400 font-bold">{user.courses}</p>
                                <p className="text-gray-400 text-[10px] mt-0.5 tracking-widest">COURSES</p>
                            </div>
                            <div className="w-px h-8 bg-gray-700" />
                            <div className="flex-1 text-center">
                                <p className={`font-bold ${user.avg_score >= 90 ? "text-green-400" : user.avg_score >= 75 ? "text-[#3B28F6]" : "text-red-500"}`}>
                                    {user.avg_score}%
                                </p>
                                <p className="text-gray-400 text-[10px] mt-0.5 tracking-widest">AVG SCORE</p>
                            </div>
                            <div className="w-px h-8 bg-gray-700" />
                            <div className="flex-1 text-center">
                                <p className="text-white font-bold">420</p>
                                <p className="text-gray-400 text-[10px] mt-0.5 tracking-widest">HOURS</p>
                            </div>
                        </div>
                    </div>

                    {/* LOGOUT — di luar profile card, otomatis di bawah */}
                    <button
                        onClick={() => router.post('/logout')}
                        className="w-full border-2 border-[#3B28F6] bg-[#050619] py-2.5 text-red-500 hover:text-red-400 hover:shadow-[0_0_12px_rgba(239,68,68,0.3)] transition
                        font-bold font-['Orbitron'] text-sm flex items-center justify-center gap-2 mt-auto"
                    >
                        <Power size={16} strokeWidth={3} />
                        SYSTEM LOG OUT
                    </button>
                </div>
                {/* ══════════ RIGHT PANEL ══════════ */}
                <div className="flex-1 flex flex-col gap-3 min-h-0 min-w-0">
 
                    {/* MASTERY LEVEL */}
                    <div className="border-2 border-[#3B28F6] bg-[#050619] p-4 flex-shrink-0">
                        <div className="flex items-center gap-4">
                            {/* LEVEL CIRCLE */}
                            <div className="w-14 h-14 flex items-center justify-center rounded-full border-[4px] border-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.4)] text-2xl font-bold font-['Orbitron'] flex-shrink-0">
                                {user.level}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xl md:text-2xl tracking-widest text-gray-200 font-semibold font-['Oxanium'] leading-none mb-1">
                                    MASTERY LEVEL
                                </p>
                                <div className="flex justify-end font-['Orbitron'] mb-1">
                                    <span className="text-yellow-400 text-xs">{user.exp}</span>
                                    <span className="text-gray-500 ml-1 text-[10px] mt-0.5">/{user.exp_max}</span>
                                </div>
                                <div className="w-full h-2.5 bg-[#1a1f3a] overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-yellow-400 transition-all duration-500"
                                        style={{ width: `${Math.min(progress, 100)}%` }}
                                    />
                                </div>
                                <div className="mt-1.5 text-green-400 text-[10px] flex justify-end items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                                    ONLINE
                                </div>
                            </div>
                        </div>
                    </div>
 
                    {/* OPERATOR DATA */}
                    <div className="border-2 border-[#3B28F6] bg-[#050619] p-4 md:p-5 relative flex-1 flex flex-col min-h-0 overflow-hidden">
 
                        {/* TOP GLOW LINE */}
                        <div className="absolute top-0 left-0 right-0 h-px"
                            style={{ background: 'linear-gradient(90deg, transparent, #3B28F6, #00e5ff, #3B28F6, transparent)' }}
                        />
 
                        {/* TITLE */}
                        <h3 className="font-['Orbitron'] text-[#3B28F6] text-base md:text-lg font-bold tracking-widest mb-3 flex items-center gap-2 flex-shrink-0">
                            <UserCog size={22} strokeWidth={2} />
                            OPERATOR DATA
                        </h3>
 
                        {/* RANK CARD */}
                        <div className="border border-[#3B28F6]/70 rounded-lg p-3 flex items-center gap-4 mb-3 bg-[#3B28F6]/5 flex-shrink-0">
                            
                            {/* HEX AVATAR */}
                            <div className="w-[64px] h-[64px] flex-shrink-0">
                                <svg viewBox="0 0 80 80" className="w-full h-full">
                                    <defs>
                                        <clipPath id="hexClip">
                                            <polygon points="40,4 74,22 74,58 40,76 6,58 6,22" />
                                        </clipPath>
                                    </defs>
                                    <image href="/images/romawi.png"
                                        x="16" y="14"
                                        width="48" height="52"
                                        preserveAspectRatio="xMidYMid slice"
                                        clipPath="url(#hexClip)"
                                    />
                                    <polygon points="40,4 74,22 74,58 40,76 6,58 6,22"
                                        fill="none" stroke="#FACC15" strokeWidth="1.5" />
                                </svg>
                            </div>

                            {/* RANK INFO */}
                            <div className="flex-1 min-w-0 flex flex-col gap-1.5">

                                {/* LABEL + RANK NAME  |  XP NUMBER */}
                                    <div className="flex items-end justify-between -mt-5">
                                        
                                        {/* KIRI — label & rank */}
                                        <div>
                                            <p className="text-[9px] text-gray-500 font-bold tracking-[2px] mb-0.5">CURRENT RANK</p>
                                            <p className="font-['Orbitron'] text-[#3B28F6] text-lg font-bold tracking-wider leading-none"
                                                style={{ textShadow: '0 0 12px rgba(59,40,246,0.6)' }}>
                                                NEXUS II
                                            </p>
                                        </div>

                                        {/* KANAN — xp number */}
                                        <div className="flex items-baseline gap-1">
                                            <span className="font-['Orbitron'] text-yellow-400 text-base font-bold leading-none">
                                                230
                                            </span>
                                            <span className="font-['Orbitron'] text-gray-500 text-xs leading-none">
                                                / 500
                                            </span>
                                        </div>

                                    </div>
                                {/* PROGRESS BAR */}
                                <div className="w-full h-3 bg-[#0f1235] border border-[#1a1f3a] rounded-none overflow-hidden">
                                    <div
                                        className="h-full rounded-r-full transition-all duration-700"
                                        style={{
                                            width: '46%',
                                            background: 'linear-gradient(90deg, #00bfff, #00e5ff)',
                                            boxShadow: '0 0 8px #00d4ff',
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
 
                       {/* FIELDS */}
                        <div className="flex flex-wrap gap-4 mb-3 flex-shrink-0">

                            <div className="w-[48%]">
                                <label className="block text-[10px] text-yellow-400 tracking-[2px] mb-1 font-['Oxanium']">USERNAME</label>
                                <input
                                    placeholder="ENTER USERNAME"
                                    className="w-full bg-[rgba(0,0,20,0.6)] border border-[#1e2a6e] text-[#c0d0ff] px-3 py-2 font-['Orbitron'] text-sm tracking-wide outline-none focus:border-[#3B28F6] focus:shadow-[0_0_8px_rgba(59,40,246,0.3)] transition-all placeholder:text-[#2a3060]"
                                />
                            </div>

                            <div className="w-[48%]">
                                <label className="block text-[10px] text-yellow-400 tracking-[2px] mb-1 font-['Oxanium']">EMAIL</label>
                                <input
                                    placeholder="ENTER EMAIL"
                                    className="w-full bg-[rgba(0,0,20,0.6)] border border-[#1e2a6e] text-[#c0d0ff] px-3 py-2 font-['Orbitron'] text-sm tracking-wide outline-none focus:border-[#3B28F6] focus:shadow-[0_0_8px_rgba(59,40,246,0.3)] transition-all placeholder:text-[#2a3060]"
                                />
                            </div>

                            <div className="w-[48%]">
                                <label className="block text-[10px] text-yellow-400 tracking-[2px] mb-1">SOCIAL UPLINK</label>
                                <input
                                    placeholder="SOCIAL HANDLE"
                                    className="w-full bg-[rgba(0,0,20,0.6)] border border-[#1e2a6e] text-[#c0d0ff] px-3 py-2 font-['Orbitron'] text-sm tracking-wide outline-none focus:border-[#3B28F6] focus:shadow-[0_0_8px_rgba(59,40,246,0.3)] transition-all placeholder:text-[#2a3060]"
                                />
                            </div>

                            <div className="w-[48%]">
                                <label className="block text-[10px] text-yellow-400 tracking-[2px] mb-1 font-['Oxanium']">FAV COURSE</label>
                                <input
                                    placeholder="COURSE NAME"
                                    className="w-full bg-[rgba(0,0,20,0.6)] border border-[#1e2a6e] text-[#c0d0ff] px-3 py-2 font-['Orbitron'] text-sm tracking-wide outline-none focus:border-[#3B28F6] focus:shadow-[0_0_8px_rgba(59,40,246,0.3)] transition-all placeholder:text-[#2a3060]"
                                />
                            </div>

                        </div>
 
                       {/* LAST MISSION */}
                        <p className="text-[10px] text-yellow-400 tracking-[3px] mb-2 flex-shrink-0">LAST MISSION / COURSE</p>
                        <div className="flex-shrink-0 mb-3">
                            {user.last_course ? (
                                <div className="relative border border-[#3B28F6]/60 overflow-hidden flex items-center gap-3 p-3 h-[72px]">

                                   <div
                                        className="absolute inset-0 bg-center"
                                        style={{
                                            backgroundImage: "url('/images/fullstack.png')",
                                            backgroundSize: "30%",
                                            // backgroundRepeat: "no-repeat"
                                        }}
                                    />
                                    {/* fade overlay */}
                                    <div className="absolute inset-0"
                                        style={{ background: 'linear-gradient(90deg, #050619 30%, transparent 60%, #050619 100%)' }}
                                    />

                                    {/* BADGE IV */}
                                    <div
                                        className="relative z-10 w-11 h-11 flex-shrink-0 flex items-center justify-center border border-[#FACC15]/60 font-['Orbitron'] text-sm font-black text-[#e0d0ff]"
                                        style={{
                                            background: 'linear-gradient(135deg,#0a0a2a,#1a1040)',
                                            textShadow: '0 0 8px #3B28F6',
                                            boxShadow: '0 0 10px rgba(59,40,246,0.4)',
                                        }}
                                    >
                                        ⚔️
                                    </div>

                                    {/* TEXT */}
                                    <div className="relative z-10 flex-1 min-w-0">
                                        <p className="text-sm font-bold text-white tracking-wide truncate">
                                            {user.last_course.course_name}
                                        </p>
                                        <p className="text-[11px] text-gray-400 mt-0.5 truncate">
                                            {user.last_course.path_name} • {user.last_course.module_name}
                                        </p>
                                    </div>

                                    {/* RESUME BUTTON */}
                                    <Link
                                        href={user.last_course.url}
                                        className="relative z-10 bg-yellow-400 text-black px-5 py-2 font-['Orbitron'] text-xs font-black tracking-wide hover:bg-yellow-300 transition-colors flex-shrink-0"
                                    >
                                        RESUME
                                    </Link>

                                    {/* GARIS BAWAH PROGRESS */}
                                    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#0f1235]">
                                        <div
                                            className="h-full transition-all duration-700"
                                            style={{
                                                width: '26%',
                                                background: 'linear-gradient(90deg, #3B28F6, #00e5ff)',
                                                boxShadow: '0 0 6px #00d4ff',
                                            }}
                                        />
                                    </div>

                                </div>
                            ) : (
                                <div className="border border-[#3B28F6]/40 p-3 text-center text-gray-500 text-xs font-['Orbitron'] tracking-widest">
                                    NO ACTIVE COURSE
                                </div>
                            )}
                        </div>
 
                       <div className="flex justify-end mt-auto flex-shrink-0">
                                <div
                                    className="p-[2px]"
                                    style={{
                                        background: "linear-gradient(90deg,#3B28F6,#6D5BFF)",
                                        clipPath: "polygon(0% 0%, 92% 0%, 100% 50%, 100% 100%, 0% 100%)",
                                        boxShadow: "0 0 20px rgba(59,40,246,0.6)"
                                    }}
                                >
                                    <button
                                        className="font-['Orbitron'] text-sm font-bold tracking-widest 
                                        text-white px-10 py-3 w-full 
                                        hover:brightness-125 hover:shadow-[0_0_20px_rgba(59,40,246,1)] 
                                        transition"
                                        style={{
                                            background: "linear-gradient(90deg,#3B28F6,#2a1fd6)",
                                            clipPath: "polygon(0% 0%, 92% 0%, 100% 50%, 100% 100%, 0% 100%)",
                                            textShadow: "0 0 6px rgba(255,255,255,0.6)"
                                        }}
                                        >
                                        SAVE CHANGES
                                    </button>
                                </div>
                            </div>
                    </div>
                </div>
            </div>
 
            {/* ── MODAL AVATAR ── */}
            {showImage && (
                <div
                    className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
                    onClick={() => setShowImage(false)}
                >
                    <img
                        src={user.avatar ?? "/images/iam.jpeg"}
                        onClick={(e) => e.stopPropagation()}
                        className="max-w-[90%] max-h-[90%] object-contain"
                        alt="avatar full"
                    />
                </div>
            )}
        </div>
    );
}