import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../css/app.css';
import { initializeTheme } from './hooks/use-appearance';
import '@fontsource/oxanium/400.css';
import '@fontsource/oxanium/600.css';
import '@fontsource/oxanium/700.css';

import '@fontsource/orbitron/400.css';
import '@fontsource/orbitron/600.css';
import '@fontsource/orbitron/700.css';

import GlobalInertiaLoader from '@/components/GlobalInertiaLoader';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <StrictMode>
                <App {...props} />
                <GlobalInertiaLoader />
            </StrictMode>,
        );
    },
    progress: false,
});

// This will set light / dark mode on load...
initializeTheme();
