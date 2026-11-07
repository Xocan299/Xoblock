import React, { useState } from 'react';
import { PartData } from '../types/studio';
import { playButtonClick } from '../audio/robloxSounds';

interface ExplorerPanelProps {
  parts: PartData[];
  selectedPartId: string | null;
  onSelectPart: (id: string | null) => void;
  onClose?: () => void;
}

export const ExplorerPanel: React.FC<ExplorerPanelProps> = ({
  parts,
  selectedPartId,
  onSelectPart,
  onClose,
}) => {
  const [workspaceOpen, setWorkspaceOpen] = useState(true);
  const [houseOpen, setHouseOpen] = useState(true);
  const [noobOpen, setNoobOpen] = useState(true);
  const [playersOpen, setPlayersOpen] = useState(false);
  const [lightingOpen, setLightingOpen] = useState(false);

  // Group house parts and other parts
  const houseParts = parts.filter(
    (p) =>
      p.id.startsWith('part_wall') ||
      p.id.startsWith('part_gable') ||
      p.id.startsWith('part_roof') ||
      p.id === 'part_door' ||
      p.id === 'part_walkway'
  );

  const baseplatePart = parts.find((p) => p.id === 'part_baseplate');
  const otherParts = parts.filter(
    (p) =>
      p.id !== 'part_baseplate' &&
      !p.id.startsWith('part_wall') &&
      !p.id.startsWith('part_gable') &&
      !p.id.startsWith('part_roof') &&
      p.id !== 'part_door' &&
      p.id !== 'part_walkway'
  );

  const handleSelect = (id: string | null) => {
    playButtonClick();
    onSelectPart(id);
  };

  return (
    <div className="flex flex-col h-full bg-white border-l border-[#828790] select-none text-[11px] font-sans">
      {/* Title Bar */}
      <div className="h-6 bg-gradient-to-r from-[#e3e8ef] to-[#c6d5e5] px-2 flex items-center justify-between border-b border-[#96a9bd] text-[#1e395b] font-semibold text-xs shadow-2xs">
        <div className="flex items-center space-x-1">
          {/* Classic Explorer folder/tree icon */}
          <span className="text-blue-700 text-xs">🗂</span>
          <span>Explorer</span>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={onClose}
            title="Close Panel"
            className="w-4 h-4 hover:bg-red-500 hover:text-white rounded-[2px] flex items-center justify-center text-[10px] text-gray-600"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Tree Content */}
      <div className="flex-1 overflow-y-auto p-1 font-mono text-[11px]">
        {/* Workspace Root Node */}
        <div>
          <div
            onClick={() => setWorkspaceOpen(!workspaceOpen)}
            className="flex items-center space-x-1 py-0.5 px-1 hover:bg-[#e6f1fc] cursor-pointer rounded-[2px]"
          >
            <span className="text-[9px] text-gray-500">{workspaceOpen ? '▼' : '▶'}</span>
            <span className="text-[#2b65a4] text-xs">🌐</span>
            <span className="font-semibold text-gray-800">Workspace</span>
          </div>

          {workspaceOpen && (
            <div className="ml-4 pl-1 border-l border-gray-200 space-y-0.5">
              {/* Camera */}
              <div
                onClick={() => handleSelect('part_camera')}
                className={`flex items-center space-x-1 py-0.5 px-1 cursor-pointer rounded-[2px] ${
                  selectedPartId === 'part_camera' ? 'bg-[#3399ff] text-white' : 'hover:bg-[#e6f1fc]'
                }`}
              >
                <span className="text-gray-500 text-xs">📷</span>
                <span>Camera</span>
              </div>

              {/* Baseplate */}
              {baseplatePart && (
                <div
                  onClick={() => handleSelect(baseplatePart.id)}
                  className={`flex items-center space-x-1 py-0.5 px-1 cursor-pointer rounded-[2px] ${
                    selectedPartId === baseplatePart.id ? 'bg-[#3399ff] text-white' : 'hover:bg-[#e6f1fc]'
                  }`}
                >
                  <div className="w-2.5 h-2.5 bg-[#4ca44c] border border-black/30 rounded-2xs" />
                  <span>{baseplatePart.name}</span>
                </div>
              )}

              {/* Classic House (Model / Group) */}
              <div>
                <div
                  onClick={() => setHouseOpen(!houseOpen)}
                  className="flex items-center space-x-1 py-0.5 px-1 hover:bg-[#e6f1fc] cursor-pointer rounded-[2px]"
                >
                  <span className="text-[9px] text-gray-500">{houseOpen ? '▼' : '▶'}</span>
                  <span className="text-amber-700 text-xs">🏠</span>
                  <span className="font-medium text-gray-800">ClassicHouse (Model)</span>
                </div>

                {houseOpen && (
                  <div className="ml-4 pl-1 border-l border-gray-200 space-y-0.5">
                    {houseParts.map((part) => (
                      <div
                        key={part.id}
                        onClick={() => handleSelect(part.id)}
                        className={`flex items-center space-x-1.5 py-0.5 px-1 cursor-pointer rounded-[2px] ${
                          selectedPartId === part.id ? 'bg-[#3399ff] text-white' : 'hover:bg-[#e6f1fc]'
                        }`}
                      >
                        <div
                          className="w-2.5 h-2.5 border border-black/30 rounded-2xs shrink-0"
                          style={{ backgroundColor: part.brickColor }}
                        />
                        <span className="truncate">{part.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Noob Character Model */}
              <div>
                <div
                  onClick={() => setNoobOpen(!noobOpen)}
                  className="flex items-center space-x-1 py-0.5 px-1 hover:bg-[#e6f1fc] cursor-pointer rounded-[2px]"
                >
                  <span className="text-[9px] text-gray-500">{noobOpen ? '▼' : '▶'}</span>
                  <span className="text-yellow-600 text-xs">👤</span>
                  <span className="font-semibold text-gray-800">Noob (Player)</span>
                </div>

                {noobOpen && (
                  <div className="ml-4 pl-1 border-l border-gray-200 space-y-0.5 text-gray-700">
                    <div className="py-0.2 px-1 hover:bg-[#e6f1fc] flex items-center space-x-1">
                      <div className="w-2 h-2 rounded-full bg-[#f5cd2f]" />
                      <span>Head</span>
                    </div>
                    <div className="py-0.2 px-1 hover:bg-[#e6f1fc] flex items-center space-x-1">
                      <div className="w-2 h-2 bg-[#0d69ac]" />
                      <span>Torso</span>
                    </div>
                    <div className="py-0.2 px-1 hover:bg-[#e6f1fc] flex items-center space-x-1">
                      <div className="w-2 h-2 bg-[#f5cd2f]" />
                      <span>Left Arm</span>
                    </div>
                    <div className="py-0.2 px-1 hover:bg-[#e6f1fc] flex items-center space-x-1">
                      <div className="w-2 h-2 bg-[#f5cd2f]" />
                      <span>Right Arm</span>
                    </div>
                    <div className="py-0.2 px-1 hover:bg-[#e6f1fc] flex items-center space-x-1">
                      <div className="w-2 h-2 bg-[#287f46]" />
                      <span>Left Leg</span>
                    </div>
                    <div className="py-0.2 px-1 hover:bg-[#e6f1fc] flex items-center space-x-1">
                      <div className="w-2 h-2 bg-[#287f46]" />
                      <span>Right Leg</span>
                    </div>
                    <div className="py-0.2 px-1 hover:bg-[#e6f1fc] flex items-center space-x-1 text-gray-500 italic">
                      <span>🤖 Humanoid</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Extra dynamically created parts */}
              {otherParts.map((part) => (
                <div
                  key={part.id}
                  onClick={() => handleSelect(part.id)}
                  className={`flex items-center space-x-1.5 py-0.5 px-1 cursor-pointer rounded-[2px] ${
                    selectedPartId === part.id ? 'bg-[#3399ff] text-white' : 'hover:bg-[#e6f1fc]'
                  }`}
                >
                  <div
                    className="w-2.5 h-2.5 border border-black/30 rounded-2xs shrink-0"
                    style={{ backgroundColor: part.brickColor }}
                  />
                  <span className="truncate">{part.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Players Node */}
        <div>
          <div
            onClick={() => setPlayersOpen(!playersOpen)}
            className="flex items-center space-x-1 py-0.5 px-1 hover:bg-[#e6f1fc] cursor-pointer rounded-[2px]"
          >
            <span className="text-[9px] text-gray-500">{playersOpen ? '▼' : '▶'}</span>
            <span className="text-green-700 text-xs">👥</span>
            <span className="font-semibold text-gray-800">Players</span>
          </div>
          {playersOpen && (
            <div className="ml-4 pl-1 border-l border-gray-200">
              <div className="py-0.5 px-1 flex items-center space-x-1 text-gray-700">
                <span>👤 Player1 (Noob)</span>
              </div>
            </div>
          )}
        </div>

        {/* Lighting Node */}
        <div>
          <div
            onClick={() => setLightingOpen(!lightingOpen)}
            className="flex items-center space-x-1 py-0.5 px-1 hover:bg-[#e6f1fc] cursor-pointer rounded-[2px]"
          >
            <span className="text-[9px] text-gray-500">{lightingOpen ? '▼' : '▶'}</span>
            <span className="text-amber-500 text-xs">💡</span>
            <span className="font-semibold text-gray-800">Lighting</span>
          </div>
          {lightingOpen && (
            <div className="ml-4 pl-1 border-l border-gray-200 space-y-0.5 text-gray-600">
              <div className="py-0.2 px-1">SunLight (1.8)</div>
              <div className="py-0.2 px-1">AmbientLight</div>
              <div className="py-0.2 px-1">Skybox (2008 Clouds)</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
