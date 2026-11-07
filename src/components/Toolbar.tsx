import React, { useState, useRef, useEffect } from 'react';
import { StudioTool, GameMode } from '../types/studio';
import { playButtonClick, playPlaceBrick } from '../audio/robloxSounds';

interface ToolbarProps {
  mode: GameMode;
  activeTool: StudioTool;
  currentColor: string;
  isAnchoredActive: boolean;
  onSetMode: (mode: GameMode) => void;
  onSelectTool: (tool: StudioTool) => void;
  onColorChange: (color: string) => void;
  onToggleAnchor: () => void;
  onInsertPart: (type: 'Block' | 'Wedge' | 'Cylinder') => void;
  onResetNoob: () => void;
  onToggleToolbox: () => void;
  onSave: () => void;
  onNew: () => void;
}

// Classic 2008 Roblox 32-Color Palette
const ROBLOX_COLORS = [
  { name: 'Bright red', hex: '#cc292b' },
  { name: 'Bright blue', hex: '#0d69ac' },
  { name: 'Bright yellow', hex: '#f5cd2f' },
  { name: 'Bright green', hex: '#4ca44c' },
  { name: 'Dark stone grey', hex: '#5a5e66' },
  { name: 'Medium stone grey', hex: '#9da1a8' },
  { name: 'Light stone grey', hex: '#d3d6db' },
  { name: 'Black', hex: '#1b2a35' },
  { name: 'White', hex: '#f2f3f3' },
  { name: 'Brick yellow', hex: '#e5dcab' },
  { name: 'Pastel blue', hex: '#7db5e8' },
  { name: 'Pastel green', hex: '#7dc282' },
  { name: 'Bright violet', hex: '#6b327c' },
  { name: 'Bright orange', hex: '#da8541' },
  { name: 'Reddish brown', hex: '#694027' },
  { name: 'Sand red', hex: '#957977' },
  { name: 'Medium green', hex: '#287f46' },
  { name: 'Bright bluish green', hex: '#008f9c' },
  { name: 'Cyan', hex: '#00ffff' },
  { name: 'Neon orange', hex: '#d34a05' },
  { name: 'Nougat', hex: '#cc8e68' },
  { name: 'Dark green', hex: '#27462d' },
  { name: 'Earth green', hex: '#193019' },
  { name: 'Navy blue', hex: '#002060' },
];

