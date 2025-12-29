import { Eye, EyeOff } from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';
import type { ElementType } from '../../types/editor';

const LAYER_LABELS: Record<ElementType, string> = {
  'room': 'Rooms',
  'door': 'Doors',
  'locked-door': 'Locked Doors',
  'stairs': 'Stairs',
  'hiding-spot': 'Hiding Spots',
  'patrol-route': 'Patrol Routes',
  'decoration': 'Decorations',
  'character': 'Characters',
  'jumpscare': 'Jump Scares',
  'item': 'Items',
};

export function LayersPanel() {
  const { visibleLayers, toggleLayerVisibility } = useEditorStore();

  return (
    <div className="p-3">
      <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
        Layers
      </h2>
      <div className="flex flex-col gap-1">
        {(Object.keys(LAYER_LABELS) as ElementType[]).map((layer) => (
          <button
            key={layer}
            onClick={() => toggleLayerVisibility(layer)}
            className={`
              flex items-center gap-2 w-full px-3 py-2 rounded text-sm
              transition-colors duration-150
              ${visibleLayers[layer]
                ? 'text-gray-300 hover:bg-gray-700'
                : 'text-gray-500 hover:bg-gray-700'}
            `}
          >
            {visibleLayers[layer] ? <Eye size={16} /> : <EyeOff size={16} />}
            <span>{LAYER_LABELS[layer]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
