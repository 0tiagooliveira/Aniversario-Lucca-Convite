import React, { useEffect, useRef, useState } from 'react';
import { GUEST_PHOTOS } from '../constants';

interface Bubble {
  id: string;
  name: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  photo?: string;
  floatAngle: number; // Ângulo de flutuação único
  floatSpeed: number; // Velocidade de flutuação única
  floatRadius: number; // Raio de oscilação único
  confirmed?: boolean;
  showSpeech?: boolean;
  speechMessage?: string;
  greetingPartner?: string; // Nome da bolinha que está cumprimentando
}

interface FloatingBubblesProps {
  containerWidth: number;
  containerHeight: number;
}

// Frases para quem confirmou presença
const confirmedPhrases = [
  "Já confirmei minha presença e você?",
  "Confirmado! Nos vemos lá! 🎉",
  "Presença confirmada! Vai confirmar também?",
  "Já confirmei! Não perca essa festa!",
  "Vou estar lá! E você, já confirmou?",
  "Confirmadíssimo! Te espero lá! 🦁",
  "Já estou confirmado! Confirma logo!",
  "Presença garantida! Confirma a sua!",
  "Que legal o tema da festa é Safari! 🦁🦒",
  "Vai ter Safari no aniversário! 🐘🌿",
  "Animais da selva? Eu vou! 🦓🌴",
  "Safari do Lucca vai ser demais! 🦜🐆",
  "Tema Safari tá incrível! 🦒🦁",
  "Preparando minha roupa de safari! 🧭🦁",
  "Aventura na selva confirmada! 🌿🐘",
  "Safari Party! Confirma logo! 🦓🎉"
];

// Frases de cumprimento quando as bolinhas se encontram
const greetingPhrases = [
  "Oi {name}! Vai no Safari do Lucca? 🦁",
  "E aí {name}! Te vejo lá! 🎉",
  "Olá {name}! Já confirmou? 🦒",
  "{name}! Vai ser incrível! 🐘",
  "Opa {name}! Animado pro Safari? 🦓",
  "{name}! Prepara a roupa! 🌿",
  "Ei {name}! Dia 25 de abril! 📅",
  "Fala {name}! Safari vem aí! 🦜",
  "{name}! Vai ter bolo! 🎂🦁",
  "Oi {name}! Lucca faz 1 ano! 🎈"
];

// Convidados que já confirmaram (adicione os nomes aqui)
const confirmedGuests = [
  'Marisa', 'Cleide', 'Wesley', 'Teté', 'Rose', 'Lucas', 'Antony', 'Papai', 'Mamãe', 'Geovana', 'Sabrina', 'Bruno', 'Luiza', 'Terezinha', 'Anselmo', 'Andréia'
];

