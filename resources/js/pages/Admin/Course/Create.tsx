import { useForm } from "@inertiajs/react"
import { useState } from "react"
import AppLayout from "@/layouts/app-layout"

export default function Create() {

    const { data, setData, post, processing, errors } = useForm({
        title: "",
        description: "",
        thumbnail: null as File | null
    })

    const [preview, setPreview] = useState<string | null>(null)

    function handleFile(file: File) {
        setData("thumbnail", file)
        setPreview(URL.createObjectURL(file))
    }

    function handleDrop(e: React.DragEvent) {
        e.preventDefault()
        const file = e.dataTransfer.files[0]
        if (file) handleFile(file)
    }

    function submit(e: React.FormEvent) {
        e.preventDefault()
        post("/admin/courses", {
            forceFormData: true
        })
    }

    return (
        <AppLayout>

            <div className="page">

                {/* HEADER */}
                <div className="header">
                    <h1>Create Course</h1>
                    <p>Build your learning experience</p>
                </div>

                {/* FLEX LAYOUT */}
                <form onSubmit={submit} className="layout">

                    {/* PREVIEW */}
                    <div className="preview">

                        <div
                            className="preview-box"
                            onDrop={handleDrop}
                            onDragOver={(e) => e.preventDefault()}
                            onClick={() => document.getElementById("fileInput")?.click()}
                        >

                            {preview ? (
                                <img src={preview} />
                            ) : (
                                <div className="placeholder">
                                    <span>Upload Image</span>
                                    <p>Click or drag here</p>
                                </div>
                            )}

                        </div>

                        <input
                            id="fileInput"
                            type="file"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) handleFile(file)
                            }}
                        />

                    </div>

                    {/* FORM */}
                    <div className="form">

                        <div className="field">
                            <label>Course Title</label>
                            <input
                                value={data.title}
                                onChange={(e) => setData("title", e.target.value)}
                                placeholder="e.g. Fullstack Laravel"
                            />
                            {errors.title && <span className="error">{errors.title}</span>}
                        </div>

                        <div className="field">
                            <label>Description</label>
                            <textarea
                                rows={5}
                                value={data.description}
                                onChange={(e) => setData("description", e.target.value)}
                                placeholder="Describe your course..."
                            />
                        </div>

                        <div className="actions">
                            <button disabled={processing} className="btn">
                                {processing ? "Creating..." : "Create Course"}
                            </button>
                        </div>

                    </div>

                </form>

                {/* STYLE */}
                <style>{`

                    .page {
                        max-width: 900px;
                        margin: auto;
                        padding: 32px 20px;
                    }

                    /* HEADER */
                    .header {
                        margin-bottom: 24px;
                    }

                    .header h1 {
                        font-size: 28px;
                        font-weight: 700;
                    }

                    .header p {
                        font-size: 12px;
                        color: #9ca3af;
                    }

                    /* FLEX LAYOUT */
                    .layout {
                        display: flex;
                        gap: 24px;
                        align-items: flex-start;
                    }

                    /* PREVIEW */
                    .preview {
                        width: 220px;
                        flex-shrink: 0;
                    }

                    .preview-box {
                        width: 100%;
                        aspect-ratio: 1;

                        border-radius: 16px;

                        background: linear-gradient(
                            145deg,
                            rgba(255,255,255,0.06),
                            rgba(255,255,255,0.02)
                        );

                        border: 1px dashed rgba(255,255,255,0.15);

                        display: flex;
                        align-items: center;
                        justify-content: center;

                        overflow: hidden;
                        cursor: pointer;

                        transition: 0.25s;
                    }

                    .preview-box img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    }

                    .preview-box:hover {
                        border-color: #6366f1;
                        background: rgba(99,102,241,0.05);
                        transform: translateY(-2px);
                    }

                    /* PLACEHOLDER */
                    .placeholder {
                        text-align: center;
                        font-size: 12px;
                        color: #9ca3af;
                    }

                    .placeholder span {
                        display: block;
                        font-weight: 500;
                        color: #e5e7eb;
                        margin-bottom: 4px;
                    }

                    /* FORM */
                    .form {
                        flex: 1;

                        display: flex;
                        flex-direction: column;
                        gap: 16px;

                        padding: 20px;
                        border-radius: 16px;

                        background: linear-gradient(
                            145deg,
                            rgba(15,23,42,0.95),
                            rgba(15,23,42,0.6)
                        );

                        border: 1px solid rgba(255,255,255,0.08);
                    }

                    .field {
                        display: flex;
                        flex-direction: column;
                        gap: 6px;
                    }

                    .field label {
                        font-size: 11px;
                        color: #9ca3af;
                    }

                    .field input,
                    .field textarea {
                        padding: 10px 12px;
                        border-radius: 10px;

                        background: rgba(0,0,0,0.5);
                        border: 1px solid rgba(255,255,255,0.08);

                        font-size: 13px;

                        transition: 0.2s;
                    }

                    .field input:focus,
                    .field textarea:focus {
                        border-color: #6366f1;
                        box-shadow: 0 0 0 2px rgba(99,102,241,0.2);
                    }

                    .error {
                        font-size: 11px;
                        color: #ef4444;
                    }

                    /* BUTTON */
                    .actions {
                        display: flex;
                        justify-content: flex-end;
                        margin-top: 10px;
                    }

                    .btn {
                        padding: 10px 18px;
                        border-radius: 10px;

                        background: linear-gradient(135deg,#6366f1,#4f46e5);

                        font-size: 13px;
                        font-weight: 500;

                        box-shadow: 0 4px 14px rgba(99,102,241,0.4);

                        transition: 0.2s;
                    }

                    .btn:hover {
                        transform: translateY(-1px);
                    }

                    /* RESPONSIVE */
                    @media (max-width: 768px) {
                        .layout {
                            flex-direction: column;
                        }

                        .preview {
                            width: 100%;
                        }

                        .preview-box {
                            height: 180px;
                        }
                    }

                `}</style>

            </div>

        </AppLayout>
    )
}