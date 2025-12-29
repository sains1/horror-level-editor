import { Group, Circle, Rect, Text, Line } from 'react-konva';
import type { CharacterElement } from '../../types/editor';

interface CharacterRendererProps {
  element: CharacterElement;
  isSelected: boolean;
  onSelect: () => void;
  onDragStart?: () => void;
  onDragEnd: (x: number, y: number) => void;
  draggable?: boolean;
}

export function CharacterRenderer({ element, isSelected, onSelect, onDragStart, onDragEnd, draggable = true }: CharacterRendererProps) {
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
      case 'ghost':
        // Pac-Man style ghost
        return (
          <>
            {/* Body - rounded top, wavy bottom */}
            <Circle x={0} y={-5 * scale} radius={15 * scale} fill="#FF6B6B" />
            <Rect x={-15 * scale} y={-5 * scale} width={30 * scale} height={18 * scale} fill="#FF6B6B" />
            {/* Wavy bottom */}
            <Circle x={-10 * scale} y={13 * scale} radius={5 * scale} fill="#FF6B6B" />
            <Circle x={0} y={13 * scale} radius={5 * scale} fill="#FF6B6B" />
            <Circle x={10 * scale} y={13 * scale} radius={5 * scale} fill="#FF6B6B" />
            {/* Eyes */}
            <Circle x={-6 * scale} y={-8 * scale} radius={5 * scale} fill="#fff" />
            <Circle x={6 * scale} y={-8 * scale} radius={5 * scale} fill="#fff" />
            {/* Pupils */}
            <Circle x={-4 * scale} y={-8 * scale} radius={2.5 * scale} fill="#0000FF" />
            <Circle x={8 * scale} y={-8 * scale} radius={2.5 * scale} fill="#0000FF" />
          </>
        );
      case 'slime':
        // Cute blob monster
        return (
          <>
            {/* Main body - blobby shape */}
            <Circle x={0} y={5 * scale} radius={20 * scale} fill="#44DD88" opacity={0.8} />
            <Circle x={-8 * scale} y={-2 * scale} radius={10 * scale} fill="#44DD88" opacity={0.8} />
            <Circle x={8 * scale} y={-2 * scale} radius={10 * scale} fill="#44DD88" opacity={0.8} />
            {/* Shine */}
            <Circle x={-5 * scale} y={-5 * scale} radius={4 * scale} fill="#88FFBB" opacity={0.6} />
            {/* Eyes */}
            <Circle x={-6 * scale} y={2 * scale} radius={4 * scale} fill="#fff" />
            <Circle x={6 * scale} y={2 * scale} radius={4 * scale} fill="#fff" />
            <Circle x={-5 * scale} y={3 * scale} radius={2 * scale} fill="#222" />
            <Circle x={7 * scale} y={3 * scale} radius={2 * scale} fill="#222" />
          </>
        );
      case 'skeleton':
        // Spooky skeleton
        return (
          <>
            {/* Skull */}
            <Circle x={0} y={-12 * scale} radius={12 * scale} fill="#F5F5DC" />
            {/* Eye sockets */}
            <Circle x={-4 * scale} y={-14 * scale} radius={4 * scale} fill="#222" />
            <Circle x={4 * scale} y={-14 * scale} radius={4 * scale} fill="#222" />
            {/* Nose hole */}
            <Circle x={0} y={-9 * scale} radius={2 * scale} fill="#222" />
            {/* Teeth */}
            <Rect x={-6 * scale} y={-5 * scale} width={12 * scale} height={4 * scale} fill="#F5F5DC" />
            <Line points={[-4 * scale, -5 * scale, -4 * scale, -1 * scale]} stroke="#222" strokeWidth={1} />
            <Line points={[0, -5 * scale, 0, -1 * scale]} stroke="#222" strokeWidth={1} />
            <Line points={[4 * scale, -5 * scale, 4 * scale, -1 * scale]} stroke="#222" strokeWidth={1} />
            {/* Ribcage */}
            <Line points={[0, 0, 0, 20 * scale]} stroke="#F5F5DC" strokeWidth={3 * scale} />
            <Line points={[-8 * scale, 5 * scale, 8 * scale, 5 * scale]} stroke="#F5F5DC" strokeWidth={2 * scale} />
            <Line points={[-7 * scale, 10 * scale, 7 * scale, 10 * scale]} stroke="#F5F5DC" strokeWidth={2 * scale} />
            <Line points={[-5 * scale, 15 * scale, 5 * scale, 15 * scale]} stroke="#F5F5DC" strokeWidth={2 * scale} />
          </>
        );
      case 'zombie':
        // Shambling zombie
        return (
          <>
            {/* Body */}
            <Rect
              x={-10 * scale}
              y={-5 * scale}
              width={20 * scale}
              height={28 * scale}
              fill="#5D6D5A"
              cornerRadius={3}
            />
            {/* Torn clothing */}
            <Rect x={-10 * scale} y={10 * scale} width={8 * scale} height={13 * scale} fill="#4A5A47" />
            {/* Head */}
            <Circle x={0} y={-15 * scale} radius={10 * scale} fill="#7D8D6A" />
            {/* Messy hair */}
            <Line points={[-8 * scale, -22 * scale, -5 * scale, -28 * scale]} stroke="#3A3A2A" strokeWidth={2 * scale} />
            <Line points={[0, -24 * scale, 2 * scale, -30 * scale]} stroke="#3A3A2A" strokeWidth={2 * scale} />
            <Line points={[6 * scale, -22 * scale, 9 * scale, -27 * scale]} stroke="#3A3A2A" strokeWidth={2 * scale} />
            {/* Eyes - one droopy */}
            <Circle x={-4 * scale} y={-16 * scale} radius={3 * scale} fill="#FFFF99" />
            <Circle x={5 * scale} y={-14 * scale} radius={3 * scale} fill="#FFFF99" />
            <Circle x={-4 * scale} y={-16 * scale} radius={1.5 * scale} fill="#222" />
            <Circle x={5 * scale} y={-14 * scale} radius={1.5 * scale} fill="#222" />
            {/* Arms reaching forward */}
            <Line
              points={[-10 * scale, 0, -20 * scale, -10 * scale]}
              stroke="#7D8D6A"
              strokeWidth={4 * scale}
            />
            <Line
              points={[10 * scale, 0, 22 * scale, -8 * scale]}
              stroke="#7D8D6A"
              strokeWidth={4 * scale}
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
      draggable={draggable}
      onClick={onSelect}
      onTap={onSelect}
      onDragStart={onDragStart}
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
