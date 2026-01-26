// frontend/src/components/Soundscape.jsx
import { useEffect, useRef, useState, memo } from 'react';
import { Howl } from 'howler';
import PropTypes from 'prop-types';

const Soundscape = ({ isEnabled = true, season = 'spring' }) => {
  const ambientSound = useRef(null);
  const isNightRef = useRef(false);

  // Detect night time
  const checkIsNight = () => {
    const hour = new Date().getHours();
    return hour >= 18 || hour < 6;
  };

  useEffect(() => {
    isNightRef.current = checkIsNight();
  }, []);

  useEffect(() => {
    if (!isEnabled) return;

    // Initialize ambient sound
    ambientSound.current = new Howl({
      src: ['/sounds/forest.mp3'],
      loop: true,
      volume: 0.3,
      html5: true,
      autoplay: true,
    });

    // Add seasonal sound layers
    const seasonSounds = {
      spring: new Howl({ src: ['/sounds/birds-spring.mp3'], loop: true, volume: 0.2 }),
      summer: new Howl({ src: ['/sounds/crickets-summer.mp3'], loop: true, volume: 0.15 }),
      fall: new Howl({ src: ['/sounds/wind-fall.mp3'], loop: true, volume: 0.25 }),
      winter: new Howl({ src: ['/sounds/winter-silent.mp3'], loop: true, volume: 0.1 }),
    };

    seasonSounds[season].play();

    return () => {
      ambientSound.current?.unload();
      Object.values(seasonSounds).forEach(sound => sound.unload());
    };
  }, [isEnabled, season]);

  // Mute/unmute functionality
  useEffect(() => {
    if (ambientSound.current) {
      ambientSound.current.volume(isEnabled ? 0.3 : 0);
    }
  }, [isEnabled]);

  return null; // This is an audio-only component
};

Soundscape.propTypes = {
  isEnabled: PropTypes.bool,
  season: PropTypes.oneOf(['spring', 'summer', 'fall', 'winter']),
};

export default memo(Soundscape);