import { useEditorStore } from '../../store/editorStore';
import { ROOM_COLORS, LOCK_COLORS, DECORATION_VARIANTS, CHARACTER_VARIANTS, ITEM_VARIANTS, ITEM_COLORS, ANNOTATION_COLORS, SPAWN_VARIANTS, OBJECTIVE_TYPES } from '../../constants/elements';
import type {
  Element,
  RoomElement,
  DoorElement,
  LockedDoorElement,
  StairsElement,
  HidingSpotElement,
  PatrolRouteElement,
  DecorationElement,
  CharacterElement,
  JumpscareElement,
  ItemElement,
  AnnotationElement,
  SpawnElement,
  ObjectiveElement
} from '../../types/editor';
import {
  Square,
  DoorOpen,
  Lock,
  ArrowUpFromLine,
  Eye,
  Route,
  TreeDeciduous,
  Ghost,
  Zap,
  Key,
  StickyNote,
  Play,
  Flag,
} from 'lucide-react';

// Icon mapping for element types
const TYPE_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  'room': Square,
  'door': DoorOpen,
  'locked-door': Lock,
  'stairs': ArrowUpFromLine,
  'hiding-spot': Eye,
  'patrol-route': Route,
  'decoration': TreeDeciduous,
  'character': Ghost,
  'jumpscare': Zap,
  'item': Key,
  'annotation': StickyNote,
  'spawn': Play,
  'objective': Flag,
};

const TYPE_LABELS: Record<string, string> = {
  'room': 'Room',
  'door': 'Door',
  'locked-door': 'Locked Door',
  'stairs': 'Stairs',
  'hiding-spot': 'Hiding Spot',
  'patrol-route': 'Patrol Route',
  'decoration': 'Decoration',
  'character': 'Character',
  'jumpscare': 'Jump Scare',
  'item': 'Item',
  'annotation': 'Annotation',
  'spawn': 'Spawn Point',
  'objective': 'Objective',
};

interface NumberFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

function NumberField({ label, value, onChange, min, max, step = 1 }: NumberFieldProps) {
  return (
    <div className="mb-3">
      <label className="text-xs font-medium text-gray-400 block mb-1">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
        className="w-full bg-gray-700 text-gray-200 px-2 py-1.5 rounded text-sm border border-gray-600 focus:border-blue-500 focus:outline-none"
      />
    </div>
  );
}

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

function TextField({ label, value, onChange }: TextFieldProps) {
  return (
    <div className="mb-3">
      <label className="text-xs font-medium text-gray-400 block mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-gray-700 text-gray-200 px-2 py-1.5 rounded text-sm border border-gray-600 focus:border-blue-500 focus:outline-none"
      />
    </div>
  );
}

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

function SelectField({ label, value, onChange, options }: SelectFieldProps) {
  return (
    <div className="mb-3">
      <label className="text-xs font-medium text-gray-400 block mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-gray-700 text-gray-200 px-2 py-1.5 rounded text-sm border border-gray-600 focus:border-blue-500 focus:outline-none"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  colors: { name: string; value: string }[];
}

function ColorPicker({ label, value, onChange, colors }: ColorPickerProps) {
  return (
    <div className="mb-3">
      <label className="text-xs font-medium text-gray-400 block mb-1">{label}</label>
      <div className="flex flex-wrap gap-1">
        {colors.map((color) => (
          <button
            key={color.value}
            onClick={() => onChange(color.value)}
            className={`w-6 h-6 rounded border-2 transition-all ${
              value === color.value
                ? 'border-blue-500 scale-110'
                : 'border-gray-600 hover:border-gray-500'
            }`}
            style={{ backgroundColor: color.value }}
            title={color.name}
          />
        ))}
      </div>
    </div>
  );
}

interface CheckboxFieldProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function CheckboxField({ label, checked, onChange }: CheckboxFieldProps) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 rounded bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-800"
      />
      <label className="text-sm text-gray-300">{label}</label>
    </div>
  );
}

interface SliderFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

function SliderField({ label, value, onChange, min = 0, max = 100, step = 1 }: SliderFieldProps) {
  return (
    <div className="mb-3">
      <label className="text-xs font-medium text-gray-400 block mb-1">
        {label}: {value}%
      </label>
      <input
        type="range"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
      />
    </div>
  );
}

