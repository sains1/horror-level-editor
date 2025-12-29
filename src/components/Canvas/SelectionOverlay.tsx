import { Group, Circle, Line, Rect } from 'react-konva';
import type { Element, RoomElement, PatrolRouteElement } from '../../types/editor';
import type Konva from 'konva';
import { useRef, useState, useCallback } from 'react';

interface SelectionOverlayProps {
  element: Element;
  zoom: number;
  onRotate: (rotation: number) => void;
}

// Get the bounding box and center for an element
function getElementBounds(element: Element): { center: { x: number; y: number }; radius: number } {
  if (element.type === 'room' || element.type === 'patrol-route') {
    const pointsElement = element as RoomElement | PatrolRouteElement;
    const points = pointsElement.points;
    if (points.length === 0) return { center: { x: element.x, y: element.y }, radius: 30 };

    const minX = Math.min(...points.map(p => p.x));
    const maxX = Math.max(...points.map(p => p.x));
    const minY = Math.min(...points.map(p => p.y));
    const maxY = Math.max(...points.map(p => p.y));

    const centerX = element.x + (minX + maxX) / 2;
    const centerY = element.y + (minY + maxY) / 2;
    const radius = Math.max(maxX - minX, maxY - minY) / 2 + 20;

    return { center: { x: centerX, y: centerY }, radius };
  }

  // For other elements, estimate size based on type
  let radius = 35;
  if (element.type === 'stairs') {
    radius = 60;
  } else if (element.type === 'hiding-spot') {
    radius = (element as { radius: number }).radius + 15;
  } else if (element.type === 'jumpscare' || element.type === 'objective') {
    radius = (element as { radius: number }).radius + 15;
  } else if (element.type === 'decoration' || element.type === 'character' || element.type === 'item') {
    const scaled = element as { scale: number };
    radius = 30 * (scaled.scale || 1);
  }

  return { center: { x: element.x, y: element.y }, radius };
}

export function SelectionOverlay({ element, zoom, onRotate }: SelectionOverlayProps) {
  const [isRotating, setIsRotating] = useState(false);
  const startAngleRef = useRef(0);
  const startRotationRef = useRef(0);

  const { center, radius } = getElementBounds(element);
  const handleDistance = radius + 25;
  const handleSize = Math.max(8, 10 / zoom);

  // Calculate handle position based on current rotation
  const currentRotation = element.rotation || 0;
  const handleAngle = (currentRotation - 90) * (Math.PI / 180); // -90 to put handle at top
  const handleX = center.x + Math.cos(handleAngle) * handleDistance;
  const handleY = center.y + Math.sin(handleAngle) * handleDistance;

  const handleRotateStart = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    e.cancelBubble = true;
    setIsRotating(true);

    // Calculate starting angle from center to mouse
    const stage = e.target.getStage();
    if (!stage) return;

    const pos = stage.getPointerPosition();
    if (!pos) return;

    // Convert to canvas coordinates
    const transform = stage.getAbsoluteTransform().copy().invert();
    const canvasPos = transform.point(pos);

    const dx = canvasPos.x - center.x;
    const dy = canvasPos.y - center.y;
    startAngleRef.current = Math.atan2(dy, dx) * (180 / Math.PI);
    startRotationRef.current = currentRotation;
  }, [center.x, center.y, currentRotation]);

  const handleRotateMove = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!isRotating) return;
    e.cancelBubble = true;

    const stage = e.target.getStage();
    if (!stage) return;

    const pos = stage.getPointerPosition();
    if (!pos) return;

    // Convert to canvas coordinates
    const transform = stage.getAbsoluteTransform().copy().invert();
    const canvasPos = transform.point(pos);

    const dx = canvasPos.x - center.x;
    const dy = canvasPos.y - center.y;
    const currentAngle = Math.atan2(dy, dx) * (180 / Math.PI);

    let newRotation = startRotationRef.current + (currentAngle - startAngleRef.current);

    // Normalize to 0-360
    while (newRotation < 0) newRotation += 360;
    while (newRotation >= 360) newRotation -= 360;

    // Snap to 15-degree increments when close
    const snapAngle = 15;
    const snapped = Math.round(newRotation / snapAngle) * snapAngle;
    if (Math.abs(newRotation - snapped) < 5) {
      newRotation = snapped;
    }

    onRotate(newRotation);
  }, [isRotating, center.x, center.y, onRotate]);

  const handleRotateEnd = useCallback(() => {
    setIsRotating(false);
  }, []);

  // Line from center to handle
  const lineEndAngle = (currentRotation - 90) * (Math.PI / 180);
  const lineEndX = center.x + Math.cos(lineEndAngle) * (handleDistance - handleSize);
  const lineEndY = center.y + Math.sin(lineEndAngle) * (handleDistance - handleSize);

  return (
    <Group>
      {/* Line to rotation handle */}
      <Line
        points={[center.x, center.y, lineEndX, lineEndY]}
        stroke="#4488ff"
        strokeWidth={1.5 / zoom}
        dash={[4 / zoom, 2 / zoom]}
        listening={false}
      />

      {/* Rotation handle */}
      <Group
        x={handleX}
        y={handleY}
        draggable
        onMouseDown={handleRotateStart}
        onDragMove={handleRotateMove}
        onDragEnd={handleRotateEnd}
        onMouseUp={handleRotateEnd}
      >
        {/* Outer circle (background) */}
        <Circle
          radius={handleSize + 2}
          fill="#1e3a5f"
          stroke="#4488ff"
          strokeWidth={2 / zoom}
        />
        {/* Rotation icon - curved arrow */}
        <Line
          points={[
            -handleSize * 0.5, -handleSize * 0.3,
            0, -handleSize * 0.6,
            handleSize * 0.5, -handleSize * 0.3,
          ]}
          stroke="white"
          strokeWidth={1.5 / zoom}
          lineCap="round"
          lineJoin="round"
        />
        <Line
          points={[
            handleSize * 0.5, handleSize * 0.3,
            0, handleSize * 0.6,
            -handleSize * 0.5, handleSize * 0.3,
          ]}
          stroke="white"
          strokeWidth={1.5 / zoom}
          lineCap="round"
          lineJoin="round"
        />
      </Group>

      {/* Rotation angle indicator when rotating */}
      {isRotating && (
        <Rect
          x={center.x - 25}
          y={center.y - radius - 35}
          width={50}
          height={20}
          fill="rgba(0,0,0,0.8)"
          cornerRadius={4}
        />
      )}
      {isRotating && (
        <Line
          points={[center.x, center.y - radius - 25]}
          stroke="white"
          strokeWidth={0}
        />
      )}
    </Group>
  );
}
