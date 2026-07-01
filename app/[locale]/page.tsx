'use client';

import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useState } from 'react';

import CityAlgorithmPicker from '@/components/CityAlgorithmPicker';
import AlgorithmPicker from '@/components/RouteOptions/AlgorithmPicker';
import DistancePicker from '@/components/RouteOptions/DistancePicker';
import GenerateButton from '@/components/RouteOptions/GenerateButton';
import LocationPicker from '@/components/RouteOptions/LocationPicker';
import { useMapStore } from '@/src/store/useMapStore';

const Map = dynamic(() => import('@/components/Map/Map'), { ssr: false });
const SingleRouteMap = dynamic(() => import('@/components/Map/SingleRouteMap'), { ssr: false });

export default function Home() {
  const t = useTranslations();
  const tHome = useTranslations('home');

  const start = useMapStore((s) => s.start);
  const distance = useMapStore((s) => s.distance);
  const setDistance = useMapStore((s) => s.setDistance);
  const setStart = useMapStore((s) => s.setStart);
  const setEnd = useMapStore((s) => s.setEnd);
  const algorithm = useMapStore((s) => s.algorithm);
  const setAlgorithm = useMapStore((s) => s.setAlgorithm);
  const getResult = useMapStore((s) => s.getResult);
  const [isGenerating, setIsGenerating] = useState(false);

  return (
    <div className="mx-auto container flex h-full w-full flex-col">
      <div
        className="w-full flex flex-col drop-shadow-lg items-center justify-center gap-2 mx-auto bg-cover bg-top bg-no-repeat p-8 text-white min-h-[800px]"
        style={{ backgroundImage: "url('/static/images/100_100.jpg')" }}
      >
        <h1 className="text-4xl font-bold text-center">{tHome('heroTitle')}</h1>
        <h2 className="text-xl text-center">{tHome('heroSubtitle')}</h2>
        <h3 className="text-base text-center leading-relaxed">{tHome('heroDescription')}</h3>
        <p className="text-base text-center leading-relaxed text-red-800">{tHome('warning')}</p>
      </div>
      <div className="mx-auto w-full mt-8">
        <Map />
        <CityAlgorithmPicker />
      </div>

      <div
        className="flex w-full mt-4 flex-col drop-shadow-lg items-center justify-center gap-2 mx-auto bg-cover bg-top bg-no-repeat p-8 text-white min-h-[800px]"
        style={{ backgroundImage: "url('/static/images/blue_green.jpg')" }}
      >
        <h2 className="text-xl text-center">{tHome('section2Title')}</h2>
        <h3 className="text-base text-center leading-relaxed">{tHome('section2Description')}</h3>
        <h4>{tHome('section2Note')}</h4>
      </div>
      <div className="mx-auto w-full mt-8">
        <SingleRouteMap />

        <div className="mt-4 px-2 space-y-4">
          <LocationPicker
            legend={t('routeOptions.locationPicker.start.label')}
            which="start"
            point={start}
            setPoint={setStart}
            setOtherPoint={setEnd}
          />
          <AlgorithmPicker
            legend={t('routeOptions.algorithmPicker.legend')}
            value={algorithm}
            onChange={setAlgorithm}
          />

          <DistancePicker legend={t('routeOptions.distance.legend')} value={distance} onChange={setDistance} />

          <GenerateButton
            label={t('routeOptions.generateButton.label')}
            loadingLabel={t('routeOptions.generateButton.loadingLabel')}
            loading={isGenerating}
            onClick={async () => {
              if (isGenerating) return;
              setIsGenerating(true);
              try {
                await getResult();
              } finally {
                setIsGenerating(false);
              }
            }}
          />
        </div>
      </div>
      <div className="mt-[200px]"></div>
    </div>
  );
}
