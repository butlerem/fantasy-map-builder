import { createRoot } from "react-dom/client";
import "./styles.scss";
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
