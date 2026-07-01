import { faDownload, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'leaflet/dist/leaflet.css';
import { useTranslations } from 'next-intl';
import React, { MouseEventHandler, useMemo, useState } from 'react';

import ApiService, { Route, Segment } from '@/src/services/api';

import ElevationChart from './ElevationChart';

type RouteDetilsProps = {
  route: Route;
  onRemove: MouseEventHandler;
};

function combineSegmentsIfNew(segments: Segment[]): Segment[] {
  if (!segments?.length) return [];

  const result = [];
  let lastSegment = { ...segments[0] };

  for (let i = 1; i < segments.length; i++) {
    const segment = segments[i];

    if (lastSegment.new !== segment.new) {
      result.push(lastSegment);
      lastSegment = { ...segment };
    } else {
      lastSegment.distance += segment.distance;
    }
  }
  result.push(lastSegment);
  return result;
}

const RouteDetils: React.FC<RouteDetilsProps> = ({ route, onRemove }) => {
  const t = useTranslations('routeDetails');

  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);
  const [downloading, setDownloading] = useState(false);

  const total_width = 1000;
  const combinedSegments = useMemo(() => combineSegmentsIfNew(route.segments ?? []), [route.segments]);
  const elevation = route.elevation ?? [];
  const routeDistance = route.distance > 0 ? route.distance : 1;

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const title = `route_${Math.round(route.distance)}m_${Math.round(route.percent_of_new)}pct`;
      await ApiService.downloadGPXFromRoute(route, title);
    } catch {
      alert(t('downloadError'));
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <p className="font-bold text-lg">{t('heading')}</p>
      </div>

      <div className="flex items-center gap-2">
        <p className="text-sm">{t('distance', { distance: Math.round(route.distance) })}</p>
        <p className="text-sm ml-2">{t('newRoads', { value: Math.round(route.total_new) })}</p>
        <p className="text-sm ml-2">{t('oldRoads', { value: Math.round(route.total_old) })}</p>
        <p className="text-sm ml-2">{t('percentNew', { percent: Math.round(route.percent_of_new) })}</p>

        <button
          className="text-blue-500 hover:text-blue-700"
          onClick={handleDownload}
          title={t('downloadGpx')}
          disabled={downloading}
        >
          <FontAwesomeIcon icon={faDownload} size="lg" />
        </button>

        <button className="text-red-500 hover:text-red-700" onClick={onRemove} title={t('deleteRoute')}>
          <FontAwesomeIcon icon={faTrash} size="lg" />
        </button>
      </div>

      <div className="w-full overflow-x-auto flex">
        {combinedSegments.map((e, index) => (
          <div
            key={index}
            style={{
              width: `${Math.round((e.distance * total_width) / routeDistance)}px`,
              height: '20px',
              background: e.new ? 'green' : 'brown',
              position: 'relative',
              flexShrink: 0,
            }}
            onMouseEnter={() => setHoveredSegment(index)}
            onMouseLeave={() => setHoveredSegment(null)}
          >
            {hoveredSegment === index && (
              <div
                style={{
                  position: 'absolute',
                  top: '-25px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  color: 'white',
                  padding: '2px 5px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  whiteSpace: 'nowrap',
                }}
              >
                {t('segmentDistance', { distance: Math.round(e.distance) })}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex" style={{ height: '200px' }}>
        <div>
          <p className="text-2xl font-bold mb-4">{t('elevationHeading')}</p>
          <p>{t('totalAscent', { value: route.total_gain })}</p>
          <p>{t('totalDescent', { value: route.total_lose })}</p>
        </div>
        {elevation.length > 0 ? (
          <ElevationChart elevation={elevation} />
        ) : (
          <p className="text-sm text-zinc-500">{t('noElevationData')}</p>
        )}
      </div>
    </div>
  );
};

export default RouteDetils;
