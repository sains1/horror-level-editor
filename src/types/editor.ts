export type ElementType =
  | 'room'
  | 'door'
  | 'locked-door'
  | 'stairs'
  | 'hiding-spot'
  | 'patrol-route'
  | 'decoration'
  | 'character'
  | 'jumpscare'
  | 'item'
  | 'spawn'
  | 'objective'
  | 'annotation';

export type DecorationVariant = 'tree' | 'bush' | 'table' | 'chair' | 'bed' | 'car';

export type CharacterVariant = 'shadow-monster' | 'ghost' | 'slime' | 'skeleton' | 'zombie' | 'player' | 'elderly' | 'guard' | 'npc';

export type ItemVariant = 'key' | 'key-card' | 'document' | 'flashlight' | 'battery' | 'medkit';

export type SpawnVariant = 'player-start' | 'enemy-spawn' | 'npc-spawn';

export type ObjectiveType = 'primary' | 'secondary' | 'optional';

export type Tool = 'select' | 'room' | 'rectangle' | 'door' | 'locked-door' | 'stairs' | 'hiding-spot' | 'patrol-route' | 'decoration' | 'character' | 'jumpscare' | 'item' | 'spawn' | 'objective' | 'annotation' | 'pan';

export interface Point {
  x: number;
  y: number;
}

export interface BaseElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  rotation: number;
}

export interface RoomElement extends BaseElement {
  type: 'room';
  points: Point[];
  name: string;
  fillColor: string;
  wallThickness: number;
  lightLevel: number; // 0-100, 0 = dark, 100 = bright
}

export interface DoorElement extends BaseElement {
  type: 'door';
  width: number;
}

export interface LockedDoorElement extends BaseElement {
  type: 'locked-door';
  width: number;
  lockColor: string;
}

export interface StairsElement extends BaseElement {
  type: 'stairs';
  width: number;
  height: number;
  direction: 'up' | 'down';
}

export interface HidingSpotElement extends BaseElement {
  type: 'hiding-spot';
  radius: number;
}

export interface PatrolRouteElement extends BaseElement {
  type: 'patrol-route';
  points: Point[];
  color: string;
  loop: boolean;
}

export interface DecorationElement extends BaseElement {
  type: 'decoration';
  variant: DecorationVariant;
  scale: number;
}

export interface CharacterElement extends BaseElement {
  type: 'character';
  variant: CharacterVariant;
  name: string;
  scale: number;
}

export interface JumpscareElement extends BaseElement {
  type: 'jumpscare';
  name: string;
  radius: number;
  triggerOnce: boolean;
}

export interface ItemElement extends BaseElement {
  type: 'item';
  variant: ItemVariant;
  name: string;
  scale: number;
  color: string; // For color-coded keys
}

export interface SpawnElement extends BaseElement {
  type: 'spawn';
  variant: SpawnVariant;
  name: string;
  direction: number; // 0-360, which way entity faces
  respawn: 'once' | 'timed' | 'triggered';
}

export interface ObjectiveElement extends BaseElement {
  type: 'objective';
  name: string;
  description: string;
  objectiveType: ObjectiveType;
  order: number; // Sequence number 1, 2, 3...
  radius: number; // Completion zone size
  requiredItem: string | null; // e.g., "Red Key" or null
}

export interface AnnotationElement extends BaseElement {
  type: 'annotation';
  text: string;
  fontSize: 'small' | 'medium' | 'large'; // 12, 16, 20px
  color: string;
  backgroundColor: string | null; // null = transparent
}

export type Element =
  | RoomElement
  | DoorElement
  | LockedDoorElement
  | StairsElement
  | HidingSpotElement
  | PatrolRouteElement
  | DecorationElement
  | CharacterElement
  | JumpscareElement
  | ItemElement
  | SpawnElement
  | ObjectiveElement
  | AnnotationElement;

export interface Level {
  id: string;
  name: string;
  elements: Element[];
}

export interface EditorState {
  levels: Level[];
  currentLevelId: string;
  selectedElementIds: string[];
  activeTool: Tool;
  zoom: number;
  panOffset: Point;
  gridSize: number;
  snapToGrid: boolean;
  visibleLayers: Record<ElementType, boolean>;
}

export interface ProjectData {
  version: string;
  name: string;
  levels: Level[];
  metadata: {
    gridSize: number;
    createdAt: string;
    updatedAt: string;
  };
}
