import { useState } from "react";
import { Link, router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";

type Rank = {
    id: string;
    name: string;
    image: string;
};

export default function Index({ ranks }: { ranks: Rank[] }) {
    const [items, setItems] = useState(ranks);

    const handleDrag = (dragIndex: number, hoverIndex: number) => {
        const updated = [...items];
        const draggedItem = updated[dragIndex];

        updated.splice(dragIndex, 1);
        updated.splice(hoverIndex, 0, draggedItem);

        setItems(updated);
    };

    const saveOrder = () => {
        const payload = items.map((item, index) => ({
            id: item.id,
            order: index + 1,
        }));

        // ✅ FIX: pakai assets route
        router.post("/admin/assets/ranks/reorder", { ranks: payload });
    };

    const remove = (id: string) => {
        if (!confirm("Delete this rank?")) return;

        // ✅ FIX: pakai assets route
        router.delete(`/admin/assets/ranks/${id}`);
    };

    return (
        <AppLayout>
            <div className="min-h-screen bg-gradient-to-br from-[#050816] to-[#0a0f2c] text-white p-6">

                {/* HEADER */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                    <h1 className="text-2xl font-bold text-blue-400">
                        Rank Management
                    </h1>

                    <div className="flex gap-2">
                        <button
                            onClick={saveOrder}
                            className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg shadow"
                        >
                            Save Order
                        </button>

                        <Link
                            // ✅ FIX
                            href="/admin/assets/ranks/create"
                            className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg shadow"
                        >
                            + Add Rank
                        </Link>
                    </div>
                </div>

                {/* LIST */}
                <div className="space-y-4">
                    {items.map((rank, index) => (
                        <div
                            key={rank.id}
                            draggable
                            onDragStart={(e) => {
                                e.dataTransfer.setData("index", index.toString());
                                e.currentTarget.classList.add("opacity-50");
                            }}
                            onDragEnd={(e) => {
                                e.currentTarget.classList.remove("opacity-50");
                            }}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                                const dragIndex = Number(
                                    e.dataTransfer.getData("index")
                                );
                                handleDrag(dragIndex, index);
                            }}
                            className="flex items-center justify-between p-4 rounded-xl bg-[#0b1025] border border-blue-800 hover:border-blue-500 transition shadow-lg"
                        >
                            {/* LEFT */}
                            <div className="flex items-center gap-4">
                                <img
                                    src={`/storage/${rank.image}`}
                                    onError={(e) => {
                                        (e.currentTarget as HTMLImageElement).src =
                                            "/images/default-rank.png";
                                    }}
                                    className="w-14 h-14 object-contain bg-black/30 p-2 rounded-lg"
                                />

                                <div>
                                    <p className="font-semibold text-lg">
                                        {rank.name}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        Drag to reorder
                                    </p>
                                </div>
                            </div>

                            {/* RIGHT */}
                            <div className="flex gap-2">
                                <Link
                                    // ✅ FIX
                                    href={`/admin/assets/ranks/${rank.id}/edit`}
                                    className="px-3 py-1 bg-yellow-500 text-black rounded hover:bg-yellow-400 transition"
                                >
                                    Edit
                                </Link>

                                <button
                                    onClick={() => remove(rank.id)}
                                    className="px-3 py-1 bg-red-600 rounded hover:bg-red-500 transition"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </AppLayout>
    );
}