import React from 'react';
import { Sprout } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-lg sticky top-0 z-50 border-b border-green-100">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-2 rounded-xl">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
                EcoPulse
              </h1>
              <p className="text-xs text-gray-500 font-medium">Climate Risk Intelligence</p>
            </div>
          </div>
          
          <nav className="hidden md:block">
            <ul className="flex gap-8 text-sm font-medium">
              <li>
                <a href="/" className="text-gray-700 hover:text-green-600 transition-colors duration-200 hover:underline underline-offset-4">
                  About
                </a>
              </li>
              <li>
                <a href="/risk" className="text-gray-700 hover:text-green-600 transition-colors duration-200 hover:underline underline-offset-4">
                  Risk Analysis
                </a>
              </li>
              <li>
                <a href="/map" className="text-gray-700 hover:text-green-600 transition-colors duration-200 hover:underline underline-offset-4">
                  Live Map
                </a>
              </li>
              <li>
                <a href="/#alerts" className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg hover:shadow-md transition-all duration-200 hover:from-green-700 hover:to-emerald-700">
                  Get Alerts
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}