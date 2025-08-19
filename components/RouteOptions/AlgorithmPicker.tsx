import React, { useEffect, useState } from 'react';

import type { Algorithm } from '@/components/types';

type Props = {
  value?: Algorithm;
  onChange?: (algo: Algorithm) => void;
  className?: string;
};

const TreeIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" className="block">
    <circle cx="12" cy="5" r="2" />
    <circle cx="6" cy="18" r="2" />
    <circle cx="18" cy="18" r="2" />
    <path d="M12 7v5M12 12L7 16M12 12l5 4" fill="none" stroke="currentColor" strokeWidth="1.75" />
  </svg>
);

const StarIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" className="block">
    <path d="M12 3l2.7 5.6 6.2.9-4.5 4.4 1.1 6.1L12 17.8 6.5 20l1.1-6.1L3 9.5l6.3-.9L12 3z" />
  </svg>
);

const ShuffleIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" className="block">
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
    <div className={`w-full rounded-xl border p-3 bg-white dark:bg-zinc-900 ${className ?? ''}`}>
      <div className="text-sm font-semibold mb-2.5">Algorytm</div>

      <div
        className="flex gap-2"
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
        {items.map(({ key, label, tooltip, Icon }) => {
          const isActive = selected === key;
          return (
            <button
              key={key}
              type="button"
              role="radio"
              aria-checked={isActive}
              aria-label={label}
              onClick={() => {
                setSelected(key);
                onChange?.(key);
              }}
              className={[
                'relative group inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl min-w-14',
                'border border-zinc-800 cursor-pointer outline-none',
                'transition-transform duration-100 hover:border-zinc-700 active:translate-y-px',
                'dark:bg-zinc-700',
                'focus-visible:ring-2 focus-visible:ring-indigo-400/40 focus-visible:ring-offset-0',
                // active state
                isActive ? 'border-indigo-500 ring-1 ring-inset ring-indigo-500' : '',
              ].join(' ')}
            >
              <Icon />
              <span aria-hidden="true" className="text-[13px] opacity-90">
                {label}
              </span>

              <span
                role="tooltip"
                className="pointer-events-none absolute left-24 bottom-full mb-2 -translate-x-1/2 whitespace-nowrap rounded-md border border-zinc-800 bg-zinc-900 px-2 py-1.5 text-xs text-zinc-200 opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100 z-40"
              >
                {tooltip}
                <span className="absolute top-full left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1 rotate-45 bg-zinc-900 border-r border-b border-zinc-800" />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AlgorithmPicker;
