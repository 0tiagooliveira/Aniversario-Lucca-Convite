
import React, { useState, useEffect } from 'react';

interface Props {
  targetDate: string;
}

const Countdown: React.FC<Props> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState<{ days: number, hours: number, minutes: number, seconds: number } | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft(null);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) return null;

  const TimeUnit = ({ value, label }: { value: number, label: string }) => (
    <div className="flex flex-col items-center">
      <div className="bg-slate-50 w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-2xl shadow-inner mb-1">
        <span className="text-2xl md:text-3xl font-display text-orange-600">{value}</span>
      </div>
      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{label}</span>
    </div>
  );

  return (
    <div className="flex flex-col items-center">
      <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Contagem Regressiva</h4>
      <div className="flex gap-3 md:gap-6">
        <TimeUnit value={timeLeft.days} label="Dias" />
        <TimeUnit value={timeLeft.hours} label="Horas" />
        <TimeUnit value={timeLeft.minutes} label="Minutos" />
        <TimeUnit value={timeLeft.seconds} label="Segundos" />
      </div>
    </div>
  );
};

export default Countdown;
