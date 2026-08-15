import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import DrrmDashboard from './pages/DrrmDashboard';
import EngineerDashboard from './pages/EngineerDashboard';
import ExecutiveDashboard from './pages/ExecutiveDashboard';

export default function App() {
    return (
        <Router>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Disaster Telecom Decision Intelligence
                    </Typography>
                    <Button color="inherit" component={Link} to="/drrm">DRRM View</Button>
                    <Button color="inherit" component={Link} to="/engineer">Engineer View</Button>
                    <Button color="inherit" component={Link} to="/executive">Executive View</Button>
                </Toolbar>
            </AppBar>
            <Container sx={{ mt: 4 }}>
                <Routes>
                    <Route path="/" element={<DrrmDashboard />} />
                    <Route path="/drrm" element={<DrrmDashboard />} />
                    <Route path="/engineer" element={<EngineerDashboard />} />
                    <Route path="/executive" element={<ExecutiveDashboard />} />
                </Routes>
            </Container>
        </Router>
    );
}