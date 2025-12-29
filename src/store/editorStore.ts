import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { Element, ElementType, Level, Point, Tool } from '../types/editor';

interface EditorStore {
  // State
  levels: Level[];
  currentLevelId: string;
  selectedElementIds: string[];
  activeTool: Tool;
  zoom: number;
  panOffset: Point;
  gridSize: number;
  snapToGrid: boolean;
  visibleLayers: Record<ElementType, boolean>;

  // History for undo/redo
  history: Level[][];
  historyIndex: number;

  // Computed
  getCurrentLevel: () => Level | undefined;
  getSelectedElements: () => Element[];

  // Actions
  setActiveTool: (tool: Tool) => void;
  setZoom: (zoom: number) => void;
  setPanOffset: (offset: Point) => void;
  setGridSize: (size: number) => void;
  setSnapToGrid: (snap: boolean) => void;
  toggleLayerVisibility: (layer: ElementType) => void;

  // Element actions
  addElement: (element: Element) => void;
  updateElement: (id: string, updates: Partial<Element>) => void;
  deleteElements: (ids: string[]) => void;
  selectElements: (ids: string[]) => void;
  clearSelection: () => void;

  // Level actions
  addLevel: (name: string, copyFromId?: string) => void;
  deleteLevel: (id: string) => void;
  renameLevel: (id: string, name: string) => void;
  setCurrentLevel: (id: string) => void;

  // History actions
  undo: () => void;
  redo: () => void;
  saveToHistory: () => void;

  // Persistence
  saveToLocalStorage: () => void;
  loadFromLocalStorage: () => void;
  exportToJSON: () => string;
  importFromJSON: (json: string) => void;
}

const DEFAULT_VISIBLE_LAYERS: Record<ElementType, boolean> = {
  'room': true,
  'door': true,
  'locked-door': true,
  'stairs': true,
  'hiding-spot': true,
  'patrol-route': true,
  'decoration': true,
};

const createDefaultLevel = (): Level => ({
  id: uuidv4(),
  name: 'Floor 1',
  elements: [],
});

// Create default level once so we can reference its ID
const initialLevel = createDefaultLevel();

export const useEditorStore = create<EditorStore>((set, get) => ({
  // Initial state
  levels: [initialLevel],
  currentLevelId: initialLevel.id,
  selectedElementIds: [],
  activeTool: 'select',
  zoom: 1,
  panOffset: { x: 0, y: 0 },
  gridSize: 20,
  snapToGrid: true,
  visibleLayers: { ...DEFAULT_VISIBLE_LAYERS },
  history: [],
  historyIndex: -1,

  // Computed
  getCurrentLevel: () => {
    const { levels, currentLevelId } = get();
    return levels.find(l => l.id === currentLevelId);
  },

  getSelectedElements: () => {
    const level = get().getCurrentLevel();
    if (!level) return [];
    return level.elements.filter(e => get().selectedElementIds.includes(e.id));
  },

  // Actions
  setActiveTool: (tool) => set({ activeTool: tool, selectedElementIds: [] }),

  setZoom: (zoom) => set({ zoom: Math.max(0.1, Math.min(5, zoom)) }),

  setPanOffset: (offset) => set({ panOffset: offset }),

  setGridSize: (size) => set({ gridSize: size }),

  setSnapToGrid: (snap) => set({ snapToGrid: snap }),

  toggleLayerVisibility: (layer) => set(state => ({
    visibleLayers: {
      ...state.visibleLayers,
      [layer]: !state.visibleLayers[layer],
    },
  })),

  // Element actions
  addElement: (element) => {
    get().saveToHistory();
    set(state => ({
      levels: state.levels.map(level =>
        level.id === state.currentLevelId
          ? { ...level, elements: [...level.elements, element] }
          : level
      ),
    }));
  },

  updateElement: (id, updates) => {
    get().saveToHistory();
    set(state => ({
      levels: state.levels.map(level =>
        level.id === state.currentLevelId
          ? {
              ...level,
              elements: level.elements.map(el =>
                el.id === id ? { ...el, ...updates } as Element : el
              ),
            }
          : level
      ),
    }));
  },

  deleteElements: (ids) => {
    get().saveToHistory();
    set(state => ({
      levels: state.levels.map(level =>
        level.id === state.currentLevelId
          ? { ...level, elements: level.elements.filter(el => !ids.includes(el.id)) }
          : level
      ),
      selectedElementIds: state.selectedElementIds.filter(id => !ids.includes(id)),
    }));
  },

  selectElements: (ids) => set({ selectedElementIds: ids }),

  clearSelection: () => set({ selectedElementIds: [] }),

  // Level actions
  addLevel: (name, copyFromId) => {
    const newLevel: Level = {
      id: uuidv4(),
      name,
      elements: copyFromId
        ? get().levels.find(l => l.id === copyFromId)?.elements.map(e => ({
            ...e,
            id: uuidv4(),
          })) ?? []
        : [],
    };
    set(state => ({
      levels: [...state.levels, newLevel],
      currentLevelId: newLevel.id,
    }));
  },

  deleteLevel: (id) => {
    const { levels } = get();
    if (levels.length <= 1) return;

    const newLevels = levels.filter(l => l.id !== id);
    set(state => ({
      levels: newLevels,
      currentLevelId: state.currentLevelId === id ? newLevels[0].id : state.currentLevelId,
    }));
  },

  renameLevel: (id, name) => set(state => ({
    levels: state.levels.map(l => l.id === id ? { ...l, name } : l),
  })),

  setCurrentLevel: (id) => set({ currentLevelId: id, selectedElementIds: [] }),

  // History actions
  saveToHistory: () => {
    const { levels, history, historyIndex } = get();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(levels)));

    // Keep max 50 history states
    if (newHistory.length > 50) newHistory.shift();

    set({
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex <= 0) return;

    const newIndex = historyIndex - 1;
    set({
      levels: JSON.parse(JSON.stringify(history[newIndex])),
      historyIndex: newIndex,
    });
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex >= history.length - 1) return;

    const newIndex = historyIndex + 1;
    set({
      levels: JSON.parse(JSON.stringify(history[newIndex])),
      historyIndex: newIndex,
    });
  },

  // Persistence
  saveToLocalStorage: () => {
    const { levels, gridSize } = get();
    const data = {
      version: '1.0',
      name: 'Level Editor Project',
      levels,
      metadata: {
        gridSize,
        updatedAt: new Date().toISOString(),
      },
    };
    localStorage.setItem('level-editor-data', JSON.stringify(data));
  },

  loadFromLocalStorage: () => {
    const saved = localStorage.getItem('level-editor-data');
    if (!saved) return;

    try {
      const data = JSON.parse(saved);
      set({
        levels: data.levels,
        currentLevelId: data.levels[0]?.id ?? '',
        gridSize: data.metadata?.gridSize ?? 20,
      });
    } catch (e) {
      console.error('Failed to load from localStorage:', e);
    }
  },

  exportToJSON: () => {
    const { levels, gridSize } = get();
    return JSON.stringify({
      version: '1.0',
      name: 'Level Editor Project',
      levels,
      metadata: {
        gridSize,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    }, null, 2);
  },

  importFromJSON: (json) => {
    try {
      const data = JSON.parse(json);
      set({
        levels: data.levels,
        currentLevelId: data.levels[0]?.id ?? '',
        gridSize: data.metadata?.gridSize ?? 20,
        selectedElementIds: [],
      });
    } catch (e) {
      console.error('Failed to import JSON:', e);
      throw new Error('Invalid JSON format');
    }
  },
}));
