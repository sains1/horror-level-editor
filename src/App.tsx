import { useEffect } from 'react';
import { MainToolbar } from './components/Toolbar/MainToolbar';
import { FooterBar } from './components/Toolbar/FooterBar';
import { ElementPalette } from './components/Sidebar/ElementPalette';
import { PropertiesPanel } from './components/Sidebar/PropertiesPanel';
import { EditorCanvas } from './components/Canvas/EditorCanvas';
import { useEditorStore } from './store/editorStore';

function App() {
  const { loadFromLocalStorage, saveToLocalStorage, undo, redo, copyElements, pasteElements } = useEditorStore();

  // Load saved data on mount
  useEffect(() => {
    loadFromLocalStorage();
  }, [loadFromLocalStorage]);

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      saveToLocalStorage();
    }, 30000);
    return () => clearInterval(interval);
  }, [saveToLocalStorage]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Z for undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      // Ctrl/Cmd + Y or Ctrl/Cmd + Shift + Z for redo
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        redo();
      }
      // Ctrl/Cmd + S for save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveToLocalStorage();
      }
      // Ctrl/Cmd + C for copy
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        e.preventDefault();
        copyElements();
      }
      // Ctrl/Cmd + V for paste
      if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        e.preventDefault();
        pasteElements();
      }
      // Ctrl/Cmd + D for duplicate
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        copyElements();
        pasteElements();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, saveToLocalStorage, copyElements, pasteElements]);

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-900">
      {/* Top toolbar */}
      <MainToolbar />

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left sidebar */}
        <aside className="w-56 bg-gray-800 border-r border-gray-700 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <ElementPalette />
          </div>
        </aside>

        {/* Canvas area */}
        <EditorCanvas />

        {/* Right sidebar - Properties */}
        <aside className="w-64 bg-gray-800 border-l border-gray-700 flex flex-col overflow-hidden">
          <PropertiesPanel />
        </aside>
      </div>

      {/* Footer */}
      <FooterBar />
    </div>
  );
}

export default App;
