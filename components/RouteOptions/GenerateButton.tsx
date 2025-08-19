'use client';

import { faRoute, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMemo } from 'react';

type Props = {
  className?: string;
  label?: string; // domyślnie: "Generuj trasę"
  loadingLabel?: string; // domyślnie: "Generuję…"
  disabled?: boolean;
  loading?: boolean;
  progress?: number | null; // 0–100
  title?: string; // tooltip
  onClick: () => void;
  fullWidth?: boolean; // rozciągnij przycisk na całą szerokość
};

export default function GenerateButton({
  className,
  label = 'Generuj trasę',
  loadingLabel = 'Generuję…',
  disabled,
  loading,
  progress = null,
  title = 'Wygeneruj trasę',
  onClick,
  fullWidth = true,
}: Props) {
  // Uporządkuj progress
  const pct = useMemo(() => {
    if (progress == null || Number.isNaN(progress)) return null;
    return Math.min(100, Math.max(0, Math.round(progress)));
  }, [progress]);

  return (
    <div className={`space-y-2 ${className ?? ''}`}>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled || loading}
        aria-busy={!!loading}
        aria-live="polite"
        title={title}
        className={[
          'relative group inline-flex items-center justify-center gap-2',
          fullWidth ? 'w-full' : '',
          'px-4 py-2.5 rounded-xl border',
          'transition-transform duration-100 hover:border-zinc-700 active:translate-y-px',
          'dark:bg-zinc-900',
          disabled || loading ? 'opacity-60 cursor-not-allowed' : '',
        ].join(' ')}
      >
        {loading ? (
          <>
            <FontAwesomeIcon icon={faSpinner} spin size="sm" />
            <span className="font-medium">{loadingLabel}</span>
          </>
        ) : (
          <>
            <FontAwesomeIcon icon={faRoute} size="sm" />
            <span className="font-medium">{label}</span>
          </>
        )}
        {typeof pct === 'number' && <span className="text-xs text-zinc-500 ml-1">{pct}%</span>}
      </button>

      {typeof pct === 'number' && (
        <div
          role="progressbar"
          aria-label="Postęp generowania trasy"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={pct}
          className="h-2 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden"
        >
          <div
            className="h-full bg-indigo-500/70 dark:bg-indigo-400/80 transition-[width] duration-200 ease-out"
            style={{ width: pct + '%' }}
          />
        </div>
      )}
    </div>
  );
}

/*
Przykład użycia:

import { useState } from 'react';
import RouteGenerateButton from './RouteGenerateButton';

export default function Example() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setProgress(0);
    // symulacja progresu
    const id = setInterval(() => setProgress((p) => (p == null || p >= 100 ? 0 : p + 10)), 200);
    try {
      // tutaj zawołaj swoją logikę generowania tras (A*, DFS, losowy itp.)
      // await generateRoutes();
    } finally {
      clearInterval(id);
      setProgress(100);
      setTimeout(() => { setLoading(false); setProgress(null); }, 300);
    }
  };

  return (
    <div className="max-w-sm">
      <RouteGenerateButton
        loading={loading}
        progress={progress}
        onClick={handleGenerate}
      />
    </div>
  );
}
*/
