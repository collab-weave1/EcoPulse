import React, { useEffect, useState } from 'react';
import { fetchRisk } from './api';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

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
                console.log('🚀 regionId changed, calling fetchRisk…', regionId);
                const result = await fetchRisk(regionId);
                console.log('🎉 data:', result);
                setData(result);
            } catch (err) {
                console.error('🔥 error in fetchRisk:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        if (regionId) loadData();
    }, [regionId]);

    if (loading) {
        return <p className="text-center text-gray-500">Loading data...</p>;
    }
    if (error) {
        return <p className="text-center text-red-500">Error: {error}</p>;
    }

    const chartData = {
        labels: data.map(d => d.date),
        datasets: [
            {
                label: 'EcoRisk Score',
                data: data.map(d => d.ecorisk),
                borderColor: '#f97316',
                backgroundColor: 'rgba(249, 115, 22, 0.2)',
                tension: 0.2,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: `EcoRisk Score Over Time` },
            tooltip: {
                callbacks: {
                    label: (ctx) => `Risk Score: ${ctx.raw}`,
                },
            },
        },
        scales: {
            x: { title: { display: true, text: 'Date' } },
            y: { title: { display: true, text: 'Risk Score (0–100)' } },
        },
    };

    return (
        <div className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold mb-1">📈 Risk Trend Chart</h2>
            <p className="text-sm text-gray-600 mb-2">
                This chart displays the historical EcoRisk score based on drought indicators, NDVI vegetation stress,
                and recent rainfall trends. Use this to assess environmental risks over time in the selected region.
            </p>
            <Line data={chartData} options={options} />
        </div>
    );
}
