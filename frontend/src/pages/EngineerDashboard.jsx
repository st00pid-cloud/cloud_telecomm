// pages/EngineerDashboard.jsx
import React from 'react';
import { Box, Grid, Card, Table, TableHead, TableBody, TableRow, TableCell, Stack, TextField, MenuItem, Typography } from '@mui/material';
import SectionHeader from '../components/SectionHeader';
import KpiCard from '../components/KpiCard';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import SettingsSuggestOutlinedIcon from '@mui/icons-material/SettingsSuggestOutlined';

const incidents = [
    { site: 'Rosario Cell Site 04', cause: 'Power Failure', status: 'critical' },
    { site: 'Naguilian Backhaul Link', cause: 'Backhaul Loss', status: 'warning' },
    { site: 'Bacnotan Tower B', cause: 'Physical Damage', status: 'critical' },
];

export default function EngineerDashboard() {
    const hasIncidents = incidents.length > 0;

    return (
        <Box>
            <SectionHeader
                title="Telecom Engineering"
                subtitle="Infrastructure diagnostics and restoration priorities"
                actions={
                    <Stack direction="row" spacing={1.5}>
                        <TextField select size="small" defaultValue="all" sx={{ minWidth: 160 }} label="Root cause">
                            <MenuItem value="all">All causes</MenuItem>
                            <MenuItem value="power">Power Failure</MenuItem>
                            <MenuItem value="backhaul">Backhaul Loss</MenuItem>
                            <MenuItem value="damage">Physical Damage</MenuItem>
                        </TextField>
                        <TextField select size="small" defaultValue="all" sx={{ minWidth: 160 }} label="Status">
                            <MenuItem value="all">All statuses</MenuItem>
                            <MenuItem value="critical">Critical</MenuItem>
                            <MenuItem value="warning">Warning</MenuItem>
                        </TextField>
                    </Stack>
                }
            />

            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={3}>
                    <KpiCard label="Connectivity Issues" value="14" status="critical" />
                </Grid>
                <Grid item xs={12} md={3}>
                    <KpiCard label="Power Failures" value="9" status="warning" />
                </Grid>
                <Grid item xs={12} md={3}>
                    <KpiCard label="Backhaul Problems" value="5" status="warning" />
                </Grid>
                <Grid item xs={12} md={3}>
                    <KpiCard label="Physical Damage" value="3" status="critical" />
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                    <Card sx={{ p: 0 }}>
                        <Box sx={{ px: 2.5, pt: 2 }}>
                            <Typography variant="h6">Site-Level Incidents</Typography>
                        </Box>
                        {hasIncidents ? (
                            <Table size="small" sx={{ mt: 1 }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Site</TableCell>
                                        <TableCell>Root Cause</TableCell>
                                        <TableCell>Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {incidents.map((row) => (
                                        <TableRow key={row.site}>
                                            <TableCell>{row.site}</TableCell>
                                            <TableCell>{row.cause}</TableCell>
                                            <TableCell><StatusBadge status={row.status} /></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <EmptyState
                                icon={<SettingsSuggestOutlinedIcon fontSize="small" />}
                                title="No Active Infrastructure Incidents"
                                description="All monitored telecom assets are operating normally based on available telemetry."
                            />
                        )}
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card sx={{ p: 2.5, height: '100%' }}>
                        <Typography variant="h6" sx={{ mb: 1.5 }}>Root Cause Distribution</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Chart goes here — wire up existing distribution data source.
                        </Typography>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}