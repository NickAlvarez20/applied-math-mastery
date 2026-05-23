import { useEffect, useRef } from "react";
import type { Layout, Data } from "plotly.js";
import "@/styles/components/math-graph.css";
import Plotly from "plotly.js-dist-min";

declare global {
  interface Window {
    Plotly: typeof Plotly;
  }
}

interface Props {
  traces: Data[];
  title?: string;
  xLabel?: string;
  yLabel?: string;
  height?: number;
}

export default function MathGraph({
  traces,
  title,
  xLabel = "x",
  yLabel = "y",
  height = 360,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const dark =
    document.documentElement.getAttribute("data-theme") === "dark";

  const bg = dark ? "#1a1830" : "#ffffff";
  const text = dark ? "#f0eeff" : "#1a1a2e";
  const grid = dark ? "#2e2b4a" : "#e2e0f0";

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let cancelled = false;

    import("plotly.js-dist-min").then((module) => {
      if (cancelled) return;
      // Cast the module to the global Plotly type
      const PlotlyLib = module as unknown as typeof Plotly;

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
        legend: { bgcolor: "rgba(0,0,0,0)", font: { color: text } },
      };

      PlotlyLib.react(el, traces, layout, {
        displayModeBar: false,
        responsive: true,
        scrollZoom: false,
      });
    });

    return () => {
      cancelled = true;
      import("plotly.js-dist-min").then((module) => {
        const PlotlyLib = module as unknown as typeof Plotly;
        if (el.isConnected) PlotlyLib.purge(el);
      });
    };
  }, [traces, dark, title, xLabel, yLabel, height, bg, text, grid]);

  return (
    <div className="math-graph-wrapper">
      <div ref={ref} className="math-graph" style={{ height }} />
    </div>
  );
}
