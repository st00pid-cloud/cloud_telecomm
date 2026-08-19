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
import RefreshIcon from '@mui/icons-material/Refresh';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { getDrrmDashboard } from '../api/telecomApi';

// Maps disaster status text to a color and icon-ready severity level
function getStatusStyle(status) {
  const normalized = (status || '').toLowerCase();
  if (normalized.includes('critical') || normalized.includes('severe')) {
    return { color: 'error', label: status };
  }
  if (normalized.includes('warning') || normalized.includes('watch') || normalized.includes('elevated')) {
    return { color: 'warning', label: status };
  }
  if (normalized.includes('normal') || normalized.includes('clear') || normalized.includes('stable')) {
    return { color: 'success', label: status };
  }
  return { color: 'default', label: status || 'Unknown' };
}

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

function SectionHeader({ icon, title, count }) {
  return (
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
        {icon}
        <Typography variant="h6">{title}</Typography>
        {typeof count === 'number' && (
            <Chip label={count} size="small" sx={{ ml: 'auto' }} />
        )}
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

export default function DrrmDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [sortByPriority, setSortByPriority] = useState(true);

  const loadDashboard = () => {
    setLoading(true);
    setError(null);
    getDrrmDashboard()
        .then(res => {
          setData(res.data);
          setLastUpdated(new Date());
        })
        .catch(err => {
          console.error(err);
          setError('Could not load DRRM dashboard. Is the backend running?');
        })
        .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadDashboard();
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

  const statusStyle = getStatusStyle(data.disasterStatus);
  const criticalFacilities = data.criticalFacilitiesAffected || [];
  const fallbackEntries = Object.entries(data.connectivityFallbackAvailability || {});

  return (
      <Box p={3}>
        {/* Header */}
        <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'flex-start', sm: 'center' },
              justifyContent: 'space-between',
              width: '100%',
              gap: 2,
              mb: 1,
            }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h4" gutterBottom>DRRM Officer View</Typography>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="subtitle1" color="text.secondary">Status:</Typography>
              <Chip label={statusStyle.label} color={statusStyle.color} size="small" />
            </Stack>
          </Box>

          <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{
                flexShrink: 0,
                alignSelf: { xs: 'flex-start', sm: 'center' },
                bgcolor: 'grey.50',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 5,
                pl: 2,
                pr: 0.5,
                py: 0.5,
              }}
          >
            {lastUpdated && (
                <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </Typography>
            )}
            <Tooltip title="Refresh dashboard">
              <IconButton onClick={loadDashboard} aria-label="Refresh dashboard data" size="small">
                <RefreshIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>

        {/* Summary strip */}
        <Grid container spacing={2} sx={{ my: 2 }}>
          <Grid item xs={12} sm={4}>
            <Paper variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <WarningAmberIcon color="error" />
              <Box>
                <Typography variant="h5">{data.highRiskMunicipalities.length}</Typography>
                <Typography variant="caption" color="text.secondary">High-Risk Municipalities</Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <DomainIcon color="warning" />
              <Box>
                <Typography variant="h5">{criticalFacilities.length}</Typography>
                <Typography variant="caption" color="text.secondary">Critical Facilities Affected</Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <BuildCircleIcon color="action" />
              <Box>
                <Typography variant="h5">{data.priorityRestorationQueue.length}</Typography>
                <Typography variant="caption" color="text.secondary">Sites in Restoration Queue</Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* High-Risk Municipalities */}
          <Grid item xs={12} md={3.5}>
            <Paper sx={{ p: 2, height: '100%' }}>
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
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Critical Facilities Affected
                    </Typography>
                    <List dense sx={{ maxHeight: 180, overflowY: 'auto' }}>
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

          {/* Connectivity Fallback Status */}
          <Grid item xs={12} md={3.5}>
            <Paper sx={{ p: 2, height: '100%' }}>
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
                            secondaryAction={
                              <Chip
                                  label={fallback}
                                  size="small"
                                  color={getFallbackColor(fallback)}
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

          {/* Restoration Priority Queue */}
          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
                <BuildCircleIcon color="action" />
                <Typography variant="h6">Restoration Priority Queue</Typography>
                <Chip label={sortedRestorationQueue.length} size="small" sx={{ ml: 1 }} />
                <Tooltip title="Toggle sort by priority score">
                  <IconButton
                      size="small"
                      sx={{ ml: 'auto' }}
                      onClick={() => setSortByPriority(prev => !prev)}
                      aria-label="Toggle sort by priority score"
                  >
                    <SwapVertIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>

              {sortedRestorationQueue.length === 0 ? (
                  <EmptyState message="No restoration items queued." />
              ) : (
                  <List dense sx={{ maxHeight: 460, overflowY: 'auto' }}>
                    {sortedRestorationQueue.map((item, i) => (
                        <ListItem
                            key={i}
                            disableGutters
                            alignItems="flex-start"
                            secondaryAction={
                              <Chip
                                  label={item.priorityScore}
                                  size="small"
                                  color={getPriorityColor(item.priorityScore)}
                                  aria-label={`Priority score ${item.priorityScore} for site ${item.siteId}`}
                              />
                            }
                        >
                          <ListItemText
                              primary={item.siteId}
                              secondary={
                                <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ mt: 0.5 }}>
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
          </Grid>
        </Grid>
      </Box>
  );
}
