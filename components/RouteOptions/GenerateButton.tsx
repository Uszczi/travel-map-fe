'use client';

import { faRoute, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type Props = {
  className?: string;
  legend?: string;
  loadingLegend?: string;
  disabled?: boolean;
  loading?: boolean;
  title?: string; // tooltip
  onClick: () => void;
  fullWidth?: boolean;
};

export default function GenerateButton({
  className,
  legend = 'Generuj trasę',
  loadingLegend = 'Generuję…',
  disabled,
  loading,
  title = 'Wygeneruj trasę',
  onClick,
  fullWidth = true,
}: Props) {
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
            <FontAwesomeIcon icon={faSpinner} className="text-sm" />
            <span className="font-medium">{loadingLegend}</span>
          </>
        ) : (
          <>
            <FontAwesomeIcon icon={faRoute} className="text-sm" />
            <span className="font-medium">{legend}</span>
          </>
        )}
      </button>
    </div>
  );
}
