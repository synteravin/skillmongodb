import { Link } from "@inertiajs/react";

export default function BottomNav() {
  const menus = [
    { label: "MY COURSE", href: "/student/course" },
    { label: "QUEST", href: "/student/quests" },
    { label: "TIER LIST", href: "/student/leaderboard" },
    { label: "CERTIFICATE", href: "/student/certificates" },
    { label: "FORUM", href: "/student/forum" },
  ];

  return (
    <>
      {/* Mobile BottomNav (< md) — sama persis dengan desktop */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 block md:hidden">
        <div
          className="relative border-t-[2px] border-l-[2px] border-r-[2px]"
          style={{
            borderImage:
              "linear-gradient(to bottom, #3B28F6 0%, #4c2fff 30%, #7c3aed 50%, #facc15 100%) 1",
          }}
        >
          <div className="flex dark:bg-[#1D215D]/40 bg-blue-200/40 backdrop-blur-md">
            {menus.map((menu, index) => (
              <NavItem
                key={menu.label}
                label={menu.label}
                href={menu.href}
                showDivider={index !== menus.length - 1}
                mobile
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
              <NavItem
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

function NavItem({
  label,
  href,
  showDivider,
  mobile = false,
}: {
  label: string;
  href?: string;
  showDivider: boolean;
  mobile?: boolean;
}) {
  const baseClass = mobile
    ? `
        relative flex flex-1 items-center justify-center
        h-11
        font-semibold uppercase tracking-wide
        text-[7px] xs:text-[8px] sm:text-[9px]
        transition dark:hover:text-gray-300 hover:text-blue-900
      `
    : `
        relative flex flex-1 items-center justify-center
        h-12 md:h-14 lg:h-16 xl:h-18 2xl:h-20
        font-semibold uppercase tracking-wide md:tracking-widest
        text-[9px] md:text-xs lg:text-sm xl:text-base 2xl:text-lg
        transition dark:hover:text-gray-300 hover:text-blue-900
      `;

  const content = (
    <>
<span className={mobile ? "relative text-[6px] left-[-10px] top-[0px] tracking-[0.5px] whitespace-nowrap" 
  : "translate-x-0 md:-translate-x-2 lg:-translate-x-4"}>
  {label}
</span>

      {showDivider && (
        <div
          className={
            mobile
              ? `
                  pointer-events-none absolute right-0 top-0
                  h-[160%]
                  w-[1px]
                  rotate-[32deg] bg-yellow-400 origin-top
                `
              : `
                  pointer-events-none absolute right-0 top-0
                  h-[160%] md:h-[180%] lg:h-[200%] 2xl:h-[220%]
                  w-[1px] md:w-[2px]
                  rotate-[32deg] bg-yellow-400 origin-top
                `
          }
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