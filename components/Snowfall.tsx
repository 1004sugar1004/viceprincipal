
import React from 'react';

const Snowfall: React.FC = () => {
  const snowflakes = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    size: Math.random() * 10 + 5,
    duration: Math.random() * 10 + 10,
    delay: Math.random() * 10,
    opacity: Math.random() * 0.5 + 0.3,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {snowflakes.map((s) => (
        <div
          key={s.id}
          className="snowflake"
          style={{
            left: `${s.left}%`,
            fontSize: `${s.size}px`,
            animationDuration: `${s.duration}s`,
            animationDelay: `${s.delay}s`,
            opacity: s.opacity,
          }}
        >
          ❄
        </div>
      ))}
    </div>
  );
};

export default Snowfall;
