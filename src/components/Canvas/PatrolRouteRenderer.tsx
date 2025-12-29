import { type ReactElement } from 'react';
import { Group, Line, Circle, Arrow } from 'react-konva';
import type { PatrolRouteElement } from '../../types/editor';

interface PatrolRouteRendererProps {
  element: PatrolRouteElement;
  isSelected: boolean;
  onSelect: () => void;
  onDragEnd: (x: number, y: number) => void;
}

export function PatrolRouteRenderer({ element, isSelected, onSelect, onDragEnd }: PatrolRouteRendererProps) {
  const { x, y, points, color, loop } = element;

  if (points.length < 2) return null;

  // Convert points to flat array for Konva Line
  const flatPoints = points.flatMap(p => [p.x, p.y]);

  // Draw arrows along the path
  const arrows: ReactElement[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    const midX = (p1.x + p2.x) / 2;
    const midY = (p1.y + p2.y) / 2;
    const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;

    arrows.push(
      <Arrow
        key={`arrow-${i}`}
        x={midX}
        y={midY}
        points={[-10, 0, 10, 0]}
        rotation={angle}
        pointerLength={6}
        pointerWidth={6}
        fill={color}
        listening={false}
      />
    );
  }

  return (
    <Group
      x={x}
      y={y}
      draggable
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={(e) => onDragEnd(e.target.x(), e.target.y())}
    >
      {/* Main path line */}
      <Line
        points={flatPoints}
        stroke={color}
        strokeWidth={3}
        lineCap="round"
        lineJoin="round"
        closed={loop}
        listening={true}
      />
      {/* Direction arrows */}
      {arrows}
      {/* Waypoint circles */}
      {points.map((point, i) => (
        <Circle
          key={`waypoint-${i}`}
          x={point.x}
          y={point.y}
          radius={6}
          fill={i === 0 ? '#00ff00' : i === points.length - 1 && !loop ? '#ff0000' : color}
          stroke="#fff"
          strokeWidth={2}
          listening={false}
        />
      ))}
      {/* Selection indicator */}
      {isSelected && (
        <Line
          points={flatPoints}
          stroke="#4488ff"
          strokeWidth={6}
          lineCap="round"
          lineJoin="round"
          closed={loop}
          opacity={0.5}
          listening={false}
        />
      )}
    </Group>
  );
}
