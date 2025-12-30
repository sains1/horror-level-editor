import { Line, Circle, Group } from 'react-konva';
import type { Point, Tool } from '../../types/editor';

interface DrawingPreviewProps {
  points: Point[];
  tool: Tool;
  mousePosition: Point | null;
}

export function DrawingPreview({ points, tool, mousePosition }: DrawingPreviewProps) {
  if (points.length === 0) return null;

  const isRoom = tool === 'room';
  const getToolColor = () => {
    switch (tool) {
      case 'room': return '#000';
      case 'patrol-route': return '#ff6600';
      case 'vent': return '#888888';
      case 'passageway': return '#8B4513';
      default: return '#ff6600';
    }
  };
  const color = getToolColor();

  // Create flat points array including mouse position for live preview
  const allPoints = [...points];
  if (mousePosition) {
    allPoints.push(mousePosition);
  }

  const flatPoints = allPoints.flatMap(p => [p.x, p.y]);

  return (
    <Group>
      {/* Main path line */}
      <Line
        points={flatPoints}
        stroke={color}
        strokeWidth={isRoom ? 3 : 3}
        dash={[8, 4]}
        lineCap="round"
        lineJoin="round"
        listening={false}
      />

      {/* For rooms, show closing line to first point */}
      {isRoom && points.length >= 2 && mousePosition && (
        <Line
          points={[mousePosition.x, mousePosition.y, points[0].x, points[0].y]}
          stroke={color}
          strokeWidth={2}
          dash={[4, 4]}
          opacity={0.5}
          listening={false}
        />
      )}

      {/* Vertex circles */}
      {points.map((point, i) => (
        <Circle
          key={`vertex-${i}`}
          x={point.x}
          y={point.y}
          radius={6}
          fill={i === 0 ? '#00cc00' : color}
          stroke="#fff"
          strokeWidth={2}
          listening={false}
        />
      ))}

      {/* Mouse position indicator */}
      {mousePosition && (
        <Circle
          x={mousePosition.x}
          y={mousePosition.y}
          radius={5}
          fill={color}
          opacity={0.6}
          listening={false}
        />
      )}

      {/* For rooms, show fill preview */}
      {isRoom && points.length >= 3 && (
        <Line
          points={points.flatMap(p => [p.x, p.y])}
          fill="rgba(245, 230, 211, 0.3)"
          closed
          listening={false}
        />
      )}
    </Group>
  );
}
