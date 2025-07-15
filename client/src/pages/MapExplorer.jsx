import { useState } from 'react';
import MapView from '../components/MapView';
import RegionSelector from '../components/RegionSelector';

export default function MapExplorer() {
  const [regionId, setRegionId] = useState(1);
  return (
    <main className="space-y-6">
      <RegionSelector regionId={regionId} setRegionId={setRegionId} />
      <MapView regionId={regionId} />
    </main>
  );
}