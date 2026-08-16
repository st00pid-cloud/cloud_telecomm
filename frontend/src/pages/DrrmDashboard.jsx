import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Card, CardContent, Grid, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, Chip, Button, Dialog,
    DialogTitle, DialogContent, DialogActions, TextField, MenuItem,
    CircularProgress, Alert, Stack
} from '@mui/material';
import { processIncident, getScoreResults } from '../api/telecomApi';

export default function DrrmDashboard() {
    const [queue, setQueue] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Simulation Form State
    const [formData, setFormData] = useState({
        siteId: 'ILO-CELL-001',
        powerStatus: 'down',
        backhaulStatus: 'cut',
        physicalDamage: 'minor',
        affectedUsersEst: 3500,
    });

    const fetchQueueData = async () => {
        try {
            setLoading(true);
            const res = await getScoreResults();
            // Sort by priorityScore DESC
            const sorted = (res.data || []).sort((a, b) => b.priorityScore - a.priorityScore);
            setQueue(sorted);
            setError(null);
        } catch (err) {
            console.error('Failed to load priority queue:', err);
            setError('Unable to fetch priority queue from server.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQueueData();
    }, []);

    const handleSimulateSubmit = async () => {
        try {
            setSubmitting(true);
            await processIncident({
                ...formData,
                affectedUsersEst: parseInt(formData.affectedUsersEst, 10),
            });
            setOpenModal(false);
            await fetchQueueData(); // Refresh list after 201 Created
        } catch (err) {
            console.error('Failed to process incident simulation:', err);
            alert('Error submitting incident. Check backend console logs.');
        } finally {
            setSubmitting(false);
        }
    };

    const getSeverityChip = (severity) => {
        const sev = (severity || '').toUpperCase();
        let color = 'default';
        if (sev === 'CRITICAL') color = 'error';
        else if (sev === 'HIGH') color = 'warning';
        else if (sev === 'MEDIUM') color = 'info';
        else if (sev === 'LOW') color = 'success';

        return <Chip label={sev || 'UNKNOWN'} color={color} size="small" sx={{ fontWeight: 'bold' }} />;
    };

    return (
        <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                <Box>
                    <Typography variant="h4" fontWeight="bold">DRRM Restoration Priority Queue</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Automated priority ranking for emergency response and field team deployment
                    </Typography>
                </Box>
                <Button variant="contained" color="error" size="large" onClick={() => setOpenModal(true)}>
                    + Simulate Telemetry Incident
                </Button>
            </Stack>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <TableContainer component={Paper} elevation={2}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#1976d2' }}>
                        <TableRow>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Rank</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Site ID</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Priority Score</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Risk Score</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Severity</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Root Cause</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Fallback Channel</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Processed At</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                                    <CircularProgress size={30} />
                                </TableCell>
                            </TableRow>
                        ) : queue.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center">No priority records available.</TableCell>
                            </TableRow>
                        ) : (
                            queue.map((item, index) => (
                                <TableRow key={item.siteId || index} hover>
                                    <TableCell fontWeight="bold">#{index + 1}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>{item.siteId}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#d32f2f' }}>
                                        {item.priorityScore?.toFixed(1)}
                                    </TableCell>
                                    <TableCell>{item.riskScore?.toFixed(1)}</TableCell>
                                    <TableCell>{getSeverityChip(item.severity)}</TableCell>
                                    <TableCell>{item.rootCause}</TableCell>
                                    <TableCell>{item.fallbackStatus}</TableCell>
                                    <TableCell>{item.processedAt ? new Date(item.processedAt).toLocaleString() : 'N/A'}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Incident Simulation Modal */}
            <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 'bold' }}>Simulate Telemetry Outage Event</DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <TextField
                            label="Site ID"
                            fullWidth
                            value={formData.siteId}
                            onChange={(e) => setFormData({ ...formData, siteId: e.target.value })}
                        />
                        <TextField
                            select
                            label="Power Status"
                            fullWidth
                            value={formData.powerStatus}
                            onChange={(e) => setFormData({ ...formData, powerStatus: e.target.value })}
                        >
                            <MenuItem value="online">Online</MenuItem>
                            <MenuItem value="unstable">Unstable</MenuItem>
                            <MenuItem value="down">Down</MenuItem>
                        </TextField>
                        <TextField
                            select
                            label="Backhaul Status"
                            fullWidth
                            value={formData.backhaulStatus}
                            onChange={(e) => setFormData({ ...formData, backhaulStatus: e.target.value })}
                        >
                            <MenuItem value="online">Online</MenuItem>
                            <MenuItem value="degraded">Degraded</MenuItem>
                            <MenuItem value="cut">Cut</MenuItem>
                        </TextField>
                        <TextField
                            select
                            label="Physical Damage"
                            fullWidth
                            value={formData.physicalDamage}
                            onChange={(e) => setFormData({ ...formData, physicalDamage: e.target.value })}
                        >
                            <MenuItem value="none">None</MenuItem>
                            <MenuItem value="minor">Minor</MenuItem>
                            <MenuItem value="major">Major</MenuItem>
                        </TextField>
                        <TextField
                            label="Estimated Affected Users"
                            type="number"
                            fullWidth
                            value={formData.affectedUsersEst}
                            onChange={(e) => setFormData({ ...formData, affectedUsersEst: e.target.value })}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenModal(false)}>Cancel</Button>
                    <Button variant="contained" color="error" onClick={handleSimulateSubmit} disabled={submitting}>
                        {submitting ? <CircularProgress size={20} /> : 'Submit Simulation'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}