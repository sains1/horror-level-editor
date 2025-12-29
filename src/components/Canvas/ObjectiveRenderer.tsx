import { Group, Circle, Line, Text, Star } from 'react-konva';
import type { ObjectiveElement } from '../../types/editor';

interface ObjectiveRendererProps {
  element: ObjectiveElement;
  isSelected: boolean;
  onSelect: () => void;
  onDragStart?: () => void;
  onDragEnd: (x: number, y: number) => void;
  draggable?: boolean;
}

// Colors for each objective type
const OBJECTIVE_COLORS: Record<string, string> = {
  'primary': '#FFD700',    // Gold
  'secondary': '#C0C0C0',  // Silver
  'optional': '#CD7F32',   // Bronze
};

export function ObjectiveRenderer({ element, isSelected, onSelect, onDragStart, onDragEnd, draggable = true }: ObjectiveRendererProps) {
  const { x, y, name, description, objectiveType, order, radius, requiredItem, rotation } = element;

  const color = OBJECTIVE_COLORS[objectiveType] || '#FFD700';

  // Create star points
  const starOuterRadius = 15;
  const starInnerRadius = 7;

  return (
    <Group
      x={x}
      y={y}
      rotation={rotation}
      draggable={draggable}
      onClick={onSelect}
      onTap={onSelect}
      onDragStart={onDragStart}
      onDragEnd={(e) => onDragEnd(e.target.x(), e.target.y())}
    >
      {/* Completion zone - dashed circle */}
      <Circle
        x={0}
        y={0}
        radius={radius}
        fill={`${color}15`}
        stroke={color}
        strokeWidth={2}
        dash={[8, 4]}
        opacity={0.6}
      />

      {/* Center star icon */}
      <Star
        x={0}
        y={0}
        numPoints={5}
        innerRadius={starInnerRadius}
        outerRadius={starOuterRadius}
        fill={color}
        stroke={`${color}aa`}
        strokeWidth={1}
      />

      {/* Order number */}
      <Circle
        x={starOuterRadius + 5}
        y={-starOuterRadius - 5}
        radius={10}
        fill="#333"
        stroke={color}
        strokeWidth={1}
      />
      <Text
        x={starOuterRadius - 2}
        y={-starOuterRadius - 12}
        width={14}
        text={String(order)}
        fontSize={12}
        fill="#fff"
        align="center"
        fontStyle="bold"
      />

      {/* Required item indicator (key icon) */}
      {requiredItem && (
        <Group x={-starOuterRadius - 15} y={-starOuterRadius - 5}>
          <Circle
            x={0}
            y={0}
            radius={10}
            fill="#333"
            stroke="#FFD700"
            strokeWidth={1}
          />
          {/* Simple key icon */}
          <Circle x={0} y={-2} radius={4} stroke="#FFD700" strokeWidth={2} fill="transparent" />
          <Line
            points={[0, 2, 0, 8]}
            stroke="#FFD700"
            strokeWidth={2}
          />
          <Line
            points={[0, 6, 3, 6]}
            stroke="#FFD700"
            strokeWidth={2}
          />
        </Group>
      )}

      {/* Name label */}
      {name && (
        <Text
          x={-60}
          y={radius + 5}
          width={120}
          text={name}
          fontSize={12}
          fill={color}
          align="center"
          fontStyle="bold"
          shadowColor="#000"
          shadowBlur={2}
          shadowOffset={{ x: 1, y: 1 }}
        />
      )}

      {/* Description (smaller, below name) */}
      {description && (
        <Text
          x={-60}
          y={radius + 20}
          width={120}
          text={description}
          fontSize={9}
          fill="#aaa"
          align="center"
          shadowColor="#000"
          shadowBlur={2}
          shadowOffset={{ x: 1, y: 1 }}
        />
      )}

      {/* Objective type indicator */}
      <Text
        x={-30}
        y={-radius - 18}
        width={60}
        text={objectiveType.toUpperCase()}
        fontSize={8}
        fill={color}
        align="center"
        fontStyle="bold"
        opacity={0.8}
      />

      {/* Selection indicator */}
      {isSelected && (
        <Circle
          x={0}
          y={0}
          radius={radius + 10}
          stroke="#4488ff"
          strokeWidth={2}
          dash={[5, 5]}
          fill="transparent"
          listening={false}
        />
      )}
    </Group>
  );
}