// Property editors for each element type
function RoomProperties({ element, onUpdate }: { element: RoomElement; onUpdate: (updates: Partial<RoomElement>) => void }) {
  return (
    <>
      <TextField
        label="Name"
        value={element.name || 'Room'}
        onChange={(name) => onUpdate({ name })}
      />
      <ColorPicker
        label="Fill Color"
        value={element.fillColor || '#f5e6d3'}
        onChange={(fillColor) => onUpdate({ fillColor })}
        colors={ROOM_COLORS}
      />
      <SliderField
        label="Light Level"
        value={element.lightLevel ?? 100}
        onChange={(lightLevel) => onUpdate({ lightLevel })}
        min={0}
        max={100}
        step={5}
      />
      <NumberField
        label="Rotation"
        value={element.rotation || 0}
        onChange={(rotation) => onUpdate({ rotation })}
        step={15}
      />
    </>
  );
}

function DoorProperties({ element, onUpdate }: { element: DoorElement; onUpdate: (updates: Partial<DoorElement>) => void }) {
  return (
    <>
      <NumberField
        label="Width"
        value={element.width || 40}
        onChange={(width) => onUpdate({ width })}
        min={20}
        max={200}
      />
      <NumberField
        label="Rotation"
        value={element.rotation || 0}
        onChange={(rotation) => onUpdate({ rotation })}
        step={15}
      />
    </>
  );
}

function LockedDoorProperties({ element, onUpdate }: { element: LockedDoorElement; onUpdate: (updates: Partial<LockedDoorElement>) => void }) {
  return (
    <>
      <NumberField
        label="Width"
        value={element.width || 40}
        onChange={(width) => onUpdate({ width })}
        min={20}
        max={200}
      />
      <ColorPicker
        label="Lock Color"
        value={element.lockColor || '#ff4444'}
        onChange={(lockColor) => onUpdate({ lockColor })}
        colors={LOCK_COLORS}
      />
      <NumberField
        label="Rotation"
        value={element.rotation || 0}
        onChange={(rotation) => onUpdate({ rotation })}
        step={15}
      />
    </>
  );
}

function StairsProperties({ element, onUpdate }: { element: StairsElement; onUpdate: (updates: Partial<StairsElement>) => void }) {
  return (
    <>
      <NumberField
        label="Width"
        value={element.width || 60}
        onChange={(width) => onUpdate({ width })}
        min={40}
        max={200}
      />
      <NumberField
        label="Height"
        value={element.height || 100}
        onChange={(height) => onUpdate({ height })}
        min={60}
        max={300}
      />
      <SelectField
        label="Direction"
        value={element.direction || 'up'}
        onChange={(direction) => onUpdate({ direction: direction as 'up' | 'down' })}
        options={[
          { value: 'up', label: 'Up' },
          { value: 'down', label: 'Down' },
        ]}
      />
      <NumberField
        label="Rotation"
        value={element.rotation || 0}
        onChange={(rotation) => onUpdate({ rotation })}
        step={15}
      />
    </>
  );
}

function HidingSpotProperties({ element, onUpdate }: { element: HidingSpotElement; onUpdate: (updates: Partial<HidingSpotElement>) => void }) {
  return (
    <>
      <NumberField
        label="Radius"
        value={element.radius || 20}
        onChange={(radius) => onUpdate({ radius })}
        min={10}
        max={100}
      />
      <NumberField
        label="Rotation"
        value={element.rotation || 0}
        onChange={(rotation) => onUpdate({ rotation })}
        step={15}
      />
    </>
  );
}

function PatrolRouteProperties({ element, onUpdate }: { element: PatrolRouteElement; onUpdate: (updates: Partial<PatrolRouteElement>) => void }) {
  return (
    <>
      <ColorPicker
        label="Route Color"
        value={element.color || '#ff6600'}
        onChange={(color) => onUpdate({ color })}
        colors={[
          { name: 'Orange', value: '#ff6600' },
          { name: 'Red', value: '#ff4444' },
          { name: 'Blue', value: '#4488ff' },
          { name: 'Green', value: '#44ff44' },
          { name: 'Purple', value: '#aa44ff' },
          { name: 'Yellow', value: '#ffff44' },
        ]}
      />
      <CheckboxField
        label="Loop route"
        checked={element.loop !== false}
        onChange={(loop) => onUpdate({ loop })}
      />
    </>
  );
}

