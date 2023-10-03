import React, { useState } from "react";
import LineChart from "./Components/LineChart";
import Slider from "rc-slider";
import "./App.css";
import "rc-slider/assets/index.css";

function App() {
  const MIN_EPSILON = 0.1;
  const MAX_EPSILON = 10;
  const sensitivity = 1;

  const [sliderValues, setSliderValues] = useState([
    MIN_EPSILON,
    (MIN_EPSILON + MAX_EPSILON) / 2,
    MAX_EPSILON,
  ]);
  const k = 1; // example value for sensitivity
  const delta = 0.05; // example value for delta
  const errorForSelectedEpsilon =
    Math.log(k / delta) * (sensitivity / sliderValues[1]);
  return (
    <div className="app-container">
      <div className="app-section">
        With probability {((1 - delta) * 100).toFixed(2)}%, the private
        statistical release will not be off by more than{" "}
        {errorForSelectedEpsilon.toFixed(2)}.
      </div>
      <div className="app-section">
        <LineChart
          width={600}
          height={400}
          minEpsilon={sliderValues[0]}
          maxEpsilon={sliderValues[2]}
          selectedEpsilon={sliderValues[1]}
        />
      </div>
      <div className="app-section">
        <label>
          Epsilon Range: {sliderValues[0].toFixed(2)} -{" "}
          {sliderValues[2].toFixed(2)}
        </label>
        <br />
        <label>Selected Epsilon: {sliderValues[1].toFixed(2)}</label>
        <Slider
          range
          min={MIN_EPSILON}
          max={MAX_EPSILON}
          step={0.01}
          value={sliderValues}
          onChange={(values) => setSliderValues(values)}
          allowCross={false} // This ensures handles don't cross each other
        />
      </div>
    </div>
  );
}

export default App;
