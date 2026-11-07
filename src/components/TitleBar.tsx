import React from 'react';

interface TitleBarProps {
  onMinimize?: () => void;
  onMaximize?: () => void;
  onClose?: () => void;
}

export const TitleBar: React.FC<TitleBarProps> = ({
  onMinimize,
  onMaximize,
  onClose,
}) => {
  return (
    <div className="h-[30px] bg-gradient-to-b from-[#ffffff] via-[#e5eef7] to-[#d0dfea] border-b border-[#a0b8cc] flex items-center justify-between px-2 select-none text-xs text-[#1e395b] font-sans shadow-xs">
      {/* Title & Icon */}
      <div className="flex items-center space-x-1.5 font-medium">
        {/* Classic 2008 Roblox red R block icon */}
        <div className="w-4 h-4 bg-gradient-to-br from-[#e03030] to-[#a31a1a] rounded-[2px] border border-[#801010] flex items-center justify-center text-white font-black text-[10px] leading-none shadow-xs">
          R
        </div>
        <span className="tracking-tight text-[11.5px] font-semibold text-[#1e3b61]">
          Roblox - [Place1]
        </span>
      </div>

      {/* Windows Window Controls */}
      <div className="flex items-center -mr-1">
        <button
          onClick={onMinimize}
          title="Minimize"
          className="w-7 h-5 flex items-center justify-center hover:bg-[#c6daf0] active:bg-[#a9c7e8] border border-transparent rounded-[2px] text-gray-700 text-xs transition-colors"
        >
          <span className="w-2.5 h-[1.5px] bg-[#333] -mt-1 block"></span>
        </button>
        <button
          onClick={onMaximize}
          title="Maximize"
          className="w-7 h-5 flex items-center justify-center hover:bg-[#c6daf0] active:bg-[#a9c7e8] border border-transparent rounded-[2px] text-gray-700 text-xs transition-colors"
        >
          <span className="w-2.5 h-2.5 border border-[#333] block"></span>
        </button>
        <button
          onClick={onClose}
          title="Close"
          className="w-8 h-5 flex items-center justify-center hover:bg-[#e81123] hover:text-white active:bg-[#bf0f1d] border border-transparent rounded-[2px] text-gray-700 text-xs transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  );
};