const FloatingBubbles: React.FC<FloatingBubblesProps> = ({ containerWidth, containerHeight }) => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [selectedBubble, setSelectedBubble] = useState<Bubble | null>(null);
  const animationRef = useRef<number>();
  const draggingRef = useRef<{ id: string; offsetX: number; offsetY: number } | null>(null);
  const speechTimerRef = useRef<number>();

  const guests = [
    'Marisa', 'Cleide', 'Wesley', 'Teté', 'Rose', 'Lucas', 'Antony', 'Papai', 'Mamãe', 'Geovana', 'Sabrina', 'Bruno', 'Luiza', 'Terezinha', 'Anselmo', 'Andréia'
  ];

  // Raio e configurações responsivas - muito menor no mobile
  const isMobile = containerWidth < 768;
  const radius = isMobile ? 22 : 40;
  const numColumns = isMobile ? 7 : 5; // Mais colunas no mobile para distribuir melhor

  useEffect(() => {
    // Inicializar bolinhas com padrões independentes
    const initialBubbles: Bubble[] = guests.map((name, index) => {
      const cols = numColumns;
      const row = Math.floor(index / cols);
      const col = index % cols;
      const isConfirmed = confirmedGuests.includes(name);
      
      // Espaçamento mais inteligente no mobile
      const spacing = isMobile ? 
        { x: containerWidth / (cols + 1), y: 60 } : 
        { x: containerWidth / (cols + 1), y: 120 };
      
      return {
        id: `bubble-${index}`,
        name,
        x: spacing.x * (col + 1),
        y: isMobile ? 40 + row * spacing.y : 70 + row * spacing.y,
        vx: (Math.random() - 0.5) * (isMobile ? 0.8 : 1.5), // Movimento mais suave no mobile
        vy: (Math.random() - 0.5) * (isMobile ? 0.8 : 1.5),
        photo: GUEST_PHOTOS[name],
        floatAngle: Math.random() * Math.PI * 2,
        floatSpeed: isMobile ? 0.3 + Math.random() * 0.5 : 0.5 + Math.random() * 1, // Mais lento no mobile
        floatRadius: isMobile ? 0.2 + Math.random() * 0.3 : 0.3 + Math.random() * 0.5, // Menos oscilação
        confirmed: isConfirmed,
        showSpeech: false,
        speechMessage: isConfirmed ? confirmedPhrases[Math.floor(Math.random() * confirmedPhrases.length)] : ''
      };
    });

    setBubbles(initialBubbles);
  }, [containerWidth, containerHeight, isMobile, numColumns]);

  // Sistema de balões de fala - desabilitado inicialmente para performance
  useEffect(() => {
    // Aguardar 3 segundos antes de ativar o sistema de balões de fala
    const initialDelay = setTimeout(() => {
      const showRandomSpeech = () => {
        setBubbles(prev => {
          const confirmedBubbles = prev.filter(b => b.confirmed);
          if (confirmedBubbles.length === 0) return prev;

          // Contar quantos balões já estão visíveis
          const visibleSpeechCount = prev.filter(b => b.showSpeech).length;
          
          // Se já tem 3 ou mais balões visíveis, não mostrar novo
          if (visibleSpeechCount >= 3) return prev;

          // Escolher uma bolinha confirmada aleatória que NÃO esteja falando
          const availableBubbles = confirmedBubbles.filter(b => !b.showSpeech);
          if (availableBubbles.length === 0) return prev;
          
          const randomBubble = availableBubbles[Math.floor(Math.random() * availableBubbles.length)];
          
          return prev.map(b => {
            if (b.id === randomBubble.id) {
              return {
                ...b,
                showSpeech: true,
                speechMessage: confirmedPhrases[Math.floor(Math.random() * confirmedPhrases.length)]
              };
            }
            return b;
          });
        });

        // Esconder após 8 segundos
        setTimeout(() => {
          setBubbles(prev => prev.map(b => ({ ...b, showSpeech: false })));
        }, 8000);
      };

      // Mostrar balão a cada 20 segundos
      const interval = setInterval(showRandomSpeech, 20000);
      
      // Mostrar o primeiro após 5 segundos
      const firstTimeout = setTimeout(showRandomSpeech, 5000);

      return () => {
        clearInterval(interval);
        clearTimeout(firstTimeout);
      };
    }, 3000);

    return () => clearTimeout(initialDelay);
  }, []);

  useEffect(() => {
    const animate = () => {
      setBubbles(prev => prev.map(bubble => {
        if (draggingRef.current?.id === bubble.id) return bubble;

        let { x, y, vx, vy, floatAngle, floatSpeed, floatRadius } = bubble;

        // Movimento independente de flutuação (cada bolinha tem seu padrão)
        floatAngle += floatSpeed * 0.01;
        
        // Aplicar movimento flutuante único baseado no ângulo
        const floatForceX = Math.cos(floatAngle) * floatRadius;
        const floatForceY = Math.sin(floatAngle * 1.3) * floatRadius; // Multiplicador diferente para movimento mais orgânico
        
        vx += floatForceX * 0.05;
        vy += floatForceY * 0.05;

        // Atualizar posição
        x += vx;
        y += vy;

        // Colisão com paredes - muda direção
        if (x - radius < 0) {
          x = radius;
          vx = Math.abs(vx) * 0.7;
          floatAngle += Math.PI / 4; // Muda o padrão de flutuação
        }
        if (x + radius > containerWidth) {
          x = containerWidth - radius;
          vx = -Math.abs(vx) * 0.7;
          floatAngle += Math.PI / 4;
        }
        if (y - radius < 0) {
          y = radius;
          vy = Math.abs(vy) * 0.7;
          floatAngle += Math.PI / 4;
        }
        if (y + radius > containerHeight) {
          y = containerHeight - radius;
          vy = -Math.abs(vy) * 0.7;
          floatAngle += Math.PI / 4;
        }

        // Fricção muito leve
        vx *= 0.98;
        vy *= 0.98;

        // Limitar velocidade
        const maxSpeed = 2.5;
        const speed = Math.sqrt(vx * vx + vy * vy);
        if (speed > maxSpeed) {
          vx = (vx / speed) * maxSpeed;
          vy = (vy / speed) * maxSpeed;
        }

        return { ...bubble, x, y, vx, vy, floatAngle };
      }));

      // Verificar colisões entre bolinhas - muda a rota de ambas E CUMPRIMENTAM
      setBubbles(prev => {
        const updated = [...prev];
        for (let i = 0; i < updated.length; i++) {
          for (let j = i + 1; j < updated.length; j++) {
            const dx = updated[j].x - updated[i].x;
            const dy = updated[j].y - updated[i].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const minDist = radius * 2;

            if (distance < minDist) {
              // Colisão detectada - MUDA A ROTA
              const angle = Math.atan2(dy, dx);
              
              // Trocar velocidades e adicionar força de repulsão
              const tempVx = updated[i].vx;
              const tempVy = updated[i].vy;
              
              updated[i].vx = updated[j].vx * 0.8;
              updated[i].vy = updated[j].vy * 0.8;
              updated[j].vx = tempVx * 0.8;
              updated[j].vy = tempVy * 0.8;
              
              // Adicionar força de repulsão
              const repulsionForce = 0.8;
              updated[i].vx -= Math.cos(angle) * repulsionForce;
              updated[i].vy -= Math.sin(angle) * repulsionForce;
              updated[j].vx += Math.cos(angle) * repulsionForce;
              updated[j].vy += Math.sin(angle) * repulsionForce;

              // MUDAR O PADRÃO DE FLUTUAÇÃO de ambas
              updated[i].floatAngle += Math.PI / 3 + Math.random();
              updated[j].floatAngle += Math.PI / 3 + Math.random();
              
              // Opcional: mudar a velocidade de flutuação também
              updated[i].floatSpeed = 0.5 + Math.random() * 1;
              updated[j].floatSpeed = 0.5 + Math.random() * 1;

              // CUMPRIMENTO! (10% de chance, era 20%)
              if (Math.random() < 0.1) {
                // Contar quantos balões já estão visíveis
                const visibleCount = updated.filter(b => b.showSpeech).length;
                
                // Só cumprimentar se houver menos de 3 balões visíveis
                if (visibleCount < 3) {
                  // Escolher aleatoriamente quem vai cumprimentar
                  const greeter = Math.random() < 0.5 ? i : j;
                  const greeted = greeter === i ? j : i;
                  
                  const greetingTemplate = greetingPhrases[Math.floor(Math.random() * greetingPhrases.length)];
                  const greetingMessage = greetingTemplate.replace('{name}', updated[greeted].name);
                  
                  updated[greeter].showSpeech = true;
                  updated[greeter].speechMessage = greetingMessage;
                  updated[greeter].greetingPartner = updated[greeted].name;
                  
                  // Esconder cumprimento após 6 segundos (era 3)
                  setTimeout(() => {
                    setBubbles(prev => prev.map(b => 
                      b.id === updated[greeter].id 
                        ? { ...b, showSpeech: false, greetingPartner: undefined }
                        : b
                    ));
                  }, 6000);
                }
              }

              // Separar bolinhas para evitar sobreposição
              const overlap = minDist - distance;
              const separateX = (dx / distance) * overlap * 0.5;
              const separateY = (dy / distance) * overlap * 0.5;

              updated[i].x -= separateX;
              updated[i].y -= separateY;
              updated[j].x += separateX;
              updated[j].y += separateY;
            }
          }
        }
        return updated;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [containerWidth, containerHeight]);

  const handleMouseDown = (e: React.MouseEvent, bubble: Bubble) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    draggingRef.current = {
      id: bubble.id,
      offsetX: e.clientX - rect.left - radius,
      offsetY: e.clientY - rect.top - radius
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingRef.current) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - draggingRef.current.offsetX;
    const y = e.clientY - rect.top - draggingRef.current.offsetY;

    setBubbles(prev => prev.map(b => 
      b.id === draggingRef.current?.id
        ? { ...b, x, y, vx: 0, vy: 0 }
        : b
    ));
  };

  const handleMouseUp = () => {
    draggingRef.current = null;
  };

  const handleClick = (bubble: Bubble) => {
    if (draggingRef.current) return; // Não abrir se estava arrastando
    
    setSelectedBubble(bubble);
  };

  const closeModal = () => {
    setSelectedBubble(null);
  };

  return (
    <>
      <div 
        className="absolute inset-0 z-10 pointer-events-auto"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {bubbles.map(bubble => (
          <div
            key={bubble.id}
            className={`absolute cursor-pointer transition-transform hover:scale-110 ${bubble.showSpeech ? 'z-[25]' : 'z-[5]'}`}
            style={{
              left: `${bubble.x - radius}px`,
              top: `${bubble.y - radius}px`,
              width: `${radius * 2}px`,
              height: `${radius * 2}px`,
            }}
            onMouseDown={(e) => handleMouseDown(e, bubble)}
            onClick={() => handleClick(bubble)}
          >
            {/* Balão de fala - menor e mais discreto no mobile */}
            {bubble.showSpeech && bubble.speechMessage && (
              <div className={`absolute left-1/2 -translate-x-1/2 animate-in fade-in slide-in-from-bottom-2 z-[100] ${isMobile ? '-top-16 w-36' : '-top-24 w-52'}`}>
                <div className={`relative bg-white rounded-2xl shadow-2xl border-2 border-orange-400 ${isMobile ? 'p-2' : 'p-3'}`}>
                  {/* Nome de quem está falando - esconder no mobile */}
                  {!isMobile && (
                    <div className="flex items-center gap-2 mb-2 pb-2 border-b border-orange-200">
                      <div className="w-6 h-6 rounded-full overflow-hidden ring-2 ring-orange-300 flex-shrink-0">
                        {bubble.photo ? (
                          <img src={bubble.photo} alt={bubble.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-orange-100 flex items-center justify-center text-orange-600 text-xs font-bold">
                            {bubble.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <span className="text-xs font-bold text-orange-600">{bubble.name}</span>
                    </div>
                  )}
                  
                  {/* Mensagem - texto menor no mobile */}
                  <p className={`font-semibold text-slate-800 text-center leading-tight ${isMobile ? 'text-[10px]' : 'text-xs'}`}>
                    {bubble.speechMessage}
                  </p>
                  
                  {/* Ponteiro do balão */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-orange-400"></div>
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-7 border-r-7 border-t-7 border-l-transparent border-r-transparent border-t-white"></div>
                </div>
              </div>
            )}
            
            <div className="w-full h-full rounded-full overflow-hidden ring-4 ring-white shadow-xl bg-white flex items-center justify-center">
              {bubble.photo ? (
                <img 
                  src={bubble.photo} 
                  alt={bubble.name} 
                  className="w-full h-full object-cover"
                  draggable={false}
                  loading="lazy"
                />
              ) : (
                <span className="text-2xl font-bold text-orange-500">
                  {bubble.name.charAt(0)}
                </span>
              )}
            </div>
            
            {/* Nome embaixo da bolinha - esconder no mobile para não poluir */}
            {!isMobile && (
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <span className="text-[9px] font-semibold text-slate-600 bg-white/80 px-1.5 py-0.5 rounded-full shadow-sm">
                  {bubble.name}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal de imagem */}
      {selectedBubble && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in"
          onClick={closeModal}
        >
          <div 
            className="relative max-w-2xl max-h-[80vh] animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute -top-4 -right-4 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center text-slate-600 hover:bg-orange-500 hover:text-white transition-colors z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
              {selectedBubble.photo ? (
                <img 
                  src={selectedBubble.photo} 
                  alt={selectedBubble.name}
                  className="w-full h-full object-contain max-h-[70vh]"
                />
              ) : (
                <div className="w-96 h-96 flex items-center justify-center bg-orange-100">
                  <span className="text-9xl font-bold text-orange-500">
                    {selectedBubble.name.charAt(0)}
                  </span>
                </div>
              )}
              <div className="p-6 text-center">
                <h3 className="text-3xl font-bold text-slate-800">{selectedBubble.name}</h3>
                <p className="text-slate-500 mt-2">Convidado especial do Safari do Lucca</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingBubbles;
