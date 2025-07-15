const API_URL = import.meta.env.VITE_API_URL;

export async function fetchRisk(regionId) {

  console.log("VITE_API_URL =", import.meta.env.VITE_API_URL);

  const path = `/regions/${regionId}/risk`;

  const url = `${API_URL}${path}`

  console.log('fetchRisk URL =', url);

  const res = await fetch(url);
  console.log('API_URL:', import.meta.env.VITE_API_URL);
  console.log('fetchRisk raw response =', res);

  if (!res.ok) {
    const text = await res.text();
    console.error('fetchRisk failed:', res.status, text);
    throw new Error(`Failed to fetch risk data: ${res.status}`);
  }

  return res.json();
}

export async function subscribe(regionId, email) {

  const path = `/alerts/${regionId}`;
  const url = `${API_URL}${path}`;

  console.log('subscribe URL =', url, 'body =', { email });

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  console.log('API_URL:', import.meta.env.VITE_API_URL);
  console.log('subscribe raw response =', res);

  if (!res.ok) {
    const text = await res.text();
    console.error('subscribe failed:', res.status, text);
    throw new Error(`Failed to subscribe: ${res.status}`);
  }

  return res.json();
}
