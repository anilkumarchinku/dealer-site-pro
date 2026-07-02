type CarRentalLoadingAnimationProps = {
    label?: string;
    sublabel?: string;
    className?: string;
    loop?: boolean;
    onAnimationComplete?: () => void;
};

export function CarRentalLoadingAnimation({
    label = "Preparing your dealership website",
    sublabel = "Loading showroom experience",
    className = "",
    loop = true,
    onAnimationComplete,
}: CarRentalLoadingAnimationProps) {
    return (
        <div
            className={`flex min-h-screen w-full items-center justify-center bg-[#f5f1ea] px-6 text-[#0b0e12] ${className}`}
            role="status"
            aria-live="polite"
            aria-label={label}
        >
            <div className="relative flex w-full max-w-[520px] flex-col items-center">
                <div className="absolute inset-x-6 top-6 h-48 rounded-full bg-[#a8793a]/18 blur-3xl" />

                <div className="relative flex aspect-[1.48/1] w-full max-w-[500px] items-center justify-center overflow-hidden rounded-[28px] border border-[#ded6ca] bg-[#fffdf7] shadow-[0_28px_80px_rgba(11,14,18,0.14)]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_34%,rgba(168,121,58,0.16),transparent_48%),linear-gradient(180deg,rgba(255,253,247,0.92),rgba(244,239,230,0.92))]" />
                    <video
                        className="dsp-loader-video relative z-10 h-full w-full object-cover"
                        src="/loaders/dealersite-launch-loader.mp4"
                        autoPlay
                        muted
                        loop={loop}
                        playsInline
                        preload="auto"
                        aria-hidden="true"
                        onEnded={onAnimationComplete}
                    >
                        Loading dealership website
                    </video>
                </div>

                <div className="mt-10 text-center">
                    <p className="text-xl font-black tracking-tight sm:text-2xl">{label}</p>
                    <p className="mt-2 text-sm font-semibold text-[#756f66]">{sublabel}</p>
                </div>

                <div className="mt-6 flex items-center gap-2" aria-hidden="true">
                    <span className="dsp-loader-dot h-2.5 w-2.5 rounded-full bg-[#a8793a]" />
                    <span className="dsp-loader-dot h-2.5 w-2.5 rounded-full bg-[#c79a5b]" />
                    <span className="dsp-loader-dot h-2.5 w-2.5 rounded-full bg-[#7c4f12]" />
                </div>
            </div>

            <style>{`
                .dsp-loader-video {
                    filter: sepia(0.95) saturate(1.45) hue-rotate(348deg) brightness(0.94) contrast(1.08);
                    mix-blend-mode: multiply;
                    transform: scale(1.78) translate3d(0, -0.5%, 0);
                    transform-origin: center;
                }

                .dsp-loader-dot {
                    animation: dsp-loader-pulse 0.92s ease-in-out infinite;
                }

                .dsp-loader-dot:nth-child(2) {
                    animation-delay: 0.14s;
                }

                .dsp-loader-dot:nth-child(3) {
                    animation-delay: 0.28s;
                }

                @keyframes dsp-loader-pulse {
                    0%, 100% { opacity: 0.35; transform: translateY(0) scale(0.86); }
                    50% { opacity: 1; transform: translateY(-4px) scale(1); }
                }

                @media (prefers-reduced-motion: reduce) {
                    .dsp-loader-dot {
                        animation: none;
                    }
                }
            `}</style>
        </div>
    );
}
