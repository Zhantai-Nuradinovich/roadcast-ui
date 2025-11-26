import { useState } from "react";
import MapView from "./components/MapView";
import MovementEngine from "./components/MovementEngine";

function App() {
  const [speed, setSpeed] = useState(40);
  const [heading, setHeading] = useState(90);
  const [position, setPosition] = useState({ lat: 42.8746, lng: 74.5698 }); // Бишкек

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2>Geo Simulator Client</h2>

      <div>
        <label>Speed (km/h): </label>
        <input
          type="number"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
        />
      </div>

      <div>
        <label>Heading (°): </label>
        <input
          type="number"
          value={heading}
          onChange={(e) => setHeading(Number(e.target.value))}
        />
      </div>

      <MovementEngine
        speed={speed}
        heading={heading}
        onPositionChange={setPosition} // <-- Передали позицию из MovementEngine
      />

      <MapView center={position} nearby={[]} />  {/* <-- Теперь правильно */}

      <p>📡 GeoHub and ProximityHub will display updates here later</p>
    </div>
  );
}

export default App;
