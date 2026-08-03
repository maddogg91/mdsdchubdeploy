import React from 'react';

const base = {
  width: 28,
  height: 28,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round'
};

export function StorefrontIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M3 9.5 4.5 4h15L21 9.5" />
      <path d="M3 9.5a2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0" />
      <path d="M5 11v9h14v-9" />
      <path d="M10 20v-5.5a2 2 0 0 1 2-2 2 2 0 0 1 2 2V20" />
    </svg>
  );
}

export function CameraIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
      <circle cx="12" cy="13" r="3.5" />
      <path d="M18 10.5h.01" />
    </svg>
  );
}

export function RocketIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M13.5 3.5c3 0 6 3 6 6-2 3-4 4.5-6.5 6L9.5 19 5 14.5l3.5-3.5c1.5-2.5 3-4.5 5-6Z" />
      <circle cx="14.5" cy="8.5" r="1.4" />
      <path d="M8.5 15.5 5 19M4 20l1.2-3.2M4 20l3.2-1.2" />
    </svg>
  );
}

export function CodeIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="m9 8-4 4 4 4" />
      <path d="m15 8 4 4-4 4" />
      <path d="m13 5-2 14" />
    </svg>
  );
}

export function LayersIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3 3 8l9 5 9-5-9-5Z" />
      <path d="m3 12 9 5 9-5" />
      <path d="m3 16 9 5 9-5" />
    </svg>
  );
}

export function CompassIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m14.5 9.5-2 5-3-1.5 2-5 3 1.5Z" />
    </svg>
  );
}
