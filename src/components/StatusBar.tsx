import React from 'react';
import { GameMode } from '../types/studio';

interface StatusBarProps {
  mode: GameMode;
  partCount: number;
  cameraStats: { x: number; y: number; z: number; fps: number };
}

export const StatusBar: React.FC<StatusBarProps> = ({
  mode,
  partCount,
  cameraStats,
}) => {
  return (
    <div className="h-5 bg-[#edeae5] border-t border-[#b8b8b8] px-2 flex items-center justify-between text-[10.5px] select-none text-gray-700 font-sans shadow-2xs">
      {/* Status string */}
      <div className="flex items-center space-x-2">
        <span className="font-medium text-gray-800">
          {mode === 'play'
            ? 'Running Place1 (Play Solo - Controlling Noob)'
            : mode === 'run'
            ? 'Running Simulation...'
            : 'Ready'}
        </span>
      </div>

      {/* Stats readings (matching classic 2008 bottom bar) */}
      <div className="flex items-center space-x-3 text-gray-600 font-mono text-[10px]">
        <div className="flex items-center space-x-1">
          <span className="text-gray-400">Position:</span>
          <span>
            {cameraStats.x}, {cameraStats.y}, {cameraStats.z}
          </span>
        </div>

        <div className="w-[1px] h-3 bg-gray-300" />

        <div className="flex items-center space-x-1">
          <span className="text-gray-400">Parts:</span>
          <span className="font-semibold text-gray-800">{partCount}</span>
        </div>

        <div className="w-[1px] h-3 bg-gray-300" />

        <div className="flex items-center space-x-1">
          <span className="text-gray-400">FPS:</span>
          <span className="font-semibold text-green-700">{cameraStats.fps || 60}</span>
        </div>
      </div>
    </div>
  );
};
