import React, { useState, useEffect } from 'react';

interface BlessingPlayerProps {
  lines: string[];
}

export const BlessingPlayer: React.FC<BlessingPlayerProps> = ({ lines }) => {
  const [index, setIndex] = useState(0);
  const [show, setShow] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (index >= lines.length) {
      setIsComplete(true);
      return;
    }

    // Reset state for new line
    setShow(false);

    // Sequence: Fade In -> Wait -> Fade Out -> Next Line

    // 1. Fade/Blur In
    const fadeInTimer = setTimeout(() => {
      setShow(true);
    }, 100);

    // 2. Fade/Blur Out (Reduced to 2.5s reading time)
    const fadeOutTimer = setTimeout(() => {
      setShow(false);
    }, 2600); 

    // 3. Increment Index (Total cycle ~3.4s)
    const nextLineTimer = setTimeout(() => {
      setIndex((prev) => prev + 1);
    }, 3400);

    return () => {
      clearTimeout(fadeInTimer);
      clearTimeout(fadeOutTimer);
      clearTimeout(nextLineTimer);
    };
  }, [index, lines.length]);

  if (isComplete) {
     return (
        <div className="flex flex-col items-center justify-center mt-8 animate-fade-in">
           {/* Realistic Glowing Heart */}
           <div className="relative w-32 h-32 md:w-48 md:h-48">
              {/* Core Heart */}
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-red-600 animate-heartbeat drop-shadow-[0_0_35px_rgba(220,38,38,0.8)] z-10 relative">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              
              {/* Inner highlight for depth */}
              <svg viewBox="0 0 24 24" fill="currentColor" className="absolute top-0 left-0 w-full h-full text-pink-400 opacity-30 animate-heartbeat" style={{ transform: 'scale(0.9)' }}>
                 <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
           </div>
           
           <style>{`
             @keyframes heartbeat {
               0% { transform: scale(1); }
               15% { transform: scale(1.15); }
               30% { transform: scale(1); }
               45% { transform: scale(1.15); }
               60% { transform: scale(1); }
               100% { transform: scale(1); }
             }
             .animate-heartbeat {
               animation: heartbeat 1.5s infinite cubic-bezier(0.215, 0.61, 0.355, 1);
             }
           `}</style>
        </div>
     );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[300px] px-4 relative">
      <p 
        className="text-3xl md:text-5xl font-handwriting text-pink-100 text-center leading-relaxed transition-all duration-700 ease-in-out absolute w-full"
        style={{ 
          opacity: show ? 1 : 0, 
          filter: show ? 'blur(0px)' : 'blur(12px)',
          transform: show ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(10px)'
        }}
      >
        {lines[index]}
      </p>
    </div>
  );
};