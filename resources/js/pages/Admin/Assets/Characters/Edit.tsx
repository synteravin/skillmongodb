import { useForm, Link } from "@inertiajs/react";
import { useRef, useState, useEffect } from "react";
import AppLayout from "@/layouts/app-layout";

/* ================= TYPES ================= */
type Character = {
    id: string;
    name: string;
    tagline?: string;
    backstory: string;
    quote?: string;
    avatar: string;
    character_type?: string[];
    abilities?: string[];
    personality?: string[];
    cosmetic_bonus?: string[];
    guide_power?: {
        title?: string;
        description?: string;
    };
    system_bonus?: {
        exp_boost?: string;
        gold_boost?: string;
    };
};

/* ================= TAG INPUT ================= */
function TagInput({
    value,
    onChange,
    placeholder,
}: {
    value: string[];
    onChange: (tags: string[]) => void;
    placeholder: string;
}) {
    const [input, setInput] = useState("");

    const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && input.trim()) {
            e.preventDefault();

            if (!value.includes(input.trim())) {
                onChange([...value, input.trim()]);
            }

            setInput("");
        }
    };

    const removeTag = (tag: string) => {
        onChange(value.filter((t) => t !== tag));
    };

    return (
        <div className="tag-container">
            {value.map((tag) => (
                <span key={tag} className="tag-chip">
                    {tag}
                    <button onClick={() => removeTag(tag)}>✕</button>
                </span>
            ))}

            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={addTag}
                placeholder={placeholder}
                className="tag-input"
            />
        </div>
    );
}

