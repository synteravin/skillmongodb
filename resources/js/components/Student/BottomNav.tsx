import { Link } from "@inertiajs/react";
import { BookOpen, Swords, Trophy, Award, MessageSquare } from "lucide-react";

export default function BottomNav() {
  const menus = [
    { label: "MY COURSE", href: "/student/course", icon: BookOpen },
    { label: "MINI BATTLE", href: "#", icon: Swords },
    { label: "TIER LIST", href: "/student/leaderboard", icon: Trophy },
    { label: "CERTIFICATE", href: "/student/certificates", icon: Award },
    { label: "FORUM", href: "#", icon: MessageSquare },
  ];

  return (
    <>
      {/* Mobile BottomNav (< md) */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 block md:hidden">
        <div
          className="relative border-t-[2px]"
          style={{
            borderImage:
              "linear-gradient(to right, #3B28F6 0%, #4c2fff 30%, #7c3aed 50%, #facc15 100%) 1",
          }}
        >
          <div className="flex dark:bg-[#1D215D]/85 bg-blue-100/90 backdrop-blur-md">
            {menus.map((menu) => (
              <NavItemMobile
                key={menu.label}
                label={menu.label}
                href={menu.href}
                Icon={menu.icon}
              />
            ))}
          </div>
        </div>
      </nav>

      {/* Desktop BottomNav (>= md) */}
      <nav className="absolute bottom-0 left-0 right-0 z-20 hidden md:block">
        <div
          className="relative border-[2px] md:border-[3px] lg:border-[4px]"
          style={{
            borderImage:
              "linear-gradient(to bottom, #3B28F6 0%, #4c2fff 30%, #7c3aed 50%, #facc15 100%) 1",
          }}
        >
          <div className="flex dark:bg-[#1D215D]/40 bg-blue-200/40">
            {menus.map((menu, index) => (
              <NavItemDesktop
                key={menu.label}
                label={menu.label}
                href={menu.href}
                showDivider={index !== menus.length - 1}
              />
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}

function NavItemMobile({
  label,
  href,
  Icon,
}: {
  label: string;
  href?: string;
  Icon: React.ComponentType<{ className?: string }>;
}) {
  const baseClass = `
    relative flex flex-col flex-1 items-center justify-center
    h-14
    font-semibold uppercase tracking-tight
    transition dark:hover:text-gray-300 hover:text-blue-900 group
    py-1
  `;

  const content = (
    <>
      <Icon className="h-5 w-5 mb-1 text-blue-500 dark:text-sky-300 transition-colors group-hover:text-blue-700 dark:group-hover:text-sky-200" />
      <span className="text-[7.5px] sm:text-[9px] tracking-tighter text-center leading-none">
        {label}
      </span>
    </>
  );

  if (href && href !== "#") {
    return (
      <Link
        href={href}
        className={baseClass}
        style={{ fontFamily: "Orbitron" }}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      className={baseClass}
      style={{ fontFamily: "Orbitron" }}
    >
      {content}
    </button>
  );
}

function NavItemDesktop({
  label,
  href,
  showDivider,
}: {
  label: string;
  href?: string;
  showDivider: boolean;
}) {
  const baseClass = `
    relative flex flex-1 items-center justify-center
    h-12 md:h-14 lg:h-16 xl:h-18 2xl:h-20
    font-semibold uppercase tracking-wide md:tracking-widest
    text-[9px] md:text-xs lg:text-sm xl:text-base 2xl:text-lg
    transition dark:hover:text-gray-300 hover:text-blue-900
  `;

  const content = (
    <>
      <span className="translate-x-0 md:-translate-x-2 lg:-translate-x-4">
        {label}
      </span>

      {showDivider && (
        <div
          className="
            pointer-events-none absolute right-0 top-0
            h-[160%] md:h-[180%] lg:h-[200%] 2xl:h-[220%]
            w-[1px] md:w-[2px]
            rotate-[32deg] bg-yellow-400 origin-top
          "
        />
      )}
    </>
  );

  if (href && href !== "#") {
    return (
      <Link
        href={href}
        className={baseClass}
        style={{ fontFamily: "Orbitron" }}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      className={baseClass}
      style={{ fontFamily: "Orbitron" }}
    >
      {content}
    </button>
  );
}