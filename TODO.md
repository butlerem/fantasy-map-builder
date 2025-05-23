# TODO List

## Event Handling

- [ ] **Fix Event Eraser Behavior:**
  - Update the eraser so it deletes events instead of opening the tooltip/profile,
  - Or remove the erase button and add a dedicated delete button within the tooltip.
- [ ] **Remove Empty Event:**
  - Eliminate the random unknown character generated by the empty event in the sample map.

## Drawing Enhancements

- [ ] **Shape Drawing Preview:**
  - Implement dotted lines to preview shapes while drawing on the canvas.
- [ ] **Layer Separation:**
  - Ensure that base layer drawing tools (e.g., square, circle, fill) do not transfer over to the object layer, preventing accidental selection of extra objects.
- [ ] **Undo Draw Button:**
  - Add an undo functionality for the base layer, positioned near the pencil/paint can tool.

## Animation & Visual Updates

- [ ] **Welcome Overlay & Tutorial:**
  - Redesign the welcome overlay and consider replacing it with a mini tutorial that introduces key features.

## Feature Enhancements

- [ ] **Limit Characters/Events:**
  - Implement a maximum number of characters/events allowed in the project.
- [ ] **Persistent Storage:**
  - Verify if character information is saved in storage; if not, implement persistent storage for character data.
- [ ] **Event Interaction Handling:**
  - Develop a system to detect when events run into each other, enabling characters to interact based on their roles.

## Map & Navigation Features

- [ ] **Map Selector UI:**
  - Add a UI element (a small box with 4 squares) to allow users to create or switch between up to four maps.
- [ ] **Dynamic Map Dimensions:**
  - Provide controls (e.g., two input boxes for grid size) so users can adjust the map dimensions from the default up to a larger size.
- [ ] **New Event Types:**
  - Implement different event types (e.g., treasure chests, doors, stairs) that can trigger unique actions like transferring to a different map or initiating special events.
