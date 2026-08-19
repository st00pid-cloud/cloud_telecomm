import React, { useState, useEffect, useMemo } from 'react';
import {
  Typography, Box, Paper, Grid, Table, TableBody, TableCell, TableHead,
  TableRow, Chip, CircularProgress, Alert, Stack, Divider, LinearProgress
} from '@mui/material';
import { getEngineerDashboard } from '../api/telecomApi';

/* ------------------------------------------------------------------ */
/*  Shared style tokens — keep every card visually consistent          */
/* ------------------------------------------------------------------ */
const cardSx = {
  p: 3,
  borderRadius: 3,
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
/*  Small reusable KPI stat card                                       */
/* ------------------------------------------------------------------ */
function StatCard({ label, value, accentColor }) {
  return (
      <Paper sx={{ ...cardSx, p: 2.5 }}>
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
      </Paper>
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

        {/* ---------------- KPI row ---------------- */}
        <Grid container spacing={2.5} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
                label="Active Sites"
                value={metrics.activeSites}
                accentColor="#16a34a"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
                label="Down Sites"
                value={metrics.downSites}
                accentColor="#dc2626"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
                label="Critical Incidents"
                value={metrics.criticalCount}
                accentColor="#ea580c"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
                label="Recovery Rate"
                value={`${metrics.recoveryRate}%`}
                accentColor="#2563eb"
            />
          </Grid>
        </Grid>

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
                      sx={{ height: 8, borderRadius: 4 }}
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

          {/* ----- Bottom row: Affected regions ----- */}
          <Grid item xs={12}>
            <Paper sx={cardSx}>
              <Typography variant="h6" sx={sectionTitleSx}>
                Affected Regions Summary
              </Typography>
              <Grid container spacing={2}>
                {metrics.topRegions.map(([region, count]) => (
                    <Grid item xs={6} sm={4} md={2.4} key={region}>
                      <Box
                          sx={{
                            p: 2,
                            borderRadius: 2,
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
            </Paper>
          </Grid>
        </Grid>
      </Box>
  );
}
