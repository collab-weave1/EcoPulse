import React, { useEffect, useState } from 'react';
import { fetchRisk } from '../api';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { TrendingUp, AlertTriangle, CheckCircle, Activity } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function RiskChart({ regionId }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        console.log('regionId changed, calling fetchRisk…', regionId);
        const result = await fetchRisk(regionId);
        console.log('data:', result);
        setData(result);
      } catch (err) {
        console.error('error in fetchRisk:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (regionId) loadData();
  }, [regionId]);

  const currentRisk = data.length > 0 ? data[data.length - 1].ecorisk : 0;
  const avgRisk = data.length > 0 ? data.reduce((sum, d) => sum + d.ecorisk, 0) / data.length : 0;
  const trend = data.length > 1 ? data[data.length - 1].ecorisk - data[data.length - 2].ecorisk : 0;
  
  const getRiskLevel = (score) => {
    if (score < 30) return { level: 'Low', color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle };
    if (score < 70) return { level: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-50', icon: Activity };
    return { level: 'High', color: 'text-red-600', bg: 'bg-red-50', icon: AlertTriangle };
  };

  const riskInfo = getRiskLevel(currentRisk);
  const RiskIcon = riskInfo.icon;

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-2xl shadow-lg border border-blue-200">
        <div className="flex items-center justify-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-blue-700 font-medium">Analyzing environmental data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-red-50 to-pink-100 p-8 rounded-2xl shadow-lg border border-red-200">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="w-8 h-8 text-red-500" />
          <div>
            <p className="text-red-700 font-medium">Unable to load risk data</p>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const chartData = {
    labels: data.map(d => d.date),
    datasets: [
      {
        label: 'EcoRisk Score',
        data: data.map(d => d.ecorisk),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        borderWidth: 3,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        cornerRadius: 8,
        padding: 12,
        callbacks: {
          label: (ctx) => `Risk Score: ${ctx.raw}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 12,
          },
        },
      },
      y: {
        grid: {
          color: 'rgba(107, 114, 128, 0.1)',
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 12,
          },
        },
        title: {
          display: true,
          text: 'Risk Score (0–100)',
          color: '#374151',
          font: {
            size: 13,
            weight: 'bold',
          },
        },
      },
    },
  };

  return (
    <section className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden" id='risk'>
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
        <div className="flex items-center space-x-3">
          <TrendingUp className="w-6 h-6" />
          <h2 className="text-xl font-bold">Environmental Risk Analysis</h2>
        </div>
        <p className="text-blue-100 text-sm mt-2">
          Real-time monitoring of drought, vegetation stress, and rainfall patterns
        </p>
      </div>

      <div className="p-6 border-b border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`${riskInfo.bg} p-4 rounded-xl border border-gray-200`}>
            <div className="flex items-center space-x-3">
              <RiskIcon className={`w-5 h-5 ${riskInfo.color}`} />
              <div>
                <p className="text-sm text-gray-600">Current Risk</p>
                <p className={`text-2xl font-bold ${riskInfo.color}`}>
                  {currentRisk.toFixed(1)}
                </p>
                <p className={`text-xs ${riskInfo.color} font-medium`}>
                  {riskInfo.level} Risk
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <div className="flex items-center space-x-3">
              <Activity className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Average Risk</p>
                <p className="text-2xl font-bold text-gray-800">
                  {avgRisk.toFixed(1)}
                </p>
                <p className="text-xs text-gray-500 font-medium">
                  Historical Average
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <div className="flex items-center space-x-3">
              <TrendingUp className={`w-5 h-5 ${trend >= 0 ? 'text-red-500' : 'text-green-500'}`} />
              <div>
                <p className="text-sm text-gray-600">Trend</p>
                <p className={`text-2xl font-bold ${trend >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {trend >= 0 ? '+' : ''}{trend.toFixed(1)}
                </p>
                <p className={`text-xs font-medium ${trend >= 0 ? 'text-red-500' : 'text-green-500'}`}>
                  {trend >= 0 ? 'Increasing' : 'Decreasing'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="h-80">
          <Line data={chartData} options={options} />
        </div>
      </div>

      <div className="bg-gray-50 p-4 border-t border-gray-100">
        <p className="text-xs text-gray-500 text-center">
          Risk assessment based on drought indicators, NDVI vegetation stress, and rainfall analysis
        </p>
      </div>
    </section>
  );
}