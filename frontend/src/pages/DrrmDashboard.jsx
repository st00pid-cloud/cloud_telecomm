import React, { useState, useEffect } from 'react';
import {
  Typography, Box, Paper, Grid, List, ListItem, ListItemText,
  Chip, CircularProgress, Alert
} from '@mui/material';
import { getDrrmDashboard } from '../api/telecomApi';

export default function DrrmDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getDrrmDashboard()
      .then(res => setData(res.data))
      .catch(err => {
        console.error(err);
        setError('Could not load DRRM dashboard. Is the backend running?');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Box p={3}><CircularProgress /></Box>;
  if (error) return <Box p={3}><Alert severity="error">{error}</Alert></Box>;

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>DRRM Officer View</Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Status: <strong>{data.disasterStatus}</strong>
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>High-Risk Municipalities Queue</Typography>
            {data.highRiskMunicipalities.length === 0 ? (
              <Typography color="text.secondary">No high-risk municipalities.</Typography>
            ) : (
              <List dense>
                {data.highRiskMunicipalities.map((muni, i) => (
                  <ListItem key={i} disableGutters>
                    <ListItemText primary={muni} />
                  </ListItem>
                ))}
              </List>
            )}

            {data.criticalFacilitiesAffected && data.criticalFacilitiesAffected.length > 0 && (
              <>
                <Typography variant="subtitle2" sx={{ mt: 1 }} color="text.secondary">
                  Critical Facilities Affected
                </Typography>
                <List dense>
                  {data.criticalFacilitiesAffected.map((fac, i) => (
                    <ListItem key={i} disableGutters>
                      <ListItemText primary={fac} />
                    </ListItem>
                  ))}
                </List>
              </>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Connectivity Fallback Status Map</Typography>
            {Object.keys(data.connectivityFallbackAvailability).length === 0 ? (
              <Typography color="text.secondary">No fallback data available.</Typography>
            ) : (
              <List dense>
                {Object.entries(data.connectivityFallbackAvailability).map(([muni, fallback]) => (
                  <ListItem key={muni} disableGutters
                    secondaryAction={<Chip label={fallback} size="small" color="info" />}>
                    <ListItemText primary={muni} />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Restoration Priority Queue</Typography>
            {data.priorityRestorationQueue.length === 0 ? (
              <Typography color="text.secondary">No restoration items queued.</Typography>
            ) : (
              <List dense>
                {data.priorityRestorationQueue.map((item, i) => (
                  <ListItem key={i} disableGutters
                    secondaryAction={<Chip label={item.priorityScore} size="small" color="error" />}>
                    <ListItemText
                      primary={item.siteId}
                      secondary={`${item.severity} · ${item.rootCause} · Risk: ${item.riskScore} · ${item.fallbackStatus}`}
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