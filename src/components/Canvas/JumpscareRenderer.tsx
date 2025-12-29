import { Group, Circle, Line, Text } from 'react-konva';
import type { JumpscareElement } from '../../types/editor';

interface JumpscareRendererProps {
  element: JumpscareElement;
  isSelected: boolean;
  onSelect: () => void;
  onDragStart?: () => void;
  onDragEnd: (x: number, y: number) => void;
  draggable?: boolean;
}

export function JumpscareRenderer({ element, isSelected, onSelect, onDragStart, onDragEnd, draggable = true }: JumpscareRendererProps) {
  const { x, y, name, radius, triggerOnce, rotation } = element;

  // Create zigzag/lightning bolt pattern for trigger area
  const createZigzagPoints = () => {
    const points: number[] = [];
    const segments = 8;
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const outerRadius = radius * (i % 2 === 0 ? 1 : 0.8);
      points.push(
        Math.cos(angle) * outerRadius,
        Math.sin(angle) * outerRadius
      );
    }
    return points;
  };

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
      {/* Outer trigger zone */}
      <Circle
        x={0}
        y={0}
        radius={radius}
        fill="rgba(255, 0, 0, 0.15)"
        stroke="#ff4444"
        strokeWidth={2}
        dash={[8, 4]}
      />

      {/* Inner warning symbol */}
      <Line
        points={createZigzagPoints()}
        closed
        fill="rgba(255, 100, 0, 0.3)"
        stroke="#ff6600"
        strokeWidth={2}
      />

      {/* Lightning bolt icon */}
      <Line
        points={[
          0, -radius * 0.4,
          -radius * 0.15, 0,
          radius * 0.05, 0,
          -radius * 0.1, radius * 0.4,
          radius * 0.15, -radius * 0.05,
          -radius * 0.05, -radius * 0.05,
        ]}
        closed
        fill="#FFD700"
        stroke="#FF8C00"
        strokeWidth={1}
      />

      {/* Trigger once indicator */}
      {triggerOnce && (
        <Text
          x={-radius}
          y={-radius - 20}
          width={radius * 2}
          text="1x"
          fontSize={12}
          fill="#ff6600"
          align="center"
          fontStyle="bold"
        />
      )}

      {/* Name label */}
      {name && (
        <Text
          x={-50}
          y={radius + 5}
          width={100}
          text={name}
          fontSize={11}
          fill="#ff6600"
          align="center"
          shadowColor="#000"
          shadowBlur={2}
          shadowOffset={{ x: 1, y: 1 }}
        />
      )}

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
