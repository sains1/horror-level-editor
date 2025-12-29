import { Group, Rect, Text } from 'react-konva';
import type { AnnotationElement } from '../../types/editor';

interface AnnotationRendererProps {
  element: AnnotationElement;
  isSelected: boolean;
  onSelect: () => void;
  onDragStart?: () => void;
  onDragEnd: (x: number, y: number) => void;
  draggable?: boolean;
}

const FONT_SIZES = {
  small: 12,
  medium: 16,
  large: 20,
};

export function AnnotationRenderer({ element, isSelected, onSelect, onDragStart, onDragEnd, draggable = true }: AnnotationRendererProps) {
  const { x, y, text, fontSize, color, backgroundColor, rotation } = element;

  const fontSizePixels = FONT_SIZES[fontSize] || 16;
  const padding = 8;

  // Estimate text dimensions (approximate)
  const textWidth = Math.max(80, text.length * fontSizePixels * 0.6);
  const textHeight = fontSizePixels + padding * 2;

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
      {/* Background rectangle (if backgroundColor is set) */}
      {backgroundColor && (
        <Rect
          x={-padding}
          y={-padding}
          width={textWidth + padding * 2}
          height={textHeight}
          fill={backgroundColor}
          cornerRadius={4}
          opacity={0.9}
        />
      )}

      {/* Text */}
      <Text
        text={text || 'Note'}
        fontSize={fontSizePixels}
        fill={color}
        fontFamily="Arial, sans-serif"
        width={textWidth}
      />

      {/* Selection indicator */}
      {isSelected && (
        <Rect
          x={-padding - 2}
          y={-padding - 2}
          width={textWidth + padding * 2 + 4}
          height={textHeight + 4}
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
