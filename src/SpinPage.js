import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SpinPage.css";

import Skin1 from "./assets/Skin1.png";
import Skin2 from "./assets/Skin2.png";
import Skin3 from "./assets/Skin3.png";
import Skin4 from "./assets/Skin4.png";
import Skin5 from "./assets/Skin5.png";
import Skin6 from "./assets/Skin6.png";
import Skin7 from "./assets/Skin7.png";
import Skin8 from "./assets/Skin8.png";

const segments = [
  { img: Skin1 },
  { img: Skin2 },
  { img: Skin3 },
  { img: Skin4 },
  { img: Skin5 },
  { img: Skin6 },
  { img: Skin7 },
  { img: Skin8 },
];

const colors = [
  "#4dd0e1", // cyan
  "#2196f3", // blue
  "#ffb74d", // orange
  "#ff7043", // red-orange
  "#212121", // black
  "#43a047", // green
  "#e53935", // red
  "#ffd600", // yellow
];

const borderColor = "#d32f2f";
const borderWidth = 18;
const centerStroke = "#b8860b";
const pointerColor = "#ffb300";

const dummyWinners = [
  { name: "Rohit", reward: "M416 Glacier" },
  { name: "Priya", reward: "60 UC" },
  { name: "Aman", reward: "AKM Skin" },
  { name: "Simran", reward: "Outfit" },
  { name: "Vikas", reward: "Classic Crate" },
  { name: "Anjali", reward: "BP 5000" },
  { name: "Ravi", reward: "Silver 100" },
  { name: "Sneha", reward: "Rename Card" },
  { name: "Rohit", reward: "M416 Glacier" },
  { name: "Priya", reward: "60 UC" },
  { name: "Aman", reward: "AKM Skin" },
  { name: "Simran", reward: "Outfit" },
];

// clamp helper
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

