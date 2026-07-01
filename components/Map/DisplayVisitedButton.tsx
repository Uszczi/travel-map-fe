'use client';

import { useTranslations } from 'next-intl';

import { useMapStore } from '@/src/store/useMapStore';

import LabeledSwitch from '../Common/LabeledSwitch';

export default function DisplayVistedButton() {
  const t = useTranslations('map.displayVisitedButton');

  const displayVisited = useMapStore((s) => s.visitedRoutes.display);
  const toggleDisplay = useMapStore((s) => s.toggleDisplay);

  return (
    <div className="mt-2 ml-2 max-w-80">
      <LabeledSwitch label={t('label')} checked={displayVisited} onChange={toggleDisplay} />
    </div>
  );
}
