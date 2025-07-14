import React from 'react';

export default function Hero() {
  return (
    <section className="bg-green-50 py-16 px-6 text-center" id="about">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl font-bold text-green-800 mb-4">Predict. Prevent. Protect.</h2>
        <p className="text-gray-700 text-lg">
          EcoPulse is a climate risk intelligence dashboard aligned with the
          <strong> Sendai Framework</strong>, <strong>SDGs</strong>, <strong>GEO/GEOSS</strong> and <strong>UNDRR Early Warning Systems</strong>. 
          It helps communities and policymakers identify regions at risk of environmental stress using real-time vegetation, weather, and drought data.
        </p>
      </div>
    </section>
  );
}