import React from 'react';
import {BrowserRouter as Router, Routes, Route, Link, useLocation,
} from 'react-router-dom';

import {ThemeProvider, createTheme, CssBaseline, Box, Typography, Container, AppBar, Toolbar, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Chip, Avatar, IconButton, Divider, Paper,
} from '@mui/material';

import ShieldIcon from '@mui/icons-material/Shield';
import BuildIcon from '@mui/icons-material/Build';
import InsightsIcon from '@mui/icons-material/Insights';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import SearchIcon from '@mui/icons-material/Search';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import PublicIcon from '@mui/icons-material/Public';
import GroupsIcon from '@mui/icons-material/Groups';

import AboutPage from './pages/AboutPage.jsx';
import DrrmDashboard from './pages/DrrmDashboard';
import EngineerDashboard from './pages/EngineerDashboard';
import ExecutiveDashboard from './pages/ExecutiveDashboard';
import TelecomMapComponent from './pages/TelecomMapComponent.jsx';

const drawerWidth = 260;

const konekTheme = createTheme({
    palette: {
        mode: 'light',
        background: {
            default: '#f5f7fb',
            paper: '#ffffff',
        },
        primary: {
            main: '#1a73e8',
            dark: '#1558b0',
            light: '#e8f0fe',
        },
        secondary: {
            main: '#475569',
        },
        success: {
            main: '#16a34a',
        },
        warning: {
            main: '#f59e0b',
        },
        error: {
            main: '#dc2626',
        },
        info: {
            main: '#0284c7',
        },
        text: {
            primary: '#172033',
            secondary: '#5f6b7a',
        },
        divider: '#e5eaf2',
    },
    typography: {
        fontFamily:
            '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, Arial, sans-serif',
        h4: {
            fontWeight: 750,
            letterSpacing: '-0.04em',
        },
        h5: {
            fontWeight: 700,
            letterSpacing: '-0.03em',
        },
        h6: {
            fontWeight: 700,
            letterSpacing: '-0.02em',
        },
        button: {
            fontWeight: 650,
            textTransform: 'none',
        },
    },
    shape: {
        borderRadius: 14,
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    border: '1px solid #e5eaf2',
                    boxShadow: '0 1px 2px rgba(16, 24, 40, 0.04)',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: 10,
                    fontWeight: 650,
                },
            },
        },
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    marginBottom: 6,
                    transition: 'all 0.18s ease',
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight: 650,
                },
            },
        },
    },
});

const navSections = [
    {
        section: 'OVERVIEW',
        items: [
            {
                path: '/about',
                label: 'About KONEK',
                shortLabel: 'About',
                icon: <InfoOutlinedIcon />,
                eyebrow: 'Project overview',
            },
        ],
    },
    {
        section: 'OPERATIONS',
        items: [
            {
                path: '/drrm',
                label: 'DRRM Operations',
                shortLabel: 'DRRM',
                icon: <ShieldIcon />,
                eyebrow: 'Disaster response',
            },
            {
                path: '/engineer',
                label: 'Engineering Operations',
                shortLabel: 'Engineer',
                icon: <BuildIcon />,
                eyebrow: 'Infrastructure monitoring',
            },
            {
                path: '/executive',
                label: 'Executive Insights',
                shortLabel: 'Executive',
                icon: <InsightsIcon />,
                eyebrow: 'Strategic intelligence',
            },
            {
                path: '/live-mapping',
                label: 'Live Mapping',
                shortLabel: 'Map',
                icon: <PublicIcon />,
                eyebrow: 'Telecom site visualization',
            },
        ],
    },
    {
        section: 'PROJECT',
        items: [
            {
                path: '/group',
                label: 'The Group',
                shortLabel: 'Team',
                icon: <GroupsIcon />,
                eyebrow: 'Development team',
            },
        ],
    },
];

const navItems = navSections.flatMap((section) => section.items);

const mobileNavItems = navItems.filter((item) =>
    ['/drrm', '/engineer', '/executive', '/live-mapping'].includes(item.path)
);

function getCurrentPath(pathname) {
    if (pathname === '/') {
        return '/about';
    }

    return pathname;
}

