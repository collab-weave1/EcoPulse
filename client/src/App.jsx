import React, { useState } from 'react';
import Header from './Header';
import Hero from './Hero';
import Footer from './Footer';
import InfoBox from './InfoBox';
import RegionSelector from './RegionSelector';
import RiskChart from './RiskChart';
import MapView from './MapView';
import AlertBox from './AlertBox';

export default function App() {
  const [regionId, setRegionId] = useState(1);

  return (
    <div className="font-sans">
      <Header />
      <Hero />

      <main className="space-y-6 max-w-6xl mx-auto px-4">

        <InfoBox />
        <RegionSelector onSelect={setRegionId} />

        <RiskChart regionId={regionId} />
        <div>
          <h2 className="text-lg font-semibold mb-2">🗺 Regional Monitoring Map</h2>
          <MapView />
        </div>

        <section id="alerts">
          <AlertBox regionId={regionId} />
        </section>
      </main>

      <Footer />
    </div>
  );
}
