export type StudioTool = 'select' | 'move' | 'resize' | 'rotate' | 'color' | 'material' | 'surface' | 'anchor';

export type GameMode = 'edit' | 'play' | 'run';

export interface PartData {
  id: string;
  name: string;
  className: 'Part' | 'Model' | 'SpawnLocation' | 'Camera' | 'Humanoid';
  brickColor: string;
  material: 'Plastic' | 'Wood' | 'Slate' | 'Concrete' | 'CorrodedMetal' | 'DiamondPlate' | 'Foil' | 'Grass' | 'Ice' | 'Brick' | 'Sand';
  surfaceType: 'Studs' | 'Inlets' | 'Glue' | 'Smooth' | 'Weld';
  position: [number, number, number];
  size: [number, number, number];
  rotation: [number, number, number];
  anchored: boolean;
  canCollide: boolean;
  transparency: number;
  reflectance: number;
  locked?: boolean;
  parent?: string;
  children?: string[];
}

export interface StudioState {
  mode: GameMode;
  activeTool: StudioTool;
  selectedPartId: string | null;
  hoveredPartId: string | null;
  currentColor: string;
  currentMaterial: PartData['material'];
  currentSurface: PartData['surfaceType'];
  isExplorerVisible: boolean;
  isPropertiesVisible: boolean;
  isToolboxVisible: boolean;
  gridSnap: number;
  noobPosition: [number, number, number];
  soundEnabled: boolean;
}
