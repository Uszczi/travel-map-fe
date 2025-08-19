'use client';

import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useMemo, useState } from 'react';

type Props = {
  className?: string;
  legend: string;
  value: number;
  onChange: (km: number) => void;
  min?: number;
  max?: number;
  step?: number;
  presets?: number[];
};

export default function DistancePicker({
  className,
  legend,
  value,
  onChange,
  min = 3,
  max = 50,
  step = 1,
  presets,
}: Props) {
  const chips = useMemo(() => presets ?? [3, 5, 10, 15, 20, 30], [presets]);

  const clamp = (n: number) => Math.min(max, Math.max(min, n));
  const toStep = (n: number) => Math.round(n / step) * step;
  const set = (n: number) => onChange(clamp(toStep(n)));

  const dec = () => set(value - step);
  const inc = () => set(value + step);

  const current = clamp(value);

  const [text, setText] = useState(String(current));
  useEffect(() => {
    setText(String(current));
  }, [current]);

  return (
    <div
      role="group"
      aria-label={legend}
      className={`w-full rounded-xl border p-3 dark:bg-zinc-900 space-y-3 ${className ?? ''}`}
    >
      <div className="space-y-2">
        <div className="flex items-end justify-between">
          <div className="space-y-0.5">
            <div className="text-sm font-semibold">{legend}</div>
            <div className="text-xs text-zinc-500">
              {min}–{max} km
            </div>
          </div>
        </div>
      </div>

      {/* Główna kontrolka: suwak + licznik + +/- */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={dec}
          disabled={value <= min}
          title={`- ${step} km`}
          className={[
            'relative inline-flex items-center justify-center px-3 py-2.5 rounded-xl border',
            'transition-transform duration-100 hover:border-zinc-700 active:translate-y-px',
            value <= min ? 'opacity-60 cursor-not-allowed' : '',
          ].join(' ')}
          aria-label={`Zmniejsz o ${step} km`}
        >
          <FontAwesomeIcon icon={faMinus} size="sm" />
        </button>

        <div className="flex-1 flex items-center gap-3">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={current}
            onChange={(e) => set(Number(e.target.value))}
            aria-label="Wybór odległości w kilometrach"
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={current}
            aria-valuetext={`${current} kilometrów`}
            className="w-full h-2 rounded-lg appearance-none bg-zinc-200 dark:bg-zinc-700 cursor-pointer"
          />

          <div className="relative w-36">
            <input
              min={min}
              max={max}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onBlur={() => {
                const raw = text.trim();
                if (raw === '') {
                  set(min);
                  setText(String(min));
                  return;
                }
                const n = parseFloat(raw.replace(',', '.'));
                if (Number.isFinite(n)) {
                  set(n);
                }
                setText(String(current));
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  (e.currentTarget as HTMLInputElement).blur();
                } else if (e.key === 'Escape') {
                  setText(String(current));
                  (e.currentTarget as HTMLInputElement).blur();
                }
              }}
              aria-label="Wpisz odległość w km"
              className="w-full rounded-lg border dark:bg-zinc-700 px-3 py-2 pr-10 text-sm outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/40"
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-zinc-500 select-none">km</span>
          </div>
        </div>

        <button
          type="button"
          onClick={inc}
          disabled={value >= max}
          title={`+ ${step} km`}
          className={[
            'relative inline-flex items-center justify-center px-3 py-2.5 rounded-xl border',
            'transition-transform duration-100 hover:border-zinc-700 active:translate-y-px',
            value >= max ? 'opacity-60 cursor-not-allowed' : '',
          ].join(' ')}
          aria-label={`Zwiększ o ${step} km`}
        >
          <FontAwesomeIcon icon={faPlus} size="sm" />
        </button>
      </div>

      <div className="flex gap-2">
        {chips.map((km) => {
          const active = km === current;
          return (
            <button
              key={km}
              type="button"
              aria-pressed={active}
              onClick={() => set(km)}
              className={[
                'px-2.5 py-1.5 rounded-xl text-sm border transition-colors',
                'hover:border-zinc-700 shrink-0',
                active ? 'border-indigo-500 ring-1 ring-inset ring-indigo-500' : '',
              ].join(' ')}
              title={`${km} km`}
            >
              {km} km
            </button>
          );
        })}
      </div>
    </div>
  );
}
