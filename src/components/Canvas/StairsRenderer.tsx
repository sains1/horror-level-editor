import { Group, Rect, Line, Arrow } from 'react-konva';
import type { StairsElement } from '../../types/editor';

interface StairsRendererProps {
  element: StairsElement;
  isSelected: boolean;
  onSelect: () => void;
  onDragStart?: () => void;
  onDragEnd: (x: number, y: number) => void;
  draggable?: boolean;
}

export function StairsRenderer({ element, isSelected, onSelect, onDragStart, onDragEnd, draggable = true }: StairsRendererProps) {
  const { x, y, width, height, rotation, direction } = element;
  const stepCount = 8;
  const stepHeight = height / stepCount;

  const steps = [];
  for (let i = 0; i < stepCount; i++) {
    steps.push(
      <Line
        key={i}
        points={[0, i * stepHeight, width, i * stepHeight]}
        stroke="#666"
        strokeWidth={1}
        listening={false}
      />
    );
  }

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
      {/* Stair outline */}
      <Rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill="#e8e8e8"
        stroke="#000"
        strokeWidth={2}
        listening={true}
      />
      {/* Step lines */}
      {steps}
      {/* Direction arrow */}
      <Arrow
        points={[
          width / 2,
          direction === 'up' ? height - 15 : 15,
          width / 2,
          direction === 'up' ? 15 : height - 15,
        ]}
        pointerLength={8}
        pointerWidth={8}
        fill="#666"
        stroke="#666"
        strokeWidth={2}
        listening={false}
      />
      {/* Selection indicator */}
      {isSelected && (
        <Rect
          x={-2}
          y={-2}
          width={width + 4}
          height={height + 4}
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
