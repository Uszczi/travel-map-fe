import { useTranslations } from 'next-intl';

export default function Page() {
  const t = useTranslations();
  return <h1 className="text-3xl font-semibold">{t('homepagetitle')}</h1>;
}
