import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';

const MAPBOX_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN || '';
mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

type MapData = {
    lat: any;
    lon: any;
    city: string;
    temp: any;
};
type MapProps = {
    data: MapData[];
    displayBy: '°C' | '°F';
};

const Map: React.FC<MapProps> = ({ data, displayBy }) => {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const [map, setMap] = useState<mapboxgl.Map | null>(null);
    useEffect(() => {
        if (mapContainerRef.current && !map) {
            const mapInstance = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: 'mapbox://styles/mapbox/light-v10',
                center: [0, 20], // Adjust center
                zoom: 2,
            });

            setMap(mapInstance);

            // Add temperature markers
            data.forEach(({ lat, lon, temp, city }) => {
                const el = document.createElement('div');
                el.style.background = '#0e1f2c';
                el.style.color = 'white';
                el.style.padding = '5px';
                el.style.borderRadius = '5px';
                el.innerText = `${city} ${temp} ${displayBy}`;

                new mapboxgl.Marker(el)
                    .setLngLat([lon, lat])
                    .addTo(mapInstance);
            });
        }
    }, [data, displayBy, map]);

    return (
        <div ref={mapContainerRef} style={{ width: '100%', height: '500px' }} />
    );
};

export default Map;
