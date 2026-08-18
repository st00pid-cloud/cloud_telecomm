import React, { useState, useEffect } from 'react';
import { Typography, Box, Paper, Grid, CircularProgress } from '@mui/material';

export default function ExecutiveDashboard() {
    const [events, setEvents] = useState([]);
    const [sites, setSites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
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
                <Typography color="error">Error loading executive metrics: {error}</Typography>
            </Box>
        );
    }

    const totalSites = sites.length;
    const backupSites = sites.filter(s => s.backupAvailable).length;
    const uptimePercentage = totalSites > 0 ? ((backupSites / totalSites) * 100).toFixed(1) : 100;
    const activeOutages = events.filter(e => e.eventStatus === 'ACTIVE').length;

    return (
        <Box p={2}>
            <Box mb={4}>
                <Typography variant="h3" fontWeight="bold" letterSpacing="-1px" gutterBottom>
                    LGU Executive View
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    High-level network resilience, active outages, and regional connectivity metrics.
                </Typography>
            </Box>

            <Grid container spacing={4}>
                {/* Total Affected Users / Infrastructure KPI */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, height: '100%', minHeight: 200, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>Total Tracked Sites</Typography>
                        <Typography variant="h3" fontWeight="bold" color="primary.main">{totalSites}</Typography>
                        <Typography variant="caption" color="text.secondary" mt={1}>Monitored across regional nodes</Typography>
                    </Paper>
                </Grid>
                
                {/* Active Outages Summary */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, height: '100%', minHeight: 200, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>Active Hazard Outages</Typography>
                        <Typography variant="h3" fontWeight="bold" color="error.main">{activeOutages}</Typography>
                        <Typography variant="caption" color="text.secondary" mt={1}>Active disaster events impacting sectors</Typography>
                    </Paper>
                </Grid>

                {/* Regional Connectivity % */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, height: '100%', minHeight: 200, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>Network Survivability (Backup Ready)</Typography>
                        <Typography variant="h3" fontWeight="bold" color="success.main">{uptimePercentage}%</Typography>
                        <Typography variant="caption" color="text.secondary" mt={1}>{backupSites} of {totalSites} sites equipped with backup power</Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}