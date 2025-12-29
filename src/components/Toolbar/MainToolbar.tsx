import { Undo2, Redo2, ZoomIn, ZoomOut, Save, Download, Upload, HelpCircle } from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';
import { useRef } from 'react';

export function MainToolbar() {
  const { zoom, setZoom, undo, redo, saveToLocalStorage, exportToJSON, importFromJSON } = useEditorStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

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
