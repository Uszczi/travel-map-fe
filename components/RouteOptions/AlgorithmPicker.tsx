import React, { useEffect, useState } from 'react';

import type { Algorithm } from '@/components/types';

import './AlgorithmPicker.css';

type Props = {
  value?: Algorithm;
  onChange?: (algo: Algorithm) => void;
  className?: string;
};

const TreeIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
    <circle cx="12" cy="5" r="2" />
    <circle cx="6" cy="18" r="2" />
    <circle cx="18" cy="18" r="2" />
    <path d="M12 7v5M12 12L7 16M12 12l5 4" fill="none" stroke="currentColor" strokeWidth="1.75" />
  </svg>
);

const StarIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
    <path d="M12 3l2.7 5.6 6.2.9-4.5 4.4 1.1 6.1L12 17.8 6.5 20l1.1-6.1L3 9.5l6.3-.9L12 3z" />
  </svg>
);

const ShuffleIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
    <path
      d="M16 3h5v5M3 7h6c2 0 3 1 4 3s2 3 4 3h4M21 16v5h-5M3 17h6c2 0 3-1 4-3"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
    />
  </svg>
);

export const AlgorithmPicker: React.FC<Props> = ({ value = 'astar', onChange, className }) => {
  const [selected, setSelected] = useState<Algorithm>(value);
  useEffect(() => setSelected(value), [value]);

  const items: { key: Algorithm; label: string; tooltip: string; Icon: React.FC }[] = [
    { key: 'dfs', label: 'DFS', tooltip: 'DFS — przeszukiwanie w głąb', Icon: TreeIcon },
    { key: 'astar', label: 'A*', tooltip: 'A* — algorytm A-star (heurystyczny)', Icon: StarIcon },
    { key: 'random', label: 'Losowy', tooltip: 'Losowy — eksploracja/perturbacje', Icon: ShuffleIcon },
  ];

  const cycle = (dir: 1 | -1) => {
    const idx = items.findIndex((i) => i.key === selected);
    const next = items[(idx + dir + items.length) % items.length].key;
    setSelected(next);
    onChange?.(next);
  };

  return (
    <div className={`algo-card ${className ?? ''}`}>
      <div className="algo-title">Algorytm</div>

      <div
        className="algo-buttons"
        role="radiogroup"
        aria-label="Wybór algorytmu"
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') {
            e.preventDefault();
            cycle(1);
          }
          if (e.key === 'ArrowLeft') {
            e.preventDefault();
            cycle(-1);
          }
        }}
      >
        {items.map(({ key, label, tooltip, Icon }) => (
          <button
            key={key}
            type="button"
            role="radio"
            aria-checked={selected === key}
            aria-label={label}
            className={`algo-btn ${selected === key ? 'is-active' : ''}`}
            onClick={() => {
              setSelected(key);
              onChange?.(key);
            }}
          >
            <Icon />
            <span aria-hidden="true" className="algo-badge">
              {label}
            </span>
            <span className="tooltip" role="tooltip">
              {tooltip}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AlgorithmPicker;
