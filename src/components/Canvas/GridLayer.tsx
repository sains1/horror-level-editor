import { Line } from 'react-konva';
import { useMemo, type ReactElement } from 'react';

interface GridLayerProps {
  width: number;
  height: number;
  gridSize: number;
  zoom: number;
  panOffset: { x: number; y: number };
}

export function GridLayer({ width, height, gridSize, zoom, panOffset }: GridLayerProps) {
  const lines = useMemo(() => {
    const result: ReactElement[] = [];
    const scaledGridSize = gridSize;

    // Calculate visible area bounds
    const startX = Math.floor(-panOffset.x / zoom / scaledGridSize) * scaledGridSize - scaledGridSize;
    const endX = Math.ceil((width / zoom - panOffset.x / zoom) / scaledGridSize) * scaledGridSize + scaledGridSize;
    const startY = Math.floor(-panOffset.y / zoom / scaledGridSize) * scaledGridSize - scaledGridSize;
    const endY = Math.ceil((height / zoom - panOffset.y / zoom) / scaledGridSize) * scaledGridSize + scaledGridSize;

    // Vertical lines
    for (let x = startX; x <= endX; x += scaledGridSize) {
      const isMajor = x % (scaledGridSize * 5) === 0;
      result.push(
        <Line
          key={`v-${x}`}
          points={[x, startY, x, endY]}
          stroke={isMajor ? '#444' : '#333'}
          strokeWidth={isMajor ? 1 : 0.5}
          listening={false}
        />
      );
    }

    // Horizontal lines
    for (let y = startY; y <= endY; y += scaledGridSize) {
      const isMajor = y % (scaledGridSize * 5) === 0;
      result.push(
        <Line
          key={`h-${y}`}
          points={[startX, y, endX, y]}
          stroke={isMajor ? '#444' : '#333'}
          strokeWidth={isMajor ? 1 : 0.5}
          listening={false}
        />
      );
    }

    return result;
  }, [width, height, gridSize, zoom, panOffset]);

  return <>{lines}</>;
}
