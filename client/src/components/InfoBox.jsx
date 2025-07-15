import { Leaf, TrendingUp, Droplets, Sun, AlertTriangle } from 'lucide-react';
import React from 'react';

export default function InfoBox() {
  return (
    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl shadow-lg border border-emerald-100 overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white">Understanding EcoRisk</h2>
        </div>
        <p className="text-emerald-100 text-sm">
          Real-time environmental intelligence powered by satellite data and AI
        </p>
      </div>
      
      <div className="p-6">
        <div className="mb-6">
          <p className="text-gray-700 leading-relaxed mb-4">
            EcoRisk is a comprehensive environmental health score that combines multiple satellite 
            and weather data sources to provide real-time insights into ecosystem vulnerability 
            and climate-related risks.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Leaf className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-gray-800">Vegetation Health</h3>
            </div>
            <p className="text-sm text-gray-600">
              NDVI satellite data monitoring plant stress and biomass changes
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Droplets className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-800">Water Stress</h3>
            </div>
            <p className="text-sm text-gray-600">
              SPEI index tracking precipitation deficits and drought conditions
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Sun className="w-5 h-5 text-yellow-600" />
              <h3 className="font-semibold text-gray-800">Weather Patterns</h3>
            </div>
            <p className="text-sm text-gray-600">
              Temperature, rainfall, and atmospheric pressure analysis
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              <h3 className="font-semibold text-gray-800">Risk Modeling</h3>
            </div>
            <p className="text-sm text-gray-600">
              AI-powered predictive analytics for early warning systems
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <h3 className="font-semibold text-gray-800">Risk Scale Interpretation</h3>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-green-400 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">0-33: Low Risk</span>
              <span className="text-xs text-gray-500">Optimal environmental conditions</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">34-66: Moderate Risk</span>
              <span className="text-xs text-gray-500">Emerging stress indicators</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-red-400 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">67-100: High Risk</span>
              <span className="text-xs text-gray-500">Critical intervention needed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}