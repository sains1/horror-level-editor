import { Group, Rect, Arc, Line } from 'react-konva';
import type { DoorElement, LockedDoorElement } from '../../types/editor';
import type { WallSegment } from '../../utils/snapUtils';
import { snapDoorToWall } from '../../utils/snapUtils';

interface DoorRendererProps {
  element: DoorElement | LockedDoorElement;
  isSelected: boolean;
  onSelect: () => void;
  onDragEnd: (x: number, y: number, rotation?: number) => void;
  walls?: WallSegment[];
  snapThreshold?: number;
}

export function DoorRenderer({
  element,
  isSelected,
  onSelect,
  onDragEnd,
  walls = [],
  snapThreshold = 30
}: DoorRendererProps) {
  const { x, y, width, rotation } = element;
  const isLocked = element.type === 'locked-door';
  const lockColor = isLocked ? (element as LockedDoorElement).lockColor : undefined;

  return (
    <Group
      x={x}
      y={y}
      rotation={rotation}
      draggable
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={(e) => {
        const pos = { x: e.target.x(), y: e.target.y() };
        if (walls.length > 0) {
          const snapResult = snapDoorToWall(pos, walls, snapThreshold);
          onDragEnd(snapResult.position.x, snapResult.position.y, snapResult.snapped ? snapResult.rotation : undefined);
        } else {
          onDragEnd(pos.x, pos.y);
        }
      }}
    >
      {/* Door opening (gap in wall) */}
      <Rect
        x={-width / 2}
        y={-4}
        width={width}
        height={8}
        fill="#f5f5f5"
        listening={true}
      />
      {/* Door panel */}
      <Line
        points={[-width / 2, 0, -width / 2 + width * 0.8, 0]}
        stroke={isLocked ? lockColor : '#8B4513'}
        strokeWidth={3}
        listening={false}
      />
      {/* Door swing arc */}
      <Arc
        x={-width / 2}
        y={0}
        innerRadius={0}
        outerRadius={width * 0.8}
        angle={90}
        rotation={-90}
        stroke="#999"
        strokeWidth={1}
        dash={[3, 3]}
        listening={false}
      />
      {/* Lock indicator for locked doors */}
      {isLocked && (
        <Rect
          x={-6}
          y={-6}
          width={12}
          height={12}
          fill={lockColor}
          cornerRadius={2}
          listening={false}
        />
      )}
      {/* Selection indicator */}
      {isSelected && (
        <Rect
          x={-width / 2 - 4}
          y={-10}
          width={width + 8}
          height={20}
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
