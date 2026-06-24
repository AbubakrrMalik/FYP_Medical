import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
} from "recharts";

const DRUGS = [
  {
    key: "tedizolid-phosphate",
    label: "Tedizolid Phosphate",
    color: "#f87171",
  },
  {
    key: "cyclovirobuxin-d",
    label: "Cyclovirobuxin-d",
    color: "#4ade80",
  },
  {
    key: "UNBS-5162",
    label: "UNBS-5162",
    color: "#60a5fa",
  },
];

const geneInfo = {
  HNF1A: {
    HepG2: "4.59",
    HuH6: "4.38",
  },
  MYC: {
    HepG2: "6.66",
    HuH6: "5.67",
  },
  ERBB2: {
    HepG2: "5.88",
    HuH6: "4.26",
  },
};

export default function DrugGeneCorrelationChart({ correlations }) {
  const chartData = useMemo(() => {
    const genes = ["HNF1A", "MYC", "ERBB2"];

    return genes.map((gene) => {
      const row = { gene };

      DRUGS.forEach((drug) => {
        const match = correlations.find(
          (c) =>
            c.metric === "auc" &&
            c.gene === gene &&
            c.drug?.toLowerCase() === drug.key.toLowerCase()
        );

        row[drug.key] = match?.pearson_r ?? null;
      });

      return row;
    });
  }, [correlations]);

  return (
    <div
      style={{
        background:
          "linear-gradient(180deg, rgba(15,23,42,0.65) 0%, rgba(10,15,30,0.85) 100%)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(148,163,184,0.15)",
        borderRadius: "20px",
        padding: "28px",
        marginTop: "2rem",
        fontFamily: "sans-serif",
        boxShadow:
          "0 10px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "20px" }}>
        <h2
          style={{
            color: "#e2e8f0",
            fontSize: "28px",
            fontWeight: 700,
            margin: 0,
          }}
        >
          Drug-Gene Correlation Analysis
        </h2>

        <p
  style={{
    color: "#94a3b8",
    marginTop: "6px",
    fontSize: "15px",
  }}
>
  Correlation between gene expression and drug response (
  <span
    style={{
      color: "#18d6e4",
      fontWeight: 700,
    }}
  >
    HB
  </span>
  : Hepatoblastoma)
</p>
      </div>

      <div
        style={{
          position: "relative",
          paddingLeft: "130px",
        }}
      >
        {/* Y Axis Label */}
        <div
          style={{
            position: "absolute",
            left: "-100px",
            top: "50%",
            transform: "translateY(-50%) rotate(-90deg)",
            fontWeight: 600,
            fontSize: "14px",
            color: "#cbd5e1",
            letterSpacing: "0.5px",
          }}
        >
          {/* Drugs */}
          Drug Pearson Correlation r
        </div>

        {/* Drug Labels */}
<div
  style={{
    position: "absolute",
    left: "15px",
    top: "40px",
    width: "120px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "400px",
  }}
>
  <div
    style={{
      color: "#f87171",
      fontWeight: 700,
      fontSize: "13px",
      textAlign: "left",
      lineHeight: "1.2",
    }}
  >
    Tedizolid
    <br />
    Phosphate
    <br />
    <span
      style={{
        fontSize: "12px",
        fontWeight: 600,
      }}
    >
      (AUC = 0.8906)
    </span>
  </div>

  <div
    style={{
      color: "#4ade80",
      fontWeight: 700,
      fontSize: "13px",
      textAlign: "left",
      lineHeight: "1.2",
    }}
  >
    Cyclovirobuxin-d
    <br />
    <span
      style={{
        fontSize: "12px",
        fontWeight: 600,
      }}
    >
      (AUC = 1.044)
    </span>
  </div>

  <div
    style={{
      color: "#60a5fa",
      fontWeight: 700,
      fontSize: "13px",
      textAlign: "left",
      lineHeight: "1.2",
    }}
  >
    UNBS-5162
    <br />
    <span
      style={{
        fontSize: "12px",
        fontWeight: 600,
      }}
    >
      (AUC = 0.869)
    </span>
  </div>
</div>

        <ResponsiveContainer width="100%" height={550}>
          <LineChart
            data={chartData}
            margin={{
              top: 40,
              right: 60,
              left: 20,
              bottom: 90,
            }}
          >
            <CartesianGrid
              stroke="rgba(148,163,184,0.15)"
              strokeDasharray="4 4"
            />

            <XAxis
              dataKey="gene"
              interval={0}
              padding={{ left: 70, right: 70 }}
              axisLine={{ stroke: "rgba(148,163,184,0.25)" }}
              tickLine={{ stroke: "rgba(148,163,184,0.25)" }}
              tick={({ x, y, payload }) => {
                const info = geneInfo[payload.value];
                if (!info) return null;

                return (
                  <g transform={`translate(${x},${y + 18})`}>
                    {/* Gene Name */}
                    <text
                      y={0}
                      textAnchor="middle"
                      fontWeight="700"
                      fontSize="14"
                      fill="#e2e8f0"
                    >
                      {payload.value}
                    </text>

                    {/* HepG2 */}
                    <text
                      x={-35}
                      y={24}
                      textAnchor="middle"
                      fill="#38bdf8"
                      fontWeight="700"
                      fontSize="12"
                    >
                      HepG2
                    </text>

                    <text
                      x={-35}
                      y={40}
                      textAnchor="middle"
                      fill="#38bdf8"
                      fontSize="11"
                    >
                      ({info.HepG2})
                    </text>

                    {/* HuH6 */}
                    <text
                      x={35}
                      y={24}
                      textAnchor="middle"
                      fill="#f472b6"
                      fontWeight="700"
                      fontSize="12"
                    >
                      HuH6
                    </text>

                    <text
                      x={35}
                      y={40}
                      textAnchor="middle"
                      fill="#f472b6"
                      fontSize="11"
                    >
                      ({info.HuH6})
                    </text>
                  </g>
                );
              }}
              
            />

            <YAxis
              domain={[-1, 1]}
              ticks={[-1, -0.5, 0, 0.5, 1]}
              axisLine={{ stroke: "rgba(148,163,184,0.25)" }}
              tickLine={{ stroke: "rgba(148,163,184,0.25)" }}
              tick={{
                fill: "#94a3b8",
                fontSize: 12,
              }}
            />

            <Tooltip
              contentStyle={{
                background: "#0f172a",
                border: "1px solid rgba(148,163,184,0.2)",
                borderRadius: "12px",
                color: "#fff",
              }}
              labelStyle={{
                color: "#e2e8f0",
              }}
              formatter={(value) =>
                value !== null ? Number(value).toFixed(3) : "N/A"
              }
            />

            {/* Tedizolid Phosphate */}
            <Line
              type="monotone"
              dataKey="tedizolid-phosphate"
              stroke="#f87171"
              strokeWidth={3}
              dot={{
                r: 6,
                fill: "#f87171",
                stroke: "#fff",
                strokeWidth: 1,
              }}
              activeDot={{ r: 8 }}
            >
              <LabelList
                dataKey="tedizolid-phosphate"
                position="top"
                offset={10}
                formatter={(v) =>
                  v !== null ? Number(v).toFixed(2) : ""
                }
                style={{
                  fill: "#f87171",
                  fontWeight: 600,
                  fontSize: "12px",
                }}
              />
            </Line>

            {/* Cyclovirobuxin-d */}
            <Line
              type="monotone"
              dataKey="cyclovirobuxin-d"
              stroke="#4ade80"
              strokeWidth={3}
              dot={{
                r: 6,
                fill: "#4ade80",
                stroke: "#fff",
                strokeWidth: 1,
              }}
              activeDot={{ r: 8 }}
            >
              <LabelList
                dataKey="cyclovirobuxin-d"
                position="top"
                offset={10}
                formatter={(v) =>
                  v !== null ? Number(v).toFixed(2) : ""
                }
                style={{
                  fill: "#4ade80",
                  fontWeight: 600,
                  fontSize: "12px",
                }}
              />
            </Line>

            {/* UNBS-5162 */}
            <Line
              type="monotone"
              dataKey="UNBS-5162"
              stroke="#60a5fa"
              strokeWidth={3}
              dot={{
                r: 6,
                fill: "#60a5fa",
                stroke: "#fff",
                strokeWidth: 1,
              }}
              activeDot={{ r: 8 }}
            >
              <LabelList
                dataKey="UNBS-5162"
                position="top"
                offset={10}
                formatter={(v) =>
                  v !== null ? Number(v).toFixed(2) : ""
                }
                style={{
                  fill: "#60a5fa",
                  fontWeight: 600,
                  fontSize: "12px",
                }}
              />
            </Line>
          </LineChart>
        </ResponsiveContainer>
        <div
  style={{
    textAlign: "center",
    marginTop: "-20px",
    color: "#e2e8f0",
    fontWeight: 300,
    fontSize: "20px",
  }}
>
  Gene Expression
</div>
      </div>
    </div>
  );
}