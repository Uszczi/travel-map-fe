'use client';

import dynamic from 'next/dynamic';

import CityAlgorithmPicker from '@/components/CityAlgorithmPicker';

const Map = dynamic(() => import('@/components/Map/Map'), { ssr: false });

export default function Home() {
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
        <h3 className="text-base text-center leading-relaxed">
          Import your own data to see how you could run through all the remaining streets in your city.
        </h3>
      </div>
      <div className="mx-auto w-full max-w-3xl mt-8">
        <Map />
        <div className="mt-4 px-2">
          <CityAlgorithmPicker />
        </div>
      </div>
      <div className="mt-[400px]"></div>
    </div>
  );
}
