import React, { useState, useEffect } from 'react';
import { Typography, Box, Paper, Grid, CircularProgress, Alert } from '@mui/material';
import { getExecutiveDashboard } from '../api/telecomApi';

export default function ExecutiveDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getExecutiveDashboard()
      .then(res => setData(res.data))
      .catch(err => {
        console.error(err);
        setError('Could not load Executive dashboard. Is the backend running?');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Box p={3}><CircularProgress /></Box>;
  if (error) return <Box p={3}><Alert severity="error">{error}</Alert></Box>;

  const status = data.highLevelAreaStatus || {};

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>LGU Executive View</Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        {status['Region VI Status']}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">Total Affected Users KPI</Typography>
            <Typography variant="h3" color="error" fontWeight="bold">
              {data.totalAffectedUsers.toLocaleString()}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">Active Outages Summary</Typography>
            <Typography variant="h3" color="warning.main" fontWeight="bold">
              {data.activeOutagesCount}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">Regional Connectivity %</Typography>
            <Typography variant="h3" color="success.main" fontWeight="bold">
              {data.regionConnectivityPercentage}%
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">Active Disaster Alerts</Typography>
            <Typography variant="h3" color="error" fontWeight="bold">
              {status['Active Disaster Alerts'] ?? '—'}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">High-Vulnerability Sites</Typography>
            <Typography variant="h3" color="warning.main" fontWeight="bold">
              {status['High-Vulnerability Site Count'] ?? '—'}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">Avg. Restoration Priority Index</Typography>
            <Typography variant="h3" color="info.main" fontWeight="bold">
              {status['Average Restoration Priority Index'] ?? '—'}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}