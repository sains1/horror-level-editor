import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { Stage, Layer, Rect } from 'react-konva';
import Konva from 'konva';
import { v4 as uuidv4 } from 'uuid';
import { useEditorStore } from '../../store/editorStore';
import { GridLayer } from './GridLayer';
import { RoomRenderer } from './RoomRenderer';
import { DoorRenderer } from './DoorRenderer';
import { StairsRenderer } from './StairsRenderer';
import { HidingSpotRenderer } from './HidingSpotRenderer';
import { PatrolRouteRenderer } from './PatrolRouteRenderer';
import { VentRenderer } from './VentRenderer';
import { PassagewayRenderer } from './PassagewayRenderer';
import { DecorationRenderer } from './DecorationRenderer';
import { CharacterRenderer } from './CharacterRenderer';
import { JumpscareRenderer } from './JumpscareRenderer';
import { ItemRenderer } from './ItemRenderer';
import { SpawnRenderer } from './SpawnRenderer';
import { ObjectiveRenderer } from './ObjectiveRenderer';
import { AnnotationRenderer } from './AnnotationRenderer';
import { DrawingPreview } from './DrawingPreview';
import { RectanglePreview } from './RectanglePreview';
import { SelectionOverlay } from './SelectionOverlay';
import type { Point, Element, Tool, RoomElement, PatrolRouteElement, VentElement, PassagewayElement, CharacterElement, JumpscareElement, ItemElement, SpawnElement, ObjectiveElement, AnnotationElement, ElementType, DecorationVariant, CharacterVariant, ItemVariant, SpawnVariant } from '../../types/editor';
import type { KonvaEventObject } from 'konva/lib/Node';
import { getWallSegments, snapDoorToWall } from '../../utils/snapUtils';

// Z-order for rendering elements (lower = rendered first/bottom)
const ELEMENT_Z_ORDER: Record<ElementType, number> = {
  'room': 0,           // Rooms at the bottom
  'decoration': 10,    // Decorations above rooms
  'patrol-route': 20,  // Routes above decorations
  'vent': 22,          // Vents above patrol routes
  'passageway': 24,    // Passageways above vents
  'door': 30,          // Doors above routes
  'locked-door': 30,   // Same level as doors
  'stairs': 40,        // Stairs above doors
  'hiding-spot': 50,   // Hiding spots above stairs
  'item': 60,          // Items above hiding spots
  'jumpscare': 70,     // Jump scares above items
  'character': 80,     // Characters on top
  'spawn': 85,         // Spawn points near top
  'objective': 90,     // Objectives above spawns
  'annotation': 100,   // Annotations on top
};

