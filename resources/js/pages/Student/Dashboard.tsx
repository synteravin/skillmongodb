import { MessageSquareMore, MoonStar, SunMedium, Store } from "lucide-react"
import { useState, useEffect } from "react"
import SpeechBubble from "@/components/SpeechBubble"


interface Character {
  name: string
  avatar: string
}

interface User {
  name: string
  level: number
  xp: number
  character: Character
}

export default function Dashboard({ user }: { user: User }) {

  const [dark, setDark] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark")
      setDark(true)
    }
  }, [])

  const toggleTheme = () => {
    const html = document.documentElement

    if (dark) {
      html.classList.remove("dark")
      localStorage.setItem("theme", "light")
    } else {
      html.classList.add("dark")
      localStorage.setItem("theme", "dark")
    }

    setDark(!dark)
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-white dark:bg-[#020202] text-black dark:text-white transition-colors duration-500">

      <StarBackground />

      <TopBar user={user} dark={dark} toggleTheme={toggleTheme} />

      <StoreButton />

      <CharacterSection avatar={user.character.avatar} />

      <BottomNav />

    </div>
  )
}

/* =========================================================
   STAR BACKGROUND
========================================================= */

function StarBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden hidden dark:block">

      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage: `
            radial-gradient(1px 1px at 20px 30px, #6042FF, transparent),
            radial-gradient(2px 2px at 40px 70px, #93c5fd, transparent),
            radial-gradient(1.5px 1.5px at 130px 80px, #fde68a, transparent),
            radial-gradient(3px 3px at 160px 30px, #c084fc, transparent),
            radial-gradient(2px 2px at 200px 150px, #ffffff, transparent),
            radial-gradient(1px 1px at 300px 200px, #93c5fd, transparent),
            radial-gradient(2.5px 2.5px at 350px 100px, #facc15, transparent)
          `,
          backgroundSize: "600px 400px",
        }}
      />

      <div className="absolute top-[50px] left-1/2 h-[100px] w-[1600px] -translate-x-1/2 rounded-full bg-blue-500 opacity-70 blur-[180px]" />
      <div className="absolute top-[450px] left-1/2 h-[100px] w-[1600px] -translate-x-1/2 rounded-full bg-blue-500 opacity-70 blur-[180px]" />
      

    </div>
  )
}

/* =========================================================
   TOP BAR
========================================================= */

