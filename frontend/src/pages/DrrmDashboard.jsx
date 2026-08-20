import React, { useState, useEffect, useMemo } from 'react';
import {
    Typography, Box, Paper, Grid, List, ListItem, ListItemText,
    ListItemIcon, Chip, CircularProgress, Alert, IconButton,
    Tooltip, Stack, Divider
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CellTowerIcon from '@mui/icons-material/CellTower';
import BuildCircleIcon from '@mui/icons-material/BuildCircle';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DomainIcon from '@mui/icons-material/Domain';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { getDrrmDashboard } from '../api/telecomApi';

/* ------------------------------------------------------------------ */
/*  Shared style tokens — keep every card visually consistent          */
/* ------------------------------------------------------------------ */
const cardSx = {
    p: 3,
    borderRadius: 1,
    border: '1px solid',
    borderColor: 'divider',
    boxShadow: 'none',
    height: '100%',
};

// Maps a numeric priority score to a color so visual weight matches urgency
function getPriorityColor(score) {
    const num = Number(score);
    if (Number.isNaN(num)) return 'default';
    if (num >= 75) return 'error';
    if (num >= 40) return 'warning';
    return 'success';
}

// Maps fallback type text to a distinct color for quick pattern recognition
function getFallbackColor(fallback) {
    const normalized = (fallback || '').toLowerCase();
    if (normalized.includes('satellite')) return 'info';
    if (normalized.includes('generator') || normalized.includes('power')) return 'warning';
    if (normalized.includes('none') || normalized.includes('unavailable')) return 'error';
    return 'default';
}

function SectionHeader({ icon, title, count, action }) {
    return (
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
            {icon}
            <Typography variant="h6" sx={{ fontWeight: 700 }}>{title}</Typography>
            {typeof count === 'number' && (
                <Chip label={count} size="small" sx={{ ml: 1 }} />
            )}
            {action && <Box sx={{ ml: 'auto' }}>{action}</Box>}
        </Stack>
    );
}

function EmptyState({ message }) {
    return (
        <Stack alignItems="center" spacing={1} sx={{ py: 4, opacity: 0.6 }}>
            <DomainIcon fontSize="large" color="disabled" />
            <Typography color="text.secondary" variant="body2">{message}</Typography>
        </Stack>
    );
}

/* ------------------------------------------------------------------ */
/*  Small reusable KPI stat card                                       */
/* ------------------------------------------------------------------ */
function StatCard({ icon, value, label }) {
    return (
        <Paper variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5, height: '100%' }}>
            {icon}
            <Box>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>{value}</Typography>
                <Typography variant="caption" color="text.secondary">{label}</Typography>
            </Box>
        </Paper>
    );
}

