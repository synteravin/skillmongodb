function MapPoint({
    top,
    left,
    label,
    color = 'bg-white',
}: {
    top: string;
    left: string;
    label: string;
    color?: string;
}) {
    return (
        <div
            className="group absolute -translate-x-1/2 -translate-y-1/2 transform cursor-pointer"
            style={{ top, left }}
        >
            <div
                className={`h-4 w-4 rounded-full ${color} animate-pulse shadow-[0_0_20px_currentColor]`}
            />
            <div className="pointer-events-none absolute top-6 left-1/2 -translate-x-1/2 rounded-md bg-black/80 px-3 py-1 text-xs font-bold whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100">
                {label}
            </div>
        </div>
    );
}

export default function GamifiedMapSection() {
    return (
        <section
            id="learn"
            className="relativ overflow-hidden bg-[#0f172a] py-24"
        >
            <div className="relative z-10 container mx-auto px-6 text-center">
                <div className="mb-16">
                    <h2 className="mb-4 text-3xl font-black text-white md:text-5xl">
                        Gamified Learning for Every Skill Level
                    </h2>
                    <p className="text-slate-400">
                        Level Up Your Skills Through VENTURA'S Gamified Learning
                        Roadmap
                    </p>
                </div>

                <div className="mb-12 flex justify-center gap-4">
                    <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
                        Interactive Lessons
                    </span>
                    <span className="rounded-full bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-blue-600/20">
                        Beginner Path
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
                        Instant Start
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
                        Real Simulations
                    </span>
                </div>

                {/* Map Visual Fallback */}
                <div className="group relative mx-auto aspect-video w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-[#1e293b] shadow-2xl">
                    {/* Map Pattern */}
                    <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover bg-center opacity-20 grayscale" />

                    {/* Grid Overlay */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />

                    {/* Map Points */}
                    <MapPoint top="30%" left="20%" label="Basis Realm" />
                    <MapPoint
                        top="50%"
                        left="50%"
                        label="Grand Line (New World)"
                        color="bg-yellow-400"
                    />
                    <MapPoint top="70%" left="80%" label="Expert Zone" />
                </div>
            </div>
        </section>
    );
}
