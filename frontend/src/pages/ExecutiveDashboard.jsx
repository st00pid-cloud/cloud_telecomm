// pages/ExecutiveDashboard.jsx
import React from 'react';
import { Box, Grid, Card, Stack, Typography, Divider } from '@mui/material';
import SectionHeader from '../components/SectionHeader';
import KpiCard from '../components/KpiCard';
import StatusBadge from '../components/StatusBadge';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';

export default function ExecutiveDashboard() {
    return (
        <Box>
            {/* Operational Status Hero Card — replaces the old black banner */}
            <Card sx={{ p: 3, mb: 3 }}>
                <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
                    <Stack spacing={1}>
                        <Stack direction="row" alignItems="center" spacing={1.5}>
                            <StatusBadge status="critical" label="Active Disaster Event" />
                            <Typography variant="caption" color="text.secondary">
                                Updated 4 min ago
                            </Typography>
                        </Stack>
                        <Typography variant="h5">Typhoon Signal No. 3 — Region I</Typography>
                        <Stack direction="row" spacing={0.5} alignItems="center" color="text.secondary">
                            <PlaceOutlinedIcon sx={{ fontSize: 16 }} />
                            <Typography variant="body2" color="text.secondary">
                                12 municipalities affected · La Union, Pangasinan, Ilocos Sur
                            </Typography>
                        </Stack>
                    </Stack>
                    <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />
                    <Stack direction="row" spacing={4}>
                        <Stack spacing={0.25}>
                            <Typography variant="caption" color="text.secondary">Severity</Typography>
                            <Typography sx={{ fontWeight: 600, color: 'error.main' }}>High</Typography>
                        </Stack>
                        <Stack spacing={0.25}>
                            <Typography variant="caption" color="text.secondary">Response Posture</Typography>
                            <Typography sx={{ fontWeight: 600 }}>Active Response</Typography>
                        </Stack>
                    </Stack>
                </Stack>
            </Card>

            <SectionHeader title="Key Metrics" subtitle="Live service impact across affected regions" />
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={4}>
                    <KpiCard label="Total Affected Users" value="184,300" status="critical" />
                </Grid>
                <Grid item xs={12} md={4}>
                    <KpiCard label="Active Outages" value="27" unit="sites" status="warning" />
                </Grid>
                <Grid item xs={12} md={4}>
                    <KpiCard label="Regional Connectivity" value="68" unit="%" status="info" />
                </Grid>
            </Grid>

            <SectionHeader title="Detailed Data" subtitle="Drill into affected areas and restoration status" />
            <Card sx={{ p: 3 }}>
                <Typography variant="body2" color="text.secondary">
                    Regional breakdown table / priority area list goes here — wire up existing data source.
                </Typography>
            </Card>
        </Box>
    );
}