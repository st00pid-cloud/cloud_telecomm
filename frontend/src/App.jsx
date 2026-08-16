// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { AppBar, Toolbar, Typography, Box, Container, Stack } from '@mui/material';
import CellTowerIcon from '@mui/icons-material/CellTower';
import theme from './theme';
import DrrmDashboard from './pages/DrrmDashboard';
import EngineerDashboard from './pages/EngineerDashboard';
import ExecutiveDashboard from './pages/ExecutiveDashboard';

const NAV_ITEMS = [
    { label: 'DRRM', to: '/drrm' },
    { label: 'Engineer', to: '/engineer' },
    { label: 'Executive', to: '/executive' },
];

function NavLink({ to, label }) {
    const location = useLocation();
    const active = location.pathname === to || (to === '/drrm' && location.pathname === '/');

    return (
        <Box
            component={Link}
            to={to}
            sx={{
                textDecoration: 'none',
                color: active ? 'primary.main' : 'text.secondary',
                fontSize: 14,
                fontWeight: active ? 600 : 500,
                px: 1.5,
                py: 0.75,
                borderRadius: 1,
                borderBottom: active ? '2px solid' : '2px solid transparent',
                borderColor: active ? 'primary.main' : 'transparent',
                '&:hover': { color: 'primary.main', backgroundColor: 'rgba(26,115,232,0.04)' },
            }}
        >
            {label}
        </Box>
    );
}

function Shell() {
    return (
        <>
            <AppBar position="sticky" elevation={0}>
                <Toolbar sx={{ minHeight: 56, gap: 3 }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <CellTowerIcon sx={{ color: 'primary.main', fontSize: 22 }} />
                        <Typography sx={{ fontWeight: 600, fontSize: 16 }}>KONEK</Typography>
                    </Stack>
                    <Box sx={{ flexGrow: 1 }} />
                    <Stack direction="row" spacing={0.5}>
                        {NAV_ITEMS.map((item) => (
                            <NavLink key={item.to} {...item} />
                        ))}
                    </Stack>
                </Toolbar>
            </AppBar>
            <Container maxWidth="xl" sx={{ py: 3 }}>
                <Routes>
                    <Route path="/" element={<DrrmDashboard />} />
                    <Route path="/drrm" element={<DrrmDashboard />} />
                    <Route path="/engineer" element={<EngineerDashboard />} />
                    <Route path="/executive" element={<ExecutiveDashboard />} />
                </Routes>
            </Container>
        </>
    );
}

export default function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <Shell />
            </Router>
        </ThemeProvider>
    );
}