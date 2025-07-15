import React, { useState } from 'react';
import { subscribe } from './api';
import { Mail, Bell, CheckCircle, AlertCircle } from 'lucide-react';

export default function AlertBox({ regionId }) {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const send = async () => {
    setIsLoading(true);
    try {
      const res = await subscribe(regionId, email);
      setMsg(res.msg);
      setIsSuccess(res.success);
    } catch (error) {
      setMsg('Failed to subscribe. Please try again.');
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-green-100">
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <Bell className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white">Stay Informed</h2>
        </div>
        <p className="text-blue-100">
          Get instant notifications when environmental risks exceed safe thresholds in your selected region.
        </p>
      </div>
      
      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Mail className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-800">Email Alerts</span>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Receive real-time alerts about drought conditions, vegetation stress, and extreme weather events.
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 pr-12"
              disabled={isLoading}
            />
            <Mail className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          
          <button
            onClick={send}
            disabled={!email || isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold py-4 rounded-lg hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Subscribing...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Bell className="w-5 h-5" />
                Subscribe to Alerts
              </div>
            )}
          </button>
          
          {msg && (
            <div className={`flex items-center gap-2 p-4 rounded-lg ${
              isSuccess 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {isSuccess ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
              )}
              <p className="text-sm font-medium">{msg}</p>
            </div>
          )}
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            By subscribing, you agree to receive environmental risk alerts. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </div>
  );
}