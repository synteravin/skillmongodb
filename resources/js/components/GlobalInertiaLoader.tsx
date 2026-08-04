import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import SkillVenturaLoader from './SkillVenturaLoader';

export default function GlobalInertiaLoader() {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const unbindStart = router.on('start', () => setLoading(true));
        const unbindFinish = router.on('finish', () => setLoading(false));

        return () => {
            unbindStart();
            unbindFinish();
        };
    }, []);

    if (!loading) return null;

    return (
        <SkillVenturaLoader
            text="MEMUAT HALAMAN..."
            subtext="Menyiapkan data SkillVentura..."
        />
    );
}
