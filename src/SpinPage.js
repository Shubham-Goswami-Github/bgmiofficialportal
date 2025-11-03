import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SpinPage.css";

import Skin1 from "./assets/Skin1.png";
import Skin2 from "./assets/Skin2.png";
import Skin3 from "./assets/Skin3.png";
import bgmiLogo from "./assets/bgmi-logo.png";

const segments = [
  { img: Skin1, name: "M416 Glacier", desc: "Mythic Gun Skin" },
  { img: Skin2, name: "Crimson Set", desc: "Exclusive BGMI Outfit" },
  { img: Skin3, name: "60 UC", desc: "In-game Currency" },
];

const colors = [
  "url(#seg1)", // Neon blue-green
  "url(#seg2)", // Neon pink-purple
  "url(#seg3)", // Neon yellow-orange
];

const dummyWinners = [
  { name: "Rohit", reward: "M416 Glacier" },
  { name: "Priya", reward: "60 UC" },
  { name: "Aman", reward: "Crimson Set" },
  { name: "Simran", reward: "60 UC" },
  { name: "Vikas", reward: "M416 Glacier" },
  { name: "Anjali", reward: "Crimson Set" },
  { name: "Ravi", reward: "60 UC" },
  { name: "Sneha", reward: "M416 Glacier" },
];

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

