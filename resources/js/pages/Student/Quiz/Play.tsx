import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import ResultModal from "@/components/QuestionForm/ResultModal"
import { router } from "@inertiajs/react"
import { Flag } from "lucide-react"
import "./quizLandscape.css"

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
        <div className="quiz-footer fixed bottom-4 max-[767px]:bottom-[5px] left-0 w-full z-40 h-[90px] max-[767px]:h-[62px] lg:h-[110px]">
            <div className="absolute inset-0 pointer-events-none">

                {/* ── DIAGONAL KIRI ── */}
                <div className="absolute -bottom-[2px] left-0 bg-[#3B28F6] block md:hidden footer-diag-left w-[81px] min-[390px]:max-[767px]:w-[95px] 
                min-[500px]:max-[767px]:w-[130px] min-[620px]:max-[767px]:w-[172px] min-[700px]:max-[767px]:w-[199px] h-[30px] [clip-path:polygon(0_0,100%_0,calc(100%_-_30px)_100%,0_100%)]" />
                <div className="absolute -bottom-[2px] left-0 bg-[#3B28F6] hidden md:block lg:hidden footer-diag-left"
                    style={{ width: 210, height: 50, clipPath: "polygon(0 0, 100% 0, calc(100% - 52px) 100%, 0 100%)" }} />
                <div className="absolute -bottom-[2px] left-0 bg-[#3B28F6] hidden lg:block xl:hidden"
                    style={{ width: 320, height: 65, clipPath: "polygon(0 0, 100% 0, calc(100% - 60px) 100%, 0 100%)" }} />
                <div className="absolute -bottom-[2px] left-0 bg-[#3B28F6] hidden xl:block 2xl:hidden"
                    style={{ width: 375, height: 60, clipPath: "polygon(0 0, 100% 0, calc(100% - 56px) 100%, 0 100%)" }} />
                <div className="absolute -bottom-[2px] left-0 bg-[#3B28F6] hidden 2xl:block"
                    style={{ width: 442, height: 65, clipPath: "polygon(0 0, 100% 0, calc(100% - 68px) 100%, 0 100%)" }} />

                {/* ── DIAGONAL KANAN ── */}
                <div className="absolute -bottom-[2px] right-0 bg-[#3B28F6] block md:hidden footer-diag-right w-[83px] min-[390px]:max-[767px]:w-[98px] 
                min-[500px]:max-[767px]:w-[133px] min-[620px]:max-[767px]:w-[172px] min-[700px]:max-[767px]:w-[199px] h-[30px] [clip-path:polygon(0_0,100%_0,100%_100%,30px_100%)]" />
                <div className="absolute -bottom-[2px] right-0 bg-[#3B28F6] hidden md:block lg:hidden footer-diag-right"
                    style={{ width: 208, height: 50, clipPath: "polygon(0 0, 100% 0, 100% 100%, 52px 100%)" }} />
                <div className="absolute -bottom-[2px] right-0 bg-[#3B28F6] hidden lg:block xl:hidden"
                    style={{ width: 320, height: 65, clipPath: "polygon(0 0, 100% 0, 100% 100%, 60px 100%)" }} />
                <div className="absolute -bottom-[2px] right-0 bg-[#3B28F6] hidden xl:block 2xl:hidden"
                    style={{ width: 370, height: 60, clipPath: "polygon(0 0, 100% 0, 100% 100%, 56px 100%)" }} />
                <div className="absolute -bottom-[2px] right-0 bg-[#3B28F6] hidden 2xl:block"
                    style={{ width: 442, height: 65, clipPath: "polygon(0 0, 100% 0, 100% 100%, 65px 100%)" }} />

                {/* ── GARIS KUNING TENGAH ATAS — MOBILE TANPA CLAMP ── */}
                <div
                    className="
                        absolute h-[3px] md:h-[5px] bg-[#FACC15] rounded-tl-lg rounded-tr-lg footer-bar-top

                        left-[81px] right-[83px]
                        min-[390px]:max-[767px]:left-[94px] min-[390px]:max-[767px]:right-[97px]
                        min-[500px]:max-[767px]:left-[130px] min-[500px]:max-[767px]:right-[133px]
                        min-[620px]:max-[767px]:left-[173px] min-[620px]:max-[767px]:right-[172px]
                        min-[700px]:max-[767px]:left-[199px] min-[700px]:max-[767px]:right-[199px]

                        md:left-[209px] lg:left-[318px] xl:left-[378px] 2xl:left-[442px]
                        md:right-[209px] lg:right-[317px] xl:right-[369px] 2xl:right-[440px]

                        top-[55%] md:top-[46.5%] lg:top-[43%] xl:top-[47%] 2xl:top-[42%]
                    "
                />

                {/* ── GARIS KUNING BAWAH KIRI ── */}
                <div className="absolute -bottom-1 left-0 h-[3px] bg-[#FACC15] block md:hidden footer-bar-bottom-left w-[54px] min-[390px]:max-[767px]:w-[68px] 
                min-[500px]:max-[767px]:w-[104px] min-[620px]:max-[767px]:w-[147px] min-[700px]:max-[767px]:w-[173px]" />
                <div className="absolute -bottom-2 left-0 h-[5px] bg-[#FACC15] hidden md:block lg:hidden footer-bar-bottom-left" style={{ width: 161 }} />
                <div className="absolute -bottom-2 left-0 h-[5px] bg-[#FACC15] hidden lg:block xl:hidden rounded-br-xs" style={{ width: 263 }} />
                <div className="absolute -bottom-2 left-0 h-[5px] bg-[#FACC15] hidden xl:block 2xl:hidden" style={{ width: 323 }} />
                <div className="absolute -bottom-2 left-0 h-[5px] bg-[#FACC15] hidden 2xl:block" style={{ width: 381 }} />

                {/* ── GARIS KUNING BAWAH KANAN ── */}
                <div className="absolute -bottom-1 right-0 h-[3px] bg-[#FACC15] block md:hidden rounded-bl-xs footer-bar-bottom-right w-[58px] min-[390px]:max-[767px]:w-[72px] 
                min-[500px]:max-[767px]:w-[109px] min-[620px]:max-[767px]:w-[147px] min-[700px]:max-[767px]:w-[174px]" />
                <div className="absolute -bottom-2 right-0 h-[5px] bg-[#FACC15] hidden md:block lg:hidden rounded-bl-xs footer-bar-bottom-right" style={{ width: 159 }} />
                <div className="absolute -bottom-2 right-0 h-[5px] bg-[#FACC15] hidden lg:block xl:hidden" style={{ width: 262 }} />
                <div className="absolute -bottom-2 right-0 h-[5px] bg-[#FACC15] hidden xl:block 2xl:hidden" style={{ width: 318 }} />
                <div className="absolute -bottom-2 right-0 h-[5px] bg-[#FACC15] hidden 2xl:block" style={{ width: 381 }} />

                {/* ── GARIS DIAGONAL KUNING KIRI ── */}
                <div className="absolute -bottom-[14px] left-[82px] min-[390px]:max-[767px]:left-[96px] min-[500px]:max-[767px]:left-[132px] min-[620px]:max-[767px]:left-[174px] 
                min-[700px]:max-[767px]:left-[201px] w-[3px] h-[42px] rotate-45 origin-top-left rounded-tl-sm bg-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.8)] block md:hidden rounded-br-xs footer-slash-left" />
                <div className="absolute -bottom-7 w-[4px] rounded-tl-sm bg-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.8)] hidden md:block lg:hidden rounded-br-xs footer-slash-left"
                    style={{ left: 212, height: 77, transform: "rotate(45deg)", transformOrigin: "top left" }} />
                <div className="absolute -bottom-8 w-[5px] rounded-tl-sm rounded-br-sm bg-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.8)] hidden lg:block xl:hidden"
                    style={{ left: 322, height: 95, transform: "rotate(43deg)", transformOrigin: "top left" }} />
                <div className="absolute -bottom-7 w-[5px] rounded-tl-sm bg-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.8)] hidden xl:block 2xl:hidden"
                    style={{ left: 380, height: 88, transform: "rotate(43deg)", transformOrigin: "top left" }} />
                <div className="absolute -bottom-8 w-[5px] rounded-tl-sm bg-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.8)] hidden 2xl:block"
                    style={{ left: 444, height: 95, transform: "rotate(45deg)", transformOrigin: "top left" }} />

                {/* ── GARIS DIAGONAL KUNING KANAN ── */}
                <div className="absolute -bottom-[14px] right-[82px] min-[390px]:max-[767px]:right-[96px] min-[500px]:max-[767px]:right-[132px] min-[620px]:max-[767px]:right-[171px] 
                min-[700px]:max-[767px]:right-[198px] w-[3px] h-[42px] -translate-x-full -rotate-45 origin-top-right rounded-tr-sm bg-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.8)] block md:hidden rounded-bl-xs footer-slash-right" />
                <div className="absolute -bottom-7 w-[4px] rounded-tr-sm bg-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.8)] hidden md:block lg:hidden rounded-bl-xs footer-slash-right"
                    style={{ right: 206, height: 77, transform: "translateX(-100%) rotate(-45deg)", transformOrigin: "top right" }} />
                <div className="absolute -bottom-8 w-[5px] rounded-tr-sm rounded-bl-sm bg-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.8)] hidden lg:block xl:hidden"
                    style={{ right: 317, height: 95, transform: "translateX(-100%) rotate(-43deg)", transformOrigin: "top right" }} />
                <div className="absolute -bottom-7 w-[5px] rounded-tr-sm bg-[#FACC15] shadow-[0_0_12px_rgba(250,204,21,0.8)] hidden xl:block 2xl:hidden"
                    style={{ right: 369, height: 88, transform: "translateX(-100%) rotate(-43deg)", transformOrigin: "top right" }} />
                <div className="absolute -bottom-8 w-[5px] rounded-tr-sm bg-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.8)] hidden 2xl:block"
                    style={{ right: 440, height: 95, transform: "translateX(-100%) rotate(-45deg)", transformOrigin: "top right" }} />

            </div>

            {/* ── WRAPPER TOMBOL (MOBILE ONLY) ── */}
            <div className="absolute footer-btn-wrapper block md:hidden left-1/2 -translate-x-1/2 top-[calc(41%+2px)] w-[230px] min-[390px]:max-[767px]:w-[250px] min-[500px]:max-[767px]:w-[270px] min-[620px]:max-[767px]:w-[288px] min-[700px]:max-[767px]:w-[300px] h-[38px]">

                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleBack}
                    disabled={current === 0}
                    className={`absolute top-[12px] min-[390px]:max-[767px]:top-[12px] min-[500px]:max-[767px]:top-[12px] min-[620px]:max-[767px]:top-[12px] min-[700px]:max-[767px]:top-[12px] 
                                left-4 min-[390px]:max-[767px]:left-[3px] min-[500px]:max-[767px]:left-[-4px] min-[620px]:max-[767px]:left-[-13px] min-[700px]:max-[767px]:left-[-21px] 
                                w-[66px] min-[390px]:max-[767px]:w-[84px] min-[500px]:max-[767px]:w-[97px] min-[620px]:max-[767px]:w-[114px] min-[700px]:max-[767px]:w-[118px]
                                h-[26px] min-[390px]:max-[767px]:h-[26px] min-[500px]:max-[767px]:h-[27px] min-[620px]:max-[767px]:h-[26px] min-[700px]:max-[767px]:h-[27px] 
                                font-bold footer-btn-back ${current === 0 ? "opacity-40" : "opacity-100"}`}
                >
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 260 45" preserveAspectRatio="none">
                        <path
                            d="M108 0 H258 V45 H0 V45 L0 45 Z"
                            className="[d:path('M108_0_H258_V45_H0_V45_L0_45_Z')]
                            min-[390px]:max-[767px]:[d:path('M83_0_H258_V45_H0_V45_L0_45_Z')]
                            min-[500px]:max-[767px]:[d:path('M72_0_H258_V45_H0_V45_L0_45_Z')]
                            min-[620px]:max-[767px]:[d:path('M63_0_H258_V45_H0_V45_L0_45_Z')]
                            min-[700px]:max-[767px]:[d:path('M60_0_H258_V45_H0_V45_L0_45_Z')]"
                            fill="none"
                            stroke="#FACC15"
                            strokeWidth={3}
                            vectorEffect="non-scaling-stroke"
                        />
                    </svg>
                    <span className="relative z-10 flex items-center justify-center w-full h-full font-['orbitron']
                    text-white text-[7px]
                    min-[390px]:max-[767px]:text-[10px] min-[500px]:max-[767px]:text-[10px]
                    min-[620px]:max-[767px]:text-[11px] min-[700px]:max-[767px]:text-[12px]
                    tracking-[1px]
                    translate-x-[6px] min-[390px]:max-[767px]:translate-x-[7px]
                    min-[500px]:max-[767px]:translate-x-[4px]
                    min-[620px]:max-[767px]:translate-x-[6px]
                    min-[700px]:max-[767px]:translate-x-[8px]
                    footer-btn-back-text">
                        &lt;&lt; BACK
                    </span>
                </motion.button>

             <div className="absolute
                left-[37%] min-[390px]:max-[767px]:left-[37%] min-[500px]:max-[767px]:left-[37%] min-[620px]:max-[767px]:left-[38%] min-[700px]:max-[767px]:left-[34%]
                -top-translate-x-1/2
                top-[12px] min-[390px]:max-[767px]:top-[12px] min-[500px]:max-[767px]:top-[12px] min-[620px]:max-[767px]:top-[12px] min-[700px]:max-[767px]:top-[12px]
                w-[58px] min-[390px]:max-[767px]:w-[64px] min-[500px]:max-[767px]:w-[70px] min-[620px]:max-[767px]:w-[70px] min-[700px]:max-[767px]:w-[95px]
                h-[24px] min-[390px]:max-[767px]:h-[26px] min-[500px]:max-[767px]:h-[28px] min-[620px]:max-[767px]:h-[28px] min-[700px]:max-[767px]:h-[28px]
                flex items-center justify-center font-bold text-[#FACC15] border-[3px] border-[#FACC15]
                text-[13px] min-[390px]:max-[767px]:text-[14px] min-[620px]:max-[767px]:text-[15px] min-[700px]:max-[767px]:text-[16px]
                tracking-[1px] footer-counter">
                    {String(current + 1).padStart(2, "0")}
                    <span className="mx-1 opacity-50">/</span>
                    {String(total).padStart(2, "0")}
                </div>

               <motion.button
                 whileTap={{ scale: 0.95 }}
                    onClick={next}
                    disabled={!selected || loading}
                    className={`absolute top-[12px] min-[390px]:max-[767px]:top-[12px] min-[500px]:max-[767px]:top-[12px] min-[620px]:max-[767px]:top-[12px] min-[700px]:max-[767px]:top-[12px]
                                right-4 min-[390px]:max-[767px]:right-[4px] min-[500px]:max-[767px]:right-[-4px] min-[620px]:max-[767px]:right-[-15px] min-[700px]:max-[767px]:right-[-21px]
                                w-[68px] min-[390px]:max-[767px]:w-[85px] min-[500px]:max-[767px]:w-[98px] min-[620px]:max-[767px]:w-[116px] min-[700px]:max-[767px]:w-[118px]
                                h-[26px] min-[390px]:max-[767px]:h-[26px] min-[500px]:max-[767px]:h-[28px] min-[620px]:max-[767px]:h-[28px] min-[700px]:max-[767px]:h-[28px]
                                font-bold footer-btn-next ${(!selected || loading) ? "opacity-40" : "opacity-100"}`}
                >
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 260 45" preserveAspectRatio="none">
                        <path
                            d="M0 0 H150 L258 45 H0 Z"
                            className="[d:path('M0_0_H150_L258_45_H0_Z')]
                            min-[390px]:max-[767px]:[d:path('M0_0_H170_L251_45_H0_Z')]
                            min-[500px]:max-[767px]:[d:path('M0_0_H182_L258_45_H0_Z')]
                            min-[620px]:max-[767px]:[d:path('M0_0_H194_L258_45_H0_Z')]
                            min-[700px]:max-[767px]:[d:path('M0_0_H205_L258_45_H0_Z')]"
                            fill="none"
                            stroke="#FACC15"
                            strokeWidth={3}
                            vectorEffect="non-scaling-stroke"
                        />
                    </svg>
                    <span className="relative z-10 flex items-center justify-center gap-1 w-full h-full font-['orbitron']
                    text-white text-[7px]
                    min-[390px]:max-[767px]:text-[10px] min-[500px]:max-[767px]:text-[10px]
                    min-[620px]:max-[767px]:text-[11px] min-[700px]:max-[767px]:text-[12px]
                    tracking-[1px]
                    translate-x-[-6px] min-[390px]:max-[767px]:translate-x-[-7px]
                    min-[500px]:max-[767px]:translate-x-[-6px]
                    min-[620px]:max-[767px]:translate-x-[-6px]
                    min-[700px]:max-[767px]:translate-x-[-8px]
                    footer-btn-next-text">
                        {loading ? "..." : current + 1 === total
                            ? <><span>FINISH</span><Flag className="w-3.5 h-3.5 text-white" strokeWidth={3} /></>
                            : "NEXT >>"}
                    </span>
                </motion.button>
            </div>

            {/* ── WRAPPER TOMBOL (MD KE ATAS) ── */}
            <div
                className="absolute footer-btn-wrapper hidden md:block"
                style={{
                    left: "50%",
                    transform: "translateX(-50%)",
                    top: "calc(43% + 12px)",
                    width: "clamp(320px, 42vw, 760px)",
                    height: 70,
                }}
            >
                {/* BACK — md */}
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleBack}
                    disabled={current === 0}
                    className="absolute top-[-1px] font-bold block lg:hidden footer-btn-back"
                    style={{ left: -52, width: 160, height: 48, opacity: current === 0 ? 0.4 : 1, letterSpacing: "3px" }}
                >
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 260 45" preserveAspectRatio="none">
                        <path d="M73 0 H258 V45 H0 V45 L0 45 Z" fill="none" stroke="#FACC15" strokeWidth={6} vectorEffect="non-scaling-stroke" />
                    </svg>
                    <span className="relative z-10 flex items-center justify-center w-full h-full font-['orbitron'] text-white text-lg footer-btn-back-text">
                        &lt;&lt; BACK
                    </span>
                </motion.button>

                {/* BACK — lg */}
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

                {/* BACK — xl */}
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

                {/* BACK — 2xl */}
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

                {/* NOMOR */}
                <div className="absolute flex items-center justify-center font-bold text-[#FACC15] border-4 border-[#FACC15] block lg:hidden footer-counter"
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

                {/* NEXT — md */}
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={next}
                    disabled={!selected || loading}
                    className="absolute top-[-1px] font-bold block lg:hidden footer-btn-next"
                    style={{ right: -56, width: 160, height: 48, opacity: (!selected || loading) ? 0.4 : 1, letterSpacing: "3px" }}
                >
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 260 45" preserveAspectRatio="none">
                        <path d="M0 0 H183 L258 45 H0 Z" fill="none" stroke="#FACC15" strokeWidth={6} vectorEffect="non-scaling-stroke" />
                    </svg>
                    <span className="relative z-10 flex items-center justify-center gap-2 w-full h-full font-['orbitron'] text-white text-lg translate-x-[-16px] footer-btn-next-text">
                        {loading ? "..." : current + 1 === total
                            ? <><span>FINISH</span><Flag className="w-5 h-5 text-white" strokeWidth={3} /></>
                            : "NEXT >>"}
                    </span>
                </motion.button>

                {/* NEXT — lg */}
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

                {/* NEXT — xl */}
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

                {/* NEXT — 2xl */}
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
        <div className="quiz-question-inner relative w-full h-full p-[2px] md:p-6 lg:p-8">
            <div className="w-full h-full p-[3px] md:p-[4px] bg-[#3B28F6]">
                <div className="w-full h-full p-[7px] md:p-[15px] bg-[#04080f]">
                    <div className="w-full h-full p-[2px] md:p-[4px] bg-[#3B28F6]">
                        <div className="w-full h-full p-[6px] md:p-[15px] bg-[#04080f]">
                            <div className="relative w-full h-full bg-[#04080f] px-[10px] py-[12px] md:p-9 min-h-0 md:min-h-[350px] flex flex-col border-2 md:border-4 border-[#3B28F6] overflow-visible quiz-box-soal">

                                <div className="absolute top-[-8px] min-[390px]:max-[767px]:top-[-8px] min-[500px]:max-[767px]:top-[-8px] min-[620px]:max-[767px]:top-[-8px] min-[700px]:max-[767px]:top-[-8px] md:-top-4 left-1/2 -translate-x-1/2 w-[210px] md:w-[270px] h-[9px] overflow-visible z-20 scale-[0.38] min-[390px]:max-[767px]:scale-[0.42] min-[500px]:max-[767px]:scale-[0.42] min-[620px]:max-[767px]:scale-[0.42] min-[700px]:max-[767px]:scale-[0.42] md:scale-100 origin-bottom">
                                    <div className="relative w-full h-full flex items-center justify-center">
                                        <div
                                            className="absolute -top-2 max-[767px]:top-[-17px] left-1/2 -translate-x-1/2 w-[264px] max-[767px]:w-[314px] h-[8.5px] bg-yellow-400"
                                            style={{ clipPath: "polygon(0% 0%, 100% 0%, 90% 100%, 10% 100%)" }}
                                        />

                                        <div className="absolute top-0.5 max-[767px]:top-[-7px] left-34 max-[767px]:left-[50%] -translate-x-1/2 w-[227px] max-[767px]:w-[265px] h-[5.5px] max-[767px]:h-[4px] bg-[#3B28F6]" />

                                        <div className="absolute top-2 max-[767px]:top-[1px] left-1/2 max-[767px]:left-[49%] -translate-x-1/2 w-[227px] max-[767px]:w-[210px] flex justify-between px-2 max-[767px]:px-1">
                                            {Array.from({ length: 10 }).map((_, i) => (
                                                <div key={i} className="w-2 h-2 max-[767px]:w-[10px] max-[767px]:h-[10px] bg-yellow-400 rounded-full" />
                                            ))}
                                        </div>

                                        <div className="absolute right-3 mt-7 max-[767px]:mt-2 -translate-y-1/2">
                                            <div className="relative w-[32px] h-[32px]">
                                                <div className="absolute top-1/2 -left-58 max-[767px]:-left-56 w-[32px] h-[4.5px] bg-[#3B28F6] rotate-[19deg] origin-right rounded-full" />
                                                <div className="absolute top-1/2 -left-58 max-[767px]:-left-56 w-[32px] h-[4px] bg-[#3B28F6] -rotate-[19deg] origin-right rounded-full" />
                                            </div>
                                        </div>

                                        <div className="absolute left-3 mt-7 max-[767px]:mt-2 -translate-y-1/2">
                                            <div className="relative w-[32px] h-[32px]">
                                                <div className="absolute top-1/2 -right-58 max-[767px]:-right-56 w-[32px] h-[4.5px] bg-[#3B28F6] -rotate-[19deg] origin-left rounded-full" />
                                                <div className="absolute top-1/2 -right-58 max-[767px]:-right-56 w-[32px] h-[4px] bg-[#3B28F6] rotate-[19deg] origin-left rounded-full" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute bottom-[-13px] min-[390px]:max-[767px]:bottom-[-13px] min-[500px]:max-[767px]:bottom-[-13px] min-[620px]:max-[767px]:bottom-[-13px] min-[700px]:max-[767px]:bottom-[-13px] md:-bottom-[35px] left-1/2 -translate-x-1/2 w-[210px] md:w-[270px] h-[9px] overflow-visible z-20 scale-[0.38] min-[390px]:max-[767px]:scale-[0.42] min-[500px]:max-[767px]:scale-[0.42] min-[620px]:max-[767px]:scale-[0.42] min-[700px]:max-[767px]:scale-[0.42] md:scale-100 origin-top">
                                    <div className="relative w-full h-full flex items-center justify-center">

                                        <div className="absolute -top-2 max-[767px]:top-[-13px] left-1/2 max-[767px]:left-[49%] -translate-x-1/2 w-[227px] max-[767px]:w-[210px] flex justify-between px-2 max-[767px]:px-1">
                                            {Array.from({ length: 10 }).map((_, i) => (
                                                <div key={i} className="w-2 h-2 max-[767px]:w-[10px] max-[767px]:h-[12px] bg-yellow-400 rounded-full" />
                                            ))}
                                        </div>

                                        <div className="absolute top-0.5 max-[767px]:top-[-1px] left-1/2 max-[767px]:left-[49%] -translate-x-1/2 w-[227px] max-[767px]:w-[268px] h-[5.5px] max-[767px]:h-[4px] bg-[#3B28F6]" />

                                        <div
                                            className="absolute top-2 max-[767px]:top-[5px] left-1/2 max-[767px]:left-[50%] -translate-x-1/2 w-[264px] max-[767px]:w-[302px] h-[9px] max-[767px]:h-[7px] bg-yellow-400"
                                            style={{ clipPath: "polygon(8% 0%, 92% 0%, 100% 100%, 0% 100%)" }}
                                        />

                                        <div className="absolute right-3 mt-7 max-[767px]:mt-5.5 -translate-y-1/2">
                                            <div className="relative w-[32px] h-[32px]">
                                                <div className="absolute top-1/2 -left-58 max-[767px]:-left-56 w-[32px] h-[4.5px] bg-[#3B28F6] rotate-[19deg] origin-right rounded-full" />
                                                <div className="absolute top-1/2 -left-58 max-[767px]:-left-56 w-[32px] h-[4px] bg-[#3B28F6] -rotate-[19deg] origin-right rounded-full" />
                                            </div>
                                        </div>

                                        <div className="absolute left-3 mt-7 max-[767px]:mt-5.5 -translate-y-1/2">
                                            <div className="relative w-[32px] h-[32px]">
                                                <div className="absolute top-1/2 -right-58 max-[767px]:-right-56 w-[32px] h-[4.5px] bg-[#3B28F6] -rotate-[19deg] origin-left rounded-full" />
                                                <div className="absolute top-1/2 -right-58 max-[767px]:-right-56 w-[32px] h-[4px] bg-[#3B28F6] rotate-[19deg] origin-left rounded-full" />
                                            </div>
                                        </div>

                                    </div>
                                </div>

                                <div className="quiz-mask-top1 absolute top-[-14px] md:-top-6 left-1/2 -translate-x-1/2 w-[120px] min-[390px]:max-[767px]:w-[128px] min-[500px]:max-[767px]:w-[128px] min-[620px]:max-[767px]:w-[128px] min-[700px]:max-[767px]:w-[128px] md:w-[270px] h-[8px] bg-[#04080f] z-10" />

                                <div className="quiz-mask-top2 absolute top-[-5px] md:-top-2 left-1/2 -translate-x-1/2 w-[120px] min-[390px]:max-[767px]:w-[128px] min-[500px]:max-[767px]:w-[128px] min-[620px]:max-[767px]:w-[128px] min-[700px]:max-[767px]:w-[128px] md:w-[270px] h-[9px] bg-[#04080f] z-10" />

                                <div className="quiz-mask-bot1 absolute bottom-[-6px] sm:bottom-[-9px] min-[700px]:max-[767px]:translate-y-[3px] md:-bottom-6 left-1/2 -translate-x-1/2 w-[120px] min-[390px]:max-[767px]:w-[128px] min-[500px]:max-[767px]:w-[128px] min-[620px]:max-[767px]:w-[128px] min-[700px]:max-[767px]:w-[128px] md:w-[270px] h-[8px] bg-[#04080f] z-10" />

                                <div className="quiz-mask-bot2 absolute bottom-[-12px] sm:bottom-[-11px] min-[700px]:max-[767px]:translate-y-[-6px] md:-bottom-11 left-1/2 -translate-x-1/2 w-[120px] min-[390px]:max-[767px]:w-[128px] min-[500px]:max-[767px]:w-[128px] min-[620px]:max-[767px]:w-[128px] min-[700px]:max-[767px]:w-[128px] md:w-[270px] h-[10px] bg-[#04080f] z-10" />
                                 <div className="flex flex-col flex-1 gap-4 min-h-0 w-full">
                                    {question.media_url && (
                                        <div className="w-full flex-shrink-0 h-[70px] md:h-[150px] lg:h-[180px] -mt-1 md:-mt-4 flex items-center justify-center quiz-media">
                                            <img src={question.media_url} alt="Soal" className="w-full h-full object-contain" />
                                        </div>
                                    )}
                                    <div className="flex-1 overflow-y-auto min-h-0 w-full max-w-[700px] mx-auto text-white font-semibold px-[2px] md:px-4 text-[11px] sm:text-[11px] md:text-xs lg:text-xs xl:text-sm 2xl:text-lg leading-[1.4] md:leading-normal [scrollbar-width:thin] [scrollbar-color:#3B28F6_#0d0d1a] [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-track]:bg-[#0d0d1a] [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#3B28F6] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-[#5a46ff] quiz-question-text">
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
            className="quiz-answer-btn w-full text-left relative group mb-[3px] md:mb-6 outline-none block mt-[3px] md:mt-7 scale-[0.86] md:scale-100 origin-center"
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
                    <div className="px-2 py-[3px] pb-[5px] md:py-2 flex gap-2 md:gap-4 relative z-10 items-start quiz-answer-content">
                        <span className={`font-mono font-bold text-[13px] md:text-lg mt-0.5 ${selected ? "text-[#FACC15]" : "text-[#3B28F6] group-hover:text-[#00e5ff]"}`}>
                            {label}.
                        </span>
                        <span className={`text-[11px] md:text-base leading-[1.3] md:leading-relaxed ${selected ? "text-white" : "text-gray-300 group-hover:text-white"}`}>
                            {text}
                        </span>
                    </div>
                </div>
            </div>
        </motion.button>
    )
}

