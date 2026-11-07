import React, { useState } from 'react';
import { PartData } from '../types/studio';
import { playButtonClick, playPlaceBrick } from '../audio/robloxSounds';

interface ToolboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertModel: (parts: PartData[]) => void;
}

export const ToolboxModal: React.FC<ToolboxModalProps> = ({
  isOpen,
  onClose,
  onInsertModel,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState<'Models' | 'Decals' | 'Meshes'>('Models');

  if (!isOpen) return null;

  const catalogItems = [
    {
      id: 'item_car',
      title: 'Classic Roblox Car',
      author: 'Roblox',
      category: 'Models',
      icon: '🚗',
      parts: [
        {
          id: `car_body_${Date.now()}`,
          name: 'CarChassis',
          className: 'Part' as const,
          brickColor: '#cc292b',
          material: 'Plastic' as const,
          surfaceType: 'Studs' as const,
          position: [8, 1, 14] as [number, number, number],
          size: [4, 1.4, 8] as [number, number, number],
          rotation: [0, 0, 0] as [number, number, number],
          anchored: true,
          canCollide: true,
          transparency: 0,
          reflectance: 0.1,
        },
        {
          id: `car_seat_${Date.now()}`,
          name: 'VehicleSeat',
          className: 'Part' as const,
          brickColor: '#1b2a35',
          material: 'Plastic' as const,
          surfaceType: 'Smooth' as const,
          position: [8, 2, 14] as [number, number, number],
          size: [2, 0.8, 2] as [number, number, number],
          rotation: [0, 0, 0] as [number, number, number],
          anchored: true,
          canCollide: true,
          transparency: 0,
          reflectance: 0,
        },
      ],
    },
    {
      id: 'item_tree',
      title: 'Classic Pine Tree',
      author: 'Builderman',
      category: 'Models',
      icon: '🌲',
      parts: [
        {
          id: `tree_trunk_${Date.now()}`,
          name: 'TreeTrunk',
          className: 'Part' as const,
          brickColor: '#694027',
          material: 'Wood' as const,
          surfaceType: 'Studs' as const,
          position: [-18, 4, 12] as [number, number, number],
          size: [2, 8, 2] as [number, number, number],
          rotation: [0, 0, 0] as [number, number, number],
          anchored: true,
          canCollide: true,
          transparency: 0,
          reflectance: 0,
        },
        {
          id: `tree_leaves_${Date.now()}`,
          name: 'TreeFoliage',
          className: 'Part' as const,
          brickColor: '#27462d',
          material: 'Grass' as const,
          surfaceType: 'Studs' as const,
          position: [-18, 10, 12] as [number, number, number],
          size: [7, 7, 7] as [number, number, number],
          rotation: [0, 0, 0] as [number, number, number],
          anchored: true,
          canCollide: true,
          transparency: 0,
          reflectance: 0,
        },
      ],
    },
    {
      id: 'item_trampoline',
      title: 'Trampoline (Bouncy)',
      author: 'Shedletsky',
      category: 'Models',
      icon: '🎪',
      parts: [
        {
          id: `tramp_pad_${Date.now()}`,
          name: 'TrampolinePad',
          className: 'Part' as const,
          brickColor: '#0d69ac',
          material: 'Plastic' as const,
          surfaceType: 'Studs' as const,
          position: [16, 0.8, 4] as [number, number, number],
          size: [8, 0.6, 8] as [number, number, number],
          rotation: [0, 0, 0] as [number, number, number],
          anchored: true,
          canCollide: true,
          transparency: 0,
          reflectance: 0.2,
        },
      ],
    },
    {
      id: 'item_lamp',
      title: 'Street Lamp',
      author: 'Roblox',
      category: 'Models',
      icon: '💡',
      parts: [
        {
          id: `lamp_post_${Date.now()}`,
          name: 'LampPost',
          className: 'Part' as const,
          brickColor: '#1b2a35',
          material: 'Concrete' as const,
          surfaceType: 'Smooth' as const,
          position: [-6, 5, 26] as [number, number, number],
          size: [0.8, 10, 0.8] as [number, number, number],
          rotation: [0, 0, 0] as [number, number, number],
          anchored: true,
          canCollide: true,
          transparency: 0,
          reflectance: 0,
        },
        {
          id: `lamp_bulb_${Date.now()}`,
          name: 'LampLight',
          className: 'Part' as const,
          brickColor: '#f5cd2f',
          material: 'Plastic' as const,
          surfaceType: 'Smooth' as const,
          position: [-6, 10.5, 26] as [number, number, number],
          size: [1.6, 1.6, 1.6] as [number, number, number],
          rotation: [0, 0, 0] as [number, number, number],
          anchored: true,
          canCollide: true,
          transparency: 0.2,
          reflectance: 0.8,
        },
      ],
    },
  ];

  const filtered = catalogItems.filter(
    (i) =>
      i.category === category &&
      (searchTerm ? i.title.toLowerCase().includes(searchTerm.toLowerCase()) : true)
  );

  const handleInsert = (parts: PartData[]) => {
    playPlaceBrick();
    onInsertModel(parts);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs select-none font-sans">
      <div className="w-[420px] bg-[#f0ede6] border-2 border-[#808080] rounded-[3px] shadow-2xl flex flex-col text-xs text-[#222]">
        {/* Modal Title Bar */}
        <div className="h-7 bg-gradient-to-r from-[#0055ea] via-[#086cfc] to-[#0055ea] text-white px-2.5 flex items-center justify-between font-bold text-xs shadow-xs">
          <div className="flex items-center space-x-1.5">
            <span>📦</span>
            <span>Toolbox - Free Models</span>
          </div>
          <button
            onClick={() => {
              playButtonClick();
              onClose();
            }}
            className="w-5 h-5 bg-[#c82424] hover:bg-red-700 active:bg-[#a01c1c] text-white rounded-[2px] flex items-center justify-center text-xs"
          >
            ✕
          </button>
        </div>

        {/* Toolbar in Toolbox */}
        <div className="p-2 border-b border-[#c8c8c8] flex items-center space-x-2 bg-[#fdfdfd]">
          <div className="flex items-center space-x-1">
            {(['Models', 'Decals', 'Meshes'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-2 py-0.5 rounded-[2px] border text-[11px] ${
                  category === cat
                    ? 'bg-[#3399ff] text-white border-[#1a73e8]'
                    : 'bg-gray-100 hover:bg-gray-200 border-gray-300 text-gray-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search models..."
            className="flex-1 bg-white border border-gray-400 px-2 py-0.5 rounded-[2px] text-[11px] outline-none"
          />
        </div>

        {/* Item Grid */}
        <div className="p-2 grid grid-cols-2 gap-2 max-h-[280px] overflow-y-auto bg-[#faf8f5]">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-2 bg-white border border-[#c4c4c4] hover:border-[#3399ff] rounded-[2px] shadow-xs flex flex-col justify-between"
            >
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-2xl p-1 bg-gray-50 rounded border border-gray-200">{item.icon}</span>
                <div>
                  <div className="font-semibold text-gray-800 text-[11px]">{item.title}</div>
                  <div className="text-[10px] text-gray-500">By {item.author}</div>
                </div>
              </div>

              <button
                onClick={() => handleInsert(item.parts)}
                className="mt-2 w-full py-1 bg-gradient-to-b from-[#e5f1fb] to-[#cbe4f7] hover:from-[#cbe4f7] hover:to-[#a9d2f3] active:bg-[#92c5ed] border border-[#7ca0c5] rounded-[2px] font-semibold text-blue-900 text-[11px] shadow-2xs"
              >
                Insert into Place
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-2 bg-[#eae7df] border-t border-[#c0c0c0] flex justify-end">
          <button
            onClick={() => {
              playButtonClick();
              onClose();
            }}
            className="px-4 py-1 bg-white hover:bg-gray-100 active:bg-gray-200 border border-gray-400 rounded-[2px] font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
