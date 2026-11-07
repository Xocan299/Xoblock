import React, { useState } from 'react';
import { PartData } from '../types/studio';
import { playButtonClick, playPlaceBrick } from '../audio/robloxSounds';

interface PropertiesPanelProps {
  selectedPart: PartData | null;
  onUpdatePart: (id: string, updates: Partial<PartData>) => void;
  onClose?: () => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedPart,
  onUpdatePart,
  onClose,
}) => {
  const [filterText, setFilterText] = useState('N'); // 'N' as seen in the original screenshot!

  if (!selectedPart) {
    return (
      <div className="flex flex-col h-full bg-white border-l border-t border-[#828790] select-none text-[11px] font-sans">
        <div className="h-6 bg-gradient-to-r from-[#e3e8ef] to-[#c6d5e5] px-2 flex items-center justify-between border-b border-[#96a9bd] text-[#1e395b] font-semibold text-xs shadow-2xs">
          <div className="flex items-center space-x-1">
            <span className="text-gray-600 text-xs">📋</span>
            <span>Properties</span>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center text-gray-400 italic p-4 text-center">
          No part selected. Click a part in Workspace or Explorer to edit properties.
        </div>
      </div>
    );
  }

  const handleTextChange = (field: keyof PartData, value: string) => {
    onUpdatePart(selectedPart.id, { [field]: value });
  };

  const handleVectorChange = (
    field: 'position' | 'size',
    axisIndex: number,
    value: string
  ) => {
    const num = parseFloat(value);
    if (!isNaN(num)) {
      const current = [...selectedPart[field]] as [number, number, number];
      current[axisIndex] = num;
      onUpdatePart(selectedPart.id, { [field]: current });
      playPlaceBrick();
    }
  };

  const handleCheckboxChange = (field: 'anchored' | 'canCollide', checked: boolean) => {
    playButtonClick();
    onUpdatePart(selectedPart.id, { [field]: checked });
  };

  const handleNumberChange = (field: 'transparency' | 'reflectance', value: string) => {
    const num = parseFloat(value);
    if (!isNaN(num)) {
      onUpdatePart(selectedPart.id, { [field]: Math.max(0, Math.min(1, num)) });
    }
  };

  // Filter properties if filterText has content
  const matchesFilter = (name: string) => {
    if (!filterText.trim()) return true;
    return name.toLowerCase().includes(filterText.toLowerCase());
  };

  return (
    <div className="flex flex-col h-full bg-white border-l border-t border-[#828790] select-none text-[11px] font-sans">
      {/* Title Bar */}
      <div className="h-6 bg-gradient-to-r from-[#e3e8ef] to-[#c6d5e5] px-2 flex items-center justify-between border-b border-[#96a9bd] text-[#1e395b] font-semibold text-xs shadow-2xs">
        <div className="flex items-center space-x-1">
          <span className="text-gray-600 text-xs">📋</span>
          <span>Properties - {selectedPart.name}</span>
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

      {/* Filter Input (Exactly as in screenshot with the 'N' filter!) */}
      <div className="p-1 border-b border-[#d8d8d8] bg-[#f9f9f9] flex items-center space-x-1">
        <span className="text-[10px] text-gray-500">🔍</span>
        <input
          type="text"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          placeholder="Filter properties..."
          className="flex-1 bg-white border border-[#b8b8b8] px-1.5 py-0.5 text-[11px] rounded-[1px] outline-none focus:border-[#3399ff]"
        />
        {filterText && (
          <button
            onClick={() => setFilterText('')}
            className="text-[9px] text-gray-400 hover:text-gray-600 px-1"
          >
            ✕
          </button>
        )}
      </div>

      {/* Properties Table */}
      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-left border-collapse text-[11px]">
          <thead>
            <tr className="bg-[#e4ebf2] text-gray-700 border-b border-[#c8d4e0] font-semibold text-[10px]">
              <th className="px-2 py-1 w-1/2 border-r border-[#d4dce4]">Property</th>
              <th className="px-2 py-1">Value</th>
            </tr>
          </thead>
          <tbody>
            {/* Name */}
            {matchesFilter('Name') && (
              <tr className="border-b border-[#eaeaea] hover:bg-[#f0f6fc]">
                <td className="px-2 py-1 font-medium text-gray-700 border-r border-[#eaeaea]">Name</td>
                <td className="px-2 py-0.5">
                  <input
                    type="text"
                    value={selectedPart.name}
                    onChange={(e) => handleTextChange('name', e.target.value)}
                    className="w-full px-1 py-0.5 border border-transparent hover:border-gray-300 focus:border-[#3399ff] bg-transparent outline-none rounded-[1px]"
                  />
                </td>
              </tr>
            )}

            {/* ClassName */}
            {matchesFilter('ClassName') && (
              <tr className="border-b border-[#eaeaea] bg-gray-50/50">
                <td className="px-2 py-1 font-medium text-gray-700 border-r border-[#eaeaea]">ClassName</td>
                <td className="px-2 py-1 text-gray-500 font-mono text-[10px]">{selectedPart.className}</td>
              </tr>
            )}

            {/* BrickColor */}
            {matchesFilter('BrickColor') && (
              <tr className="border-b border-[#eaeaea] hover:bg-[#f0f6fc]">
                <td className="px-2 py-1 font-medium text-gray-700 border-r border-[#eaeaea]">BrickColor</td>
                <td className="px-2 py-0.5 flex items-center space-x-1.5">
                  <input
                    type="color"
                    value={selectedPart.brickColor}
                    onChange={(e) => handleTextChange('brickColor', e.target.value)}
                    className="w-5 h-4 cursor-pointer border border-gray-400 rounded-2xs p-0 bg-transparent"
                  />
                  <span className="font-mono text-[10px] text-gray-700 uppercase">
                    {selectedPart.brickColor}
                  </span>
                </td>
              </tr>
            )}

            {/* Material */}
            {matchesFilter('Material') && (
              <tr className="border-b border-[#eaeaea] hover:bg-[#f0f6fc]">
                <td className="px-2 py-1 font-medium text-gray-700 border-r border-[#eaeaea]">Material</td>
                <td className="px-2 py-0.5">
                  <select
                    value={selectedPart.material}
                    onChange={(e) =>
                      onUpdatePart(selectedPart.id, {
                        material: e.target.value as PartData['material'],
                      })
                    }
                    className="w-full px-1 py-0.5 border border-transparent hover:border-gray-300 focus:border-[#3399ff] bg-transparent outline-none rounded-[1px] text-[11px]"
                  >
                    <option value="Plastic">Plastic</option>
                    <option value="Wood">Wood</option>
                    <option value="Slate">Slate</option>
                    <option value="Concrete">Concrete</option>
                    <option value="CorrodedMetal">CorrodedMetal</option>
                    <option value="DiamondPlate">DiamondPlate</option>
                    <option value="Foil">Foil</option>
                    <option value="Grass">Grass</option>
                    <option value="Ice">Ice</option>
                    <option value="Brick">Brick</option>
                  </select>
                </td>
              </tr>
            )}

            {/* Position */}
            {matchesFilter('Position') && (
              <tr className="border-b border-[#eaeaea] hover:bg-[#f0f6fc]">
                <td className="px-2 py-1 font-medium text-gray-700 border-r border-[#eaeaea]">Position</td>
                <td className="px-2 py-0.5">
                  <div className="flex items-center space-x-1 font-mono text-[10px]">
                    <span className="text-red-600 font-bold">X:</span>
                    <input
                      type="number"
                      step="0.5"
                      value={selectedPart.position[0]}
                      onChange={(e) => handleVectorChange('position', 0, e.target.value)}
                      className="w-10 px-0.5 border border-gray-300 rounded-[1px]"
                    />
                    <span className="text-green-600 font-bold">Y:</span>
                    <input
                      type="number"
                      step="0.5"
                      value={selectedPart.position[1]}
                      onChange={(e) => handleVectorChange('position', 1, e.target.value)}
                      className="w-10 px-0.5 border border-gray-300 rounded-[1px]"
                    />
                    <span className="text-blue-600 font-bold">Z:</span>
                    <input
                      type="number"
                      step="0.5"
                      value={selectedPart.position[2]}
                      onChange={(e) => handleVectorChange('position', 2, e.target.value)}
                      className="w-10 px-0.5 border border-gray-300 rounded-[1px]"
                    />
                  </div>
                </td>
              </tr>
            )}

            {/* Size */}
            {matchesFilter('Size') && (
              <tr className="border-b border-[#eaeaea] hover:bg-[#f0f6fc]">
                <td className="px-2 py-1 font-medium text-gray-700 border-r border-[#eaeaea]">Size</td>
                <td className="px-2 py-0.5">
                  <div className="flex items-center space-x-1 font-mono text-[10px]">
                    <span>W:</span>
                    <input
                      type="number"
                      step="0.5"
                      value={selectedPart.size[0]}
                      onChange={(e) => handleVectorChange('size', 0, e.target.value)}
                      className="w-10 px-0.5 border border-gray-300 rounded-[1px]"
                    />
                    <span>H:</span>
                    <input
                      type="number"
                      step="0.5"
                      value={selectedPart.size[1]}
                      onChange={(e) => handleVectorChange('size', 1, e.target.value)}
                      className="w-10 px-0.5 border border-gray-300 rounded-[1px]"
                    />
                    <span>D:</span>
                    <input
                      type="number"
                      step="0.5"
                      value={selectedPart.size[2]}
                      onChange={(e) => handleVectorChange('size', 2, e.target.value)}
                      className="w-10 px-0.5 border border-gray-300 rounded-[1px]"
                    />
                  </div>
                </td>
              </tr>
            )}

            {/* Anchored */}
            {matchesFilter('Anchored') && (
              <tr className="border-b border-[#eaeaea] hover:bg-[#f0f6fc]">
                <td className="px-2 py-1 font-medium text-gray-700 border-r border-[#eaeaea]">Anchored</td>
                <td className="px-2 py-1">
                  <input
                    type="checkbox"
                    checked={selectedPart.anchored}
                    onChange={(e) => handleCheckboxChange('anchored', e.target.checked)}
                    className="cursor-pointer"
                  />
                </td>
              </tr>
            )}

            {/* CanCollide */}
            {matchesFilter('CanCollide') && (
              <tr className="border-b border-[#eaeaea] hover:bg-[#f0f6fc]">
                <td className="px-2 py-1 font-medium text-gray-700 border-r border-[#eaeaea]">CanCollide</td>
                <td className="px-2 py-1">
                  <input
                    type="checkbox"
                    checked={selectedPart.canCollide}
                    onChange={(e) => handleCheckboxChange('canCollide', e.target.checked)}
                    className="cursor-pointer"
                  />
                </td>
              </tr>
            )}

            {/* Transparency */}
            {matchesFilter('Transparency') && (
              <tr className="border-b border-[#eaeaea] hover:bg-[#f0f6fc]">
                <td className="px-2 py-1 font-medium text-gray-700 border-r border-[#eaeaea]">Transparency</td>
                <td className="px-2 py-0.5">
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    value={selectedPart.transparency}
                    onChange={(e) => handleNumberChange('transparency', e.target.value)}
                    className="w-16 px-1 py-0.5 border border-gray-300 rounded-[1px] text-[10px]"
                  />
                </td>
              </tr>
            )}

            {/* Reflectance */}
            {matchesFilter('Reflectance') && (
              <tr className="border-b border-[#eaeaea] hover:bg-[#f0f6fc]">
                <td className="px-2 py-1 font-medium text-gray-700 border-r border-[#eaeaea]">Reflectance</td>
                <td className="px-2 py-0.5">
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    value={selectedPart.reflectance}
                    onChange={(e) => handleNumberChange('reflectance', e.target.value)}
                    className="w-16 px-1 py-0.5 border border-gray-300 rounded-[1px] text-[10px]"
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
