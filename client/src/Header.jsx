import React from 'react';

export default function Header() {
  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-6xl mx-auto p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-green-700">🌱 EcoPulse</h1>
        <nav>
          <ul className="flex gap-4 text-sm text-gray-600">
            <li><a href="#about" className="hover:underline">About</a></li>
            <li><a href="#risk" className="hover:underline">Risk Graph</a></li>
            <li><a href="#map" className="hover:underline">Map</a></li>
            <li><a href="#alerts" className="hover:underline">Alerts</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}