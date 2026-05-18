import AppLayout from "@/layouts/app-layout";
import { Link } from "@inertiajs/react";
import { ArrowLeft, User as UserIcon, Mail, Shield, ShieldCheck, Trophy, Target, BookOpen, Clock, Activity, Briefcase, FileText, CheckCircle, XCircle, Eye, X, MessageSquare, Link as LinkIcon, Download } from "lucide-react";
import { useState } from "react";

export default function Show({ user, details }: { user: any; details: any }) {
    const [selectedDetail, setSelectedDetail] = useState<{ type: 'quiz' | 'submission' | 'mentor_submission', data: any } | null>(null);

    const StudentDetails = () => (
        <div className="space-y-6">
            {/* Gamification Stats */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                    <Trophy className="text-yellow-500" size={20} />
                    Gamification Status
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                        <p className="text-slate-400 text-xs mb-1">Level</p>
                        <p className="text-2xl font-bold text-white">{details.gamification.level}</p>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                        <p className="text-slate-400 text-xs mb-1">EXP</p>
                        <p className="text-2xl font-bold text-indigo-400">{details.gamification.exp}</p>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                        <p className="text-slate-400 text-xs mb-1">Total Gold</p>
                        <p className="text-2xl font-bold text-yellow-400">{details.gamification.gold}</p>
                    </div>
                    {details.gamification.rank ? (
                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 flex flex-col items-center justify-center">
                            {details.gamification.rank.image ? (
                                <img src={details.gamification.rank.image} alt={details.gamification.rank.name} className="w-8 h-8 object-contain mb-1" />
                            ) : (
                                <Trophy className="text-yellow-500 mb-1" size={24} />
                            )}
                            <p className="text-xs font-bold text-white uppercase">{details.gamification.rank.name}</p>
                            <div className="flex gap-1 mt-1">
                                {[...Array(3)].map((_, i) => (
                                    <span key={i} className={`w-2 h-2 rounded-full ${i < details.gamification.rank.star ? 'bg-yellow-400' : 'bg-slate-700'}`}></span>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                            <p className="text-slate-400 text-xs mb-1">Rank</p>
                            <p className="text-lg font-bold text-slate-500">Unranked</p>
                        </div>
                    )}
                    <div className="relative bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 flex flex-col sm:flex-row items-center gap-4 col-span-2 md:col-span-full lg:col-span-2 overflow-hidden">
                        {/* Glow effect for background */}
                        <div className="absolute -right-8 -top-8 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
                        
                        <div className="flex-shrink-0 z-10">
                            {details.gamification.character_avatar ? (
                                <div className="h-16 w-auto bg-slate-900/40 rounded-lg p-1 border border-slate-700/50 flex items-center justify-center shadow-inner">
                                    <img src={details.gamification.character_avatar} alt={details.gamification.character} className="h-full w-auto object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]" />
                                </div>
                            ) : (
                                <div className="w-14 h-14 rounded-lg bg-slate-900/80 border border-slate-700 flex items-center justify-center">
                                    <UserIcon size={24} className="text-slate-500" />
                                </div>
                            )}
                        </div>
                        <div className="z-10">
                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Active Character</p>
                            <p className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-400 truncate">{details.gamification.character}</p>
                        </div>
                    </div>
                </div>

                {/* Additional Stats Details */}
                {Object.keys(details.gamification.exp_breakdown || {}).length > 0 && (
                    <div className="mt-6 pt-6 border-t border-slate-800">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">EXP Distribution Breakdown</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {Object.entries(details.gamification.exp_breakdown).map(([pathName, expValue]: [string, any], idx) => (
                                <div key={idx} className="flex justify-between items-center bg-slate-800/30 px-4 py-3 rounded-xl border border-slate-700/50 hover:bg-slate-800/50 transition-colors">
                                    <span className="text-sm text-slate-300 truncate pr-3" title={pathName}>{pathName}</span>
                                    <span className="text-sm font-black text-indigo-400">+{expValue}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Active Course */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                    <Target className="text-emerald-500" size={20} />
                    Active Learning Path
                </h3>
                {details.active_course ? (
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 gap-4">
                        <div className="flex items-center gap-4">
                            {details.active_course.thumbnail_url ? (
                                <img src={details.active_course.thumbnail_url} alt="Course Thumbnail" className="w-16 h-16 rounded-lg object-cover border border-slate-700 shadow-md" />
                            ) : (
                                <div className="w-16 h-16 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center">
                                    <BookOpen size={24} className="text-slate-500" />
                                </div>
                            )}
                            <div>
                                <h4 className="text-lg font-bold text-white">{details.active_course.course_name}</h4>
                                <p className="text-sm text-slate-400 mt-1">{details.active_course.career_group}</p>
                            </div>
                        </div>
                        <div className="mt-3 md:mt-0 text-right">
                            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-semibold uppercase tracking-wider">
                                {details.active_course.status}
                            </span>
                            <p className="text-xs text-slate-500 mt-2">
                                Enrolled: {new Date(details.active_course.enrolled_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-6 bg-slate-800/30 rounded-xl border border-slate-800 border-dashed">
                        <p className="text-slate-400 text-sm">No active course.</p>
                    </div>
                )}
            </div>

            {/* Course History */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                    <BookOpen className="text-blue-500" size={20} />
                    All Course History
                </h3>
                {details.course_history?.length > 0 ? (
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                        {details.course_history.map((course: any, idx: number) => (
                            <div key={idx} className="flex justify-between items-center bg-slate-800/50 p-3 rounded-xl border border-slate-700/50 gap-4">
                                <div className="flex items-center gap-3">
                                    {course.thumbnail_url ? (
                                        <img src={course.thumbnail_url} alt="Thumbnail" className="w-10 h-10 rounded-md object-cover border border-slate-700" />
                                    ) : (
                                        <div className="w-10 h-10 rounded-md bg-slate-900 border border-slate-700 flex items-center justify-center">
                                            <BookOpen size={16} className="text-slate-500" />
                                        </div>
                                    )}
                                    <div>
                                        <h4 className="font-medium text-white text-sm">{course.course_name}</h4>
                                        <p className="text-xs text-slate-500">{course.career_group}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs text-slate-400 capitalize">{course.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-6 bg-slate-800/30 rounded-xl border border-slate-800 border-dashed">
                        <p className="text-slate-400 text-sm">No course history available.</p>
                    </div>
                )}
            </div>

            {/* Recent Submissions & Quizzes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                        <FileText className="text-indigo-500" size={20} />
                        All Submissions
                    </h3>
                    {details.recent_submissions?.length > 0 ? (
                        <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                            {details.recent_submissions.map((sub: any, idx: number) => (
                                <div key={idx} className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="flex-1">
                                            <h4 className="font-medium text-white text-sm">{sub.title}</h4>
                                            <p className="text-[10px] text-slate-400 mt-0.5">{sub.career_group}</p>
                                            <p className="text-xs text-slate-500 mt-2">Submitted: {new Date(sub.submitted_at).toLocaleDateString('en-US')}</p>
                                        </div>
                                        <div className="text-right flex flex-col items-end gap-2">
                                            <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded border ${sub.status === 'graded' || sub.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                                                {sub.status}
                                            </span>
                                            {sub.grade && <p className="text-sm font-bold text-white">Score: {sub.grade}</p>}
                                            <button 
                                                onClick={() => setSelectedDetail({ type: 'submission', data: sub })}
                                                className="mt-1 flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors bg-indigo-500/10 px-2 py-1 rounded-md"
                                            >
                                                <Eye size={12} /> View Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-6 bg-slate-800/30 rounded-xl border border-slate-800 border-dashed">
                            <p className="text-slate-400 text-sm">No submissions found.</p>
                        </div>
                    )}
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                        <CheckCircle className="text-emerald-500" size={20} />
                        All Quiz Results
                    </h3>
                    {details.recent_quizzes?.length > 0 ? (
                        <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                            {details.recent_quizzes.map((quiz: any, idx: number) => (
                                <div key={idx} className="flex justify-between items-center bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                                    <div className="flex items-center gap-3">
                                        {quiz.passed ? (
                                            <CheckCircle className="text-emerald-500" size={16} />
                                        ) : (
                                            <XCircle className="text-rose-500" size={16} />
                                        )}
                                        <div>
                                            <h4 className="font-medium text-white text-sm">Quiz: {quiz.path_name}</h4>
                                            <p className="text-xs text-slate-500 mt-1">{new Date(quiz.completed_at).toLocaleDateString('en-US')}</p>
                                        </div>
                                    </div>
                                    <div className="text-right flex flex-col items-end gap-2">
                                        <span className={`text-sm font-bold ${quiz.passed ? 'text-emerald-400' : 'text-rose-400'}`}>{quiz.score} / 100</span>
                                        <button 
                                            onClick={() => setSelectedDetail({ type: 'quiz', data: quiz })}
                                            className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 transition-colors bg-emerald-500/10 px-2 py-1 rounded-md"
                                        >
                                            <Eye size={12} /> See Answers
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-6 bg-slate-800/30 rounded-xl border border-slate-800 border-dashed">
                            <p className="text-slate-400 text-sm">No quiz attempts found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    const MentorDetails = () => (
        <div className="space-y-6">
            {/* Mentor Workload & Stats */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                    <Activity className="text-rose-500" size={20} />
                    Mentor Workload & Statistics
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700/50">
                        <p className="text-slate-400 text-sm mb-1">Total Mentored</p>
                        <p className="text-3xl font-bold text-white">{details.stats.total_students}</p>
                    </div>
                    <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700/50">
                        <p className="text-slate-400 text-sm mb-1">Active Students</p>
                        <p className="text-3xl font-bold text-indigo-400">{details.stats.active_students}</p>
                    </div>
                    <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700/50">
                        <p className="text-slate-400 text-sm mb-1">Graduated Students</p>
                        <p className="text-3xl font-bold text-emerald-400">{details.stats.graduated_students}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pending Submissions Queue */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <Clock className="text-amber-500" size={20} />
                            Submission Queue
                        </h3>
                        <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded text-xs font-bold">
                            {details.stats.pending_submissions_count} Pending
                        </span>
                    </div>
                    {details.recent_pending_submissions?.length > 0 ? (
                        <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                            {details.recent_pending_submissions.map((sub: any, idx: number) => (
                                <div key={idx} className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className="font-medium text-white text-sm">{sub.task_title}</h4>
                                            <p className="text-[10px] text-slate-400 mt-0.5">{sub.career_group}</p>
                                        </div>
                                        <button 
                                            onClick={() => setSelectedDetail({ type: 'mentor_submission', data: sub })}
                                            className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 transition-colors bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20"
                                        >
                                            <Eye size={12} /> Detail
                                        </button>
                                    </div>
                                    <div className="flex justify-between items-center border-t border-slate-700/50 pt-2 mt-2">
                                        <p className="text-xs text-slate-400 flex items-center gap-1"><UserIcon size={12}/> {sub.student_name}</p>
                                        <p className="text-[10px] text-slate-500">{new Date(sub.submitted_at).toLocaleDateString('en-US')}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-6 bg-slate-800/30 rounded-xl border border-slate-800 border-dashed">
                            <p className="text-slate-400 text-sm">No pending submissions.</p>
                        </div>
                    )}
                </div>

                {/* Assigned Career Groups */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                        <Briefcase className="text-indigo-500" size={20} />
                        Assigned Career Groups
                    </h3>
                    {details.career_groups?.length > 0 ? (
                        <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                            {details.career_groups.map((group: any) => (
                                <div key={group.id} className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 flex items-center gap-3">
                                    <div className="w-2 h-2 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.8)]"></div>
                                    <span className="text-white font-medium">{group.name}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-6 bg-slate-800/30 rounded-xl border border-slate-800 border-dashed">
                            <p className="text-slate-400 text-sm">No career groups assigned yet.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Active Students List */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                    <UserIcon className="text-cyan-500" size={20} />
                    Active Students Under Guidance
                </h3>
                {details.active_students_list?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                        {details.active_students_list.map((student: any, idx: number) => (
                            <div key={idx} className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 flex items-center gap-4">
                                <img 
                                    src={student.avatar || `https://ui-avatars.com/api/?name=${student.name}&background=6366f1&color=fff`} 
                                    alt={student.name} 
                                    className="w-10 h-10 rounded-full border border-slate-700 object-cover bg-slate-900"
                                />
                                <div>
                                    <p className="text-white font-medium text-sm">{student.name}</p>
                                    <p className="text-slate-400 text-[10px]">@{student.username}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-6 bg-slate-800/30 rounded-xl border border-slate-800 border-dashed">
                        <p className="text-slate-400 text-sm">No active students currently.</p>
                    </div>
                )}
            </div>

            {/* Signature Management */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                    <ShieldCheck className="text-emerald-500" size={20} />
                    Digital Signature Preview
                </h3>
                <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50 flex flex-col items-center justify-center min-h-[200px]">
                    {details.signature_url ? (
                        <div className="text-center">
                            <img src={details.signature_url} alt="Mentor Signature" className="max-w-[300px] h-auto object-contain mx-auto mb-4 bg-white/5 p-4 rounded-lg" />
                            <p className="text-xs text-slate-400 mt-2">Signature is used for generating valid PDF certificates.</p>
                        </div>
                    ) : (
                        <div className="text-center">
                            <Shield className="mx-auto mb-3 text-slate-600" size={40} />
                            <p className="text-sm text-slate-400">No digital signature uploaded yet.</p>
                            <p className="text-xs text-rose-400 mt-1">Warning: Certificates signed by this mentor may fail to generate.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <AppLayout>
            <div className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-[1200px] mx-auto space-y-6 sm:space-y-8">
                
                {/* BACK BUTTON */}
                <div>
                    <Link href="/admin/users" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium">
                        <ArrowLeft size={16} />
                        Back to Users
                    </Link>
                </div>

                {/* USER PROFILE HEADER */}
                <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center md:items-start gap-6">
                    <img 
                        src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=6366f1&color=fff`} 
                        alt={user.name} 
                        className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-slate-800 object-cover bg-slate-800"
                    />
                    <div className="flex-1 text-center md:text-left">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-white">{user.name}</h1>
                                <p className="text-slate-400">@{user.username}</p>
                            </div>
                            <span className={`inline-flex px-4 py-1.5 rounded-full text-sm font-bold border self-center md:self-start
                                ${user.role === 'admin' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 
                                  user.role === 'mentor' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                                  'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}
                            >
                                {user.role.toUpperCase()}
                            </span>
                        </div>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4 text-sm text-slate-400">
                            <div className="flex items-center gap-1.5">
                                <Mail size={16} />
                                {user.email}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Clock size={16} />
                                Joined {new Date(user.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* DYNAMIC CONTENT BASED ON ROLE */}
                {user.role === "student" && <StudentDetails />}
                {user.role === "mentor" && <MentorDetails />}
                {user.role === "admin" && (
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl text-center">
                        <Shield className="mx-auto text-indigo-500/50 mb-4" size={48} />
                        <h3 className="text-xl font-bold text-white">Administrator Account</h3>
                        <p className="text-slate-400 mt-2">This account has full access to the system. No specific operational details to show.</p>
                    </div>
                )}
            </div>
            {/* Detail Modal */}
            {selectedDetail && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm" onClick={() => setSelectedDetail(null)}>
                    <div 
                        className="w-full max-w-2xl max-h-[85vh] bg-[#0B1120] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6 border-b border-slate-800/80 flex justify-between items-center bg-slate-900/50">
                            <div>
                                <h2 className="text-xl font-bold text-white capitalize">
                                    {selectedDetail.type.replace('_', ' ')} Details
                                </h2>
                                <p className="text-xs text-slate-400 mt-1">Deep dive into the records.</p>
                            </div>
                            <button
                                onClick={() => setSelectedDetail(null)}
                                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors bg-slate-950/50"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto custom-scrollbar">
                            {/* Quiz Detail */}
                            {selectedDetail.type === 'quiz' && (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center p-4 bg-slate-900 border border-slate-700 rounded-xl">
                                        <div>
                                            <h3 className="font-bold text-white text-lg">{selectedDetail.data.path_name}</h3>
                                            <p className="text-sm text-slate-400">Completed at {new Date(selectedDetail.data.completed_at).toLocaleString()}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-black text-white">{selectedDetail.data.score} <span className="text-sm text-slate-500 font-normal">/ 100</span></p>
                                            <p className={`text-xs font-bold uppercase tracking-widest mt-1 ${selectedDetail.data.passed ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                {selectedDetail.data.passed ? 'PASSED' : 'FAILED'}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-2 border-b border-slate-800 pb-2">Questions & Answers</h4>
                                        {selectedDetail.data.questions?.map((q: any, qIdx: number) => {
                                            // Find the chosen answer logic
                                            // quiz_results answers array typically stores [question_id => answer_id]
                                            let chosenAnswerId = null;
                                            if (Array.isArray(selectedDetail.data.answers)) {
                                                const found = selectedDetail.data.answers.find((a: any) => a.question_id === q._id);
                                                chosenAnswerId = found ? found.answer_id : null;
                                            } else if (typeof selectedDetail.data.answers === 'object') {
                                                chosenAnswerId = selectedDetail.data.answers[q._id];
                                            }

                                            return (
                                                <div key={q._id} className="bg-slate-800/30 p-4 rounded-xl border border-slate-700/50">
                                                    <p className="text-white font-medium mb-3"><span className="text-slate-500 mr-2">{qIdx + 1}.</span> {q.question_text}</p>
                                                    <div className="space-y-2 pl-6">
                                                        {q.answers?.map((ans: any) => {
                                                            const isChosen = ans._id === chosenAnswerId;
                                                            const isCorrect = ans.is_correct;
                                                            
                                                            let highlightClass = "text-slate-400";
                                                            let icon = null;
                                                            
                                                            if (isChosen && isCorrect) {
                                                                highlightClass = "text-emerald-400 font-medium bg-emerald-500/10 border-emerald-500/20";
                                                                icon = <CheckCircle size={14} className="text-emerald-500" />;
                                                            } else if (isChosen && !isCorrect) {
                                                                highlightClass = "text-rose-400 font-medium bg-rose-500/10 border-rose-500/20";
                                                                icon = <XCircle size={14} className="text-rose-500" />;
                                                            } else if (!isChosen && isCorrect) {
                                                                highlightClass = "text-emerald-400 border-emerald-500/20 border-dashed";
                                                            }

                                                            return (
                                                                <div key={ans._id} className={`flex items-start gap-2 p-2 rounded-lg border border-transparent ${highlightClass}`}>
                                                                    <div className="mt-0.5">{icon ? icon : <div className="w-3.5 h-3.5 rounded-full border border-slate-600"></div>}</div>
                                                                    <span className="text-sm">{ans.answer_text}</span>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Submission Detail (For Student History OR Mentor Pending) */}
                            {(selectedDetail.type === 'submission' || selectedDetail.type === 'mentor_submission') && (
                                <div className="space-y-6">
                                    <div className="p-4 bg-slate-900 border border-slate-700 rounded-xl">
                                        <h3 className="font-bold text-white text-lg">{selectedDetail.data.title || selectedDetail.data.task_title}</h3>
                                        <p className="text-sm text-slate-400 mt-1">{selectedDetail.data.career_group}</p>
                                        
                                        {selectedDetail.data.student_name && (
                                            <div className="mt-3 pt-3 border-t border-slate-800 flex items-center gap-2 text-sm text-slate-300">
                                                <UserIcon size={14} className="text-indigo-400"/>
                                                Submitted by: <span className="font-medium text-white">{selectedDetail.data.student_name}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-700/50">
                                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5"><MessageSquare size={14}/> Student Notes</h4>
                                            <p className="text-sm text-slate-300 whitespace-pre-wrap">{selectedDetail.data.notes || <span className="italic text-slate-600">No notes provided.</span>}</p>
                                        </div>
                                        
                                        <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-700/50">
                                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5"><FileText size={14}/> Attachments</h4>
                                            <div className="space-y-2">
                                                {selectedDetail.data.link ? (
                                                    <a href={selectedDetail.data.link} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 bg-blue-500/10 p-2 rounded-lg transition-colors">
                                                        <LinkIcon size={16} /> Open External Link
                                                    </a>
                                                ) : null}
                                                {selectedDetail.data.file_path ? (
                                                    <a href={`/storage/${selectedDetail.data.file_path}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 p-2 rounded-lg transition-colors">
                                                        <Download size={16} /> Download Attached File
                                                    </a>
                                                ) : null}
                                                {!selectedDetail.data.link && !selectedDetail.data.file_path && (
                                                    <p className="text-sm text-slate-500 italic">No attachments.</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Evaluation section if it exists */}
                                    {selectedDetail.type === 'submission' && (selectedDetail.data.feedback || selectedDetail.data.grade) && (
                                        <div className="bg-indigo-900/20 p-4 rounded-xl border border-indigo-500/30">
                                            <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-3 flex items-center gap-1.5"><CheckCircle size={14}/> Mentor Evaluation</h4>
                                            
                                            {selectedDetail.data.grade && (
                                                <div className="mb-3">
                                                    <span className="text-sm text-slate-400">Score Awarded: </span>
                                                    <span className="text-lg font-bold text-white">{selectedDetail.data.grade}</span>
                                                </div>
                                            )}
                                            
                                            {selectedDetail.data.feedback && (
                                                <div>
                                                    <span className="text-sm text-slate-400 block mb-1">Feedback:</span>
                                                    <div className="p-3 bg-slate-900/50 rounded-lg text-sm text-slate-300 border border-slate-700/50 whitespace-pre-wrap">
                                                        {selectedDetail.data.feedback}
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
