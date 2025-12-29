import { useState, useRef, useEffect } from 'react';
import { Layers, Eye, EyeOff } from 'lucide-react';
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

export function LayersDropdown() {
  const { visibleLayers, toggleLayerVisibility } = useEditorStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const visibleCount = Object.values(visibleLayers).filter(Boolean).length;
  const totalCount = Object.keys(visibleLayers).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-2 py-1 rounded text-sm transition-colors
          ${isOpen ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
        title="Toggle layer visibility"
      >
        <Layers size={16} />
        <span>Layers</span>
        <span className="text-xs text-gray-500">({visibleCount}/{totalCount})</span>
      </button>

      {isOpen && (
        <div className="absolute bottom-full mb-1 left-0 w-48 bg-gray-700 rounded shadow-lg overflow-hidden z-50">
          <div className="p-2 border-b border-gray-600">
            <span className="text-xs font-semibold text-gray-400 uppercase">Visibility</span>
          </div>
          {(Object.keys(LAYER_LABELS) as ElementType[]).map((layer) => (
            <button
              key={layer}
              onClick={() => toggleLayerVisibility(layer)}
              className={`flex items-center gap-2 w-full px-3 py-2 text-sm transition-colors
                ${visibleLayers[layer]
                  ? 'text-gray-200 hover:bg-gray-600'
                  : 'text-gray-500 hover:bg-gray-600'}`}
            >
              {visibleLayers[layer] ? <Eye size={14} /> : <EyeOff size={14} />}
              <span>{LAYER_LABELS[layer]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
