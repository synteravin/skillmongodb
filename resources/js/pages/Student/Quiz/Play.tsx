import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ResultModal from '@/components/QuestionForm/ResultModal';
import { router } from '@inertiajs/react';
import { Flag } from 'lucide-react';
import './quizLandscape.css';

interface FooterProps {
    current: number;
    total: number;
    selected: string | null;
    loading: boolean;
    handleBack: () => void;
    next: () => void;
}

function Footer({
    current,
    total,
    selected,
    loading,
    handleBack,
    next,
}: FooterProps) {
    return (
        <div className="quiz-footer fixed bottom-4 left-0 z-40 h-[90px] w-full max-[767px]:bottom-[5px] max-[767px]:h-[62px] lg:h-[110px]">
            <div className="pointer-events-none absolute inset-0">
                {/* ── DIAGONAL KIRI ── */}
                <div className="footer-diag-left absolute -bottom-[2px] left-0 block h-[30px] w-[81px] bg-[#3B28F6] [clip-path:polygon(0_0,100%_0,calc(100%_-_30px)_100%,0_100%)] min-[390px]:max-[767px]:w-[95px] min-[500px]:max-[767px]:w-[130px] min-[620px]:max-[767px]:w-[172px] min-[700px]:w-[199px] lg:hidden" />
                <div
                    className="absolute -bottom-[2px] left-0 hidden bg-[#3B28F6] lg:block xl:hidden"
                    style={{
                        width: 320,
                        height: 65,
                        clipPath:
                            'polygon(0 0, 100% 0, calc(100% - 60px) 100%, 0 100%)',
                    }}
                />
                <div
                    className="absolute -bottom-[2px] left-0 hidden bg-[#3B28F6] xl:block 2xl:hidden"
                    style={{
                        width: 375,
                        height: 60,
                        clipPath:
                            'polygon(0 0, 100% 0, calc(100% - 56px) 100%, 0 100%)',
                    }}
                />
                <div
                    className="absolute -bottom-[2px] left-0 hidden bg-[#3B28F6] 2xl:block"
                    style={{
                        width: 442,
                        height: 65,
                        clipPath:
                            'polygon(0 0, 100% 0, calc(100% - 68px) 100%, 0 100%)',
                    }}
                />

                {/* ── DIAGONAL KANAN ── */}
                <div className="footer-diag-right absolute right-0 -bottom-[2px] block h-[30px] w-[83px] bg-[#3B28F6] [clip-path:polygon(0_0,100%_0,100%_100%,30px_100%)] min-[390px]:max-[767px]:w-[98px] min-[500px]:max-[767px]:w-[133px] min-[620px]:max-[767px]:w-[172px] min-[700px]:w-[199px] lg:hidden" />
                <div
                    className="absolute right-0 -bottom-[2px] hidden bg-[#3B28F6] lg:block xl:hidden"
                    style={{
                        width: 320,
                        height: 65,
                        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 60px 100%)',
                    }}
                />
                <div
                    className="absolute right-0 -bottom-[2px] hidden bg-[#3B28F6] xl:block 2xl:hidden"
                    style={{
                        width: 370,
                        height: 60,
                        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 56px 100%)',
                    }}
                />
                <div
                    className="absolute right-0 -bottom-[2px] hidden bg-[#3B28F6] 2xl:block"
                    style={{
                        width: 442,
                        height: 65,
                        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 65px 100%)',
                    }}
                />

                {/* ── GARIS KUNING TENGAH ATAS — MOBILE TANPA CLAMP ── */}
                <div className="footer-bar-top absolute top-[55%] right-[83px] left-[81px] h-[3px] rounded-tl-lg rounded-tr-lg bg-[#FACC15] min-[390px]:max-[767px]:right-[97px] min-[390px]:max-[767px]:left-[94px] min-[500px]:max-[767px]:right-[133px] min-[500px]:max-[767px]:left-[130px] min-[620px]:max-[767px]:right-[172px] min-[620px]:max-[767px]:left-[173px] min-[700px]:right-[199px] min-[700px]:left-[199px] lg:top-[43%] lg:right-[317px] lg:left-[318px] xl:top-[47%] xl:right-[369px] xl:left-[378px] 2xl:top-[42%] 2xl:right-[440px] 2xl:left-[442px]" />

                {/* ── GARIS KUNING BAWAH KIRI ── */}
                <div className="footer-bar-bottom-left absolute -bottom-1 left-0 block h-[3px] w-[54px] bg-[#FACC15] min-[390px]:max-[767px]:w-[68px] min-[500px]:max-[767px]:w-[104px] min-[620px]:max-[767px]:w-[147px] min-[700px]:w-[173px] lg:hidden" />
                <div
                    className="absolute -bottom-2 left-0 hidden h-[5px] rounded-br-xs bg-[#FACC15] lg:block xl:hidden"
                    style={{ width: 263 }}
                />
                <div
                    className="absolute -bottom-2 left-0 hidden h-[5px] bg-[#FACC15] xl:block 2xl:hidden"
                    style={{ width: 323 }}
                />
                <div
                    className="absolute -bottom-2 left-0 hidden h-[5px] bg-[#FACC15] 2xl:block"
                    style={{ width: 381 }}
                />

                {/* ── GARIS KUNING BAWAH KANAN ── */}
                <div className="footer-bar-bottom-right absolute right-0 -bottom-1 block h-[3px] w-[58px] rounded-bl-xs bg-[#FACC15] min-[390px]:max-[767px]:w-[72px] min-[500px]:max-[767px]:w-[109px] min-[620px]:max-[767px]:w-[147px] min-[700px]:w-[174px] lg:hidden" />
                <div
                    className="absolute right-0 -bottom-2 hidden h-[5px] bg-[#FACC15] lg:block xl:hidden"
                    style={{ width: 262 }}
                />
                <div
                    className="absolute right-0 -bottom-2 hidden h-[5px] bg-[#FACC15] xl:block 2xl:hidden"
                    style={{ width: 318 }}
                />
                <div
                    className="absolute right-0 -bottom-2 hidden h-[5px] bg-[#FACC15] 2xl:block"
                    style={{ width: 381 }}
                />

                {/* ── GARIS DIAGONAL KUNING KIRI ── */}
                <div className="footer-slash-left absolute -bottom-[14px] left-[82px] block h-[42px] w-[3px] origin-top-left rotate-45 rounded-tl-sm rounded-br-xs bg-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.8)] min-[390px]:max-[767px]:left-[96px] min-[500px]:max-[767px]:left-[132px] min-[620px]:max-[767px]:left-[174px] min-[700px]:left-[201px] lg:hidden" />
                <div
                    className="absolute -bottom-8 hidden w-[5px] rounded-tl-sm rounded-br-sm bg-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.8)] lg:block xl:hidden"
                    style={{
                        left: 322,
                        height: 95,
                        transform: 'rotate(43deg)',
                        transformOrigin: 'top left',
                    }}
                />
                <div
                    className="absolute -bottom-7 hidden w-[5px] rounded-tl-sm bg-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.8)] xl:block 2xl:hidden"
                    style={{
                        left: 380,
                        height: 88,
                        transform: 'rotate(43deg)',
                        transformOrigin: 'top left',
                    }}
                />
                <div
                    className="absolute -bottom-8 hidden w-[5px] rounded-tl-sm bg-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.8)] 2xl:block"
                    style={{
                        left: 444,
                        height: 95,
                        transform: 'rotate(45deg)',
                        transformOrigin: 'top left',
                    }}
                />

                {/* ── GARIS DIAGONAL KUNING KANAN ── */}
                <div className="footer-slash-right absolute right-[82px] -bottom-[14px] block h-[42px] w-[3px] origin-top-right -translate-x-full -rotate-45 rounded-tr-sm rounded-bl-xs bg-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.8)] min-[390px]:max-[767px]:right-[96px] min-[500px]:max-[767px]:right-[132px] min-[620px]:max-[767px]:right-[171px] min-[700px]:right-[198px] lg:hidden" />
                <div
                    className="absolute -bottom-8 hidden w-[5px] rounded-tr-sm rounded-bl-sm bg-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.8)] lg:block xl:hidden"
                    style={{
                        right: 317,
                        height: 95,
                        transform: 'translateX(-100%) rotate(-43deg)',
                        transformOrigin: 'top right',
                    }}
                />
                <div
                    className="absolute -bottom-7 hidden w-[5px] rounded-tr-sm bg-[#FACC15] shadow-[0_0_12px_rgba(250,204,21,0.8)] xl:block 2xl:hidden"
                    style={{
                        right: 369,
                        height: 88,
                        transform: 'translateX(-100%) rotate(-43deg)',
                        transformOrigin: 'top right',
                    }}
                />
                <div
                    className="absolute -bottom-8 hidden w-[5px] rounded-tr-sm bg-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.8)] 2xl:block"
                    style={{
                        right: 440,
                        height: 95,
                        transform: 'translateX(-100%) rotate(-45deg)',
                        transformOrigin: 'top right',
                    }}
                />
            </div>

            {/* ── WRAPPER TOMBOL (MOBILE ONLY) ── */}
            <div className="footer-btn-wrapper absolute top-[calc(41%+2px)] left-1/2 block h-[38px] w-[230px] -translate-x-1/2 min-[390px]:max-[1023px]:w-[250px] min-[500px]:max-[1023px]:w-[270px] min-[620px]:max-[1023px]:w-[288px] min-[700px]:w-[300px] lg:hidden">
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleBack}
                    disabled={current === 0}
                    className={`footer-btn-back absolute top-[12px] left-4 h-[26px] w-[66px] font-bold min-[390px]:max-[1023px]:top-[12px] min-[390px]:max-[1023px]:left-[3px] min-[390px]:max-[1023px]:h-[26px] min-[390px]:max-[1023px]:w-[84px] min-[500px]:max-[1023px]:top-[12px] min-[500px]:max-[1023px]:left-[-4px] min-[500px]:max-[1023px]:h-[27px] min-[500px]:max-[1023px]:w-[97px] min-[620px]:max-[1023px]:top-[12px] min-[620px]:max-[1023px]:left-[-13px] min-[620px]:max-[1023px]:h-[26px] min-[620px]:max-[1023px]:w-[114px] min-[700px]:top-[12px] min-[700px]:left-[-21px] min-[700px]:h-[27px] min-[700px]:w-[118px] ${current === 0 ? 'opacity-40' : 'opacity-100'}`}
                >
                    <svg
                        className="absolute inset-0 h-full w-full"
                        viewBox="0 0 260 45"
                        preserveAspectRatio="none"
                    >
                        <path
                            d="M108 0 H258 V45 H0 V45 L0 45 Z"
                            className="[d:path('M108_0_H258_V45_H0_V45_L0_45_Z')] min-[390px]:max-[1023px]:[d:path('M83_0_H258_V45_H0_V45_L0_45_Z')] min-[500px]:max-[1023px]:[d:path('M72_0_H258_V45_H0_V45_L0_45_Z')] min-[620px]:max-[1023px]:[d:path('M63_0_H258_V45_H0_V45_L0_45_Z')] min-[700px]:[d:path('M60_0_H258_V45_H0_V45_L0_45_Z')]"
                            fill="none"
                            stroke="#FACC15"
                            strokeWidth={3}
                            vectorEffect="non-scaling-stroke"
                        />
                    </svg>
                    <span className="footer-btn-back-text relative z-10 flex h-full w-full translate-x-[6px] items-center justify-center font-['orbitron'] text-[7px] tracking-[1px] text-white min-[390px]:max-[1023px]:translate-x-[7px] min-[390px]:max-[1023px]:text-[10px] min-[500px]:max-[1023px]:translate-x-[4px] min-[500px]:max-[1023px]:text-[10px] min-[620px]:max-[1023px]:translate-x-[6px] min-[620px]:max-[1023px]:text-[11px] min-[700px]:translate-x-[8px] min-[700px]:text-[12px]">
                        &lt;&lt; BACK
                    </span>
                </motion.button>

                <div className="-top-translate-x-1/2 footer-counter absolute top-[12px] left-[37%] flex h-[24px] w-[58px] items-center justify-center border-[3px] border-[#FACC15] text-[13px] font-bold tracking-[1px] text-[#FACC15] min-[390px]:max-[1023px]:top-[12px] min-[390px]:max-[1023px]:left-[37%] min-[390px]:max-[1023px]:h-[26px] min-[390px]:max-[1023px]:w-[64px] min-[390px]:max-[1023px]:text-[14px] min-[500px]:max-[1023px]:top-[12px] min-[500px]:max-[1023px]:left-[37%] min-[500px]:max-[1023px]:h-[28px] min-[500px]:max-[1023px]:w-[70px] min-[620px]:max-[1023px]:top-[12px] min-[620px]:max-[1023px]:left-[38%] min-[620px]:max-[1023px]:h-[28px] min-[620px]:max-[1023px]:w-[70px] min-[620px]:max-[1023px]:text-[15px] min-[700px]:top-[12px] min-[700px]:left-[34%] min-[700px]:h-[28px] min-[700px]:w-[95px] min-[700px]:text-[16px]">
                    {String(current + 1).padStart(2, '0')}
                    <span className="mx-1 opacity-50">/</span>
                    {String(total).padStart(2, '0')}
                </div>

                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={next}
                    disabled={!selected || loading}
                    className={`footer-btn-next absolute top-[12px] right-4 h-[26px] w-[68px] font-bold min-[390px]:max-[1023px]:top-[12px] min-[390px]:max-[1023px]:right-[4px] min-[390px]:max-[1023px]:h-[26px] min-[390px]:max-[1023px]:w-[85px] min-[500px]:max-[1023px]:top-[12px] min-[500px]:max-[1023px]:right-[-4px] min-[500px]:max-[1023px]:h-[28px] min-[500px]:max-[1023px]:w-[98px] min-[620px]:max-[1023px]:top-[12px] min-[620px]:max-[1023px]:right-[-15px] min-[620px]:max-[1023px]:h-[28px] min-[620px]:max-[1023px]:w-[116px] min-[700px]:top-[12px] min-[700px]:right-[-21px] min-[700px]:h-[28px] min-[700px]:w-[118px] ${!selected || loading ? 'opacity-40' : 'opacity-100'}`}
                >
                    <svg
                        className="absolute inset-0 h-full w-full"
                        viewBox="0 0 260 45"
                        preserveAspectRatio="none"
                    >
                        <path
                            d="M0 0 H150 L258 45 H0 Z"
                            className="[d:path('M0_0_H150_L258_45_H0_Z')] min-[390px]:max-[1023px]:[d:path('M0_0_H170_L251_45_H0_Z')] min-[500px]:max-[1023px]:[d:path('M0_0_H182_L258_45_H0_Z')] min-[620px]:max-[1023px]:[d:path('M0_0_H194_L258_45_H0_Z')] min-[700px]:[d:path('M0_0_H205_L258_45_H0_Z')]"
                            fill="none"
                            stroke="#FACC15"
                            strokeWidth={3}
                            vectorEffect="non-scaling-stroke"
                        />
                    </svg>
                    <span className="footer-btn-next-text relative z-10 flex h-full w-full translate-x-[-6px] items-center justify-center gap-1 font-['orbitron'] text-[7px] tracking-[1px] text-white min-[390px]:max-[1023px]:translate-x-[-7px] min-[390px]:max-[1023px]:text-[10px] min-[500px]:max-[1023px]:translate-x-[-6px] min-[500px]:max-[1023px]:text-[10px] min-[620px]:max-[1023px]:translate-x-[-6px] min-[620px]:max-[1023px]:text-[11px] min-[700px]:translate-x-[-8px] min-[700px]:text-[12px]">
                        {loading ? (
                            '...'
                        ) : current + 1 === total ? (
                            <>
                                <span>FINISH</span>
                                <Flag
                                    className="h-3.5 w-3.5 text-white"
                                    strokeWidth={3}
                                />
                            </>
                        ) : (
                            'NEXT >>'
                        )}
                    </span>
                </motion.button>
            </div>

            {/* ── WRAPPER TOMBOL (MD KE ATAS) ── */}
            <div
                className="footer-btn-wrapper absolute hidden lg:block"
                style={{
                    left: '50%',
                    transform: 'translateX(-50%)',
                    top: 'calc(43% + 12px)',
                    width: 'clamp(320px, 42vw, 760px)',
                    height: 70,
                }}
            >
                {/* BACK — md */}
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleBack}
                    disabled={current === 0}
                    className="footer-btn-back absolute top-[-1px] block font-bold lg:hidden"
                    style={{
                        left: -52,
                        width: 160,
                        height: 48,
                        opacity: current === 0 ? 0.4 : 1,
                        letterSpacing: '3px',
                    }}
                >
                    <svg
                        className="absolute inset-0 h-full w-full"
                        viewBox="0 0 260 45"
                        preserveAspectRatio="none"
                    >
                        <path
                            d="M73 0 H258 V45 H0 V45 L0 45 Z"
                            fill="none"
                            stroke="#FACC15"
                            strokeWidth={6}
                            vectorEffect="non-scaling-stroke"
                        />
                    </svg>
                    <span className="footer-btn-back-text relative z-10 flex h-full w-full items-center justify-center font-['orbitron'] text-lg text-white">
                        &lt;&lt; BACK
                    </span>
                </motion.button>

                {/* BACK — lg */}
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleBack}
                    disabled={current === 0}
                    className="absolute top-[-4px] hidden font-bold lg:block xl:hidden"
                    style={{
                        left: -26,
                        width: 172,
                        height: 62,
                        opacity: current === 0 ? 0.4 : 1,
                        letterSpacing: '3px',
                    }}
                >
                    <svg
                        className="absolute inset-0 h-full w-full"
                        viewBox="0 0 260 45"
                        preserveAspectRatio="none"
                    >
                        <path
                            d="M87 0 H258 V45 H0 V45 L0 45 Z"
                            fill="none"
                            stroke="#FACC15"
                            strokeWidth={6}
                            vectorEffect="non-scaling-stroke"
                        />
                    </svg>
                    <span className="relative z-10 flex h-full w-full translate-x-[9px] items-center justify-center font-['orbitron'] text-lg text-white">
                        &lt;&lt; BACK
                    </span>
                </motion.button>

                {/* BACK — xl */}
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleBack}
                    disabled={current === 0}
                    className="absolute top-0 hidden font-bold xl:block 2xl:hidden"
                    style={{
                        left: -39,
                        width: 215,
                        height: 58,
                        opacity: current === 0 ? 0.4 : 1,
                        letterSpacing: '3px',
                    }}
                >
                    <svg
                        className="absolute inset-0 h-full w-full"
                        viewBox="0 0 260 45"
                        preserveAspectRatio="none"
                    >
                        <path
                            d="M63 0 H258 V45 H0 V45 L0 46 Z"
                            fill="none"
                            stroke="#FACC15"
                            strokeWidth={6}
                            vectorEffect="non-scaling-stroke"
                        />
                    </svg>
                    <span className="relative z-10 flex h-full w-full items-center justify-center font-['orbitron'] text-[26px] text-white">
                        &lt;&lt; BACK
                    </span>
                </motion.button>

                {/* BACK — 2xl */}
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleBack}
                    disabled={current === 0}
                    className="absolute top-[-4px] hidden font-bold 2xl:block"
                    style={{
                        left: -49,
                        width: 280,
                        height: 62,
                        opacity: current === 0 ? 0.4 : 1,
                        letterSpacing: '3px',
                    }}
                >
                    <svg
                        className="absolute inset-0 h-full w-full"
                        viewBox="0 0 260 45"
                        preserveAspectRatio="none"
                    >
                        <path
                            d="M55 0 H258 V45 H0 V45 L0 45 Z"
                            fill="none"
                            stroke="#FACC15"
                            strokeWidth={6}
                            vectorEffect="non-scaling-stroke"
                        />
                    </svg>
                    <span className="relative z-10 flex h-full w-full items-center justify-center font-['orbitron'] text-[32px] text-white">
                        &lt;&lt; BACK
                    </span>
                </motion.button>

                {/* NOMOR */}
                <div
                    className="footer-counter absolute block flex items-center justify-center border-4 border-[#FACC15] font-bold text-[#FACC15] lg:hidden"
                    style={{
                        left: '54%',
                        marginLeft: -60,
                        top: -1,
                        width: 100,
                        height: 48,
                        fontSize: 22,
                        letterSpacing: '3px',
                    }}
                >
                    {String(current + 1).padStart(2, '0')}
                    <span className="mx-2 opacity-50">/</span>
                    {String(total).padStart(2, '0')}
                </div>

                <div
                    className="absolute flex hidden items-center justify-center border-4 border-[#FACC15] font-bold text-[#FACC15] lg:flex xl:hidden"
                    style={{
                        left: '49%',
                        marginLeft: -60,
                        top: -4,
                        width: 130,
                        height: 62,
                        fontSize: 26,
                        letterSpacing: '3px',
                    }}
                >
                    {String(current + 1).padStart(2, '0')}
                    <span className="mx-2 opacity-50">/</span>
                    {String(total).padStart(2, '0')}
                </div>

                <div
                    className="absolute flex hidden items-center justify-center border-3 border-[#FACC15] font-bold text-[#FACC15] xl:flex 2xl:hidden"
                    style={{
                        left: '49%',
                        marginLeft: -78,
                        top: 1,
                        width: 176,
                        height: 57,
                        fontSize: 29,
                        letterSpacing: '3px',
                    }}
                >
                    {String(current + 1).padStart(2, '0')}
                    <span className="mx-2 opacity-50">/</span>
                    {String(total).padStart(2, '0')}
                </div>

                <div
                    className="absolute flex hidden items-center justify-center border-4 border-[#FACC15] font-bold text-[#FACC15] 2xl:flex"
                    style={{
                        left: '49%',
                        marginLeft: -70,
                        top: -4,
                        width: 155,
                        height: 62,
                        fontSize: 28,
                        letterSpacing: '3px',
                    }}
                >
                    {String(current + 1).padStart(2, '0')}
                    <span className="mx-2 opacity-50">/</span>
                    {String(total).padStart(2, '0')}
                </div>

                {/* NEXT — md */}
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={next}
                    disabled={!selected || loading}
                    className="footer-btn-next absolute top-[-1px] block font-bold lg:hidden"
                    style={{
                        right: -56,
                        width: 160,
                        height: 48,
                        opacity: !selected || loading ? 0.4 : 1,
                        letterSpacing: '3px',
                    }}
                >
                    <svg
                        className="absolute inset-0 h-full w-full"
                        viewBox="0 0 260 45"
                        preserveAspectRatio="none"
                    >
                        <path
                            d="M0 0 H183 L258 45 H0 Z"
                            fill="none"
                            stroke="#FACC15"
                            strokeWidth={6}
                            vectorEffect="non-scaling-stroke"
                        />
                    </svg>
                    <span className="footer-btn-next-text relative z-10 flex h-full w-full translate-x-[-16px] items-center justify-center gap-2 font-['orbitron'] text-lg text-white">
                        {loading ? (
                            '...'
                        ) : current + 1 === total ? (
                            <>
                                <span>FINISH</span>
                                <Flag
                                    className="h-5 w-5 text-white"
                                    strokeWidth={3}
                                />
                            </>
                        ) : (
                            'NEXT >>'
                        )}
                    </span>
                </motion.button>

                {/* NEXT — lg */}
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={next}
                    disabled={!selected || loading}
                    className="absolute top-[-4px] hidden font-bold lg:block xl:hidden"
                    style={{
                        right: -27,
                        width: 172,
                        height: 62,
                        opacity: !selected || loading ? 0.4 : 1,
                        letterSpacing: '3px',
                    }}
                >
                    <svg
                        className="absolute inset-0 h-full w-full"
                        viewBox="0 0 260 45"
                        preserveAspectRatio="none"
                    >
                        <path
                            d="M0 0 H172 L258 45 H0 Z"
                            fill="none"
                            stroke="#FACC15"
                            strokeWidth={6}
                            vectorEffect="non-scaling-stroke"
                        />
                    </svg>
                    <span className="relative z-10 flex h-full w-full translate-x-[-18px] items-center justify-center gap-2 font-['orbitron'] text-lg text-white">
                        {loading ? (
                            '...'
                        ) : current + 1 === total ? (
                            <>
                                <span>FINISH</span>
                                <Flag
                                    className="h-4 w-4 text-white"
                                    strokeWidth={3}
                                />
                            </>
                        ) : (
                            'NEXT >>'
                        )}
                    </span>
                </motion.button>

                {/* NEXT — xl */}
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={next}
                    disabled={!selected || loading}
                    className="absolute top-0 hidden font-bold xl:block 2xl:hidden"
                    style={{
                        right: -46,
                        width: 215,
                        height: 58,
                        opacity: !selected || loading ? 0.4 : 1,
                        letterSpacing: '3px',
                    }}
                >
                    <svg
                        className="absolute inset-0 h-full w-full"
                        viewBox="0 0 260 45"
                        preserveAspectRatio="none"
                    >
                        <path
                            d="M0 0 H197 L258 44 H0 Z"
                            fill="none"
                            stroke="#FACC15"
                            strokeWidth={6}
                            vectorEffect="non-scaling-stroke"
                        />
                    </svg>
                    <span className="relative z-10 flex h-full w-full items-center justify-center gap-2 font-['orbitron'] text-[26px] text-white">
                        {loading ? (
                            '...'
                        ) : current + 1 === total ? (
                            <>
                                <span>FINISH</span>
                                <Flag
                                    className="h-5 w-5 text-white"
                                    strokeWidth={3}
                                />
                            </>
                        ) : (
                            'NEXT >>'
                        )}
                    </span>
                </motion.button>

                {/* NEXT — 2xl */}
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={next}
                    disabled={!selected || loading}
                    className="absolute top-[-4px] hidden font-bold 2xl:block"
                    style={{
                        right: -49,
                        width: 280,
                        height: 62,
                        opacity: !selected || loading ? 0.4 : 1,
                        letterSpacing: '3px',
                    }}
                >
                    <svg
                        className="absolute inset-0 h-full w-full"
                        viewBox="0 0 260 45"
                        preserveAspectRatio="none"
                    >
                        <path
                            d="M0 0 H205 L258 45 H0 Z"
                            fill="none"
                            stroke="#FACC15"
                            strokeWidth={6}
                            vectorEffect="non-scaling-stroke"
                        />
                    </svg>
                    <span className="relative z-10 flex h-full w-full items-center justify-center gap-2 font-['orbitron'] text-[32px] text-white">
                        {loading ? (
                            '...'
                        ) : current + 1 === total ? (
                            <>
                                <span>FINISH</span>
                                <Flag
                                    className="h-8 w-8 text-white"
                                    strokeWidth={3}
                                />
                            </>
                        ) : (
                            'NEXT >>'
                        )}
                    </span>
                </motion.button>
            </div>
        </div>
    );
}

