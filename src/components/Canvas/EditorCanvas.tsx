import { useRef, useEffect, useState, useCallback } from 'react';
import { Stage, Layer } from 'react-konva';
import { v4 as uuidv4 } from 'uuid';
import { useEditorStore } from '../../store/editorStore';
import { GridLayer } from './GridLayer';
import { RoomRenderer } from './RoomRenderer';
import { DoorRenderer } from './DoorRenderer';
import { StairsRenderer } from './StairsRenderer';
import { HidingSpotRenderer } from './HidingSpotRenderer';
import { PatrolRouteRenderer } from './PatrolRouteRenderer';
import { DecorationRenderer } from './DecorationRenderer';
import { DrawingPreview } from './DrawingPreview';
import { RectanglePreview } from './RectanglePreview';
import type { Point, Element, RoomElement, PatrolRouteElement } from '../../types/editor';
import type { KonvaEventObject } from 'konva/lib/Node';
import { getWallSegments, snapDoorToWall } from '../../utils/snapUtils';

export function EditorCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 800, height: 600 });
  const [drawingPoints, setDrawingPoints] = useState<Point[]>([]);
  const [mousePosition, setMousePosition] = useState<Point | null>(null);

  // Rectangle drawing state
  const [rectStart, setRectStart] = useState<Point | null>(null);
  const [rectEnd, setRectEnd] = useState<Point | null>(null);

  const {
    zoom,
    setZoom,
    panOffset,
    setPanOffset,
    gridSize,
    snapToGrid,
    activeTool,
    visibleLayers,
    getCurrentLevel,
    selectedElementIds,
    selectElements,
    clearSelection,
    addElement,
    updateElement,
    deleteElements,
  } = useEditorStore();

  const level = getCurrentLevel();

  // Handle container resize
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Snap position to grid
  const snapToGridPos = useCallback((pos: Point): Point => {
    if (!snapToGrid) return pos;
    return {
      x: Math.round(pos.x / gridSize) * gridSize,
      y: Math.round(pos.y / gridSize) * gridSize,
    };
  }, [snapToGrid, gridSize]);

  // Get mouse position on canvas
  const getMousePos = useCallback((e: KonvaEventObject<MouseEvent>): Point => {
    const stage = e.target.getStage();
    if (!stage) return { x: 0, y: 0 };

    const pos = stage.getPointerPosition();
    if (!pos) return { x: 0, y: 0 };

    return {
      x: (pos.x - panOffset.x) / zoom,
      y: (pos.y - panOffset.y) / zoom,
    };
  }, [panOffset, zoom]);

  // Handle wheel for zoom
  const handleWheel = useCallback((e: KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();

    const scaleBy = 1.1;
    const stage = e.target.getStage();
    if (!stage) return;

    const oldScale = zoom;
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const mousePointTo = {
      x: (pointer.x - panOffset.x) / oldScale,
      y: (pointer.y - panOffset.y) / oldScale,
    };

    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
    const clampedScale = Math.max(0.1, Math.min(5, newScale));

    setZoom(clampedScale);
    setPanOffset({
      x: pointer.x - mousePointTo.x * clampedScale,
      y: pointer.y - mousePointTo.y * clampedScale,
    });
  }, [zoom, panOffset, setZoom, setPanOffset]);

  // Handle stage click
  const handleStageClick = useCallback((e: KonvaEventObject<MouseEvent>) => {
    // Only handle clicks on the stage background
    if (e.target !== e.target.getStage()) return;

    const pos = snapToGridPos(getMousePos(e));

    switch (activeTool) {
      case 'select':
        clearSelection();
        break;

      case 'room':
        // Add point to current room being drawn
        setDrawingPoints(prev => [...prev, pos]);
        break;

      case 'door': {
        // Get walls and snap door to nearest wall
        const rooms = level?.elements.filter(e => e.type === 'room') as RoomElement[] || [];
        const walls = getWallSegments(rooms);
        const snapResult = snapDoorToWall(pos, walls, 30);
        addElement({
          id: uuidv4(),
          type: 'door',
          x: snapResult.position.x,
          y: snapResult.position.y,
          rotation: snapResult.rotation,
          width: 40,
        });
        break;
      }

      case 'locked-door': {
        // Get walls and snap door to nearest wall
        const rooms2 = level?.elements.filter(e => e.type === 'room') as RoomElement[] || [];
        const walls2 = getWallSegments(rooms2);
        const snapResult2 = snapDoorToWall(pos, walls2, 30);
        addElement({
          id: uuidv4(),
          type: 'locked-door',
          x: snapResult2.position.x,
          y: snapResult2.position.y,
          rotation: snapResult2.rotation,
          width: 40,
          lockColor: '#ff4444',
        });
        break;
      }

      case 'stairs':
        addElement({
          id: uuidv4(),
          type: 'stairs',
          x: pos.x,
          y: pos.y,
          rotation: 0,
          width: 60,
          height: 100,
          direction: 'up',
        });
        break;

      case 'hiding-spot':
        addElement({
          id: uuidv4(),
          type: 'hiding-spot',
          x: pos.x,
          y: pos.y,
          rotation: 0,
          radius: 20,
        });
        break;

      case 'patrol-route':
        setDrawingPoints(prev => [...prev, pos]);
        break;

      case 'decoration':
        addElement({
          id: uuidv4(),
          type: 'decoration',
          x: pos.x,
          y: pos.y,
          rotation: 0,
          variant: 'tree',
          scale: 1,
        });
        break;
    }
  }, [activeTool, snapToGridPos, getMousePos, clearSelection, addElement]);

  // Handle double-click to finish drawing
  const handleDblClick = useCallback(() => {
    if (activeTool === 'room' && drawingPoints.length >= 3) {
      // Create room from drawing points
      addElement({
        id: uuidv4(),
        type: 'room',
        x: 0,
        y: 0,
        rotation: 0,
        points: drawingPoints,
        name: 'Room',
        fillColor: '#f5e6d3',
        wallThickness: 4,
      });
      setDrawingPoints([]);
      setMousePosition(null);
    } else if (activeTool === 'patrol-route' && drawingPoints.length >= 2) {
      addElement({
        id: uuidv4(),
        type: 'patrol-route',
        x: 0,
        y: 0,
        rotation: 0,
        points: drawingPoints,
        color: '#ff6600',
        loop: false,
      });
      setDrawingPoints([]);
      setMousePosition(null);
    }
  }, [activeTool, drawingPoints, addElement]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Backspace: undo last point while drawing, or delete selected
      if (e.key === 'Backspace') {
        if (drawingPoints.length > 0) {
          e.preventDefault();
          setDrawingPoints(prev => prev.slice(0, -1));
          if (drawingPoints.length <= 1) {
            setMousePosition(null);
          }
        } else if (selectedElementIds.length > 0) {
          deleteElements(selectedElementIds);
        }
        return;
      }

      // Delete selected elements
      if (e.key === 'Delete' && selectedElementIds.length > 0) {
        deleteElements(selectedElementIds);
      }

      // Cancel drawing
      if (e.key === 'Escape') {
        setDrawingPoints([]);
        setMousePosition(null);
        setRectStart(null);
        setRectEnd(null);
        clearSelection();
      }

      // Finish room/route drawing with Enter
      if (e.key === 'Enter') {
        handleDblClick();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElementIds, deleteElements, clearSelection, handleDblClick, drawingPoints.length]);

  // Panning state
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPos, setLastPanPos] = useState<Point>({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e: KonvaEventObject<MouseEvent>) => {
    if (activeTool === 'pan' || e.evt.button === 1) { // Middle mouse button
      setIsPanning(true);
      setLastPanPos({ x: e.evt.clientX, y: e.evt.clientY });
      return;
    }

    // Rectangle drawing - start on mouse down
    if (activeTool === 'rectangle' && e.evt.button === 0) {
      const pos = snapToGridPos(getMousePos(e));
      setRectStart(pos);
      setRectEnd(pos);
    }
  }, [activeTool, snapToGridPos, getMousePos]);

  const handleMouseMove = useCallback((e: KonvaEventObject<MouseEvent>) => {
    if (isPanning) {
      const dx = e.evt.clientX - lastPanPos.x;
      const dy = e.evt.clientY - lastPanPos.y;
      setPanOffset({
        x: panOffset.x + dx,
        y: panOffset.y + dy,
      });
      setLastPanPos({ x: e.evt.clientX, y: e.evt.clientY });
      return;
    }

    // Update rectangle preview while dragging
    if (activeTool === 'rectangle' && rectStart) {
      const pos = snapToGridPos(getMousePos(e));
      setRectEnd(pos);
      return;
    }

    // Update mouse position for polygon/patrol drawing preview
    if ((activeTool === 'room' || activeTool === 'patrol-route') && drawingPoints.length > 0) {
      const pos = snapToGridPos(getMousePos(e));
      setMousePosition(pos);
    }
  }, [isPanning, lastPanPos, panOffset, setPanOffset, activeTool, drawingPoints.length, rectStart, snapToGridPos, getMousePos]);

  // Handle right-click to finish drawing
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    // Prevent context menu when drawing
    if ((activeTool === 'room' || activeTool === 'patrol-route') && drawingPoints.length > 0) {
      e.preventDefault();
      handleDblClick(); // Finish drawing
      return;
    }
    // Allow default context menu otherwise
  }, [activeTool, drawingPoints.length, handleDblClick]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);

    // Finish rectangle drawing
    if (activeTool === 'rectangle' && rectStart && rectEnd) {
      const minX = Math.min(rectStart.x, rectEnd.x);
      const maxX = Math.max(rectStart.x, rectEnd.x);
      const minY = Math.min(rectStart.y, rectEnd.y);
      const maxY = Math.max(rectStart.y, rectEnd.y);

      const width = maxX - minX;
      const height = maxY - minY;

      // Only create room if it has some size
      if (width >= gridSize && height >= gridSize) {
        addElement({
          id: uuidv4(),
          type: 'room',
          x: 0,
          y: 0,
          rotation: 0,
          points: [
            { x: minX, y: minY },
            { x: maxX, y: minY },
            { x: maxX, y: maxY },
            { x: minX, y: maxY },
          ],
          name: 'Room',
          fillColor: '#f5e6d3',
          wallThickness: 4,
        });
      }

      setRectStart(null);
      setRectEnd(null);
    }
  }, [activeTool, rectStart, rectEnd, gridSize, addElement]);

  // Render element based on type
  const renderElement = (element: Element) => {
    if (!visibleLayers[element.type]) return null;

    const isSelected = selectedElementIds.includes(element.id);
    const onSelect = () => selectElements([element.id]);
    const onDragEnd = (x: number, y: number) => {
      const snapped = snapToGridPos({ x, y });
      updateElement(element.id, { x: snapped.x, y: snapped.y });
    };

    switch (element.type) {
      case 'room':
        return (
          <RoomRenderer
            key={element.id}
            element={element as RoomElement}
            isSelected={isSelected}
            onSelect={onSelect}
            onDragEnd={onDragEnd}
            onUpdatePoints={(points) => updateElement(element.id, { points })}
            activeTool={activeTool}
            snapToGrid={snapToGrid}
            gridSize={gridSize}
          />
        );
      case 'door':
      case 'locked-door': {
        // Get walls for snapping during drag
        const doorRooms = level?.elements.filter(e => e.type === 'room') as RoomElement[] || [];
        const doorWalls = getWallSegments(doorRooms);
        return (
          <DoorRenderer
            key={element.id}
            element={element}
            isSelected={isSelected}
            onSelect={onSelect}
            onDragEnd={(x, y, rotation) => {
              const snapped = snapToGridPos({ x, y });
              const updates: Partial<typeof element> = { x: snapped.x, y: snapped.y };
              if (rotation !== undefined) {
                updates.rotation = rotation;
              }
              updateElement(element.id, updates);
            }}
            walls={doorWalls}
            snapThreshold={30}
          />
        );
      }
      case 'stairs':
        return (
          <StairsRenderer
            key={element.id}
            element={element}
            isSelected={isSelected}
            onSelect={onSelect}
            onDragEnd={onDragEnd}
          />
        );
      case 'hiding-spot':
        return (
          <HidingSpotRenderer
            key={element.id}
            element={element}
            isSelected={isSelected}
            onSelect={onSelect}
            onDragEnd={onDragEnd}
          />
        );
      case 'patrol-route':
        return (
          <PatrolRouteRenderer
            key={element.id}
            element={element as PatrolRouteElement}
            isSelected={isSelected}
            onSelect={onSelect}
            onDragEnd={onDragEnd}
          />
        );
      case 'decoration':
        return (
          <DecorationRenderer
            key={element.id}
            element={element}
            isSelected={isSelected}
            onSelect={onSelect}
            onDragEnd={onDragEnd}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      ref={containerRef}
      className="flex-1 bg-gray-900 overflow-hidden"
      style={{ cursor: activeTool === 'pan' || isPanning ? 'grab' : activeTool === 'rectangle' ? 'crosshair' : 'crosshair' }}
      onContextMenu={handleContextMenu}
    >
      <Stage
        width={size.width}
        height={size.height}
        scaleX={zoom}
        scaleY={zoom}
        x={panOffset.x}
        y={panOffset.y}
        onWheel={handleWheel}
        onClick={handleStageClick}
        onDblClick={handleDblClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Grid layer */}
        <Layer>
          <GridLayer
            width={size.width}
            height={size.height}
            gridSize={gridSize}
            zoom={zoom}
            panOffset={panOffset}
          />
        </Layer>

        {/* Elements layer */}
        <Layer>
          {level?.elements.map(renderElement)}

          {/* Polygon/patrol drawing preview */}
          {(activeTool === 'room' || activeTool === 'patrol-route') && drawingPoints.length > 0 && (
            <DrawingPreview
              points={drawingPoints}
              tool={activeTool}
              mousePosition={mousePosition}
            />
          )}

          {/* Rectangle drawing preview */}
          {activeTool === 'rectangle' && rectStart && rectEnd && (
            <RectanglePreview
              start={rectStart}
              end={rectEnd}
              gridSize={gridSize}
            />
          )}
        </Layer>
      </Stage>

      {/* Drawing instructions */}
      {(activeTool === 'room' || activeTool === 'patrol-route') && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg text-sm">
          {drawingPoints.length === 0
            ? `Click to place ${activeTool === 'room' ? 'corners' : 'waypoints'}`
            : `${drawingPoints.length} point${drawingPoints.length > 1 ? 's' : ''} · Right-click/Enter to finish · Backspace to undo · Esc to cancel`}
        </div>
      )}
      {activeTool === 'rectangle' && !rectStart && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg text-sm">
          Click and drag to draw a rectangle room
        </div>
      )}
    </div>
  );
}
