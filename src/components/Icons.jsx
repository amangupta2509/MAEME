import React from "react";

export const Icon = ({
  d,
  size = 20,
  stroke = "currentColor",
  fill = "none",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    stroke={stroke}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={d} />
  </svg>
);

export const icons = {
  flame: (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="#cc5500"
      stroke="none"
    >
      <path d="M12 2c1 4-4 6-4 10a6 6 0 0012 0c0-4-3-5-3-8-1 1-3 2-3 0s-1-3-2-2z" />
    </svg>
  ),
  dashboard: <Icon d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />,
  reports: (
    <Icon d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM14 2v6h6M16 13H8M16 17H8M10 9H8" />
  ),
  charts: <Icon d="M18 20V10M12 20V4M6 20v-6" />,
  history: <Icon d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
  settings: <Icon d="M12 15a3 3 0 100-6 3 3 0 000 6z" />,
  logout: (
    <Icon d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
  ),
  bell: (
    <Icon d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
  ),
  chat: (
    <Icon d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" />
  ),
  upload: (
    <Icon d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
  ),
  send: <Icon d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />,
  close: <Icon d="M18 6L6 18M6 6l12 12" />,
  chevL: <Icon d="M15 18l-6-6 6-6" size={16} />,
  chevR: <Icon d="M9 18l6-6-6-6" size={16} />,
  arrowUp: <Icon d="M12 19V5M5 12l7-7 7 7" size={14} />,
  robot: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <circle cx="12" cy="5" r="2" />
      <line x1="12" y1="7" x2="12" y2="11" />
      <circle cx="8" cy="16" r="1" fill="currentColor" />
      <circle cx="16" cy="16" r="1" fill="currentColor" />
    </svg>
  ),
  dna: (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#cc5500"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 15c6.667-6 13.333 0 20-6" />
      <path d="M9 22c1.798-1.998 2.518-3.995 2.807-5.993" />
      <path d="M15 2c-1.798 1.998-2.518 3.995-2.807 5.993" />
      <path d="M17 6l-2.5 2.5" />
      <path d="M14 8l-1 1" />
      <path d="M7 18l2.5-2.5" />
      <path d="M3.5 14.5l.5-.5" />
      <path d="M20 9l.5-.5" />
      <path d="M2 9c6.667 6 13.333 0 20 6" />
    </svg>
  ),
  moon: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#cc5500"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  ),
  chevDown: <Icon d="M6 9l6 6 6-6" size={16} />,
  clipboard: (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#cc5500"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" />
    </svg>
  ),
};
