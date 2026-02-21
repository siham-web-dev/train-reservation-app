"use client";

import React, { useRef, useEffect, useState } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';
import { MAP_TILER_API_KEY } from '@/app/config/constants';
import { createRoot } from 'react-dom/client';

// Dummy station data
const stations = [
    {
        id: 1,
        name: "Paris Gare de Lyon",
        lng: 2.3730,
        lat: 48.8443,
        email: "contact@garedelyon.fr",
        logo: "https://api.dicebear.com/7.x/initials/svg?seed=PGL",
        image: "https://images.unsplash.com/photo-1543884849-5cf292cce17b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        bookings: [
            { time: "08:30 AM", trainImage: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", dest: "Lyon" },
            { time: "11:15 AM", trainImage: "https://images.unsplash.com/photo-1551139459-7bb39dada531?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", dest: "Marseille" },
        ]
    },
    {
        id: 2,
        name: "Paris Gare du Nord",
        lng: 2.3553,
        lat: 48.8809,
        email: "info@garedunord.fr",
        logo: "https://api.dicebear.com/7.x/initials/svg?seed=PGN",
        image: "https://images.unsplash.com/photo-1558066373-addc4c70dcdc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        bookings: [
            { time: "09:00 AM", trainImage: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", dest: "London" },
            { time: "14:45 PM", trainImage: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", dest: "Brussels" },
        ]
    }
];

// Custom Popup Component
const StationPopup = ({ station }: { station: typeof stations[0] }) => (
    <div className="w-64 md:w-80 overflow-hidden bg-white flex flex-col justify-center items-center">
        <div className="h-32 w-full relative">
            <img src={station.image} alt={station.name} className="w-full h-full object-cover" />
            <div className="absolute -bottom-6 left-4 border-4 border-white rounded-full bg-white shadow-md z-10 w-14 h-14 flex items-center justify-center overflow-hidden">
                <img src={station.logo} alt="logo" className="w-10 h-10 object-contain" />
            </div>
        </div>
        <div className="pt-8 px-4 pb-4 w-full">
            <h3 className="text-lg font-bold text-gray-800 m-0 leading-tight">{station.name}</h3>
            <p className="text-sm text-gray-500 mb-4">{station.email}</p>

            <h4 className="font-semibold text-gray-700 text-sm mb-2 border-b border-gray-100 pb-1">Upcoming Departures</h4>
            <div className="space-y-3 max-h-40 overflow-y-auto pr-2">
                {station.bookings.map((b, i) => (
                    <div key={i} className="flex items-center gap-3 bg-gray-50 rounded p-2 border border-gray-100">
                        <img src={b.trainImage} alt="Train" className="w-12 h-8 object-cover rounded shadow-sm" />
                        <div>
                            <div className="font-semibold text-sm text-gray-800">{b.time}</div>
                            <div className="text-xs text-gray-500">To: <span className="font-medium text-gray-700">{b.dest}</span></div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 text-center">
                <a href={`/stations/${station.id}`} className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors shadow-sm">
                    View Full Schedule
                </a>
            </div>
        </div>
    </div>
);

export default function Map() {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<maptilersdk.Map | null>(null);
    const [zoom] = useState(11);

    useEffect(() => {
        if (map.current) return;
        if (!mapContainer.current) return;

        maptilersdk.config.apiKey = MAP_TILER_API_KEY!!;

        map.current = new maptilersdk.Map({
            container: mapContainer.current,
            style: maptilersdk.MapStyle.STREETS,
            center: [2.36, 48.86],
            zoom: zoom,
            geolocateControl: false,
        });

        stations.forEach(station => {
            const popupNode = document.createElement('div');
            // Give class to override maptiler default padding
            popupNode.className = 'custom-maptiler-popup';

            const root = createRoot(popupNode);
            root.render(<StationPopup station={station} />);

            const popup = new maptilersdk.Popup({ offset: 25, maxWidth: "320px", className: '!p-0 overflow-hidden rounded-xl shadow-xl' })
                .setDOMContent(popupNode);

            new maptilersdk.Marker({ color: "#2563eb" })
                .setLngLat([station.lng, station.lat])
                .setPopup(popup)
                .addTo(map.current!);
        });

        return () => {
            // Cleanup on unmount
            if (map.current) {
                map.current.remove();
                map.current = null;
            }
        };
    }, [zoom]);

    return (
        <div className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden shadow-inner border border-gray-200">
            <div ref={mapContainer} className="w-full h-full" />
        </div>
    );
}
