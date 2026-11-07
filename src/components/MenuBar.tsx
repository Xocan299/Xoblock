import React, { useState, useEffect, useRef } from 'react';
import { playButtonClick } from '../audio/robloxSounds';

interface MenuBarProps {
  onNew: () => void;
  onOpen: () => void;
  onSave: () => void;
  onPlay: () => void;
  onRun: () => void;
  onStop: () => void;
  onInsertPart: (type: 'Block' | 'Wedge' | 'Cylinder') => void;
  onToggleExplorer: () => void;
  onToggleProperties: () => void;
  onToggleToolbox: () => void;
  onResetNoob: () => void;
  onDeleteSelected: () => void;
  onDuplicateSelected: () => void;
}

export const MenuBar: React.FC<MenuBarProps> = ({
  onNew,
  onOpen,
  onSave,
  onPlay,
  onRun,
  onStop,
  onInsertPart,
  onToggleExplorer,
  onToggleProperties,
  onToggleToolbox,
  onResetNoob,
  onDeleteSelected,
  onDuplicateSelected,
}) => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (barRef.current && !barRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuClick = (menuName: string) => {
    playButtonClick();
    setOpenMenu(openMenu === menuName ? null : menuName);
  };

  const handleAction = (action: () => void) => {
    playButtonClick();
    action();
    setOpenMenu(null);
  };

  const menuItems = [
    {
      name: 'File',
      children: [
        { label: 'New', shortcut: 'Ctrl+N', action: () => onNew() },
        { label: 'Open...', shortcut: 'Ctrl+O', action: () => onOpen() },
        { label: 'Save', shortcut: 'Ctrl+S', action: () => onSave() },
        { divider: true },
        { label: 'Publish to Roblox...', shortcut: '', action: () => alert('Place published to Roblox cloud!') },
        { divider: true },
        { label: 'Exit', shortcut: 'Alt+F4', action: () => alert('Roblox Studio cannot be closed directly.') },
      ],
    },
    {
      name: 'Edit',
      children: [
        { label: 'Undo', shortcut: 'Ctrl+Z', action: () => {} },
        { label: 'Redo', shortcut: 'Ctrl+Y', action: () => {} },
        { divider: true },
        { label: 'Cut', shortcut: 'Ctrl+X', action: () => {} },
        { label: 'Copy', shortcut: 'Ctrl+C', action: () => {} },
        { label: 'Paste', shortcut: 'Ctrl+V', action: () => {} },
        { label: 'Duplicate', shortcut: 'Ctrl+D', action: () => onDuplicateSelected() },
        { label: 'Delete', shortcut: 'Del', action: () => onDeleteSelected() },
      ],
    },
    {
      name: 'View',
      children: [
        { label: 'Explorer', shortcut: '', action: () => onToggleExplorer() },
        { label: 'Properties', shortcut: '', action: () => onToggleProperties() },
        { label: 'Toolbox', shortcut: '', action: () => onToggleToolbox() },
        { divider: true },
        { label: 'Play Solo', shortcut: 'F5', action: () => onPlay() },
        { label: 'Run', shortcut: 'F6', action: () => onRun() },
        { label: 'Reset / Stop', shortcut: 'Shift+F5', action: () => onStop() },
      ],
    },
    {
      name: 'Insert',
      children: [
        { label: 'Part: Block', shortcut: '', action: () => onInsertPart('Block') },
        { label: 'Part: Wedge', shortcut: '', action: () => onInsertPart('Wedge') },
        { label: 'Part: Cylinder', shortcut: '', action: () => onInsertPart('Cylinder') },
        { divider: true },
        { label: 'SpawnLocation', shortcut: '', action: () => onInsertPart('Block') },
        { label: 'Model from Toolbox...', shortcut: '', action: () => onToggleToolbox() },
      ],
    },
    {
      name: 'Format',
      children: [
        { label: 'Group', shortcut: 'Ctrl+G', action: () => {} },
        { label: 'Ungroup', shortcut: 'Ctrl+U', action: () => {} },
      ],
    },
    {
      name: 'Tools',
      children: [
        { label: 'Select Tool', shortcut: '', action: () => {} },
        { label: 'Move Tool', shortcut: '', action: () => {} },
        { label: 'Resize Tool', shortcut: '', action: () => {} },
        { label: 'Rotate Tool', shortcut: '', action: () => {} },
        { divider: true },
        { label: 'Toggle Anchor', shortcut: '', action: () => {} },
      ],
    },
    {
      name: 'Window',
      children: [
        { label: 'Tile Horizontally', shortcut: '', action: () => {} },
        { label: 'Tile Vertically', shortcut: '', action: () => {} },
        { label: 'Reset Windows', shortcut: '', action: () => {} },
      ],
    },
    {
      name: 'Help',
      children: [
        { label: 'Reset Character (OOF!)', shortcut: 'Ctrl+R', action: () => onResetNoob() },
        { divider: true },
        { label: 'About Roblox Studio 2008...', shortcut: '', action: () => alert('Classic Roblox Studio 2008 Recreation. Built with Three.js & React.') },
      ],
    },
  ];

  return (
    <div
      ref={barRef}
      className="relative h-6 bg-[#f0f0f0] border-b border-[#c8c8c8] flex items-center px-1 text-xs select-none font-sans z-40 text-black"
    >
      {menuItems.map((menu) => (
        <div key={menu.name} className="relative">
          <button
            onClick={() => handleMenuClick(menu.name)}
            onMouseEnter={() => {
              if (openMenu !== null && openMenu !== menu.name) {
                setOpenMenu(menu.name);
              }
            }}
            className={`px-2 py-0.5 rounded-[2px] cursor-default transition-colors text-[11.5px] ${
              openMenu === menu.name ? 'bg-[#b6d2ea] border border-[#7ca0c5]' : 'hover:bg-[#e0e8f0]'
            }`}
          >
            {menu.name}
          </button>

          {openMenu === menu.name && (
            <div className="absolute top-full left-0 mt-0.5 min-w-[190px] bg-[#fbfbfb] border border-[#979797] shadow-md py-1 z-50 text-[11.5px]">
              {menu.children.map((item, idx) => {
                if ('divider' in item && item.divider) {
                  return <div key={idx} className="my-1 border-t border-[#e2e2e2]" />;
                }
                return (
                  <button
                    key={idx}
                    onClick={() => handleAction(item.action!)}
                    className="w-full text-left px-4 py-1 hover:bg-[#3399ff] hover:text-white flex items-center justify-between transition-colors"
                  >
                    <span>{item.label}</span>
                    {item.shortcut && <span className="text-[10px] opacity-60 ml-4 font-mono">{item.shortcut}</span>}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
