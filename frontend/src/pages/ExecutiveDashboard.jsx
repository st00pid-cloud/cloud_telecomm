import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Card, CardContent, Grid, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, Chip, LinearProgress, Stack
} from '@mui/material';
import { getSiteStatuses, getScoreResults } from '../api/telecomApi';

export default function ExecutiveDashboard() {
    const [metrics, setMetrics] = useState({
        totalImpactedUsers: 0,
        criticalOutages: 0,
        highRiskSites: 0,
        avgPriorityScore: 0,
    });
    const [criticalList, setCriticalList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExecutiveMetrics = async () => {
            try {
                setLoading(true);
                const [statusRes, scoreRes] = await Promise.all([
                    getSiteStatuses().catch(() => ({ data: [] })),
                    getScoreResults().catch(() => ({ data: [] })),
                ]);

                const statuses = statusRes.data || [];
                const scores = scoreRes.data || [];

                const totalUsers = statuses.reduce((acc, curr) => acc + (curr.affectedUsersEst || 0), 0);
                const criticalCount = scores.filter(s => (s.severity || '').toUpperCase() === 'CRITICAL').length;
                const highRiskCount = scores.filter(s => (s.riskScore || 0) >= 70).length;
                const avgPriority = scores.length
                    ? scores.reduce((acc, curr) => acc + (curr.priorityScore || 0), 0) / scores.length
                    : 0;

                setMetrics({
                    totalImpactedUsers: totalUsers,
                    criticalOutages: criticalCount,
                    highRiskSites: highRiskCount,
                    avgPriorityScore: avgPriority,
                });

                // Top critical score entries
                setCriticalList(scores.filter(s => (s.severity || '').toUpperCase() === 'CRITICAL').slice(0, 5));
            } catch (err) {
                console.error('Failed to calculate executive metrics:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchExecutiveMetrics();
    }, []);

    return (
        <Box>
            <Typography variant="h4" fontWeight="bold" mb={1}>LGU Executive Command Overview</Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
                High-level disaster response intelligence, population exposure, and operational vulnerability summary
            </Typography>

            {/* Disaster Event Banner */}
            <Paper sx={{ p: 2, mb: 3, backgroundColor: '#212121', color: '#fff' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                        <Typography variant="subtitle2" sx={{ color: '#ffb74d' }}>ACTIVE DISASTER EVENT</Typography>
                        <Typography variant="h5" fontWeight="bold">Typhoon Uwan (EVT-2026-TY01)</Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>Affected Region: Region VI (Western Visayas) | Hazard Exposure: High</Typography>
                    </Box>
                    <Chip label="ACTIVE DISASTER" color="error" sx={{ fontWeight: 'bold' }} />
                </Stack>
            </Paper>

            {/* KPI Overview Cards */}
            <Grid container spacing={3} mb={4}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card elevation={3} sx={{ borderLeft: '6px solid #d32f2f' }}>
                        <CardContent>
                            <Typography color="text.secondary" variant="subtitle2">Total Impacted Population</Typography>
                            <Typography variant="h3" fontWeight="bold" color="error">
                                {metrics.totalImpactedUsers.toLocaleString()}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">Estimated citizens affected by downtime</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card elevation={3} sx={{ borderLeft: '6px solid #ed6c02' }}>
                        <CardContent>
                            <Typography color="text.secondary" variant="subtitle2">Critical Outages</Typography>
                            <Typography variant="h3" fontWeight="bold" color="warning.main">
                                {metrics.criticalOutages}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">Cell towers requiring immediate dispatch</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card elevation={3} sx={{ borderLeft: '6px solid #0288d1' }}>
                        <CardContent>
                            <Typography color="text.secondary" variant="subtitle2">High Vulnerability Sites</Typography>
                            <Typography variant="h3" fontWeight="bold" color="info.main">
                                {metrics.highRiskSites}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">Risk score &ge; 70.0</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card elevation={3} sx={{ borderLeft: '6px solid #2e7d32' }}>
                        <CardContent>
                            <Typography color="text.secondary" variant="subtitle2">Avg Restoration Priority Index</Typography>
                            <Typography variant="h3" fontWeight="bold" color="success.main">
                                {metrics.avgPriorityScore.toFixed(1)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">System-wide score aggregate</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Critical Sites Table */}
            <Typography variant="h6" fontWeight="bold" mb={2}>Top Priority Incident Dispatch List</Typography>
            <TableContainer component={Paper} elevation={2}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#263238' }}>
                        <TableRow>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Site ID</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Priority Score</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Risk Score</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Root Cause Diagnosis</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                                    <LinearProgress />
                                </TableCell>
                            </TableRow>
                        ) : criticalList.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">No critical outages recorded.</TableCell>
                            </TableRow>
                        ) : (
                            criticalList.map((site) => (
                                <TableRow key={site.siteId} hover>
                                    <TableCell sx={{ fontWeight: 'bold' }}>{site.siteId}</TableCell>
                                    <TableCell sx={{ color: '#d32f2f', fontWeight: 'bold' }}>{site.priorityScore?.toFixed(1)}</TableCell>
                                    <TableCell>{site.riskScore?.toFixed(1)}</TableCell>
                                    <TableCell>{site.rootCause}</TableCell>
                                    <TableCell><Chip label="CRITICAL" color="error" size="small" sx={{ fontWeight: 'bold' }} /></TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}