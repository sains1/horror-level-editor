export type ElementType =
  | 'room'
  | 'door'
  | 'locked-door'
  | 'stairs'
  | 'hiding-spot'
  | 'patrol-route'
  | 'decoration';

export type DecorationVariant = 'tree' | 'bush' | 'table' | 'chair' | 'bed' | 'car';

export type Tool = 'select' | 'room' | 'rectangle' | 'door' | 'locked-door' | 'stairs' | 'hiding-spot' | 'patrol-route' | 'decoration' | 'pan';

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

export type Element =
  | RoomElement
  | DoorElement
  | LockedDoorElement
  | StairsElement
  | HidingSpotElement
  | PatrolRouteElement
  | DecorationElement;

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
