import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import { GUEST_PHOTOS } from '../constants';

interface OrbitingBubblesProps {
  containerWidth: number;
  containerHeight: number;
}

const OrbitingBubbles: React.FC<OrbitingBubblesProps> = ({ 
  containerWidth, 
  containerHeight 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const bodiesRef = useRef<Map<Matter.Body, string>>(new Map());
  const imageCache = useRef<Map<string, HTMLImageElement>>(new Map());

  useEffect(() => {
    if (!canvasRef.current) return;

    const guests = [
      'Marisa', 'Cleide', 'Wesley', 'Tetê', 'Luiza', 'Geovana',
      'Bruno', 'Silvana', 'Arthur', 'Raiane', 'Alexandre', 'Rose'
    ];

    console.log('OrbitingBubbles montado', { containerWidth, containerHeight });

    // Pre-carregar imagens
    guests.forEach(name => {
      if (GUEST_PHOTOS[name]) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          imageCache.current.set(name, img);
        };
        img.src = GUEST_PHOTOS[name];
      }
    });

    // Criar engine com gravidade leve
    const engine = Matter.Engine.create({
      gravity: { x: 0, y: 0.3, scale: 0.001 }
    });
    engineRef.current = engine;

    const render = Matter.Render.create({
      canvas: canvasRef.current,
      engine: engine,
      options: {
        width: containerWidth,
        height: containerHeight,
        wireframes: false,
        background: 'transparent'
      }
    });
    renderRef.current = render;

    const radius = 40; // raio das bolinhas

    // Criar bolinhas espalhadas pela tela
    const bubbles = guests.map((name, index) => {
      // Espalhar em grade irregular
      const cols = 4;
      const row = Math.floor(index / cols);
      const col = index % cols;
      
      const x = (containerWidth / (cols + 1)) * (col + 1) + (Math.random() - 0.5) * 100;
      const y = 50 + row * 120 + Math.random() * 50;

      console.log(`Criando bolinha ${name} em`, { x, y, radius });

      const bubble = Matter.Bodies.circle(x, y, radius, {
        restitution: 0.8,
        friction: 0.05,
        frictionAir: 0.02,
        density: 0.004,
        render: {
          fillStyle: '#ffffff',
          strokeStyle: '#fb923c',
          lineWidth: 4
        }
      });

      bodiesRef.current.set(bubble, name);
      return bubble;
    });

    console.log(`Total de bolinhas criadas: ${bubbles.length}`);

    // Criar paredes
    const wallThickness = 50;
    const walls = [
      // Chão
      Matter.Bodies.rectangle(
        containerWidth / 2,
        containerHeight + wallThickness / 2,
        containerWidth,
        wallThickness,
        { isStatic: true, render: { fillStyle: 'transparent' } }
      ),
      // Teto
      Matter.Bodies.rectangle(
        containerWidth / 2,
        -wallThickness / 2,
        containerWidth,
        wallThickness,
        { isStatic: true, render: { fillStyle: 'transparent' } }
      ),
      // Paredes laterais
      Matter.Bodies.rectangle(
        -wallThickness / 2,
        containerHeight / 2,
        wallThickness,
        containerHeight,
        { isStatic: true, render: { fillStyle: 'transparent' } }
      ),
      Matter.Bodies.rectangle(
        containerWidth + wallThickness / 2,
        containerHeight / 2,
        wallThickness,
        containerHeight,
        { isStatic: true, render: { fillStyle: 'transparent' } }
      )
    ];

    Matter.World.add(engine.world, [...bubbles, ...walls]);

    // Mouse constraint para arrastar
    const mouse = Matter.Mouse.create(render.canvas);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.1,
        render: { visible: false }
      }
    });

    Matter.World.add(engine.world, mouseConstraint);

    // Click para selecionar convidado
    Matter.Events.on(mouseConstraint, 'mouseup', (event) => {
      const clickedBody = event.source.body;
      if (clickedBody && bodiesRef.current.has(clickedBody)) {
        const guestName = bodiesRef.current.get(clickedBody);
        if (guestName) {
          window.dispatchEvent(new CustomEvent('selectGuest', { detail: guestName }));
          document.getElementById('rsvp')?.scrollIntoView({ behavior: 'smooth' });
          
          // Efeito de "pulo"
          Matter.Body.applyForce(clickedBody, clickedBody.position, { 
            x: (Math.random() - 0.5) * 0.01, 
            y: -0.03 
          });
        }
      }
    });

    // Renderizar imagens
    const renderImages = () => {
      const context = render.canvas.getContext('2d');
      if (!context) return;

      bodiesRef.current.forEach((name, body) => {
        const { x, y } = body.position;
        const r = radius;

        context.save();
        context.beginPath();
        context.arc(x, y, r, 0, 2 * Math.PI);
        context.fillStyle = '#ffffff';
        context.fill();
        context.strokeStyle = '#fb923c';
        context.lineWidth = 4;
        context.stroke();
        context.clip();

        const img = imageCache.current.get(name);
        if (img && img.complete) {
          context.drawImage(img, x - r, y - r, r * 2, r * 2);
        } else {
          // Desenhar inicial
          context.fillStyle = '#fb923c';
          context.font = `bold ${r * 1.2}px Arial`;
          context.textAlign = 'center';
          context.textBaseline = 'middle';
          context.fillText(name.charAt(0), x, y);
        }

        context.restore();
      });
    };

    // Iniciar
    Matter.Render.run(render);
    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    Matter.Events.on(render, 'afterRender', renderImages);

    // Cleanup
    return () => {
      Matter.Events.off(render, 'afterRender', renderImages);
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      Matter.World.clear(engine.world, false);
      Matter.Engine.clear(engine);
      if (render.canvas.remove) render.canvas.remove();
      bodiesRef.current.clear();
    };
  }, [containerWidth, containerHeight]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 pointer-events-auto z-20"
      style={{ 
        touchAction: 'none',
        width: `${containerWidth}px`,
        height: `${containerHeight}px`
      }}
    />
  );
};

export default OrbitingBubbles;
