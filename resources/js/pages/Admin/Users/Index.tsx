import AppLayout from "@/layouts/app-layout";
import { router, Link, useForm } from "@inertiajs/react";
import { useState, useEffect, useRef } from "react";
import { Pencil, Trash2, Plus, X, Users, Upload, User as UserIcon, Mail, Shield, Camera, Eye, Search, Loader2 } from "lucide-react";

interface User {
    _id: string;
    name: string;
    username: string;
    email: string;
    role: "admin" | "mentor" | "student";
    avatar?: string | null;
}

interface PaginatedUsers {
    data: User[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    total: number;
    from: number;
    to: number;
}

export default function Index({ users, filters }: { users: PaginatedUsers, filters?: { search?: string } }) {
    const [showModal, setShowModal] = useState(false);
    const [editUser, setEditUser] = useState<User | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState(filters?.search || "");

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: "",
        username: "",
        email: "",
        password: "",
        role: "student",
        avatar: null as File | null,
        _method: "post",
    });

    /* ================= HANDLE SEARCH ================= */
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timeout = setTimeout(() => {
            router.get(
                '/admin/users',
                { search: searchQuery },
                { preserveState: true, preserveScroll: true, replace: true }
            );
        }, 300);

        return () => clearTimeout(timeout);
    }, [searchQuery]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/users', { search: searchQuery }, { preserveState: true, preserveScroll: true });
    };

    /* ================= HANDLE FILE ================= */
    const handleFile = (file: File) => {
        setData("avatar", file);
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result as string);
        reader.readAsDataURL(file);
    };

    const openCreate = () => {
        setEditUser(null);
        setPreview(null);
        clearErrors();
        setData({
            name: "",
            username: "",
            email: "",
            password: "",
            role: "student",
            avatar: null,
            _method: "post"
        });
        setShowModal(true);
    };

    const openEdit = (user: User) => {
        setEditUser(user);
        clearErrors();
        setData({
            name: user.name,
            username: user.username,
            email: user.email,
            password: "",
            role: user.role,
            avatar: null,
            _method: "put",
        });
        setPreview(user.avatar ?? null);
        setShowModal(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        const url = editUser && editUser._id ? `/admin/users/${editUser._id}` : "/admin/users";

        post(url, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setShowModal(false);
                reset();
            },
        });
    };

    const deleteUser = (id: string) => {
        if (confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
            router.delete(`/admin/users/${id}`, { preserveScroll: true });
        }
    };

    // Helper for role badges
    const RoleBadge = ({ role }: { role: string }) => {
        const styles = {
            admin: "bg-rose-500/10 text-rose-400 border-rose-500/20",
            mentor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
            student: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        };
        const activeStyle = styles[role as keyof typeof styles] || "bg-slate-500/10 text-slate-400 border-slate-500/20";
        
        return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${activeStyle}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${role === 'admin' ? 'bg-rose-400' : role === 'mentor' ? 'bg-blue-400' : role === 'student' ? 'bg-emerald-400' : 'bg-slate-400'}`}></span>
                {role ? role.charAt(0).toUpperCase() + role.slice(1) : 'Unknown'}
            </span>
        );
    };

    return (
        <AppLayout>
            <div className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-[1200px] mx-auto space-y-6 sm:space-y-8">
                
                {/* HEADER & CONTROLS */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
                    {/* Decorative gradient blur */}
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none"></div>
                    
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                            <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                                <Users className="text-indigo-400" size={24} />
                            </div>
                            User Management
                        </h1>
                        <p className="text-slate-400 text-sm mt-2 ml-1">Manage system users, assigned roles, and access control.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto z-10">
                        {/* Search Form */}
                        <form onSubmit={handleSearch} className="relative flex-grow sm:min-w-[300px]">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                <Search size={16} className="text-slate-500" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by name, username or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/50 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600 hover:bg-slate-900"
                            />
                        </form>

                        <button 
                            onClick={openCreate} 
                            className="group flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 whitespace-nowrap"
                        >
                            <Plus size={18} className="transition-transform duration-300 group-hover:rotate-90" />
                            Add User
                        </button>
                    </div>
                </div>

                {/* TABLE CARD */}
                <div className="bg-slate-900 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-slate-950/50 text-slate-400 border-b border-slate-800/80">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">User</th>
                                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Email Address</th>
                                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {users.data.length > 0 ? (
                                    users.data.map((user) => (
                                        <tr key={user._id} className="hover:bg-slate-800/40 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="relative">
                                                        <img
                                                            src={
                                                                user.avatar
                                                                    ? user.avatar
                                                                    : `https://ui-avatars.com/api/?name=${user.name}&background=6366f1&color=fff`
                                                            }
                                                            className="w-10 h-10 rounded-full object-cover border border-slate-700/50 bg-slate-800 shadow-sm"
                                                            alt={user.name}
                                                        />
                                                        <div className="absolute inset-0 rounded-full shadow-inner ring-1 ring-white/10 pointer-events-none"></div>
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-medium text-sm group-hover:text-indigo-400 transition-colors">{user.name}</p>
                                                        <p className="text-slate-500 text-xs mt-0.5">@{user.username}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-400 text-sm font-medium">
                                                {user.email}
                                            </td>
                                            <td className="px-6 py-4">
                                                <RoleBadge role={user.role} />
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Link
                                                        href={`/admin/users/${user._id}`}
                                                        className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                                                        title="View User Details"
                                                    >
                                                        <Eye size={16} />
                                                    </Link>
                                                    <button
                                                        onClick={() => openEdit(user)}
                                                        className="p-2 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                                                        title="Edit User"
                                                    >
                                                        <Pencil size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteUser(user._id)}
                                                        className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                                                        title="Delete User"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4}>
                                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                                <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mb-4 border border-slate-700/50">
                                                    <Users size={32} className="text-slate-500" />
                                                </div>
                                                <h3 className="text-white font-medium text-lg mb-1">No users found</h3>
                                                <p className="text-slate-400 text-sm max-w-sm">
                                                    {searchQuery ? `No users matching "${searchQuery}" were found.` : "Get started by adding a new user to the system."}
                                                </p>
                                                {!searchQuery && (
                                                    <button 
                                                        onClick={openCreate}
                                                        className="mt-6 px-4 py-2 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 rounded-lg text-sm font-medium transition-colors border border-indigo-500/20"
                                                    >
                                                        Add First User
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* PAGINATION */}
                {users.last_page > 1 && (
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-900 border border-slate-800/80 rounded-2xl px-6 py-4 shadow-xl">
                        <div className="text-sm text-slate-400">
                            Showing <span className="font-medium text-white">{users.from}</span> to <span className="font-medium text-white">{users.to}</span> of <span className="font-medium text-white">{users.total}</span> results
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-1.5">
                            {users.links.map((link, i) => (
                                link.url ? (
                                    <Link
                                        key={i}
                                        href={link.url}
                                        preserveScroll
                                        className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                                            link.active
                                                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 border border-indigo-400'
                                                : 'bg-slate-950/50 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800/80'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ) : (
                                    <span
                                        key={i}
                                        className="px-3.5 py-2 rounded-xl text-sm font-medium bg-slate-900 text-slate-600 border border-slate-800/50 cursor-not-allowed opacity-50"
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                )
                            ))}
                        </div>
                    </div>
                )}

                {/* MODAL */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
                        {/* Overlay click area */}
                        <div className="absolute inset-0" onClick={() => !processing && setShowModal(false)}></div>
                        
                        <form
                            onSubmit={submit}
                            className="w-full max-w-md bg-[#0B1120] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col relative z-10 animate-in zoom-in-95 duration-200"
                        >
                            <div className="p-6 border-b border-slate-800/80 flex justify-between items-center bg-slate-900/50">
                                <div>
                                    <h2 className="text-xl font-bold text-white">{editUser ? "Edit User Details" : "Create New User"}</h2>
                                    <p className="text-xs text-slate-400 mt-1">{editUser ? "Update the user's information and role." : "Add a new user to the system."}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => !processing && setShowModal(false)}
                                    className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors bg-slate-950/50 border border-slate-800/50"
                                    disabled={processing}
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                                {/* AVATAR */}
                                <div className="flex flex-col items-center justify-center">
                                    <div
                                        className={`relative w-24 h-24 rounded-full bg-slate-950/80 border-2 border-dashed ${errors.avatar ? 'border-rose-500' : 'border-slate-700 hover:border-indigo-500'} flex items-center justify-center cursor-pointer overflow-hidden group transition-all duration-300 shadow-inner`}
                                        onClick={() => document.getElementById("avatarInput")?.click()}
                                    >
                                        {preview ? (
                                            <>
                                                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-slate-950/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                    <Camera size={24} className="text-white" />
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center text-slate-500 group-hover:text-indigo-400 transition-colors">
                                                <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform duration-300 shadow-sm border border-slate-800">
                                                    <Upload size={16} />
                                                </div>
                                                <span className="text-[10px] font-medium uppercase tracking-wider">Photo</span>
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        id="avatarInput"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => e.target.files && handleFile(e.target.files[0])}
                                    />
                                    {errors.avatar && <span className="text-xs text-rose-500 mt-2 font-medium">{errors.avatar}</span>}
                                </div>

                                <div className="space-y-5">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-slate-400 mb-1.5 ml-1">Full Name <span className="text-rose-500">*</span></label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                                    <UserIcon size={16} className={errors.name ? "text-rose-500" : "text-slate-500"} />
                                                </div>
                                                <input
                                                    placeholder="John Doe"
                                                    value={data.name}
                                                    onChange={(e) => setData("name", e.target.value)}
                                                    className={`w-full pl-10 pr-4 py-2.5 bg-slate-950 border ${errors.name ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500' : 'border-slate-800 focus:border-indigo-500 focus:ring-indigo-500'} rounded-xl text-white text-sm focus:outline-none focus:ring-1 transition-shadow placeholder:text-slate-600`}
                                                    required
                                                />
                                            </div>
                                            {errors.name && <span className="text-xs text-rose-500 mt-1 ml-1 inline-block">{errors.name}</span>}
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-slate-400 mb-1.5 ml-1">Username <span className="text-rose-500">*</span></label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                                    <span className={`font-medium ${errors.username ? "text-rose-500" : "text-slate-500"}`}>@</span>
                                                </div>
                                                <input
                                                    placeholder="johndoe"
                                                    value={data.username}
                                                    onChange={(e) => setData("username", e.target.value)}
                                                    className={`w-full pl-9 pr-4 py-2.5 bg-slate-950 border ${errors.username ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500' : 'border-slate-800 focus:border-indigo-500 focus:ring-indigo-500'} rounded-xl text-white text-sm focus:outline-none focus:ring-1 transition-shadow placeholder:text-slate-600`}
                                                    required
                                                />
                                            </div>
                                            {errors.username && <span className="text-xs text-rose-500 mt-1 ml-1 inline-block">{errors.username}</span>}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-slate-400 mb-1.5 ml-1">Email Address <span className="text-rose-500">*</span></label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                                <Mail size={16} className={errors.email ? "text-rose-500" : "text-slate-500"} />
                                            </div>
                                            <input
                                                type="email"
                                                placeholder="john@example.com"
                                                value={data.email}
                                                onChange={(e) => setData("email", e.target.value)}
                                                className={`w-full pl-10 pr-4 py-2.5 bg-slate-950 border ${errors.email ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500' : 'border-slate-800 focus:border-indigo-500 focus:ring-indigo-500'} rounded-xl text-white text-sm focus:outline-none focus:ring-1 transition-shadow placeholder:text-slate-600`}
                                                required
                                            />
                                        </div>
                                        {errors.email && <span className="text-xs text-rose-500 mt-1 ml-1 inline-block">{errors.email}</span>}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-slate-400 mb-1.5 ml-1">
                                                Password {editUser ? <span className="text-slate-500 text-[10px] ml-1">(Optional)</span> : <span className="text-rose-500">*</span>}
                                            </label>
                                            <input
                                                type="password"
                                                placeholder={editUser ? "Leave blank to keep" : "••••••••"}
                                                value={data.password}
                                                onChange={(e) => setData("password", e.target.value)}
                                                className={`w-full px-4 py-2.5 bg-slate-950 border ${errors.password ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500' : 'border-slate-800 focus:border-indigo-500 focus:ring-indigo-500'} rounded-xl text-white text-sm focus:outline-none focus:ring-1 transition-shadow placeholder:text-slate-600`}
                                                required={!editUser}
                                            />
                                            {errors.password && <span className="text-xs text-rose-500 mt-1 ml-1 inline-block">{errors.password}</span>}
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-slate-400 mb-1.5 ml-1">Role <span className="text-rose-500">*</span></label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                                    <Shield size={16} className={errors.role ? "text-rose-500" : "text-slate-500"} />
                                                </div>
                                                <select
                                                    value={data.role}
                                                    onChange={(e) => setData("role", e.target.value as any)}
                                                    className={`w-full pl-10 pr-8 py-2.5 bg-slate-950 border ${errors.role ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500' : 'border-slate-800 focus:border-indigo-500 focus:ring-indigo-500'} rounded-xl text-white text-sm focus:outline-none focus:ring-1 transition-shadow appearance-none`}
                                                >
                                                    <option value="student">Student</option>
                                                    <option value="mentor">Mentor</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                                                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                                </div>
                                            </div>
                                            {errors.role && <span className="text-xs text-rose-500 mt-1 ml-1 inline-block">{errors.role}</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 border-t border-slate-800/80 bg-slate-900/40 flex justify-end gap-3 mt-auto">
                                <button
                                    type="button"
                                    onClick={() => !processing && setShowModal(false)}
                                    disabled={processing}
                                    className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-500/25 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {processing && <Loader2 size={16} className="animate-spin" />}
                                    {editUser ? "Save Changes" : "Create User"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #334155;
                    border-radius: 20px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background-color: #475569;
                }
            `}</style>
        </AppLayout>
    );
}