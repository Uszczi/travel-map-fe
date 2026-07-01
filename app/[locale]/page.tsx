'use client';

import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useState } from 'react';

import CityAlgorithmPicker from '@/components/CityAlgorithmPicker';
import AlgorithmPicker from '@/components/RouteOptions/AlgorithmPicker';
import GenerateButton from '@/components/RouteOptions/GenerateButton';
import LocationPicker from '@/components/RouteOptions/LocationPicker';
import { useMapStore } from '@/src/store/useMapStore';

const Map = dynamic(() => import('@/components/Map/Map'), { ssr: false });
const SingleRouteMap = dynamic(() => import('@/components/Map/SingleRouteMap'), { ssr: false });

export default function Home() {
  const t = useTranslations();

  const start = useMapStore((s) => s.start);
  const setStart = useMapStore((s) => s.setStart);
  const setEnd = useMapStore((s) => s.setEnd);
  const algorithm = useMapStore((s) => s.algorithm);
  const setAlgorithm = useMapStore((s) => s.setAlgorithm);
  const getResult = useMapStore((s) => s.getResult);
  const [isGenerating, setIsGenerating] = useState(false);

  return (
    <div className="flex h-full w-full flex-col">
      <div
        className="flex flex-col drop-shadow-lg items-center justify-center gap-2 mx-auto bg-cover bg-top bg-no-repeat p-8 text-white min-h-[800px]"
        style={{ backgroundImage: "url('/static/images/100_100.jpg')" }}
      >
        <h1 className="text-4xl font-bold text-center">Visit every street in selected city.</h1>
        <h2 className="text-xl text-center">This is a demo app for my exploration of graph algorithms and maps.</h2>
        <h3 className="text-base text-center leading-relaxed">
          Select a city from the list below. See how you could run through all the streets in the city.
        </h3>
      </div>
      <div className="mx-auto w-full max-w-3xl mt-8">
        <Map />
        <div className="mt-4 px-2">
          <CityAlgorithmPicker />
        </div>
      </div>

      <div
        className="flex mt-4 flex-col drop-shadow-lg items-center justify-center gap-2 mx-auto bg-cover bg-top bg-no-repeat p-8 text-white min-h-[800px]"
        style={{ backgroundImage: "url('/static/images/blue_green.jpg')" }}
      >
        <h2 className="text-xl text-center">It is hard to visit every street in a city at once.</h2>
        <h3 className="text-base text-center leading-relaxed">
          This map allows you to select distance and starting point it will prioritize the streets that weren't visited
          yet.
        </h3>
        <h4>You can import your data, nothing is stored on the server.</h4>
      </div>
      <div className="mx-auto w-full max-w-3xl mt-8">
        <SingleRouteMap />

        <div className="mt-4 px-2 space-y-4">
          <LocationPicker
            legend={t('routeOptions_LocationPicker_start_label')}
            which="start"
            point={start}
            setPoint={setStart}
            setOtherPoint={setEnd}
          />
          <AlgorithmPicker
            legend={t('routeOptions_AlgorithmPicker_legend')}
            value={algorithm}
            onChange={setAlgorithm}
          />
          <GenerateButton
            label={t('routeOptions_GenerateButton_label')}
            loadingLabel={t('routeOptions_GenerateButton_LoadingLabel')}
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
