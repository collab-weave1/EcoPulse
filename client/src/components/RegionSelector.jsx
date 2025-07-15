import React, { useState } from 'react';
import { MapPin, ChevronDown, Check } from 'lucide-react';

export default function RegionSelector({ onSelect }) {
  const [selectedRegion, setSelectedRegion] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  
  const regions = [
    { 
      id: 1, 
      name: 'Region A - Semi-Arid Basin',
      description: 'Drought-prone agricultural zone',
      risk: 'Moderate',
      riskColor: 'text-yellow-600 bg-yellow-100'
    },
    { 
      id: 2, 
      name: 'Region B - River Valley Zone',
      description: 'Water-rich fertile plains',
      risk: 'Low',
      riskColor: 'text-green-600 bg-green-100'
    }
  ];

  const handleSelect = (region) => {
    setSelectedRegion(region.id);
    onSelect(region.id);
    setIsOpen(false);
  };

  const selectedRegionData = regions.find(r => r.id === selectedRegion);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-white/20 p-2 rounded-lg">
            <MapPin className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white">Region Selection</h2>
        </div>
        <p className="text-blue-100 text-sm">
          Choose a region to monitor environmental conditions and risk factors
        </p>
      </div>
      
      {/* Content */}
      <div className="p-6">
        {/* Custom Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-4 text-left flex items-center justify-between hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-600" />
              <div>
                <div className="font-medium text-gray-800">{selectedRegionData?.name}</div>
                <div className="text-sm text-gray-500">{selectedRegionData?.description}</div>
              </div>
            </div>
            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              {regions.map((region) => (
                <button
                  key={region.id}
                  onClick={() => handleSelect(region)}
                  className="w-full px-4 py-4 text-left hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100 last:border-b-0 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-600" />
                    <div>
                      <div className="font-medium text-gray-800">{region.name}</div>
                      <div className="text-sm text-gray-500">{region.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${region.riskColor}`}>
                      {region.risk}
                    </span>
                    {selectedRegion === region.id && (
                      <Check className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        
        <div className="mt-6 bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-800">Current Selection</h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${selectedRegionData?.riskColor}`}>
              {selectedRegionData?.risk} Risk
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-3">{selectedRegionData?.description}</p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Real-time monitoring</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Data updated hourly</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}