import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

function LineChart({ width, height, minEpsilon, maxEpsilon, selectedEpsilon }) {
  const svgRef = useRef(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const k = 1; // example value
    const delta = 0.05; // example value
    const sensitivity = 1; // example value
    // Data generation using the Laplace error formula (error vs. epsilon)
    const data = Array.from({ length: 100 }, (_, index) => {
      const computedEpsilon =
        minEpsilon + (maxEpsilon - minEpsilon) * (index / 99);
      const error = Math.log(k / delta) * (sensitivity / computedEpsilon);
      return {
        epsilon: computedEpsilon,
        error: error,
      };
    });

    const xScale = d3
      .scaleLinear()
      .domain([minEpsilon, maxEpsilon])
      .range([50, width - 10]); // Padding for axis

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.error)])
      .range([height - 30, 10]); // Padding for axis

    const line = d3
      .line()
      .x((d) => xScale(d.epsilon))
      .y((d) => yScale(d.error));

    svg.selectAll("*").remove();
    svg
      .append("g")
      .attr("transform", `translate(0,${height - 30})`) // Positioning at the bottom with padding
      .call(d3.axisBottom(xScale).ticks(10));

    // Draw Y axis with labels
    svg
      .append("g")
      .attr("transform", "translate(50,0)") // Positioning with padding
      .call(d3.axisLeft(yScale));
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale).ticks(10));

    // svg.append("g").call(d3.axisLeft(yScale));

    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "blue")
      .attr("d", line);

    const selectedXPosition = xScale(selectedEpsilon);
    svg
      .append("line")
      .attr("x1", selectedXPosition)
      .attr("y1", 10) // top padding
      .attr("x2", selectedXPosition)
      .attr("y2", height - 30) // bottom position minus padding
      .attr("stroke", "red")
      .attr("stroke-dasharray", "4"); // Optional: dashed line style
  }, [minEpsilon, maxEpsilon, width, height, selectedEpsilon]);

  return <svg ref={svgRef} width={width} height={height}></svg>;
}

export default LineChart;