function DecorationProperties({ element, onUpdate }: { element: DecorationElement; onUpdate: (updates: Partial<DecorationElement>) => void }) {
  return (
    <>
      <SelectField
        label="Type"
        value={element.variant || 'tree'}
        onChange={(variant) => onUpdate({ variant: variant as DecorationElement['variant'] })}
        options={DECORATION_VARIANTS.map((v) => ({ value: v.variant, label: v.label }))}
      />
      <NumberField
        label="Scale"
        value={element.scale || 1}
        onChange={(scale) => onUpdate({ scale })}
        min={0.5}
        max={3}
        step={0.1}
      />
      <NumberField
        label="Rotation"
        value={element.rotation || 0}
        onChange={(rotation) => onUpdate({ rotation })}
        step={15}
      />
    </>
  );
}

function CharacterProperties({ element, onUpdate }: { element: CharacterElement; onUpdate: (updates: Partial<CharacterElement>) => void }) {
  return (
    <>
      <TextField
        label="Name"
        value={element.name || ''}
        onChange={(name) => onUpdate({ name })}
      />
      <SelectField
        label="Type"
        value={element.variant || 'npc'}
        onChange={(variant) => onUpdate({ variant: variant as CharacterElement['variant'] })}
        options={CHARACTER_VARIANTS.map((v) => ({ value: v.variant, label: v.label }))}
      />
      <NumberField
        label="Scale"
        value={element.scale || 1}
        onChange={(scale) => onUpdate({ scale })}
        min={0.5}
        max={3}
        step={0.1}
      />
      <NumberField
        label="Rotation"
        value={element.rotation || 0}
        onChange={(rotation) => onUpdate({ rotation })}
        step={15}
      />
    </>
  );
}

function JumpscareProperties({ element, onUpdate }: { element: JumpscareElement; onUpdate: (updates: Partial<JumpscareElement>) => void }) {
  return (
    <>
      <TextField
        label="Name"
        value={element.name || ''}
        onChange={(name) => onUpdate({ name })}
      />
      <NumberField
        label="Trigger Radius"
        value={element.radius || 40}
        onChange={(radius) => onUpdate({ radius })}
        min={20}
        max={200}
        step={10}
      />
      <CheckboxField
        label="Trigger once only"
        checked={element.triggerOnce !== false}
        onChange={(triggerOnce) => onUpdate({ triggerOnce })}
      />
      <NumberField
        label="Rotation"
        value={element.rotation || 0}
        onChange={(rotation) => onUpdate({ rotation })}
        step={15}
      />
    </>
  );
}

function ItemProperties({ element, onUpdate }: { element: ItemElement; onUpdate: (updates: Partial<ItemElement>) => void }) {
  return (
    <>
      <TextField
        label="Name"
        value={element.name || ''}
        onChange={(name) => onUpdate({ name })}
      />
      <SelectField
        label="Type"
        value={element.variant || 'key'}
        onChange={(variant) => onUpdate({ variant: variant as ItemElement['variant'] })}
        options={ITEM_VARIANTS.map((v) => ({ value: v.variant, label: v.label }))}
      />
      <ColorPicker
        label="Color"
        value={element.color || '#FFD700'}
        onChange={(color) => onUpdate({ color })}
        colors={ITEM_COLORS}
      />
      <NumberField
        label="Scale"
        value={element.scale || 1}
        onChange={(scale) => onUpdate({ scale })}
        min={0.5}
        max={3}
        step={0.1}
      />
      <NumberField
        label="Rotation"
        value={element.rotation || 0}
        onChange={(rotation) => onUpdate({ rotation })}
        step={15}
      />
    </>
  );
}

