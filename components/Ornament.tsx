
import React from 'react';
import { OrnamentConfig } from '../types';
import { GIFT_BOX_COLORS } from '../constants';

interface OrnamentProps {
  config: OrnamentConfig;
  isClicked: boolean;
  onClick: () => void;
  index: number;
}

const GiftBox: React.FC<{ color: string }> = ({ color }) => (
  <div className="relative w-1/2 h-[45%] flex flex-col items-center justify-end drop-shadow-lg scale-75 md:scale-100">
    <div 
      className="absolute top-[10%] w-[110%] h-[25%] rounded-[4px] z-[3] shadow-md"
      style={{ background: `linear-gradient(to right, ${color}, white 50%, ${color})` }}
    />
    <div className="absolute top-[-15%] w-[40%] h-[25%] flex justify-center z-[4]">
      <div className="w-1/2 h-full bg-[#ffeb3b] rounded-l-full -rotate-12" />
      <div className="w-1/2 h-full bg-[#ffeb3b] rounded-r-full rotate-12" />
      <div className="absolute top-[20%] w-[20%] h-[80%] bg-[#fdd835] rounded-[2px]" />
    </div>
    <div 
      className="w-full h-[75%] rounded-b-[4px] relative shadow-inner"
      style={{ background: color }}
    >
      <div className="absolute left-1/2 top-0 -translate-x-1/2 w-1/5 h-full bg-[#ffeb3b]" />
    </div>
  </div>
);

const Ornament: React.FC<OrnamentProps> = ({ config, isClicked, onClick, index }) => {
  if (isClicked) return null;

  return (
    <div
      onClick={onClick}
      className="absolute cursor-pointer transition-all duration-300 z-30"
      style={{
        top: config.top,
        left: config.left,
        animation: `swing 4s ease-in-out infinite ${index * 0.3}s`,
      }}
    >
      <div
        className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center relative shadow-lg"
        style={{
          background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9) 0%, ${config.color} 40%, rgba(0,0,0,0.4) 100%)`,
          boxShadow: `0 0 15px ${config.glow}`,
        }}
      >
        <div className="absolute top-[-15%] w-[10%] h-[20%] bg-[#b8860b] -z-1" />
        <div className="w-full h-full flex items-center justify-center">
          <GiftBox color={GIFT_BOX_COLORS[index % GIFT_BOX_COLORS.length]} />
        </div>
      </div>
    </div>
  );
};

export default Ornament;
