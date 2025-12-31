import React, { useState, useEffect } from 'react';
import { CountdownTime } from '../types';

interface CountdownProps {
  targetDate: Date;
  onComplete: () => void;
}

export const Countdown: React.FC<CountdownProps> = ({ targetDate, onComplete }) => {
  const calculateTimeLeft = (): CountdownTime => {
    const difference = +targetDate - +new Date();
    
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState<CountdownTime>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      const t = calculateTimeLeft();
      setTimeLeft(t);
      if (t.days === 0 && t.hours === 0 && t.minutes === 0 && t.seconds === 0) {
        onComplete();
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onComplete]);

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center mx-2 md:mx-4">
      <div className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 to-yellow-600 drop-shadow-lg font-mono">
        {value.toString().padStart(2, '0')}
      </div>
      <div className="text-xs md:text-sm text-yellow-100 uppercase tracking-widest mt-1 opacity-80">
        {label}
      </div>
    </div>
  );

  return (
    <div className="flex justify-center items-center p-6 bg-black/30 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl">
      <TimeUnit value={timeLeft.days} label="Days" />
      <div className="text-2xl md:text-4xl text-yellow-500 font-bold mb-4">:</div>
      <TimeUnit value={timeLeft.hours} label="Hours" />
      <div className="text-2xl md:text-4xl text-yellow-500 font-bold mb-4">:</div>
      <TimeUnit value={timeLeft.minutes} label="Mins" />
      <div className="text-2xl md:text-4xl text-yellow-500 font-bold mb-4">:</div>
      <TimeUnit value={timeLeft.seconds} label="Secs" />
    </div>
  );
};