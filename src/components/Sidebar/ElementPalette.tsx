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
  Shrub,
  Bed,
  Car,
  Ghost,
  User,
  PersonStanding,
  Shield,
  UserCircle,
  Zap,
  Key,
  CreditCard,
  FileText,
  Flashlight,
  Battery,
  HeartPulse,
} from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';
import type { Tool, DecorationVariant, CharacterVariant, ItemVariant } from '../../types/editor';
import { DECORATION_VARIANTS, CHARACTER_VARIANTS, ITEM_VARIANTS } from '../../constants/elements';

// Icon mapping for decoration variants
const DECORATION_ICONS: Record<DecorationVariant, React.ComponentType<{ size?: number }>> = {
  'tree': TreeDeciduous,
  'bush': Shrub,
  'table': RectangleHorizontal,
  'chair': RectangleHorizontal,
  'bed': Bed,
  'car': Car,
};

// Icon mapping for character variants
const CHARACTER_ICONS: Record<CharacterVariant, React.ComponentType<{ size?: number }>> = {
  'shadow-monster': Ghost,
  'player': User,
  'elderly': PersonStanding,
  'guard': Shield,
  'npc': UserCircle,
};

// Icon mapping for item variants
const ITEM_ICONS: Record<ItemVariant, React.ComponentType<{ size?: number }>> = {
  'key': Key,
  'key-card': CreditCard,
  'document': FileText,
  'flashlight': Flashlight,
  'battery': Battery,
  'medkit': HeartPulse,
};

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

interface VariantButtonProps<T extends string> {
  tool: Tool;
  variant: T;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  selectedVariant: T;
  onSelectVariant: (variant: T) => void;
}

function VariantButton<T extends string>({
  tool,
  variant,
  label,
  icon: Icon,
  selectedVariant,
  onSelectVariant
}: VariantButtonProps<T>) {
  const { activeTool, setActiveTool } = useEditorStore();
  const isActive = activeTool === tool && selectedVariant === variant;

  const handleClick = () => {
    onSelectVariant(variant);
    setActiveTool(tool);
  };

  return (
    <button
      onClick={handleClick}
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
  const {
    activeTool,
    setActiveTool,
    selectedDecorationVariant,
    selectedCharacterVariant,
    selectedItemVariant,
    setSelectedDecorationVariant,
    setSelectedCharacterVariant,
    setSelectedItemVariant,
  } = useEditorStore();

  return (
    <div className="flex flex-col h-full overflow-y-auto">
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
          <ToolButton tool="jumpscare" label="Jump Scare" icon={Zap} />
        </div>
      </div>

      <div className="p-3 border-b border-gray-700">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
          Characters
        </h2>
        <div className="flex flex-col gap-1">
          {CHARACTER_VARIANTS.map((char) => (
            <VariantButton
              key={char.variant}
              tool="character"
              variant={char.variant}
              label={char.label}
              icon={CHARACTER_ICONS[char.variant]}
              selectedVariant={selectedCharacterVariant}
              onSelectVariant={setSelectedCharacterVariant}
            />
          ))}
        </div>
      </div>

      <div className="p-3 border-b border-gray-700">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
          Items
        </h2>
        <div className="flex flex-col gap-1">
          {ITEM_VARIANTS.map((item) => (
            <VariantButton
              key={item.variant}
              tool="item"
              variant={item.variant}
              label={item.label}
              icon={ITEM_ICONS[item.variant]}
              selectedVariant={selectedItemVariant}
              onSelectVariant={setSelectedItemVariant}
            />
          ))}
        </div>
      </div>

      <div className="p-3 border-b border-gray-700">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
          Decorations
        </h2>
        <div className="flex flex-col gap-1">
          {DECORATION_VARIANTS.map((dec) => (
            <VariantButton
              key={dec.variant}
              tool="decoration"
              variant={dec.variant}
              label={dec.label}
              icon={DECORATION_ICONS[dec.variant]}
              selectedVariant={selectedDecorationVariant}
              onSelectVariant={setSelectedDecorationVariant}
            />
          ))}
        </div>
      </div>

      <div className="p-3 flex-1">
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
