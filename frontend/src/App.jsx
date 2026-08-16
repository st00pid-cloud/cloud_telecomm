import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Tabs, Tab, Box, Container } from '@mui/material';
import ExecutiveDashboard from './pages/ExecutiveDashboard';
import DrrmDashboard from './pages/DrrmDashboard';
import EngineerDashboard from './pages/EngineerDashboard';

export default function App() {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <Box sx={{ flexGrow: 1, backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
            <AppBar position="static" color="primary">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                        Disaster Telecom Intelligence
                    </Typography>
                    <Tabs
                        value={activeTab}
                        onChange={(e, newValue) => setActiveTab(newValue)}
                        textColor="inherit"
                        indicatorColor="secondary"
                    >
                        <Tab label="Executive View" />
                        <Tab label="DRRM Priority Queue" />
                        <Tab label="Engineering Diagnostics" />
                    </Tabs>
                </Toolbar>
            </AppBar>

            <Container maxWidth="xl" sx={{ mt: 4, pb: 4 }}>
                {activeTab === 0 && <ExecutiveDashboard />}
                {activeTab === 1 && <DrrmDashboard />}
                {activeTab === 2 && <EngineerDashboard />}
            </Container>
        </Box>
    );
}