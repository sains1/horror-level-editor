import Konva from 'konva';
import type { Element } from '../types/editor';

export interface ExportOptions {
  fullLevel?: boolean;
  includeGrid?: boolean;
  filename?: string;
  pixelRatio?: number;
}

/**
 * Calculate the bounding box of all elements on the canvas
 */
function calculateElementsBoundingBox(elements: Element[]): {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
} {
  if (elements.length === 0) {
    return { minX: 0, minY: 0, maxX: 100, maxY: 100, width: 100, height: 100 };
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const element of elements) {
    // Handle room and patrol-route with points array
    if ('points' in element && Array.isArray(element.points)) {
      for (const point of element.points) {
        minX = Math.min(minX, point.x + element.x);
        minY = Math.min(minY, point.y + element.y);
        maxX = Math.max(maxX, point.x + element.x);
        maxY = Math.max(maxY, point.y + element.y);
      }
    } else {
      // Handle elements with width/height or radius
      const width = 'width' in element ? (element as any).width :
                    'radius' in element ? (element as any).radius * 2 : 40;
      const height = 'height' in element ? (element as any).height :
                     'radius' in element ? (element as any).radius * 2 : 40;

      minX = Math.min(minX, element.x - width / 2);
      minY = Math.min(minY, element.y - height / 2);
      maxX = Math.max(maxX, element.x + width / 2);
      maxY = Math.max(maxY, element.y + height / 2);
    }
  }

  // Add padding
  const padding = 50;
  minX -= padding;
  minY -= padding;
  maxX += padding;
  maxY += padding;

  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

/**
 * Export the Konva stage as a PNG image
 */
export function exportCanvasAsPng(
  stage: Konva.Stage,
  elements: Element[],
  options: ExportOptions = {}
): void {
  const {
    fullLevel = false,
    includeGrid = false,
    filename = `level-export-${Date.now()}.png`,
    pixelRatio = 2,
  } = options;

  // Find the grid layer (first layer) to hide/show it
  const layers = stage.getLayers();
  const gridLayer = layers[0]; // Grid is on the first layer

  // Store original state
  const originalScale = { x: stage.scaleX(), y: stage.scaleY() };
  const originalPosition = { x: stage.x(), y: stage.y() };
  const gridWasVisible = gridLayer?.visible() ?? true;

  try {
    // Hide grid if not including it
    if (!includeGrid && gridLayer) {
      gridLayer.visible(false);
    }

    let exportOptions: {
      pixelRatio?: number;
      mimeType?: string;
      x?: number;
      y?: number;
      width?: number;
      height?: number;
    } = {
      pixelRatio,
      mimeType: 'image/png',
    };

    if (fullLevel && elements.length > 0) {
      // Calculate bounding box of all elements
      const bounds = calculateElementsBoundingBox(elements);

      // Set export region to cover all elements
      exportOptions = {
        ...exportOptions,
        x: bounds.minX,
        y: bounds.minY,
        width: bounds.width,
        height: bounds.height,
      };
    }

    // Generate the data URL
    const dataUrl = stage.toDataURL(exportOptions);

    // Create download link
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

  } finally {
    // Restore original state
    if (!includeGrid && gridLayer) {
      gridLayer.visible(gridWasVisible);
    }
    stage.scale(originalScale);
    stage.position(originalPosition);
    stage.batchDraw();
  }
}
