import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import MapProvider from "./context/MapProvider.jsx";
import SeasonsProvider from "./context/SeasonProvider.jsx";

createRoot(document.getElementById("root")).render(
  <SeasonsProvider>
    <MapProvider>
      <App />
    </MapProvider>
  </SeasonsProvider>
);
