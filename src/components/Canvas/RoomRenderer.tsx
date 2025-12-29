import { Group, Line, Text } from 'react-konva';
import type { RoomElement } from '../../types/editor';

interface RoomRendererProps {
  element: RoomElement;
  isSelected: boolean;
  onSelect: () => void;
  onDragEnd: (x: number, y: number) => void;
}

export function RoomRenderer({ element, isSelected, onSelect, onDragEnd }: RoomRendererProps) {
  const { x, y, points, name, fillColor, wallThickness, rotation } = element;

  // Convert points to flat array for Konva Line
  const flatPoints = points.flatMap(p => [p.x, p.y]);

  // Calculate center of the room for label
  const centerX = points.reduce((sum, p) => sum + p.x, 0) / points.length;
  const centerY = points.reduce((sum, p) => sum + p.y, 0) / points.length;

  return (
    <Group
      x={x}
      y={y}
      rotation={rotation}
      draggable
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
    </Group>
  );
}
