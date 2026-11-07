import React from 'react';
import { playOof } from '../audio/robloxSounds';

interface NoobTouchControlsProps {
  onResetNoob: () => void;
}

export const NoobTouchControls: React.FC<NoobTouchControlsProps> = ({ onResetNoob }) => {
  const triggerKey = (key: string, isDown: boolean) => {
    window.dispatchEvent(
      new KeyboardEvent(isDown ? 'keydown' : 'keyup', {
        key,
        bubbles: true,
      })
    );
  };

  return (
    <div className="absolute bottom-4 left-4 z-20 flex items-end gap-3 pointer-events-auto select-none">
      {/* Virtual D-pad for easy walking */}
      <div className="bg-black/60 backdrop-blur-2xs p-1.5 rounded-lg border border-white/20 shadow-lg flex flex-col items-center gap-1">
        <button
          onMouseDown={() => triggerKey('w', true)}
          onMouseUp={() => triggerKey('w', false)}
          onTouchStart={() => triggerKey('w', true)}
          onTouchEnd={() => triggerKey('w', false)}
          className="w-9 h-9 rounded bg-white/20 hover:bg-white/30 active:bg-white/50 text-white font-bold flex items-center justify-center text-sm"
        >
          ▲
        </button>
        <div className="flex gap-1">
          <button
            onMouseDown={() => triggerKey('a', true)}
            onMouseUp={() => triggerKey('a', false)}
            onTouchStart={() => triggerKey('a', true)}
            onTouchEnd={() => triggerKey('a', false)}
            className="w-9 h-9 rounded bg-white/20 hover:bg-white/30 active:bg-white/50 text-white font-bold flex items-center justify-center text-sm"
          >
            ◀
          </button>
          <button
            onMouseDown={() => triggerKey('s', true)}
            onMouseUp={() => triggerKey('s', false)}
            onTouchStart={() => triggerKey('s', true)}
            onTouchEnd={() => triggerKey('s', false)}
            className="w-9 h-9 rounded bg-white/20 hover:bg-white/30 active:bg-white/50 text-white font-bold flex items-center justify-center text-sm"
          >
            ▼
          </button>
          <button
            onMouseDown={() => triggerKey('d', true)}
            onMouseUp={() => triggerKey('d', false)}
            onTouchStart={() => triggerKey('d', true)}
            onTouchEnd={() => triggerKey('d', false)}
            className="w-9 h-9 rounded bg-white/20 hover:bg-white/30 active:bg-white/50 text-white font-bold flex items-center justify-center text-sm"
          >
            ▶
          </button>
        </div>
      </div>

      {/* Jump & OOF buttons */}
      <div className="flex flex-col gap-1.5">
        <button
          onMouseDown={() => triggerKey(' ', true)}
          onMouseUp={() => triggerKey(' ', false)}
          onTouchStart={() => triggerKey(' ', true)}
          onTouchEnd={() => triggerKey(' ', false)}
          className="h-9 px-4 rounded-lg bg-green-600 hover:bg-green-500 active:bg-green-700 text-white font-bold shadow-md text-xs flex items-center justify-center border border-green-400"
        >
          JUMP ⤒
        </button>

        <button
          onClick={() => {
            playOof();
            onResetNoob();
          }}
          className="h-9 px-4 rounded-lg bg-red-600/90 hover:bg-red-500 active:bg-red-700 text-white font-bold shadow-md text-xs flex items-center justify-center border border-red-400"
        >
          OOF! (Reset)
        </button>
      </div>
    </div>
  );
};
