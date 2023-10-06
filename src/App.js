import React, { useState } from "react";
import LineChart from "./Components/LineChart";
import Slider from "rc-slider";
import "./App.css";
import "rc-slider/assets/index.css";

function App() {
  const MIN_EPSILON = 0.1;
  const MAX_EPSILON = 10;
  const scenarios = [
    {
      title: "Identifying Substance Abuse Cases in a School District",
      description:
        "You are a health official tasked with understanding substance abuse patterns within a school district. After running a confidential survey across high schools, you aim to disclose the number of positive cases to guide future preventive campaigns. Given the sensitive nature of the topic and potential repercussions for identified students, it's critical to maintain their privacy. Your goal is to release a count that provides a broad understanding of the scale of the issue without putting any individual student at risk. Specifically, the disclosed count shouldn't deviate by more than 2 from the actual figure. Through careful adjustment of ε, you intend to strike this delicate balance between data transparency and student confidentiality.",
    },
    {
      title: "Average Age in a High School",
      description:
        "You are an educational researcher studying the age distribution of high school students in a school with 967 students. The goal is to determine the average age of students. You need the average age to be accurate within 0.01 years of the true mean. Adjusting ε will help you understand how close you can get to the true mean without compromising individual student's data.",
    },
    {
      title: "Income Distribution in a Small Town",
      description:
        "As an economist, you're researching the economic health of a small town with a population of 5,000. Your focus is on the household income distribution, which is segmented into five distinct bands: <$20k, $20k-$40k, $40k-$60k, $60k-$80k, and >$80k. To provide an accurate economic picture without risking individual household privacy, it's vital that no bin value deviates by more than 5 from the actual count. By adjusting ε, you aim to maintain the integrity of the town's economic distribution while ensuring individual households remain anonymous.",
    },
  ];
  const [selectedScenario, setSelectedScenario] = useState(scenarios[0]);
  const handleScenarioChange = (scenarioTitle) => {
    const scenario = scenarios.find((s) => s.title === scenarioTitle);
    setSelectedScenario(scenario);
  };

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
      <div className="app-section">
        <label>
          Choose a scenario:
          <select onChange={(e) => handleScenarioChange(e.target.value)}>
            {scenarios.map((scenario, index) => (
              <option key={index} value={scenario.title}>
                {scenario.title}
              </option>
            ))}
          </select>
        </label>
      </div>
      {/* Scenario */}
      <div className="app-section">
        <h3>Scenario:</h3>
        <p>{selectedScenario.description}</p>
      </div>
    </div>
  );
}

export default App;
