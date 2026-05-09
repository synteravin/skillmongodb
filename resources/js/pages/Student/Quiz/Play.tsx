import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import ResultModal from "@/components/QuestionForm/ResultModal"
import { router } from "@inertiajs/react"
import { Flag } from "lucide-react"
 
interface FooterProps {
    current: number
    total: number
    selected: string | null
    loading: boolean
    handleBack: () => void
    next: () => void
}
 
function Footer({ current, total, selected, loading, handleBack, next }: FooterProps) {
    return (
        <div className="
            fixed bottom-4 left-0 w-full z-40
            h-[90px] lg:h-[110px]
        ">
            <div className="absolute inset-0 pointer-events-none">
 
                <div className="absolute -bottom-[2px] left-0 bg-[#3B28F6] block lg:hidden"
                    style={{ width: 210, height: 50, clipPath: "polygon(0 0, 100% 0, calc(100% - 52px) 100%, 0 100%)" }} />
                <div className="absolute -bottom-[2px] left-0 bg-[#3B28F6] hidden lg:block xl:hidden"
                    style={{ width: 320, height: 65, clipPath: "polygon(0 0, 100% 0, calc(100% - 60px) 100%, 0 100%)" }} />
                <div className="absolute -bottom-[2px] left-0 bg-[#3B28F6] hidden xl:block 2xl:hidden"
                    style={{ width: 375, height: 60, clipPath: "polygon(0 0, 100% 0, calc(100% - 56px) 100%, 0 100%)" }} />
                <div className="absolute -bottom-[2px] left-0 bg-[#3B28F6] hidden 2xl:block"
                    style={{ width: 442, height: 65, clipPath: "polygon(0 0, 100% 0, calc(100% - 68px) 100%, 0 100%)" }} />
 
                <div className="absolute -bottom-[2px] right-0 bg-[#3B28F6] block lg:hidden"
                    style={{ width: 208, height: 50, clipPath: "polygon(0 0, 100% 0, 100% 100%, 52px 100%)" }} />
                <div className="absolute -bottom-[2px] right-0 bg-[#3B28F6] hidden lg:block xl:hidden"
                    style={{ width: 320, height: 65, clipPath: "polygon(0 0, 100% 0, 100% 100%, 60px 100%)" }} />
                <div className="absolute -bottom-[2px] right-0 bg-[#3B28F6] hidden xl:block 2xl:hidden"
                    style={{ width: 370, height: 60, clipPath: "polygon(0 0, 100% 0, 100% 100%, 56px 100%)" }} />
                <div className="absolute -bottom-[2px] right-0 bg-[#3B28F6] hidden 2xl:block"
                    style={{ width: 442, height: 65, clipPath: "polygon(0 0, 100% 0, 100% 100%, 65px 100%)" }} />
 
               <div className="absolute left-[80px] md:left-[209px] lg:left-[318px] xl:left-[378px] 2xl:left-[442px] top-[44%] md:top-[46.5%] 
                lg:top-[43%] xl:top-[47%] 2xl:top-[42%] h-[5px] bg-[#FACC15] rounded-tl-lg rounded-tr-lg w-[55%] md:w-[46%] lg:w-[38%] xl:w-[41.5%] 2xl:w-[42.5%]" />
 
                <div className="absolute -bottom-2 left-0 h-[5px] bg-[#FACC15] block lg:hidden " style={{ width: 161 }} />
                <div className="absolute -bottom-2 left-0 h-[5px] bg-[#FACC15] hidden lg:block xl:hidden rounded-br-xs" style={{ width: 263 }} />
                <div className="absolute -bottom-2 left-0 h-[5px] bg-[#FACC15] hidden xl:block 2xl:hidden" style={{ width: 323 }} />
                <div className="absolute -bottom-2 left-0 h-[5px] bg-[#FACC15] hidden 2xl:block" style={{ width: 381 }} />
 
                <div className="absolute -bottom-2 right-0 h-[5px] bg-[#FACC15] block lg:hidden rounded-bl-xs" style={{ width: 159 }} />
                <div className="absolute -bottom-2 right-0 h-[5px] bg-[#FACC15] hidden lg:block xl:hidden" style={{ width: 262 }} />
                <div className="absolute -bottom-2 right-0 h-[5px] bg-[#FACC15] hidden xl:block 2xl:hidden" style={{ width: 318 }} />
                <div className="absolute -bottom-2 right-0 h-[5px] bg-[#FACC15] hidden 2xl:block" style={{ width: 381 }} />
 
                <div className="absolute -bottom-7 w-[4px] rounded-tl-sm bg-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.8)] block lg:hidden rounded-br-xs"
                    style={{ left: 212, height: 77, transform: "rotate(45deg)", transformOrigin: "top left" }} />
                <div className="absolute -bottom-8 w-[5px] rounded-tl-sm rounded-br-sm bg-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.8)] hidden lg:block xl:hidden"
                    style={{ left: 322, height: 95, transform: "rotate(43deg)", transformOrigin: "top left" }} />
                <div className="absolute -bottom-7 w-[5px] rounded-tl-sm bg-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.8)] hidden xl:block 2xl:hidden"
                    style={{ left: 380, height: 88, transform: "rotate(43deg)", transformOrigin: "top left" }} />
                <div className="absolute -bottom-8 w-[5px] rounded-tl-sm bg-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.8)] hidden 2xl:block"
                    style={{ left: 444, height: 95, transform: "rotate(45deg)", transformOrigin: "top left" }} />
 
                <div className="absolute -bottom-7 w-[4px] rounded-tr-sm bg-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.8)] block lg:hidden rounded-bl-xs"
                    style={{ right: 206, height: 77, transform: "translateX(-100%) rotate(-45deg)", transformOrigin: "top right" }} />
                <div className="absolute -bottom-8 w-[5px] rounded-tr-sm rounded-bl-sm bg-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.8)] hidden lg:block xl:hidden"
                    style={{ right: 317, height: 95, transform: "translateX(-100%) rotate(-43deg)", transformOrigin: "top right" }} />
                <div className="absolute -bottom-7 w-[5px] rounded-tr-sm bg-[#FACC15] shadow-[0_0_12px_rgba(250,204,21,0.8)] hidden xl:block 2xl:hidden"
                    style={{ right: 369, height: 88, transform: "translateX(-100%) rotate(-43deg)", transformOrigin: "top right" }} />
                <div className="absolute -bottom-8 w-[5px] rounded-tr-sm bg-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.8)] hidden 2xl:block"
                    style={{ right: 440, height: 95, transform: "translateX(-100%) rotate(-45deg)", transformOrigin: "top right" }} />
 
            </div>
 
            <div
                className="absolute"
                style={{
                    left: "50%",
                    marginLeft: "-21%",
                    top: "calc(43% + 12px)",
                    width: "42%",
                    height: 70,
                }}
            >
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleBack}
                    disabled={current === 0}
                    className="absolute top-[-1px] font-bold block lg:hidden"
                    style={{ left: -52, width: 160, height: 48, opacity: current === 0 ? 0.4 : 1, letterSpacing: "3px" }}
                >
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 260 45" preserveAspectRatio="none">
                        <path d="M73 0 H258 V45 H0 V45 L0 45 Z" fill="none" stroke="#FACC15" strokeWidth={6} vectorEffect="non-scaling-stroke" />
                    </svg>
                    <span className="relative z-10 flex items-center justify-center w-full h-full font-['orbitron'] text-white text-lg">
                        &lt;&lt; BACK
                    </span>
                </motion.button>
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleBack}
                    disabled={current === 0}
                    className="absolute top-[-4px] font-bold hidden lg:block xl:hidden"
                    style={{ left: -26, width: 172, height: 62, opacity: current === 0 ? 0.4 : 1, letterSpacing: "3px" }}
                >
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 260 45" preserveAspectRatio="none">
                        <path d="M87 0 H258 V45 H0 V45 L0 45 Z" fill="none" stroke="#FACC15" strokeWidth={6} vectorEffect="non-scaling-stroke" />
                    </svg>
                    <span className="relative z-10 flex items-center justify-center w-full h-full font-['orbitron'] text-white text-lg translate-x-[9px]">
                        &lt;&lt; BACK
                    </span>
                </motion.button>
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleBack}
                    disabled={current === 0}
                    className="absolute top-0 font-bold hidden xl:block 2xl:hidden"
                    style={{ left: -39, width: 215, height: 58, opacity: current === 0 ? 0.4 : 1, letterSpacing: "3px" }}
                >
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 260 45" preserveAspectRatio="none">
                        <path d="M63 0 H258 V45 H0 V45 L0 46 Z" fill="none" stroke="#FACC15" strokeWidth={6} vectorEffect="non-scaling-stroke" />
                    </svg>
                    <span className="relative z-10 flex items-center justify-center w-full h-full font-['orbitron'] text-white text-[26px]">
                        &lt;&lt; BACK
                    </span>
                </motion.button>
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleBack}
                    disabled={current === 0}
                    className="absolute top-[-4px] font-bold hidden 2xl:block"
                    style={{ left: -49, width: 280, height: 62, opacity: current === 0 ? 0.4 : 1, letterSpacing: "3px" }}
                >
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 260 45" preserveAspectRatio="none">
                        <path d="M55 0 H258 V45 H0 V45 L0 45 Z" fill="none" stroke="#FACC15" strokeWidth={6} vectorEffect="non-scaling-stroke" />
                    </svg>
                    <span className="relative z-10 flex items-center justify-center w-full h-full font-['orbitron'] text-white text-[32px]">
                        &lt;&lt; BACK
                    </span>
                </motion.button>
 
                <div className="absolute flex items-center justify-center font-bold text-[#FACC15] border-4 border-[#FACC15] block lg:hidden"
                    style={{ left: "54%", marginLeft: -60, top: -1, width: 100, height: 48, fontSize: 22, letterSpacing: "3px" }}>
                    {String(current + 1).padStart(2, "0")}
                    <span className="mx-2 opacity-50">/</span>
                    {String(total).padStart(2, "0")}
                </div>
                <div className="absolute flex items-center justify-center font-bold text-[#FACC15] border-4 border-[#FACC15] hidden lg:flex xl:hidden"
                    style={{ left: "49%", marginLeft: -60, top: -4, width: 130, height: 62, fontSize: 26, letterSpacing: "3px" }}>
                    {String(current + 1).padStart(2, "0")}
                    <span className="mx-2 opacity-50">/</span>
                    {String(total).padStart(2, "0")}
                </div>
                <div className="absolute flex items-center justify-center font-bold text-[#FACC15] border-3 border-[#FACC15] hidden xl:flex 2xl:hidden"
                    style={{ left: "49%", marginLeft: -78, top: 1, width: 176, height: 57, fontSize: 29, letterSpacing: "3px" }}>
                    {String(current + 1).padStart(2, "0")}
                    <span className="mx-2 opacity-50">/</span>
                    {String(total).padStart(2, "0")}
                </div>
                <div className="absolute flex items-center justify-center font-bold text-[#FACC15] border-4 border-[#FACC15] hidden 2xl:flex"
                    style={{ left: "49%", marginLeft: -70, top: -4, width: 155, height: 62, fontSize: 28, letterSpacing: "3px" }}>
                    {String(current + 1).padStart(2, "0")}
                    <span className="mx-2 opacity-50">/</span>
                    {String(total).padStart(2, "0")}
                </div>
 
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={next}
                    disabled={!selected || loading}
                    className="absolute top-[-1px] font-bold block lg:hidden"
                    style={{ right: -56, width: 160, height: 48, opacity: (!selected || loading) ? 0.4 : 1, letterSpacing: "3px" }}
                >
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 260 45" preserveAspectRatio="none">
                        <path d="M0 0 H183 L258 45 H0 Z" fill="none" stroke="#FACC15" strokeWidth={6} vectorEffect="non-scaling-stroke" />
                    </svg>
                    <span className="relative z-10 flex items-center justify-center gap-2 w-full h-full font-['orbitron'] text-white text-lg translate-x-[-16px]">
                        {loading ? "..." : current + 1 === total
                            ? <><span>FINISH</span><Flag className="w-5 h-5 text-white" strokeWidth={3} /></>
                            : "NEXT >>"}
                    </span>
                </motion.button>
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={next}
                    disabled={!selected || loading}
                    className="absolute top-[-4px] font-bold hidden lg:block xl:hidden"
                    style={{ right: -27, width: 172, height: 62, opacity: (!selected || loading) ? 0.4 : 1, letterSpacing: "3px" }}
                >
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 260 45" preserveAspectRatio="none">
                        <path d="M0 0 H172 L258 45 H0 Z" fill="none" stroke="#FACC15" strokeWidth={6} vectorEffect="non-scaling-stroke" />
                    </svg>
                    <span className="relative z-10 flex items-center justify-center gap-2 w-full h-full font-['orbitron'] text-white text-lg translate-x-[-18px]">
                        {loading ? "..." : current + 1 === total
                            ? <><span>FINISH</span><Flag className="w-4 h-4 text-white" strokeWidth={3} /></>
                            : "NEXT >>"}
                    </span>
                </motion.button>
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={next}
                    disabled={!selected || loading}
                    className="absolute top-0 font-bold hidden xl:block 2xl:hidden"
                    style={{ right: -46, width: 215, height: 58, opacity: (!selected || loading) ? 0.4 : 1, letterSpacing: "3px" }}
                >
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 260 45" preserveAspectRatio="none">
                        <path d="M0 0 H197 L258 44 H0 Z" fill="none" stroke="#FACC15" strokeWidth={6} vectorEffect="non-scaling-stroke" />
                    </svg>
                    <span className="relative z-10 flex items-center justify-center gap-2 w-full h-full font-['orbitron'] text-white text-[26px]">
                        {loading ? "..." : current + 1 === total
                            ? <><span>FINISH</span><Flag className="w-5 h-5 text-white" strokeWidth={3} /></>
                            : "NEXT >>"}
                    </span>
                </motion.button>
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={next}
                    disabled={!selected || loading}
                    className="absolute top-[-4px] font-bold hidden 2xl:block"
                    style={{ right: -49, width: 280, height: 62, opacity: (!selected || loading) ? 0.4 : 1, letterSpacing: "3px" }}
                >
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 260 45" preserveAspectRatio="none">
                        <path d="M0 0 H205 L258 45 H0 Z" fill="none" stroke="#FACC15" strokeWidth={6} vectorEffect="non-scaling-stroke" />
                    </svg>
                    <span className="relative z-10 flex items-center justify-center gap-2 w-full h-full font-['orbitron'] text-white text-[32px]">
                        {loading ? "..." : current + 1 === total
                            ? <><span>FINISH</span><Flag className="w-8 h-8 text-white" strokeWidth={3} /></>
                            : "NEXT >>"}
                    </span>
                </motion.button>
 
            </div>
        </div>
    )
}
 
