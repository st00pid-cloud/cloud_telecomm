import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet'; // Import Leaflet properly via npm module

export default function TelecomMapComponent() {
    const [sites, setSites] = useState([]);

    useEffect(() => {
        // 1. Initialize Leaflet Map securely inside the container
        const mapElement = document.getElementById('leaflet-map-container');
        if (!mapElement || mapElement._leaflet_id) return;

        const map = L.map('leaflet-map-container').setView([12.8797, 121.7740], 6);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap &copy; CARTO',
            maxZoom: 19
        }).addTo(map);

        // 2. Custom Apple-Inspired Marker Icon
        const customMarkerIcon = L.divIcon({
            className: 'custom-apple-marker',
            html: '<div style="background-color: #0a84ff; width: 12px; height: 12px; border-radius: 50%; border: 2px solid #ffffff; box-shadow: 0 0 10px rgba(10,132,255,0.8);"></div>',
            iconSize: [12, 12]
        });

        // 3. Fetch sites and plot them
        fetch('/api/sites')
            .then(res => res.json())
            .then(data => {
                setSites(data);
                data.forEach(site => {
                    if (site.latitude && site.longitude) {
                        L.marker([site.latitude, site.longitude], { icon: customMarkerIcon })
                          .bindPopup(`<strong>${site.siteId}</strong><br/>Municipality: ${site.municipality}`)
                          .addTo(map);
                    }
                });
            })
            .catch(err => console.error("Error loading map coordinates:", err));

        return () => {
            map.remove();
        };
    }, []);

    return (
        <Paper sx={{ p: 3, height: '450px', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" fontWeight="600" mb={2}>
                Live Infrastructure Map ({sites.length} Sites Tracked)
            </Typography>
            <Box id="leaflet-map-container" sx={{ flexGrow: 1, borderRadius: 2, overflow: 'hidden', width: '100%', height: '100%' }} />
        </Paper>
    );
}