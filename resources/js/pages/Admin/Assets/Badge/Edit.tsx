import { useForm, Link } from "@inertiajs/react";
import { useState, useEffect } from "react";
import AppLayout from "@/layouts/app-layout";

type Badge = {
    _id: string;
    name: string;
    order: number;
    icon: string;
};

export default function Edit({ badge }: { badge: Badge }) {

    const id = badge._id ?? (badge as any).id;

    const { data, setData, post, processing, errors } = useForm({
        _method: "put",
        name: badge.name || "",
        order: badge.order?.toString() || "",
        icon: null as File | null,
    });

    const [preview, setPreview] = useState<string | null>(null);

    const handleImage = (file: File | null) => {
        if (!file) return;
        setData("icon", file);
        setPreview(URL.createObjectURL(file));
    };

    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/assets/badges/${id}`, {
            forceFormData: true,
        });
    };

    return (
        <AppLayout>
            <div className="page">

                {/* HEADER */}
                <div className="header">
                    <div>
                        <h1 className="title">Edit Badge</h1>
                        <p className="subtitle">
                            Update badge data and visual identity
                        </p>
                    </div>

                    <Link href="/admin/assets/badges" className="back">
                        ← Back
                    </Link>
                </div>

                {/* CARD */}
                <div className="card">

                    <form onSubmit={submit} className="form">

                        {/* AVATAR */}
                        <div className="avatar-wrapper">

                            <div
                                className="avatar-box"
                                onClick={() =>
                                    document.getElementById("fileInput")?.click()
                                }
                            >
                                <img
                                    src={preview ?? `/storage/${badge.icon}`}
                                    className="avatar"
                                />

                                <div className="overlay">
                                    Change
                                </div>
                            </div>

                            <p className="hint">
                                Click image to replace icon
                            </p>

                            <input
                                id="fileInput"
                                type="file"
                                className="hidden"
                                onChange={(e) =>
                                    handleImage(e.target.files?.[0] || null)
                                }
                            />
                        </div>

                        {/* INPUTS */}
                        <div className="grid">

                            <div>
                                <label>Name</label>
                                <input
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    className="input"
                                />
                                {errors.name && (
                                    <p className="error">{errors.name}</p>
                                )}
                            </div>

                            <div>
                                <label>Order</label>
                                <input
                                    type="number"
                                    value={data.order}
                                    onChange={(e) =>
                                        setData("order", e.target.value)
                                    }
                                    className="input"
                                />
                                {errors.order && (
                                    <p className="error">{errors.order}</p>
                                )}
                            </div>

                        </div>

                        {/* BUTTON */}
                        <button className="btn" disabled={processing}>
                            {processing ? "Updating..." : "Update Badge"}
                        </button>

                    </form>
                </div>

                {/* STYLE */}
                <style>{`
                    .page {
                        max-width: 900px;
                        margin: auto;
                        padding: 40px 20px;
                    }

                    .header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 24px;
                    }

                    .title {
                        font-size: 26px;
                        font-weight: 700;
                        background: linear-gradient(to right,#818cf8,#c7d2fe);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                    }

                    .subtitle {
                        font-size: 13px;
                        color: #9ca3af;
                    }

                    .back {
                        font-size: 14px;
                        color: #9ca3af;
                    }

                    .card {
                        background: rgba(15,23,42,0.6);
                        border: 1px solid rgba(255,255,255,0.06);
                        border-radius: 18px;
                        padding: 28px;
                        backdrop-filter: blur(14px);
                        box-shadow: 0 20px 40px rgba(0,0,0,0.5);
                    }

                    .form {
                        display: flex;
                        flex-direction: column;
                        gap: 20px;
                    }

                    .avatar-wrapper {
                        text-align: center;
                    }

                    .avatar-box {
                        width: 120px;
                        height: 120px;
                        margin: auto;
                        border-radius: 16px;
                        overflow: hidden;
                        position: relative;
                        cursor: pointer;
                        border: 1px solid rgba(255,255,255,0.1);
                    }

                    .avatar {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    }

                    .overlay {
                        position: absolute;
                        inset: 0;
                        background: rgba(0,0,0,0.6);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        opacity: 0;
                        transition: 0.2s;
                        font-size: 13px;
                    }

                    .avatar-box:hover .overlay {
                        opacity: 1;
                    }

                    .hint {
                        font-size: 12px;
                        color: #9ca3af;
                        margin-top: 8px;
                    }

                    .grid {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 16px;
                    }

                    label {
                        font-size: 12px;
                        color: #9ca3af;
                        display: block;
                        margin-bottom: 4px;
                    }

                    .input {
                        width: 100%;
                        padding: 10px;
                        border-radius: 10px;
                        background: rgba(0,0,0,0.5);
                        border: 1px solid rgba(255,255,255,0.08);
                        color: white;
                    }

                    .input:focus {
                        border-color: #6366f1;
                        box-shadow: 0 0 0 2px rgba(99,102,241,0.2);
                    }

                    .btn {
                        padding: 12px;
                        border-radius: 12px;
                        background: linear-gradient(to right,#6366f1,#4f46e5);
                        font-weight: 600;
                        transition: 0.2s;
                    }

                    .btn:hover {
                        transform: translateY(-1px);
                    }

                    .error {
                        font-size: 11px;
                        color: #f87171;
                    }
                `}</style>

            </div>
        </AppLayout>
    );
}