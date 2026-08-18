import React, { useState, useEffect } from 'react';
import { Typography, Box, Paper, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, CircularProgress } from '@mui/material';

export default function EngineerDashboard() {
    const [sites, setSites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('/api/sites')
            .then(res => res.ok ? res.json() : Promise.reject('Failed to fetch site infrastructure'))
            .then(data => {
                setSites(data);
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
                <Typography color="error">Error loading engineer telemetry: {error}</Typography>
            </Box>
        );
    }

    return (
        <Box p={2}>
            <Box mb={4}>
                <Typography variant="h3" fontWeight="bold" letterSpacing="-1px" gutterBottom>
                    Telecom Engineer View
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Detailed site-level incident telemetry and infrastructure diagnostics.
                </Typography>
            </Box>

            <Grid container spacing={4}>
                {/* Site-Level Incident Table */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 3, minHeight: 400 }}>
                        <Typography variant="h6" fontWeight="600" mb={2}>
                            Site Infrastructure & Status Indicators
                        </Typography>
                        <TableContainer sx={{ maxHeight: 450 }}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ bgcolor: 'background.paper', fontWeight: 'bold' }}>Site ID</TableCell>
                                        <TableCell sx={{ bgcolor: 'background.paper', fontWeight: 'bold' }}>Location</TableCell>
                                        <TableCell sx={{ bgcolor: 'background.paper', fontWeight: 'bold' }}>Connectivity</TableCell>
                                        <TableCell sx={{ bgcolor: 'background.paper', fontWeight: 'bold' }}>Backup Power</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {sites.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} align="center">No telecom sites registered.</TableCell>
                                        </TableRow>
                                    ) : (
                                        sites.map(site => (
                                            <TableRow key={site.siteId} hover>
                                                <TableCell>{site.siteId}</TableCell>
                                                <TableCell>{site.municipality}, {site.province}</TableCell>
                                                <TableCell>{site.connectivityType}</TableCell>
                                                <TableCell>
                                                    <Chip 
                                                        label={site.backupAvailable ? "Available" : "None"} 
                                                        color={site.backupAvailable ? "success" : "error"} 
                                                        size="small" 
                                                        variant="outlined"
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
                
                {/* Root Cause Distribution / Diagnostics Summary */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, height: '100%', minHeight: 400, display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h6" fontWeight="600" mb={2}>
                            Power & Provider Distribution
                        </Typography>
                        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 2 }}>
                            <Box p={2} sx={{ bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 2 }}>
                                <Typography variant="body2" color="text.secondary">Total Monitored Sites</Typography>
                                <Typography variant="h4" fontWeight="bold" mt={0.5}>{sites.length}</Typography>
                            </Box>
                            <Box p={2} sx={{ bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 2 }}>
                                <Typography variant="body2" color="text.secondary">Sites with Generator/Backup</Typography>
                                <Typography variant="h4" fontWeight="bold" color="success.main" mt={0.5}>
                                    {sites.filter(s => s.backupAvailable).length}
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}