import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { MapData } from '../types/map';

const MAPBOX_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN || '';
mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

type MapProps = {
    data: MapData[] | null;
    displayBy: '°C' | '°F';
};

const TemperatureMap: React.FC<MapProps> = ({ data, displayBy }) => {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const [mapData, setMapData] = useState(data);
    const [displayUnit, setDisplayUnit] = useState(displayBy);
    const [map, setMap] = useState<mapboxgl.Map | null>(null);

    useEffect(() => {
        if (mapContainerRef.current && !map) {
            const mapInstance = new mapboxgl.Map({
                container: mapContainerRef.current as HTMLDivElement,
                style: 'mapbox://styles/mapbox/light-v10',
                center: [0, 20], // Adjust center
                zoom: 2,
            });

            setMap(mapInstance);

            // Add temperature markers
            mapData?.forEach(({ lat, lon, temp, city }) => {
                const el = document.createElement('div');
                el.style.background = '#0e1f2c';
                el.style.color = 'white';
                el.style.padding = '5px';
                el.style.borderRadius = '5px';
                el.innerText = `${city} ${temp} ${displayUnit}`;

                new mapboxgl.Marker(el)
                    .setLngLat([lon, lat])
                    .addTo(mapInstance);
            });
        }
        setMapData(data);
        setDisplayUnit(displayBy);
    }, [data, displayBy, displayUnit, map, mapData]);
    return (
        <>
            <div
                ref={mapContainerRef}
                style={{ width: '100%', height: '500px' }}
            />
        </>
    );
};

export default TemperatureMap;
