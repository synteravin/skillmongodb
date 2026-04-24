import { MessageSquareMore, MoonStar, SunMedium, Store } from "lucide-react"
import { useState, useEffect } from "react"
import SpeechBubble from "@/components/SpeechBubble"
import BottomNav from "@/components/Student/BottomNav"

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
    <div className="relative min-h-screen overflow-hidden bg-[#fdfcfc] dark:bg-[#020202] text-black dark:text-white transition-colors duration-500">

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
   TOP BAR (RESPONSIVE)
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
    <header className="relative z-20 flex items-center justify-between px-3 py-3 md:px-6 md:py-4 lg:px-10 lg:py-6">

      {/* LEFT */}
      <div className="absolute top-2 left-2 flex items-center gap-2 md:gap-4 lg:gap-5">

        <div className="relative h-[40px] w-[40px] md:h-[60px] md:w-[60px] lg:h-[70px] lg:w-[70px] xl:h-[80px] xl:w-[80px] 2xl:h-[90px] 2xl:w-[90px]">
          <div className="absolute inset-[6px] md:inset-[8px] lg:inset-[10px] overflow-hidden rounded-md">
            <img src="/images/aizen.jpeg" className="h-full w-full object-cover" />
          </div>

          <img src="/images/border.png" className="absolute inset-0 w-full h-full object-contain" />
        </div>

        <div className="leading-tight">
          <p className="text-sm md:text-lg lg:text-2xl font-semibold" style={{ fontFamily: "Orbitron" }}>
            {user.name}
          </p>

          <p className="text-xs md:text-sm lg:text-xl font-semibold" style={{ fontFamily: "Orbitron" }}>
            lvl {user.level}
          </p>
        </div>

      </div>

      {/* RIGHT */}
      <div className="absolute top-2 right-2 flex items-center gap-2 md:gap-4 lg:gap-6">

        <div className="flex items-center gap-1 md:gap-2 lg:gap-3 border-2 border-yellow-500 px-2 md:px-3 h-8 md:h-10 lg:h-12">

          <img src="/images/gold.png"
            className="h-6 w-6 md:h-8 md:w-8 lg:h-10 lg:w-10 xl:h-12 xl:w-12 2xl:h-14 2xl:w-14 object-contain"
          />

          <span className="text-xs md:text-sm lg:text-lg font-semibold">
            100.000
          </span>

        </div>

        <button
          className="transition hover:scale-110
          p-1 md:p-2 lg:p-2.5 xl:p-3
          text-blue-700 dark:text-[#8EC5FF]
          hover:text-blue-500 dark:hover:text-white
          dark:drop-shadow-[0_0_6px_rgba(96,165,250,0.8)]"
        >
          <MessageSquareMore className="w-4 h-4 md:w-6 md:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10" />
        </button>

        <button
          onClick={toggleTheme}
          className="transition hover:scale-110
          p-1 md:p-2 lg:p-2.5 xl:p-3
          text-blue-700 dark:text-[#8EC5FF]
          hover:text-blue-500 dark:hover:text-white
          dark:drop-shadow-[0_0_6px_rgba(96,165,250,0.8)]"
        >
          {dark
            ? <MoonStar className="w-4 h-4 md:w-6 md:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10" />
            : <SunMedium className="w-4 h-4 md:w-6 md:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10" />
          }
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
    <div className="hidden md:block absolute left-2 md:left-3 lg:left-4 xl:left-6 top-1/2 -translate-y-1/2 z-20">

      <button className="relative flex flex-col items-center justify-center gap-1 md:gap-2 py-3 md:py-4 lg:py-6
      w-16 md:w-20 lg:w-24 xl:w-28 2xl:w-32 text-[10px] md:text-xs lg:text-sm xl:text-base font-semibold tracking-wider">

        <Store className="text-yellow-400 w-4 h-4 md:w-6 md:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 2xl:w-8 2xl:h-8" />

        <span>Store</span>

        <div className="absolute right-0 top-0 w-full h-16 md:h-20 lg:h-26 xl:h-28 border-r-2 border-t-2 border-blue-500"></div>
        <div className="absolute bottom-0 left-0 w-full h-16 md:h-20 lg:h-26 xl:h-28 border-b-2 border-l-2 border-yellow-400"></div>

      </button>

    </div>
  )
}

/* =========================================================
   CHARACTER SECTION
========================================================= */

function CharacterSection({ avatar }: { avatar: string }) {

  const [showBubble, setShowBubble] = useState(false)
  const [displayText, setDisplayText] = useState("")

  const fullText = `You're ready for battle!
Check out these upgrades —
they'll help you survive
and dominate the game`

  useEffect(() => {
    const interval = setInterval(() => {
      triggerBubble()
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  const triggerBubble = () => {
    setShowBubble(true)
    setTimeout(() => setShowBubble(false), 8000)
  }

  useEffect(() => {
    if (!showBubble) return

    let i = 0
    setDisplayText("")

    const interval = setInterval(() => {
      setDisplayText(prev => prev + fullText.charAt(i))
      i++

      if (i >= fullText.length) clearInterval(interval)
    }, 25)

    return () => clearInterval(interval)
  }, [showBubble])

  return (
  <div className="hidden md:block absolute inset-0 z-10">

    <div className="absolute bottom-[-60px] md:bottom-[-90px] lg:bottom-[-120px]
    right-[20px] md:right-[180px] lg:right-[220px] xl:right-[260px] 2xl:right-[370px]
    translate-x-16 md:translate-x-24 lg:translate-x-32">

      {showBubble && (
        <SpeechBubble className="absolute top-8 md:top-12 lg:top-14 -right-32 md:-right-56 lg:-right-75 animate-fadeIn">
          <p className="text-xs md:text-sm lg:text-base whitespace-pre-line leading-relaxed">
            {displayText}
            <span className="animate-pulse">|</span>
          </p>
        </SpeechBubble>
      )}

      <img
        src={avatar}
        onClick={triggerBubble}
        className="relative z-50 cursor-pointer transition hover:scale-[1.02]
        h-[320px] md:h-[420px] lg:h-[540px] xl:h-[600px] 2xl:h-[620px]"
        style={{ animation: "breathe 3s ease-in-out infinite" }}
      />

    </div>
  </div>
)
}