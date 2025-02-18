import React, { useState, useRef, useEffect } from 'react';

const ProximityVerticalLine = () => {
  const [isNear, setIsNear] = useState(false);
  const lineRef = useRef(null);
  const hitAreaMargin = 20; // Adjust this value for activation distance

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!lineRef.current) return;

      // Get line position
      const lineRect = lineRef.current.getBoundingClientRect();
      const lineCenterX = lineRect.left + lineRect.width / 2;

      // Calculate distance from mouse to line center
      const distance = Math.abs(e.clientX - lineCenterX);

      // Update state based on proximity
      setIsNear(distance <= hitAreaMargin);
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    // Update cursor style for the entire document
    document.body.style.cursor = isNear ? 'pointer' : 'auto';
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [isNear]);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        position: 'relative',
      }}
    >
      <div
        ref={lineRef}
        style={{
          width: '2px',
          height: '100px',
          backgroundColor: 'black',
          position: 'relative',
        }}
      >
        {/* Invisible hit area overlay */}
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
