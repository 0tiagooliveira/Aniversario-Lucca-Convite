
import React, { useState, useEffect, useRef } from 'react';
import { PARTY_DATA } from './constants';
import Hero from './components/Hero';
import Countdown from './components/Countdown';
import Location from './components/Location';
import GiftList from './components/GiftList';
import RSVPForm from './components/RSVPForm';
import GuestAssistant from './components/GuestAssistant';
import LoadingScreen from './components/LoadingScreen';
import { Gift, MapPin, Calendar, CheckCircle, Volume2, VolumeX } from 'lucide-react';

const App: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento inicial
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoading) return; // Não tocar música enquanto carrega
    
    // Tentar reproduzir a música imediatamente
    const playAudio = async () => {
      if (audioRef.current && !isPlaying) {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
          setShowPlayButton(false);
        } catch (error) {
          // Se autoplay for bloqueado, mostrar botão de play
          console.log('Autoplay bloqueado - mostrando botão de play');
          setShowPlayButton(true);
        }
      }
    };

    // Tentar reproduzir após um pequeno delay
    const timer = setTimeout(playAudio, 100);

    return () => clearTimeout(timer);
  }, [isPlaying, isLoading]);

  const handlePlayClick = async () => {
    if (audioRef.current) {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
        setShowPlayButton(false);
      } catch (error) {
        console.error('Erro ao reproduzir:', error);
      }
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen pb-24 bg-[#fdfbf7] text-slate-800">
      {/* Audio Player */}
      <audio
        ref={audioRef}
        loop
        src="/PARABÉNS DA GALINHA PINTADINHA - Clipe Música Oficial - Galinha Pintadinha 4 - Galinha Pintadinha (youtube)_[cut_59sec].mp3"
      />

      {/* Botão de Play inicial (se autoplay bloqueado) */}
      {showPlayButton && (
        <div className="fixed inset-0 z-[300] bg-black/50 backdrop-blur-sm flex items-center justify-center animate-in fade-in">
          <button
            onClick={handlePlayClick}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full shadow-2xl text-xl font-bold flex items-center gap-3 transition-all hover:scale-110 animate-pulse"
          >
            <Volume2 size={32} />
            Clique para Iniciar a Festa! 🎉
          </button>
        </div>
      )}

      {/* Botão de controle de som flutuante */}
      {isPlaying && (
        <button
          onClick={toggleMute}
          className="fixed top-4 right-4 z-[200] bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full shadow-lg transition-all hover:scale-110"
          title={isMuted ? "Ativar som" : "Silenciar"}
        >
          {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>
      )}

      {/* Header / Hero */}
      <Hero />

      <main className="max-w-4xl mx-auto px-4 -mt-16 relative z-30">
        <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden mb-8 border border-orange-50">
          {/* Main Info Card */}
          <div className="p-8 md:p-10 space-y-10">
            <Countdown targetDate={PARTY_DATA.date} />
            
            <div className="grid md:grid-cols-2 gap-8 pt-6 border-t border-slate-100">
              <div className="flex items-start gap-4">
                <div className="bg-orange-100 p-4 rounded-2xl text-orange-600 shadow-sm">
                  <Calendar size={32} />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-slate-700">Quando?</h3>
                  <p className="text-lg text-slate-600">25 de Abril de 2026</p>
                  <p className="text-orange-600 font-bold text-lg">Sábado, às {PARTY_DATA.time}h</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-green-100 p-4 rounded-2xl text-green-700 shadow-sm">
                  <MapPin size={32} />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-slate-700">Onde?</h3>
                  <p className="text-lg text-slate-600">{PARTY_DATA.location.name}</p>
                  <p className="text-slate-500 text-sm leading-snug">{PARTY_DATA.location.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Sections */}
        <section className="space-y-10">
          <div id="rsvp">
            <RSVPForm />
          </div>

          <div id="location">
            <Location />
          </div>

          <div id="gifts">
            <GiftList />
          </div>
        </section>
      </main>

      {/* Floating Chat Button/Widget */}
      <GuestAssistant />

      {/* Bottom Navigation (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-slate-100 px-6 py-4 flex justify-around items-center z-50 md:hidden rounded-t-3xl shadow-[0_-10px_25px_rgba(0,0,0,0.05)]">
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex flex-col items-center gap-1 text-slate-400 hover:text-orange-600 transition-all"
        >
          <Calendar size={22} />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Início</span>
        </button>
        <button 
          onClick={() => document.getElementById('rsvp')?.scrollIntoView({ behavior: 'smooth' })}
          className="flex flex-col items-center gap-1 text-slate-400 hover:text-orange-600 transition-all"
        >
          <CheckCircle size={22} />
          <span className="text-[10px] font-bold uppercase tracking-tighter">RSVP</span>
        </button>
        <button 
          onClick={() => document.getElementById('gifts')?.scrollIntoView({ behavior: 'smooth' })}
          className="flex flex-col items-center gap-1 text-slate-400 hover:text-orange-600 transition-all"
        >
          <Gift size={22} />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Presentes</span>
        </button>
      </nav>

      <footer className="mt-20 py-12 text-center bg-slate-100/50">
        <p className="text-slate-400 font-medium">Primeiro aninho do Lucca • 2026</p>
        <p className="text-slate-300 text-xs mt-2 uppercase tracking-widest">Aventura Garantida</p>
      </footer>
    </div>
  );
};

export default App;