/* ================= PAGE ================= */
export default function Edit({ character }: { character: Character }) {
    const fileRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing } = useForm({
        _method: "put",

        name: character.name || "",
        tagline: character.tagline || "",
        backstory: character.backstory || "",
        quote: character.quote || "",

        guide_power_title: character.guide_power?.title || "",
        guide_power_description: character.guide_power?.description || "",

        character_type: Array.isArray(character.character_type) ? character.character_type : [],
        abilities: Array.isArray(character.abilities) ? character.abilities : [],
        personality: Array.isArray(character.personality) ? character.personality : [],
        cosmetic_bonus: Array.isArray(character.cosmetic_bonus) ? character.cosmetic_bonus : [],

        system_bonus: {
            exp_boost: character.system_bonus?.exp_boost || "",
            gold_boost: character.system_bonus?.gold_boost || "",
        },

        avatar: null as File | null, // ✅ FIX TS
    });

    const [preview, setPreview] = useState<string | null>(null);

    const handleFile = (file: File) => {
        if (!file.type.startsWith("image/")) return;

        setData("avatar", file);
        setPreview(URL.createObjectURL(file));
    };

    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        post(`/admin/assets/characters/${character.id}`, {
            forceFormData: true,
        });
    };

    return (
        <AppLayout>
            <div className="page">

                {/* HEADER */}
                <div className="header">
                    <div>
                        <h1 className="title">Edit Character</h1>
                        <p className="subtitle">Update character information</p>
                    </div>

                    <Link href="/admin/assets/characters" className="back">
                        ← Back
                    </Link>
                </div>

                <form onSubmit={submit} className="layout">

                    {/* LEFT */}
                    <div className="left">

                        <div className="card">
                            <h2>Basic Info</h2>

                            <input
                                value={data.name}
                                onChange={(e) => setData("name", e.target.value)}
                                placeholder="Name"
                                className="input"
                            />

                            <input
                                value={data.tagline}
                                onChange={(e) => setData("tagline", e.target.value)}
                                placeholder="Tagline"
                                className="input"
                            />

                            <input
                                value={data.quote}
                                onChange={(e) => setData("quote", e.target.value)}
                                placeholder="Quote"
                                className="input"
                            />

                            <textarea
                                value={data.backstory}
                                onChange={(e) => setData("backstory", e.target.value)}
                                placeholder="Backstory"
                                className="input h-28"
                            />
                        </div>

                        <div className="card">
                            <h2>Traits</h2>

                            <TagInput value={data.character_type} onChange={(v) => setData("character_type", v)} placeholder="Type" />
                            <TagInput value={data.abilities} onChange={(v) => setData("abilities", v)} placeholder="Abilities" />
                            <TagInput value={data.personality} onChange={(v) => setData("personality", v)} placeholder="Personality" />
                        </div>

                        <div className="card">
                            <h2>Bonus</h2>

                            <input
                                type="number"
                                placeholder="EXP Boost"
                                value={data.system_bonus.exp_boost}
                                onChange={(e) =>
                                    setData("system_bonus", {
                                        ...data.system_bonus,
                                        exp_boost: e.target.value,
                                    })
                                }
                                className="input"
                            />

                            <input
                                type="number"
                                placeholder="Gold Boost"
                                value={data.system_bonus.gold_boost}
                                onChange={(e) =>
                                    setData("system_bonus", {
                                        ...data.system_bonus,
                                        gold_boost: e.target.value,
                                    })
                                }
                                className="input"
                            />

                            <TagInput value={data.cosmetic_bonus} onChange={(v) => setData("cosmetic_bonus", v)} placeholder="Cosmetic" />
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="right">

                        <div className="card center">

                            <h2>Avatar</h2>

                            <div
                                className="avatar-box"
                                onClick={() => fileRef.current?.click()}
                            >
                                <img
                                    src={preview ?? character.avatar}
                                    className="avatar"
                                />
                                <div className="overlay">Change</div>
                            </div>

                            <input
                                ref={fileRef}
                                type="file"
                                className="hidden"
                                onChange={(e) => {
                                    if (e.target.files?.[0]) {
                                        handleFile(e.target.files[0]);
                                    }
                                }}
                            />
                        </div>

                        <button className="btn" disabled={processing}>
                            {processing ? "Updating..." : "Update Character"}
                        </button>
                    </div>

                </form>

                {/* STYLE */}
                <style>{`
                    .page {
                        max-width: 1100px;
                        margin: auto;
                        padding: 24px;
                    }

                    .header {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 20px;
                    }

                    .title {
                        font-size: 24px;
                        font-weight: 700;
                        color: #c7d2fe;
                    }

                    .subtitle {
                        font-size: 13px;
                        color: #9ca3af;
                    }

                    .layout {
                        display: grid;
                        grid-template-columns: 2fr 1fr;
                        gap: 20px;
                    }

                    .card {
                        background: #0f172a;
                        border: 1px solid #1e293b;
                        padding: 18px;
                        border-radius: 14px;
                        display: flex;
                        flex-direction: column;
                        gap: 12px;
                    }

                    .center {
                        text-align: center;
                    }

                    .input {
                        background: #020617;
                        border: 1px solid #1e293b;
                        padding: 10px;
                        border-radius: 10px;
                        color: white;
                    }

                    .avatar-box {
                        position: relative;
                        width: 130px;
                        height: 130px;
                        margin: auto;
                        cursor: pointer;
                    }

                    .avatar {
                        width: 100%;
                        height: 100%;
                        border-radius: 999px;
                        object-fit: cover;
                    }

                    .overlay {
                        position: absolute;
                        inset: 0;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: rgba(0,0,0,0.5);
                        opacity: 0;
                        transition: 0.2s;
                        border-radius: 999px;
                    }

                    .avatar-box:hover .overlay {
                        opacity: 1;
                    }

                    .btn {
                        width: 100%;
                        padding: 12px;
                        border-radius: 10px;
                        background: #6366f1;
                        color: white;
                        font-weight: 600;
                    }

                    .tag-container {
                        display: flex;
                        flex-wrap: wrap;
                        gap: 6px;
                        border: 1px solid #1e293b;
                        padding: 8px;
                        border-radius: 10px;
                    }

                    .tag-chip {
                        background: #6366f1;
                        padding: 4px 10px;
                        border-radius: 999px;
                        font-size: 12px;
                    }

                    .tag-input {
                        flex: 1;
                        background: transparent;
                        outline: none;
                        color: white;
                    }
                `}</style>

            </div>
        </AppLayout>
    );
}