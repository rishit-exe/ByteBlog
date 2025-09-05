"use client";

import React, { useEffect, useRef, useCallback, useMemo } from 'react';

interface ProfileCardProps {
  avatarUrl: string;
  iconUrl?: string;
  grainUrl?: string;
  behindGradient?: string;
  innerGradient?: string;
  showBehindGradient?: boolean;
  className?: string;
  enableTilt?: boolean;
  enableMobileTilt?: boolean;
  mobileTiltSensitivity?: number;
  miniAvatarUrl?: string;
  name?: string;
  title?: string;
  handle?: string;
  status?: string;
  contactText?: string;
  showUserInfo?: boolean;
  onContactClick?: () => void;
}

const DEFAULT_BEHIND_GRADIENT =
  'radial-gradient(farthest-side circle at var(--pointer-x) var(--pointer-y),hsla(266,100%,90%,var(--card-opacity)) 4%,hsla(266,50%,80%,calc(var(--card-opacity)*0.75)) 10%,hsla(266,25%,70%,calc(var(--card-opacity)*0.5)) 50%,hsla(266,0%,60%,0) 100%),radial-gradient(35% 52% at 55% 20%,#00ffaac4 0%,#073aff00 100%),radial-gradient(100% 100% at 50% 50%,#00c1ffff 1%,#073aff00 76%),conic-gradient(from 124deg at 50% 50%,#c137ffff 0%,#07c6ffff 40%,#07c6ffff 60%,#c137ffff 100%)';

const DEFAULT_INNER_GRADIENT = 'linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)';

const ANIMATION_CONFIG = {
  SMOOTH_DURATION: 600,
  INITIAL_DURATION: 1500,
  INITIAL_X_OFFSET: 70,
  INITIAL_Y_OFFSET: 60,
  DEVICE_BETA_OFFSET: 20
} as const;

const clamp = (value: number, min = 0, max = 100): number => Math.min(Math.max(value, min), max);

const round = (value: number, precision = 3): number => parseFloat(value.toFixed(precision));

const adjust = (value: number, fromMin: number, fromMax: number, toMin: number, toMax: number): number =>
  round(toMin + ((toMax - toMin) * (value - fromMin)) / (fromMax - fromMin));

const easeInOutCubic = (x: number): number => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

