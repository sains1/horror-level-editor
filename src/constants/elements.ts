import type { DecorationVariant, ElementType, Tool, CharacterVariant, ItemVariant, SpawnVariant, ObjectiveType } from '../types/editor';

export interface ElementDefinition {
  type: ElementType | DecorationVariant;
  tool: Tool;
  label: string;
  icon: string;
  category: 'structure' | 'decoration';
  defaultProps?: Record<string, unknown>;
}

export const ELEMENT_DEFINITIONS: ElementDefinition[] = [
  // Structure elements
  {
    type: 'room',
    tool: 'room',
    label: 'Room',
    icon: 'Square',
    category: 'structure',
    defaultProps: {
      fillColor: '#64748b',
      wallThickness: 4,
      name: 'Room',
    },
  },
  {
    type: 'door',
    tool: 'door',
    label: 'Door',
    icon: 'DoorOpen',
    category: 'structure',
    defaultProps: {
      width: 40,
    },
  },
  {
    type: 'locked-door',
    tool: 'locked-door',
    label: 'Locked Door',
    icon: 'Lock',
    category: 'structure',
    defaultProps: {
      width: 40,
      lockColor: '#ff4444',
    },
  },
  {
    type: 'stairs',
    tool: 'stairs',
    label: 'Stairs',
    icon: 'ArrowUpFromLine',
    category: 'structure',
    defaultProps: {
      width: 60,
      height: 100,
      direction: 'up',
    },
  },
  {
    type: 'hiding-spot',
    tool: 'hiding-spot',
    label: 'Hiding Spot',
    icon: 'Eye',
    category: 'structure',
    defaultProps: {
      radius: 20,
    },
  },
  {
    type: 'patrol-route',
    tool: 'patrol-route',
    label: 'Patrol Route',
    icon: 'Route',
    category: 'structure',
    defaultProps: {
      color: '#ff6600',
      loop: true,
    },
  },
];

export const DECORATION_VARIANTS: { variant: DecorationVariant; label: string; icon: string }[] = [
  { variant: 'tree', label: 'Tree', icon: 'TreeDeciduous' },
  { variant: 'bush', label: 'Bush', icon: 'Shrub' },
  { variant: 'table', label: 'Table', icon: 'Table' },
  { variant: 'chair', label: 'Chair', icon: 'ArmchairIcon' },
  { variant: 'bed', label: 'Bed', icon: 'Bed' },
  { variant: 'car', label: 'Car', icon: 'Car' },
];

export const CHARACTER_VARIANTS: { variant: CharacterVariant; label: string; icon: string }[] = [
  { variant: 'shadow-monster', label: 'Shadow Monster', icon: 'Ghost' },
  { variant: 'ghost', label: 'Ghost', icon: 'Ghost' },
  { variant: 'slime', label: 'Slime', icon: 'Droplet' },
  { variant: 'skeleton', label: 'Skeleton', icon: 'Bone' },
  { variant: 'zombie', label: 'Zombie', icon: 'Skull' },
  { variant: 'player', label: 'Player', icon: 'User' },
  { variant: 'elderly', label: 'Elderly', icon: 'PersonStanding' },
  { variant: 'guard', label: 'Guard', icon: 'Shield' },
  { variant: 'npc', label: 'NPC', icon: 'UserCircle' },
];

export const ITEM_VARIANTS: { variant: ItemVariant; label: string; icon: string }[] = [
  { variant: 'key', label: 'Key', icon: 'Key' },
  { variant: 'key-card', label: 'Key Card', icon: 'CreditCard' },
  { variant: 'document', label: 'Document', icon: 'FileText' },
  { variant: 'flashlight', label: 'Flashlight', icon: 'Flashlight' },
  { variant: 'battery', label: 'Battery', icon: 'Battery' },
  { variant: 'medkit', label: 'Medkit', icon: 'HeartPulse' },
];

export const ITEM_COLORS = [
  { name: 'Gold', value: '#FFD700' },
  { name: 'Red', value: '#ff4444' },
  { name: 'Blue', value: '#4488ff' },
  { name: 'Green', value: '#44ff44' },
  { name: 'Purple', value: '#aa44ff' },
  { name: 'Silver', value: '#C0C0C0' },
];

export const ROOM_COLORS = [
  { name: 'Slate', value: '#64748b' },
  { name: 'Steel', value: '#6b7280' },
  { name: 'Ocean', value: '#3b82a0' },
  { name: 'Sage', value: '#5a8a6e' },
  { name: 'Terracotta', value: '#b87350' },
  { name: 'Rose', value: '#a86070' },
  { name: 'Violet', value: '#7c6892' },
  { name: 'Sand', value: '#a89078' },
];

export const LOCK_COLORS = [
  { name: 'Red', value: '#ff4444' },
  { name: 'Blue', value: '#4444ff' },
  { name: 'Green', value: '#44ff44' },
  { name: 'Yellow', value: '#ffff44' },
  { name: 'Purple', value: '#ff44ff' },
];

export const SPAWN_VARIANTS: { variant: SpawnVariant; label: string; icon: string }[] = [
  { variant: 'player-start', label: 'Player Start', icon: 'Play' },
  { variant: 'enemy-spawn', label: 'Enemy Spawn', icon: 'Skull' },
  { variant: 'npc-spawn', label: 'NPC Spawn', icon: 'UserCircle' },
];

export const OBJECTIVE_TYPES: { type: ObjectiveType; label: string; color: string }[] = [
  { type: 'primary', label: 'Primary', color: '#FFD700' },
  { type: 'secondary', label: 'Secondary', color: '#C0C0C0' },
  { type: 'optional', label: 'Optional', color: '#CD7F32' },
];

export const ANNOTATION_COLORS = [
  { name: 'Yellow', value: '#FFEB3B' },
  { name: 'Blue', value: '#2196F3' },
  { name: 'Green', value: '#4CAF50' },
  { name: 'Red', value: '#F44336' },
  { name: 'Orange', value: '#FF9800' },
  { name: 'Purple', value: '#9C27B0' },
];
