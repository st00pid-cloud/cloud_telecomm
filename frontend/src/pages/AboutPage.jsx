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
            name: 'Member 1',
            role: 'Project Manager / Scrum Lead',
        },
        {
            name: 'Member 2',
            role: 'Cloud Engineer / Infrastructure Lead',
        },
        {
            name: 'Member 3',
            role: 'Backend Developer',
        },
        {
            name: 'Member 4',
            role: 'Frontend Developer',
        },
        {
            name: 'Member 5',
            role: 'Data & Analytics Specialist',
        },
    ];

    return (
        <Box>
            <Paper
                sx={{
                    p: 5,
                    mb: 4,
                    borderRadius: 4,
                    background:
                        'linear-gradient(135deg, #1a73e8 0%, #1558b0 100%)',
                    color: 'white',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        mb: 2,
                    }}
                >
                    <SignalCellularAltIcon sx={{ fontSize: 42 }} />

                    <Box>
                        <Typography variant="h3" fontWeight={800}>
                            KONEK
                        </Typography>

                        <Typography variant="h6" sx={{ opacity: 0.9 }}>
                            Cloud Telecom Decision Intelligence Platform
                        </Typography>
                    </Box>
                </Box>

                <Typography
                    variant="body1"
                    sx={{
                        maxWidth: 900,
                        mt: 3,
                        lineHeight: 1.8,
                    }}
                >
                    KONEK is an integrated cloud-based decision intelligence platform
                    designed to enhance telecommunications resilience during disasters.
                    The platform provides real-time monitoring, outage visibility,
                    risk assessment, and actionable insights to support disaster
                    response agencies, telecommunications engineers, and organizational
                    decision-makers.
                </Typography>
            </Paper>

            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Paper
                        sx={{
                            p: 3,
                            height: '100%',
                            borderRadius: 4,
                        }}
                    >
                        <SecurityIcon
                            sx={{
                                fontSize: 40,
                                color: '#1a73e8',
                                mb: 2,
                            }}
                        />

                        <Typography variant="h6" fontWeight={700} gutterBottom>
                            Disaster Resilience
                        </Typography>

                        <Typography color="text.secondary">
                            Monitor critical telecom infrastructure and identify
                            high-risk areas affected by typhoons, floods,
                            earthquakes, and other hazard events.
                        </Typography>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper
                        sx={{
                            p: 3,
                            height: '100%',
                            borderRadius: 4,
                        }}
                    >
                        <InsightsIcon
                            sx={{
                                fontSize: 40,
                                color: '#1a73e8',
                                mb: 2,
                            }}
                        />

                        <Typography variant="h6" fontWeight={700} gutterBottom>
                            Decision Intelligence
                        </Typography>

                        <Typography color="text.secondary">
                            Transform operational and disaster data into meaningful
                            insights that support resource allocation, restoration
                            prioritization, and strategic planning.
                        </Typography>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper
                        sx={{
                            p: 3,
                            height: '100%',
                            borderRadius: 4,
                        }}
                    >
                        <CloudQueueIcon
                            sx={{
                                fontSize: 40,
                                color: '#1a73e8',
                                mb: 2,
                            }}
                        />

                        <Typography variant="h6" fontWeight={700} gutterBottom>
                            Cloud-Native Platform
                        </Typography>

                        <Typography color="text.secondary">
                            Built using modern cloud technologies to provide
                            scalable analytics, centralized monitoring,
                            and secure access across multiple stakeholders.
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>

            <Paper
                sx={{
                    p: 4,
                    mt: 4,
                    borderRadius: 4,
                }}
            >
                <Typography
                    variant="h5"
                    fontWeight={700}
                    gutterBottom
                >
                    Project Vision
                </Typography>

                <Typography
                    color="text.secondary"
                    sx={{
                        lineHeight: 1.9,
                    }}
                >
                    Telecommunications infrastructure plays a critical role
                    during disaster response and recovery operations. KONEK
                    aims to provide a unified operational picture that helps
                    stakeholders rapidly identify outages, assess regional
                    impacts, prioritize restoration activities, and improve
                    communication continuity in affected communities.
                </Typography>

                <Box sx={{ mt: 3 }}>
                    <Chip
                        label="Disaster Response"
                        color="primary"
                        sx={{ mr: 1, mb: 1 }}
                    />

                    <Chip
                        label="Telecom Analytics"
                        color="primary"
                        sx={{ mr: 1, mb: 1 }}
                    />

                    <Chip
                        label="Cloud Platform"
                        color="primary"
                        sx={{ mr: 1, mb: 1 }}
                    />

                    <Chip
                        label="Decision Intelligence"
                        color="primary"
                        sx={{ mr: 1, mb: 1 }}
                    />
                </Box>
            </Paper>

            <Paper
                sx={{
                    p: 4,
                    mt: 4,
                    borderRadius: 4,
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mb: 3,
                    }}
                >
                    <GroupsIcon color="primary" />

                    <Typography variant="h5" fontWeight={700}>
                        Development Team
                    </Typography>
                </Box>

                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                    {teamMembers.map((member) => (
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                            key={member.name}
                        >
                            <Paper
                                variant="outlined"
                                sx={{
                                    p: 2.5,
                                    borderRadius: 3,
                                    textAlign: 'center',
                                }}
                            >
                                <Avatar
                                    sx={{
                                        width: 64,
                                        height: 64,
                                        mx: 'auto',
                                        mb: 2,
                                        bgcolor: '#1a73e8',
                                        fontWeight: 700,
                                    }}
                                >
                                    {member.name.charAt(0)}
                                </Avatar>

                                <Typography
                                    variant="subtitle1"
                                    fontWeight={700}
                                >
                                    {member.name}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    {member.role}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Paper>

            <Typography
                variant="body2"
                color="text.secondary"
                align="center"
                sx={{
                    mt: 4,
                    mb: 2,
                }}
            >
                KONEK • Cloud Telecom Decision Intelligence Platform
            </Typography>
        </Box>
    );
}