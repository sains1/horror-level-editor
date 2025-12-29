import { Group, Circle, Rect, Line, Text } from 'react-konva';
import type { ItemElement } from '../../types/editor';

interface ItemRendererProps {
  element: ItemElement;
  isSelected: boolean;
  onSelect: () => void;
  onDragStart?: () => void;
  onDragEnd: (x: number, y: number) => void;
  draggable?: boolean;
}

export function ItemRenderer({ element, isSelected, onSelect, onDragStart, onDragEnd, draggable = true }: ItemRendererProps) {
  const { x, y, variant, name, scale, color, rotation } = element;

  const renderItem = () => {
    switch (variant) {
      case 'key':
        return (
          <>
            {/* Key head */}
            <Circle x={-8 * scale} y={0} radius={8 * scale} fill={color} stroke="#333" strokeWidth={1} />
            <Circle x={-8 * scale} y={0} radius={4 * scale} fill="transparent" stroke="#333" strokeWidth={2} />
            {/* Key shaft */}
            <Rect
              x={-2 * scale}
              y={-3 * scale}
              width={20 * scale}
              height={6 * scale}
              fill={color}
              stroke="#333"
              strokeWidth={1}
            />
            {/* Key teeth */}
            <Rect x={12 * scale} y={3 * scale} width={3 * scale} height={5 * scale} fill={color} stroke="#333" strokeWidth={1} />
            <Rect x={16 * scale} y={3 * scale} width={3 * scale} height={3 * scale} fill={color} stroke="#333" strokeWidth={1} />
          </>
        );
      case 'key-card':
        return (
          <>
            {/* Card body */}
            <Rect
              x={-15 * scale}
              y={-10 * scale}
              width={30 * scale}
              height={20 * scale}
              fill={color}
              stroke="#333"
              strokeWidth={1}
              cornerRadius={3}
            />
            {/* Magnetic stripe */}
            <Rect
              x={-15 * scale}
              y={2 * scale}
              width={30 * scale}
              height={4 * scale}
              fill="#333"
            />
            {/* Chip */}
            <Rect
              x={-10 * scale}
              y={-6 * scale}
              width={8 * scale}
              height={6 * scale}
              fill="#FFD700"
              stroke="#B8860B"
              strokeWidth={1}
            />
          </>
        );
      case 'document':
        return (
          <>
            {/* Paper */}
            <Rect
              x={-12 * scale}
              y={-15 * scale}
              width={24 * scale}
              height={30 * scale}
              fill="#fff"
              stroke="#333"
              strokeWidth={1}
            />
            {/* Folded corner */}
            <Line
              points={[
                12 * scale, -15 * scale,
                6 * scale, -15 * scale,
                12 * scale, -9 * scale,
              ]}
              closed
              fill="#e0e0e0"
              stroke="#333"
              strokeWidth={1}
            />
            {/* Text lines */}
            <Line points={[-8 * scale, -8 * scale, 8 * scale, -8 * scale]} stroke="#666" strokeWidth={2} />
            <Line points={[-8 * scale, -2 * scale, 8 * scale, -2 * scale]} stroke="#666" strokeWidth={2} />
            <Line points={[-8 * scale, 4 * scale, 4 * scale, 4 * scale]} stroke="#666" strokeWidth={2} />
            <Line points={[-8 * scale, 10 * scale, 6 * scale, 10 * scale]} stroke="#666" strokeWidth={2} />
          </>
        );
      case 'flashlight':
        return (
          <>
            {/* Handle */}
            <Rect
              x={-5 * scale}
              y={0}
              width={10 * scale}
              height={20 * scale}
              fill="#333"
              stroke="#222"
              strokeWidth={1}
              cornerRadius={2}
            />
            {/* Head */}
            <Rect
              x={-8 * scale}
              y={-12 * scale}
              width={16 * scale}
              height={14 * scale}
              fill="#666"
              stroke="#222"
              strokeWidth={1}
              cornerRadius={2}
            />
            {/* Lens */}
            <Circle x={0} y={-8 * scale} radius={5 * scale} fill="#FFE082" stroke="#333" strokeWidth={1} />
            {/* Button */}
            <Circle x={0} y={8 * scale} radius={3 * scale} fill="#ff4444" />
          </>
        );
      case 'battery':
        return (
          <>
            {/* Battery body */}
            <Rect
              x={-10 * scale}
              y={-8 * scale}
              width={20 * scale}
              height={16 * scale}
              fill={color}
              stroke="#333"
              strokeWidth={1}
              cornerRadius={2}
            />
            {/* Positive terminal */}
            <Rect
              x={10 * scale}
              y={-4 * scale}
              width={4 * scale}
              height={8 * scale}
              fill="#666"
            />
            {/* Charge indicator */}
            <Line
              points={[-4 * scale, 0, 0, -4 * scale, 0, -1 * scale, 4 * scale, -1 * scale, 0, 4 * scale, 0, 1 * scale]}
              closed
              fill="#FFD700"
            />
          </>
        );
      case 'medkit':
        return (
          <>
            {/* Box */}
            <Rect
              x={-15 * scale}
              y={-12 * scale}
              width={30 * scale}
              height={24 * scale}
              fill="#fff"
              stroke="#ff0000"
              strokeWidth={2}
              cornerRadius={3}
            />
            {/* Cross */}
            <Rect
              x={-3 * scale}
              y={-8 * scale}
              width={6 * scale}
              height={16 * scale}
              fill="#ff0000"
            />
            <Rect
              x={-8 * scale}
              y={-3 * scale}
              width={16 * scale}
              height={6 * scale}
              fill="#ff0000"
            />
          </>
        );
      default:
        return <Circle x={0} y={0} radius={15 * scale} fill={color} stroke="#333" strokeWidth={2} />;
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
      {/* Glow effect for pickups */}
      <Circle
        x={0}
        y={0}
        radius={25 * scale}
        fill="transparent"
        stroke={color}
        strokeWidth={2}
        opacity={0.3}
        dash={[4, 4]}
      />

      {renderItem()}

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
