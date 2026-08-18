import React, { useState, useEffect } from 'react';
import { Typography, Box, Paper, Grid, Stack, CircularProgress, Chip } from '@mui/material';
import TelecomMapComponent from './TelecomMapComponent';

export default function DrrmDashboard() {
    const [events, setEvents] = useState([]);
    const [sites, setSites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch both disaster events and site infrastructure concurrently
        Promise.all([
            fetch('/api/events').then(res => res.ok ? res.json() : Promise.reject('Failed to fetch events')),
            fetch('/api/sites').then(res => res.ok ? res.json() : Promise.reject('Failed to fetch sites'))
        ])
        .then(([eventsData, sitesData]) => {
            setEvents(eventsData);
            setSites(sitesData);
            setLoading(false);
        })
        .catch(err => {
            setError(err);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box p={2}>
                <Typography color="error">Error connecting to backend services: {error}</Typography>
            </Box>
        );
    }

    // Filter or highlight high-risk items (e.g., severe exposure or active status)
    const highRiskEvents = events.filter(e => e.eventStatus === 'ACTIVE' || e.hazardExposure === 'HIGH');

    return (
        <Box p={2}>
            <Box mb={4}>
                <Typography variant="h3" fontWeight="bold" letterSpacing="-1px" gutterBottom>
                    DRRM Officer View
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Real-time disaster telemetry and municipal vulnerability queue.
                </Typography>
            </Box>

            <Grid container spacing={4}>
                {/* High-Risk Municipalities / Events Queue */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, height: '100%', minHeight: 350, display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h6" fontWeight="600" mb={2}>
                            High-Risk Active Queue
                        </Typography>
                        <Stack spacing={2} sx={{ overflowY: 'auto', maxHeight: 400 }}>
                            {highRiskEvents.length === 0 ? (
                                <Typography variant="body2" color="text.secondary">No high-risk anomalies currently recorded.</Typography>
                            ) : (
                                highRiskEvents.map(event => (
                                    <Box key={event.eventId} p={2} sx={{ bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 2, border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                            <Typography variant="subtitle2" fontWeight="bold">{event.eventName}</Typography>
                                            <Chip label={event.eventStatus} size="small" color="error" variant="outlined" />
                                        </Box>
                                        <Typography variant="body2" color="text.secondary">Region: {event.affectedRegion}</Typography>
                                        <Typography variant="body2" color="text.secondary">Hazard: {event.hazardType}</Typography>
                                    </Box>
                                ))
                            )}
                        </Stack>
                    </Paper>
                </Grid>
                
                {/* Integrated Interactive Leaflet Map Component */}
                <Grid item xs={12} md={8}>
                    <TelecomMapComponent />
                </Grid>

                {/* Restoration Priority Queue */}
                <Grid item xs={12} md={12}>
                    <Paper sx={{ p: 3, minHeight: 250, display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h6" fontWeight="600" mb={2}>
                            Restoration Priority Queue
                        </Typography>
                        <Grid container spacing={2}>
                            {sites.slice(0, 4).map(site => (
                                <Grid item xs={12} sm={6} md={3} key={site.siteId}>
                                    <Box p={2} sx={{ bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 2, border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <Typography variant="subtitle2" fontWeight="bold">{site.siteId}</Typography>
                                        <Typography variant="body2" color="text.secondary">{site.municipality}, {site.province}</Typography>
                                        <Typography variant="caption" color="primary.main" display="block" mt={1}>
                                            Provider: {site.providerType}
                                        </Typography>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}