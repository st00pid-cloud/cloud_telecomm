import React, { useState, useEffect, useMemo } from 'react';
import {
  Typography, Box, Paper, Grid, Table, TableBody, TableCell, TableHead,
  TableRow, Chip, CircularProgress, Alert, Stack, Divider, LinearProgress
} from '@mui/material';
import CellTowerRoundedIcon from '@mui/icons-material/CellTowerRounded';
import SignalWifiOffRoundedIcon from '@mui/icons-material/SignalWifiOffRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import { getEngineerDashboard } from '../api/telecomApi';

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

const sectionTitleSx = {
  fontWeight: 700,
  mb: 2,
};

/* ------------------------------------------------------------------ */
/*  Severity → color / priority mapping                                */
/* ------------------------------------------------------------------ */
const SEVERITY_META = {
  critical: { color: 'error', priority: 'P1' },
  high: { color: 'warning', priority: 'P2' },
  medium: { color: 'info', priority: 'P3' },
  low: { color: 'success', priority: 'P4' },
};

function getSeverityMeta(severity) {
  const key = (severity || '').toLowerCase();
  return SEVERITY_META[key] || { color: 'default', priority: '—' };
}

/* ------------------------------------------------------------------ */
/*  Region code → full name / description mapping                      */
/*  Extend this map as new site-ID prefixes are introduced.            */
/* ------------------------------------------------------------------ */
const REGION_META = {
  ILO: {
    name: 'Iloilo',
    description: 'Province in Western Visayas; highest incident concentration in this report.',
  },
  ANT: {
    name: 'Antique',
    description: 'Province in Western Visayas along the western coast of Panay Island.',
  },
  CAP: {
    name: 'Capiz',
    description: 'Province in Western Visayas, northern coast of Panay Island.',
  },
  AKL: {
    name: 'Aklan',
    description: 'Province in Western Visayas, home to Boracay Island.',
  },
  NEG: {
    name: 'Negros',
    description: 'Island province group (Occidental/Oriental) in the Visayas.',
  },
  UNK: {
    name: 'Unknown',
    description: 'Site ID did not include a recognizable region prefix.',
  },
};

function getRegionMeta(code) {
  return (
      REGION_META[code] || {
        name: code,
        description: 'Region code derived from the Site ID prefix.',
      }
  );
}

/* ------------------------------------------------------------------ */
/*  Small reusable KPI stat card — pill style (icon chip + value)       */
/* ------------------------------------------------------------------ */
function StatCard({ label, value, accentColor, bgColor, borderColor, icon }) {
  return (
      <Box
          sx={{
            p: 2.5,
            borderRadius: 2.5,
            backgroundColor: bgColor,
            border: `1px solid ${borderColor}`,
            height: '100%',
            width: '100%',
            boxSizing: 'border-box',
            textAlign: 'center',
          }}
      >
        <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              backgroundColor: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 1.5,
              boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
            }}
        >
          {icon}
        </Box>
        <Typography
            variant="body2"
            sx={{ color: 'text.secondary', fontWeight: 600, mb: 0.5 }}
        >
          {label}
        </Typography>
        <Typography
            variant="h4"
            sx={{ fontWeight: 700, color: accentColor, lineHeight: 1.2 }}
        >
          {value}
        </Typography>
      </Box>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */
