import React, { useState, useEffect } from 'react';
import {
  Typography, Box, Paper, Grid, Table, TableBody, TableCell, TableHead,
  TableRow, Chip, CircularProgress, Alert
} from '@mui/material';
import { getEngineerDashboard } from '../api/telecomApi';

export default function EngineerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getEngineerDashboard()
      .then(res => setData(res.data))
      .catch(err => {
        console.error(err);
        setError('Could not load Engineer dashboard. Is the backend running?');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Box p={3}><CircularProgress /></Box>;
  if (error) return <Box p={3}><Alert severity="error">{error}</Alert></Box>;

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Telecom Engineer View</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Site-Level Incident Table & Status Indicators</Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Site ID</TableCell>
                  <TableCell>Root Cause</TableCell>
                  <TableCell>Severity</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.siteIncidentTable.map((item, i) => (
                  <TableRow key={i}>
                    <TableCell>{item.siteId}</TableCell>
                    <TableCell>{item.rootCause}</TableCell>
                    <TableCell>
                      <Chip label={item.severity} color={item.severity === 'Critical' ? 'error' : 'warning'} size="small" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>Root Cause Labels Distribution</Typography>
            {Object.entries(data.rootCauseCounts).map(([cause, count]) => (
              <Typography key={cause}>{cause}: <strong>{count}</strong></Typography>
            ))}
          </Paper>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Infrastructure Status</Typography>
            {Object.entries(data.infrastructureStatusSummary).map(([key, val]) => (
              <Typography key={key}>{key}: <strong>{val}</strong></Typography>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}