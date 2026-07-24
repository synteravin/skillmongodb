import { Link } from '@inertiajs/react';

export default function BottomNav({
    activeOnboardingTarget,
}: {
    activeOnboardingTarget?: string;
}) {
    const menus = [
        { label: 'MY COURSE', href: '/student/course', targetId: 'nav-item-my-course' },
        { label: 'QUEST', href: '/student/quests', targetId: 'nav-item-quest' },
        { label: 'TIER LIST', href: '/student/leaderboard', targetId: 'nav-item-tier-list' },
        { label: 'CERTIFICATE', href: '/student/certificates', targetId: 'nav-item-certificate' },
        { label: 'FORUM', href: '/student/forum', targetId: 'nav-item-forum' },
    ];

    const isOnboardingActive = Boolean(activeOnboardingTarget);

    // Transparent blur background friendly for both Light and Dark mode
    const bgClasses = 'bg-blue-200/50 dark:bg-[#1D215D]/50 backdrop-blur-md';

    return (
        <>
            {/* Mobile BottomNav (< md) */}
            <nav className="fixed right-0 bottom-0 left-0 z-50 block md:hidden">
                <div
                    className="relative border-t-[2px] border-r-[2px] border-l-[2px]"
                    style={{
                        borderImage:
                            'linear-gradient(to bottom, #3B28F6 0%, #4c2fff 30%, #7c3aed 50%, #facc15 100%) 1',
                    }}
                >
                    <div className={`flex ${bgClasses}`}>
                        {menus.map((menu, index) => {
                            const isCurrentActive = activeOnboardingTarget === menu.targetId;
                            return (
                                <NavItem
                                    key={menu.label}
                                    label={menu.label}
                                    href={menu.href}
                                    showDivider={index !== menus.length - 1}
                                    mobile
                                    targetId={menu.targetId}
                                    isCurrentActive={isCurrentActive}
                                    isOnboardingActive={isOnboardingActive}
                                />
                            );
                        })}
                    </div>
                </div>
            </nav>

            {/* Desktop BottomNav (>= md) */}
            <nav className="absolute right-0 bottom-0 left-0 z-50 hidden md:block">
                <div
                    className="relative border-[2px] md:border-[3px] lg:border-[4px]"
                    style={{
                        borderImage:
                            'linear-gradient(to bottom, #3B28F6 0%, #4c2fff 30%, #7c3aed 50%, #facc15 100%) 1',
                    }}
                >
                    <div className={`flex ${bgClasses}`}>
                        {menus.map((menu, index) => {
                            const isCurrentActive = activeOnboardingTarget === menu.targetId;
                            return (
                                <NavItem
                                    key={menu.label}
                                    label={menu.label}
                                    href={menu.href}
                                    showDivider={index !== menus.length - 1}
                                    targetId={menu.targetId}
                                    isCurrentActive={isCurrentActive}
                                    isOnboardingActive={isOnboardingActive}
                                />
                            );
                        })}
                    </div>
                </div>
            </nav>
        </>
    );
}

function NavItem({
    label,
    href,
    showDivider,
    mobile = false,
    targetId,
    isCurrentActive = false,
    isOnboardingActive = false,
}: {
    label: string;
    href?: string;
    showDivider: boolean;
    mobile?: boolean;
    targetId: string;
    isCurrentActive?: boolean;
    isOnboardingActive?: boolean;
}) {
    // Friendly Dark & Light Mode text lighting logic during onboarding:
    let stateStyle =
        'text-slate-900 dark:text-slate-100 transition-all duration-300 dark:hover:text-gray-300 hover:text-blue-900';

    if (isOnboardingActive) {
        if (isCurrentActive) {
            // Active menu: Deep Indigo in Light Mode, Glowing Gold Amber in Dark Mode
            stateStyle =
                'text-indigo-700 dark:text-amber-400 font-black drop-shadow-[0_0_10px_rgba(67,56,202,0.6)] dark:drop-shadow-[0_0_14px_rgba(250,204,21,1)] scale-110 opacity-100';
        } else {
            // Inactive menus: Muted slate in Light Mode, Muted gray in Dark Mode
            stateStyle = 'text-slate-700/40 dark:text-slate-400/30 opacity-35 font-medium';
        }
    }

    const baseClass = mobile
        ? `
        relative flex flex-1 items-center justify-center
        h-11
        font-semibold uppercase tracking-wide
        text-[7px] xs:text-[8px] sm:text-[9px]
        ${stateStyle}
      `
        : `
        relative flex flex-1 items-center justify-center
        h-12 md:h-14 lg:h-16 xl:h-18 2xl:h-20
        font-semibold uppercase tracking-wide md:tracking-widest
        text-[9px] md:text-xs lg:text-sm xl:text-base 2xl:text-lg
        ${stateStyle}
      `;

    const content = (
        <>
            <span
                className={
                    mobile
                        ? 'relative top-[0px] left-[-10px] text-[6px] tracking-[0.5px] whitespace-nowrap'
                        : 'translate-x-0 md:-translate-x-2 lg:-translate-x-4'
                }
            >
                {label}
            </span>

            {showDivider && (
                <div
                    className={
                        mobile
                            ? `pointer-events-none absolute top-0 right-0 h-[160%] w-[1px] origin-top rotate-[32deg] bg-indigo-300 dark:bg-yellow-400`
                            : `pointer-events-none absolute top-0 right-0 h-[160%] w-[1px] origin-top rotate-[32deg] bg-indigo-300 dark:bg-yellow-400 md:h-[180%] md:w-[2px] lg:h-[200%] 2xl:h-[220%]`
                    }
                />
            )}
        </>
    );

    const navId = `${targetId}${mobile ? '-mobile' : ''}`;

    if (href && href !== '#') {
        return (
            <Link
                id={navId}
                href={href}
                className={baseClass}
                style={{ fontFamily: 'Orbitron' }}
            >
                {content}
            </Link>
        );
    }

    return (
        <button id={navId} className={baseClass} style={{ fontFamily: 'Orbitron' }}>
            {content}
        </button>
    );
}
