import AppLayout from "@/layouts/app-layout";
import { router } from "@inertiajs/react";
import { useState } from "react";

interface User {
    _id: string;
    name: string;
    username: string;
    email: string;
    role: "admin" | "mentor" | "student";
    avatar?: string | null;
}

export default function Index({ users }: { users: User[] }) {
    const [showModal, setShowModal] = useState(false);
    const [editUser, setEditUser] = useState<User | null>(null);

    const [preview, setPreview] = useState<string | null>(null);

    const [form, setForm] = useState<any>({
        name: "",
        username: "",
        email: "",
        password: "",
        role: "student",
        avatar: null,
    });

    /* ===============================
       HANDLE FILE (PREVIEW)
    =============================== */
    const handleFile = (file: File) => {
        setForm({ ...form, avatar: file });

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    };

    /* ===============================
       OPEN MODAL
    =============================== */
    const openCreate = () => {
        setEditUser(null);
        setPreview(null);
        setForm({
            name: "",
            username: "",
            email: "",
            password: "",
            role: "student",
            avatar: null,
        });
        setShowModal(true);
    };

    const openEdit = (user: User) => {
        setEditUser(user);

        setForm({
            name: user.name,
            username: user.username,
            email: user.email,
            password: "",
            role: user.role,
            avatar: null,
        });

        setPreview(user.avatar ? `/storage/${user.avatar}` : null);

        setShowModal(true);
    };

    /* ===============================
       SUBMIT
    =============================== */
    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editUser && editUser._id) {
            router.post(`/admin/users/${editUser._id}`, {
                ...form,
                _method: "put", // 🔥 WAJIB
            }, {
                forceFormData: true,
            });
        } else {
            router.post("/admin/users", form, {
                forceFormData: true,
            });
        }
    };

    /* ===============================
       DELETE
    =============================== */
    const deleteUser = (id: string) => {
        if (confirm("Yakin hapus user?")) {
            router.delete(`/admin/users/${id}`);
        }
    };

    return (
        <AppLayout>
            <div className="p-6 text-white space-y-6">
                {/* HEADER */}
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">User Management</h1>

                    <button
                        onClick={openCreate}
                        className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        + Add User
                    </button>
                </div>

                {/* TABLE */}
                <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-700">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-800 text-left">
                            <tr>
                                <th className="p-4">Avatar</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th className="text-right p-4">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id ?? user.email}
                                    className="border-t border-slate-700 hover:bg-slate-800/50 transition"
                                >
                                    <td className="p-4">
                                        <img
                                            src={
                                                user.avatar
                                                    ? `/storage/${user.avatar}`
                                                    : `https://ui-avatars.com/api/?name=${user.name}`
                                            }
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                    </td>

                                    <td>{user.name}</td>
                                    <td>{user.email}</td>

                                    <td>
                                        <span
                                            className={`px-2 py-1 rounded text-xs ${user.role === "admin"
                                                ? "bg-red-500"
                                                : user.role === "mentor"
                                                    ? "bg-blue-500"
                                                    : "bg-green-500"
                                                }`}
                                        >
                                            {user.role}
                                        </span>
                                    </td>

                                    <td className="text-right p-4 flex gap-3 justify-end">
                                        <button
                                            onClick={() => openEdit(user)}
                                            className="text-yellow-400 hover:scale-110 transition"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() => deleteUser(user._id)}
                                            className="text-red-400 hover:scale-110 transition"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* MODAL */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur flex items-center justify-center z-50">
                        <form
                            onSubmit={submit}
                            className="bg-slate-900 border border-slate-700 p-6 rounded-2xl w-full max-w-md space-y-4 shadow-2xl"
                        >
                            <h2 className="text-lg font-bold">
                                {editUser ? "Edit User" : "Create User"}
                            </h2>

                            {/* AVATAR */}
                            <div
                                onDrop={handleDrop}
                                onDragOver={(e) => e.preventDefault()}
                                onClick={() =>
                                    document.getElementById("avatarInput")?.click()
                                }
                                className="border-2 border-dashed border-slate-600 rounded-xl p-6 text-center cursor-pointer hover:border-blue-500 transition"
                            >
                                {preview ? (
                                    <img
                                        src={preview}
                                        className="w-24 h-24 mx-auto rounded-full object-cover shadow-lg"
                                    />
                                ) : (
                                    <>
                                        <p className="text-sm text-slate-400">
                                            Drag & drop avatar
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            or click to upload
                                        </p>
                                    </>
                                )}

                                <input
                                    id="avatarInput"
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) =>
                                        e.target.files && handleFile(e.target.files[0])
                                    }
                                />
                            </div>

                            {/* INPUT */}
                            <input
                                placeholder="Name"
                                className="w-full p-2 bg-slate-800 rounded"
                                value={form.name}
                                onChange={(e) =>
                                    setForm({ ...form, name: e.target.value })
                                }
                            />

                            <input
                                placeholder="Username"
                                className="w-full p-2 bg-slate-800 rounded"
                                value={form.username}
                                onChange={(e) =>
                                    setForm({ ...form, username: e.target.value })
                                }
                            />

                            <input
                                placeholder="Email"
                                className="w-full p-2 bg-slate-800 rounded"
                                value={form.email}
                                onChange={(e) =>
                                    setForm({ ...form, email: e.target.value })
                                }
                            />

                            <input
                                type="password"
                                placeholder="Password"
                                className="w-full p-2 bg-slate-800 rounded"
                                onChange={(e) =>
                                    setForm({ ...form, password: e.target.value })
                                }
                            />

                            <select
                                className="w-full p-2 bg-slate-800 rounded"
                                value={form.role}
                                onChange={(e) =>
                                    setForm({ ...form, role: e.target.value })
                                }
                            >
                                <option value="student">Student</option>
                                <option value="mentor">Mentor</option>
                                <option value="admin">Admin</option>
                            </select>

                            {/* ACTION */}
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-3 py-2 bg-slate-700 rounded"
                                >
                                    Cancel
                                </button>

                                <button className="px-3 py-2 bg-blue-600 rounded hover:bg-blue-700">
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}