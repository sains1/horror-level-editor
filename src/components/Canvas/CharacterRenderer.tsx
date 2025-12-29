import { Group, Circle, Rect, Text, Line } from 'react-konva';
import type { CharacterElement } from '../../types/editor';

interface CharacterRendererProps {
  element: CharacterElement;
  isSelected: boolean;
  onSelect: () => void;
  onDragEnd: (x: number, y: number) => void;
}

export function CharacterRenderer({ element, isSelected, onSelect, onDragEnd }: CharacterRendererProps) {
  const { x, y, variant, name, scale, rotation } = element;

  const renderCharacter = () => {
    switch (variant) {
      case 'shadow-monster':
        return (
          <>
            {/* Dark menacing shape */}
            <Circle x={0} y={0} radius={18 * scale} fill="#1a1a2e" opacity={0.9} />
            <Circle x={0} y={-5 * scale} radius={12 * scale} fill="#16213e" />
            {/* Glowing eyes */}
            <Circle x={-5 * scale} y={-5 * scale} radius={3 * scale} fill="#ff0000" opacity={0.8} />
            <Circle x={5 * scale} y={-5 * scale} radius={3 * scale} fill="#ff0000" opacity={0.8} />
            {/* Wispy tendrils */}
            <Line
              points={[-10 * scale, 10 * scale, -15 * scale, 20 * scale]}
              stroke="#1a1a2e"
              strokeWidth={3 * scale}
              opacity={0.7}
            />
            <Line
              points={[10 * scale, 10 * scale, 15 * scale, 20 * scale]}
              stroke="#1a1a2e"
              strokeWidth={3 * scale}
              opacity={0.7}
            />
          </>
        );
      case 'player':
        return (
          <>
            {/* Body */}
            <Circle x={0} y={0} radius={12 * scale} fill="#4CAF50" />
            {/* Head */}
            <Circle x={0} y={-15 * scale} radius={8 * scale} fill="#ffdbac" />
            {/* Direction indicator */}
            <Line
              points={[0, -25 * scale, 0, -35 * scale]}
              stroke="#4CAF50"
              strokeWidth={3 * scale}
            />
            <Line
              points={[-5 * scale, -30 * scale, 0, -35 * scale, 5 * scale, -30 * scale]}
              stroke="#4CAF50"
              strokeWidth={2 * scale}
            />
          </>
        );
      case 'elderly':
        return (
          <>
            {/* Body */}
            <Rect
              x={-8 * scale}
              y={-5 * scale}
              width={16 * scale}
              height={25 * scale}
              fill="#8B7355"
              cornerRadius={3}
            />
            {/* Head */}
            <Circle x={0} y={-15 * scale} radius={10 * scale} fill="#ffdbac" />
            {/* White hair */}
            <Circle x={0} y={-20 * scale} radius={8 * scale} fill="#e0e0e0" />
            {/* Cane */}
            <Line
              points={[12 * scale, -5 * scale, 15 * scale, 20 * scale]}
              stroke="#5D4037"
              strokeWidth={3 * scale}
            />
          </>
        );
      case 'guard':
        return (
          <>
            {/* Body */}
            <Rect
              x={-10 * scale}
              y={-5 * scale}
              width={20 * scale}
              height={25 * scale}
              fill="#1565C0"
              cornerRadius={2}
            />
            {/* Head */}
            <Circle x={0} y={-15 * scale} radius={8 * scale} fill="#ffdbac" />
            {/* Hat */}
            <Rect
              x={-10 * scale}
              y={-28 * scale}
              width={20 * scale}
              height={8 * scale}
              fill="#0D47A1"
            />
            {/* Badge */}
            <Circle x={0} y={5 * scale} radius={4 * scale} fill="#FFD700" />
          </>
        );
      case 'npc':
      default:
        return (
          <>
            {/* Body */}
            <Circle x={0} y={0} radius={12 * scale} fill="#9E9E9E" />
            {/* Head */}
            <Circle x={0} y={-15 * scale} radius={8 * scale} fill="#ffdbac" />
            {/* Question mark to indicate NPC */}
            <Text
              x={-5 * scale}
              y={-8 * scale}
              text="?"
              fontSize={14 * scale}
              fill="#fff"
              fontStyle="bold"
            />
          </>
        );
    }
  };

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
      {renderCharacter()}
      {/* Name label */}
      {name && (
        <Text
          x={-50}
          y={25 * scale}
          width={100}
          text={name}
          fontSize={11}
          fill="#fff"
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
          radius={35 * scale}
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
