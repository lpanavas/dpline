import React, { useState } from "react";
import LineChart from "./Components/LineChart";
import Slider from "rc-slider";
import "./App.css";
import "rc-slider/assets/index.css";

function App() {
  const MIN_EPSILON = 0.1;
  const MAX_EPSILON = 10;

  const [sliderValues, setSliderValues] = useState([
    MIN_EPSILON,
    (MIN_EPSILON + MAX_EPSILON) / 2,
    MAX_EPSILON,
  ]);
  const [queryType, setQueryType] = useState("Count");
  const [numBins, setNumBins] = useState(1);
  const [datasetBounds, setDatasetBounds] = useState({
    low: 0,
    high: 100,
  });
  const [datasetSize, setDatasetSize] = useState(100);

  const delta = 0.05;
  const delta_gaussian = 0.001;

  const k = queryType === "Histogram" ? numBins : 1;
  const sensitivity = (() => {
    if (queryType === "Sum") {
      return datasetBounds.high - datasetBounds.low;
    }
    if (queryType === "Mean") {
      // Adjust the sensitivity for mean based on dataset size
      return (datasetBounds.high - datasetBounds.low) / datasetSize;
    }
    return 1;
  })();

  const errorForSelectedEpsilon =
    Math.log(k / delta) * (sensitivity / sliderValues[1]);
  // const sigma =
  //   (Math.sqrt(k) *
  //     (sensitivity * Math.sqrt(2 * Math.log(1.25 / delta_gaussian)))) /
  //   sliderValues[1];
  // const gaussianErrorForSelectedEpsilon = 1.96 * sigma;

  return (
    <div className="app-container">
      {/* Chart */}
      <div className="app-section">
        <LineChart
          width={600}
          height={400}
          minEpsilon={sliderValues[0]}
          maxEpsilon={sliderValues[2]}
          selectedEpsilon={sliderValues[1]}
          k={k}
          sensitivity={sensitivity}
        />
      </div>

      {/* Query Selection */}
      <div className="app-section">
        <label>
          Select query type:
          <select
            value={queryType}
            onChange={(e) => setQueryType(e.target.value)}
          >
            <option value="Count">Count</option>
            <option value="Sum">Sum</option>
            <option value="Mean">Mean</option>
            <option value="Histogram">Histogram</option>
          </select>
        </label>
      </div>

      {/* Conditional Inputs */}
      {queryType === "Histogram" && (
        <div className="app-section">
          <label>
            Number of bins:
            <input
              type="number"
              value={numBins}
              onChange={(e) => setNumBins(parseInt(e.target.value))}
            />
          </label>
        </div>
      )}

      {(queryType === "Sum" || queryType === "Mean") && (
        <div className="app-section">
          <label>
            Estimated Low Value of Dataset:
            <input
              type="number"
              value={datasetBounds.low}
              onChange={(e) =>
                setDatasetBounds((prev) => ({
                  ...prev,
                  low: parseInt(e.target.value),
                }))
              }
            />
          </label>
          <br />
          <label>
            Estimated High Value of Dataset:
            <input
              type="number"
              value={datasetBounds.high}
              onChange={(e) =>
                setDatasetBounds((prev) => ({
                  ...prev,
                  high: parseInt(e.target.value),
                }))
              }
            />
          </label>
        </div>
      )}
      {queryType === "Mean" && (
        <div className="app-section">
          <label>
            Dataset Size:
            <input
              type="number"
              value={datasetSize}
              onChange={(e) =>
                setDatasetSize(Math.max(1, parseInt(e.target.value)))
              }
            />
          </label>
        </div>
      )}

      {/* Error Display */}
      <div className="app-section">
        With a confidence level of {((1 - delta) * 100).toFixed(2)}%:
        <ul>
          <li>
            The error of the Laplace mechanism's private statistical estimate is
            expected to be less than or equal to{" "}
            {errorForSelectedEpsilon.toFixed(2)}.
          </li>
          {/* <li>
            The error of the Gaussian mechanism's private statistical estimate
            is expected to be less than or equal to{" "}
            {gaussianErrorForSelectedEpsilon.toFixed(2)}.
          </li> */}
        </ul>
      </div>

      {/* Slider */}
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
          allowCross={false}
        />
      </div>
    </div>
  );
}

export default App;
