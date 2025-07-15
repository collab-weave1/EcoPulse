import React from 'react';
import Hero from '../components/Hero';
import InfoBox from '../components/InfoBox';
import Impact from '../components/Impact';
import Stakeholders from '../components/Stakeholders';
import FrameworkAlignment from '../components/FrameworkAlignment';
import AlertBox from '../AlertBox';

export default function Home() {
  return (
    <main className="space-y-12">
      <Hero />
      <InfoBox />
      <Impact />
      <Stakeholders />
      <FrameworkAlignment />
      <AlertBox/>
    </main>
  );
}
