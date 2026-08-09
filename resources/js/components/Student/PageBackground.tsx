import React, { useEffect, useRef } from 'react';

export function StarBackground() {
    return (
        <div className="absolute inset-0 z-0 hidden overflow-hidden pointer-events-none dark:block">
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
                    backgroundSize: '600px 400px',
                }}
            />
            <div className="absolute top-[50px] left-1/2 h-[100px] w-[1600px] -translate-x-1/2 rounded-full bg-blue-500 opacity-70 blur-[180px]" />
            <div className="absolute top-[450px] left-1/2 h-[100px] w-[1600px] -translate-x-1/2 rounded-full bg-blue-500 opacity-70 blur-[180px]" />
        </div>
    );
}

export function LightBackground() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const drawStars = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // star kecil: lebih banyak
            for (let i = 0; i < 620; i++) {
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height;

                const inGlowArea = y < 190 || y > canvas.height - 190;
                const size = Math.random() * 0.9 + 0.12;
                const alpha = inGlowArea
                    ? Math.random() * 0.48 + 0.38
                    : Math.random() * 0.34 + 0.18;

                const color = inGlowArea ? '255,255,255' : '170,215,255';
                const shadowColor = inGlowArea
                    ? 'rgba(195,240,255,.9)'
                    : 'rgba(135,195,255,.45)';

                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${color},${alpha})`;
                ctx.shadowBlur = Math.random() * (inGlowArea ? 11 : 7) + 2;
                ctx.shadowColor = shadowColor;
                ctx.fill();
            }

            // star sedang: glow lebih detail
            for (let i = 0; i < 120; i++) {
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height;

                const inGlowArea = y < 190 || y > canvas.height - 190;
                const size = Math.random() * 0.75 + 1;
                const alpha = inGlowArea
                    ? Math.random() * 0.36 + 0.28
                    : Math.random() * 0.28 + 0.14;

                const color = inGlowArea ? '255,255,255' : '180,220,255';
                const shadowColor = inGlowArea
                    ? 'rgba(200,245,255,.75)'
                    : 'rgba(150,205,255,.5)';

                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${color},${alpha})`;
                ctx.shadowBlur = Math.random() * 18 + 7;
                ctx.shadowColor = shadowColor;
                ctx.fill();
            }

            // star besar tipis
            for (let i = 0; i < 42; i++) {
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height;

                const inGlowArea = y < 190 || y > canvas.height - 190;
                const size = Math.random() * 1.2 + 1.15;
                const alpha = inGlowArea
                    ? Math.random() * 0.18 + 0.15
                    : Math.random() * 0.13 + 0.09;

                const color = inGlowArea ? '255,255,255' : '175,215,255';

                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${color},${alpha})`;
                ctx.shadowBlur = Math.random() * 26 + 12;
                ctx.shadowColor = inGlowArea
                    ? 'rgba(190,235,255,.5)'
                    : 'rgba(140,200,255,.42)';
                ctx.fill();
            }
        };

        drawStars();
        window.addEventListener('resize', drawStars);
        return () => window.removeEventListener('resize', drawStars);
    }, []);

    const bigStars = [
        { size: 18, left: '7%', top: '20%' },
        { size: 13, left: '14%', top: '38%' },
        { size: 12, left: '22%', top: '72%' },
        { size: 14, left: '36%', top: '32%' },
        { size: 12, left: '53%', top: '68%' },
        { size: 16, left: '62%', top: '50%' },
        { size: 15, left: '68%', top: '24%' },
        { size: 13, left: '86%', top: '58%' },
        { size: 14, left: '79%', top: '40%' },
        { size: 16, left: '28%', top: '18%' },
        { size: 14, left: '58%', top: '78%' },
        { size: 13, left: '84%', top: '28%' },
        { size: 12, left: '44%', top: '20%' },
        { size: 11, left: '73%', top: '76%' },
    ];

    const smallStars = [
        { w: 1, h: 1, left: '8%', top: '10%', color: 'rgba(170,215,255,0.95)' },
        { w: 1.5, h: 1.5, left: '22%', top: '20%', color: 'rgba(255,255,255,0.96)' },
        { w: 1, h: 1, left: '30%', top: '12%', color: 'rgba(170,215,255,0.9)' },
        { w: 1.75, h: 1.75, left: '42%', top: '8%', color: 'rgba(255,255,255,0.95)' },
        { w: 1.5, h: 1.5, left: '55%', top: '14%', color: 'rgba(255,255,255,0.96)' },
        { w: 1, h: 1, left: '62%', top: '10%', color: 'rgba(170,215,255,0.82)' },
        { w: 1, h: 1, left: '74%', top: '16%', color: 'rgba(170,215,255,0.88)' },
        { w: 1.5, h: 1.5, left: '90%', top: '18%', color: 'rgba(255,255,255,0.94)' },
        { w: 1, h: 1, left: '12%', top: '50%', color: 'rgba(170,215,255,0.76)' },
        { w: 1.5, h: 1.5, left: '28%', top: '58%', color: 'rgba(170,215,255,0.8)' },
        { w: 1, h: 1, left: '42%', top: '48%', color: 'rgba(170,215,255,0.78)' },
        { w: 1.25, h: 1.25, left: '52%', top: '42%', color: 'rgba(170,215,255,0.86)' },
        { w: 1.5, h: 1.5, left: '64%', top: '54%', color: 'rgba(170,215,255,0.78)' },
        { w: 1, h: 1, left: '68%', top: '62%', color: 'rgba(170,215,255,0.72)' },
        { w: 1.25, h: 1.25, left: '82%', top: '48%', color: 'rgba(170,215,255,0.86)' },
        { w: 1, h: 1, left: '18%', top: '84%', color: 'rgba(170,215,255,0.72)' },
        { w: 1.5, h: 1.5, left: '34%', top: '82%', color: 'rgba(170,215,255,0.76)' },
        { w: 1, h: 1, left: '44%', top: '74%', color: 'rgba(170,215,255,0.75)' },
        { w: 1.25, h: 1.25, left: '56%', top: '88%', color: 'rgba(170,215,255,0.72)' },
        { w: 1.5, h: 1.5, left: '78%', top: '84%', color: 'rgba(255,255,255,0.92)' },
        { w: 1, h: 1, left: '94%', top: '88%', color: 'rgba(170,215,255,0.76)' },
    ];

    return (
        <div className="absolute inset-0 z-0 block overflow-hidden pointer-events-none dark:hidden">
            <div
                className="absolute inset-0"
                style={{
                    background: `
            radial-gradient(
              ellipse 120% 90% at 50% 50%,
              rgba(255,255,255,.35) 0%,
              rgba(235,242,255,.18) 28%,
              transparent 65%
            )
          `,
                }}
            />

            <div
                className="absolute inset-0"
                style={{
                    background: `
            linear-gradient(
              135deg,
              #f9fcff 0%,
              #e4eeff 42%,
              #c7d8ff 100%
            )
          `,
                }}
            />

            <div
                className="absolute inset-x-0 top-[50px] h-[100px] rounded-full opacity-95 blur-[140px]"
                style={{
                    background: `
            linear-gradient(
              90deg,
              rgba(120,190,255,0) 0%,
              rgba(120,190,255,.22) 10%,
              rgba(90,170,255,.40) 24%,
              rgba(70,155,255,.70) 50%,
              rgba(90,170,255,.40) 76%,
              rgba(120,190,255,.22) 90%,
              rgba(120,190,255,0) 100%
            )
          `,
                }}
            />

            <div
                className="absolute inset-x-0 top-[24%] h-[110px] rounded-full opacity-80 blur-[95px]"
                style={{
                    background: `
      radial-gradient(
        ellipse at center,
        rgba(70,160,255,0.85) 0%,
        rgba(50,145,255,0.62) 18%,
        rgba(30,125,255,0.42) 38%,
        rgba(0,105,255,0.24) 58%,
        rgba(0,80,220,0.10) 78%,
        rgba(0,120,255,0) 100%
      )
    `,
                }}
            />

            <div
                className="absolute inset-x-0 bottom-[50px] h-[110px] rounded-full opacity-95 blur-[140px]"
                style={{
                    background: `
            linear-gradient(
              90deg,
              rgba(120,190,255,0) 0%,
              rgba(120,190,255,.22) 10%,
              rgba(95,175,255,.36) 24%,
              rgba(70,160,255,.70) 50%,
              rgba(95,175,255,.36) 76%,
              rgba(120,190,255,.22) 90%,
              rgba(120,190,255,0) 100%
            )
          `,
                }}
            />

            {bigStars.map((star, index) => (
                <div
                    key={`big-star-${index}`}
                    className="absolute"
                    style={{
                        width: `${star.size}px`,
                        height: `${star.size}px`,
                        left: star.left,
                        top: star.top,
                    }}
                >
                    <div
                        style={{
                            position: 'absolute',
                            left: '50%',
                            top: '50%',
                            width: '1px',
                            height: '100%',
                            transform: 'translate(-50%, -50%)',
                            borderRadius: '999px',
                            background: 'white',
                            boxShadow:
                                '0 0 6px rgba(255,255,255,.9), 0 0 14px rgba(185,220,255,.72), 0 0 26px rgba(90,160,255,.42)',
                        }}
                    />
                    <div
                        style={{
                            position: 'absolute',
                            left: '50%',
                            top: '50%',
                            width: '100%',
                            height: '1px',
                            transform: 'translate(-50%, -50%)',
                            borderRadius: '999px',
                            background: 'white',
                            boxShadow:
                                '0 0 6px rgba(255,255,255,.9), 0 0 14px rgba(185,220,255,.72), 0 0 26px rgba(90,160,255,.42)',
                        }}
                    />
                </div>
            ))}

            {smallStars.map((star, index) => (
                <div
                    key={`small-star-${index}`}
                    className="absolute rounded-full"
                    style={{
                        width: `${star.w}px`,
                        height: `${star.h}px`,
                        left: star.left,
                        top: star.top,
                        background: star.color,
                        boxShadow:
                            '0 0 4px rgba(255,255,255,.88), 0 0 10px rgba(170,215,255,.7), 0 0 18px rgba(100,175,255,.38)',
                    }}
                />
            ))}

            <canvas
                ref={canvasRef}
                className="absolute inset-0 opacity-75"
                style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
            />
        </div>
    );
}

export default function PageBackground() {
    return (
        <>
            <StarBackground />
            <LightBackground />
        </>
    );
}
