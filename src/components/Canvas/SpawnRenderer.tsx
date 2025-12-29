import { Group, Circle, Line, Text, Rect } from 'react-konva';
import type { SpawnElement } from '../../types/editor';

interface SpawnRendererProps {
  element: SpawnElement;
  isSelected: boolean;
  onSelect: () => void;
  onDragStart?: () => void;
  onDragEnd: (x: number, y: number) => void;
  draggable?: boolean;
}

// Colors for each spawn variant
const SPAWN_COLORS: Record<string, string> = {
  'player-start': '#22c55e', // Green
  'enemy-spawn': '#ef4444',  // Red
  'npc-spawn': '#3b82f6',    // Blue
};

export function SpawnRenderer({ element, isSelected, onSelect, onDragStart, onDragEnd, draggable = true }: SpawnRendererProps) {
  const { x, y, variant, name, direction, respawn, rotation } = element;

  const color = SPAWN_COLORS[variant] || '#888888';
  const radius = 20;

  // Calculate arrow points based on direction (0-360)
  const directionRad = (direction * Math.PI) / 180;
  const arrowLength = 25;
  const arrowHeadSize = 8;

  const arrowEndX = Math.sin(directionRad) * arrowLength;
  const arrowEndY = -Math.cos(directionRad) * arrowLength;

  // Arrow head points
  const arrowHeadAngle1 = directionRad + (Math.PI * 5) / 6;
  const arrowHeadAngle2 = directionRad - (Math.PI * 5) / 6;

  const arrowHead1X = arrowEndX + Math.sin(arrowHeadAngle1) * arrowHeadSize;
  const arrowHead1Y = arrowEndY - Math.cos(arrowHeadAngle1) * arrowHeadSize;
  const arrowHead2X = arrowEndX + Math.sin(arrowHeadAngle2) * arrowHeadSize;
  const arrowHead2Y = arrowEndY - Math.cos(arrowHeadAngle2) * arrowHeadSize;

  const renderSpawnIcon = () => {
    switch (variant) {
      case 'player-start':
        // Play icon / triangle pointing in direction
        return (
          <>
            <Circle x={0} y={0} radius={radius} fill={color} opacity={0.8} />
            <Text
              x={-7}
              y={-8}
              text="P"
              fontSize={16}
              fill="#fff"
              fontStyle="bold"
            />
          </>
        );
      case 'enemy-spawn':
        // Skull-like icon
        return (
          <>
            <Circle x={0} y={0} radius={radius} fill={color} opacity={0.8} />
            {/* Simple skull face */}
            <Circle x={-5} y={-3} radius={4} fill="#fff" />
            <Circle x={5} y={-3} radius={4} fill="#fff" />
            <Circle x={-5} y={-3} radius={2} fill="#000" />
            <Circle x={5} y={-3} radius={2} fill="#000" />
            <Rect x={-4} y={5} width={8} height={4} fill="#fff" />
          </>
        );
      case 'npc-spawn':
        // Person icon
        return (
          <>
            <Circle x={0} y={0} radius={radius} fill={color} opacity={0.8} />
            {/* Simple person silhouette */}
            <Circle x={0} y={-5} radius={6} fill="#fff" />
            <Rect x={-6} y={3} width={12} height={10} fill="#fff" cornerRadius={2} />
          </>
        );
      default:
        return <Circle x={0} y={0} radius={radius} fill={color} opacity={0.8} />;
    }
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
      {/* Spawn point base */}
      {renderSpawnIcon()}

      {/* Direction arrow */}
      <Line
        points={[0, 0, arrowEndX, arrowEndY]}
        stroke={color}
        strokeWidth={3}
      />
      <Line
        points={[arrowEndX, arrowEndY, arrowHead1X, arrowHead1Y]}
        stroke={color}
        strokeWidth={3}
      />
      <Line
        points={[arrowEndX, arrowEndY, arrowHead2X, arrowHead2Y]}
        stroke={color}
        strokeWidth={3}
      />

      {/* Respawn indicator */}
      {respawn !== 'once' && (
        <Text
          x={-radius}
          y={-radius - 18}
          width={radius * 2}
          text={respawn === 'timed' ? '(T)' : '(!)'}
          fontSize={10}
          fill={color}
          align="center"
          fontStyle="bold"
        />
      )}

      {/* Name label */}
      {name && (
        <Text
          x={-50}
          y={radius + 8}
          width={100}
          text={name}
          fontSize={11}
          fill={color}
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
          radius={radius + 15}
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
