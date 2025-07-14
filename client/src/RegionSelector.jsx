import React from 'react';
export default function RegionSelector({ onSelect }) {
  const regions = [
    { id: 1, name: 'Region A - Semi-Arid Basin' },
    { id: 2, name: 'Region B - River Valley Zone' }
  ];
  return (
    <div className="mb-4">
      <label className="block font-semibold mb-1 text-gray-700">Select Region</label>
      <select
        onChange={e => onSelect(Number(e.target.value))}
        className="border border-gray-300 p-2 rounded w-full bg-white"
      >
        {regions.map(r => (
          <option key={r.id} value={r.id}>{r.name}</option>
        ))}
      </select>
    </div>
  );
}