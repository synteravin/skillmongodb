import { usePage, useForm } from "@inertiajs/react";

export default function LevelBadgePage() {
    const { badges } = usePage().props as any;

    type FormData = {
        name: string;
        order: string;
        icon: File | null;
    };

    const { data, setData, post } = useForm<FormData>({
        name: "",
        order: "",
        icon: null,
    });

    return (
        <div className="p-6">
            <h1 className="text-xl font-bold mb-4">Level Badges</h1>

            {/* FORM */}
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    post("/admin/levelbadge", {
                        forceFormData: true,
                    });
                }}
                className="mb-6 flex gap-2"
            >
                <input
                    type="text"
                    placeholder="Name"
                    onChange={(e) => setData("name", e.target.value)}
                    className="border px-2 text-black"
                />

                <input
                    type="number"
                    placeholder="Order"
                    onChange={(e) => setData("order", e.target.value)}
                    className="border px-2 text-black"
                />

                <input
                    type="file"
                    onChange={(e) =>
                        setData("icon", e.target.files?.[0] || null)
                    }
                />

                <button
                    type="submit"
                    className="bg-blue-500 text-white px-3"
                >
                    Create
                </button>
            </form>

            {/* LIST */}
            <div className="grid grid-cols-4 gap-4">
                {badges.map((badge: any, index: number) => (
                    <div
                        key={badge._id ?? index}
                        className="p-3 border rounded"
                    >
                        <img
                            src={`/storage/${badge.icon}`}
                            className="w-12 h-12 mb-2"
                        />
                        <div>{badge.name}</div>
                        <div className="text-xs text-gray-500">
                            Order: {badge.order}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}