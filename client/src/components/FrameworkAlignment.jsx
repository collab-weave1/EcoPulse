import React from 'react';

export default function FrameworkAlignment() {
  return (
    <section className="bg-white py-12 px-6 md:px-12 border-t border-gray-100">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Frameworks & Standards</h2>
        <p className="text-gray-600 mb-6">
          This platform aligns with globally recognized environmental monitoring and health classification frameworks:
        </p>
        <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li>ICD-11 Environmental Health Codes (WHO)</li>
          <li>UN SDGs – Goals 13 (Climate Action), 15 (Life on Land)</li>
          <li>IPCC Climate Risk Assessment methodologies</li>
          <li>INSPIRE Directive for Geospatial Data Interoperability</li>
        </ul>
      </div>
    </section>
  );
}
