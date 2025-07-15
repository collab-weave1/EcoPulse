// components/Impact.jsx
import React from 'react';

export default function Impact() {
  return (
    <section className="bg-white py-12 px-6 md:px-12 border-t border-gray-100">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Why This Matters</h2>
        <p className="text-gray-600 mb-6">
          Environmental degradation affects agriculture, water availability, and public health. This platform empowers users
          with insights into regional environmental risks, enabling timely interventions, informed planning, and policy alignment.
        </p>
        <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li>Promotes proactive drought and flood risk mitigation</li>
          <li>Supports sustainable agriculture through vegetation monitoring</li>
          <li>Improves disaster preparedness and response</li>
          <li>Enables data-driven decisions for ecosystem conservation</li>
        </ul>
      </div>
    </section>
  );
} 