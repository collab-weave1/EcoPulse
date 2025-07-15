import { Accessibility, Globe2, Megaphone, Wheat, Sprout, Heart } from 'lucide-react';
import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 mt-16 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-2 rounded-xl">
                <Sprout className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">EcoPulse</h3>
                <p className="text-sm text-gray-400">Climate Risk Intelligence</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Empowering communities worldwide with real-time environmental monitoring and early warning systems for climate resilience.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold text-lg mb-4">Global Standards</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <Globe2 className="w-5 h-5 text-blue-400" />
                <span>GEO & GEOSS Standards Compliant</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <Wheat className="w-5 h-5 text-yellow-400" />
                <span>FAO/WMO Agricultural Drought Monitoring</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <Megaphone className="w-5 h-5 text-orange-400" />
                <span>UNESCO/UNDRR Early Warning Systems</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <Accessibility className="w-5 h-5 text-green-400" />
                <span>WCAG 2.2 Accessibility Compliant</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold text-lg mb-4">Our Mission</h4>
            <p className="text-gray-300 text-sm leading-relaxed">
              Building resilient communities through predictive climate intelligence, aligned with the Sendai Framework and UN Sustainable Development Goals.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-400" />
              <span>for a sustainable future</span>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            &copy; 2024 EcoPulse. Supporting global climate resilience through innovative technology and international collaboration.
          </p>
        </div>
      </div>
    </footer>
  );
}