function Sidebar() {
    const location = useLocation();
    const currentPath = getCurrentPath(location.pathname);

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                display: { xs: 'none', md: 'block' },
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    borderRight: '1px solid #e5eaf2',
                    bgcolor: '#ffffff',
                    px: 2,
                    py: 2,
                },
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 1, py: 1 }}>
                <Box
                    sx={{
                        width: 38,
                        height: 38,
                        borderRadius: 2,
                        bgcolor: '#e8f0fe',
                        color: '#1a73e8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <SignalCellularAltIcon />
                </Box>

                <Box>
                    <Typography variant="h6" sx={{ lineHeight: 1 }}>
                        KONEK
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Telecom Intelligence
                    </Typography>
                </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            {navSections.map((section) => (
                <Box key={section.section} sx={{ mb: 2 }}>
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                            px: 1,
                            mb: 1,
                            display: 'block',
                            fontWeight: 700,
                            letterSpacing: '0.04em',
                        }}
                    >
                        {section.section}
                    </Typography>

                    <List disablePadding>
                        {section.items.map((item) => {
                            const isActive = currentPath === item.path;

                            return (
                                <ListItemButton
                                    key={item.path}
                                    component={Link}
                                    to={item.path}
                                    selected={isActive}
                                    sx={{
                                        px: 1.5,
                                        py: 1.2,
                                        color: isActive ? '#174ea6' : '#475569',
                                        bgcolor: isActive ? '#e8f0fe !important' : 'transparent',
                                        '&:hover': {
                                            bgcolor: isActive ? '#e8f0fe' : '#f1f5f9',
                                            transform: 'translateX(2px)',
                                        },
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 40,
                                            color: isActive ? '#1a73e8' : '#64748b',
                                        }}
                                    >
                                        {item.icon}
                                    </ListItemIcon>

                                    <ListItemText
                                        primary={item.label}
                                        secondary={item.eyebrow}
                                        primaryTypographyProps={{
                                            fontSize: 14,
                                            fontWeight: 700,
                                        }}
                                        secondaryTypographyProps={{
                                            fontSize: 12,
                                        }}
                                    />
                                </ListItemButton>
                            );
                        })}
                    </List>
                </Box>
            ))}

            <Box sx={{ flexGrow: 1 }} />

            <Paper
                sx={{
                    p: 1.5,
                    borderRadius: 3,
                    bgcolor: '#f8fafc',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CloudQueueIcon sx={{ color: '#1a73e8', fontSize: 22 }} />

                    <Box>
                        <Typography variant="body2" fontWeight={700}>
                            Cloud Console Mode
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Light operations theme
                        </Typography>
                    </Box>
                </Box>
            </Paper>
        </Drawer>
    );
}

function TopBar() {
    return (
        <AppBar
            position="fixed"
            elevation={0}
            sx={{
                width: { md: `calc(100% - ${drawerWidth}px)` },
                ml: { md: `${drawerWidth}px` },
                bgcolor: '#ffffff',
                color: '#172033',
                borderBottom: '1px solid #e5eaf2',
            }}
        >
            <Toolbar sx={{ minHeight: '64px !important', px: { xs: 2, md: 3 } }}>
                <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1 }}>
                    <SignalCellularAltIcon sx={{ color: '#1a73e8' }} />
                    <Typography variant="h6">KONEK</Typography>
                </Box>

                <Box sx={{ flexGrow: 1 }} />

                <Box
                    sx={{
                        display: { xs: 'none', sm: 'flex' },
                        alignItems: 'center',
                        gap: 1,
                        px: 1.5,
                        py: 0.8,
                        mr: 1,
                        width: 280,
                        borderRadius: 3,
                        bgcolor: '#f8fafc',
                        border: '1px solid #e5eaf2',
                        color: '#64748b',
                    }}
                >
                    <SearchIcon fontSize="small" />
                    <Typography variant="body2" color="text.secondary">
                        Search sites, regions, incidents
                    </Typography>
                </Box>

                <IconButton aria-label="Notifications">
                    <NotificationsNoneIcon />
                </IconButton>

                <Avatar
                    sx={{
                        width: 34,
                        height: 34,
                        ml: 1,
                        bgcolor: '#1a73e8',
                        fontSize: 14,
                        fontWeight: 700,
                    }}
                >
                    K
                </Avatar>
            </Toolbar>
        </AppBar>
    );
}

