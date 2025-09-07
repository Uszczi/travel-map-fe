'use client';

import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

export type LabeledSwitchProps = {
  label: string;
  checked: boolean;
  description?: string;
  className?: string;
  disabled?: boolean;
  onChange: (next: boolean) => void;
};

export default function LabeledSwitch({
  label,
  checked,
  onChange,
  description,
  className,
  disabled,
}: LabeledSwitchProps) {
  const t = useTranslations();
  const title = useMemo(
    () => `${label} – ${checked ? t('common_LabeledSwitch_on') : t('common_LabeledSwitch_off')}`,
    [label, checked, t],
  );

  return (
    <div
      role="group"
      aria-label={label}
      className={['w-full rounded-xl border p-3 dark:bg-zinc-900', className ?? ''].join(' ')}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-semibold">{label}</div>
          {description && <div className="text-xs text-zinc-500">{description}</div>}
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={checked}
          title={title}
          disabled={disabled}
          onClick={() => !disabled && onChange(!checked)}
          className={[
            'relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border',
            'transition-colors duration-150 focus-visible:outline-none',
            'focus-visible:ring-2 focus-visible:ring-indigo-400/40',
            checked
              ? 'border-indigo-500 bg-indigo-500/10 ring-1 ring-inset ring-indigo-500'
              : 'bg-zinc-200 dark:bg-zinc-700 border-zinc-300 dark:border-zinc-600',
            disabled ? 'opacity-60 cursor-not-allowed' : 'hover:border-zinc-700',
          ].join(' ')}
        >
          <span
            aria-hidden
            className={[
              'absolute top-1 left-1 h-5 w-5 rounded-full border',
              'bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-600',
              'transition-transform duration-150',
              checked ? 'translate-x-5' : '',
            ].join(' ')}
          />
        </button>
      </div>
    </div>
  );
}