function AnnotationProperties({ element, onUpdate }: { element: AnnotationElement; onUpdate: (updates: Partial<AnnotationElement>) => void }) {
  // Create colors array with "None" option for background
  const backgroundColors = [
    { name: 'None', value: '' },
    ...ANNOTATION_COLORS,
  ];

  return (
    <>
      <TextField
        label="Text"
        value={element.text || 'Note'}
        onChange={(text) => onUpdate({ text })}
      />
      <SelectField
        label="Font Size"
        value={element.fontSize || 'medium'}
        onChange={(fontSize) => onUpdate({ fontSize: fontSize as 'small' | 'medium' | 'large' })}
        options={[
          { value: 'small', label: 'Small (12px)' },
          { value: 'medium', label: 'Medium (16px)' },
          { value: 'large', label: 'Large (20px)' },
        ]}
      />
      <ColorPicker
        label="Text Color"
        value={element.color || '#333333'}
        onChange={(color) => onUpdate({ color })}
        colors={[
          { name: 'Black', value: '#333333' },
          { name: 'White', value: '#ffffff' },
          ...ANNOTATION_COLORS,
        ]}
      />
      <div className="mb-3">
        <label className="text-xs font-medium text-gray-400 block mb-1">Background Color</label>
        <div className="flex flex-wrap gap-1">
          {backgroundColors.map((color) => (
            <button
              key={color.value || 'none'}
              onClick={() => onUpdate({ backgroundColor: color.value || null })}
              className={`w-6 h-6 rounded border-2 transition-all ${
                (element.backgroundColor === color.value) || (!element.backgroundColor && !color.value)
                  ? 'border-blue-500 scale-110'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
              style={{
                backgroundColor: color.value || 'transparent',
                backgroundImage: !color.value ? 'linear-gradient(45deg, #666 25%, transparent 25%), linear-gradient(-45deg, #666 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #666 75%), linear-gradient(-45deg, transparent 75%, #666 75%)' : undefined,
                backgroundSize: !color.value ? '8px 8px' : undefined,
                backgroundPosition: !color.value ? '0 0, 0 4px, 4px -4px, -4px 0px' : undefined,
              }}
              title={color.name}
            />
          ))}
        </div>
      </div>
      <NumberField
        label="Rotation"
        value={element.rotation || 0}
        onChange={(rotation) => onUpdate({ rotation })}
        step={15}
      />
    </>
  );
}

function SpawnProperties({ element, onUpdate }: { element: SpawnElement; onUpdate: (updates: Partial<SpawnElement>) => void }) {
  return (
    <>
      <TextField
        label="Name"
        value={element.name || ''}
        onChange={(name) => onUpdate({ name })}
      />
      <SelectField
        label="Variant"
        value={element.variant || 'player-start'}
        onChange={(variant) => onUpdate({ variant: variant as SpawnElement['variant'] })}
        options={SPAWN_VARIANTS.map((v) => ({ value: v.variant, label: v.label }))}
      />
      <div className="mb-3">
        <label className="text-xs font-medium text-gray-400 block mb-1">
          Direction: {element.direction || 0} deg
        </label>
        <input
          type="range"
          value={element.direction || 0}
          onChange={(e) => onUpdate({ direction: Number(e.target.value) })}
          min={0}
          max={360}
          step={15}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
      </div>
      <SelectField
        label="Respawn Type"
        value={element.respawn || 'once'}
        onChange={(respawn) => onUpdate({ respawn: respawn as 'once' | 'timed' | 'triggered' })}
        options={[
          { value: 'once', label: 'Once' },
          { value: 'timed', label: 'Timed' },
          { value: 'triggered', label: 'Triggered' },
        ]}
      />
      <NumberField
        label="Rotation"
        value={element.rotation || 0}
        onChange={(rotation) => onUpdate({ rotation })}
        step={15}
      />
    </>
  );
}

function ObjectiveProperties({ element, onUpdate }: { element: ObjectiveElement; onUpdate: (updates: Partial<ObjectiveElement>) => void }) {
  return (
    <>
      <TextField
        label="Name"
        value={element.name || ''}
        onChange={(name) => onUpdate({ name })}
      />
      <div className="mb-3">
        <label className="text-xs font-medium text-gray-400 block mb-1">Description</label>
        <textarea
          value={element.description || ''}
          onChange={(e) => onUpdate({ description: e.target.value })}
          rows={2}
          className="w-full bg-gray-700 text-gray-200 px-2 py-1.5 rounded text-sm border border-gray-600 focus:border-blue-500 focus:outline-none resize-none"
        />
      </div>
      <SelectField
        label="Objective Type"
        value={element.objectiveType || 'primary'}
        onChange={(objectiveType) => onUpdate({ objectiveType: objectiveType as 'primary' | 'secondary' | 'optional' })}
        options={OBJECTIVE_TYPES.map((t) => ({ value: t.type, label: t.label }))}
      />
      <NumberField
        label="Order (Sequence)"
        value={element.order || 1}
        onChange={(order) => onUpdate({ order })}
        min={1}
        max={99}
        step={1}
      />
      <NumberField
        label="Completion Radius"
        value={element.radius || 40}
        onChange={(radius) => onUpdate({ radius })}
        min={20}
        max={200}
        step={10}
      />
      <TextField
        label="Required Item (optional)"
        value={element.requiredItem || ''}
        onChange={(requiredItem) => onUpdate({ requiredItem: requiredItem || null })}
      />
      <NumberField
        label="Rotation"
        value={element.rotation || 0}
        onChange={(rotation) => onUpdate({ rotation })}
        step={15}
      />
    </>
  );
}

function ElementProperties({ element }: { element: Element }) {
  const { updateElement } = useEditorStore();

  const handleUpdate = (updates: Partial<Element>) => {
    updateElement(element.id, updates);
  };

  switch (element.type) {
    case 'room':
      return <RoomProperties element={element as RoomElement} onUpdate={handleUpdate} />;
    case 'door':
      return <DoorProperties element={element as DoorElement} onUpdate={handleUpdate} />;
    case 'locked-door':
      return <LockedDoorProperties element={element as LockedDoorElement} onUpdate={handleUpdate} />;
    case 'stairs':
      return <StairsProperties element={element as StairsElement} onUpdate={handleUpdate} />;
    case 'hiding-spot':
      return <HidingSpotProperties element={element as HidingSpotElement} onUpdate={handleUpdate} />;
    case 'patrol-route':
      return <PatrolRouteProperties element={element as PatrolRouteElement} onUpdate={handleUpdate} />;
    case 'decoration':
      return <DecorationProperties element={element as DecorationElement} onUpdate={handleUpdate} />;
    case 'character':
      return <CharacterProperties element={element as CharacterElement} onUpdate={handleUpdate} />;
    case 'jumpscare':
      return <JumpscareProperties element={element as JumpscareElement} onUpdate={handleUpdate} />;
    case 'item':
      return <ItemProperties element={element as ItemElement} onUpdate={handleUpdate} />;
    case 'annotation':
      return <AnnotationProperties element={element as AnnotationElement} onUpdate={handleUpdate} />;
    case 'spawn':
      return <SpawnProperties element={element as SpawnElement} onUpdate={handleUpdate} />;
    case 'objective':
      return <ObjectiveProperties element={element as ObjectiveElement} onUpdate={handleUpdate} />;
    default:
      return null;
  }
}

export function PropertiesPanel() {
  const { getSelectedElements, deleteElements, selectedElementIds } = useEditorStore();
  const selectedElements = getSelectedElements();

  // No selection
  if (selectedElements.length === 0) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-3 border-b border-gray-700">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            Properties
          </h2>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <p className="text-sm text-gray-500 text-center">
            Select an element to view and edit its properties
          </p>
        </div>
      </div>
    );
  }

  // Multiple selection
  if (selectedElements.length > 1) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-3 border-b border-gray-700">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            Properties
          </h2>
        </div>
        <div className="p-3">
          <p className="text-sm text-gray-400 mb-3">
            {selectedElements.length} elements selected
          </p>
          <button
            onClick={() => deleteElements(selectedElementIds)}
            className="w-full px-3 py-2 rounded text-sm bg-red-600 text-white hover:bg-red-700 transition-colors"
          >
            Delete Selected
          </button>
        </div>
      </div>
    );
  }

  // Single selection
  const element = selectedElements[0];
  const Icon = TYPE_ICONS[element.type] || Square;
  const typeLabel = TYPE_LABELS[element.type] || element.type;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <Icon size={16} className="text-gray-400" />
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            {typeLabel}
          </h2>
        </div>
      </div>

      {/* Properties */}
      <div className="flex-1 overflow-y-auto p-3">
        {/* Position */}
        <div className="mb-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Position
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-medium text-gray-400 block mb-1">X</label>
              <input
                type="number"
                value={Math.round(element.x)}
                readOnly
                className="w-full bg-gray-700/50 text-gray-400 px-2 py-1.5 rounded text-sm border border-gray-600 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-400 block mb-1">Y</label>
              <input
                type="number"
                value={Math.round(element.y)}
                readOnly
                className="w-full bg-gray-700/50 text-gray-400 px-2 py-1.5 rounded text-sm border border-gray-600 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Type-specific properties */}
        <div className="mb-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Properties
          </h3>
          <ElementProperties element={element} />
        </div>

        {/* Actions */}
        <div className="pt-3 border-t border-gray-700">
          <button
            onClick={() => deleteElements([element.id])}
            className="w-full px-3 py-2 rounded text-sm bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors border border-red-600/30"
          >
            Delete Element
          </button>
        </div>
      </div>
    </div>
  );
}
