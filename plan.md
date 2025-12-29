# Level Editor Framework - Implementation Plan

## Overview

A lightweight, web-based level design editor for creating floor plans with rooms, doors, patrol routes, and decorations. Built with Vite + React for fast development and easy deployment.

## Visual Style Reference

Based on architectural floor plan style:
- Clean top-down 2D view
- Black wall outlines (stroke-based)
- Room labels centered in rooms
- Trees/vegetation as green circles
- Different floor colors per room type
- Stairs shown as parallel lines
- Doors as gaps in walls with swing indicators

---

## Tech Stack

| Category | Choice | Rationale |
|----------|--------|-----------|
| Build Tool | Vite | Fast HMR, simple config, optimized builds |
| UI Framework | React 19 | Component-based, large ecosystem |
| Canvas/Rendering | Konva.js + react-konva | High-performance 2D canvas, built-in drag/drop, zoom/pan |
| State Management | Zustand | Lightweight, simple API, good for undo/redo |
| Styling | Tailwind CSS v4 | Rapid UI development, small bundle |
| Icons | Lucide React | Lightweight, tree-shakeable |

---

## Architecture (Actual)

```
src/
├── components/
│   ├── Canvas/
│   │   ├── EditorCanvas.tsx        # Main Konva stage with all interactions
│   │   ├── GridLayer.tsx           # Background grid
│   │   ├── RoomRenderer.tsx        # Room polygon rendering
│   │   ├── DoorRenderer.tsx        # Door + locked door rendering
│   │   ├── StairsRenderer.tsx      # Stairs with direction
│   │   ├── HidingSpotRenderer.tsx  # Hiding spot circles
│   │   ├── PatrolRouteRenderer.tsx # Patrol paths with arrows
│   │   ├── DecorationRenderer.tsx  # Trees, furniture, etc.
│   │   ├── DrawingPreview.tsx      # Live preview while drawing polygons
│   │   └── RectanglePreview.tsx    # Live preview while drawing rectangles
│   ├── Sidebar/
│   │   ├── ElementPalette.tsx      # Tool selection palette
│   │   └── LayersPanel.tsx         # (Moved to footer dropdown)
│   └── Toolbar/
│       ├── MainToolbar.tsx         # Top toolbar (undo/redo, zoom, save/export)
│       ├── FooterBar.tsx           # Bottom bar (levels, layers, grid settings)
│       ├── LevelSelector.tsx       # Level dropdown + add/delete/rename
│       └── LayersDropdown.tsx      # Visibility layer toggles
├── store/
│   └── editorStore.ts              # Zustand store (state + history + persistence)
├── types/
│   └── editor.ts                   # TypeScript interfaces
├── constants/
│   └── elements.ts                 # Element type definitions
├── App.tsx
├── main.tsx
└── index.css                       # Tailwind imports + CSS variables
```

---

## Implementation Phases

### Phase 1: Project Setup & Core Canvas ✅ COMPLETE
- [x] Initialize Vite + React + TypeScript project
- [x] Install dependencies (Konva, Zustand, Tailwind v4, Lucide)
- [x] Set up basic layout (sidebar, canvas, toolbar)
- [x] Implement Konva stage with zoom/pan
- [x] Add background grid layer
- [x] Create element store with Zustand

### Phase 2: Room Drawing ✅ COMPLETE
- [x] Implement room polygon tool (click-to-place vertices)
- [x] Room fill colors and wall stroke rendering
- [x] Room name labels (editable)
- [x] Room selection and move/resize
- [x] Snap-to-grid functionality

**Additional work done:**
- [x] Rectangle room tool (click-drag) - faster for most rooms
- [x] Live drawing preview (see path as you draw)
- [x] Backspace to undo last point while drawing
- [x] Right-click to finish drawing

### Phase 3: Door & Stair Elements ✅ COMPLETE
- [x] Door element (draggable, rotatable)
- [x] Locked door variant with color indicator
- [x] Stairs element with direction indicator
- [ ] Snap doors to wall edges (deferred)

### Phase 4: Sidebar & Drag-Drop ⚠️ PARTIAL
- [x] Element palette in left sidebar
- [ ] Drag from sidebar to canvas (using click-to-place instead)
- [ ] Properties panel for selected element
- [ ] Element preview thumbnails

**Note:** Implemented as click-to-place tools rather than drag-drop. Properties panel deferred.

### Phase 5: Patrol Routes ✅ COMPLETE
- [x] Patrol route drawing tool (polyline)
- [x] Waypoint editing (add/remove/move)
- [ ] Route color picker (using default orange)
- [ ] Loop toggle (in data model, UI deferred)
- [ ] Animated preview (optional - deferred)