const ProfileCardComponent: React.FC<ProfileCardProps> = ({
  avatarUrl = '<Placeholder for avatar URL>',
  iconUrl = '<Placeholder for icon URL>',
  grainUrl = '<Placeholder for grain URL>',
  behindGradient,
  innerGradient,
  showBehindGradient = true,
  className = '',
  enableTilt = true,
  enableMobileTilt = false,
  mobileTiltSensitivity = 5,
  miniAvatarUrl,
  name = 'Javi A. Torres',
  title = 'Software Engineer',
  handle = 'javicodes',
  status = 'Online',
  contactText = 'Contact',
  showUserInfo = true,
  onContactClick
}) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const animationHandlers = useMemo(() => {
    if (!enableTilt) return null;

    let rafId: number | null = null;

    const updateCardTransform = (offsetX: number, offsetY: number, card: HTMLElement, wrap: HTMLElement) => {
      const width = card.clientWidth;
      const height = card.clientHeight;

      const percentX = clamp((100 / width) * offsetX);
      const percentY = clamp((100 / height) * offsetY);

      const centerX = percentX - 50;
      const centerY = percentY - 50;

      // Calculate rotation values - Fixed direction
      const rotateX = round(centerY / 4);  // Mouse up/down tilts up/down
      const rotateY = round(-(centerX / 5)); // Mouse left/right tilts left/right

      // Update CSS variables
      const properties = {
        '--pointer-x': `${percentX}%`,
        '--pointer-y': `${percentY}%`,
        '--background-x': `${adjust(percentX, 0, 100, 35, 65)}%`,
        '--background-y': `${adjust(percentY, 0, 100, 35, 65)}%`,
        '--pointer-from-center': `${clamp(Math.hypot(percentY - 50, percentX - 50) / 50, 0, 1)}`,
        '--pointer-from-top': `${percentY / 100}`,
        '--pointer-from-left': `${percentX / 100}`,
        '--rotate-x': `${rotateX}deg`,
        '--rotate-y': `${rotateY}deg`
      };

      Object.entries(properties).forEach(([property, value]) => {
        wrap.style.setProperty(property, value);
      });

      // Also directly apply transform to ensure it works
      card.style.transform = `translate3d(0, 0, 0.1px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const createSmoothAnimation = (
      duration: number,
      startX: number,
      startY: number,
      card: HTMLElement,
      wrap: HTMLElement
    ) => {
      const startTime = performance.now();
      const targetX = wrap.clientWidth / 2;
      const targetY = wrap.clientHeight / 2;

      const animationLoop = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = clamp(elapsed / duration);
        const easedProgress = easeInOutCubic(progress);

        const currentX = adjust(easedProgress, 0, 1, startX, targetX);
        const currentY = adjust(easedProgress, 0, 1, startY, targetY);

        updateCardTransform(currentX, currentY, card, wrap);

        if (progress < 1) {
          rafId = requestAnimationFrame(animationLoop);
        }
      };

      rafId = requestAnimationFrame(animationLoop);
    };

    return {
      updateCardTransform,
      createSmoothAnimation,
      cancelAnimation: () => {
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      }
    };
  }, [enableTilt]);

  const handlePointerMove = useCallback(
    (event: PointerEvent) => {
      const card = cardRef.current;
      const wrap = wrapRef.current;

      if (!card || !wrap || !animationHandlers) return;

      const rect = card.getBoundingClientRect();
      const offsetX = event.clientX - rect.left;
      const offsetY = event.clientY - rect.top;
      
      animationHandlers.updateCardTransform(offsetX, offsetY, card, wrap);
    },
    [animationHandlers]
  );

  const handlePointerEnter = useCallback(() => {
    const card = cardRef.current;
    const wrap = wrapRef.current;

    if (!card || !wrap || !animationHandlers) return;

    animationHandlers.cancelAnimation();
    wrap.classList.add('active');
    card.classList.add('active');
  }, [animationHandlers]);

  const handlePointerLeave = useCallback(
    (event: PointerEvent) => {
      const card = cardRef.current;
      const wrap = wrapRef.current;

      if (!card || !wrap || !animationHandlers) return;

      animationHandlers.createSmoothAnimation(
        ANIMATION_CONFIG.SMOOTH_DURATION,
        event.offsetX,
        event.offsetY,
        card,
        wrap
      );
      wrap.classList.remove('active');
      card.classList.remove('active');
    },
    [animationHandlers]
  );

  const handleDeviceOrientation = useCallback(
    (event: DeviceOrientationEvent) => {
      const card = cardRef.current;
      const wrap = wrapRef.current;

      if (!card || !wrap || !animationHandlers) return;

      const { beta, gamma } = event;
      if (!beta || !gamma) return;

      animationHandlers.updateCardTransform(
        card.clientHeight / 2 + gamma * mobileTiltSensitivity,
        card.clientWidth / 2 + (beta - ANIMATION_CONFIG.DEVICE_BETA_OFFSET) * mobileTiltSensitivity,
        card,
        wrap
      );
    },
    [animationHandlers, mobileTiltSensitivity]
  );

  useEffect(() => {
    if (!enableTilt || !animationHandlers) return;

    const card = cardRef.current;
    const wrap = wrapRef.current;

    if (!card || !wrap) return;

    const pointerMoveHandler = handlePointerMove as EventListener;
    const pointerEnterHandler = handlePointerEnter as EventListener;
    const pointerLeaveHandler = handlePointerLeave as EventListener;
    const deviceOrientationHandler = handleDeviceOrientation as EventListener;

    const handleClick = () => {
      if (!enableMobileTilt || location.protocol !== 'https:') return;
      if (typeof (window.DeviceMotionEvent as any).requestPermission === 'function') {
        (window.DeviceMotionEvent as any)
          .requestPermission()
          .then((state: string) => {
            if (state === 'granted') {
              window.addEventListener('deviceorientation', deviceOrientationHandler);
            }
          })
          .catch((err: any) => console.error(err));
      } else {
        window.addEventListener('deviceorientation', deviceOrientationHandler);
      }
    };

    card.addEventListener('pointerenter', pointerEnterHandler);
    card.addEventListener('pointermove', pointerMoveHandler);
    card.addEventListener('pointerleave', pointerLeaveHandler);
    card.addEventListener('click', handleClick);

    const initialX = wrap.clientWidth - ANIMATION_CONFIG.INITIAL_X_OFFSET;
    const initialY = ANIMATION_CONFIG.INITIAL_Y_OFFSET;

    animationHandlers.updateCardTransform(initialX, initialY, card, wrap);
    animationHandlers.createSmoothAnimation(ANIMATION_CONFIG.INITIAL_DURATION, initialX, initialY, card, wrap);

    return () => {
      card.removeEventListener('pointerenter', pointerEnterHandler);
      card.removeEventListener('pointermove', pointerMoveHandler);
      card.removeEventListener('pointerleave', pointerLeaveHandler);
      card.removeEventListener('click', handleClick);
      window.removeEventListener('deviceorientation', deviceOrientationHandler);
      animationHandlers.cancelAnimation();
    };
  }, [
    enableTilt,
    enableMobileTilt,
    animationHandlers,
    handlePointerMove,
    handlePointerEnter,
    handlePointerLeave,
    handleDeviceOrientation
  ]);

  const cardStyle = useMemo(
    () =>
      ({
        '--icon': iconUrl ? `url(${iconUrl})` : 'none',
        '--grain': grainUrl ? `url(${grainUrl})` : 'none',
        '--behind-gradient': showBehindGradient ? (behindGradient ?? DEFAULT_BEHIND_GRADIENT) : 'none',
        '--inner-gradient': innerGradient ?? DEFAULT_INNER_GRADIENT
      }) as React.CSSProperties,
    [iconUrl, grainUrl, showBehindGradient, behindGradient, innerGradient]
  );

  const handleContactClick = useCallback(() => {
    onContactClick?.();
  }, [onContactClick]);

  return (
    <div 
      ref={wrapRef} 
      className={`perspective-500 transform-gpu relative touch-none pc-card-wrapper ${className}`.trim()} 
      style={cardStyle}
    >
      {/* Simplified Background Glow Effect */}
      <div 
        className="absolute -inset-2.5 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-[inherit] transition-all duration-300 filter blur-[20px] scale-90 transform-gpu"
      />
      
      <section 
        ref={cardRef} 
        className="h-[70svh] max-h-[480px] grid aspect-[0.718] rounded-[30px] relative bg-blend-color-dodge transition-transform duration-1000 transform-gpu overflow-hidden shadow-2xl pc-card"
        style={{
          backgroundBlendMode: 'color-dodge, normal, normal, normal',
          boxShadow: 'rgba(0, 0, 0, 0.8) calc((var(--pointer-from-left) * 10px) - 3px) calc((var(--pointer-from-top) * 20px) - 6px) 20px -5px',
          transform: 'translate3d(0, 0, 0.1px) rotateX(0deg) rotateY(0deg)',
          backgroundSize: '100% 100%',
          backgroundPosition: '0 0, 0 0, 50% 50%, 0 0',
          backgroundImage: 'none'
        }}
      >
        <div className="absolute inset-px rounded-[30px] transform-gpu" style={{
          backgroundImage: 'url(/file.png)',
          backgroundSize: '135%',
          backgroundPosition: '80% 60%',
          backgroundRepeat: 'no-repeat',
          transform: 'translate3d(0, 0, 0.01px)'
        }}>
          {/* Code Symbols Background - Reduced for Performance */}
          <div className="absolute inset-0 rounded-[30px] z-[2] opacity-20">
            {/* </> Symbol 1 - Top Left */}
            <div className="absolute top-8 left-8 text-5xl font-mono select-none pointer-events-none code-symbol-1">
              &lt;/&gt;
            </div>
            {/* </> Symbol 2 - Top Right */}
            <div className="absolute top-12 right-12 text-4xl font-mono select-none pointer-events-none code-symbol-2">
              &lt;/&gt;
            </div>
            {/* </> Symbol 3 - Bottom Left */}
            <div className="absolute bottom-16 left-12 text-4xl font-mono select-none pointer-events-none code-symbol-3">
              &lt;/&gt;
            </div>
            {/* </> Symbol 4 - Bottom Right */}
            <div className="absolute bottom-8 right-6 text-5xl font-mono select-none pointer-events-none code-symbol-4">
              &lt;/&gt;
            </div>
          </div>

          {/* Simplified Shine Effect */}
          <div 
            className="absolute inset-0 rounded-[30px] transform-gpu z-[3] bg-transparent transition-all duration-300 opacity-30 pc-shine"
            style={{
              background: `radial-gradient(circle at var(--pointer-x) var(--pointer-y), rgba(255,255,255,0.1) 0%, transparent 50%)`
            }}
          />
          
          {/* Simplified Glare Effect */}
          <div 
            className="absolute inset-0 rounded-[30px] transform-gpu z-[4] opacity-20"
            style={{
              transform: 'translate3d(0, 0, 1.1px)',
              background: `radial-gradient(circle at var(--pointer-x) var(--pointer-y), rgba(255,255,255,0.2) 0%, transparent 70%)`
            }}
          />

          {/* Avatar Content */}
          <div className="absolute inset-0 rounded-[30px] overflow-hidden">
            {/* User Info Section */}
            {showUserInfo && (
              <div className="absolute bottom-5 left-5 right-5 z-[2] flex items-center justify-between bg-black/90 backdrop-blur-[20px] rounded-[12px] px-4 py-2 pointer-events-auto shadow-2xl border border-gray-600" style={{
                background: 'linear-gradient(135deg, rgba(0,0,0,0.95) 0%, rgba(20,20,20,0.9) 50%, rgba(0,0,0,0.95) 100%)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.1)'
              }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white flex-shrink-0 shadow-lg">
                    <img
                      src="/mypic.jpg"
                      alt={`${name || 'User'} mini avatar`}
                      loading="lazy"
                      className="w-full h-full object-cover rounded-full"
                                              style={{
                          transform: 'scale(4.0) translate(-3px, 5px)',
                          transformOrigin: 'center',
                        }}
                      onError={e => {
                        const target = e.target as HTMLImageElement;
                        target.style.opacity = '0.5';
                        target.src = '/mypic.jpg';
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-bold text-white leading-none">
                      @{handle}
                    </div>
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Text Content */}
          <div 
            className="absolute inset-0 rounded-[30px] text-center relative z-[5] mix-blend-luminosity"
            style={{
              transform: 'translate3d(calc(var(--pointer-from-left) * -6px + 3px), calc(var(--pointer-from-top) * -6px + 3px), 0.1px)'
            }}
          >
            <div className="w-full absolute top-12 flex flex-col">
              <h3 
                className="font-semibold m-0 text-[min(5svh,3em)] bg-gradient-to-b from-white via-blue-100 to-blue-200 bg-clip-text text-transparent drop-shadow-lg"
                style={{
                  backgroundSize: '1em 1.5em',
                  WebkitTextFillColor: 'transparent',
                  WebkitBackgroundClip: 'text'
                }}
              >
                {name}
              </h3>
              <p 
                className="font-semibold relative -top-3 whitespace-nowrap text-base m-0 mx-auto w-min bg-gradient-to-b from-white via-slate-100 to-slate-200 bg-clip-text text-transparent drop-shadow-md"
                style={{
                  backgroundSize: '1em 1.5em',
                  WebkitTextFillColor: 'transparent',
                  WebkitBackgroundClip: 'text'
                }}
              >
                {title}
              </p>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .perspective-500 {
          perspective: 500px;
        }
        
        .transform-gpu {
          transform: translate3d(0, 0, 0.1px);
        }
        
        .pc-card-wrapper::before {
          filter: contrast(2) saturate(2) blur(36px);
          transform: scale(0.8) translate3d(0, 0, 0.1px);
        }
        
        .pc-card-wrapper:hover::before,
        .pc-card-wrapper.active::before {
          filter: contrast(1) saturate(2) blur(40px) opacity(1);
          transform: scale(0.9) translate3d(0, 0, 0.1px);
        }
        
        .pc-card-wrapper:hover,
        .pc-card-wrapper.active {
          --card-opacity: 1;
        }
        
        .pc-card {
          transition: transform 0.1s ease-out;
        }
        
        .pc-card:hover,
        .pc-card.active {
          transition: none !important;
          transform: translate3d(0, 0, 0.1px) rotateX(var(--rotate-x)) rotateY(var(--rotate-y)) !important;
        }
        
        .pc-card:hover .pc-shine,
        .pc-card.active .pc-shine {
          opacity: 0.6;
        }
        
        /* Glassmorphism Code Symbol Styles */
        .code-symbol-1 {
          color: #87ceeb;
          text-shadow: 0 0 12px #87ceeb, 0 0 24px #87ceeb;
        }
        
        .code-symbol-2 {
          color: #dda0dd;
          text-shadow: 0 0 12px #dda0dd, 0 0 24px #dda0dd;
        }
        
        .code-symbol-3 {
          color: #98fb98;
          text-shadow: 0 0 12px #98fb98, 0 0 24px #98fb98;
        }
        
        .code-symbol-4 {
          color: #f0e68c;
          text-shadow: 0 0 12px #f0e68c, 0 0 24px #f0e68c;
        }
        
        /* Enhanced Glassmorphism Hover Effect */
        .pc-card:hover .code-symbol-1,
        .pc-card:hover .code-symbol-2,
        .pc-card:hover .code-symbol-3,
        .pc-card:hover .code-symbol-4 {
          opacity: 1 !important;
          text-shadow: 
            0 0 8px currentColor,
            0 0 16px currentColor,
            0 0 24px currentColor,
            0 0 32px currentColor;
          transform: scale(1.05);
          transition: all 0.3s ease;
          filter: brightness(1.2);
        }
        
        
        @media (max-width: 768px) {
          .pc-card {
            height: 65svh;
            max-height: 420px;
          }
        }
        
        @media (max-width: 480px) {
          .pc-card {
            height: 55svh;
            max-height: 350px;
          }
        }
        
        @media (max-width: 320px) {
          .pc-card {
            height: 50svh;
            max-height: 300px;
          }
        }
      `}</style>
    </div>
  );
};

const ProfileCard = React.memo(ProfileCardComponent);

export default ProfileCard;
