import { useState } from 'react';
import { Group, Line, Text, Circle, Rect } from 'react-konva';
import type { RoomElement, Point, Tool } from '../../types/editor';

interface RoomRendererProps {
  element: RoomElement;
  isSelected: boolean;
  onSelect: () => void;
  onDragEnd: (x: number, y: number) => void;
  onUpdatePoints?: (points: Point[]) => void;
  activeTool?: Tool;
  snapToGrid?: boolean;
  gridSize?: number;
}

export function RoomRenderer({
  element,
  isSelected,
  onSelect,
  onDragEnd,
  onUpdatePoints,
  activeTool = 'select',
  snapToGrid = true,
  gridSize = 20
}: RoomRendererProps) {
  const { x, y, points, name, fillColor, wallThickness, rotation, lightLevel = 100 } = element;
  const [isDraggingHandle, setIsDraggingHandle] = useState(false);

  // Convert points to flat array for Konva Line
  const flatPoints = points.flatMap(p => [p.x, p.y]);

  // Calculate center of the room for label
  const centerX = points.reduce((sum, p) => sum + p.x, 0) / points.length;
  const centerY = points.reduce((sum, p) => sum + p.y, 0) / points.length;

  // Snap helper
  const snap = (value: number): number => {
    if (!snapToGrid) return value;
    return Math.round(value / gridSize) * gridSize;
  };

  // Check if room is rectangular (4 points forming right angles)
  const isRectangular = (): boolean => {
    if (points.length !== 4) return false;
    const dx1 = points[1].x - points[0].x;
    const dy1 = points[1].y - points[0].y;
    const dx2 = points[2].x - points[3].x;
    const dy2 = points[2].y - points[3].y;
    const dx3 = points[2].x - points[1].x;
    const dy3 = points[2].y - points[1].y;
    const dx4 = points[3].x - points[0].x;
    const dy4 = points[3].y - points[0].y;
    return (
      Math.abs(dx1 - dx2) < 1 && Math.abs(dy1 - dy2) < 1 &&
      Math.abs(dx3 - dx4) < 1 && Math.abs(dy3 - dy4) < 1
    );
  };

  // Handle vertex drag
  const handleVertexDragEnd = (index: number, newX: number, newY: number) => {
    if (!onUpdatePoints) return;
    const snappedX = snap(newX);
    const snappedY = snap(newY);
    const newPoints = points.map((p, i) =>
      i === index ? { x: snappedX, y: snappedY } : p
    );
    onUpdatePoints(newPoints);
    setIsDraggingHandle(false);
  };

  // Handle edge drag (for rectangular rooms)
  const handleEdgeDragEnd = (edgeIndex: number, deltaX: number, deltaY: number) => {
    if (!onUpdatePoints) return;
    const nextIndex = (edgeIndex + 1) % points.length;
    const isHorizontal = Math.abs(points[edgeIndex].y - points[nextIndex].y) <
                         Math.abs(points[edgeIndex].x - points[nextIndex].x);
    const newPoints = points.map((p, i) => {
      if (i === edgeIndex || i === nextIndex) {
        if (isHorizontal) {
          return { x: p.x, y: snap(p.y + deltaY) };
        } else {
          return { x: snap(p.x + deltaX), y: p.y };
        }
      }
      return p;
    });
    onUpdatePoints(newPoints);
    setIsDraggingHandle(false);
  };

  // Calculate edge midpoints
  const getEdgeMidpoints = () => {
    return points.map((p, i) => {
      const nextP = points[(i + 1) % points.length];
      return {
        x: (p.x + nextP.x) / 2,
        y: (p.y + nextP.y) / 2,
        isHorizontal: Math.abs(p.y - nextP.y) < Math.abs(p.x - nextP.x)
      };
    });
  };

  const showHandles = isSelected && activeTool === 'select' && onUpdatePoints;
  const edgeMidpoints = getEdgeMidpoints();
  const showEdgeHandles = showHandles && isRectangular();

  return (
    <Group
      x={x}
      y={y}
      rotation={rotation}
      draggable={!isDraggingHandle}
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={(e) => onDragEnd(e.target.x(), e.target.y())}
    >
      {/* Room fill */}
      <Line
        points={flatPoints}
        fill={fillColor}
        closed
        listening={true}
      />
      {/* Darkness overlay based on light level */}
      {lightLevel < 100 && (
        <Line
          points={flatPoints}
          fill="#000000"
          opacity={(100 - lightLevel) / 100 * 0.7}
          closed
          listening={false}
        />
      )}
      {/* Room walls */}
      <Line
        points={flatPoints}
        stroke="#000"
        strokeWidth={wallThickness}
        closed
        listening={false}
      />
      {/* Selection indicator */}
      {isSelected && (
        <Line
          points={flatPoints}
          stroke="#4488ff"
          strokeWidth={2}
          closed
          dash={[5, 5]}
          listening={false}
        />
      )}
      {/* Room name label */}
      <Text
        x={centerX}
        y={centerY}
        text={name}
        fontSize={14}
        fill="#333"
        align="center"
        verticalAlign="middle"
        offsetX={name.length * 3.5}
        offsetY={7}
        listening={false}
      />

      {/* Vertex handles (circles at corners) */}
      {showHandles && points.map((point, index) => (
        <Circle
          key={`vertex-${index}`}
          x={point.x}
          y={point.y}
          radius={6}
          fill="#4488ff"
          stroke="#fff"
          strokeWidth={2}
          draggable
          onDragStart={() => setIsDraggingHandle(true)}
          onDragEnd={(e) => {
            const node = e.target;
            handleVertexDragEnd(index, node.x(), node.y());
            node.position({ x: point.x, y: point.y });
          }}
          onMouseEnter={(e) => {
            const container = e.target.getStage()?.container();
            if (container) container.style.cursor = 'move';
          }}
          onMouseLeave={(e) => {
            const container = e.target.getStage()?.container();
            if (container) container.style.cursor = 'default';
          }}
        />
      ))}

      {/* Edge handles (squares at midpoints - for rectangular rooms) */}
      {showEdgeHandles && edgeMidpoints.map((midpoint, index) => (
        <Rect
          key={`edge-${index}`}
          x={midpoint.x - 5}
          y={midpoint.y - 5}
          width={10}
          height={10}
          fill="#4488ff"
          stroke="#fff"
          strokeWidth={2}
          draggable
          onDragStart={() => setIsDraggingHandle(true)}
          onDragEnd={(e) => {
            const node = e.target;
            const deltaX = node.x() + 5 - midpoint.x;
            const deltaY = node.y() + 5 - midpoint.y;
            handleEdgeDragEnd(index, deltaX, deltaY);
            node.position({ x: midpoint.x - 5, y: midpoint.y - 5 });
          }}
          onMouseEnter={(e) => {
            const container = e.target.getStage()?.container();
            if (container) {
              container.style.cursor = midpoint.isHorizontal ? 'ns-resize' : 'ew-resize';
            }
          }}
          onMouseLeave={(e) => {
            const container = e.target.getStage()?.container();
            if (container) container.style.cursor = 'default';
          }}
        />
      ))}
    </Group>
  );
}