export default function EngineerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getEngineerDashboard()
        .then((res) => setData(res.data))
        .catch((err) => {
          console.error(err);
          setError('Could not load Engineer dashboard. Is the backend running?');
        })
        .finally(() => setLoading(false));
  }, []);

  /* ---------------- Derived metrics (memoized) ---------------- */
  const metrics = useMemo(() => {
    if (!data) return null;

    const { siteIncidentTable, infrastructureStatusSummary } = data;

    const activeSites = infrastructureStatusSummary.activeSites || 0;
    const downSites = infrastructureStatusSummary.downSites || 0;
    const totalSites = activeSites + downSites;
    const recoveryRate =
        totalSites > 0 ? Math.round((activeSites / totalSites) * 100) : 0;

    const criticalCount = siteIncidentTable.filter(
        (s) => (s.severity || '').toLowerCase() === 'critical'
    ).length;
    const highCount = siteIncidentTable.filter(
        (s) => (s.severity || '').toLowerCase() === 'high'
    ).length;

    // Derive an affected-region summary from the Site ID prefix
    // e.g. "ANT-CELL-007" -> region "ANT"
    const regionCounts = siteIncidentTable.reduce((acc, item) => {
      const region = (item.siteId || '').split('-')[0] || 'UNK';
      acc[region] = (acc[region] || 0) + 1;
      return acc;
    }, {});
    const topRegions = Object.entries(regionCounts).sort(
        (a, b) => b[1] - a[1]
    );

    return {
      activeSites,
      downSites,
      totalSites,
      recoveryRate,
      criticalCount,
      highCount,
      topRegions,
    };
  }, [data]);

  /* ---------------- Loading / error states ---------------- */
  if (loading) {
    return (
        <Box
            p={3}
            display="flex"
            alignItems="center"
            justifyContent="center"
            minHeight="60vh"
        >
          <CircularProgress />
        </Box>
    );
  }

  if (error) {
    return (
        <Box p={3}>
          <Alert severity="error">{error}</Alert>
        </Box>
    );
  }

  const { siteIncidentTable, rootCauseCounts } = data;

  return (
      <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400, mx: 'auto' }}>
        {/* ---------------- Header ---------------- */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Network Engineering Center
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Real-time infrastructure health, active incidents, and restoration
            progress.
          </Typography>
        </Box>

        {/* ---------------- Affected Regions Summary (moved to top) ---------------- */}
        <Paper sx={{ ...cardSx, mb: 3 }}>
          <Typography variant="h6" sx={sectionTitleSx}>
            Affected Regions Summary
          </Typography>
          <Grid container spacing={3}>
            {/* ----- Left: region stat boxes ----- */}
            <Grid item xs={12} md={7}>
              <Grid container spacing={2}>
                {metrics.topRegions.map(([region, count]) => (
                    <Grid item xs={6} sm={4} key={region}>
                      <Box
                          sx={{
                            p: 2,
                            borderRadius: 1,
                            border: '1px solid',
                            borderColor: 'divider',
                            textAlign: 'center',
                          }}
                      >
                        <Typography
                            variant="body2"
                            sx={{ color: 'text.secondary', fontWeight: 600 }}
                        >
                          {region}
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          {count}
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{ color: 'text.secondary' }}
                        >
                          incident{count === 1 ? '' : 's'}
                        </Typography>
                      </Box>
                    </Grid>
                ))}
              </Grid>
            </Grid>

            {/* ----- Right: what the region codes mean ----- */}
            <Grid item xs={12} md={5}>
              <Box
                  sx={{
                    pl: { xs: 0, md: 3 },
                    borderLeft: { xs: 'none', md: '1px solid' },
                    borderColor: { md: 'divider' },
                    height: '100%',
                  }}
              >
                <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      color: 'text.secondary',
                      textTransform: 'uppercase',
                      display: 'block',
                      mb: 1,
                    }}
                >
                  What these codes mean
                </Typography>
                <Stack spacing={1.25}>
                  {metrics.topRegions.map(([region]) => {
                    const meta = getRegionMeta(region);
                    return (
                        <Box key={region}>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            {region} — {meta.name}
                          </Typography>
                          <Typography
                              variant="caption"
                              sx={{ color: 'text.secondary' }}
                          >
                            {meta.description}
                          </Typography>
                        </Box>
                    );
                  })}
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* ---------------- KPI row (single white card, 4 pills inside) ---------------- */}
        <Paper sx={{ ...cardSx, mb: 3 }}>
          <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 2.5,
                width: '100%',
              }}
          >
            <Box sx={{ flex: '1 1 220px' }}>
              <StatCard
                  label="Active Sites"
                  value={metrics.activeSites}
                  accentColor="#16a34a"
                  bgColor="#f0fdf4"
                  borderColor="#bbf7d0"
                  icon={<CellTowerRoundedIcon sx={{ color: '#16a34a', fontSize: 24 }} />}
              />
            </Box>
            <Box sx={{ flex: '1 1 220px' }}>
              <StatCard
                  label="Down Sites"
                  value={metrics.downSites}
                  accentColor="#dc2626"
                  bgColor="#fef2f2"
                  borderColor="#fecaca"
                  icon={<SignalWifiOffRoundedIcon sx={{ color: '#dc2626', fontSize: 24 }} />}
              />
            </Box>
            <Box sx={{ flex: '1 1 220px' }}>
              <StatCard
                  label="Critical Incidents"
                  value={metrics.criticalCount}
                  accentColor="#ea580c"
                  bgColor="#fff7ed"
                  borderColor="#fed7aa"
                  icon={<WarningAmberRoundedIcon sx={{ color: '#ea580c', fontSize: 24 }} />}
              />
            </Box>
            <Box sx={{ flex: '1 1 220px' }}>
              <StatCard
                  label="Recovery Rate"
                  value={`${metrics.recoveryRate}%`}
                  accentColor="#2563eb"
                  bgColor="#eff6ff"
                  borderColor="#bfdbfe"
                  icon={<TrendingUpRoundedIcon sx={{ color: '#2563eb', fontSize: 24 }} />}
              />
            </Box>
          </Box>
        </Paper>

        {/* ---------------- Main content grid ---------------- */}
        <Grid container spacing={2.5}>
          {/* ----- Left column: Incident table ----- */}
          <Grid item xs={12} md={8}>
            <Paper sx={cardSx}>
              <Typography variant="h6" sx={sectionTitleSx}>
                Site-Level Incident Table &amp; Status Indicators
              </Typography>

              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Site ID</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Root Cause</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Priority</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="right">
                      Severity
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {siteIncidentTable.map((item, i) => {
                    const meta = getSeverityMeta(item.severity);
                    return (
                        <TableRow
                            key={`${item.siteId}-${i}`}
                            hover
                            sx={{ '&:last-child td': { borderBottom: 0 } }}
                        >
                          <TableCell sx={{ fontWeight: 600 }}>
                            {item.siteId}
                          </TableCell>
                          <TableCell sx={{ textTransform: 'capitalize' }}>
                            {item.rootCause}
                          </TableCell>
                          <TableCell>
                            <Chip
                                label={meta.priority}
                                size="small"
                                variant="outlined"
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Chip
                                label={(item.severity || '—').toUpperCase()}
                                color={meta.color}
                                size="small"
                                sx={{ fontWeight: 700 }}
                            />
                          </TableCell>
                        </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Paper>
          </Grid>

          {/* ----- Right column: Root cause + Network health ----- */}
          <Grid item xs={12} md={4}>
            <Stack spacing={2.5}>
              <Paper sx={cardSx}>
                <Typography variant="h6" sx={sectionTitleSx}>
                  Root Cause Distribution
                </Typography>
                <Stack spacing={1.5}>
                  {Object.entries(rootCauseCounts).map(([cause, count]) => (
                      <Box
                          key={cause}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                      >
                        <Typography
                            variant="body2"
                            sx={{ textTransform: 'capitalize' }}
                        >
                          {cause}
                        </Typography>
                        <Chip label={count} size="small" color="primary" />
                      </Box>
                  ))}
                </Stack>
              </Paper>

              <Paper sx={cardSx}>
                <Typography variant="h6" sx={sectionTitleSx}>
                  Network Health
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mb: 0.5,
                      }}
                  >
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Site Availability
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {metrics.recoveryRate}%
                    </Typography>
                  </Box>
                  <LinearProgress
                      variant="determinate"
                      value={metrics.recoveryRate}
                      sx={{ height: 8, borderRadius: 2 }}
                  />
                </Box>

                <Divider sx={{ my: 1.5 }} />

                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Operational Sites
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {metrics.activeSites}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Outage Sites
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {metrics.downSites}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      High Severity Incidents
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {metrics.highCount}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Stack>
          </Grid>
        </Grid>
      </Box>
  );
}
