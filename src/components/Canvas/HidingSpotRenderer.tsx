import { Group, Circle } from 'react-konva';
import type { HidingSpotElement } from '../../types/editor';

interface HidingSpotRendererProps {
  element: HidingSpotElement;
  isSelected: boolean;
  onSelect: () => void;
  onDragEnd: (x: number, y: number) => void;
}

export function HidingSpotRenderer({ element, isSelected, onSelect, onDragEnd }: HidingSpotRendererProps) {
  const { x, y, radius, rotation } = element;

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
      {/* Hiding spot circle */}
      <Circle
        x={0}
        y={0}
        radius={radius}
        fill="rgba(128, 0, 128, 0.3)"
        stroke="#800080"
        strokeWidth={2}
        dash={[4, 4]}
        listening={true}
      />
      {/* Eye symbol */}
      <Circle
        x={0}
        y={0}
        radius={radius * 0.4}
        fill="transparent"
        stroke="#800080"
        strokeWidth={1.5}
        listening={false}
      />
      <Circle
        x={0}
        y={0}
        radius={radius * 0.2}
        fill="#800080"
        listening={false}
      />
      {/* Selection indicator */}
      {isSelected && (
        <Circle
          x={0}
          y={0}
          radius={radius + 4}
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
