# Level Editor

A web-based floor plan editor for designing game levels. Create rooms, doors, patrol routes, and decorations with a visual canvas interface.

## Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Canvas**: Konva.js / react-konva (2D rendering)
- **State**: Zustand (includes undo/redo history)
- **Styling**: Tailwind CSS v4 (via @tailwindcss/vite plugin)
- **Icons**: Lucide React

## Project Structure

```
src/
├── components/
│   ├── Canvas/          # Konva renderers (EditorCanvas, *Renderer, *Preview)
│   ├── Sidebar/         # ElementPalette (tool selection)
│   └── Toolbar/         # MainToolbar, FooterBar, LevelSelector, LayersDropdown
├── store/
│   └── editorStore.ts   # Zustand store - ALL state lives here
├── types/
│   └── editor.ts        # TypeScript interfaces (Element, Tool, Level, etc.)
├── constants/
│   └── elements.ts      # Element definitions and color presets
├── App.tsx              # Main layout composition
└── index.css            # Tailwind imports
```

## Key Patterns

**State**: All editor state in `editorStore.ts` - levels, elements, selection, tools, history, persistence. Use `useEditorStore()` hook.

**Elements**: Rooms, doors, stairs, hiding spots, patrol routes, decorations. Each has a `*Renderer.tsx` component in Canvas folder.

**Tools**: `select | pan | rectangle | room | door | locked-door | stairs | hiding-spot | patrol-route | decoration`

**Drawing flow**: Tool selected → click/drag on canvas → `addElement()` called → renderer displays it

## Commands

```bash
npm run dev      # Start dev server (localhost:5173)
npm run build    # Production build to dist/
npm run preview  # Preview production build
```

## Data Model

```typescript
interface Element {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  rotation: number;
  // + type-specific props (points, width, color, etc.)
}

interface Level {
  id: string;
  name: string;
  elements: Element[];
}
```

## Notes

- Canvas interactions handled in `EditorCanvas.tsx` (mouse events, keyboard shortcuts)
- Persistence: auto-saves to localStorage, export/import JSON
- Grid snapping enabled by default (configurable in footer)