export const Toolbar: React.FC<ToolbarProps> = ({
  mode,
  activeTool,
  currentColor,
  isAnchoredActive,
  onSetMode,
  onSelectTool,
  onColorChange,
  onToggleAnchor,
  onInsertPart,
  onResetNoob,
  onToggleToolbox,
  onSave,
  onNew,
}) => {
  const [showColorPalette, setShowColorPalette] = useState(false);
  const [showInsertMenu, setShowInsertMenu] = useState(false);
  const [showModeDropdown, setShowModeDropdown] = useState(false);

  const colorBtnRef = useRef<HTMLDivElement>(null);
  const insertBtnRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (colorBtnRef.current && !colorBtnRef.current.contains(e.target as Node)) {
        setShowColorPalette(false);
      }
      if (insertBtnRef.current && !insertBtnRef.current.contains(e.target as Node)) {
        setShowInsertMenu(false);
      }
    };
    window.addEventListener('mousedown', handleOutside);
    return () => window.removeEventListener('mousedown', handleOutside);
  }, []);

  return (
    <div className="bg-[#edeae5] border-b border-[#ababab] select-none text-[11px] font-sans">
      {/* Top Toolbar Row: Classic 2008 Icon Buttons */}
      <div className="flex items-center px-1.5 py-1 space-x-1 overflow-x-auto border-b border-[#dadada]">
        {/* Standard Win File Tools */}
        <div className="flex items-center space-x-0.5">
          <button
            onClick={() => {
              playButtonClick();
              onNew();
            }}
            title="New Place (Ctrl+N)"
            className="w-6 h-6 flex items-center justify-center rounded-[2px] hover:bg-[#cce2f7] hover:border hover:border-[#86b5e3] border border-transparent active:bg-[#b0d2f0]"
          >
            {/* Blank document icon */}
            <svg className="w-3.5 h-3.5 text-[#3070b0]" fill="currentColor" viewBox="0 0 16 16">
              <path d="M4 1v14h8V5l-4-4H4zm4 1.5L10.5 5H8V2.5zM5 2h2v4h4v8H5V2z" />
            </svg>
          </button>
          <button
            onClick={() => {
              playButtonClick();
              alert('Open file dialog');
            }}
            title="Open (Ctrl+O)"
            className="w-6 h-6 flex items-center justify-center rounded-[2px] hover:bg-[#cce2f7] hover:border hover:border-[#86b5e3] border border-transparent active:bg-[#b0d2f0]"
          >
            {/* Open folder icon */}
            <svg className="w-3.5 h-3.5 text-[#d9a224]" fill="currentColor" viewBox="0 0 16 16">
              <path d="M1 3.5A1.5 1.5 0 0 1 2.5 2h3.172a1.5 1.5 0 0 1 1.06.44l1.328 1.33A.5.5 0 0 0 8.414 4H13.5A1.5 1.5 0 0 1 15 5.5v7a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 12.5v-9z" />
            </svg>
          </button>
          <button
            onClick={() => {
              playButtonClick();
              onSave();
            }}
            title="Save Place (Ctrl+S)"
            className="w-6 h-6 flex items-center justify-center rounded-[2px] hover:bg-[#cce2f7] hover:border hover:border-[#86b5e3] border border-transparent active:bg-[#b0d2f0]"
          >
            {/* 3.5-inch Floppy disk icon */}
            <svg className="w-3.5 h-3.5 text-[#305090]" fill="currentColor" viewBox="0 0 16 16">
              <path d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4.5L11.5 1H2zm1 1h7v3H3V2zm0 5h10v6H3V7z" />
            </svg>
          </button>
        </div>

        <div className="w-[1px] h-4 bg-[#c0c0c0] mx-1" />

        {/* Play Solo / Run / Reset (The most iconic 2008 buttons!) */}
        <div className="flex items-center space-x-1 bg-white/70 px-1 py-0.5 rounded border border-[#c4c4c4] shadow-2xs">
          {/* Play Solo button: Green player avatar */}
          <button
            onClick={() => {
              playButtonClick();
              onSetMode('play');
            }}
            title="Play Solo (Play as Noob Character) - F5"
            className={`px-2 h-6 flex items-center space-x-1.5 rounded-[2px] font-bold text-xs transition-colors ${
              mode === 'play'
                ? 'bg-green-600 text-white shadow-inner'
                : 'bg-gradient-to-b from-[#e8f7e8] to-[#c2ecc2] hover:from-[#c2ecc2] hover:to-[#9ddf9d] border border-[#75b875] text-[#145a14]'
            }`}
          >
            <span className="text-[12px] leading-none">▶</span>
            <span className="text-[11px]">Play Solo</span>
          </button>

          {/* Run button: Green runner */}
          <button
            onClick={() => {
              playButtonClick();
              onSetMode('run');
            }}
            title="Run Simulation (Physics without player) - F6"
            className={`w-6 h-6 flex items-center justify-center rounded-[2px] transition-colors ${
              mode === 'run'
                ? 'bg-amber-600 text-white'
                : 'hover:bg-[#cce2f7] hover:border hover:border-[#86b5e3] border border-transparent'
            }`}
          >
            <span className="text-green-700 font-bold text-xs">⚡</span>
          </button>

          {/* Pause */}
          <button
            onClick={() => {
              playButtonClick();
              alert('Simulation Paused');
            }}
            title="Pause Simulation"
            className="w-6 h-6 flex items-center justify-center rounded-[2px] hover:bg-[#cce2f7] hover:border hover:border-[#86b5e3] border border-transparent text-gray-700 font-bold text-xs"
          >
            ❚❚
          </button>

          {/* Stop / Reset button: Red Square */}
          <button
            onClick={() => {
              playButtonClick();
              onSetMode('edit');
              onResetNoob();
            }}
            title="Stop / Reset to Edit Mode - Shift+F5"
            className={`px-2 h-6 flex items-center space-x-1.5 rounded-[2px] font-bold text-xs transition-colors ${
              mode === 'edit'
                ? 'bg-gray-200 text-gray-700 border border-gray-300'
                : 'bg-red-600 text-white hover:bg-red-700'
            }`}
          >
            <span className="w-2.5 h-2.5 bg-red-600 border border-red-800 rounded-[1px] inline-block -mt-0.5" />
            <span className="text-[11px]">Reset</span>
          </button>
        </div>

        <div className="w-[1px] h-4 bg-[#c0c0c0] mx-1" />

        {/* Classic 2008 Studio Tools: Select, Move, Resize, Rotate */}
        <div className="flex items-center space-x-0.5">
          <button
            onClick={() => {
              playButtonClick();
              onSelectTool('select');
            }}
            title="Select Tool"
            className={`w-6 h-6 flex items-center justify-center rounded-[2px] border ${
              activeTool === 'select'
                ? 'bg-[#b6d2ea] border-[#6894c2] shadow-2xs'
                : 'border-transparent hover:bg-[#cce2f7]'
            }`}
          >
            {/* Arrow pointer icon */}
            <svg className="w-3.5 h-3.5 text-[#222]" fill="currentColor" viewBox="0 0 16 16">
              <path d="M14.082 2.182a.5.5 0 0 0-.497-.335l-12 1.5a.5.5 0 0 0-.422.584l2.5 10a.5.5 0 0 0 .918.09l2.846-5.692 5.692 2.846a.5.5 0 0 0 .67-.247l1.5-6.5a.5.5 0 0 0-.707-.246z" />
            </svg>
          </button>

          <button
            onClick={() => {
              playButtonClick();
              onSelectTool('move');
            }}
            title="Move Tool"
            className={`w-6 h-6 flex items-center justify-center rounded-[2px] border ${
              activeTool === 'move'
                ? 'bg-[#b6d2ea] border-[#6894c2] shadow-2xs'
                : 'border-transparent hover:bg-[#cce2f7]'
            }`}
          >
            {/* 4-way move arrow */}
            <span className="text-gray-800 font-bold text-xs">✢</span>
          </button>

          <button
            onClick={() => {
              playButtonClick();
              onSelectTool('resize');
            }}
            title="Resize Tool"
            className={`w-6 h-6 flex items-center justify-center rounded-[2px] border ${
              activeTool === 'resize'
                ? 'bg-[#b6d2ea] border-[#6894c2] shadow-2xs'
                : 'border-transparent hover:bg-[#cce2f7]'
            }`}
          >
            {/* Diagonal scale arrows */}
            <span className="text-gray-800 font-bold text-xs">⤡</span>
          </button>

          <button
            onClick={() => {
              playButtonClick();
              onSelectTool('rotate');
            }}
            title="Rotate Tool"
            className={`w-6 h-6 flex items-center justify-center rounded-[2px] border ${
              activeTool === 'rotate'
                ? 'bg-[#b6d2ea] border-[#6894c2] shadow-2xs'
                : 'border-transparent hover:bg-[#cce2f7]'
            }`}
          >
            {/* Circular rotate */}
            <span className="text-gray-800 font-bold text-xs">↻</span>
          </button>
        </div>

        <div className="w-[1px] h-4 bg-[#c0c0c0] mx-1" />

        {/* Insert Part Button & Dropdown */}
        <div ref={insertBtnRef} className="relative">
          <div className="flex items-center">
            <button
              onClick={() => {
                playButtonClick();
                onInsertPart('Block');
              }}
              title="Insert Block Part"
              className="h-6 px-1.5 flex items-center space-x-1 rounded-l-[2px] bg-gradient-to-b from-[#fbfbfb] to-[#e4e4e4] border border-[#a8a8a8] hover:bg-[#d8e8f8]"
            >
              <div className="w-3.5 h-3 bg-[#4ca44c] border border-[#2b662b] shadow-2xs" />
              <span className="text-[11px] font-medium text-gray-800">Part</span>
            </button>
            <button
              onClick={() => setShowInsertMenu(!showInsertMenu)}
              className="h-6 px-1 bg-gradient-to-b from-[#fbfbfb] to-[#e4e4e4] border-t border-r border-b border-[#a8a8a8] rounded-r-[2px] hover:bg-[#d8e8f8] text-[9px] text-gray-600"
            >
              ▼
            </button>
          </div>

          {showInsertMenu && (
            <div className="absolute top-full left-0 mt-1 w-32 bg-white border border-gray-400 shadow-md py-1 z-50">
              <button
                onClick={() => {
                  onInsertPart('Block');
                  setShowInsertMenu(false);
                }}
                className="w-full text-left px-3 py-1 hover:bg-[#3399ff] hover:text-white flex items-center space-x-2"
              >
                <div className="w-3 h-3 bg-blue-500 border border-blue-700" />
                <span>Block</span>
              </button>
              <button
                onClick={() => {
                  onInsertPart('Wedge');
                  setShowInsertMenu(false);
                }}
                className="w-full text-left px-3 py-1 hover:bg-[#3399ff] hover:text-white flex items-center space-x-2"
              >
                <div className="w-3 h-3 bg-red-500 border border-red-700" />
                <span>Wedge</span>
              </button>
              <button
                onClick={() => {
                  onInsertPart('Cylinder');
                  setShowInsertMenu(false);
                }}
                className="w-full text-left px-3 py-1 hover:bg-[#3399ff] hover:text-white flex items-center space-x-2"
              >
                <div className="w-3 h-3 rounded-full bg-yellow-400 border border-yellow-600" />
                <span>Cylinder</span>
              </button>
            </div>
          )}
        </div>

        <div className="w-[1px] h-4 bg-[#c0c0c0] mx-1" />

        {/* Color Palette & Paint Tool */}
        <div ref={colorBtnRef} className="relative">
          <button
            onClick={() => {
              playButtonClick();
              setShowColorPalette(!showColorPalette);
              onSelectTool('color');
            }}
            title="Color / Paint Tool (Select color and click parts)"
            className={`h-6 px-1.5 flex items-center space-x-1.5 rounded-[2px] border ${
              activeTool === 'color'
                ? 'bg-[#b6d2ea] border-[#6894c2]'
                : 'bg-gradient-to-b from-[#fbfbfb] to-[#e4e4e4] border-[#a8a8a8] hover:bg-[#d8e8f8]'
            }`}
          >
            <div
              className="w-3.5 h-3.5 rounded-[1px] border border-black/40 shadow-2xs"
              style={{ backgroundColor: currentColor }}
            />
            <span className="text-[11px] font-medium text-gray-800">Color</span>
            <span className="text-[8px] text-gray-500">▼</span>
          </button>

          {/* Classic 2008 Color Swatches Popover */}
          {showColorPalette && (
            <div className="absolute top-full left-0 mt-1 p-2 bg-[#f4f2ee] border border-[#7a7a7a] shadow-lg rounded-[2px] z-50 w-52">
              <div className="text-[10px] font-bold text-gray-700 mb-1 border-b pb-0.5">Classic Brick Colors</div>
              <div className="grid grid-cols-6 gap-1">
                {ROBLOX_COLORS.map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => {
                      onColorChange(c.hex);
                      setShowColorPalette(false);
                      playPlaceBrick();
                    }}
                    title={c.name}
                    className="w-6 h-6 border border-black/30 hover:scale-110 hover:border-black transition-transform shadow-xs"
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Anchor Tool */}
        <button
          onClick={() => {
            playButtonClick();
            onToggleAnchor();
          }}
          title="Anchor Selected Part (Locks physics)"
          className={`h-6 px-2 flex items-center space-x-1 rounded-[2px] border transition-colors ${
            isAnchoredActive
              ? 'bg-[#b6d2ea] border-[#6894c2] text-blue-900 font-semibold shadow-2xs'
              : 'bg-gradient-to-b from-[#fbfbfb] to-[#e4e4e4] border-[#a8a8a8] hover:bg-[#d8e8f8] text-gray-700'
          }`}
        >
          <span className="text-xs">⚓</span>
          <span className="text-[11px]">Anchor</span>
        </button>
      </div>

      {/* Sub-bar: Tabs & Quick Action Strip (Exact matching screenshot!) */}
      <div className="flex items-center justify-between px-2 py-0.5 bg-[#e0ddd7] border-t border-[#f4f4f4]">
        {/* Document / Environment Tabs */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onToggleToolbox()}
            className="px-2.5 py-0.5 bg-[#eae7e1] hover:bg-white text-gray-700 rounded-t-[2px] border-t border-l border-r border-[#b0b0b0] text-[11px] font-medium"
          >
            Toolbox
          </button>
          <button className="px-3 py-0.5 bg-white text-[#1e3b61] font-bold rounded-t-[2px] border-t-2 border-t-[#3070b0] border-l border-r border-[#b0b0b0] text-[11px] shadow-2xs">
            Place1
          </button>
        </div>

        {/* Quick buttons from reference image: Toolbox, v Edit Mode, Help..., Fullscreen, Quit */}
        <div className="flex items-center space-x-1.5 text-gray-700">
          <button
            onClick={onToggleToolbox}
            className="px-2 py-0.5 hover:bg-white/80 rounded border border-transparent hover:border-gray-400 transition-colors"
          >
            Toolbox
          </button>

          {/* Edit Mode Dropdown Button */}
          <div className="relative">
            <button
              onClick={() => setShowModeDropdown(!showModeDropdown)}
              className="px-2 py-0.5 bg-white/70 hover:bg-white rounded border border-gray-400 flex items-center space-x-1 font-medium transition-colors"
            >
              <span>▼ {mode === 'play' ? 'Play Solo' : mode === 'run' ? 'Run' : 'Edit Mode'}</span>
            </button>

            {showModeDropdown && (
              <div className="absolute top-full right-0 mt-0.5 w-32 bg-white border border-gray-400 shadow-md py-1 z-50 text-[11px]">
                <button
                  onClick={() => {
                    onSetMode('edit');
                    setShowModeDropdown(false);
                  }}
                  className="w-full text-left px-3 py-1 hover:bg-[#3399ff] hover:text-white"
                >
                  Edit Mode
                </button>
                <button
                  onClick={() => {
                    onSetMode('play');
                    setShowModeDropdown(false);
                  }}
                  className="w-full text-left px-3 py-1 hover:bg-[#3399ff] hover:text-white font-semibold text-green-700 hover:text-white"
                >
                  Play Solo (Noob)
                </button>
                <button
                  onClick={() => {
                    onSetMode('run');
                    setShowModeDropdown(false);
                  }}
                  className="w-full text-left px-3 py-1 hover:bg-[#3399ff] hover:text-white"
                >
                  Run Simulation
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => onResetNoob()}
            title="Reset Character & Play OOF!"
            className="px-2 py-0.5 hover:bg-white/80 rounded border border-transparent hover:border-gray-400 transition-colors text-red-700 font-semibold"
          >
            Reset Noob
          </button>

          <button
            onClick={() => {
              if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen();
              } else {
                document.exitFullscreen();
              }
            }}
            className="px-2 py-0.5 hover:bg-white/80 rounded border border-transparent hover:border-gray-400 transition-colors"
          >
            Fullscreen
          </button>
        </div>
      </div>
    </div>
  );
};
