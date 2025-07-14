import React, { useState } from 'react';
import { subscribe } from './api';
export default function AlertBox({ regionId }) {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const send = async () => {
    const res = await subscribe(regionId, email);
    setMsg(res.msg);
  };
  return (
    <div className="mt-16 bg-gray-100 p-4 rounded shadow">
      <h2 className="font-semibold mb-2">📬 Subscribe to Risk Alerts</h2>
      <p className="text-sm text-gray-700 mb-3">
        Get notified by email if environmental risks exceed safe thresholds.
      </p>
      <div className="flex gap-2">
        <input
          type='email'
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder='you@domain.com'
          className="p-2 border rounded w-full"
        />
        <button
          onClick={send}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Subscribe
        </button>
      </div>
      <p className="mt-2 text-sm text-gray-600">{msg}</p>
    </div>
  );
}