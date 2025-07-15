import React from 'react';

export default function Stakeholders() {
  return (
    <section className="bg-gray-50 py-12 px-6 md:px-12 border-t border-gray-100">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Who Benefits?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
          <div>
            <h3 className="text-lg font-semibold text-indigo-600">Government Agencies</h3>
            <p className="text-sm mt-1">Use risk insights to guide climate adaptation and regional planning.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-green-600">Farmers & Agricultural Cooperatives</h3>
            <p className="text-sm mt-1">Access vegetation stress data to optimize crop planning and irrigation.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-blue-600">Researchers & Environmentalists</h3>
            <p className="text-sm mt-1">Analyze longitudinal environmental data for better understanding of climate patterns.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-yellow-600">NGOs & Disaster Response Teams</h3>
            <p className="text-sm mt-1">Leverage real-time alerts for faster and more effective crisis response.</p>
          </div>
        </div>
      </div>
    </section>
  );
} 