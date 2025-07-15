import React from 'react';
import { Shield, TrendingUp, Globe, AlertTriangle } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 py-20 px-6 text-center overflow-hidden" id="about">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-white rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative max-w-5xl mx-auto">
        <div className="mb-8">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Predict. Prevent. <span className="text-yellow-300">Protect.</span>
          </h2>
          <p className="text-xl md:text-2xl text-green-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            EcoPulse is a climate risk intelligence dashboard aligned with the
            <span className="font-semibold text-white"> Sendai Framework</span>, 
            <span className="font-semibold text-white"> SDGs</span>, 
            <span className="font-semibold text-white"> GEO/GEOSS</span> and 
            <span className="font-semibold text-white"> UNDRR Early Warning Systems</span>.
          </p>
          <p className="text-lg text-green-100 mb-12 max-w-4xl mx-auto">
            Empowering communities and policymakers to identify regions at risk of environmental stress using real-time vegetation, weather, and drought data.
          </p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
            <TrendingUp className="w-8 h-8 text-yellow-300 mx-auto mb-3" />
            <h3 className="font-semibold text-white mb-2">Real-time Analytics</h3>
            <p className="text-sm text-green-100">Live environmental monitoring</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
            <AlertTriangle className="w-8 h-8 text-yellow-300 mx-auto mb-3" />
            <h3 className="font-semibold text-white mb-2">Early Warning</h3>
            <p className="text-sm text-green-100">Predictive risk assessment</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
            <Globe className="w-8 h-8 text-yellow-300 mx-auto mb-3" />
            <h3 className="font-semibold text-white mb-2">Global Standards</h3>
            <p className="text-sm text-green-100">UN framework compliance</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
            <Shield className="w-8 h-8 text-yellow-300 mx-auto mb-3" />
            <h3 className="font-semibold text-white mb-2">Community Protection</h3>
            <p className="text-sm text-green-100">Proactive risk mitigation</p>
          </div>
        </div>
      </div>
    </section>
  );
}