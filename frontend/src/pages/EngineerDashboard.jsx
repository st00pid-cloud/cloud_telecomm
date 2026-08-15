import React from 'react';
import { Typography, Box, Paper, Grid } from '@mui/material';

export default function EngineerDashboard() {
    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>Telecom Engineer View</Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 2 }}>Site-Level Incident Table & Status Indicators</Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2 }}>Root Cause Labels Distribution</Paper>
                </Grid>
            </Grid>
        </Box>
    );
}