export default function SpinPage() {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [size, setSize] = useState(320); // wheel size (px), responsive
  const wheelRef = useRef(null);
  const boxRef = useRef(null);
  const navigate = useNavigate();

  // ResizeObserver to make wheel responsive to container width
  useEffect(() => {
    if (!boxRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        // wheel size clamped for XS to XL screens
        setSize(Math.round(clamp(w, 220, 520)));
      }
    });
    ro.observe(boxRef.current);
    return () => ro.disconnect();
  }, []);

  const spin = () => {
    if (spinning || !wheelRef.current) return;
    setResult(null);
    setSpinning(true);

    const segCount = segments.length;
    const degreePer = 360 / segCount;
    const randomIndex = Math.floor(Math.random() * segCount);

    // final position = center of chosen segment under the pointer (top)
    const finalAngle = (360 - randomIndex * degreePer - degreePer / 2) % 360;
    const randomSpin = 360 * 5 + finalAngle; // 5 full rotations + landing angle

    wheelRef.current.style.transition = "transform 3s cubic-bezier(0.33, 1, 0.68, 1)";
    wheelRef.current.style.transform = `rotate(${randomSpin}deg)`;

    setTimeout(() => {
      setSpinning(false);
      setResult(segments[randomIndex]);
      // lock to exact angle without transition (so next spin starts clean)
      if (wheelRef.current) {
        wheelRef.current.style.transition = "none";
        wheelRef.current.style.transform = `rotate(${finalAngle}deg)`;
      }
    }, 3000);
  };

  function getArcPath(cx, cy, r, startAngle, endAngle) {
    const rad = Math.PI / 180;
    const x1 = cx + r * Math.cos(rad * startAngle);
    const y1 = cy + r * Math.sin(rad * startAngle);
    const x2 = cx + r * Math.cos(rad * endAngle);
    const y2 = cy + r * Math.sin(rad * endAngle);
    const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
    return [
      `M ${cx} ${cy}`,
      `L ${x1} ${y1}`,
      `A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`,
      "Z",
    ].join(" ");
  }

  // geometry from current size
  const center = size / 2;
  const radius = center - borderWidth;

  function getImagePos(i, r = radius * 0.62) {
    const step = 360 / segments.length;
    const angle = (step * i + step / 2 - 90) * (Math.PI / 180);
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    const deg = step * i + step / 2;
    return { x, y, deg };
  }

  // pointer geometry relative to wheel size
  const arrowHalfW = size * (18 / 320);
  const arrowH = size * (38 / 320);
  const pointerTopOffset = -arrowH * 0.95;
  const pointerDotR = size * (10 / 320);

  const imgSize = Math.round(size * 0.2); // keeps images proportional

  return (
    <div className="spin-bg" role="main" aria-label="BGMI Spin and Win Portal">
      <div className="spin-container">
        <h1 className="spin-title">BGMI Spin & Win</h1>
        <div className="spin-title-space" />

        <div
          className="wheel-svg-wrapper"
          ref={boxRef}
          aria-live="polite"
          aria-atomic="true"
        >
          {/* Pointer overlay (responsive) */}
          <svg
            width={size}
            height={Math.max(size * 0.18, 50)}
            className="wheel-pointer"
            aria-hidden="true"
            style={{
              position: "absolute",
              left: 0,
              top: pointerTopOffset,
              pointerEvents: "none",
              zIndex: 2,
            }}
          >
            <polygon
              points={`${center - arrowHalfW},0 ${center + arrowHalfW},0 ${center},${arrowH}`}
              fill={pointerColor}
              stroke="#fff"
              strokeWidth={Math.max(size * (3 / 320), 2)}
              filter="drop-shadow(0 2px 2px #0008)"
            />
            <circle
              cx={center}
              cy={0}
              r={pointerDotR}
              fill="#fffde7"
              stroke="#b8860b"
              strokeWidth={Math.max(size * (2 / 320), 1.6)}
            />
          </svg>

          <div
            className="wheel-svg"
            ref={wheelRef}
            style={{ width: size, height: size, margin: "0 auto" }}
          >
            <svg
              width={size}
              height={size}
              viewBox={`0 0 ${size} ${size}`}
              role="img"
              aria-label="Spin wheel with rewards"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Outer border */}
              <circle
                cx={center}
                cy={center}
                r={center - borderWidth / 2}
                fill={borderColor}
                stroke="#fff"
                strokeWidth={Math.max(size * (3 / 320), 2)}
              />

              {/* Colored segments */}
              {segments.map((seg, i) => {
                const start = (360 / segments.length) * i - 90;
                const end = start + 360 / segments.length;
                return (
                  <path
                    key={`seg-${i}`}
                    d={getArcPath(center, center, radius, start, end)}
                    fill={colors[i % colors.length]}
                    stroke="#fff"
                    strokeWidth={Math.max(size * (2 / 320), 1.5)}
                  />
                );
              })}

              {/* Reward images */}
              {segments.map((seg, i) => {
                const { x, y, deg } = getImagePos(i);
                return (
                  <image
                    key={`img-${i}`}
                    href={seg.img}
                    x={x - imgSize / 2}
                    y={y - imgSize / 2}
                    width={imgSize}
                    height={imgSize}
                    transform={`rotate(${-deg},${x},${y})`}
                    style={{ filter: "drop-shadow(0 2px 6px #0008)" }}
                  />
                );
              })}

              {/* Center button */}
              <defs>
                <radialGradient id="gold" cx="30%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#fffde7" />
                  <stop offset="70%" stopColor="#ffe082" />
                  <stop offset="100%" stopColor="#ffb300" />
                </radialGradient>
              </defs>
              <circle
                cx={center}
                cy={center}
                r={Math.max(size * (38 / 320), 26)}
                fill="url(#gold)"
                stroke={centerStroke}
                strokeWidth={Math.max(size * (6 / 320), 4)}
                filter="drop-shadow(0 0 8px #ffb30099)"
              />
            </svg>
          </div>
        </div>

        <button
          className="spin-btn"
          onClick={spin}
          disabled={spinning}
          aria-disabled={spinning}
          aria-live="polite"
          aria-busy={spinning}
        >
          {spinning ? "Spinning..." : "SPIN"}
        </button>

        {/* Result Popup */}
        {result && (
          <div
            className="popup-overlay"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="popup-title"
            aria-describedby="popup-desc"
          >
            <div className="popup-content">
              <h2 id="popup-title">Congratulations! 🎉</h2>
              <img src={result.img} alt="Prize" className="popup-img" />
              <button
                className="collect-btn"
                onClick={() => {
                  setResult(null);
                  navigate("/login");
                }}
                aria-label="Collect your reward"
              >
                Collect Reward
              </button>
            </div>
          </div>
        )}

        {/* Winners Marquee */}
        <div className="winners-marquee" role="region" aria-live="polite" aria-label="Recent winners">
          <div className="marquee-content">
            {dummyWinners.concat(dummyWinners).map((winner, idx) => (
              <span key={idx} className="winner-item">
                <b>{winner.name}</b> won <span>{winner.reward}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}