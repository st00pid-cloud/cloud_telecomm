import React from 'react';
import {
    Box,
    Typography,
    Grid,
    Paper,
    Chip,
    Avatar,
    Divider,
} from '@mui/material';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import SecurityIcon from '@mui/icons-material/Security';
import InsightsIcon from '@mui/icons-material/Insights';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import GroupsIcon from '@mui/icons-material/Groups';

export default function AboutPage() {
    const teamMembers = [
        {
            name: 'Justine Mae Macario',
            role: 'Project Manager / Developer',
        },
        {
            name: 'Raja Rane Mandapat',
            role: 'Developer',
        },
        {
            name: 'Celes Castro',
            role: 'Developer',
        },
        {
            name: 'Member',
            role: 'Role',
        },
        {
            name: 'Member',
            role: 'Role',
        },
        {
            name: 'Member',
            role: 'Role',
        },
        {
            name: 'Member',
            role: 'Role',
        },
    ];

    const features = [
        {
            icon: SecurityIcon,
            title: 'Disaster Resilience',
            text: 'Monitor telecom infrastructure and identify high-risk areas affected by hazards.',
        },
        {
            icon: InsightsIcon,
            title: 'Decision Intelligence',
            text: 'Transform data into insights for resource allocation and restoration priority.',
        },
        {
            icon: CloudQueueIcon,
            title: 'Cloud-Native Platform',
            text: 'Scalable analytics and secure access built on modern cloud technologies.',
        },
    ];

    const visionTags = [
        'Disaster Response',
        'Telecom Analytics',
        'Cloud Platform',
        'Decision Intelligence',
    ];

    return (
        <Box
            sx={{
                height: '100vh',
                width: '100%',
                overflow: 'hidden',
                boxSizing: 'border-box',
                p: { xs: 1.5, md: 2.5 },
                display: 'flex',
                flexDirection: 'column',
                gap: 1.0,
            }}
        >
            {/* Hero — fixed height */}
            <Paper
                sx={{
                    p: { xs: 2, md: 2.5 },
                    borderRadius: 1,
                    flexShrink: 0,
                    background: 'linear-gradient(135deg, #1a73e8 0%, #1558b0 100%)',
                    color: 'white',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <SignalCellularAltIcon sx={{ fontSize: { xs: 28, md: 34 } }} />
                    <Box>
                        <Typography
                            sx={{
                                fontSize: 'clamp(1.3rem, 2.2vw, 1.8rem)',
                                fontWeight: 800,
                                lineHeight: 1.1,
                            }}
                        >
                            KONEK
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: 'clamp(0.75rem, 1.1vw, 0.95rem)',
                                opacity: 0.9,
                            }}
                        >
                            Cloud Telecom Decision Intelligence Platform
                        </Typography>
                    </Box>
                </Box>
                <Typography
                    sx={{
                        fontSize: 'clamp(0.72rem, 1vw, 0.85rem)',
                        mt: 1,
                        lineHeight: 1.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                    }}
                >
                    KONEK enhances telecom resilience during disasters with real-time monitoring,
                    outage visibility, risk assessment, and actionable insights for responders and engineers.
                </Typography>
            </Paper>

            {/* Main content — fills remaining space, split into two columns */}
            <Box
                sx={{
                    flex: 1,
                    minHeight: 0,
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: '1.1fr 0.9fr' },
                    gap: 1.5,
                }}
            >
                {/* Left: Features + Vision stacked */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, minHeight: 0 }}>
                    {/* Feature cards row */}
                    <Box
                        sx={{
                            flex: 1,
                            minHeight: 0,
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: 1.0,
                        }}
                    >
                        {features.map(({ icon: Icon, title, text }) => (
                            <Paper
                                key={title}
                                sx={{
                                    p: 1.5,
                                    borderRadius: 1,
                                    minHeight: 0,
                                    overflow: 'hidden',
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                <Icon sx={{ fontSize: { xs: 24, md: 28 }, color: '#1a73e8', mb: 0.5 }} />
                                <Typography
                                    sx={{
                                        fontSize: 'clamp(0.75rem, 1vw, 0.9rem)',
                                        fontWeight: 700,
                                        mb: 0.5,
                                    }}
                                >
                                    {title}
                                </Typography>
                                <Typography
                                    color="text.secondary"
                                    sx={{
                                        fontSize: 'clamp(0.65rem, 0.85vw, 0.78rem)',
                                        lineHeight: 1.4,
                                        display: '-webkit-box',
                                        WebkitLineClamp: 3,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                    }}
                                >
                                    {text}
                                </Typography>
                            </Paper>
                        ))}
                    </Box>

                    {/* Vision */}
                    <Paper
                        sx={{
                            p: 1.5,
                            borderRadius: 1,
                            flex: 1,
                            minHeight: 0,
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: 'clamp(0.85rem, 1.2vw, 1.05rem)',
                                fontWeight: 700,
                                mb: 0.5,
                            }}
                        >
                            Project Vision
                        </Typography>
                        <Typography
                            color="text.secondary"
                            sx={{
                                fontSize: 'clamp(0.68rem, 0.9vw, 0.8rem)',
                                lineHeight: 1.5,
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                            }}
                        >
                            KONEK provides a unified operational picture that helps stakeholders rapidly
                            identify outages, assess impacts, prioritize restoration, and improve continuity.
                        </Typography>
                        <Box sx={{ mt: 'auto', pt: 0.5 }}>
                            {visionTags.map((label) => (
                                <Chip
                                    key={label}
                                    label={label}
                                    color="primary"
                                    size="small"
                                    sx={{ mr: 0.5, mb: 0.5, fontSize: '0.65rem' }}
                                />
                            ))}
                        </Box>
                    </Paper>
                </Box>

                {/* Right: Development Team */}
                <Paper
                    sx={{
                        p: 1.5,
                        borderRadius: 1,
                        minHeight: 0,
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <GroupsIcon color="primary" fontSize="small" />
                        <Typography
                            sx={{
                                fontSize: 'clamp(0.85rem, 1.2vw, 1.05rem)',
                                fontWeight: 700,
                            }}
                        >
                            Development Team
                        </Typography>
                    </Box>
                    <Divider sx={{ mb: 1 }} />
                    <Box
                        sx={{
                            flex: 1,
                            minHeight: 0,
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: 1,
                            alignContent: 'start',
                        }}
                    >
                        {teamMembers.map((member) => (
                            <Paper
                                key={member.name}
                                variant="outlined"
                                sx={{
                                    p: 1,
                                    borderRadius: 1,
                                    textAlign: 'center',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                }}
                            >
                                <Avatar
                                    sx={{
                                        width: 36,
                                        height: 36,
                                        mb: 0.5,
                                        bgcolor: '#1a73e8',
                                        fontSize: '0.85rem',
                                        fontWeight: 700,
                                    }}
                                >
                                    {member.name.charAt(0)}
                                </Avatar>
                                <Typography
                                    sx={{
                                        fontSize: 'clamp(0.65rem, 0.85vw, 0.78rem)',
                                        fontWeight: 700,
                                        lineHeight: 1.2,
                                    }}
                                >
                                    {member.name}
                                </Typography>
                                <Typography
                                    color="text.secondary"
                                    sx={{
                                        fontSize: 'clamp(0.58rem, 0.75vw, 0.68rem)',
                                        lineHeight: 1.2,
                                    }}
                                >
                                    {member.role}
                                </Typography>
                            </Paper>
                        ))}
                    </Box>
                </Paper>
            </Box>

            {/* Footer — fixed, tiny */}
            <Typography
                variant="caption"
                color="text.secondary"
                align="center"
                sx={{ flexShrink: 0 }}
            >
                KONEK • Cloud Telecom Decision Intelligence Platform
            </Typography>
        </Box>
    );
}