export function EditorCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const [size, setSize] = useState({ width: 800, height: 600 });
  const [drawingPoints, setDrawingPoints] = useState<Point[]>([]);
  const [mousePosition, setMousePosition] = useState<Point | null>(null);

  // Rectangle drawing state
  const [rectStart, setRectStart] = useState<Point | null>(null);
  const [rectEnd, setRectEnd] = useState<Point | null>(null);

  // Box selection state
  const [isBoxSelecting, setIsBoxSelecting] = useState(false);
  const [boxSelectStart, setBoxSelectStart] = useState<Point | null>(null);
  const [boxSelectEnd, setBoxSelectEnd] = useState<Point | null>(null);
  const justFinishedBoxSelect = useRef(false);

  // Multi-select drag tracking - stores original position of dragged element
  const dragStartPos = useRef<{ elementId: string; x: number; y: number } | null>(null);

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
    moveElements,
    deleteElements,
    selectedDecorationVariant,
    selectedCharacterVariant,
    selectedItemVariant,
    selectedSpawnVariant,
    setStageRef,
  } = useEditorStore();

  const level = getCurrentLevel();

  // Set the stage ref in the store for PNG export functionality
  useEffect(() => {
    if (stageRef.current) {
      setStageRef(stageRef.current);
    }
    return () => {
      setStageRef(null);
    };
  }, [setStageRef]);

  // Sort elements by z-order for proper rendering layering
  const sortedElements = useMemo(() => {
    if (!level?.elements) return [];
    return [...level.elements].sort(
      (a, b) => (ELEMENT_Z_ORDER[a.type] ?? 0) - (ELEMENT_Z_ORDER[b.type] ?? 0)
    );
  }, [level?.elements]);

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
    // For select and pan tools, only handle clicks on the stage background
    // For placement tools, allow clicking anywhere to place elements
    const isPlacementTool = activeTool !== 'select' && activeTool !== 'pan';
    if (!isPlacementTool && e.target !== e.target.getStage()) return;

    const pos = snapToGridPos(getMousePos(e));

    switch (activeTool) {
      case 'select':
        // Skip clearing if we just finished a box selection (onClick fires after mouseUp)
        if (justFinishedBoxSelect.current) {
          justFinishedBoxSelect.current = false;
          return;
        }
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
        const doorId = uuidv4();
        addElement({
          id: doorId,
          type: 'door',
          x: snapResult.position.x,
          y: snapResult.position.y,
          rotation: snapResult.rotation,
          width: 40,
        });
        selectElements([doorId]);
        break;
      }

      case 'locked-door': {
        // Get walls and snap door to nearest wall
        const rooms2 = level?.elements.filter(e => e.type === 'room') as RoomElement[] || [];
        const walls2 = getWallSegments(rooms2);
        const snapResult2 = snapDoorToWall(pos, walls2, 30);
        const lockedDoorId = uuidv4();
        addElement({
          id: lockedDoorId,
          type: 'locked-door',
          x: snapResult2.position.x,
          y: snapResult2.position.y,
          rotation: snapResult2.rotation,
          width: 40,
          lockColor: '#ff4444',
        });
        selectElements([lockedDoorId]);
        break;
      }

      case 'stairs': {
        const stairsId = uuidv4();
        addElement({
          id: stairsId,
          type: 'stairs',
          x: pos.x,
          y: pos.y,
          rotation: 0,
          width: 60,
          height: 100,
          direction: 'up',
        });
        selectElements([stairsId]);
        break;
      }

      case 'hiding-spot': {
        const hidingSpotId = uuidv4();
        addElement({
          id: hidingSpotId,
          type: 'hiding-spot',
          x: pos.x,
          y: pos.y,
          rotation: 0,
          radius: 20,
        });
        selectElements([hidingSpotId]);
        break;
      }

      case 'patrol-route':
      case 'vent':
      case 'passageway':
        setDrawingPoints(prev => [...prev, pos]);
        break;

      case 'decoration': {
        const decorationId = uuidv4();
        addElement({
          id: decorationId,
          type: 'decoration',
          x: pos.x,
          y: pos.y,
          rotation: 0,
          variant: selectedDecorationVariant,
          scale: 1,
        });
        selectElements([decorationId]);
        break;
      }

      case 'character': {
        const characterId = uuidv4();
        addElement({
          id: characterId,
          type: 'character',
          x: pos.x,
          y: pos.y,
          rotation: 0,
          variant: selectedCharacterVariant,
          name: '',
          scale: 1,
        });
        selectElements([characterId]);
        break;
      }

      case 'jumpscare': {
        const jumpscareId = uuidv4();
        addElement({
          id: jumpscareId,
          type: 'jumpscare',
          x: pos.x,
          y: pos.y,
          rotation: 0,
          name: '',
          radius: 40,
          triggerOnce: true,
        });
        selectElements([jumpscareId]);
        break;
      }

      case 'item': {
        const itemId = uuidv4();
        addElement({
          id: itemId,
          type: 'item',
          x: pos.x,
          y: pos.y,
          rotation: 0,
          variant: selectedItemVariant,
          name: '',
          scale: 1,
          color: '#FFD700',
        });
        selectElements([itemId]);
        break;
      }

      case 'annotation': {
        const annotationId = uuidv4();
        addElement({
          id: annotationId,
          type: 'annotation',
          x: pos.x,
          y: pos.y,
          rotation: 0,
          text: 'Note',
          fontSize: 'medium',
          color: '#333333',
          backgroundColor: '#FFEB3B',
        });
        selectElements([annotationId]);
        break;
      }

      case 'spawn': {
        const spawnId = uuidv4();
        addElement({
          id: spawnId,
          type: 'spawn',
          x: pos.x,
          y: pos.y,
          rotation: 0,
          variant: selectedSpawnVariant,
          name: '',
          direction: 0,
          respawn: 'once',
        });
        selectElements([spawnId]);
        break;
      }

      case 'objective': {
        const objectiveId = uuidv4();
        // Count existing objectives to auto-increment order
        const existingObjectives = level?.elements.filter(e => e.type === 'objective') || [];
        addElement({
          id: objectiveId,
          type: 'objective',
          x: pos.x,
          y: pos.y,
          rotation: 0,
          name: '',
          description: '',
          objectiveType: 'primary',
          order: existingObjectives.length + 1,
          radius: 40,
          requiredItem: null,
        });
        selectElements([objectiveId]);
        break;
      }
    }
  }, [activeTool, snapToGridPos, getMousePos, clearSelection, addElement, selectElements, selectedDecorationVariant, selectedCharacterVariant, selectedItemVariant, selectedSpawnVariant, level?.elements]);

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
        lightLevel: 100,
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
    } else if (activeTool === 'vent' && drawingPoints.length >= 2) {
      addElement({
        id: uuidv4(),
        type: 'vent',
        x: 0,
        y: 0,
        rotation: 0,
        points: drawingPoints,
        color: '#888888',
      });
      setDrawingPoints([]);
      setMousePosition(null);
    } else if (activeTool === 'passageway' && drawingPoints.length >= 2) {
      addElement({
        id: uuidv4(),
        type: 'passageway',
        x: 0,
        y: 0,
        rotation: 0,
        points: drawingPoints,
        color: '#8B4513',
      });
      setDrawingPoints([]);
      setMousePosition(null);
    }
  }, [activeTool, drawingPoints, addElement]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle keyboard shortcuts when typing in an input field
      const activeElement = document.activeElement;
      const isInputFocused = activeElement instanceof HTMLInputElement ||
                            activeElement instanceof HTMLTextAreaElement ||
                            activeElement instanceof HTMLSelectElement;

      // Backspace: undo last point while drawing, or delete selected (but not when typing)
      if (e.key === 'Backspace') {
        if (drawingPoints.length > 0) {
          e.preventDefault();
          setDrawingPoints(prev => prev.slice(0, -1));
          if (drawingPoints.length <= 1) {
            setMousePosition(null);
          }
        } else if (selectedElementIds.length > 0 && !isInputFocused) {
          e.preventDefault();
          deleteElements(selectedElementIds);
        }
        return;
      }

      // Delete selected elements (but not when typing in an input)
      if (e.key === 'Delete' && selectedElementIds.length > 0 && !isInputFocused) {
        deleteElements(selectedElementIds);
      }

      // Cancel drawing
      if (e.key === 'Escape') {
        setDrawingPoints([]);
        setMousePosition(null);
        setRectStart(null);
        setRectEnd(null);
        setIsBoxSelecting(false);
        setBoxSelectStart(null);
        setBoxSelectEnd(null);
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
    // Pan with pan tool, middle mouse button, or right mouse button (when not drawing)
    const isDrawing = (activeTool === 'room' || activeTool === 'patrol-route' || activeTool === 'vent' || activeTool === 'passageway') && drawingPoints.length > 0;
    if (activeTool === 'pan' || e.evt.button === 1 || (e.evt.button === 2 && !isDrawing)) {
      setIsPanning(true);
      setLastPanPos({ x: e.evt.clientX, y: e.evt.clientY });
      return;
    }

    // Rectangle drawing - start on mouse down
    if (activeTool === 'rectangle' && e.evt.button === 0) {
      const pos = snapToGridPos(getMousePos(e));
      setRectStart(pos);
      setRectEnd(pos);
      return;
    }

    // Box selection - start when clicking on the stage background with select tool
    if (activeTool === 'select' && e.evt.button === 0 && e.target === e.target.getStage()) {
      const pos = getMousePos(e);
      setIsBoxSelecting(true);
      setBoxSelectStart(pos);
      setBoxSelectEnd(pos);
    }
  }, [activeTool, snapToGridPos, getMousePos, drawingPoints.length]);

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

    // Update box selection while dragging
    if (isBoxSelecting) {
      const pos = getMousePos(e);
      setBoxSelectEnd(pos);
      return;
    }

    // Update mouse position for polygon/patrol/vent/passageway drawing preview
    if ((activeTool === 'room' || activeTool === 'patrol-route' || activeTool === 'vent' || activeTool === 'passageway') && drawingPoints.length > 0) {
      const pos = snapToGridPos(getMousePos(e));
      setMousePosition(pos);
    }
  }, [isPanning, lastPanPos, panOffset, setPanOffset, activeTool, drawingPoints.length, rectStart, isBoxSelecting, snapToGridPos, getMousePos]);

  // Handle right-click to finish drawing or prevent context menu for panning
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    // Prevent context menu when drawing - finish drawing instead
    if ((activeTool === 'room' || activeTool === 'patrol-route' || activeTool === 'vent' || activeTool === 'passageway') && drawingPoints.length > 0) {
      e.preventDefault();
      handleDblClick(); // Finish drawing
      return;
    }
    // Prevent context menu otherwise to allow right-click panning
    e.preventDefault();
  }, [activeTool, drawingPoints.length, handleDblClick]);

  // Handle drag over for drop zone
  const handleDragOver = useCallback((e: React.DragEvent) => {
    if (e.dataTransfer.types.includes('application/level-editor-tool')) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    }
  }, []);

  // Handle drop from sidebar
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();

    const data = e.dataTransfer.getData('application/level-editor-tool');
    if (!data) return;

    try {
      const { tool, variant } = JSON.parse(data) as { tool: Tool; variant?: string };

      // Get drop position relative to the container
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const rawPos = {
        x: (e.clientX - rect.left - panOffset.x) / zoom,
        y: (e.clientY - rect.top - panOffset.y) / zoom,
      };

      // Snap to grid
      const pos = snapToGridPos(rawPos);

      // Create element based on tool type
      switch (tool) {
        case 'door': {
          const rooms = level?.elements.filter(el => el.type === 'room') as RoomElement[] || [];
          const walls = getWallSegments(rooms);
          const snapResult = snapDoorToWall(pos, walls, 30);
          const doorId = uuidv4();
          addElement({
            id: doorId,
            type: 'door',
            x: snapResult.position.x,
            y: snapResult.position.y,
            rotation: snapResult.rotation,
            width: 40,
          });
          selectElements([doorId]);
          break;
        }

        case 'locked-door': {
          const rooms2 = level?.elements.filter(el => el.type === 'room') as RoomElement[] || [];
          const walls2 = getWallSegments(rooms2);
          const snapResult2 = snapDoorToWall(pos, walls2, 30);
          const lockedDoorId = uuidv4();
          addElement({
            id: lockedDoorId,
            type: 'locked-door',
            x: snapResult2.position.x,
            y: snapResult2.position.y,
            rotation: snapResult2.rotation,
            width: 40,
            lockColor: '#ff4444',
          });
          selectElements([lockedDoorId]);
          break;
        }

        case 'stairs': {
          const stairsId = uuidv4();
          addElement({
            id: stairsId,
            type: 'stairs',
            x: pos.x,
            y: pos.y,
            rotation: 0,
            width: 60,
            height: 100,
            direction: 'up',
          });
          selectElements([stairsId]);
          break;
        }

        case 'hiding-spot': {
          const hidingSpotId = uuidv4();
          addElement({
            id: hidingSpotId,
            type: 'hiding-spot',
            x: pos.x,
            y: pos.y,
            rotation: 0,
            radius: 20,
          });
          selectElements([hidingSpotId]);
          break;
        }

        case 'decoration': {
          const decorationId = uuidv4();
          addElement({
            id: decorationId,
            type: 'decoration',
            x: pos.x,
            y: pos.y,
            rotation: 0,
            variant: (variant as DecorationVariant) || 'tree',
            scale: 1,
          });
          selectElements([decorationId]);
          break;
        }

        case 'character': {
          const characterId = uuidv4();
          addElement({
            id: characterId,
            type: 'character',
            x: pos.x,
            y: pos.y,
            rotation: 0,
            variant: (variant as CharacterVariant) || 'shadow-monster',
            name: '',
            scale: 1,
          });
          selectElements([characterId]);
          break;
        }

        case 'jumpscare': {
          const jumpscareId = uuidv4();
          addElement({
            id: jumpscareId,
            type: 'jumpscare',
            x: pos.x,
            y: pos.y,
            rotation: 0,
            name: '',
            radius: 40,
            triggerOnce: true,
          });
          selectElements([jumpscareId]);
          break;
        }

        case 'item': {
          const itemId = uuidv4();
          addElement({
            id: itemId,
            type: 'item',
            x: pos.x,
            y: pos.y,
            rotation: 0,
            variant: (variant as ItemVariant) || 'key',
            name: '',
            scale: 1,
            color: '#FFD700',
          });
          selectElements([itemId]);
          break;
        }

        case 'spawn': {
          const spawnId = uuidv4();
          addElement({
            id: spawnId,
            type: 'spawn',
            x: pos.x,
            y: pos.y,
            rotation: 0,
            variant: (variant as SpawnVariant) || 'player-start',
            name: '',
            direction: 0,
            respawn: 'once',
          });
          selectElements([spawnId]);
          break;
        }

        case 'objective': {
          const objectiveId = uuidv4();
          const existingObjectives = level?.elements.filter(el => el.type === 'objective') || [];
          addElement({
            id: objectiveId,
            type: 'objective',
            x: pos.x,
            y: pos.y,
            rotation: 0,
            name: '',
            description: '',
            objectiveType: 'primary',
            order: existingObjectives.length + 1,
            radius: 40,
            requiredItem: null,
          });
          selectElements([objectiveId]);
          break;
        }

        case 'annotation': {
          const annotationId = uuidv4();
          addElement({
            id: annotationId,
            type: 'annotation',
            x: pos.x,
            y: pos.y,
            rotation: 0,
            text: 'Note',
            fontSize: 'medium',
            color: '#333333',
            backgroundColor: '#FFEB3B',
          });
          selectElements([annotationId]);
          break;
        }
      }
    } catch (err) {
      console.error('Failed to parse drop data:', err);
    }
  }, [panOffset, zoom, snapToGridPos, level?.elements, addElement, selectElements]);

  // Helper function to get element center
  const getElementCenter = useCallback((element: Element): Point => {
    // For rooms, patrol routes, vents, and passageways, calculate center from points
    if (element.type === 'room' || element.type === 'patrol-route' || element.type === 'vent' || element.type === 'passageway') {
      const pointsElement = element as RoomElement | PatrolRouteElement | VentElement | PassagewayElement;
      const points = pointsElement.points;
      if (points.length === 0) return { x: element.x, y: element.y };
      const sumX = points.reduce((sum, p) => sum + p.x, 0);
      const sumY = points.reduce((sum, p) => sum + p.y, 0);
      return {
        x: element.x + sumX / points.length,
        y: element.y + sumY / points.length,
      };
    }
    // For other elements, use their x,y position as center
    return { x: element.x, y: element.y };
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);

    // Finish box selection
    if (isBoxSelecting && boxSelectStart && boxSelectEnd) {
      const minX = Math.min(boxSelectStart.x, boxSelectEnd.x);
      const maxX = Math.max(boxSelectStart.x, boxSelectEnd.x);
      const minY = Math.min(boxSelectStart.y, boxSelectEnd.y);
      const maxY = Math.max(boxSelectStart.y, boxSelectEnd.y);

      // Only select elements if the box has some size (prevents accidental clicks)
      const boxWidth = maxX - minX;
      const boxHeight = maxY - minY;

      if (boxWidth > 5 || boxHeight > 5) {
        // Find all elements whose centers fall within the selection box
        const elementsInBox = (level?.elements || []).filter(element => {
          const center = getElementCenter(element);
          return center.x >= minX && center.x <= maxX && center.y >= minY && center.y <= maxY;
        });

        if (elementsInBox.length > 0) {
          selectElements(elementsInBox.map(e => e.id));
        } else {
          clearSelection();
        }
        // Mark that we just finished box selecting so onClick doesn't clear selection
        justFinishedBoxSelect.current = true;
      } else {
        // Small box = click, clear selection
        clearSelection();
      }

      setIsBoxSelecting(false);
      setBoxSelectStart(null);
      setBoxSelectEnd(null);
      return;
    }

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
          lightLevel: 100,
        });
      }

      setRectStart(null);
      setRectEnd(null);
    }
  }, [activeTool, rectStart, rectEnd, gridSize, addElement, isBoxSelecting, boxSelectStart, boxSelectEnd, level?.elements, getElementCenter, selectElements, clearSelection]);

  // Render element based on type
  const renderElement = (element: Element) => {
    if (!visibleLayers[element.type]) return null;

    const isSelected = selectedElementIds.includes(element.id);
    const onSelect = () => selectElements([element.id]);
    const canDrag = activeTool !== 'pan';

    // Track original position when drag starts for multi-select movement
    const onDragStart = () => {
      dragStartPos.current = { elementId: element.id, x: element.x, y: element.y };
    };

    const onDragEnd = (x: number, y: number) => {
      const snapped = snapToGridPos({ x, y });

      // Check if this element is part of a multi-selection
      if (isSelected && selectedElementIds.length > 1 && dragStartPos.current?.elementId === element.id) {
        // Calculate delta from original position
        const delta = {
          x: snapped.x - dragStartPos.current.x,
          y: snapped.y - dragStartPos.current.y,
        };
        // Move all selected elements by this delta
        moveElements(selectedElementIds, delta);
      } else {
        // Single element drag
        updateElement(element.id, { x: snapped.x, y: snapped.y });
      }

      dragStartPos.current = null;
    };

    switch (element.type) {
      case 'room':
        return (
          <RoomRenderer
            key={element.id}
            element={element as RoomElement}
            isSelected={isSelected}
            onSelect={onSelect}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onUpdatePoints={(points) => updateElement(element.id, { points })}
            activeTool={activeTool}
            snapToGrid={snapToGrid}
            gridSize={gridSize}
            draggable={canDrag}
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
            onDragStart={onDragStart}
            onDragEnd={(x, y, rotation) => {
              const snapped = snapToGridPos({ x, y });
              // Check if this element is part of a multi-selection
              if (isSelected && selectedElementIds.length > 1 && dragStartPos.current?.elementId === element.id) {
                const delta = {
                  x: snapped.x - dragStartPos.current.x,
                  y: snapped.y - dragStartPos.current.y,
                };
                moveElements(selectedElementIds, delta);
              } else {
                const updates: Partial<typeof element> = { x: snapped.x, y: snapped.y };
                if (rotation !== undefined) {
                  updates.rotation = rotation;
                }
                updateElement(element.id, updates);
              }
              dragStartPos.current = null;
            }}
            walls={doorWalls}
            snapThreshold={30}
            draggable={canDrag}
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
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            draggable={canDrag}
          />
        );
      case 'hiding-spot':
        return (
          <HidingSpotRenderer
            key={element.id}
            element={element}
            isSelected={isSelected}
            onSelect={onSelect}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            draggable={canDrag}
          />
        );
      case 'patrol-route':
        return (
          <PatrolRouteRenderer
            key={element.id}
            element={element as PatrolRouteElement}
            isSelected={isSelected}
            onSelect={onSelect}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            draggable={canDrag}
          />
        );
      case 'vent':
        return (
          <VentRenderer
            key={element.id}
            element={element as VentElement}
            isSelected={isSelected}
            onSelect={onSelect}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            draggable={canDrag}
          />
        );
      case 'passageway':
        return (
          <PassagewayRenderer
            key={element.id}
            element={element as PassagewayElement}
            isSelected={isSelected}
            onSelect={onSelect}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            draggable={canDrag}
          />
        );
      case 'decoration':
        return (
          <DecorationRenderer
            key={element.id}
            element={element}
            isSelected={isSelected}
            onSelect={onSelect}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            draggable={canDrag}
          />
        );
      case 'character':
        return (
          <CharacterRenderer
            key={element.id}
            element={element as CharacterElement}
            isSelected={isSelected}
            onSelect={onSelect}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            draggable={canDrag}
          />
        );
      case 'jumpscare':
        return (
          <JumpscareRenderer
            key={element.id}
            element={element as JumpscareElement}
            isSelected={isSelected}
            onSelect={onSelect}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            draggable={canDrag}
          />
        );
      case 'item':
        return (
          <ItemRenderer
            key={element.id}
            element={element as ItemElement}
            isSelected={isSelected}
            onSelect={onSelect}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            draggable={canDrag}
          />
        );
      case 'annotation':
        return (
          <AnnotationRenderer
            key={element.id}
            element={element as AnnotationElement}
            isSelected={isSelected}
            onSelect={onSelect}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            draggable={canDrag}
          />
        );
      case 'spawn':
        return (
          <SpawnRenderer
            key={element.id}
            element={element as SpawnElement}
            isSelected={isSelected}
            onSelect={onSelect}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            draggable={canDrag}
          />
        );
      case 'objective':
        return (
          <ObjectiveRenderer
            key={element.id}
            element={element as ObjectiveElement}
            isSelected={isSelected}
            onSelect={onSelect}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            draggable={canDrag}
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
      style={{ cursor: isPanning ? 'grabbing' : activeTool === 'pan' ? 'grab' : 'crosshair' }}
      onContextMenu={handleContextMenu}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <Stage
        ref={stageRef}
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
          {sortedElements.map(renderElement)}

          {/* Rotation handles for selected elements */}
          {activeTool === 'select' && selectedElementIds.map(id => {
            const element = level?.elements.find(e => e.id === id);
            if (!element) return null;
            return (
              <SelectionOverlay
                key={`rotation-${id}`}
                element={element}
                zoom={zoom}
                onRotate={(rotation) => updateElement(id, { rotation })}
              />
            );
          })}

          {/* Polygon/patrol/vent/passageway drawing preview */}
          {(activeTool === 'room' || activeTool === 'patrol-route' || activeTool === 'vent' || activeTool === 'passageway') && drawingPoints.length > 0 && (
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

          {/* Box selection rectangle */}
          {isBoxSelecting && boxSelectStart && boxSelectEnd && (
            <Rect
              x={Math.min(boxSelectStart.x, boxSelectEnd.x)}
              y={Math.min(boxSelectStart.y, boxSelectEnd.y)}
              width={Math.abs(boxSelectEnd.x - boxSelectStart.x)}
              height={Math.abs(boxSelectEnd.y - boxSelectStart.y)}
              fill="rgba(59, 130, 246, 0.15)"
              stroke="#3b82f6"
              strokeWidth={1 / zoom}
              dash={[6 / zoom, 3 / zoom]}
            />
          )}
        </Layer>
      </Stage>

      {/* Drawing instructions */}
      {(activeTool === 'room' || activeTool === 'patrol-route' || activeTool === 'vent' || activeTool === 'passageway') && (
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
