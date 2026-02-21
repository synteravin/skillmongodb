import { LayoutGrid, Folder, Users, BookOpen } from 'lucide-react';
import type { NavItem } from '@/types';
import { Github } from 'lucide-react';

export type SidebarItem = {
    title: string;
    href: string;
    icon: any;
    roles: Array<'admin' | 'mentor' | 'student'>;
};

export const sidebarItems: SidebarItem[] = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
        icon: LayoutGrid,
        roles: ['admin'],
    },
    {
        title: 'Characters',
        href: '/admin/characters',
        icon: Folder,
        roles: ['admin'],
    },
    {
        title: 'Dashboard',
        href: '/mentor/dashboard',
        icon: LayoutGrid,
        roles: ['mentor'],
    },
    {
        title: 'Courses',
        href: '/mentor/courses',
        icon: BookOpen,
        roles: ['mentor'],
    },
];

export const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/your-org/skillmongo',
        icon: Github,
    },
    {
        title: 'Documentation',
        href: 'https://docs.skillmongo.com',
        icon: BookOpen,
    },
];