function TopBar({
  user,
  dark,
  toggleTheme,
}: {
  user: User
  dark: boolean
  toggleTheme: () => void
}) {
  return (
    <header className="relative z-20 flex items-center justify-between px-10 py-6">

      <div className="absolute top-2 left-3 flex items-center gap-5">

        <div className="relative h-[70px] w-[70px] flex-shrink-0">

          <div className="absolute inset-[10px] overflow-hidden rounded-md">
            <img src="/images/aizen.jpeg" className="h-full w-full object-cover" />
          </div>

          <img src="/images/border.png" className="absolute inset-0 h-full w-full object-contain pointer-events-none" />

        </div>

        <div className="leading-tight">
          <p style={{fontFamily:"Orbitron"}} className="text-2xl font-semibold tracking-wide">
            {user.name}
          </p>

          <p style={{fontFamily:"Orbitron"}} className="text-xl font-semibold">
            lvl {user.level}
          </p>
        </div>

      </div>

      <div className="absolute top-4 right-6 flex items-center gap-6">

        <div className="flex h-12 items-center gap-3 border-2 border-yellow-500 px-3">

          <img src="/images/gold.png" className="h-13 w-13 object-contain" />

          <span className="text-lg font-semibold">
            20897
          </span>

        </div>

        {/* MESSAGE */}
        <button
        className="
        opacity-90 transition-all duration-200
        text-blue-700 dark:text-[#8EC5FF]
        hover:text-blue-500 dark:hover:text-white
        hover:scale-110
        dark:drop-shadow-[0_0_6px_rgba(96,165,250,0.8)]
        "
        >
        <MessageSquareMore size={34} />
        </button>


        {/* DARK / LIGHT MODE */}
        <button
        onClick={toggleTheme}
        className="
        opacity-90 transition-all duration-200
        text-blue-700 dark:text-[#8EC5FF]
        hover:text-blue-500 dark:hover:text-white
        hover:scale-110
        dark:drop-shadow-[0_0_6px_rgba(96,165,250,0.8)]
        "
        >
        {dark ? <MoonStar size={38} /> : <SunMedium size={38} />}
        </button>

      </div>

    </header>
  )
}

/* =========================================================
   STORE BUTTON
========================================================= */

function StoreButton() {
  return (
    <div className="absolute left-4 top-1/2 z-20 -translate-y-1/2">

      <button className="relative flex w-24 flex-col items-center justify-center gap-2 py-6 text-sm font-semibold tracking-wider">

        <Store size={28} className="text-yellow-400" />

        <span>Store</span>

        <div className="absolute right-0 top-0 h-26 w-24 border-r-2 border-t-2 border-blue-500"></div>
        <div className="absolute bottom-0 left-0 h-26 w-24 border-b-2 border-l-2 border-yellow-400"></div>

      </button>

    </div>
  )
}

/* =========================================================
   CHARACTER SECTION
========================================================= */

function CharacterSection({ avatar }: { avatar: string }) {
  const [showBubble, setShowBubble] = useState(false);
  const [displayText, setDisplayText] = useState("");

  const fullText = `You're ready for battle!
Check out these upgrades —
they'll help you survive
and dominate the game`;

  // ⏱️ AUTO muncul tiap 1 menit
  useEffect(() => {
    const interval = setInterval(() => {
      triggerBubble();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // 🎯 trigger bubble (klik / auto)
  const triggerBubble = () => {
    setShowBubble(true);

    // auto hide setelah beberapa detik
    setTimeout(() => {
      setShowBubble(false);
    }, 8000);
  };

  // ✍️ TYPING EFFECT
  useEffect(() => {
    if (!showBubble) return;

    let i = 0;
    setDisplayText("");

    const interval = setInterval(() => {
      setDisplayText((prev) => prev + fullText.charAt(i));
      i++;

      if (i >= fullText.length) {
        clearInterval(interval);
      }
    }, 25); // speed typing

    return () => clearInterval(interval);
  }, [showBubble]);

  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      
      <div className="absolute bottom-[-120px] right-[276px] translate-x-32">

        {/* 💬 Speech Bubble */}
        {showBubble && (
          <SpeechBubble className="absolute top-14 -right-80 ml-6 animate-fadeIn">
            
            <p className="whitespace-pre-line text-sm leading-relaxed">
              {displayText}
              <span className="animate-pulse">|</span>
            </p>

          </SpeechBubble>
        )}

        {/* 🧍 Character */}
        <img
          src={avatar}
          onClick={triggerBubble}
          className="pointer-events-auto h-[720px] w-auto select-none cursor-pointer animate-breathe hover:scale-[1.02] transition"
          style={{ animation: "breathe 3s ease-in-out infinite" }}
        />
      </div>

    </div>
  );
}



/* =========================================================
   BOTTOM NAV
========================================================= */

function BottomNav() {

  const menus = [
    "MY COURSE",
    "MINI BATTLE",
    "TIER LIST",
    "CERTIFICATE",
    "FORUM",
  ]

  return (
    <nav className="absolute bottom-0 left-0 right-0 z-20">

      <div
        className="relative border-[4px]"
        style={{
          borderImage:
            "linear-gradient(to bottom,#1e3a8a 0%,#1e3a8a 40%,transparent 60%,#facc15 100%) 1",
        }}
      >

        <div className="flex bg-[#1D215D]/40">

          {menus.map((menu, index) => (
            <NavItem
              key={menu}
              label={menu}
              showDivider={index !== menus.length - 1}
            />
          ))}

        </div>

      </div>

    </nav>
  )
}

function NavItem({
  label,
  showDivider,
}: {
  label: string
  showDivider: boolean
}) {
  return (
    <button
      className="
      relative flex h-20 flex-1 items-center justify-center
      font-semibold tracking-widest
      uppercase transition hover:text-blue-200
      "
      style={{ fontFamily: "Orbitron" }}
    >

      <span className="-translate-x-5 text-2xl">
        {label}
      </span>

      {showDivider && (
        <div className="pointer-events-none absolute right-0 top-0 h-[220%] w-[2px] rotate-[32deg] bg-yellow-400 origin-top"></div>
      )}

    </button>
  )
}