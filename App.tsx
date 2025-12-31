import React, { useState, useRef, useEffect } from 'react';
import { FireworksCanvas } from './components/FireworksCanvas';
import { BlessingPlayer } from './components/BlessingPlayer';
import { Gift, Sparkles, Music, VolumeX } from 'lucide-react';

const BLESSING_LINES = [
  "亲爱的雨馨宝宝",
  "这是我们一起迎接的第一个新年",
  "在这个特别的时刻，我想告诉你",
  "你是我高中时光里最美的遇见",
  "看着漫天烟花绽放",
  "我许下的愿望全都是关于你",
  "愿你永远无忧无虑，做快乐的小公主",
  "愿我们的未来，像这烟花一样绚烂",
  "新年快乐",
  "我永远爱你 石雨馨",
];

// Netease Music External Link (Protected by Referer, solved by meta tag in index.html)
const MUSIC_URL = "https://music.163.com/song/media/outer/url?id=3331929289.mp3";

const App: React.FC = () => {
  const [hasStarted, setHasStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleStart = () => {
    setHasStarted(true);
    // Browser requires user interaction to play audio
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((e) => {
          console.error("Audio playback failed:", e);
          setIsPlaying(false);
        });
    }
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-950 text-white selection:bg-pink-500 selection:text-white">
      {/* Background Audio */}
      <audio ref={audioRef} src={MUSIC_URL} loop preload="auto" />

      {/* Visual Layer: Fireworks (Always present but active only after start) */}
      <FireworksCanvas active={hasStarted} />

      {/* Music Control Button (Fixed Top Right) */}
      <div className="fixed top-4 right-4 z-50">
        <button 
          onClick={toggleMusic}
          className={`p-3 rounded-full backdrop-blur-md border transition-all duration-300 ${
            isPlaying 
              ? 'bg-pink-500/20 border-pink-400 text-pink-200 animate-pulse-slow' 
              : 'bg-white/10 border-white/20 text-gray-400'
          } hover:scale-110`}
        >
          {isPlaying ? <Music className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-4">
        
        {!hasStarted ? (
          // Landing Screen
          <div className="flex flex-col items-center animate-fade-in space-y-10 text-center">
             <div className="relative">
               <div className="absolute -inset-4 bg-pink-500/20 blur-xl rounded-full animate-pulse"></div>
               <Gift className="w-24 h-24 text-pink-300 relative z-10 drop-shadow-[0_0_15px_rgba(236,72,153,0.5)]" />
             </div>
             
             <div className="space-y-4">
               <h1 className="text-4xl md:text-6xl font-bold font-serif text-transparent bg-clip-text bg-gradient-to-r from-pink-200 via-rose-300 to-pink-200 drop-shadow-lg">
                 送给石雨馨宝宝的
               </h1>
               <h2 className="text-3xl md:text-5xl font-handwriting text-pink-100">
                 跨年烟花
               </h2>
             </div>

             <div className="flex flex-col items-center space-y-3 mt-8">
               <button 
                 onClick={handleStart}
                 className="group relative px-10 py-4 bg-pink-500/10 hover:bg-pink-500/20 border border-pink-400/50 rounded-full transition-all duration-500 hover:scale-105 hover:shadow-[0_0_30px_rgba(236,72,153,0.4)]"
               >
                 <span className="flex items-center gap-3 text-xl text-pink-100 tracking-widest font-serif">
                   <Sparkles className="w-5 h-5 animate-spin-slow" />
                   开启浪漫
                   <Sparkles className="w-5 h-5 animate-spin-slow" />
                 </span>
               </button>
               
               {/* Audio Hint */}
               <div className="flex items-center gap-2 text-pink-300/50 text-xs font-light tracking-wider">
                 <Music className="w-3 h-3" />
                 <span>推荐开启声音体验更佳 (点击自动播放)</span>
               </div>
             </div>
          </div>
        ) : (
          // Celebration Screen with Cinematic Text
          <div className="w-full h-full flex flex-col items-center justify-center">
             <div className="w-full flex flex-col items-center z-20">
                <div className="mb-4 opacity-80">
                   <h3 className="text-pink-200/60 text-xs font-bold tracking-[0.4em] uppercase border-b border-pink-500/20 pb-2">
                     To: Shi Yuxin
                   </h3>
                </div>
                
                <BlessingPlayer lines={BLESSING_LINES} />
             </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 4s linear infinite;
        }
        .animate-fade-in {
          animation: fadeIn 1.5s ease-out forwards;
        }
        .animate-pulse-slow {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default App;