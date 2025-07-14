import React from 'react';
export default function InfoBox() {
  return (
    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded shadow mb-6">
      <h2 className="font-semibold text-blue-700 mb-2">🌿 What is EcoRisk?</h2>
      <p className="text-sm text-gray-800">
        EcoRisk is a composite score derived from live satellite and weather data, including vegetation
        health (NDVI), rainfall, and water stress (SPEI). It indicates environmental degradation and
        drought risks in a given region. Higher values mean greater risk.
      </p>
    </div>
  );
}