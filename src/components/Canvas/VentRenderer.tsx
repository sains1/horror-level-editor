import { Group, Line, Circle, Rect } from 'react-konva';
import type { VentElement } from '../../types/editor';

interface VentRendererProps {
  element: VentElement;
  isSelected: boolean;
  onSelect: () => void;
  onDragStart?: () => void;
  onDragEnd: (x: number, y: number) => void;
  draggable?: boolean;
}

// Vent grate icon component - renders a grid pattern to represent vent openings
function VentIcon({ x, y, size, color }: { x: number; y: number; size: number; color: string }) {
  const halfSize = size / 2;
  const spacing = size / 5;
  const inset = 4;

  return (
    <Group x={x} y={y}>
      {/* Outer rectangle */}
      <Rect
        x={-halfSize}
        y={-halfSize}
        width={size}
        height={size}
        fill="#222"
        stroke={color}
        strokeWidth={3}
        cornerRadius={4}
      />
      {/* Horizontal grate lines */}
      <Line
        points={[-halfSize + inset, -spacing * 1.5, halfSize - inset, -spacing * 1.5]}
        stroke={color}
        strokeWidth={2.5}
      />
      <Line
        points={[-halfSize + inset, -spacing * 0.5, halfSize - inset, -spacing * 0.5]}
        stroke={color}
        strokeWidth={2.5}
      />
      <Line
        points={[-halfSize + inset, spacing * 0.5, halfSize - inset, spacing * 0.5]}
        stroke={color}
        strokeWidth={2.5}
      />
      <Line
        points={[-halfSize + inset, spacing * 1.5, halfSize - inset, spacing * 1.5]}
        stroke={color}
        strokeWidth={2.5}
      />
    </Group>
  );
}

export function VentRenderer({ element, isSelected, onSelect, onDragStart, onDragEnd, draggable = true }: VentRendererProps) {
  const { x, y, points, color } = element;

  if (points.length < 2) return null;

  // Convert points to flat array for Konva Line
  const flatPoints = points.flatMap(p => [p.x, p.y]);

  const startPoint = points[0];
  const endPoint = points[points.length - 1];

  return (
    <Group
      x={x}
      y={y}
      draggable={draggable}
      onClick={onSelect}
      onTap={onSelect}
      onDragStart={onDragStart}
      onDragEnd={(e) => onDragEnd(e.target.x(), e.target.y())}
    >
      {/* Selection indicator */}
      {isSelected && (
        <Line
          points={flatPoints}
          stroke="#4488ff"
          strokeWidth={14}
          lineCap="round"
          lineJoin="round"
          opacity={0.5}
          listening={false}
        />
      )}
      {/* Main path line - dashed to indicate hidden/enclosed path */}
      <Line
        points={flatPoints}
        stroke={color}
        strokeWidth={8}
        lineCap="round"
        lineJoin="round"
        dash={[15, 8]}
        listening={true}
      />
      {/* Waypoint circles along the path */}
      {points.slice(1, -1).map((point, i) => (
        <Circle
          key={`waypoint-${i}`}
          x={point.x}
          y={point.y}
          radius={6}
          fill={color}
          stroke="#fff"
          strokeWidth={2}
          listening={false}
        />
      ))}
      {/* Entry vent icon at start */}
      <VentIcon x={startPoint.x} y={startPoint.y} size={40} color={color} />
      {/* Exit vent icon at end */}
      <VentIcon x={endPoint.x} y={endPoint.y} size={40} color={color} />
    </Group>
  );
}
