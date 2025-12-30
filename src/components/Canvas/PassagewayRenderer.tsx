import { Group, Line, Circle, Arc, Rect } from 'react-konva';
import type { PassagewayElement } from '../../types/editor';

interface PassagewayRendererProps {
  element: PassagewayElement;
  isSelected: boolean;
  onSelect: () => void;
  onDragStart?: () => void;
  onDragEnd: (x: number, y: number) => void;
  draggable?: boolean;
}

// Archway/doorway icon to represent passageway entry/exit
function PassagewayIcon({ x, y, size, color }: { x: number; y: number; size: number; color: string }) {
  const halfSize = size / 2;

  return (
    <Group x={x} y={y}>
      {/* Archway shape */}
      <Arc
        x={0}
        y={halfSize * 0.3}
        innerRadius={halfSize * 0.55}
        outerRadius={halfSize * 0.95}
        angle={180}
        rotation={-90}
        fill="#2a2a2a"
        stroke={color}
        strokeWidth={3}
      />
      {/* Side pillars */}
      <Rect
        x={-halfSize * 0.95}
        y={halfSize * 0.3}
        width={halfSize * 0.4}
        height={halfSize * 0.8}
        fill="#2a2a2a"
        stroke={color}
        strokeWidth={3}
      />
      <Rect
        x={halfSize * 0.55}
        y={halfSize * 0.3}
        width={halfSize * 0.4}
        height={halfSize * 0.8}
        fill="#2a2a2a"
        stroke={color}
        strokeWidth={3}
      />
      {/* Inner dark opening */}
      <Arc
        x={0}
        y={halfSize * 0.3}
        innerRadius={0}
        outerRadius={halfSize * 0.45}
        angle={180}
        rotation={-90}
        fill="#111"
      />
      <Rect
        x={-halfSize * 0.45}
        y={halfSize * 0.3}
        width={halfSize * 0.9}
        height={halfSize * 0.6}
        fill="#111"
      />
    </Group>
  );
}

export function PassagewayRenderer({ element, isSelected, onSelect, onDragStart, onDragEnd, draggable = true }: PassagewayRendererProps) {
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
      {/* Main path line - dotted to indicate hidden path */}
      <Line
        points={flatPoints}
        stroke={color}
        strokeWidth={8}
        lineCap="round"
        lineJoin="round"
        dash={[6, 10]}
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
      {/* Entry passageway icon at start */}
      <PassagewayIcon x={startPoint.x} y={startPoint.y} size={50} color={color} />
      {/* Exit passageway icon at end */}
      <PassagewayIcon x={endPoint.x} y={endPoint.y} size={50} color={color} />
    </Group>
  );
}
