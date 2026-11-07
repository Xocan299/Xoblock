import React, { useState, useCallback } from 'react';
import { TitleBar } from './components/TitleBar';
import { MenuBar } from './components/MenuBar';
import { Toolbar } from './components/Toolbar';
import { Viewport3D } from './components/Viewport3D';
import { ExplorerPanel } from './components/ExplorerPanel';
import { PropertiesPanel } from './components/PropertiesPanel';
import { StatusBar } from './components/StatusBar';
import { ToolboxModal } from './components/ToolboxModal';
import { NoobTouchControls } from './components/NoobTouchControls';
import { INITIAL_PARTS } from './data/initialParts';
import { GameMode, StudioTool, PartData } from './types/studio';
import { playButtonClick, playDeleteBrick, playPlaceBrick, playOof } from './audio/robloxSounds';

export default function App() {
  const [parts, setParts] = useState<PartData[]>(INITIAL_PARTS);
  const [selectedPartId, setSelectedPartId] = useState<string | null>(null);
  const [mode, setMode] = useState<GameMode>('edit');
  const [activeTool, setActiveTool] = useState<StudioTool>('select');
  const [currentColor, setCurrentColor] = useState<string>('#cc292b'); // Default bright red
  const [isExplorerVisible, setIsExplorerVisible] = useState(true);
  const [isPropertiesVisible, setIsPropertiesVisible] = useState(true);
  const [isToolboxVisible, setIsToolboxVisible] = useState(false);
  const [cameraStats, setCameraStats] = useState({ x: 0, y: 1.2, z: 0, fps: 60 });
  const [explorerHeightRatio, setExplorerHeightRatio] = useState(0.5); // 50% split on right

  // Find currently selected part
  const selectedPart = parts.find((p) => p.id === selectedPartId) || null;

  // Update a part's properties
  const handleUpdatePart = useCallback((id: string, updates: Partial<PartData>) => {
    setParts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  }, []);

  // Insert a new part
  const handleInsertPart = useCallback((type: 'Block' | 'Wedge' | 'Cylinder') => {
    playPlaceBrick();
    const newPart: PartData = {
      id: `part_${Date.now()}`,
      name: `Part_${type}`,
      className: 'Part',
      brickColor: currentColor,
      material: 'Plastic',
      surfaceType: 'Studs',
      position: [0, 5, 5],
      size: type === 'Block' ? [4, 1.2, 2] : type === 'Wedge' ? [4, 2, 4] : [2, 4, 2],
      rotation: [0, 0, 0],
      anchored: true,
      canCollide: true,
      transparency: 0,
      reflectance: 0,
    };
    setParts((prev) => [...prev, newPart]);
    setSelectedPartId(newPart.id);
  }, [currentColor]);

  // Insert free models from Toolbox
  const handleInsertModel = useCallback((newParts: PartData[]) => {
    setParts((prev) => [...prev, ...newParts]);
    if (newParts.length > 0) {
      setSelectedPartId(newParts[0].id);
    }
  }, []);

  // Delete selected part
  const handleDeleteSelected = useCallback(() => {
    if (!selectedPartId || selectedPartId === 'part_baseplate') return;
    playDeleteBrick();
    setParts((prev) => prev.filter((p) => p.id !== selectedPartId));
    setSelectedPartId(null);
  }, [selectedPartId]);

  // Duplicate selected part
  const handleDuplicateSelected = useCallback(() => {
    if (!selectedPart) return;
    playPlaceBrick();
    const clone: PartData = {
      ...selectedPart,
      id: `part_${Date.now()}`,
      name: `${selectedPart.name}_Copy`,
      position: [
        selectedPart.position[0] + 2,
        selectedPart.position[1] + 1,
        selectedPart.position[2] + 2,
      ],
    };
    setParts((prev) => [...prev, clone]);
    setSelectedPartId(clone.id);
  }, [selectedPart]);

  // Toggle anchor on selected part
  const handleToggleAnchor = useCallback(() => {
    if (selectedPart) {
      handleUpdatePart(selectedPart.id, { anchored: !selectedPart.anchored });
    }
  }, [selectedPart, handleUpdatePart]);

  // Reset Noob (OOF!)
  const handleResetNoob = useCallback(() => {
    playOof();
  }, []);

  // New Place
  const handleNew = useCallback(() => {
    if (confirm('Create a new place? This resets the scene to default.')) {
      setParts(INITIAL_PARTS);
      setSelectedPartId(null);
      setMode('edit');
    }
  }, []);

  // Save Place
  const handleSave = useCallback(() => {
    try {
      const json = JSON.stringify(parts, null, 2);
      localStorage.setItem('roblox_place1_save', json);
      alert('Place1 saved successfully to browser storage!');
    } catch {
      alert('Failed to save place.');
    }
  }, [parts]);

  // Open Place
  const handleOpen = useCallback(() => {
    const saved = localStorage.getItem('roblox_place1_save');
    if (saved) {
      try {
        const loaded = JSON.parse(saved);
        setParts(loaded);
        alert('Place1 loaded successfully!');
      } catch {
        alert('Could not parse saved place.');
      }
    } else {
      alert('No saved place found.');
    }
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col bg-[#589be5] select-none font-sans overflow-hidden">
      {/* Windows XP / Vista Chrome Window Frame */}
      <div className="w-full h-full flex flex-col bg-[#edeae5] shadow-2xl overflow-hidden border border-[#5d7d9f]">
        {/* Title Bar */}
        <TitleBar
          onMinimize={() => {}}
          onMaximize={() => {}}
          onClose={() => {}}
        />

        {/* Menu Bar: File Edit View Insert Format Tools Window Help */}
        <MenuBar
          onNew={handleNew}
          onOpen={handleOpen}
          onSave={handleSave}
          onPlay={() => setMode('play')}
          onRun={() => setMode('run')}
          onStop={() => {
            setMode('edit');
            handleResetNoob();
          }}
          onInsertPart={handleInsertPart}
          onToggleExplorer={() => setIsExplorerVisible((v) => !v)}
          onToggleProperties={() => setIsPropertiesVisible((v) => !v)}
          onToggleToolbox={() => setIsToolboxVisible((v) => !v)}
          onResetNoob={handleResetNoob}
          onDeleteSelected={handleDeleteSelected}
          onDuplicateSelected={handleDuplicateSelected}
        />

        {/* Toolbar with Play Solo, Run, Stop, Tools, Colors, and Tabs */}
        <Toolbar
          mode={mode}
          activeTool={activeTool}
          currentColor={currentColor}
          isAnchoredActive={selectedPart ? selectedPart.anchored : true}
          onSetMode={setMode}
          onSelectTool={setActiveTool}
          onColorChange={setCurrentColor}
          onToggleAnchor={handleToggleAnchor}
          onInsertPart={handleInsertPart}
          onResetNoob={handleResetNoob}
          onToggleToolbox={() => setIsToolboxVisible(true)}
          onSave={handleSave}
          onNew={handleNew}
        />

        {/* Main Work Area: Viewport + Right Side Panels (Explorer & Properties) */}
        <div className="flex-1 flex min-h-0 relative">
          {/* 3D Viewport */}
          <div className="flex-1 h-full min-w-0 relative">
            <Viewport3D
              parts={parts}
              selectedPartId={selectedPartId}
              mode={mode}
              activeTool={activeTool}
              currentColor={currentColor}
              onSelectPart={setSelectedPartId}
              onUpdatePart={handleUpdatePart}
              onResetNoob={handleResetNoob}
              onSetCameraStats={setCameraStats}
            />

            {/* Quick Virtual Controls when in Play Solo mode */}
            {mode === 'play' && (
              <NoobTouchControls onResetNoob={handleResetNoob} />
            )}
          </div>

          {/* Right Panels: Explorer & Properties (Exactly matching screenshot!) */}
          {(isExplorerVisible || isPropertiesVisible) && (
            <div className="w-[280px] shrink-0 h-full flex flex-col bg-[#edeae5] border-l border-[#828790]">
              {/* Explorer (Top) */}
              {isExplorerVisible && (
                <div
                  className="w-full overflow-hidden"
                  style={{
                    height: isPropertiesVisible ? `${explorerHeightRatio * 100}%` : '100%',
                  }}
                >
                  <ExplorerPanel
                    parts={parts}
                    selectedPartId={selectedPartId}
                    onSelectPart={setSelectedPartId}
                    onClose={() => setIsExplorerVisible(false)}
                  />
                </div>
              )}

              {/* Resizable Divider between Explorer and Properties */}
              {isExplorerVisible && isPropertiesVisible && (
                <div
                  onMouseDown={(e) => {
                    const startY = e.clientY;
                    const startRatio = explorerHeightRatio;
                    const onMove = (moveEvt: MouseEvent) => {
                      const deltaY = moveEvt.clientY - startY;
                      const parentHeight = window.innerHeight - 100;
                      const newRatio = Math.max(0.2, Math.min(0.8, startRatio + deltaY / parentHeight));
                      setExplorerHeightRatio(newRatio);
                    };
                    const onUp = () => {
                      window.removeEventListener('mousemove', onMove);
                      window.removeEventListener('mouseup', onUp);
                    };
                    window.addEventListener('mousemove', onMove);
                    window.addEventListener('mouseup', onUp);
                  }}
                  className="h-1 bg-[#b8b8b8] hover:bg-[#3399ff] cursor-row-resize transition-colors shrink-0"
                />
              )}

              {/* Properties (Bottom) */}
              {isPropertiesVisible && (
                <div
                  className="w-full flex-1 min-h-0 overflow-hidden"
                >
                  <PropertiesPanel
                    selectedPart={selectedPart}
                    onUpdatePart={handleUpdatePart}
                    onClose={() => setIsPropertiesVisible(false)}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Status Bar */}
        <StatusBar
          mode={mode}
          partCount={parts.length}
          cameraStats={cameraStats}
        />
      </div>

      {/* Free Models Toolbox Modal */}
      <ToolboxModal
        isOpen={isToolboxVisible}
        onClose={() => setIsToolboxVisible(false)}
        onInsertModel={handleInsertModel}
      />
    </div>
  );
}
