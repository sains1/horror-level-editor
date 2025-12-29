import type { Point, RoomElement } from '../types/editor';

export interface WallSegment {
  p1: Point;
  p2: Point;
  roomId: string;
  angle: number; // Wall angle in degrees
}

export interface SnapResult {
  position: Point;
  rotation: number;
  snapped: boolean;
}

/**
 * Extract all wall segments from rooms
 */
export function getWallSegments(rooms: RoomElement[]): WallSegment[] {
  const segments: WallSegment[] = [];

  for (const room of rooms) {
    const { points, x, y, id } = room;
    for (let i = 0; i < points.length; i++) {
      // Transform points to world coordinates
      const p1 = { x: points[i].x + x, y: points[i].y + y };
      const p2 = { x: points[(i + 1) % points.length].x + x, y: points[(i + 1) % points.length].y + y };

      // Calculate wall angle in degrees
      const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;

      segments.push({ p1, p2, roomId: id, angle });
    }
  }

  return segments;
}

/**
 * Find the nearest point on a line segment to a given point
 */
function nearestPointOnSegment(point: Point, p1: Point, p2: Point): Point {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const lengthSquared = dx * dx + dy * dy;

  if (lengthSquared === 0) return p1;

  // Project point onto line, clamped to segment
  let t = ((point.x - p1.x) * dx + (point.y - p1.y) * dy) / lengthSquared;
  t = Math.max(0, Math.min(1, t));

  return {
    x: p1.x + t * dx,
    y: p1.y + t * dy,
  };
}

/**
 * Calculate distance from a point to a line segment
 */
function distanceToSegment(point: Point, p1: Point, p2: Point): number {
  const nearest = nearestPointOnSegment(point, p1, p2);
  const dx = point.x - nearest.x;
  const dy = point.y - nearest.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Find snap position for a door near walls
 */
export function snapDoorToWall(
  doorPos: Point,
  walls: WallSegment[],
  snapThreshold: number = 30
): SnapResult {
  let nearestWall: WallSegment | null = null;
  let nearestDistance = Infinity;
  let nearestPoint: Point = doorPos;

  for (const wall of walls) {
    const distance = distanceToSegment(doorPos, wall.p1, wall.p2);
    if (distance < nearestDistance && distance < snapThreshold) {
      nearestDistance = distance;
      nearestWall = wall;
      nearestPoint = nearestPointOnSegment(doorPos, wall.p1, wall.p2);
    }
  }

  if (nearestWall) {
    return {
      position: nearestPoint,
      rotation: nearestWall.angle,
      snapped: true,
    };
  }

  return {
    position: doorPos,
    rotation: 0,
    snapped: false,
  };
}
