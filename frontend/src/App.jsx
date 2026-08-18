import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box, Button, Typography, Container } from '@mui/material';
import ShieldIcon from '@mui/icons-material/Shield';
import BuildIcon from '@mui/icons-material/Build';
import InsightIcon from '@mui/icons-material/Insights';

import DrrmDashboard from './pages/DrrmDashboard';
import EngineerDashboard from './pages/EngineerDashboard';
import ExecutiveDashboard from './pages/ExecutiveDashboard';

// 1. Dark Theme
const appleDarkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#000000', // Deep absolute black
      paper: 'rgba(28, 28, 30, 0.65)', // Translucent dark gray
    },
    primary: { main: '#0a84ff' }, // Apple Blue
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
  },
  shape: { borderRadius: 16 }, // Squircle corners
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backdropFilter: 'blur(30px)', // Frosted glass effect
          WebkitBackdropFilter: 'blur(30px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5)',
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
      bgcolor: 'rgba(40, 40, 40, 0.6)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
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
              color: isActive ? '#fff' : '#86868b',
              bgcolor: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.15)', color: '#fff' }
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
    <ThemeProvider theme={appleDarkTheme}>
      <CssBaseline /> {/* Injects the black background globally */}
      <Router>
        
        {/* Floating Top Header */}
        <Box sx={{ pt: 4, pb: 2, px: 4, display: 'flex', justifyContent: 'center' }}>
          <Typography variant="h6" fontWeight="bold" letterSpacing="-0.5px" color="#f5f5f7">
             Cloud Telecom Decision Intelligence
          </Typography>
        </Box>

        {/* Page Content (Added bottom padding so the dock doesn't cover content) */}
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