### Phase 6: Decorations & Hiding Spots ✅ COMPLETE
- [x] Tree decoration (green circle style)
- [x] Bush, furniture variants (in renderer, single tool for now)
- [x] Hiding spot element with indicator
- [x] Scale/rotate decorations (in data model)

### Phase 7: Persistence & Export ✅ COMPLETE
- [x] Auto-save to localStorage (every 30s)
- [x] Export level as JSON
- [x] Import level from JSON
- [ ] Export as PNG image (optional - deferred)

### Phase 8: Multi-Level Support ✅ COMPLETE
- [x] Level tabs/list (dropdown in footer)
- [x] Add new level
- [x] Copy from existing level
- [x] Delete level
- [x] Level rename (double-click)

### Phase 9: Undo/Redo & Clipboard ⚠️ PARTIAL
- [x] History stack implementation
- [x] Undo (Ctrl+Z) / Redo (Ctrl+Y)
- [ ] Copy (Ctrl+C) / Paste (Ctrl+V) elements (deferred)
- [x] Delete selected (Delete key)

### Phase 10: Visibility Layers ✅ COMPLETE
- [x] Layer toggle panel (moved to footer dropdown)
- [x] Toggle rooms, doors, stairs, routes, decorations
- [ ] Layer opacity control (optional - deferred)

### Phase 11: Polish & UX ⚠️ PARTIAL
- [ ] Keyboard shortcuts help modal
- [x] Tooltips on tools (via title attribute)
- [ ] Dark/light theme toggle (dark only for now)
- [ ] Responsive sidebar collapse
- [ ] Loading/saving indicators

---

## Current UI Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  Level Editor    [Undo][Redo]  [Zoom:-][100%][+]  [Save][Export][Import][?] │
├────────────┬────────────────────────────────────────────────────┤
│            │                                                     │
│  TOOLS     │                                                     │
│  ─────────│                                                     │
│  [Select]  │                                                     │
│  [Pan]     │              CANVAS                                │
│            │              (Grid + Elements)                     │
│  ROOMS     │                                                     │
│  ─────────│                                                     │
│  [Rect]    │                                                     │
│  [Polygon] │                                                     │
│            │                                                     │
│  ELEMENTS  │                                                     │
│  ─────────│                                                     │
│  [Door]    │                                                     │
│  [Locked]  │                                                     │
│  [Stairs]  │                                                     │
│  [Hiding]  │                                                     │
│  [Patrol]  │                                                     │
│            │                                                     │
│  DECOR     │                                                     │
│  ─────────│                                                     │
│  [Tree]    │                                                     │
│            │                                                     │
├────────────┴────────────────────────────────────────────────────┤
│  [Floor 1 ▼][+]  |  [Layers ▼]  |  12 elements  |  Grid: 20px  [Snap] │
└─────────────────────────────────────────────────────────────────┘
```

---

## Keyboard Shortcuts (Implemented)

| Action | Shortcut |
|--------|----------|
| Undo | Ctrl+Z |
| Redo | Ctrl+Y / Ctrl+Shift+Z |
| Delete | Delete |
| Undo last point (while drawing) | Backspace |
| Finish drawing | Enter / Double-click / Right-click |
| Cancel drawing | Escape |
| Deselect | Escape |
| Zoom In/Out | Scroll wheel |
| Pan | Middle mouse drag / Pan tool |
| Save | Ctrl+S |

---

## Remaining Work (Future)

### High Priority
- [ ] Properties panel for editing selected elements (name, color, etc.)
- [ ] Vertex editing for placed rooms (click to adjust corners)
- [ ] Snap doors to wall edges
- [ ] Copy/paste elements

### Medium Priority
- [ ] More decoration types in palette (bush, table, chair, bed, car)
- [ ] Route color picker
- [ ] Loop toggle for patrol routes
- [ ] Keyboard shortcuts help modal

### Low Priority / Nice to Have
- [ ] Export as PNG image
- [ ] Light theme toggle
- [ ] Responsive sidebar collapse
- [ ] Drag from sidebar to canvas
- [ ] Element preview thumbnails
- [ ] Layer opacity control
- [ ] Animated patrol route preview

---

## Getting Started

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Success Criteria

1. **Functional**: ✅ Core features work (rooms, doors, stairs, routes, decorations)
2. **Performant**: ✅ Smooth rendering with Konva canvas
3. **Persistent**: ✅ Levels survive page refresh via localStorage
4. **Exportable**: ✅ Valid JSON export that can be re-imported
5. **Usable**: ✅ Click-to-place interface with keyboard shortcuts
6. **Deployable**: ✅ Single `npm run build` produces static files for any host
