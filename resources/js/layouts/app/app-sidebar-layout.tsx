import { useState } from 'react';
import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import Sidebar from '@/components/sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import type { AppLayoutProps } from '@/types';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    const [isOpen, setSidebarOpen] = useState(true);

    return (
        <AppShell variant="sidebar">
            <Sidebar isOpen={isOpen} setSidebarOpen={setSidebarOpen} />
            <AppContent
                variant="sidebar"
                className="min-h-screen overflow-x-hidden"
            >
                {/* <AppSidebarHeader breadcrumbs={breadcrumbs} /> */}
                {children}
            </AppContent>
        </AppShell>
    );
}
