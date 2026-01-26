// frontend/src/components/MatchBurst.jsx
import { useEffect, useRef } from 'react';
import p5 from 'p5';
import PropTypes from 'prop-types';

// Disable p5's Friendly Error System to prevent "pixels undefined" errors
p5.disableFriendlyErrors = true;

const MatchBurst = ({ onComplete }) => {
  const sketchRef = useRef();

  useEffect(() => {
    const sketch = (p) => {
      let particles = [];
      const numParticles = 150;
      const burstRadius = 200;

      p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        
        // Create particles
        for (let i = 0; i < numParticles; i++) {
          particles.push({
            x: p.width / 2,
            y: p.height / 2,
            vx: p.random(-8, 8),
            vy: p.random(-8, 8),
            size: p.random(3, 8),
            color: p.color(
              p.random(200, 255), // Gold/Yellow range
              p.random(150, 255),
              p.random(0, 100),
              p.random(150, 255)
            ),
            life: 255,
            decay: p.random(3, 8),
          });
        }
      };

      p.draw = () => {
        p.clear();
        
        // Update and draw particles
        for (let i = particles.length - 1; i >= 0; i--) {
          const particle = particles[i];
          
          // Update position
          particle.x += particle.vx;
          particle.y += particle.vy;
          particle.vy += 0.1; // gravity
          particle.life -= particle.decay;
          
          // Fade out
          const alpha = p.map(particle.life, 0, 255, 0, 255);
          particle.color.setAlpha(alpha);
          
          // Draw particle
          p.fill(particle.color);
          p.noStroke();
          p.ellipse(particle.x, particle.y, particle.size);
          
          // Remove dead particles
          if (particle.life <= 0) {
            particles.splice(i, 1);
          }
        }
        
        // Complete when all particles are dead
        if (particles.length === 0) {
          onComplete();
        }
      };

      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
      };
    };

    const p5Instance = new p5(sketch, sketchRef.current);

    // Auto-cleanup after 5 seconds just in case
    const timeout = setTimeout(() => {
      onComplete();
    }, 5000);

    return () => {
      clearTimeout(timeout);
      p5Instance.remove();
    };
  }, [onComplete]);

  return (
    <div
      ref={sketchRef}
      className="fixed inset-0 pointer-events-none z-50"
    />
  );
};

MatchBurst.propTypes = {
  onComplete: PropTypes.func.isRequired,
};

export default MatchBurst;