import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

export default function MapView({ regionId = 1 }) { 
  const [loadStatus, setLoadStatus] = useState({});

  const updateStatus = (layer, status, error = null) => {
    setLoadStatus(prev => ({
      ...prev,
      [layer]: { status, error }
    }));
  };

  useEffect(() => {
    if (!regionId || regionId === 'undefined') {
      console.error('Invalid regionId provided to MapView:', regionId);
      console.error('MapView requires a valid regionId prop');
      updateStatus('validation', 'error', 'No valid regionId provided');
      return;
    }

    if (!import.meta.env.VITE_API_URL) {
      console.error('VITE_API_URL not set');
      return;
    }

    if (!import.meta.env.VITE_MAPBOX_TOKEN) {
      console.error('VITE_MAPBOX_TOKEN not set');
      return;
    }

    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/light-v10',
      center: [77.55, 12.95],
      zoom: 6,
    });

    map.on('load', async () => {
      console.log(`Loading map data for region ${regionId}`);
      console.log(`API URL: ${import.meta.env.VITE_API_URL}`);

      try {
        updateStatus('regions', 'loading');
        const url = `${import.meta.env.VITE_API_URL}/regions/${regionId}/geojson`;
        console.log('Fetching regions from:', url);
        
        const geoRes = await fetch(url);
        
        if (!geoRes.ok) {
          const errorText = await geoRes.text();
          console.error('Region API Error:', {
            status: geoRes.status,
            statusText: geoRes.statusText,
            body: errorText
          });
          throw new Error(`HTTP ${geoRes.status}: ${geoRes.statusText} - ${errorText}`);
        }
        
        const geojson = await geoRes.json();
        console.log('Region GeoJSON received:', geojson);
        
        if (!geojson.features || geojson.features.length === 0) {
          throw new Error('No region features found');
        }
        
        map.addSource('region-zone', { type: 'geojson', data: geojson });
        map.addLayer({
          id: 'region-fill',
          type: 'fill',
          source: 'region-zone',
          paint: {
            'fill-color': [
              'interpolate',
              ['linear'],
              ['get', 'ecorisk'],
              0, '#2DC4B2',
              50, '#F1F075',
              100, '#E55E5E'
            ],
            'fill-opacity': 0.5
          }
        });
        map.addLayer({
          id: 'region-outline',
          type: 'line',
          source: 'region-zone',
          paint: { 'line-color': '#333', 'line-width': 2 }
        });
        
        updateStatus('regions', 'success');
      } catch (err) {
        console.error('Region zones error:', err);
        updateStatus('regions', 'error', err.message);
      }

      try {
        updateStatus('water', 'loading');
        const url = `${import.meta.env.VITE_API_URL}/stations/water?region=${regionId}`;
        console.log('Fetching water stations from:', url);
        
        const waterRes = await fetch(url);
        
        if (!waterRes.ok) {
          const errorText = await waterRes.text();
          console.error('Water API Error:', {
            status: waterRes.status,
            statusText: waterRes.statusText,
            body: errorText
          });
          throw new Error(`HTTP ${waterRes.status}: ${waterRes.statusText} - ${errorText}`);
        }
        
        const water = await waterRes.json();
        console.log('Water stations received:', water);
        
        map.addSource('water-stations', { type: 'geojson', data: water });
        map.addLayer({
          id: 'water-stations',
          type: 'circle',
          source: 'water-stations',
          paint: {
            'circle-radius': 6,
            'circle-color': '#0074D9'
          }
        });
        
        updateStatus('water', 'success');
      } catch (err) {
        console.error('Water stations error:', err);
        updateStatus('water', 'error', err.message);
      }

      try {
        updateStatus('drought', 'loading');
        const url = `${import.meta.env.VITE_API_URL}/zones/drought?region=${regionId}`;
        console.log('Fetching drought zones from:', url);
        
        const droughtRes = await fetch(url);
        
        if (!droughtRes.ok) {
          const errorText = await droughtRes.text();
          console.error('Drought API Error:', {
            status: droughtRes.status,
            statusText: droughtRes.statusText,
            body: errorText
          });
          throw new Error(`HTTP ${droughtRes.status}: ${droughtRes.statusText} - ${errorText}`);
        }
        
        const drought = await droughtRes.json();
        console.log('Drought zones received:', drought);
        
        map.addSource('drought-zones', { type: 'geojson', data: drought });
        map.addLayer({
          id: 'drought-fill',
          type: 'fill',
          source: 'drought-zones',
          paint: {
            'fill-color': '#C0392B',
            'fill-opacity': 0.3
          }
        });
        
        updateStatus('drought', 'success');
      } catch (err) {
        console.error('Drought zones error:', err);
        updateStatus('drought', 'error', err.message);
      }

      try {
        updateStatus('calamity', 'loading');
        
        map.loadImage('https://img.icons8.com/emoji/48/000000/fire.png', async (error, image) => {
          if (error) {
            console.error('Fire icon error:', error);
            updateStatus('calamity', 'error', 'Failed to load fire icon');
            return;
          }
          
          if (image) {
            map.addImage('calamity-icon', image);
            
            try {
              const url = `${import.meta.env.VITE_API_URL}/events/calamity?region=${regionId}`;
              console.log('Fetching calamity events from:', url);
              
              const evtRes = await fetch(url);
              
              if (!evtRes.ok) {
                const errorText = await evtRes.text();
                console.error('Calamity API Error:', {
                  status: evtRes.status,
                  statusText: evtRes.statusText,
                  body: errorText
                });
                throw new Error(`HTTP ${evtRes.status}: ${evtRes.statusText} - ${errorText}`);
              }
              
              const evt = await evtRes.json();
              console.log('Calamity events received:', evt);
              
              map.addSource('calamity-events', { type: 'geojson', data: evt });
              map.addLayer({
                id: 'calamity-events',
                type: 'symbol',
                source: 'calamity-events',
                layout: {
                  'icon-image': 'calamity-icon',
                  'icon-size': 0.8,
                  'icon-allow-overlap': true
                }
              });
              
              updateStatus('calamity', 'success');
            } catch (err) {
              console.error('Calamity events error:', err);
              updateStatus('calamity', 'error', err.message);
            }
          }
        });
      } catch (err) {
        console.error('Calamity loading error:', err);
        updateStatus('calamity', 'error', err.message);
      }
    });

    return () => map.remove();
  }, [regionId]);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="font-semibold mb-1">🗺️ Regional Monitoring Map</h2>
      
      {(!regionId || regionId === 'undefined') ? (
        <div className="p-4 bg-red-100 border border-red-300 rounded">
          <p className="text-red-700 font-medium">⚠️ Error: No region selected</p>
          <p className="text-red-600 text-sm">
            The MapView component requires a valid regionId prop. 
            Current value: {JSON.stringify(regionId)}
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-600 mb-2">
            Region {regionId} <br/>
            • <strong>Water</strong>: Blue circles show monitoring stations.<br/>
            • <strong>Risk Zones</strong>: Color fill from green to red indicates increasing EcoRisk.<br/>
            • <strong>Drought</strong>: Semi-transparent red overlays mark drought severity areas.<br/>
            • <strong>Calamity</strong>: Fire icons mark recent critical events.
          </p>
          
          <div className="mb-4 p-2 bg-gray-100 rounded text-xs">
            <strong>Layer Status:</strong>
            {Object.entries(loadStatus).map(([layer, info]) => (
              <div key={layer} className="flex justify-between">
                <span>{layer}:</span>
                <span className={
                  info.status === 'success' ? 'text-green-600' :
                  info.status === 'error' ? 'text-red-600' :
                  info.status === 'skipped' ? 'text-gray-500' :
                  'text-yellow-600'
                }>
                  {info.status} {info.error && `(${info.error})`}
                </span>
              </div>
            ))}
          </div>
          
          <div id="map" className="w-full h-[600px] rounded" aria-label="Regional environmental risk map" role="img" />
        </>
      )}
    </div>
  );
}