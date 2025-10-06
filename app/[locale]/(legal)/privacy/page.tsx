'use client';

import { useTranslations } from 'next-intl';

export default function PrivacyPage() {
  const t = useTranslations('legal.privacy');
  const sections: { key: string; id: string }[] = [
    { key: 'admin', id: 'admin' },
    { key: 'dataCategories', id: 'data-categories' },
    { key: 'purposes', id: 'purposes' },
    { key: 'legalBases', id: 'legal-bases' },
    { key: 'retention', id: 'retention' },
    { key: 'recipients', id: 'recipients' },
    { key: 'transfers', id: 'transfers' },
    { key: 'rights', id: 'rights' },
    { key: 'cookies', id: 'cookies' },
    { key: 'security', id: 'security' },
    { key: 'changes', id: 'changes' },
    { key: 'contact', id: 'contact' },
  ];

  return (
    <main className="min-h-dvh">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">{t('intro')}</p>

        <nav aria-label={t('toc')} className="mt-6">
          <ul className="space-y-2 text-sm">
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="hover:underline text-zinc-700 dark:text-zinc-300">
                  {t(`sections.${s.key}`)}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {sections.map(({ key, id }) => {
          const paras = t.raw(`text.${key}`) as string[];
          return (
            <section key={id} id={id} className="scroll-mt-20">
              <h2 className="mt-10 text-xl font-semibold tracking-tight">{t(`sections.${key}`)}</h2>
              {Array.isArray(paras) ? (
                <div className="mt-2 space-y-3 text-zinc-700 dark:text-zinc-300">
                  {paras.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-zinc-700 dark:text-zinc-300">{t(`text.${key}`)}</p>
              )}
            </section>
          );
        })}

        <p className="mt-10 text-sm text-zinc-500 dark:text-zinc-400">{t('lastUpdated')}</p>
      </div>
    </main>
  );
}
