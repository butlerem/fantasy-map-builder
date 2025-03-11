// Save the map data (grid states) into localStorage
export const saveMap = (mapData) => {
  try {
    // Convert mapData to a JSON string and store it under the key 'savedMap'
    localStorage.setItem("savedMap", JSON.stringify(mapData));
    console.log("Map saved successfully.");
  } catch (error) {
    console.error("Error saving map:", error);
  }
};

// Load the map data from localStorage and parse it back to an object
export const loadMap = () => {
  try {
    const saved = localStorage.getItem("savedMap");
    // Return the parsed data if it exists, otherwise return null
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error("Error loading map:", error);
    return null;
  }
};
