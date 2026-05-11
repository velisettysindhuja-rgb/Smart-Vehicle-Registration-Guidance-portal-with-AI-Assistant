import React from 'react';

const SynvoraLogo = ({ className = '', width = "200", height = "60" }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 200 60" 
      width={width} 
      height={height} 
      className={`synvora-logo ${className}`}
      style={{ filter: "drop-shadow(0 4px 10px rgba(0, 229, 255, 0.2))" }}
    >
      <defs>
        <linearGradient id="cyanBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00e5ff" />
          <stop offset="100%" stopColor="#0077ff" />
        </linearGradient>
        <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Stylized Car Icon Group */}
      <g transform="translate(10, 10)" fill="url(#cyanBlueGrad)" filter="url(#logoGlow)">
        <path d="M5 23 L12 10 L28 10 L35 23 C37 23 39 25 39 28 L39 34 L35 34 A4.5 4.5 0 0 0 26 34 L14 34 A4.5 4.5 0 0 0 5 34 L1 34 L1 28 C1 25 3 23 5 23 Z M12.5 13 L8 21 L32 21 L27.5 13 Z" />
        <circle cx="9.5" cy="34" r="3.5" fill="#ffffff" />
        <circle cx="30.5" cy="34" r="3.5" fill="#ffffff" />
      </g>
      
      {/* Text Node */}
      <text 
        x="60" 
        y="42" 
        fontFamily="'Inter', -apple-system, BlinkMacSystemFont, sans-serif" 
        fontWeight="800" 
        fontSize="26" 
        fill="#ffffff" 
        letterSpacing="1.5"
      >
        SYNVORA
      </text>

      {/* Tech Accent Line */}
      <path 
        d="M58 50 L140 50 L150 40" 
        stroke="url(#cyanBlueGrad)" 
        strokeWidth="2" 
        fill="none" 
        filter="url(#logoGlow)"
      />
    </svg>
  );
};

export default SynvoraLogo;
