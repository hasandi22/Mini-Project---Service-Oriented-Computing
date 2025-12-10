import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ChartComponent = ({ data }) => {
  // data expected to be an array of records (e.g., records from DB)
  const items = Array.isArray(data) ? data : [];

  if (!items || items.length === 0) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <h3>No data available for chart</h3>
      </div>
    );
  }

  const labels = items.map((c) => c.country ?? "Unknown");

  const chartData = {
    labels,
    datasets: [
      {
        label: "Cases",
        data: items.map((c) => Number(c.covid?.cases ?? 0)),
        borderColor: "#1e90ff",
        tension: 0.3,
        borderWidth: 2,
        fill: false
      },
      {
        label: "Deaths",
        data: items.map((c) => Number(c.covid?.deaths ?? 0)),
        borderColor: "#ff4d4d",
        tension: 0.3,
        borderWidth: 2,
        fill: false
      },
      {
        label: "Recovered",
        data: items.map((c) => Number(c.covid?.recovered ?? 0)),
        borderColor: "#28a745",
        tension: 0.3,
        borderWidth: 2,
        fill: false
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "bottom"
      },
      title: {
        display: true,
        text: "COVID-19 Cases, Deaths & Recoveries",
        font: { size: 18 }
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <div className="chart-container">
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default ChartComponent;
