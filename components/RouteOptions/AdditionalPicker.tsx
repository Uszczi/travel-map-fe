'use client';

import React from 'react';

type Props = {
  className?: string;
  legend?: string;
  preferNewRoads: boolean;
  setPreferNewRoads: (value: boolean) => void;
};

export default function AdditionalPicker({
  className,
  legend,
  preferNewRoads,
  setPreferNewRoads,
}: Props) {
  const checkboxId = 'prefer-new-roads';
  const hintId = 'prefer-new-roads-hint';

  return (
    <div
      role="group"
      aria-label={legend}
      className={[
        'w-full rounded-xl border p-3 dark:bg-zinc-900 space-y-3',
        'focus-within:ring-2 focus-within:ring-indigo-400/40',
        className ?? '',
      ].join(' ')}
    >
      <div className="text-sm font-semibold">{legend}</div>

      <div className="space-y-2">
        <label htmlFor={checkboxId} className="flex items-start gap-3 cursor-pointer select-none">
          <input
            id={checkboxId}
            type="checkbox"
            className="mt-0.5 h-4 w-4 rounded border dark:bg-zinc-700 outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/40"
            checked={preferNewRoads}
            onChange={(e) => setPreferNewRoads(e.target.checked)}
            aria-describedby={hintId}
          />

          <div>
            <div className="font-medium">Preferuj nowe drogi</div>
            <p id={hintId} className="text-sm text-zinc-500 dark:text-zinc-400">
              Podczas wyznaczania trasy staraj się unikać wcześniej odwiedzone drogi.
            </p>
          </div>
        </label>
      </div>
    </div>
  );
}