export default function DrrmDashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortByPriority, setSortByPriority] = useState(true);

    useEffect(() => {
        getDrrmDashboard()
            .then(res => setData(res.data))
            .catch(err => {
                console.error(err);
                setError('Could not load DRRM dashboard. Is the backend running?');
            })
            .finally(() => setLoading(false));
    }, []);

    const sortedRestorationQueue = useMemo(() => {
        if (!data?.priorityRestorationQueue) return [];
        if (!sortByPriority) return data.priorityRestorationQueue;
        return [...data.priorityRestorationQueue].sort(
            (a, b) => Number(b.priorityScore) - Number(a.priorityScore)
        );
    }, [data, sortByPriority]);

    if (loading) {
        return (
            <Box p={3} display="flex" alignItems="center" gap={2}>
                <CircularProgress size={28} />
                <Typography color="text.secondary">Loading DRRM dashboard…</Typography>
            </Box>
        );
    }

    if (error) return <Box p={3}><Alert severity="error">{error}</Alert></Box>;

    const criticalFacilities = data.criticalFacilitiesAffected || [];
    const fallbackEntries = Object.entries(data.connectivityFallbackAvailability || {});

    return (
        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400, mx: 'auto' }}>
            {/* ---------------- Header ---------------- */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    DRRM Officer View
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', mt: 0.5 }}>
                    High-risk areas, critical facilities, and restoration priorities for local disaster response coordination.
                </Typography>
            </Box>

            {/* ---------------- Summary strip ---------------- */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={4}>
                    <StatCard
                        icon={<WarningAmberIcon color="error" />}
                        value={data.highRiskMunicipalities.length}
                        label="High-Risk Municipalities"
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <StatCard
                        icon={<DomainIcon color="warning" />}
                        value={criticalFacilities.length}
                        label="Critical Facilities Affected"
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <StatCard
                        icon={<BuildCircleIcon color="action" />}
                        value={data.priorityRestorationQueue.length}
                        label="Sites in Restoration Queue"
                    />
                </Grid>
            </Grid>

            {/* ---------------- Restoration Priority Queue (full width) ---------------- */}
            <Paper sx={{ ...cardSx, mb: 3 }}>
                <SectionHeader
                    icon={<BuildCircleIcon color="action" />}
                    title="Restoration Priority Queue"
                    count={sortedRestorationQueue.length}
                    action={
                        <Tooltip title="Toggle sort by priority score">
                            <IconButton
                                size="small"
                                onClick={() => setSortByPriority(prev => !prev)}
                                aria-label="Toggle sort by priority score"
                            >
                                <SwapVertIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    }
                />

                {sortedRestorationQueue.length === 0 ? (
                    <EmptyState message="No restoration items queued." />
                ) : (
                    <List dense sx={{ maxHeight: 460, overflowY: 'auto' }}>
                        {sortedRestorationQueue.map((item, i) => (
                            <ListItem
                                key={i}
                                disableGutters
                                alignItems="flex-start"
                                divider={i !== sortedRestorationQueue.length - 1}
                                sx={{ py: 1.25 }}
                                secondaryAction={
                                    <Chip
                                        label={item.priorityScore}
                                        size="small"
                                        color={getPriorityColor(item.priorityScore)}
                                        sx={{ fontWeight: 700 }}
                                        aria-label={`Priority score ${item.priorityScore} for site ${item.siteId}`}
                                    />
                                }
                            >
                                <ListItemText
                                    primary={item.siteId}
                                    primaryTypographyProps={{ fontWeight: 600 }}
                                    secondary={
                                        <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap sx={{ mt: 0.75 }}>
                                            <Chip label={item.severity} size="small" variant="outlined" />
                                            <Chip label={item.rootCause} size="small" variant="outlined" />
                                            <Chip label={`Risk: ${item.riskScore}`} size="small" variant="outlined" />
                                            <Chip
                                                label={item.fallbackStatus}
                                                size="small"
                                                variant="outlined"
                                                color={getFallbackColor(item.fallbackStatus)}
                                            />
                                        </Stack>
                                    }
                                    secondaryTypographyProps={{ component: 'div' }}
                                />
                            </ListItem>
                        ))}
                    </List>
                )}
            </Paper>

            {/* ---------------- High-Risk Municipalities + Connectivity Fallback Status ---------------- */}
            <Grid container spacing={2.5}>
                <Grid item xs={12} md={6}>
                    <Paper sx={cardSx}>
                        <SectionHeader
                            icon={<WarningAmberIcon color="error" />}
                            title="High-Risk Municipalities"
                            count={data.highRiskMunicipalities.length}
                        />
                        {data.highRiskMunicipalities.length === 0 ? (
                            <EmptyState message="No high-risk municipalities." />
                        ) : (
                            <List dense sx={{ maxHeight: 280, overflowY: 'auto' }}>
                                {data.highRiskMunicipalities.map((muni, i) => (
                                    <ListItem key={i} disableGutters>
                                        <ListItemIcon sx={{ minWidth: 32 }}>
                                            <LocationOnIcon fontSize="small" color="disabled" />
                                        </ListItemIcon>
                                        <ListItemText primary={muni} />
                                    </ListItem>
                                ))}
                            </List>
                        )}

                        {criticalFacilities.length > 0 && (
                            <>
                                <Divider sx={{ my: 1.5 }} />
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ fontWeight: 700 }}>
                                    Critical Facilities Affected
                                </Typography>
                                <List dense sx={{ maxHeight: 220, overflowY: 'auto' }}>
                                    {criticalFacilities.map((fac, i) => (
                                        <ListItem key={i} disableGutters>
                                            <ListItemIcon sx={{ minWidth: 32 }}>
                                                <DomainIcon fontSize="small" color="disabled" />
                                            </ListItemIcon>
                                            <ListItemText primary={fac} />
                                        </ListItem>
                                    ))}
                                </List>
                            </>
                        )}
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper sx={cardSx}>
                        <SectionHeader
                            icon={<CellTowerIcon color="info" />}
                            title="Connectivity Fallback Status"
                            count={fallbackEntries.length}
                        />
                        {fallbackEntries.length === 0 ? (
                            <EmptyState message="No fallback data available." />
                        ) : (
                            <List dense sx={{ maxHeight: 460, overflowY: 'auto' }}>
                                {fallbackEntries.map(([muni, fallback]) => (
                                    <ListItem
                                        key={muni}
                                        disableGutters
                                        divider
                                        secondaryAction={
                                            <Chip
                                                label={fallback}
                                                size="small"
                                                color={getFallbackColor(fallback)}
                                                sx={{ fontWeight: 600 }}
                                                aria-label={`Fallback status for ${muni}: ${fallback}`}
                                            />
                                        }
                                    >
                                        <ListItemText primary={muni} />
                                    </ListItem>
                                ))}
                            </List>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}
