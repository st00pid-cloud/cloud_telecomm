import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box, Button, Typography, Container } from '@mui/material';
import ShieldIcon from '@mui/icons-material/Shield';
import BuildIcon from '@mui/icons-material/Build';
import InsightIcon from '@mui/icons-material/Insights';

import DrrmDashboard from './pages/DrrmDashboard';
import EngineerDashboard from './pages/EngineerDashboard';
import ExecutiveDashboard from './pages/ExecutiveDashboard';

// 1. Light Theme with colored card panels (no white)
const appleLightTheme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#dbe4ee', // page background, medium blue-gray
      paper: '#c3d4e8',   // card panels, deeper blue-gray tint
    },
    primary: { main: '#0a63d1' },
    text: {
      primary: '#132033',
      secondary: '#48566b',
    },
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
  },
  shape: { borderRadius: 16 },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.10)',
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', borderRadius: 20, fontWeight: 600 }
      }
    }
  }
});

// 2. Custom Bottom Navigation (The "Dock")
function BottomDock() {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { path: '/drrm', label: 'DRRM', icon: <ShieldIcon /> },
    { path: '/engineer', label: 'Engineer', icon: <BuildIcon /> },
    { path: '/executive', label: 'Executive', icon: <InsightIcon /> },
  ];

  return (
    <Box sx={{
      position: 'fixed',
      bottom: 30,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 1000,
      display: 'flex',
      gap: 1,
      p: 1,
      borderRadius: 8,
      bgcolor: '#c3d4e8',
      border: '1px solid rgba(0, 0, 0, 0.1)',
      boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
    }}>
      {navItems.map((item) => {
        const isActive = currentPath === item.path || (currentPath === '/' && item.path === '/drrm');
        return (
          <Button
            key={item.path}
            component={Link}
            to={item.path}
            startIcon={item.icon}
            sx={{
              px: 3,
              py: 1.5,
              color: isActive ? '#132033' : '#5a6b82',
              bgcolor: isActive ? 'rgba(10,99,209,0.18)' : 'transparent',
              '&:hover': { bgcolor: 'rgba(10,99,209,0.12)', color: '#132033' }
            }}
          >
            {item.label}
          </Button>
        );
      })}
    </Box>
  );
}

// 3. Main App Assembly
export default function App() {
  return (
    <ThemeProvider theme={appleLightTheme}>
      <CssBaseline />
      <Router>

        <Box sx={{ pt: 4, pb: 2, px: 4, display: 'flex', justifyContent: 'center' }}>
          <Typography variant="h6" fontWeight="bold" letterSpacing="-0.5px" color="#132033">
            Cloud Telecom Decision Intelligence
          </Typography>
        </Box>

        <Container sx={{ mt: 2, pb: 15, maxWidth: '1400px !important' }}>
          <Routes>
            <Route path="/" element={<DrrmDashboard />} />
            <Route path="/drrm" element={<DrrmDashboard />} />
            <Route path="/engineer" element={<EngineerDashboard />} />
            <Route path="/executive" element={<ExecutiveDashboard />} />
          </Routes>
        </Container>

        <BottomDock />
      </Router>
    </ThemeProvider>
  );
}
