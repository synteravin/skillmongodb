import { useForm, Link } from "@inertiajs/react";
import { useState, useEffect } from "react";

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        image: null as File | null,
    });

    const [preview, setPreview] = useState<string | null>(null);

    const handleImage = (file: File | null) => {
        setData("image", file);
        if (file) setPreview(URL.createObjectURL(file));
    };

    // 🔥 clean memory (optional tapi bagus)
    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#050816] to-[#0a0f2c] text-white p-6">

            <div className="max-w-xl mx-auto bg-[#0b1025] p-6 rounded-xl border border-blue-800">

                <div className="flex justify-between mb-6">
                    <h1 className="text-xl font-bold text-blue-400">
                        Create Rank
                    </h1>

                    {/* ✅ FIX */}
                    <Link href="/admin/assets/ranks">
                        ← Back
                    </Link>
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();

                        // ✅ FIX
                        post("/admin/assets/ranks", {
                            forceFormData: true,
                        });
                    }}
                    className="space-y-5"
                >

                    <input
                        type="text"
                        placeholder="Rank Name"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        className="w-full p-3 bg-[#070c20] border border-blue-800 rounded-lg"
                    />

                    {errors.name && (
                        <p className="text-red-400 text-sm">{errors.name}</p>
                    )}

                    <input
                        type="file"
                        onChange={(e) =>
                            handleImage(e.target.files?.[0] || null)
                        }
                    />

                    {errors.image && (
                        <p className="text-red-400 text-sm">{errors.image}</p>
                    )}

                    {preview && (
                        <img
                            src={preview}
                            className="w-24 h-24 object-contain mx-auto"
                        />
                    )}

                    <button
                        disabled={processing}
                        className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-lg"
                    >
                        {processing ? "Saving..." : "Save Rank"}
                    </button>

                </form>
            </div>
        </div>
    );
}