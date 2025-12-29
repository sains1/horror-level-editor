import {
  RectangleHorizontal,
  Hexagon,
  DoorOpen,
  Lock,
  ArrowUpFromLine,
  Eye,
  Route,
  TreeDeciduous,
  MousePointer2,
  Hand,
} from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';
import type { Tool } from '../../types/editor';

interface ToolButtonProps {
  tool: Tool;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
}

function ToolButton({ tool, label, icon: Icon }: ToolButtonProps) {
  const { activeTool, setActiveTool } = useEditorStore();
  const isActive = activeTool === tool;

  return (
    <button
      onClick={() => setActiveTool(tool)}
      className={`
        flex items-center gap-2 w-full px-3 py-2 rounded text-sm
        transition-colors duration-150
        ${isActive
          ? 'bg-blue-600 text-white'
          : 'text-gray-300 hover:bg-gray-700 hover:text-white'}
      `}
      title={label}
    >
      <Icon size={18} />
      <span>{label}</span>
    </button>
  );
}

export function ElementPalette() {
  const { activeTool, setActiveTool } = useEditorStore();

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-gray-700">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
          Tools
        </h2>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => setActiveTool('select')}
            className={`
              flex items-center gap-2 w-full px-3 py-2 rounded text-sm
              transition-colors duration-150
              ${activeTool === 'select'
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'}
            `}
          >
            <MousePointer2 size={18} />
            <span>Select</span>
          </button>
          <button
            onClick={() => setActiveTool('pan')}
            className={`
              flex items-center gap-2 w-full px-3 py-2 rounded text-sm
              transition-colors duration-150
              ${activeTool === 'pan'
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'}
            `}
          >
            <Hand size={18} />
            <span>Pan</span>
          </button>
        </div>
      </div>

      <div className="p-3 border-b border-gray-700">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
          Rooms
        </h2>
        <div className="flex flex-col gap-1">
          <ToolButton tool="rectangle" label="Rectangle" icon={RectangleHorizontal} />
          <ToolButton tool="room" label="Polygon" icon={Hexagon} />
        </div>
      </div>

      <div className="p-3 border-b border-gray-700">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
          Elements
        </h2>
        <div className="flex flex-col gap-1">
          <ToolButton tool="door" label="Door" icon={DoorOpen} />
          <ToolButton tool="locked-door" label="Locked Door" icon={Lock} />
          <ToolButton tool="stairs" label="Stairs" icon={ArrowUpFromLine} />
          <ToolButton tool="hiding-spot" label="Hiding Spot" icon={Eye} />
          <ToolButton tool="patrol-route" label="Patrol Route" icon={Route} />
        </div>
      </div>

      <div className="p-3 border-b border-gray-700">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
          Decorations
        </h2>
        <div className="flex flex-col gap-1">
          <ToolButton tool="decoration" label="Tree" icon={TreeDeciduous} />
        </div>
      </div>

      <div className="p-3 flex-1 overflow-auto">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
          Quick Add
        </h2>
        <p className="text-xs text-gray-500">
          Select a tool above, then click on the canvas to place elements.
        </p>
      </div>
    </div>
  );
}
