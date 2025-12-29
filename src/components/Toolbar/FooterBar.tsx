import { Grid3X3, Magnet } from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';
import { LevelSelector } from './LevelSelector';
import { LayersDropdown } from './LayersDropdown';

export function FooterBar() {
  const { gridSize, setGridSize, snapToGrid, setSnapToGrid, getCurrentLevel } = useEditorStore();
  const level = getCurrentLevel();
  const elementCount = level?.elements.length ?? 0;

  return (
    <footer className="h-10 bg-gray-800 border-t border-gray-700 flex items-center px-4 gap-4">
      <LevelSelector />

      <div className="border-l border-gray-600 h-6 mx-1" />

      <LayersDropdown />

      <div className="flex-1" />

      <div className="flex items-center gap-4 text-sm text-gray-400">
        {/* Element count */}
        <span>{elementCount} element{elementCount !== 1 ? 's' : ''}</span>

        {/* Grid size */}
        <div className="flex items-center gap-2">
          <Grid3X3 size={16} />
          <select
            value={gridSize}
            onChange={(e) => setGridSize(Number(e.target.value))}
            className="bg-gray-700 text-gray-200 px-2 py-0.5 rounded text-sm"
          >
            <option value={10}>10px</option>
            <option value={20}>20px</option>
            <option value={40}>40px</option>
            <option value={50}>50px</option>
          </select>
        </div>

        {/* Snap to grid toggle */}
        <button
          onClick={() => setSnapToGrid(!snapToGrid)}
          className={`flex items-center gap-1 px-2 py-0.5 rounded ${
            snapToGrid ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
          }`}
          title="Toggle snap to grid"
        >
          <Magnet size={16} />
          <span>Snap</span>
        </button>
      </div>
    </footer>
  );
}
