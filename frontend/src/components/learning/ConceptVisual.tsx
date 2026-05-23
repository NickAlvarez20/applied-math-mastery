import MathGraph from "./MathGraph";
import type { Data } from "plotly.js";

interface Props {
  visualType: string;
  topicId: string;
  conceptIndex: number;
}

// Returns Plotly trace data based on topic + concept index.
// Extend this function as more topics are added.
function getTraces(topicId: string, idx: number): Data[] {
  // Linear equations
  if (topicId === "algebra-linear-equations") {
    if (idx === 0) {
      const x = Array.from({ length: 100 }, (_, i) => i * 0.1 - 2);
      return [
        {
          x,
          y: x.map((v) => 2 * v + 1),
          type: "scatter",
          mode: "lines",
          name: "y = 2x + 1",
          line: { color: "#6c47ff", width: 2.5 },
        },
      ];
    }
    if (idx === 1) {
      const x = Array.from({ length: 100 }, (_, i) => i * 0.1 - 2);
      return [
        {
          x,
          y: x.map((v) => 3 * v - 2),
          type: "scatter",
          mode: "lines",
          name: "y = 3x - 2",
          line: { color: "#6c47ff", width: 2.5 },
        },
        {
          x,
          y: x.map((v) => -v + 4),
          type: "scatter",
          mode: "lines",
          name: "y = -x + 4",
          line: { color: "#ff6b35", width: 2.5 },
        },
      ];
    }
  }

  // Quadratics
  if (topicId === "algebra-quadratics") {
    const x = Array.from({ length: 200 }, (_, i) => i * 0.05 - 5);
    return [
      {
        x,
        y: x.map((v) => v * v - 2 * v - 3),
        type: "scatter",
        mode: "lines",
        name: "y = x² - 2x - 3",
        line: { color: "#6c47ff", width: 2.5 },
      },
      {
        x: [3, -1],
        y: [0, 0],
        type: "scatter",
        mode: "markers",
        name: "Roots",
        marker: { color: "#ff6b35", size: 10 },
      },
    ];
  }

  // Derivatives — show function and its tangent
  if (topicId === "calculus-derivatives") {
    const x = Array.from({ length: 200 }, (_, i) => i * 0.05 - 4);
    const x0 = 1;
    const f = (v: number) => v * v * v - 3 * v;
    const fp = (v: number) => 3 * v * v - 3; // f'(x)
    const tan = (v: number) => f(x0) + fp(x0) * (v - x0);
    return [
      {
        x,
        y: x.map(f),
        type: "scatter",
        mode: "lines",
        name: "f(x) = x³ - 3x",
        line: { color: "#6c47ff", width: 2.5 },
      },
      {
        x,
        y: x.map(tan),
        type: "scatter",
        mode: "lines",
        name: `Tangent at x = ${x0}`,
        line: { color: "#ff6b35", width: 2, dash: "dash" },
      },
    ];
  }

  // Integrals — show area under curve
  if (topicId === "calculus-integrals") {
    const x = Array.from({ length: 200 }, (_, i) => i * 0.025);
    const fill = x.filter((v) => v <= 3);
    return [
      {
        x,
        y: x.map((v) => v * v),
        type: "scatter",
        mode: "lines",
        name: "y = x²",
        line: { color: "#6c47ff", width: 2.5 },
      },
      {
        x: [...fill, 3, 0],
        y: [...fill.map((v) => v * v), 0, 0],
        type: "scatter",
        mode: "none",
        fill: "toself",
        fillcolor: "rgba(108, 71, 255, 0.2)",
        name: "Area = 9",
        line: { color: "transparent" },
      },
    ];
  }

  // Normal distribution
  if (topicId === "stats-distributions") {
    const x = Array.from({ length: 300 }, (_, i) => i * 0.05 - 4);
    const normal = (v: number, mu = 0, sigma = 1) =>
      (1 / (sigma * Math.sqrt(2 * Math.PI))) *
      Math.exp(-0.5 * ((v - mu) / sigma) ** 2);
    return [
      {
        x,
        y: x.map((v) => normal(v, 0, 1)),
        type: "scatter",
        mode: "lines",
        name: "μ=0, σ=1",
        line: { color: "#6c47ff", width: 2.5 },
      },
      {
        x,
        y: x.map((v) => normal(v, 1, 1.5)),
        type: "scatter",
        mode: "lines",
        name: "μ=1, σ=1.5",
        line: { color: "#ff6b35", width: 2.5 },
      },
    ];
  }

  // Probability — bar chart
  if (topicId === "stats-probability") {
    return [
      {
        x: ["0 heads", "1 head", "2 heads", "3 heads"],
        y: [0.125, 0.375, 0.375, 0.125],
        type: "bar",
        name: "P(k heads in 3 flips)",
        marker: { color: "#6c47ff" },
      },
    ];
  }

  // Coordinate geometry — distance
  if (topicId === "geo-coordinate") {
    return [
      {
        x: [1, 4],
        y: [2, 6],
        type: "scatter",
        mode: "lines+markers",
        name: "Distance = 5",
        line: { color: "#6c47ff", width: 2 },
        marker: { size: 10, color: "#ff6b35" },
      },
      {
        x: [1, 4, 4],
        y: [2, 2, 6],
        type: "scatter",
        mode: "lines",
        name: "Right triangle",
        line: { color: "#9ca3af", width: 1.5, dash: "dot" },
      },
    ];
  }

  // Circles
  if (topicId === "geo-circles") {
    const theta = Array.from({ length: 361 }, (_, i) => (i * Math.PI) / 180);
    return [
      {
        x: theta.map((t) => 3 * Math.cos(t)),
        y: theta.map((t) => 3 * Math.sin(t)),
        type: "scatter",
        mode: "lines",
        name: "Circle r = 3",
        line: { color: "#6c47ff", width: 2.5 },
      },
      {
        x: [0, 3],
        y: [0, 0],
        type: "scatter",
        mode: "text+lines",
        name: "radius",
        text: ["", "r = 3"],
        textposition: "top center",
        line: { color: "#ff6b35", width: 2 },
      },
    ];
  }

  // Default — empty sine wave
  const x = Array.from({ length: 200 }, (_, i) => i * 0.05 - 5);
  return [
    {
      x,
      y: x.map((v) => Math.sin(v)),
      type: "scatter",
      mode: "lines",
      name: "y = sin(x)",
      line: { color: "#6c47ff", width: 2 },
    },
  ];
}

export default function ConceptVisual({
  visualType,
  topicId,
  conceptIndex,
}: Props) {
  if (visualType === "quiz" || visualType === "drag") return null;

  const traces = getTraces(topicId, conceptIndex);

  return <MathGraph traces={traces} xLabel="x" yLabel="y" height={300} />;
}
