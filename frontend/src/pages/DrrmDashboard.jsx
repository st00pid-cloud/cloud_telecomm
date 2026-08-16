// pages/DrrmDashboard.jsx
import React from 'react';
import { Box, Grid, Card, Table, TableHead, TableBody, TableRow, TableCell, Stack, Typography } from '@mui/material';
import SectionHeader from '../components/SectionHeader';
import KpiCard from '../components/KpiCard';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";

const restorationQueue = [
    { site: 'Brgy. San Fernando Cell Site', municipality: 'La Union', priority: 1, status: 'critical' },
    { site: 'Bauang Relay Tower', municipality: 'La Union', priority: 2, status: 'warning' },
    { site: 'Agoo Backhaul Node', municipality: 'La Union', priority: 3, status: 'warning' },
];

export default function DrrmDashboard() {
    const hasQueue = restorationQueue.length > 0;

    return (
        <Box>
            <SectionHeader title="DRRM Operations" subtitle="High-risk municipalities and restoration priorities" />

            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={4}>
                    <KpiCard label="High-Risk Municipalities" value="6" status="critical" />
                </Grid>
                <Grid item xs={12} md={4}>
                    <KpiCard label="Fallback Connectivity Active" value="9" unit="sites" status="warning" />
                </Grid>
                <Grid item xs={12} md={4}>
                    <KpiCard label="Pending Restoration Tasks" value={restorationQueue.length} status="info" />
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item xs={12} md={7}>
                    <Card sx={{ p: 0 }}>
                        <Box sx={{ px: 2.5, pt: 2 }}>
                            <Typography variant="h6">Restoration Priority Queue</Typography>
                        </Box>
                        {hasQueue ? (
                            <Table size="small" sx={{ mt: 1 }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Priority</TableCell>
                                        <TableCell>Site</TableCell>
                                        <TableCell>Municipality</TableCell>
                                        <TableCell>Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {restorationQueue.map((row) => (
                                        <TableRow key={row.site}>
                                            <TableCell>{row.priority}</TableCell>
                                            <TableCell>{row.site}</TableCell>
                                            <TableCell>{row.municipality}</TableCell>
                                            <TableCell><StatusBadge status={row.status} /></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <EmptyState
                                icon={<CheckCircleOutlineIcon fontSize="small" />}
                                title="No Restoration Tasks Pending"
                                description="Current restoration queue is empty. No critical outages require dispatch."
                            />
                        )}
                    </Card>
                </Grid>
                <Grid item xs={12} md={5}>
                    <Card sx={{ p: 2.5, height: '100%' }}>
                        <Typography variant="h6" sx={{ mb: 1.5 }}>Connectivity Fallback Status</Typography>
                        <Stack spacing={1}>
                            <Typography variant="body2" color="text.secondary">
                                Map / fallback status visualization goes here — wire up existing geo data source.
                            </Typography>
                        </Stack>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}