export default function SpinPage() {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [size, setSize] = useState(340);
  const wheelRef = useRef(null);
  const boxRef = useRef(null);
  const navigate = useNavigate();

  // Responsive wheel size
  useEffect(() => {
    if (!boxRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        setSize(Math.round(clamp(w * 0.8, 220, 400)));
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

    const finalAngle = (360 - randomIndex * degreePer - degreePer / 2) % 360;
    const randomSpin = 360 * 4 + finalAngle;

    wheelRef.current.style.transition = "transform 2.2s cubic-bezier(0.33, 1, 0.68, 1)";
    wheelRef.current.style.transform = `rotate(${randomSpin}deg)`;

    setTimeout(() => {
      setSpinning(false);
      setResult(segments[randomIndex]);
      if (wheelRef.current) {
        wheelRef.current.style.transition = "none";
        wheelRef.current.style.transform = `rotate(${finalAngle}deg)`;
      }
    }, 2200);
  };

  // SVG helpers
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

  const borderWidth = 18;
  const center = size / 2;
  const radius = center - borderWidth;
  const pointerW = size * 0.13;
  const pointerH = size * 0.09;
  const pointerTopOffset = -pointerH * 1.1;
  const imgSize = Math.round(size * 0.22);

  return (
    <div className="spin-main-bg">
      <div className="spin-flexbox">
        {/* LEFT: WHEEL & INFO */}
        <div className="spin-main" ref={boxRef}>
          <div className="spin-header">
            <img src={bgmiLogo} alt="BGMI" />
            <span>BGMI Spin &amp; Win</span>
          </div>
          <div className="spin-subtitle">
            <span>Spin the wheel and win exclusive BGMI rewards!</span>
          </div>
          <div className="spin-rewards">
            {segments.map((seg, i) => (
              <div className="spin-reward-card" key={i}>
                <img src={seg.img} alt={seg.name} />
                <div>
                  <b>{seg.name}</b>
                  <span>{seg.desc}</span>
                </div>
              </div>
            ))}
          </div>
          {!spinning && !result && (
            <div className="tap-spin-badge">
              <span>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{marginRight: 6, verticalAlign: "middle"}}>
                  <circle cx="12" cy="12" r="10" stroke="#ffb300" strokeWidth="2.5" fill="#232526"/>
                  <path d="M12 7v6l4 2" stroke="#ffb300" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Tap to Spin!
              </span>
            </div>
          )}
          <div className="spin-title-space" />
          <div className="wheel-svg-wrapper">
            {/* Pointer */}
            <svg
              width={size}
              height={pointerH * 2}
              className="wheel-pointer"
              aria-hidden="true"
              style={{
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
                top: pointerTopOffset,
                pointerEvents: "none",
                zIndex: 2,
              }}
            >
              <g>
                <polygon
                  points={`${center - pointerW / 2},0 ${center + pointerW / 2},0 ${center},${pointerH}`}
                  fill="#fff"
                  stroke="#ffb300"
                  strokeWidth="3"
                  filter="drop-shadow(0 2px 6px #ffb30099)"
                />
                <polygon
                  points={`${center - pointerW / 2 + 6},8 ${center + pointerW / 2 - 6},8 ${center},${pointerH - 6}`}
                  fill="#ffb300"
                  opacity="0.85"
                />
                <rect
                  x={center - 2}
                  y={pointerH * 0.2}
                  width="4"
                  height={pointerH * 0.5}
                  rx="2"
                  fill="#fff"
                  opacity="0.7"
                >
                  <animate attributeName="opacity" values="0.7;0.1;0.7" dur="1.2s" repeatCount="indefinite" />
                </rect>
              </g>
            </svg>
            {/* Wheel */}
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
                {/* Gradients for segments */}
                <defs>
                  <linearGradient id="seg1" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#00ffe7" />
                    <stop offset="100%" stopColor="#00c3ff" />
                  </linearGradient>
                  <linearGradient id="seg2" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#ff00cc" />
                    <stop offset="100%" stopColor="#3333ff" />
                  </linearGradient>
                  <linearGradient id="seg3" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#ffe259" />
                    <stop offset="100%" stopColor="#ffa751" />
                  </linearGradient>
                  <radialGradient id="gold" cx="30%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#fffde7" />
                    <stop offset="70%" stopColor="#ffe082" />
                    <stop offset="100%" stopColor="#ffb300" />
                  </radialGradient>
                </defs>
                {/* Segments */}
                {segments.map((seg, i) => {
                  const start = (360 / segments.length) * i - 90;
                  const end = start + 360 / segments.length;
                  return (
                    <path
                      key={`seg-${i}`}
                      d={getArcPath(center, center, radius, start, end)}
                      fill={colors[i % colors.length]}
                      stroke="#222"
                      strokeWidth={2}
                      style={{ opacity: 0.97, filter: "drop-shadow(0 0 12px #00ffe7aa)" }}
                    />
                  );
                })}
                {/* Images */}
                {segments.map((seg, i) => {
                  const step = 360 / segments.length;
                  const angle = step * i + step / 2;
                  const rad = (angle - 90) * (Math.PI / 180);
                  const x = center + (radius * 0.7) * Math.cos(rad);
                  const y = center + (radius * 0.7) * Math.sin(rad);
                  return (
                    <image
                      key={i}
                      href={seg.img}
                      x={x - imgSize / 2}
                      y={y - imgSize / 2}
                      width={imgSize}
                      height={imgSize}
                      transform={`rotate(${-angle},${x},${y})`}
                      style={{ filter: "drop-shadow(0 2px 6px #0008)" }}
                    />
                  );
                })}
                {/* Center */}
                <circle
                  cx={center}
                  cy={center}
                  r={Math.max(size * (38 / 320), 20)}
                  fill="url(#gold)"
                  stroke="#ffb300"
                  strokeWidth={Math.max(size * (6 / 320), 3)}
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
            {spinning ? (
              <span>
                <span className="spin-loader"></span> Spinning...
              </span>
            ) : (
              "SPIN NOW"
            )}
          </button>
          {result && (
            <div className="popup-overlay">
              <div className="popup-content">
                <h2>Congratulations! 🎉</h2>
                <img src={result.img} alt="Prize" className="popup-img" />
                <div className="popup-reward-name">{result.name}</div>
                <div className="popup-reward-desc">{result.desc}</div>
                <button
                  className="collect-btn"
                  onClick={() => {
                    setResult(null);
                    navigate("/login");
                  }}
                >
                  Collect Reward
                </button>
              </div>
            </div>
          )}
          <div className="spin-footer">
            <span>
              <b>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{verticalAlign:"middle",marginRight:4}}>
                  <circle cx="12" cy="12" r="10" stroke="#ffb300" strokeWidth="2" fill="#232526"/>
                  <path d="M8 12l2 2l4-4" stroke="#ffb300" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Note:
              </b>{" "}
              This is an official BGMI event. Rewards will be credited directly to your BGMI account.
            </span>
          </div>
        </div>
        {/* RIGHT: WINNERS */}
        <div className="spin-winners">
          <h4 className="winner-head">Live Winners</h4>
          <div className="winner-box">
            <div className="winner-scroll">
              {dummyWinners.concat(dummyWinners).map((w, i) => (
                <div className="winner-item" key={i}>
                  <span className="badge">{w.reward}</span>
                  <b>{w.name}</b>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}