export default function Play({ quiz, has_submitted }: any) {
    const [current, setCurrent] = useState(0)
    const [answers, setAnswers] = useState<any[]>([])
    const [selected, setSelected] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [showResult, setShowResult] = useState(false)
    const [finalResult, setFinalResult] = useState<any>(null)

    const handleRetry = () => {
        setCurrent(0)
        setAnswers([])
        setSelected(null)
        setShowResult(false)
        setFinalResult(null)
    }

    if (!quiz?.questions?.length) return null

    const question = quiz.questions[current]
    const total = quiz.questions.length
    const labels = ["A", "B", "C", "D", "E"]

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
            const csrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content")
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
            <div className="quiz-page h-screen overflow-hidden flex flex-col bg-[#04080f] font-['Rajdhani',sans-serif]">
                <div className="quiz-layout flex-1 overflow-hidden
                    flex flex-col md:flex-row
                    gap-0 md:gap-4
                    w-full max-w-[1500px] mx-auto
                    px-[2px] md:px-4 pt-2 md:pt-4
                    pb-[14px] md:pb-[100px]">

                    <div className="quiz-question w-full md:w-[58%] h-[39%] md:h-full shrink-0 overflow-visible">
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

                    <div className="quiz-answer w-full md:w-[42%] flex-1 md:flex-none
                        flex flex-col justify-center
                        px-0 py-[2px] md:p-0
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
                onRetry={handleRetry}
            />
        </>
    )
}