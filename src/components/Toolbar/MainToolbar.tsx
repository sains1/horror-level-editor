import { Undo2, Redo2, ZoomIn, ZoomOut, Save, Download, Upload, HelpCircle, Camera, ChevronDown } from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';
import { useRef, useState, useEffect } from 'react';
import { exportCanvasAsPng } from '../../utils/exportUtils';

export function MainToolbar() {
  const { zoom, setZoom, undo, redo, saveToLocalStorage, exportToJSON, importFromJSON, stageRef, getCurrentLevel } = useEditorStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPngOptions, setShowPngOptions] = useState(false);
  const [includeGrid, setIncludeGrid] = useState(false);
  const pngDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pngDropdownRef.current && !pngDropdownRef.current.contains(event.target as Node)) {
        setShowPngOptions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExportPng = (fullLevel: boolean) => {
    if (!stageRef) {
      alert('Canvas not ready. Please try again.');
      return;
    }
    const level = getCurrentLevel();
    const levelName = level?.name?.replace(/\s+/g, '-').toLowerCase() || 'level';
    exportCanvasAsPng(stageRef, level?.elements || [], {
      fullLevel,
      includeGrid,
      filename: `${levelName}-${Date.now()}.png`,
    });
    setShowPngOptions(false);
  };

  const handleExport = () => {
    const json = exportToJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'level-design.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        importFromJSON(event.target?.result as string);
      } catch (err) {
        alert('Failed to import: Invalid JSON format');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <header className="h-12 bg-gray-800 border-b border-gray-700 flex items-center px-4 gap-2">
      <h1 className="text-white font-semibold text-lg mr-4">Level Editor</h1>

      <div className="flex items-center gap-1 border-r border-gray-600 pr-2 mr-2">
        <button
          onClick={undo}
          className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded"
          title="Undo (Ctrl+Z)"
        >
          <Undo2 size={18} />
        </button>
        <button
          onClick={redo}
          className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded"
          title="Redo (Ctrl+Y)"
        >
          <Redo2 size={18} />
        </button>
      </div>

      <div className="flex items-center gap-1 border-r border-gray-600 pr-2 mr-2">
        <button
          onClick={() => setZoom(zoom - 0.1)}
          className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded"
          title="Zoom Out"
        >
          <ZoomOut size={18} />
        </button>
        <span className="text-gray-300 text-sm min-w-[50px] text-center">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => setZoom(zoom + 0.1)}
          className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded"
          title="Zoom In"
        >
          <ZoomIn size={18} />
        </button>
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-1">
        <button
          onClick={saveToLocalStorage}
          className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded flex items-center gap-1"
          title="Save to Browser (Ctrl+S)"
        >
          <Save size={18} />
          <span className="text-sm hidden sm:inline">Save</span>
        </button>
        <button
          onClick={handleExport}
          className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded flex items-center gap-1"
          title="Export as JSON"
        >
          <Download size={18} />
          <span className="text-sm hidden sm:inline">Export</span>
        </button>

        {/* Export PNG dropdown */}
        <div className="relative" ref={pngDropdownRef}>
          <button
            onClick={() => setShowPngOptions(!showPngOptions)}
            className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded flex items-center gap-1"
            title="Export as PNG"
          >
            <Camera size={18} />
            <span className="text-sm hidden sm:inline">PNG</span>
            <ChevronDown size={14} />
          </button>

          {showPngOptions && (
            <div className="absolute right-0 top-full mt-1 w-56 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-50">
              <div className="p-2">
                <div className="text-gray-400 text-xs uppercase tracking-wide mb-2 px-2">Export PNG</div>

                {/* Include grid toggle */}
                <label className="flex items-center gap-2 px-2 py-1.5 text-gray-300 hover:bg-gray-700 rounded cursor-pointer mb-2">
                  <input
                    type="checkbox"
                    checked={includeGrid}
                    onChange={(e) => setIncludeGrid(e.target.checked)}
                    className="rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-800"
                  />
                  <span className="text-sm">Include grid</span>
                </label>

                <div className="border-t border-gray-600 my-1" />

                <button
                  onClick={() => handleExportPng(false)}
                  className="w-full px-2 py-1.5 text-left text-gray-300 hover:bg-gray-700 rounded text-sm"
                >
                  Export current view
                </button>
                <button
                  onClick={() => handleExportPng(true)}
                  className="w-full px-2 py-1.5 text-left text-gray-300 hover:bg-gray-700 rounded text-sm"
                >
                  Export full level
                </button>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded flex items-center gap-1"
          title="Import from JSON"
        >
          <Upload size={18} />
          <span className="text-sm hidden sm:inline">Import</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
        />
        <button
          className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded"
          title="Help"
        >
          <HelpCircle size={18} />
        </button>
      </div>
    </header>
  );
}
