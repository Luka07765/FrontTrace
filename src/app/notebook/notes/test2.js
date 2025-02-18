'use client';

import React, { useState, useRef, useEffect } from 'react';

const ProximityVerticalLine = () => {
  const [isNear, setIsNear] = useState(false);
  const [hitAreaMargin, setHitAreaMargin] = useState(20); // Default proximity margin
  const lineRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!lineRef.current) return;

      const lineRect = lineRef.current.getBoundingClientRect();
      const lineCenterX = lineRect.left + lineRect.width / 2;
      const distance = Math.abs(e.clientX - lineCenterX);

      setIsNear(distance <= hitAreaMargin);
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [hitAreaMargin]); // Reacts to changes in hitAreaMargin

  useEffect(() => {
    document.body.style.cursor = isNear ? 'pointer' : 'auto';
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [isNear]);

  const increaseProximity = () => {
    setHitAreaMargin((prev) => Math.min(prev + 10, 100)); // Limits max margin
  };

  const decreaseProximity = () => {
    setHitAreaMargin((prev) => Math.max(prev - 10, 10)); // Limits min margin
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        position: 'relative',
        flexDirection: 'column',
      }}
    >
      <button onClick={increaseProximity}>Increase Sensitivity</button>
      <button onClick={decreaseProximity}>Decrease Sensitivity</button>
      <div
        ref={lineRef}
        style={{
          width: '2px',
          height: '100px',
          backgroundColor: isNear ? 'red' : 'black',
          position: 'relative',
          marginTop: '20px',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-20px',
            bottom: '-20px',
            left: `-${hitAreaMargin}px`,
            right: `-${hitAreaMargin}px`,
            pointerEvents: 'none',
          }}
        />
      </div>
    </div>
  );
};

export default ProximityVerticalLine;
