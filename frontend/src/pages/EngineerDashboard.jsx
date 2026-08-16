import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Card, CardContent, Grid, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, Chip, TextField, CircularProgress, Stack
} from '@mui/material';
import { getSiteStatuses, getTelecomSites } from '../api/telecomApi';

export default function EngineerDashboard() {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDiagnostics = async () => {
            try {
                setLoading(true);
                const [statusRes, siteRes] = await Promise.all([
                    getSiteStatuses().catch(() => ({ data: [] })),
                    getTelecomSites().catch(() => ({ data: [] }))
                ]);

                const sitesMap = new Map((siteRes.data || []).map(s => [s.siteId, s]));
                const combined = (statusRes.data || []).map(stat => ({
                    ...stat,
                    meta: sitesMap.get(stat.siteId) || {}
                }));

                setData(combined);
            } catch (err) {
                console.error('Failed to load engineering telemetry:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDiagnostics();
    }, []);

    const filteredData = data.filter(item =>
        item.siteId?.toLowerCase().includes(search.toLowerCase()) ||
        item.meta?.municipality?.toLowerCase().includes(search.toLowerCase())
    );

    const getStatusChip = (status) => {
        const s = (status || '').toLowerCase();
        if (s === 'online' || s === 'up' || s === 'none') return <Chip label={status} color="success" size="small" />;
        if (s === 'unstable' || s === 'degraded' || s === 'minor') return <Chip label={status} color="warning" size="small" />;
        return <Chip label={status} color="error" size="small" sx={{ fontWeight: 'bold' }} />;
    };

    return (
        <Box>
            <Typography variant="h4" fontWeight="bold" mb={1}>Telecom Engineering Diagnostics</Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
                Infrastructure health monitoring, backhaul fiber cut tracking, and alternative channel status
            </Typography>

            <Grid container spacing={2} mb={3}>
                <Grid item xs={12} md={3}>
                    <Card sx={{ bgcolor: '#ffebee' }}>
                        <CardContent>
                            <Typography color="error" variant="subtitle2">Power Outages</Typography>
                            <Typography variant="h4" fontWeight="bold">
                                {data.filter(d => d.powerStatus === 'down').length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Card sx={{ bgcolor: '#fff3e0' }}>
                        <CardContent>
                            <Typography color="warning.main" variant="subtitle2">Fiber / Backhaul Cuts</Typography>
                            <Typography variant="h4" fontWeight="bold">
                                {data.filter(d => d.backhaulStatus === 'cut').length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Card sx={{ bgcolor: '#e8f5e9' }}>
                        <CardContent>
                            <Typography color="success.main" variant="subtitle2">Backup Available</Typography>
                            <Typography variant="h4" fontWeight="bold">
                                {data.filter(d => d.meta?.backupAvailable).length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Card sx={{ bgcolor: '#e3f2fd' }}>
                        <CardContent>
                            <Typography color="primary" variant="subtitle2">Total Monitored Sites</Typography>
                            <Typography variant="h4" fontWeight="bold">{data.length}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Box mb={2}>
                <TextField
                    label="Filter by Site ID or Municipality"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </Box>

            <TableContainer component={Paper} elevation={2}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#37474f' }}>
                        <TableRow>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Site ID</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Location</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Connectivity</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Power Status</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Backhaul Status</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Physical Damage</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Backup Support</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                                    <CircularProgress size={30} />
                                </TableCell>
                            </TableRow>
                        ) : filteredData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center">No diagnostic records matched.</TableCell>
                            </TableRow>
                        ) : (
                            filteredData.map((item) => (
                                <TableRow key={item.siteId} hover>
                                    <TableCell sx={{ fontWeight: 'bold' }}>{item.siteId}</TableCell>
                                    <TableCell>{item.meta?.municipality || 'N/A'}, {item.meta?.province || ''}</TableCell>
                                    <TableCell>{item.meta?.connectivityType || 'N/A'}</TableCell>
                                    <TableCell>{getStatusChip(item.powerStatus)}</TableCell>
                                    <TableCell>{getStatusChip(item.backhaulStatus)}</TableCell>
                                    <TableCell>{getStatusChip(item.physicalDamage)}</TableCell>
                                    <TableCell>
                                        {item.meta?.backupAvailable ? (
                                            <Chip label="Yes" color="success" variant="outlined" size="small" />
                                        ) : (
                                            <Chip label="No" color="default" variant="outlined" size="small" />
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}