import { useForm, Link } from "@inertiajs/react";
import { useState, useEffect } from "react";

type Rank = {
    id: string;
    name: string;
    image: string;
};

export default function Edit({ rank }: { rank: Rank }) {

    const { data, setData, put, processing, errors } = useForm({
        name: rank.name ?? "",
        image: null as File | null,
    });

    const [preview, setPreview] = useState<string | null>(null);

    const handleImage = (file: File | null) => {
        setData("image", file);
        if (file) setPreview(URL.createObjectURL(file));
    };

    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#050816] to-[#0a0f2c] text-white p-6">

            <div className="max-w-xl mx-auto bg-[#0b1025] p-6 rounded-xl border border-blue-800">

                {/* HEADER */}
                <div className="flex justify-between mb-6">
                    <h1 className="text-xl font-bold text-blue-400">
                        Edit Rank
                    </h1>

                    {/* ✅ FIX */}
                    <Link href="/admin/assets/ranks">
                        ← Back
                    </Link>
                </div>

                {/* DEBUG */}
                <div className="mb-4 p-3 bg-black/40 text-xs text-yellow-400 rounded">
                    ID: {rank?.id ?? "❌ no id"}
                </div>

                {/* FORM */}
                <form
                    onSubmit={(e) => {
                        e.preventDefault();

                        // ✅ FIX
                        put(`/admin/assets/ranks/${rank.id}`, {
                            forceFormData: true,
                        });
                    }}
                    className="space-y-5"
                >

                    {/* IMAGE */}
                    <img
                        src={preview ?? `/storage/${rank.image}`}
                        className="w-24 h-24 object-contain mx-auto"
                    />

                    {/* NAME */}
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        className="w-full p-3 bg-[#070c20] border border-blue-800 rounded-lg"
                    />

                    {errors.name && (
                        <p className="text-red-400 text-sm">{errors.name}</p>
                    )}

                    {/* FILE */}
                    <input
                        type="file"
                        onChange={(e) =>
                            handleImage(e.target.files?.[0] || null)
                        }
                    />

                    {errors.image && (
                        <p className="text-red-400 text-sm">{errors.image}</p>
                    )}

                    {/* BUTTON */}
                    <button
                        disabled={processing}
                        className="w-full bg-yellow-500 hover:bg-yellow-400 text-black py-3 rounded-lg"
                    >
                        {processing ? "Updating..." : "Update Rank"}
                    </button>

                </form>
            </div>
        </div>
    );
}