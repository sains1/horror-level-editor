import { Rect, Text, Group } from 'react-konva';
import type { Point } from '../../types/editor';

interface RectanglePreviewProps {
  start: Point;
  end: Point;
  gridSize: number;
}

export function RectanglePreview({ start, end, gridSize }: RectanglePreviewProps) {
  const minX = Math.min(start.x, end.x);
  const maxX = Math.max(start.x, end.x);
  const minY = Math.min(start.y, end.y);
  const maxY = Math.max(start.y, end.y);

  const width = maxX - minX;
  const height = maxY - minY;

  const isValidSize = width >= gridSize && height >= gridSize;

  return (
    <Group>
      {/* Rectangle preview */}
      <Rect
        x={minX}
        y={minY}
        width={width}
        height={height}
        fill={isValidSize ? 'rgba(245, 230, 211, 0.5)' : 'rgba(255, 100, 100, 0.3)'}
        stroke={isValidSize ? '#000' : '#ff4444'}
        strokeWidth={3}
        dash={[8, 4]}
        listening={false}
      />

      {/* Dimension labels */}
      {width > 40 && (
        <Text
          x={minX + width / 2 - 20}
          y={minY - 20}
          text={`${Math.round(width)}px`}
          fontSize={12}
          fill="#fff"
          listening={false}
        />
      )}
      {height > 40 && (
        <Text
          x={maxX + 5}
          y={minY + height / 2 - 6}
          text={`${Math.round(height)}px`}
          fontSize={12}
          fill="#fff"
          listening={false}
        />
      )}

      {/* Corner handles */}
      <Rect x={minX - 4} y={minY - 4} width={8} height={8} fill="#fff" stroke="#000" strokeWidth={1} listening={false} />
      <Rect x={maxX - 4} y={minY - 4} width={8} height={8} fill="#fff" stroke="#000" strokeWidth={1} listening={false} />
      <Rect x={maxX - 4} y={maxY - 4} width={8} height={8} fill="#fff" stroke="#000" strokeWidth={1} listening={false} />
      <Rect x={minX - 4} y={maxY - 4} width={8} height={8} fill="#fff" stroke="#000" strokeWidth={1} listening={false} />
    </Group>
  );
}
