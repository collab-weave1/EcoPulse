
import { useState } from 'react';
import RegionSelector from '../components/RegionSelector';
import RiskChart from '../components/RiskChart';

export default function RiskDashboard() {
  const [regionId, setRegionId] = useState(1);

  return (
    <main className="space-y-6">
      <RegionSelector regionId={regionId} setRegionId={setRegionId} />
      <RiskChart regionId={regionId} />
    </main>
  );
}