function BoxSoal({
    question,
}: {
    current: number;
    total: number;
    question: any;
}) {
    return (
        <div className="quiz-question-inner relative h-full w-full p-[2px] md:p-6 lg:p-8">
            <div className="h-full w-full bg-[#3B28F6] p-[2px] md:p-[4px]">
                <div className="h-full w-full bg-[#04080f] p-[4px] md:p-[15px]">
                    <div className="h-full w-full bg-[#3B28F6] p-[2px] md:p-[4px]">
                        <div className="h-full w-full bg-[#04080f] p-[4px] md:p-[15px]">
                            <div className="quiz-box-soal relative flex h-full min-h-0 w-full flex-col overflow-visible border-2 border-[#3B28F6] bg-[#04080f] px-4 py-6 md:min-h-[350px] md:border-4 md:p-9">
                                <div className="absolute top-[-8px] left-1/2 z-20 h-[9px] w-[210px] origin-bottom -translate-x-1/2 scale-[0.38] overflow-visible min-[390px]:max-[767px]:top-[-8px] min-[390px]:max-[767px]:scale-[0.42] min-[500px]:max-[767px]:top-[-8px] min-[500px]:max-[767px]:scale-[0.42] min-[620px]:max-[767px]:top-[-8px] min-[620px]:max-[767px]:scale-[0.42] min-[700px]:max-[767px]:top-[-8px] min-[700px]:max-[767px]:scale-[0.42] md:-top-4 md:w-[270px] md:scale-100">
                                    <div className="relative flex h-full w-full items-center justify-center">
                                        <div
                                            className="absolute -top-2 left-1/2 h-[8.5px] w-[264px] -translate-x-1/2 bg-yellow-400 max-[767px]:top-[-17px] max-[767px]:w-[314px]"
                                            style={{
                                                clipPath:
                                                    'polygon(0% 0%, 100% 0%, 90% 100%, 10% 100%)',
                                            }}
                                        />

                                        <div className="absolute top-0.5 left-34 h-[5.5px] w-[227px] -translate-x-1/2 bg-[#3B28F6] max-[767px]:top-[-7px] max-[767px]:left-[50%] max-[767px]:h-[4px] max-[767px]:w-[265px]" />

                                        <div className="absolute top-2 left-1/2 flex w-[227px] -translate-x-1/2 justify-between px-2 max-[767px]:top-[1px] max-[767px]:left-[49%] max-[767px]:w-[210px] max-[767px]:px-1">
                                            {Array.from({ length: 10 }).map(
                                                (_, i) => (
                                                    <div
                                                        key={i}
                                                        className="h-2 w-2 rounded-full bg-yellow-400 max-[767px]:h-[10px] max-[767px]:w-[10px]"
                                                    />
                                                ),
                                            )}
                                        </div>

                                        <div className="absolute right-3 mt-7 -translate-y-1/2 max-[767px]:mt-2">
                                            <div className="relative h-[32px] w-[32px]">
                                                <div className="absolute top-1/2 -left-58 h-[4.5px] w-[32px] origin-right rotate-[19deg] rounded-full bg-[#3B28F6] max-[767px]:-left-56" />
                                                <div className="absolute top-1/2 -left-58 h-[4px] w-[32px] origin-right -rotate-[19deg] rounded-full bg-[#3B28F6] max-[767px]:-left-56" />
                                            </div>
                                        </div>

                                        <div className="absolute left-3 mt-7 -translate-y-1/2 max-[767px]:mt-2">
                                            <div className="relative h-[32px] w-[32px]">
                                                <div className="absolute top-1/2 -right-58 h-[4.5px] w-[32px] origin-left -rotate-[19deg] rounded-full bg-[#3B28F6] max-[767px]:-right-56" />
                                                <div className="absolute top-1/2 -right-58 h-[4px] w-[32px] origin-left rotate-[19deg] rounded-full bg-[#3B28F6] max-[767px]:-right-56" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute bottom-[-13px] left-1/2 z-20 h-[9px] w-[210px] origin-top -translate-x-1/2 scale-[0.38] overflow-visible min-[390px]:max-[767px]:bottom-[-13px] min-[390px]:max-[767px]:scale-[0.42] min-[500px]:max-[767px]:bottom-[-13px] min-[500px]:max-[767px]:scale-[0.42] min-[620px]:max-[767px]:bottom-[-13px] min-[620px]:max-[767px]:scale-[0.42] min-[700px]:max-[767px]:bottom-[-13px] min-[700px]:max-[767px]:scale-[0.42] md:-bottom-[35px] md:w-[270px] md:scale-100">
                                    <div className="relative flex h-full w-full items-center justify-center">
                                        <div className="absolute -top-2 left-1/2 flex w-[227px] -translate-x-1/2 justify-between px-2 max-[767px]:top-[-13px] max-[767px]:left-[49%] max-[767px]:w-[210px] max-[767px]:px-1">
                                            {Array.from({ length: 10 }).map(
                                                (_, i) => (
                                                    <div
                                                        key={i}
                                                        className="h-2 w-2 rounded-full bg-yellow-400 max-[767px]:h-[12px] max-[767px]:w-[10px]"
                                                    />
                                                ),
                                            )}
                                        </div>

                                        <div className="absolute top-0.5 left-1/2 h-[5.5px] w-[227px] -translate-x-1/2 bg-[#3B28F6] max-[767px]:top-[-1px] max-[767px]:left-[49%] max-[767px]:h-[4px] max-[767px]:w-[268px]" />

                                        <div
                                            className="absolute top-2 left-1/2 h-[9px] w-[264px] -translate-x-1/2 bg-yellow-400 max-[767px]:top-[5px] max-[767px]:left-[50%] max-[767px]:h-[7px] max-[767px]:w-[302px]"
                                            style={{
                                                clipPath:
                                                    'polygon(8% 0%, 92% 0%, 100% 100%, 0% 100%)',
                                            }}
                                        />

                                        <div className="absolute right-3 mt-7 -translate-y-1/2 max-[767px]:mt-5.5">
                                            <div className="relative h-[32px] w-[32px]">
                                                <div className="absolute top-1/2 -left-58 h-[4.5px] w-[32px] origin-right rotate-[19deg] rounded-full bg-[#3B28F6] max-[767px]:-left-56" />
                                                <div className="absolute top-1/2 -left-58 h-[4px] w-[32px] origin-right -rotate-[19deg] rounded-full bg-[#3B28F6] max-[767px]:-left-56" />
                                            </div>
                                        </div>

                                        <div className="absolute left-3 mt-7 -translate-y-1/2 max-[767px]:mt-5.5">
                                            <div className="relative h-[32px] w-[32px]">
                                                <div className="absolute top-1/2 -right-58 h-[4.5px] w-[32px] origin-left -rotate-[19deg] rounded-full bg-[#3B28F6] max-[767px]:-right-56" />
                                                <div className="absolute top-1/2 -right-58 h-[4px] w-[32px] origin-left rotate-[19deg] rounded-full bg-[#3B28F6] max-[767px]:-right-56" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="quiz-mask-top1 absolute top-[-14px] left-1/2 z-10 h-[8px] w-[120px] -translate-x-1/2 bg-[#04080f] min-[390px]:max-[767px]:w-[128px] min-[500px]:max-[767px]:w-[128px] min-[620px]:max-[767px]:w-[128px] min-[700px]:max-[767px]:w-[128px] md:-top-6 md:w-[270px]" />

                                <div className="quiz-mask-top2 absolute top-[-5px] left-1/2 z-10 h-[9px] w-[120px] -translate-x-1/2 bg-[#04080f] min-[390px]:max-[767px]:w-[128px] min-[500px]:max-[767px]:w-[128px] min-[620px]:max-[767px]:w-[128px] min-[700px]:max-[767px]:w-[128px] md:-top-2 md:w-[270px]" />

                                <div className="quiz-mask-bot1 absolute bottom-[-6px] left-1/2 z-10 h-[8px] w-[120px] -translate-x-1/2 bg-[#04080f] min-[390px]:max-[767px]:w-[128px] min-[500px]:max-[767px]:w-[128px] min-[620px]:max-[767px]:w-[128px] min-[700px]:max-[767px]:w-[128px] min-[700px]:max-[767px]:translate-y-[3px] sm:bottom-[-9px] md:-bottom-6 md:w-[270px]" />

                                <div className="quiz-mask-bot2 absolute bottom-[-12px] left-1/2 z-10 h-[10px] w-[120px] -translate-x-1/2 bg-[#04080f] min-[390px]:max-[767px]:w-[128px] min-[500px]:max-[767px]:w-[128px] min-[620px]:max-[767px]:w-[128px] min-[700px]:max-[767px]:w-[128px] min-[700px]:max-[767px]:translate-y-[-6px] sm:bottom-[-11px] md:-bottom-11 md:w-[270px]" />
                                <div className="flex min-h-0 w-full flex-1 flex-col gap-4">
                                    {question.media_url && (
                                        <div className="quiz-media -mt-1 flex h-[100px] w-full flex-shrink-0 items-center justify-center sm:h-[140px] md:-mt-4 md:h-[150px] lg:h-[180px]">
                                            <img
                                                src={question.media_url}
                                                alt="Soal"
                                                className="h-full w-full object-contain"
                                            />
                                        </div>
                                    )}
                                    <div className="quiz-question-text mx-auto min-h-0 w-full max-w-[700px] flex-1 overflow-y-auto px-[2px] text-[11px] leading-[1.4] font-semibold text-white [scrollbar-color:#3B28F6_#0d0d1a] [scrollbar-width:thin] sm:text-[11px] md:px-4 md:text-xs md:leading-normal lg:text-xs xl:text-sm 2xl:text-lg [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#3B28F6] [&::-webkit-scrollbar-thumb:hover]:bg-[#5a46ff] [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-[#0d0d1a]">
                                        {question.question_text}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
function AnswerButton({ label, text, selected, onClick }: any) {
    const outerClip =
        'polygon(0 0, 30px 0, 45px 15px, 120px 15px, 135px 0, 100% 0, 100% 100%, 0 100%)';
    const innerClip =
        'polygon(0 0, 31px 0, 46px 14px, 119px 14px, 134px 0, 100% 0, 100% 100%, 0 100%)';
    return (
        <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className="quiz-answer-btn group relative mt-[12px] mb-[16px] block w-full text-left outline-none md:mt-7 md:mb-6"
        >
            <div className="relative">
                <div className="absolute -top-[14px] z-[1] h-[12px] w-[173px]">
                    <svg
                        className="absolute inset-0 h-full w-full overflow-visible"
                        viewBox="0 0 100 8"
                        preserveAspectRatio="none"
                    >
                        <path
                            d="M10 0 L90 0 L100 8 L0 8 Z"
                            fill="none"
                            stroke="#3B82F6"
                            strokeWidth="1"
                            vectorEffect="non-scaling-stroke"
                        />
                    </svg>
                </div>
                <div className="absolute -top-[3px] left-[34.5px] z-[3] h-[2px] w-[97px] rounded-br-md rounded-bl-sm bg-[#04080f]" />
                <div className="absolute -top-1 left-[34px] z-[2] h-[16px] w-[98px]">
                    <svg
                        className="absolute inset-0 h-full w-full overflow-visible"
                        viewBox="0 0 100 16"
                        preserveAspectRatio="none"
                    >
                        <path
                            d="M0 2 L13 15 L87 15 L100 2"
                            fill="none"
                            stroke="#3B82F6"
                            strokeWidth="1.2"
                            vectorEffect="non-scaling-stroke"
                        />
                    </svg>
                </div>
            </div>

            <div
                className={`p-[2px] transition-colors duration-300 ${selected ? 'bg-[#FACC15]' : 'bg-[#3B28F6] group-hover:bg-[#00e5ff]'}`}
                style={{ clipPath: outerClip }}
            >
                <div
                    className={`h-full w-full pt-4 transition-colors duration-300 ${selected ? 'bg-[#1a1505]' : 'bg-[#0a0f1d]'}`}
                    style={{ clipPath: innerClip }}
                >
                    <div
                        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
                        style={{
                            background:
                                'linear-gradient(90deg, rgba(59,40,246,0.2) 0%, transparent 100%)',
                        }}
                    />
                    <div className="quiz-answer-content relative z-10 flex items-start gap-2 px-2 py-[3px] pb-[5px] md:gap-4 md:py-2">
                        <span
                            className={`mt-0.5 font-mono text-[13px] font-bold md:text-lg ${selected ? 'text-[#FACC15]' : 'text-[#3B28F6] group-hover:text-[#00e5ff]'}`}
                        >
                            {label}.
                        </span>
                        <span
                            className={`text-[11px] leading-[1.3] md:text-base md:leading-relaxed ${selected ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}
                        >
                            {text}
                        </span>
                    </div>
                </div>
            </div>
        </motion.button>
    );
}

export default function Play({ quiz, has_submitted }: any) {
    const [current, setCurrent] = useState(0);
    const [answers, setAnswers] = useState<any[]>([]);
    const [selected, setSelected] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [finalResult, setFinalResult] = useState<any>(null);

    if (!quiz?.questions?.length) return null;

    const question = quiz.questions[current];
    const total = quiz.questions.length;
    const labels = ['A', 'B', 'C', 'D', 'E'];

    const selectAnswer = (id: string) => {
        if (!loading) setSelected(id);
    };

    const handleBack = () => {
        if (current > 0) {
            setCurrent(current - 1);
            const prev = answers.find(
                (a) => a.question_id === quiz.questions[current - 1].id,
            );
            setSelected(prev?.answer_id ?? null);
        }
    };

    const next = () => {
        if (!selected) return;
        const updated = [
            ...answers.filter((a) => a.question_id !== question.id),
            { question_id: question.id, answer_id: selected },
        ];
        setAnswers(updated);
        
        if (current + 1 < total) {
            const nextQuestion = quiz.questions[current + 1];
            const nextSaved = updated.find(
                (a) => a.question_id === nextQuestion.id,
            );
            setSelected(nextSaved?.answer_id ?? null);
            setCurrent(current + 1);
        } else {
            setSelected(null);
            submit(updated);
        }
    };

    const submit = async (finalAnswers: any[]) => {
        setLoading(true);
        try {
            const csrf = document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute('content');
            const formatted = Object.fromEntries(
                finalAnswers.map((a) => [a.question_id, a.answer_id]),
            );
            const res = await fetch(`/student/quiz/${quiz.id}/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrf || '',
                    Accept: 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ answers: formatted }),
            });
            const data = await res.json();
            if (!res.ok) {
                alert(data.message || 'Submit gagal');
                setLoading(false);
                return;
            }
            setFinalResult(data.result);
            setShowResult(true);
        } catch {
            alert('Submit gagal');
        } finally {
            setLoading(false);
        }
    };

    if (has_submitted) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#04080f] font-['Rajdhani',sans-serif]">
                <div
                    className="relative border-2 border-[#3B28F6] p-10 text-center"
                    style={{
                        clipPath:
                            'polygon(30px 0, 100% 0, 100% calc(100% - 30px), calc(100% - 30px) 100%, 0 100%, 0 30px)',
                    }}
                >
                    <div className="absolute top-0 left-0 z-20 h-8 w-8 border-t-[3px] border-l-[3px] border-[#FACC15]" />
                    <div className="absolute right-0 bottom-0 z-20 h-8 w-8 border-r-[3px] border-b-[3px] border-[#FACC15]" />
                    <h1 className="mb-4 text-3xl font-bold tracking-[4px] text-[#FACC15]">
                        MISSION COMPLETED
                    </h1>
                    <p className="mb-8 text-lg text-gray-300">
                        Kamu sudah menyelesaikan quiz ini.
                    </p>
                    <button
                        onClick={() =>
                            router.visit(`/student/courses/${quiz.course_slug}`)
                        }
                        className="bg-[#FACC15] px-8 py-3 font-bold text-black transition-colors hover:bg-yellow-300"
                        style={{
                            clipPath:
                                'polygon(15px 0, 100% 0, calc(100% - 15px) 100%, 0 100%)',
                            letterSpacing: 2,
                        }}
                    >
                        KEMBALI KE COURSE
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="quiz-page flex min-h-screen flex-col overflow-y-auto bg-[#04080f] font-['Rajdhani',sans-serif] lg:h-screen lg:overflow-hidden">
                <div className="quiz-layout mx-auto flex w-full max-w-[1500px] flex-1 flex-col gap-4 overflow-visible px-4 pt-4 pb-[85px] lg:flex-row lg:overflow-hidden lg:pb-[100px]">
                    <div className="quiz-question h-auto w-full shrink-0 overflow-visible lg:h-full lg:w-[58%]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={question.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                                className="h-full w-full"
                            >
                                <BoxSoal
                                    current={current}
                                    total={total}
                                    question={question}
                                />
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="quiz-answer mt-4 flex w-full flex-shrink-0 flex-col justify-start p-0 lg:mt-0 lg:w-[42%] lg:justify-center">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={question.id + '-answers'}
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
                onClose={() =>
                    router.visit(`/student/courses/${quiz.course_slug}`)
                }
            />
        </>
    );
}
