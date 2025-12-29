import { Plus, Trash2, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useEditorStore } from '../../store/editorStore';

export function LevelSelector() {
  const {
    levels,
    currentLevelId,
    setCurrentLevel,
    addLevel,
    deleteLevel,
    renameLevel,
  } = useEditorStore();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newLevelName, setNewLevelName] = useState('');
  const [copyFromId, setCopyFromId] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLevel = levels.find(l => l.id === currentLevelId);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddLevel = () => {
    if (newLevelName.trim()) {
      addLevel(newLevelName.trim(), copyFromId || undefined);
      setNewLevelName('');
      setCopyFromId('');
      setIsAddModalOpen(false);
    }
  };

  const handleStartRename = (id: string, name: string) => {
    setEditingId(id);
    setEditingName(name);
  };

  const handleFinishRename = () => {
    if (editingId && editingName.trim()) {
      renameLevel(editingId, editingName.trim());
    }
    setEditingId(null);
    setEditingName('');
  };

  return (
    <div className="flex items-center gap-2">
      {/* Level dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-sm text-white"
        >
          <span>{currentLevel?.name || 'Select Level'}</span>
          <ChevronDown size={16} />
        </button>

        {isDropdownOpen && (
          <div className="absolute bottom-full mb-1 left-0 w-48 bg-gray-700 rounded shadow-lg overflow-hidden z-50">
            {levels.map(level => (
              <div
                key={level.id}
                className={`flex items-center justify-between px-3 py-2 text-sm cursor-pointer
                  ${level.id === currentLevelId ? 'bg-blue-600 text-white' : 'text-gray-200 hover:bg-gray-600'}`}
              >
                {editingId === level.id ? (
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onBlur={handleFinishRename}
                    onKeyDown={(e) => e.key === 'Enter' && handleFinishRename()}
                    className="bg-gray-800 px-1 rounded text-white flex-1 mr-2"
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <span
                    onClick={() => {
                      setCurrentLevel(level.id);
                      setIsDropdownOpen(false);
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      handleStartRename(level.id, level.name);
                    }}
                    className="flex-1"
                  >
                    {level.name}
                  </span>
                )}
                {levels.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteLevel(level.id);
                    }}
                    className="p-1 hover:bg-red-600 rounded"
                    title="Delete level"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add level button */}
      <button
        onClick={() => setIsAddModalOpen(true)}
        className="p-1.5 bg-gray-700 hover:bg-gray-600 rounded text-white"
        title="Add level"
      >
        <Plus size={18} />
      </button>

      {/* Add level modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-4 w-80">
            <h3 className="text-white font-semibold mb-4">Add New Level</h3>
            <input
              type="text"
              value={newLevelName}
              onChange={(e) => setNewLevelName(e.target.value)}
              placeholder="Level name"
              className="w-full px-3 py-2 bg-gray-700 rounded text-white mb-3"
              autoFocus
            />
            <div className="mb-4">
              <label className="text-gray-400 text-sm mb-1 block">Copy from (optional)</label>
              <select
                value={copyFromId}
                onChange={(e) => setCopyFromId(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 rounded text-white"
              >
                <option value="">Empty level</option>
                {levels.map(level => (
                  <option key={level.id} value={level.id}>
                    {level.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-3 py-1.5 text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleAddLevel}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded"
              >
                Add Level
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
