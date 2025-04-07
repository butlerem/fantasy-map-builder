// Save the map data (grid states) into localStorage under the key "savedMap"
export const saveMap = (mapData) => {
  try {
    localStorage.setItem("savedMap", JSON.stringify(mapData));
    console.log("Map saved successfully.");
  } catch (error) {
    console.error("Error saving map:", error);
  }
};

// Load the map data from localStorage from the key "savedMap"
export const loadMap = () => {
  try {
    const saved = localStorage.getItem("savedMap");
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error("Error loading map:", error);
    return null;
  }
};

// Save the party (character list) into localStorage under the key "savedParty"
export const saveParty = (partyData) => {
  try {
    localStorage.setItem("savedParty", JSON.stringify(partyData));
    console.log("Party saved successfully.");
  } catch (error) {
    console.error("Error saving party:", error);
  }
};

// Load the party (character list) from localStorage from the key "savedParty"
export const loadParty = () => {
  try {
    const saved = localStorage.getItem("savedParty");
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error("Error loading party:", error);
    return null;
  }
};

/**
 * Composite Functions:
 * These combine both map and party state into one object and store it
 * under a single key ("savedAppState").
 */

// Save both map and party state into localStorage as a composite object
export const saveAppState = (mapData, partyData) => {
  const compositeData = {
    mapData,
    partyData,
  };
  try {
    localStorage.setItem("savedAppState", JSON.stringify(compositeData));
    console.log("App state saved successfully.");
  } catch (error) {
    console.error("Error saving app state:", error);
  }
};

// Load the composite app state (both map and party) from localStorage
export const loadAppState = () => {
  try {
    const saved = localStorage.getItem("savedAppState");
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error("Error loading app state:", error);
    return null;
  }
};

/*
Notes:
- The individual functions (saveMap/loadMap and saveParty/loadParty) remain available
for debugging purposes.
*/
