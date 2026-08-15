import React from 'react';
import { Typography, Box, Paper, Grid } from '@mui/material';

export default function ExecutiveDashboard() {
    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>LGU Executive View</Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2 }}>Total Affected Users KPI</Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2 }}>Active Outages Summary</Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2 }}>Regional Connectivity %</Paper>
                </Grid>
            </Grid>
        </Box>
    );
}