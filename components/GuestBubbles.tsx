import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import { GUEST_PHOTOS } from '../constants';

interface GuestBubble {
  name: string;
  photo?: string;
}

interface GuestBubblesProps {
  guests?: GuestBubble[];
}

const GuestBubbles: React.FC<GuestBubblesProps> = ({ guests = [] }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const bodiesRef = useRef<Map<Matter.Body, GuestBubble>>(new Map());

  useEffect(() => {
    if (!canvasRef.current) return;

    const defaultGuests: GuestBubble[] = guests.length > 0 ? guests : [
      { name: 'Marisa', photo: GUEST_PHOTOS['Marisa'] },
      { name: 'Cleide', photo: GUEST_PHOTOS['Cleide'] },
      { name: 'Wesley' },
      { name: 'Luiza' },
      { name: 'Tetê' },
      { name: 'Geovana' }
    ];

    // Criar engine e mundo
    const engine = Matter.Engine.create({
      gravity: { x: 0, y: 1, scale: 0.001 }
    });
    engineRef.current = engine;

    const render = Matter.Render.create({
      canvas: canvasRef.current,
      engine: engine,
      options: {
        width: window.innerWidth,
        height: window.innerHeight * 0.7,
        wireframes: false,
        background: 'transparent'
      }
    });
    renderRef.current = render;

    // Criar paredes invisíveis
    const wallThickness = 50;
    const walls = [
      // Chão
      Matter.Bodies.rectangle(
        render.options.width! / 2,
        render.options.height! + wallThickness / 2,
        render.options.width!,
        wallThickness,
        { isStatic: true, render: { fillStyle: 'transparent' } }
      ),
      // Paredes laterais
      Matter.Bodies.rectangle(
        -wallThickness / 2,
        render.options.height! / 2,
        wallThickness,
        render.options.height!,
        { isStatic: true, render: { fillStyle: 'transparent' } }
      ),
      Matter.Bodies.rectangle(
        render.options.width! + wallThickness / 2,
        render.options.height! / 2,
        wallThickness,
        render.options.height!,
        { isStatic: true, render: { fillStyle: 'transparent' } }
      )
    ];

    // Criar bolinhas dos convidados
    const bubbles = defaultGuests.map((guest, index) => {
      const radius = 50;
      const x = (render.options.width! / (defaultGuests.length + 1)) * (index + 1);
      const y = -100 - Math.random() * 200;

      const bubble = Matter.Bodies.circle(x, y, radius, {
        restitution: 0.7,
        friction: 0.1,
        density: 0.001,
        render: {
          fillStyle: '#fb923c',
          strokeStyle: '#ffffff',
          lineWidth: 4
        }
      });

      bodiesRef.current.set(bubble, guest);
      return bubble;
    });

    Matter.World.add(engine.world, [...walls, ...bubbles]);

    // Mouse constraint para arrastar
    const mouse = Matter.Mouse.create(render.canvas);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false }
      }
    });

    Matter.World.add(engine.world, mouseConstraint);

    // Click handler para selecionar convidado
    Matter.Events.on(mouseConstraint, 'mousedown', (event) => {
      const clickedBody = event.source.body;
      if (clickedBody && bodiesRef.current.has(clickedBody)) {
        const guest = bodiesRef.current.get(clickedBody);
        if (guest) {
          // Disparar evento de seleção
          window.dispatchEvent(new CustomEvent('selectGuest', { detail: guest.name }));
          document.getElementById('rsvp')?.scrollIntoView({ behavior: 'smooth' });
          
          // Efeito visual de "pulo"
          Matter.Body.applyForce(clickedBody, clickedBody.position, { x: 0, y: -0.05 });
        }
      }
    });

    // Pre-carregar imagens
    const imageCache = new Map<string, HTMLImageElement>();
    defaultGuests.forEach(guest => {
      if (guest.photo) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          imageCache.set(guest.name, img);
        };
        img.src = guest.photo;
      }
    });

    // Renderizar imagens sobre as bolinhas
    const renderImages = () => {
      const context = render.canvas.getContext('2d');
      if (!context) return;

      bodiesRef.current.forEach((guest, body) => {
        const { x, y } = body.position;
        const radius = (body.circleRadius || 50);

        // Desenhar círculo branco de fundo
        context.save();
        context.beginPath();
        context.arc(x, y, radius, 0, 2 * Math.PI);
        context.fillStyle = '#ffffff';
        context.fill();
        context.strokeStyle = '#fb923c';
        context.lineWidth = 4;
        context.stroke();
        context.clip();

        const cachedImg = imageCache.get(guest.name);
        if (cachedImg && cachedImg.complete) {
          // Desenhar imagem
          context.drawImage(cachedImg, x - radius, y - radius, radius * 2, radius * 2);
        } else {
          // Desenhar inicial
          context.fillStyle = '#fb923c';
          context.font = `bold ${radius * 0.8}px Arial`;
          context.textAlign = 'center';
          context.textBaseline = 'middle';
          context.fillText(guest.name.charAt(0), x, y);
        }

        context.restore();
      });
    };

    // Iniciar renderização
    Matter.Render.run(render);
    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    // Renderizar imagens após cada frame
    Matter.Events.on(render, 'afterRender', renderImages);

    // Resize handler
    const handleResize = () => {
      if (render.canvas && render.options) {
        render.canvas.width = window.innerWidth;
        render.canvas.height = window.innerHeight * 0.7;
        render.options.width = window.innerWidth;
        render.options.height = window.innerHeight * 0.7;
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      Matter.World.clear(engine.world, false);
      Matter.Engine.clear(engine);
      render.canvas.remove();
      bodiesRef.current.clear();
    };
  }, [guests]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-auto z-20"
      style={{ touchAction: 'none' }}
    />
  );
};

export default GuestBubbles;
