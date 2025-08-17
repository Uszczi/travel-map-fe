'use client';

import { useState } from 'react';

import type { MapOptions } from '@/components/types';

import OptionsPanel from './OptionsPanel';

export default function OptionsPanelClient({ initialOptions }: { initialOptions: MapOptions }) {
  const [options, setOptions] = useState(initialOptions);
  return <OptionsPanel options={options} onChange={setOptions} />;
}
