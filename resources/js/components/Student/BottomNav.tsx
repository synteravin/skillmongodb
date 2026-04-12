import { Link } from "@inertiajs/react";

export default function BottomNav() {
  const menus = [
    { label: "MY COURSE", href: "/student/course" },
    { label: "MINI BATTLE", href: "#" },
    { label: "TIER LIST", href: "#" },
    { label: "CERTIFICATE", href: "#" },
    { label: "FORUM", href: "#" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[999] pointer-events-auto">
      <div
        className="relative border-[4px]"
        style={{
          borderImage:
            "linear-gradient(to bottom,#1e3a8a 0%,#1e3a8a 40%,transparent 60%,#facc15 100%) 1",
        }}
      >
        <div className="flex bg-[#1D215D]/70 backdrop-blur-md">
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
  );
}

function NavItem({
  label,
  href,
  showDivider,
}: {
  label: string;
  href?: string;
  showDivider: boolean;
}) {
  const content = (
    <>
      <span className="-translate-x-5 text-sm lg:text-lg">{label}</span>

      {showDivider && (
        <div className="pointer-events-none absolute right-0 top-0 h-[220%] w-[2px] rotate-[32deg] bg-yellow-400 origin-top"></div>
      )}
    </>
  );

  if (href && href !== "#") {
    return (
      <Link
        href={href}
        className="relative flex h-16 lg:h-20 flex-1 items-center justify-center font-semibold tracking-widest uppercase transition hover:text-blue-200"
        style={{ fontFamily: "Orbitron" }}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      className="relative flex h-16 lg:h-20 flex-1 items-center justify-center font-semibold tracking-widest uppercase transition hover:text-blue-200"
      style={{ fontFamily: "Orbitron" }}
    >
      {content}
    </button>
  );
}