// function StatusBanner() {
//     return (
//         <Paper
//             sx={{
//                 p: 2,
//                 mb: 3,
//                 borderRadius: 3,
//                 bgcolor: '#fff7ed',
//                 border: '1px solid #fed7aa',
//                 display: 'flex',
//                 alignItems: { xs: 'flex-start', sm: 'center' },
//                 flexDirection: { xs: 'column', sm: 'row' },
//                 gap: 1.5,
//             }}
//         >
//         {/*    <Box*/}
//         {/*        sx={{*/}
//         {/*            width: 38,*/}
//         {/*            height: 38,*/}
//         {/*            borderRadius: 2,*/}
//         {/*            bgcolor: '#ffedd5',*/}
//         {/*            color: '#c2410c',*/}
//         {/*            display: 'flex',*/}
//         {/*            alignItems: 'center',*/}
//         {/*            justifyContent: 'center',*/}
//         {/*            flexShrink: 0,*/}
//         {/*        }}*/}
//         {/*    >*/}
//         {/*        <WarningAmberIcon />*/}
//         {/*    </Box>*/}
//
//
//         {/*    /!*<Chip*!/*/}
//         {/*    /!*    label="Monitoring"*!/*/}
//         {/*    /!*    size="small"*!/*/}
//         {/*    /!*    sx={{*!/*/}
//         {/*    /!*        bgcolor: '#ffedd5',*!/*/}
//         {/*    /!*        color: '#9a3412',*!/*/}
//         {/*    /!*        fontWeight: 700,*!/*/}
//         {/*    /!*    }}*!/*/}
//         {/*    /!*/>*!/*/}
//         {/*</Paper>*/}
//     {/*);*/}
// }


function MobileNav() {
    const location = useLocation();
    const currentPath = getCurrentPath(location.pathname);

    return (
        <Paper
            sx={{
                display: { xs: 'flex', md: 'none' },
                position: 'fixed',
                left: 12,
                right: 12,
                bottom: 12,
                zIndex: 1200,
                p: 0.7,
                borderRadius: 4,
                boxShadow: '0 12px 30px rgba(15, 23, 42, 0.18)',
            }}
        >
            {mobileNavItems.map((item) => {
                const isActive = currentPath === item.path;

                return (
                    <ListItemButton
                        key={item.path}
                        component={Link}
                        to={item.path}
                        sx={{
                            flex: 1,
                            borderRadius: 3,
                            justifyContent: 'center',
                            color: isActive ? '#1a73e8' : '#64748b',
                            bgcolor: isActive ? '#e8f0fe' : 'transparent',
                            py: 1,
                        }}
                    >
                        <Box sx={{ textAlign: 'center' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                {item.icon}
                            </Box>

                            <Typography variant="caption" fontWeight={700}>
                                {item.shortLabel}
                            </Typography>
                        </Box>
                    </ListItemButton>
                );
            })}
        </Paper>
    );
}

function GroupPagePlaceholder() {
    return (
        <Paper
            sx={{
                p: 4,
                borderRadius: 4,
            }}
        >
            <Typography variant="h5" fontWeight={700} gutterBottom>
                Cloud Elite Project
            </Typography>

            <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
                This serves as a final submission for our Cloud Elite Training under Accenture! Adios~~
            </Typography>
        </Paper>
    );
}

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<AboutPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/drrm" element={<DrrmDashboard />} />
            <Route path="/engineer" element={<EngineerDashboard />} />
            <Route path="/executive" element={<ExecutiveDashboard />} />
            <Route path="/live-mapping" element={<TelecomMapComponent />} />
            <Route path="/group" element={<GroupPagePlaceholder />} />
        </Routes>
    );
}

function AppShell() {
    const location = useLocation();
    const currentPath = getCurrentPath(location.pathname);
    const hideStatusBanner = ['/about', '/group'].includes(currentPath);

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
            <Sidebar />
            <TopBar />

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
                    pt: 10,
                    pb: { xs: 12, md: 4 },
                }}
            >
                <Container
                    maxWidth={false}
                    sx={{
                        px: { xs: 2, sm: 3, lg: 4 },
                    }}
                >

                    {/*{!hideStatusBanner && <StatusBanner />}*/}

                    <Box
                        sx={{
                            '& .MuiPaper-root': {
                                transition: 'transform 0.18s ease, box-shadow 0.18s ease',
                            },
                            '& .MuiPaper-root:hover': {
                                transform: 'translateY(-1px)',
                                boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)',
                            },
                        }}
                    >
                        <AppRoutes />
                    </Box>
                </Container>
            </Box>

            <MobileNav />
        </Box>
    );
}

export default function App() {
    return (
        <ThemeProvider theme={konekTheme}>
            <CssBaseline />
            <Router>
                <AppShell />
            </Router>
        </ThemeProvider>
    );
}