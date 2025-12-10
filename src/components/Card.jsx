import React, { useState } from "react";
import "../styles/dashboard.css";

function Card({ country, cases, deaths, recovered, flag, advisoryText, advisoryScore, onEdit, onDelete }) {
  const [showAdvisory, setShowAdvisory] = useState(false);

  const score = advisoryScore && !isNaN(advisoryScore)
    ? Number(advisoryScore)
    : null;

  const flagUrl =
    flag ||
    `https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/480px-No_image_available.svg.png`;

  function getBorderColor() {
    if (score === null) return "gray";
    if (score < 2) return "green";
    if (score < 3) return "orange";
    return "red";
  }

  return (
    <div className="card" style={{ borderColor: getBorderColor() }}>
      <img
        src={flagUrl}
        alt={`${country} flag`}
        onError={(e) => {
          e.target.src =
            "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/480px-No_image_available.svg.png";
        }}
      />

      <h2>{country}</h2>

      <div className="stats">
        <p><strong>Cases:</strong> {cases ?? "N/A"}</p>
        <p><strong>Deaths:</strong> {deaths ?? "N/A"}</p>
        <p><strong>Recovered:</strong> {recovered ?? "N/A"}</p>
      </div>

      <button
        onClick={() => setShowAdvisory(!showAdvisory)}
        className="advisory-btn"
      >
        {showAdvisory ? "Hide Advisory" : "Show Travel Advisory"}
      </button>

      {showAdvisory && (
        <div className="advisory-box">
          <p><strong>Advisory Score:</strong> {score !== null ? score : "N/A"}</p>
          <p>{advisoryText || "No travel advisory available."}</p>
        </div>
      )}

      <div style={{ marginTop: 10, display: "flex", justifyContent: "center", gap: 8 }}>
        {onEdit && <button className="primary-btn" onClick={onEdit}>Edit</button>}
        {onDelete && <button className="save-btn" onClick={onDelete}>Delete</button>}
      </div>
    </div>
  );
}

export default Card;
