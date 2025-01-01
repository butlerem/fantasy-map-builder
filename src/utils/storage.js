export const saveMap = (mapData) => {
  try {
    localStorage.setItem("savedMap", JSON.stringify(mapData));
    console.log("Map saved successfully.");
  } catch (error) {
    console.error("Error saving map:", error);
  }
};

export const loadMap = () => {
  try {
    const saved = localStorage.getItem("savedMap");
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error("Error loading map:", error);
    return null;
  }
};
