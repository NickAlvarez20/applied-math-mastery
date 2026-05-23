import { useEffect, useRef } from "react";
import type { Layout, Data } from "plotly.js";
import "@/styles/components/math-graph.css";

interface Props {
  traces: Data[];
  title?: string;
  xLabel?: string;
  yLabel?: string;
  height?: number;
}

// Dynamically imports Plotly so it doesn't bloat the initial bundle.
export default function MathGraph({
  traces,
  title,
  xLabel = "x",
  yLabel = "y",
  height = 360,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const dark = document.documentElement.getAttribute("data-theme") === "dark";

  const bg = dark ? "#1a1830" : "#ffffff";
  const text = dark ? "#f0eeff" : "#1a1a2e";
  const grid = dark ? "#2e2b4a" : "#e2e0f0";

  useEffect(() => {
    if (!ref.current) return;

    import("plotly.js").then((Plotly) => {
      const layout: Partial<Layout> = {
        title: { text: title ?? "", font: { color: text, size: 14 } },
        height,
        margin: { t: title ? 40 : 20, r: 20, b: 48, l: 52 },
        paper_bgcolor: bg,
        plot_bgcolor: bg,
        font: { color: text, family: "Inter, system-ui, sans-serif", size: 12 },
        xaxis: {
          title: { text: xLabel },
          gridcolor: grid,
          zerolinecolor: grid,
          color: text,
        },
        yaxis: {
          title: { text: yLabel },
          gridcolor: grid,
          zerolinecolor: grid,
          color: text,
        },
        legend: {
          bgcolor: "rgba(0,0,0,0)",
          font: { color: text },
        },
      };

      Plotly.react(ref.current!, traces as any, layout, {
        displayModeBar: false,
        responsive: true,
        scrollZoom: false,
      });
    });

    return () => {
      import("plotly.js").then((Plotly) => {
        if (ref.current) Plotly.purge(ref.current);
      });
    };
  }, [traces, dark, title, xLabel, yLabel, height]);

  return (
    <div className="math-graph-wrapper">
      <div ref={ref} className="math-graph" />
    </div>
  );
}
