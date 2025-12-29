import { Group, Circle, Rect } from 'react-konva';
import type { DecorationElement } from '../../types/editor';

interface DecorationRendererProps {
  element: DecorationElement;
  isSelected: boolean;
  onSelect: () => void;
  onDragStart?: () => void;
  onDragEnd: (x: number, y: number) => void;
  draggable?: boolean;
}

export function DecorationRenderer({ element, isSelected, onSelect, onDragStart, onDragEnd, draggable = true }: DecorationRendererProps) {
  const { x, y, variant, scale, rotation } = element;

  const renderDecoration = () => {
    switch (variant) {
      case 'tree':
        return (
          <>
            {/* Tree canopy - multiple circles for organic look */}
            <Circle x={0} y={0} radius={20 * scale} fill="#4a7c4e" opacity={0.9} />
            <Circle x={-8 * scale} y={-5 * scale} radius={14 * scale} fill="#5a9c5e" opacity={0.8} />
            <Circle x={8 * scale} y={-3 * scale} radius={12 * scale} fill="#3a6c3e" opacity={0.8} />
            <Circle x={0} y={8 * scale} radius={10 * scale} fill="#5a9c5e" opacity={0.7} />
          </>
        );
      case 'bush':
        return (
          <>
            <Circle x={0} y={0} radius={12 * scale} fill="#6a9c6e" />
            <Circle x={-6 * scale} y={-3 * scale} radius={8 * scale} fill="#7aac7e" opacity={0.9} />
            <Circle x={6 * scale} y={-2 * scale} radius={7 * scale} fill="#5a8c5e" opacity={0.9} />
          </>
        );
      case 'table':
        return (
          <Rect
            x={-25 * scale}
            y={-15 * scale}
            width={50 * scale}
            height={30 * scale}
            fill="#8B4513"
            stroke="#5D2E0C"
            strokeWidth={2}
            cornerRadius={3}
          />
        );
      case 'chair':
        return (
          <>
            {/* Seat */}
            <Rect
              x={-10 * scale}
              y={-5 * scale}
              width={20 * scale}
              height={15 * scale}
              fill="#8B4513"
              stroke="#5D2E0C"
              strokeWidth={1}
            />
            {/* Back */}
            <Rect
              x={-10 * scale}
              y={-15 * scale}
              width={20 * scale}
              height={10 * scale}
              fill="#A0522D"
              stroke="#5D2E0C"
              strokeWidth={1}
            />
          </>
        );
      case 'bed':
        return (
          <>
            {/* Mattress */}
            <Rect
              x={-20 * scale}
              y={-35 * scale}
              width={40 * scale}
              height={70 * scale}
              fill="#e8e0d8"
              stroke="#666"
              strokeWidth={2}
            />
            {/* Pillow */}
            <Rect
              x={-15 * scale}
              y={-30 * scale}
              width={30 * scale}
              height={12 * scale}
              fill="#fff"
              stroke="#ccc"
              strokeWidth={1}
              cornerRadius={3}
            />
            {/* Headboard */}
            <Rect
              x={-22 * scale}
              y={-40 * scale}
              width={44 * scale}
              height={8 * scale}
              fill="#5D2E0C"
            />
          </>
        );
      case 'car':
        return (
          <>
            {/* Car body */}
            <Rect
              x={-30 * scale}
              y={-15 * scale}
              width={60 * scale}
              height={30 * scale}
              fill="#444"
              stroke="#222"
              strokeWidth={2}
              cornerRadius={5}
            />
            {/* Windows */}
            <Rect
              x={-10 * scale}
              y={-12 * scale}
              width={35 * scale}
              height={15 * scale}
              fill="#87CEEB"
              opacity={0.6}
              cornerRadius={2}
            />
            {/* Wheels */}
            <Circle x={-18 * scale} y={15 * scale} radius={6 * scale} fill="#222" />
            <Circle x={18 * scale} y={15 * scale} radius={6 * scale} fill="#222" />
          </>
        );
      default:
        return <Circle x={0} y={0} radius={15 * scale} fill="#888" />;
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
      {renderDecoration()}
      {/* Selection indicator */}
      {isSelected && (
        <Circle
          x={0}
          y={0}
          radius={30 * scale}
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
