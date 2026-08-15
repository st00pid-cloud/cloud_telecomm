import React from 'react';
import { Typography, Box, Paper, Grid } from '@mui/material';

export default function DrrmDashboard() {
    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>DRRM Officer View</Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2 }}>High-Risk Municipalities Queue</Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2 }}>Connectivity Fallback Status Map</Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2 }}>Restoration Priority Queue</Paper>
                </Grid>
            </Grid>
        </Box>
    );
}