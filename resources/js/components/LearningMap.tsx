import MapPoint from '@/components/ui/MapPoint';

export default function LearningMap() {
    return (
        <section
            id="learn"
            className="relativ overflow-hidden bg-[#0f172a] py-24"
        >
            <div className="relative z-10 container mx-auto px-6 text-center">
                <h2 className="mb-4 text-3xl font-black text-white md:text-5xl">
                    Gamified Learning for Every Skill Level
                </h2>

                <div className="group relative mx-auto aspect-video w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-[#1e293b] shadow-2xl">
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
