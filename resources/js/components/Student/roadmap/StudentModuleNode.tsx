import React from 'react';
import { Link } from '@inertiajs/react';

type Props = {
    title: string;
    locked?: boolean;
    done?: boolean;
    index?: number;
    isSubmission?: boolean;
    badge?: {
        icon?: string | null;
    } | null;
    href?: string;
};

export default function StudentModuleNode({
    title,
    locked = false,
    done = false,
    index = 0,
    isSubmission = false,
    badge,
    href,
}: Props) {
    const romanNumerals = [
        'I',
        'II',
        'III',
        'IV',
        'V',
        'VI',
        'VII',
        'VIII',
        'IX',
        'X',
        'XI',
        'XII',
    ];
    const roman = romanNumerals[index] || String(index + 1);

    const hasValidIcon =
        badge?.icon && badge.icon !== 'null' && badge.icon !== '';

    const Wrapper = href && !locked ? Link : 'div';

    /* ── status label ── */
    const statusLabel = done ? 'Completed' : locked ? 'Locked' : 'Available';

    return (
        <div className="relative flex w-full flex-col items-center px-1 sm:px-0">
            <Wrapper
                {...(href && !locked ? { href } : {})}
                className="relative block w-full transition-all duration-300"
                style={{
                    borderRadius: '14px',
                    padding: '2px',
                    /* ── BORDER ──
                       done  : biru terang (light) / biru neon (dark)
                       locked: abu silver (light) / abu gelap (dark)
                       active: biru-ungu gradient */
                    background: done
                        ? 'linear-gradient(135deg, #60a5fa, #3b82f6, #93c5fd)'
                        : locked
                          ? 'linear-gradient(135deg, #cbd5e1, #94a3b8, #cbd5e1)' /* silver */
                          : 'linear-gradient(135deg, #60a5fa, #818cf8, #60a5fa)',
                    boxShadow: done
                        ? '0 0 0 0 transparent, 0 2px 16px rgba(59,130,246,0.25)'
                        : locked
                          ? 'none'
                          : '0 2px 16px rgba(99,102,241,0.2)',
                }}
            >
                {/* ── INNER CARD ── */}
                <div
                    className="flex w-full items-center gap-0 overflow-hidden"
                    style={{
                        borderRadius: '12px',
                        minHeight: '72px',
                        /* light: putih bersih / abu sangat tipis saat locked
                           dark : navy gelap */
                        background: done
                            ? 'var(--mn-done-bg)'
                            : locked
                              ? 'var(--mn-locked-bg)'
                              : 'var(--mn-active-bg)',
                    }}
                >
                    <style>{`
                        /* LIGHT */
                        :root {
                            --mn-done-bg:   #ffffff;
                            --mn-locked-bg: #f1f5f9;
                            --mn-active-bg: #ffffff;
                            --mn-badge-done:   #000000;
                            --mn-badge-locked: #e2e8f0;
                            --mn-badge-active: #000000;
                            --mn-title-done:   #1e40af;
                            --mn-title-locked: #94a3b8;
                            --mn-title-active: #1e3a8a;
                            --mn-status-done:   #3b82f6;
                            --mn-status-locked: #94a3b8;
                            --mn-status-active: #6366f1;
                            --mn-roman-done:   #2563eb;
                            --mn-roman-locked: #94a3b8;
                            --mn-roman-active: #3b82f6;
                            --mn-circuit-opacity: 0.06;
                        }
                        /* DARK */
                        .dark {
                            --mn-done-bg:   linear-gradient(135deg, #0a1f3a 0%, #0d2040 100%);
                            --mn-locked-bg: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                            --mn-active-bg: linear-gradient(135deg, #0f1d40 0%, #0a1530 100%);
                            --mn-badge-done:   #000000;
                            --mn-badge-locked: #1e293b;
                            --mn-badge-active: #000000;
                            --mn-title-done:   #93c5fd;
                            --mn-title-locked: #475569;
                            --mn-title-active: #e2e8f0;
                            --mn-status-done:   #60a5fa;
                            --mn-status-locked: #475569;
                            --mn-status-active: #818cf8;
                            --mn-roman-done:   #f59e0b;
                            --mn-roman-locked: #475569;
                            --mn-roman-active: #f59e0b;
                            --mn-circuit-opacity: 0.12;
                        }
                    `}</style>

                    {/* ── BADGE / ICON — flush left ── */}
                    <div
                        className="relative flex flex-shrink-0 items-center justify-center self-stretch"
                        style={{
                            width: '72px',
                            borderRadius: '10px 0 0 10px',
                            background:
                                'var(--mn-badge-' +
                                (done ? 'done' : locked ? 'locked' : 'active') +
                                ')',
                            overflow: 'hidden',
                        }}
                    >
                        {hasValidIcon ? (
                            <img
                                src={badge?.icon || undefined}
                                className="h-12 w-12 rounded-lg object-cover"
                                alt="badge"
                            />
                        ) : isSubmission ? (
                            /* ★ submission */
                            <div
                                className="flex h-12 w-12 items-center justify-center rounded-full"
                                style={{
                                    background: locked
                                        ? 'radial-gradient(circle, #cbd5e1 0%, #94a3b8 100%)'
                                        : done
                                          ? 'radial-gradient(circle, #60a5fa 0%, #2563eb 100%)'
                                          : 'radial-gradient(circle, #818cf8 0%, #4f46e5 100%)',
                                    boxShadow: locked
                                        ? 'none'
                                        : done
                                          ? '0 0 14px rgba(59,130,246,0.5)'
                                          : '0 0 14px rgba(99,102,241,0.4)',
                                }}
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    className="h-6 w-6"
                                    fill="white"
                                >
                                    <path d="M12 2l2.9 6.3L22 9.3l-5 4.9 1.2 6.9L12 18l-6.2 3.1L7 14.2 2 9.3l7.1-1L12 2z" />
                                </svg>
                            </div>
                        ) : (
                            /* roman numeral badge — lingkaran seperti di gambar */
                            <div
                                className="flex h-12 w-12 items-center justify-center rounded-full"
                                style={{
                                    background: locked
                                        ? /* silver gradient saat locked seperti gambar */
                                          'radial-gradient(circle at 35% 35%, #e2e8f0 0%, #94a3b8 60%, #64748b 100%)'
                                        : done
                                          ? 'radial-gradient(circle at 35% 35%, #fbbf24 0%, #d97706 60%, #92400e 100%)'
                                          : 'radial-gradient(circle at 35% 35%, #fbbf24 0%, #d97706 60%, #92400e 100%)',
                                    boxShadow: locked
                                        ? 'inset 0 2px 4px rgba(255,255,255,0.4), 0 2px 8px rgba(0,0,0,0.15)'
                                        : 'inset 0 2px 4px rgba(255,255,255,0.3), 0 0 14px rgba(251,191,36,0.4)',
                                    border: locked
                                        ? '2px solid #cbd5e1'
                                        : '2px solid rgba(251,191,36,0.6)',
                                }}
                            >
                                <span
                                    className="font-bold select-none"
                                    style={{
                                        fontFamily: 'Orbitron, sans-serif',
                                        fontSize:
                                            roman.length > 3 ? '10px' : '13px',
                                        color: locked ? '#64748b' : '#fff',
                                        textShadow: locked
                                            ? 'none'
                                            : '0 1px 3px rgba(0,0,0,0.4)',
                                    }}
                                >
                                    {roman}
                                </span>
                            </div>
                        )}

                        {/* ── status badge pojok kanan bawah ── */}
                        <div
                            className="absolute right-1.5 bottom-1.5 z-20 flex items-center justify-center"
                            style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                background: done
                                    ? '#2563eb'
                                    : locked
                                      ? '#94a3b8'
                                      : '#3b82f6',
                                border: done
                                    ? '2px solid #fff'
                                    : locked
                                      ? '2px solid #e2e8f0'
                                      : '2px solid #fff',
                                boxShadow: done
                                    ? '0 0 8px rgba(37,99,235,0.6)'
                                    : locked
                                      ? 'none'
                                      : '0 0 8px rgba(59,130,246,0.5)',
                            }}
                        >
                            {locked ? (
                                /* kunci */
                                <svg
                                    viewBox="0 0 16 16"
                                    fill="white"
                                    className="h-2.5 w-2.5"
                                >
                                    <path d="M11 7V5a3 3 0 1 0-6 0v2H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1h-1ZM6 5a2 2 0 1 1 4 0v2H6V5Z" />
                                </svg>
                            ) : done ? (
                                /* centang */
                                <svg
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-2.5 w-2.5"
                                >
                                    <polyline points="2,9 6,13 14,4" />
                                </svg>
                            ) : (
                                /* panah kanan — available */
                                <svg
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-2.5 w-2.5"
                                >
                                    <polyline points="5,3 11,8 5,13" />
                                </svg>
                            )}
                        </div>
                    </div>

                    {/* ── TITLE + STATUS ── */}
                    <div className="relative flex flex-1 flex-col justify-center gap-0.5 overflow-hidden px-4 py-2">
                        <span
                            className="text-sm leading-snug font-bold"
                            style={{
                                fontFamily: 'Orbitron, sans-serif',
                                color:
                                    'var(--mn-title-' +
                                    (done
                                        ? 'done'
                                        : locked
                                          ? 'locked'
                                          : 'active') +
                                    ')',
                            }}
                        >
                            {title}
                        </span>

                        <span
                            className="text-[11px] font-semibold"
                            style={{
                                color:
                                    'var(--mn-status-' +
                                    (done
                                        ? 'done'
                                        : locked
                                          ? 'locked'
                                          : 'active') +
                                    ')',
                            }}
                        >
                            {statusLabel}
                        </span>
                    </div>

                    {/* ── ARROW KANAN (done/active) atau LOCK KANAN (locked) ── */}
                    <div className="flex flex-shrink-0 items-center justify-center pr-4">
                        {locked ? (
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                className="h-5 w-5"
                                style={{ color: 'var(--mn-status-locked)' }}
                            >
                                <rect
                                    x="5"
                                    y="11"
                                    width="14"
                                    height="10"
                                    rx="2.5"
                                    fill="currentColor"
                                    fillOpacity="0.15"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                />
                                <path
                                    d="M8 11V7a4 4 0 0 1 8 0v4"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                />
                                <circle
                                    cx="12"
                                    cy="16"
                                    r="1.5"
                                    fill="currentColor"
                                />
                            </svg>
                        ) : (
                            <div
                                className="flex h-8 w-8 items-center justify-center rounded-full"
                                style={{
                                    background: done ? '#2563eb' : '#4f46e5',
                                    boxShadow: '0 0 10px rgba(59,130,246,0.4)',
                                }}
                            >
                                <svg
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-3.5 w-3.5"
                                >
                                    <polyline points="5,3 11,8 5,13" />
                                </svg>
                            </div>
                        )}
                    </div>
                </div>
            </Wrapper>
        </div>
    );
}
