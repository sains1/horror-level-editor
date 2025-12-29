# Level Editor - Features Backlog

## High Priority - COMPLETED

### Box Selection ✅
- [x] Click and drag to draw selection rectangle
- [x] All elements within the rectangle get selected
- [x] Works with existing multi-select (Shift+click to add/remove)
- [x] Selected elements can be moved together
- [x] Copy/paste selection between levels (Ctrl+C in Level 1, switch to Level 2, Ctrl+V)
- [x] Visual feedback showing selection rectangle while dragging

### Auto-Select New Elements ✅
- [x] When placing a new element, automatically select it
- [x] Properties panel immediately shows the new element's details
- [x] Allows quick naming/configuration right after placement

### Annotations/Notes ✅
- [x] New element type: text annotation
- [x] Click to place, type to add note
- [x] Configurable text size (small, medium, large)
- [x] Configurable color (for categorizing notes)
- [x] Optional background box for readability
- [x] Notes visible in editor but can be hidden via layers
- [x] Useful for team communication and design documentation

### Spawn Points ✅
- [x] New element type: spawn point
- [x] Variants: player-start, enemy-spawn, npc-spawn
- [ ] Player start: unique per level (warn if multiple) - not implemented
- [x] Enemy/NPC spawns: configurable respawn (once, timed, triggered)
- [x] Visual indicator showing spawn direction (arrow)
- [x] Nameable for scripting reference

### Objective Markers ✅
- [x] New element type: objective
- [x] Configurable objective text/description
- [x] Objective type: primary, secondary, optional
- [x] Order/sequence number for multi-step objectives (auto-increments)
- [x] Completion trigger zone (radius)
- [x] Visual styling based on type (gold/silver/bronze colors)
- [x] Can link to required items (e.g., "Requires: Red Key")

### Screenshot/PNG Export ✅
- [x] Export current view as PNG image
- [x] Option to export full level (auto-fit all elements)
- [x] Option to hide grid in export
- [ ] Option to hide annotations in export - not implemented
- [x] 2x resolution for high quality exports
- [x] Useful for documentation and sharing designs

---

## Medium Priority

### Trigger Zones
- [ ] Generic trigger area element
- [ ] Configurable trigger type (enter, exit, stay)
- [ ] Trigger conditions (player only, any character, specific character)
- [ ] Can link to other elements (activate/deactivate)
- [ ] Visual: semi-transparent colored zone
- [ ] Nameable for scripting reference

### Light Sources
- [ ] New element type: light source
- [ ] Variants: lamp, candle, window, fluorescent
- [ ] Configurable brightness/radius
- [ ] Configurable color (warm, cool, colored)
- [ ] Visual: glow effect or radius indicator
- [ ] Could auto-affect nearby room light levels (optional)

### Security Cameras
- [ ] New element type: security camera
- [ ] Cone of vision visualization
- [ ] Configurable view angle (narrow, wide)
- [ ] Configurable view distance
- [ ] Patrol mode: static, oscillating (with angle range)
- [ ] Can be linked to alarm triggers

### Sound Emitters
- [ ] New element type: sound emitter
- [ ] Configurable radius (how far sound travels)
- [ ] Sound type: ambient, distraction, alarm
- [ ] Trigger: always-on, triggered, timed
- [ ] Visual: pulsing circles showing sound radius

### Element Locking
- [ ] Lock individual elements to prevent accidental moves
- [ ] Lock icon indicator on locked elements
- [ ] Locked elements still selectable but not draggable
- [ ] Bulk lock/unlock via multi-select
- [ ] Keyboard shortcut (Ctrl+L to toggle lock)

### Element Grouping
- [ ] Select multiple elements and group them (Ctrl+G)
- [ ] Grouped elements move/rotate together
- [ ] Can ungroup (Ctrl+Shift+G)
- [ ] Groups can be nested
- [ ] Group name for organization

### Align & Distribute Tools
- [ ] Align selected elements: left, center, right
- [ ] Align selected elements: top, middle, bottom
- [ ] Distribute evenly: horizontal, vertical
- [ ] Toolbar or right-click menu access

---

## Low Priority / Nice to Have

### Interactables
- [ ] Generic interactable element
- [ ] Variants: switch, lever, button, computer, valve
- [ ] Configurable states (on/off, multi-state)
- [ ] Can link to doors, triggers, other interactables

### Windows
- [ ] Wall opening element (like doors but for viewing)
- [ ] Configurable: breakable, openable, fixed
- [ ] Visual: glass indication

### Barriers/Obstacles
- [ ] Movable or destructible obstacles
- [ ] Types: furniture, debris, locked gate
- [ ] Configurable: push, destroy, requires-item

### Prefabs/Templates
- [ ] Save selected elements as a prefab
- [ ] Prefab library panel
- [ ] Drag prefab to place instance
- [ ] Edit prefab updates all instances (optional)

### Element Search
- [ ] Search bar to find elements by name
- [ ] Filter by element type
- [ ] Click result to select and pan to element
- [ ] Useful for large complex levels

### Minimap
- [ ] Small overview panel showing entire level
- [ ] Click to navigate to area
- [ ] Shows element positions as colored dots
- [ ] Highlights current viewport

### Ruler/Distance Tool
- [ ] Measure distance between two points
- [ ] Shows distance in grid units
- [ ] Useful for spacing and game balance

### Patrol Route Animation
- [ ] Play button to animate patrol routes
- [ ] Shows character moving along path
- [ ] Configurable speed preview
- [ ] Helps visualize patrol timing

### Connection Lines
- [ ] Visual links between related elements
- [ ] E.g., locked door → matching key
- [ ] E.g., trigger zone → target element
- [ ] Toggle visibility via layers

### Floor Patterns/Textures
- [ ] Different floor styles for rooms
- [ ] Patterns: tile, wood, carpet, concrete
- [ ] Helps differentiate room types visually

### Keyboard Shortcuts Modal
- [ ] Help overlay showing all shortcuts
- [ ] Triggered by ? key or help button
- [ ] Searchable shortcut list

---

## Technical Improvements

### Performance
- [ ] Virtualize rendering for large levels (only render visible elements)
- [ ] Lazy load level data
- [ ] Optimize undo/redo history (diff-based instead of full snapshots)

### Data & Export
- [ ] Export level as game-ready JSON (stripped editor metadata)
- [ ] Import/export individual elements
- [ ] Level validation (check for missing spawn points, unreachable areas)
- [ ] Auto-backup to prevent data loss

### Collaboration
- [ ] Comments on elements (not just annotations)
- [ ] Change history log
- [ ] Compare two versions of a level

---

## Completed Features

See `plan.md` for the full list of implemented features including:
- All element types (rooms, doors, stairs, characters, items, etc.)
- Properties panel
- Multi-level support
- Undo/redo
- Copy/paste
- Grid snapping
- Layer visibility
- JSON import/export
- Room lighting levels
- Z-order rendering
