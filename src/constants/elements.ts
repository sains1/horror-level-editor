import type { DecorationVariant, ElementType, Tool } from '../types/editor';

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
      fillColor: '#f5e6d3',
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

export const ROOM_COLORS = [
  { name: 'Beige', value: '#f5e6d3' },
  { name: 'Light Gray', value: '#e8e8e8' },
  { name: 'Light Blue', value: '#d4e5f7' },
  { name: 'Light Green', value: '#d4f7d4' },
  { name: 'Light Yellow', value: '#f7f4d4' },
  { name: 'Light Pink', value: '#f7d4e5' },
  { name: 'Tan', value: '#d4b896' },
  { name: 'White', value: '#ffffff' },
];

export const LOCK_COLORS = [
  { name: 'Red', value: '#ff4444' },
  { name: 'Blue', value: '#4444ff' },
  { name: 'Green', value: '#44ff44' },
  { name: 'Yellow', value: '#ffff44' },
  { name: 'Purple', value: '#ff44ff' },
];