function BoxSoal({ question }: { current: number; total: number; question: any }) {
    return (
        <div className="relative w-full h-full p-4 md:p-6 lg:p-8">
            <div className="w-full h-full p-[4px] bg-[#3B28F6]">
                <div className="w-full h-full p-[15px] bg-[#04080f]">
                    <div className="w-full h-full p-[4px] bg-[#3B28F6]">
                        <div className="w-full h-full p-[15px] bg-[#04080f]">
 
                            <div className="relative w-full h-full bg-[#04080f] p-9 min-h-[350px] flex flex-col border-4 border-[#3B28F6]">
 
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-[270px] h-[9px] overflow-visible z-20">
                                    <div className="relative w-full h-full flex items-center justify-center">
 
                                        <div
                                            className="absolute -top-2 left-1/2 -translate-x-1/2 w-[273px] h-[8.5px] bg-yellow-400"
                                            style={{ clipPath: "polygon(0% 0%, 100% 0%, 90% 100%, 10% 100%)" }}
                                        />
                                        <div className="absolute top-0.5 left-34 -translate-x-1/2 w-[227px] h-[5.5px] bg-[#3B28F6]" />
 
                                        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[227px] flex justify-between px-2">
                                            {Array.from({ length: 10 }).map((_, i) => (
                                                <div key={i} className="w-2 h-2 bg-yellow-400 rounded-full" />
                                            ))}
                                        </div>
 
                                        <div className="absolute right-3 mt-7 -translate-y-1/2">
                                            <div className="relative w-[32px] h-[32px]">
                                                <div className="absolute top-1/2 -left-58 w-[32px] h-[4.5px] bg-[#3B28F6] rotate-[19deg] origin-right rounded-full" />
                                                <div className="absolute top-1/2 -left-58 w-[32px] h-[4px] bg-[#3B28F6] -rotate-[19deg] origin-right rounded-full" />
                                            </div>
                                        </div>
 
                                        <div className="absolute left-3 mt-7 -translate-y-1/2">
                                            <div className="relative w-[32px] h-[32px]">
                                                <div className="absolute top-1/2 -right-58 w-[32px] h-[4.5px] bg-[#3B28F6] -rotate-[19deg] origin-left rounded-full" />
                                                <div className="absolute top-1/2 -right-58 w-[32px] h-[4px] bg-[#3B28F6] rotate-[19deg] origin-left rounded-full" />
                                            </div>
                                        </div>
 
                                    </div>
                                </div>
 
                                <div className="absolute -bottom-[35px] left-1/2 -translate-x-1/2 w-[270px] h-[9px] overflow-visible z-20">
                                    <div className="relative w-full h-full flex items-center justify-center">
 
                                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-[227px] flex justify-between px-2">
                                            {Array.from({ length: 10 }).map((_, i) => (
                                                <div key={i} className="w-2 h-2 bg-yellow-400 rounded-full" />
                                            ))}
                                        </div>
 
                                        <div className="absolute top-0.5 left-1/2 -translate-x-1/2 w-[227px] h-[5.5px] bg-[#3B28F6]" />
 
                                        <div
                                            className="absolute top-2 left-1/2 -translate-x-1/2 w-[264px] h-[9px] bg-yellow-400"
                                            style={{ clipPath: "polygon(8% 0%, 92% 0%, 100% 100%, 0% 100%)" }}
                                        />
 
                                        <div className="absolute right-3 mt-7 -translate-y-1/2">
                                            <div className="relative w-[32px] h-[32px]">
                                                <div className="absolute top-1/2 -left-58 w-[32px] h-[4.5px] bg-[#3B28F6] rotate-[19deg] origin-right rounded-full" />
                                                <div className="absolute top-1/2 -left-58 w-[32px] h-[4px] bg-[#3B28F6] -rotate-[19deg] origin-right rounded-full" />
                                            </div>
                                        </div>
 
                                        <div className="absolute left-3 mt-7 -translate-y-1/2">
                                            <div className="relative w-[32px] h-[32px]">
                                                <div className="absolute top-1/2 -right-58 w-[32px] h-[4.5px] bg-[#3B28F6] -rotate-[19deg] origin-left rounded-full" />
                                                <div className="absolute top-1/2 -right-58 w-[32px] h-[4px] bg-[#3B28F6] rotate-[19deg] origin-left rounded-full" />
                                            </div>
                                        </div>
 
                                    </div>
                                </div>
 
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-[270px] h-[8px] bg-[#04080f] z-10" />
                                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-[270px] h-[9px] bg-[#04080f] z-10" />
                                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[270px] h-[8px] bg-[#04080f] z-10" />
                                <div className="absolute -bottom-11 left-1/2 -translate-x-1/2 w-[270px] h-[8px] bg-[#04080f] z-10" />
 
                                <div className="flex flex-col flex-1 gap-4 min-h-0 w-full">
 
                                    {question.media_url && (
                                        <div className="w-full flex-shrink-0 h-[120px] md:h-[150px] lg:h-[180px] -mt-4 flex items-center justify-center">
                                            <img
                                                src={question.media_url}
                                                alt="Soal"
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                    )}
 
                                    <div className="
                                        flex-1 overflow-y-auto min-h-0 w-full max-w-[700px] mx-auto text-white font-semibold px-2 md:px-4
                                        text-sm sm:text-base md:text-xs lg:text-xs xl:text-sm 2xl:text-lg
                                        leading-normal
                                        [scrollbar-width:thin] [scrollbar-color:#3B28F6_#0d0d1a]
                                        [&::-webkit-scrollbar]:w-[6px]
                                        [&::-webkit-scrollbar-track]:bg-[#0d0d1a]
                                        [&::-webkit-scrollbar-track]:rounded-full
                                        [&::-webkit-scrollbar-thumb]:bg-[#3B28F6]
                                        [&::-webkit-scrollbar-thumb]:rounded-full
                                        [&::-webkit-scrollbar-thumb:hover]:bg-[#5a46ff]
                                    ">
                                        {question.question_text}
                                    </div>
 
                                </div>
                            </div>
 
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
 
function AnswerButton({ label, text, selected, onClick }: any) {
    const outerClip = "polygon(0 0, 30px 0, 45px 15px, 120px 15px, 135px 0, 100% 0, 100% 100%, 0 100%)"
    const innerClip = "polygon(0 0, 31px 0, 46px 14px, 119px 14px, 134px 0, 100% 0, 100% 100%, 0 100%)"
 
    return (
        <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className="w-full text-left relative group mb-6 outline-none block mt-7"
        >
            <div className="relative">
 
                <div className="absolute -top-[14px] w-[173px] h-[12px] z-[1]">
                    <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 100 8" preserveAspectRatio="none">
                        <path d="M10 0 L90 0 L100 8 L0 8 Z" fill="none" stroke="#3B82F6" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                    </svg>
                </div>
 
                <div className="absolute -top-[3px] left-[34.5px] w-[97px] h-[2px] bg-[#04080f] z-[3] rounded-bl-sm rounded-br-md" />
 
                <div className="absolute -top-1 left-[34px] w-[98px] h-[16px] z-[2]">
                    <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 100 16" preserveAspectRatio="none">
                        <path d="M0 2 L13 15 L87 15 L100 2" fill="none" stroke="#3B82F6" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
                    </svg>
                </div>
 
            </div>
 
            <div
                className={`p-[2px] transition-colors duration-300 ${selected ? "bg-[#FACC15]" : "bg-[#3B28F6] group-hover:bg-[#00e5ff]"}`}
                style={{ clipPath: outerClip }}
            >
                <div
                    className={`w-full h-full transition-colors duration-300 pt-4 ${selected ? "bg-[#1a1505]" : "bg-[#0a0f1d]"}`}
                    style={{ clipPath: innerClip }}
                >
                    <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                        style={{ background: "linear-gradient(90deg, rgba(59,40,246,0.2) 0%, transparent 100%)" }}
                    />
 
                    <div className="px-2 py-2 flex gap-4 relative z-10 items-start">
                        <span className={`font-mono font-bold text-lg mt-0.5 ${selected ? "text-[#FACC15]" : "text-[#3B28F6] group-hover:text-[#00e5ff]"}`}>
                            {label}.
                        </span>
                        <span className={`text-base leading-relaxed ${selected ? "text-white" : "text-gray-300 group-hover:text-white"}`}>
                            {text}
                        </span>
                    </div>
                </div>
            </div>
        </motion.button>
    )
}
 
export default function Play({ quiz, has_submitted }: any) {
    const [current, setCurrent]         = useState(0)
    const [answers, setAnswers]         = useState<any[]>([])
    const [selected, setSelected]       = useState<string | null>(null)
    const [loading, setLoading]         = useState(false)
    const [showResult, setShowResult]   = useState(false)
    const [finalResult, setFinalResult] = useState<any>(null)
 
    if (!quiz?.questions?.length) return null
 
    const question = quiz.questions[current]
    const total    = quiz.questions.length
    const labels   = ["A", "B", "C", "D", "E"]
 
    const selectAnswer = (id: string) => { if (!loading) setSelected(id) }
 
    const handleBack = () => {
        if (current > 0) {
            setCurrent(current - 1)
            const prev = answers.find(a => a.question_id === quiz.questions[current - 1].id)
            setSelected(prev?.answer_id ?? null)
        }
    }
 
    const next = () => {
        if (!selected) return
        const updated = [
            ...answers.filter(a => a.question_id !== question.id),
            { question_id: question.id, answer_id: selected },
        ]
        setAnswers(updated)
        setSelected(null)
        if (current + 1 < total) {
            setCurrent(current + 1)
        } else {
            submit(updated)
        }
    }
 
    const submit = async (finalAnswers: any[]) => {
        setLoading(true)
        try {
            const csrf      = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content")
            const formatted = Object.fromEntries(finalAnswers.map(a => [a.question_id, a.answer_id]))
            const res = await fetch(`/student/quiz/${quiz.id}/submit`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": csrf || "",
                    Accept: "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ answers: formatted }),
            })
            const data = await res.json()
            if (!res.ok) { alert(data.message || "Submit gagal"); return }
            setFinalResult(data.result)
            setShowResult(true)
        } catch {
            alert("Submit gagal")
        } finally {
            setLoading(false)
        }
    }
 
    if (has_submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#04080f] font-['Rajdhani',sans-serif]">
                <div
                    className="p-10 border-2 border-[#3B28F6] text-center relative"
                    style={{ clipPath: "polygon(30px 0, 100% 0, 100% calc(100% - 30px), calc(100% - 30px) 100%, 0 100%, 0 30px)" }}
                >
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-[3px] border-l-[3px] border-[#FACC15] z-20" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-[3px] border-r-[3px] border-[#FACC15] z-20" />
                    <h1 className="text-3xl font-bold mb-4 text-[#FACC15] tracking-[4px]">MISSION COMPLETED</h1>
                    <p className="text-gray-300 mb-8 text-lg">Kamu sudah menyelesaikan quiz ini.</p>
                    <button
                        onClick={() => router.visit(`/student/courses/${quiz.course_slug}`)}
                        className="px-8 py-3 font-bold text-black bg-[#FACC15] hover:bg-yellow-300 transition-colors"
                        style={{ clipPath: "polygon(15px 0, 100% 0, calc(100% - 15px) 100%, 0 100%)", letterSpacing: 2 }}
                    >
                        KEMBALI KE COURSE
                    </button>
                </div>
            </div>
        )
    }
 
    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Share+Tech+Mono&display=swap');
                html, body {
                    overflow: hidden !important;
                    height: 100vh !important;
                    background: #04080f;
                    -ms-overflow-style: none;
                }
                html::-webkit-scrollbar,
                body::-webkit-scrollbar { display: none; }
            `}</style>
 
            <div className="h-screen overflow-hidden flex flex-col bg-[#04080f] font-['Rajdhani',sans-serif]">
 
                <div className="flex-1 overflow-hidden
                    flex flex-col md:flex-row
                    gap-4
                    w-full max-w-[1500px] mx-auto
                    px-4 pt-4
                    pb-[100px]">
 
                    <div className="w-full md:w-[58%] h-[52%] md:h-full shrink-0">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={question.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                                className="w-full h-full"
                            >
                                <BoxSoal current={current} total={total} question={question} />
                            </motion.div>
                        </AnimatePresence>
                    </div>
 
                    <div className="w-full md:w-[42%] flex-1 md:flex-none
                        flex flex-col justify-center
                        overflow-y-auto
                        [scrollbar-width:none]
                        [&::-webkit-scrollbar]:hidden">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={question.id + "-answers"}
                                initial={{ opacity: 0, x: 40 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -40 }}
                                transition={{ duration: 0.3 }}
                                className="w-full"
                            >
                                {question.answers.map((a: any, idx: number) => (
                                    <AnswerButton
                                        key={a.id}
                                        label={labels[idx] ?? String(idx + 1)}
                                        text={a.answer_text}
                                        selected={selected === a.id}
                                        onClick={() => selectAnswer(a.id)}
                                    />
                                ))}
                            </motion.div>
                        </AnimatePresence>
                    </div>
 
                </div>
 
                <Footer
                    current={current}
                    total={total}
                    selected={selected}
                    loading={loading}
                    handleBack={handleBack}
                    next={next}
                />
 
            </div>
 
            <ResultModal
                open={showResult}
                result={finalResult}
                onClose={() => router.visit(`/student/courses/${quiz.course_slug}`)}
            />
        </>
    )
}