import React, { useEffect, useMemo, useState } from 'react';
import {
    Alert,
    Box,
    Chip,
    CircularProgress,
    Divider,
    Grid,
    LinearProgress,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
    Stack,
    Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';

import GroupsIcon from '@mui/icons-material/Groups';
import CellTowerIcon from '@mui/icons-material/CellTower';
import WifiIcon from '@mui/icons-material/Wifi';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import SecurityIcon from '@mui/icons-material/Security';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CampaignIcon from '@mui/icons-material/Campaign';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';

import AdvisorPanel from '../components/AdvisorPanel';
import { getExecutiveDashboard } from '../api/telecomApi';

function safeNumber(value, fallback = 0) {
    const numericValue = Number(value);
    return Number.isFinite(numericValue) ? numericValue : fallback;
}

function formatNumber(value) {
    const numericValue = Number(value);

    if (!Number.isFinite(numericValue)) {
        return '—';
    }

    return numericValue.toLocaleString();
}

function clampPercent(value) {
    return Math.max(0, Math.min(100, safeNumber(value)));
}

function getSituationState(connectivity) {
    if (connectivity < 50) {
        return {
            label: 'Critical Response Required',
            shortLabel: 'Critical',
            tone: 'error',
            title: 'Critical service disruption',
            description:
                'Connectivity is below acceptable continuity levels. LGU coordination and public safety communication support should be prioritized.',
            actionLabel: 'Immediate action',
        };
    }

    if (connectivity < 80) {
        return {
            label: 'Partial Service Disruption',
            shortLabel: 'Monitoring',
            tone: 'warning',
            title: 'Partial service disruption',
            description:
                'Some areas may experience unstable service. Continue monitoring and prepare contingency communication support.',
            actionLabel: 'Monitor closely',
        };
    }

    return {
        label: 'Operational Monitoring',
        shortLabel: 'Stable',
        tone: 'success',
        title: 'Connectivity generally stable',
        description:
            'Regional connectivity is within a manageable range. Continue routine monitoring and validate readiness.',
        actionLabel: 'Stable watch',
    };
}

function getPaletteColors(theme, tone) {
    const color =
        theme.palette[tone]?.main ||
        theme.palette.primary.main;

    return {
        main: color,
        soft: alpha(color, 0.08),
        softer: alpha(color, 0.04),
        border: alpha(color, 0.24),
    };
}

function SectionCard({ children, sx }) {
    return (
        <Paper
            variant="outlined"
            sx={{
                borderRadius: 2,
                bgcolor: 'background.paper',
                borderColor: 'divider',
                boxShadow: '0 8px 24px rgba(15, 23, 42, 0.04)',
                ...sx,
            }}
        >
            {children}
        </Paper>
    );
}

function StatItem({
                      icon,
                      label,
                      value,
                      tone = 'primary',
                  }) {
    return (
        <Box
            sx={(theme) => {
                const colors = getPaletteColors(theme, tone);

                return {
                    p: 2,
                    borderRadius: 1,
                    bgcolor: colors.softer,
                    border: '1px solid',
                    borderColor: colors.border,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                };
            }}
        >
            <Box
                sx={(theme) => {
                    const colors = getPaletteColors(theme, tone);

                    return {
                        width: 44,
                        height: 44,
                        borderRadius: 1,
                        bgcolor: colors.soft,
                        color: colors.main,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 1,
                        flexShrink: 0,
                    };
                }}
            >
                {icon}
            </Box>

            <Typography
                variant="body2"
                color="text.secondary"
                sx={{ lineHeight: 1.2 }}
            >
                {label}
            </Typography>

            <Typography
                variant="h4"
                fontWeight={800}
                sx={{
                    lineHeight: 1.1,
                    mt: 1.5,
                    color: 'text.primary',
                }}
            >
                {value}
            </Typography>
        </Box>
    );
}

function IndicatorCard({
                           icon,
                           title,
                           value,
                           helper,
                           tone = 'primary',
                       }) {
    return (
        <Paper
            variant="outlined"
            sx={{
                p: 2,
                borderRadius: 1,
                height: '100%',
                bgcolor: 'background.paper',
            }}
        >
            <Stack
                direction="row"
                spacing={3}
                alignItems="flex-start"
            >
                <Box
                    sx={(theme) => {
                        const colors = getPaletteColors(
                            theme,
                            tone
                        );

                        return {
                            width: 40,
                            height: 40,
                            borderRadius: 1,
                            bgcolor: colors.soft,
                            color: colors.main,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                        };
                    }}
                >
                    {icon}
                </Box>

                <Box sx={{ minWidth: 0 }}>
                    <Typography
                        variant="body2"
                        fontWeight={700}
                    >
                        {title}
                    </Typography>

                    <Typography
                        variant="h5"
                        fontWeight={800}
                        sx={{
                            mt: 0.5,
                            lineHeight: 1,
                        }}
                    >
                        {value}
                    </Typography>

                    {helper && (
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                                display: 'block',
                                mt: 2,
                                lineHeight: 1.3,
                            }}
                        >
                            {helper}
                        </Typography>
                    )}
                </Box>
            </Stack>
        </Paper>
    );
}

function ActionItem({ icon, title, description }) {
    return (
        <ListItem
            disableGutters
            alignItems="flex-start"
            sx={{ py: 1.5 }}
        >
            <ListItemIcon
                sx={{
                    minWidth: 36,
                    mt: 0.25,
                }}
            >
                {icon}
            </ListItemIcon>

            <ListItemText
                primary={
                    <Typography
                        variant="body2"
                        fontWeight={700}
                    >
                        {title}
                    </Typography>
                }
                secondary={
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ lineHeight: 1.45 }}
                    >
                        {description}
                    </Typography>
                }
            />
        </ListItem>
    );
}

function getMunicipalityFallbacks(
    status,
    connectivity
) {
    const possibleLists = [
        status['High-Risk Municipalities'],
        status['Priority Municipalities'],
        status['Affected Municipalities'],
        status.highRiskMunicipalities,
        status.priorityMunicipalities,
        status.affectedMunicipalities,
    ];

    const existingList = possibleLists.find(
        (list) =>
            Array.isArray(list) &&
            list.length > 0
    );

    if (existingList) {
        return existingList
            .slice(0, 5)
            .map((item, index) => {
                if (typeof item === 'string') {
                    return {
                        name: item,
                        connectivity: Math.max(
                            10,
                            Math.min(
                                95,
                                connectivity - index * 6
                            )
                        ),
                        severity:
                            index < 2
                                ? 'High'
                                : 'Moderate',
                    };
                }

                return {
                    name:
                        item.name ||
                        item.municipality ||
                        item.city ||
                        `Area ${index + 1}`,
                    connectivity: safeNumber(
                        item.connectivity ??
                        item.connectivityPercentage,
                        Math.max(
                            10,
                            connectivity - index * 6
                        )
                    ),
                    severity:
                        item.severity ||
                        item.status ||
                        (index < 2
                            ? 'High'
                            : 'Moderate'),
                };
            });
    }

    return [
        {
            name: 'Priority LGU coordination area',
            connectivity,
            severity:
                connectivity < 50
                    ? 'High'
                    : 'Moderate',
        },
        {
            name: 'Critical facilities service area',
            connectivity: Math.max(
                0,
                connectivity - 8
            ),
            severity:
                connectivity < 60
                    ? 'High'
                    : 'Moderate',
        },
        {
            name: 'Public safety communications area',
            connectivity: Math.max(
                0,
                connectivity - 14
            ),
            severity:
                connectivity < 70
                    ? 'Moderate'
                    : 'Watch',
        },
    ];
}

export default function ExecutiveDashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadDashboard = () => {
        setLoading(true);
        setError(null);

        getExecutiveDashboard()
            .then((response) => {
                setData(response.data);
            })
            .catch((requestError) => {
                console.error(
                    'Executive dashboard error:',
                    requestError
                );

                setError(
                    'Could not load the LGU dashboard. Please check whether the backend is running.'
                );
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        loadDashboard();
    }, []);

    /*
     * IMPORTANT:
     * These values use the exact state variable declared above:
     * const [data, setData] = useState(null).
     */
    const status =
        data?.highLevelAreaStatus || {};

    const totalAffectedUsers = safeNumber(
        data?.totalAffectedUsers
    );

    const activeOutagesCount = safeNumber(
        data?.activeOutagesCount
    );

    const connectivity = safeNumber(
        data?.regionConnectivityPercentage
    );

    const activeDisasterAlerts =
        status['Active Disaster Alerts'] ?? '—';

    const highRiskSites =
        status['High-Vulnerability Site Count'] ??
        '—';

    const restorationPriorityIndex =
        status[
            'Average Restoration Priority Index'
            ] ?? '—';

    const regionStatus =
        status['Region VI Status'] ||
        'Regional status is not available from the current data source.';

    /*
     * KONEK Advisor operational snapshot.
     * This replaces the invalid dashboardData reference that caused
     * the white-screen runtime error.
     */
    const advisorSnapshot = useMemo(
        () => ({
            affectedCitizens:
            totalAffectedUsers,

            activeOutages:
            activeOutagesCount,

            connectivityPercent:
            connectivity,

            disasterAlerts:
                safeNumber(
                    activeDisasterAlerts
                ),

            operationalSites:
                safeNumber(
                    status[
                        'Operational Site Count'
                        ],
                    Math.max(
                        0,
                        15 - activeOutagesCount
                    )
                ),

            downSites:
            activeOutagesCount,

            highRiskMunicipalities:
                safeNumber(
                    status[
                        'High-Risk Municipality Count'
                        ] ??
                    status[
                        'High-Vulnerability Site Count'
                        ]
                ),

            incidents: Array.isArray(
                status['Restoration Queue']
            )
                ? status[
                    'Restoration Queue'
                    ].slice(0, 15)
                : [],
        }),
        [
            totalAffectedUsers,
            activeOutagesCount,
            connectivity,
            activeDisasterAlerts,
            status,
        ]
    );

    const situation =
        getSituationState(connectivity);

    const municipalityImpacts = useMemo(
        () =>
            getMunicipalityFallbacks(
                status,
                connectivity
            ),
        [status, connectivity]
    );

    const recommendedActions = useMemo(() => {
        if (connectivity < 50) {
            return [
                {
                    icon: (
                        <PriorityHighIcon
                            color="error"
                            fontSize="small"
                        />
                    ),
                    title:
                        'Activate LGU service continuity coordination',
                    description:
                        'Prioritize emergency communication support for affected communities and critical local services.',
                },
                {
                    icon: (
                        <CampaignIcon
                            color="warning"
                            fontSize="small"
                        />
                    ),
                    title:
                        'Issue public advisory updates',
                    description:
                        'Prepare clear public guidance on available communication channels and expected service limitations.',
                },
                {
                    icon: (
                        <VolunteerActivismIcon
                            color="primary"
                            fontSize="small"
                        />
                    ),
                    title:
                        'Coordinate with DRRM and telecom partners',
                    description:
                        'Align restoration priorities with evacuation centers, hospitals, command posts, and public safety teams.',
                },
            ];
        }

        if (connectivity < 80) {
            return [
                {
                    icon: (
                        <WarningAmberIcon
                            color="warning"
                            fontSize="small"
                        />
                    ),
                    title:
                        'Maintain heightened monitoring',
                    description:
                        'Track affected areas and prepare contingency communication support if conditions worsen.',
                },
                {
                    icon: (
                        <CampaignIcon
                            color="primary"
                            fontSize="small"
                        />
                    ),
                    title:
                        'Keep municipal focal persons informed',
                    description:
                        'Share the latest service continuity picture with barangay and municipal response teams.',
                },
                {
                    icon: (
                        <CheckCircleIcon
                            color="success"
                            fontSize="small"
                        />
                    ),
                    title:
                        'Validate restoration progress',
                    description:
                        'Confirm whether restored connectivity supports public safety and response operations.',
                },
            ];
        }

        return [
            {
                icon: (
                    <CheckCircleIcon
                        color="success"
                        fontSize="small"
                    />
                ),
                title:
                    'Continue routine monitoring',
                description:
                    'Maintain dashboard checks and keep escalation channels ready for possible changes in conditions.',
            },
            {
                icon: (
                    <SecurityIcon
                        color="primary"
                        fontSize="small"
                    />
                ),
                title:
                    'Review readiness of critical areas',
                description:
                    'Verify that key facilities and municipal response offices remain reachable.',
            },
            {
                icon: (
                    <TrendingUpIcon
                        color="info"
                        fontSize="small"
                    />
                ),
                title:
                    'Document recovery performance',
                description:
                    'Use the current situation data for after-action review and planning improvements.',
            },
        ];
    }, [connectivity]);

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: 360,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2,
                }}
            >
                <CircularProgress size={28} />

                <Typography color="text.secondary">
                    Loading LGU response dashboard...
                </Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">
                    {error}
                </Alert>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                width: '100%',
                maxWidth: 'none',
                boxSizing: 'border-box',
                px: {
                    xs: 2,
                    md: 4,
                },
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    maxWidth: '100%',
                    mx: 'auto',
                }}
            >
                <Stack
                    direction={{
                        xs: 'column',
                        md: 'row',
                    }}
                    alignItems={{
                        xs: 'flex-start',
                        md: 'center',
                    }}
                    justifyContent="space-between"
                    spacing={2}
                    sx={{ mb: 3 }}
                >
                    <Box sx={{ maxWidth: 760 }}>
                        <Typography
                            variant="h4"
                            fontWeight={800}
                            sx={{
                                lineHeight: 1.1,
                                color: 'text.primary',
                            }}
                        >
                            LGU Response Center
                        </Typography>

                        <Typography
                            color="text.secondary"
                            sx={{
                                mt: 1,
                                fontSize: {
                                    xs: '0.95rem',
                                    md: '1rem',
                                },
                                lineHeight: 1.55,
                            }}
                        >
                            Citizen impact, service
                            continuity, and priority
                            actions for local disaster
                            coordination.
                        </Typography>
                    </Box>
                </Stack>

                <SectionCard
                    sx={{
                        p: {
                            xs: 2.5,
                            md: 3,
                        },
                        mb: 3,
                    }}
                >
                    <Grid
                        container
                        spacing={3}
                        alignItems="center"
                    >
                        <Grid
                            item
                            xs={12}
                            lg={5}
                        >
                            <Stack
                                direction="row"
                                spacing={2}
                                alignItems="flex-start"
                            >
                                <Box
                                    sx={(theme) => {
                                        const colors =
                                            getPaletteColors(
                                                theme,
                                                situation.tone
                                            );

                                        return {
                                            width: 52,
                                            height: 52,
                                            borderRadius: 1,
                                            bgcolor:
                                            colors.soft,
                                            color:
                                            colors.main,
                                            display: 'flex',
                                            alignItems:
                                                'center',
                                            justifyContent:
                                                'center',
                                            flexShrink: 0,
                                        };
                                    }}
                                >
                                    <WarningAmberIcon />
                                </Box>

                                <Box>
                                    <Typography
                                        variant="overline"
                                        color="text.secondary"
                                        fontWeight={800}
                                    >
                                        OVERALL SITUATION
                                    </Typography>

                                    <Typography
                                        variant="h5"
                                        fontWeight={800}
                                    >
                                        {situation.title}
                                    </Typography>

                                    <Typography
                                        color="text.secondary"
                                        sx={{ mt: 1 }}
                                    >
                                        {regionStatus}
                                    </Typography>
                                </Box>
                            </Stack>
                        </Grid>

                        <Grid
                            item
                            xs={12}
                            lg={7}
                        >
                            <Grid
                                container
                                spacing={2}
                                sx={{
                                    width: '100%',
                                }}
                            >
                                <Grid
                                    item
                                    xs={12}
                                    sm={4}
                                >
                                    <StatItem
                                        label="Affected residents"
                                        value={formatNumber(
                                            totalAffectedUsers
                                        )}
                                        tone="error"
                                        icon={
                                            <GroupsIcon />
                                        }
                                    />
                                </Grid>

                                <Grid
                                    item
                                    xs={12}
                                    sm={4}
                                >
                                    <StatItem
                                        label="Active outages"
                                        value={formatNumber(
                                            activeOutagesCount
                                        )}
                                        tone="warning"
                                        icon={
                                            <CellTowerIcon />
                                        }
                                    />
                                </Grid>

                                <Grid
                                    item
                                    xs={12}
                                    sm={4}
                                >
                                    <StatItem
                                        label="Connectivity"
                                        value={`${connectivity}%`}
                                        tone={
                                            connectivity <
                                            50
                                                ? 'error'
                                                : connectivity <
                                                80
                                                    ? 'warning'
                                                    : 'success'
                                        }
                                        icon={<WifiIcon />}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </SectionCard>

                <AdvisorPanel
                    snapshot={advisorSnapshot}
                />

                <Grid
                    container
                    spacing={3}
                    alignItems="stretch"
                    sx={{
                        width: '100%',
                        mt: 0,
                        ml: 0,
                    }}
                >
                    <Grid
                        item
                        xs={12}
                        sx={{
                            width: '100%',
                            pl: '0 !important',
                        }}
                    >
                        <SectionCard
                            sx={{
                                p: {
                                    xs: 2,
                                    md: 2.5,
                                },
                                width: '100%',
                            }}
                        >
                            <Box sx={{ mb: 2.25 }}>
                                <Typography
                                    variant="h6"
                                    fontWeight={800}
                                >
                                    Priority LGU Impact
                                    Areas
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mt: 0.5 }}
                                >
                                    Areas that need
                                    coordination attention
                                    based on current service
                                    continuity data.
                                </Typography>
                            </Box>

                            <Stack spacing={1.25}>
                                {municipalityImpacts.map(
                                    (
                                        area,
                                        index
                                    ) => {
                                        const areaConnectivity =
                                            clampPercent(
                                                area.connectivity
                                            );

                                        const areaTone =
                                            areaConnectivity <
                                            50
                                                ? 'error'
                                                : areaConnectivity <
                                                80
                                                    ? 'warning'
                                                    : 'success';

                                        const areaAction =
                                            areaConnectivity <
                                            50
                                                ? 'Immediate action'
                                                : areaConnectivity <
                                                80
                                                    ? 'Monitor closely'
                                                    : 'Stable watch';

                                        return (
                                            <Paper
                                                key={`${area.name}-${index}`}
                                                variant="outlined"
                                                sx={(
                                                    theme
                                                ) => {
                                                    const colors =
                                                        getPaletteColors(
                                                            theme,
                                                            areaTone
                                                        );

                                                    return {
                                                        p: 2,
                                                        borderRadius: 1,
                                                        borderColor:
                                                            index ===
                                                            0
                                                                ? colors.border
                                                                : 'divider',
                                                        bgcolor:
                                                            index ===
                                                            0
                                                                ? colors.softer
                                                                : 'background.paper',
                                                        width: '100%',
                                                        boxSizing:
                                                            'border-box',
                                                    };
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        display:
                                                            'flex',
                                                        flexDirection:
                                                            {
                                                                xs: 'column',
                                                                md: 'row',
                                                            },
                                                        alignItems:
                                                            {
                                                                xs: 'flex-start',
                                                                md: 'center',
                                                            },
                                                        justifyContent:
                                                            'space-between',
                                                        gap: 2,
                                                        width: '100%',
                                                    }}
                                                >
                                                    <Stack
                                                        direction="row"
                                                        spacing={
                                                            1.5
                                                        }
                                                        alignItems="center"
                                                        sx={{
                                                            minWidth:
                                                                {
                                                                    md: 260,
                                                                },
                                                            flexShrink: 0,
                                                        }}
                                                    >
                                                        <Box
                                                            sx={(
                                                                theme
                                                            ) => {
                                                                const colors =
                                                                    getPaletteColors(
                                                                        theme,
                                                                        areaTone
                                                                    );

                                                                return {
                                                                    width: 36,
                                                                    height: 36,
                                                                    borderRadius: 1,
                                                                    bgcolor:
                                                                    colors.soft,
                                                                    color:
                                                                    colors.main,
                                                                    display:
                                                                        'flex',
                                                                    alignItems:
                                                                        'center',
                                                                    justifyContent:
                                                                        'center',
                                                                    flexShrink: 0,
                                                                };
                                                            }}
                                                        >
                                                            <LocationOnIcon fontSize="small" />
                                                        </Box>

                                                        <Box
                                                            sx={{
                                                                minWidth: 0,
                                                            }}
                                                        >
                                                            <Typography
                                                                variant="body2"
                                                                fontWeight={
                                                                    800
                                                                }
                                                                noWrap
                                                            >
                                                                {
                                                                    area.name
                                                                }
                                                            </Typography>

                                                            <Typography
                                                                variant="caption"
                                                                color="text.secondary"
                                                            >
                                                                Severity:{' '}
                                                                {
                                                                    area.severity
                                                                }
                                                            </Typography>
                                                        </Box>
                                                    </Stack>

                                                    <Stack
                                                        direction="row"
                                                        alignItems="center"
                                                        spacing={
                                                            1.5
                                                        }
                                                        sx={{
                                                            flex: 1,
                                                            width: '100%',
                                                            mx: {
                                                                md: 2,
                                                            },
                                                        }}
                                                    >
                                                        <Box
                                                            sx={{
                                                                flex: 1,
                                                            }}
                                                        >
                                                            <LinearProgress
                                                                variant="determinate"
                                                                value={
                                                                    areaConnectivity
                                                                }
                                                                color={
                                                                    areaTone
                                                                }
                                                                sx={{
                                                                    height: 8,
                                                                    borderRadius: 3,
                                                                    bgcolor:
                                                                        'grey.100',
                                                                    width: '100%',
                                                                }}
                                                            />
                                                        </Box>

                                                        <Typography
                                                            variant="body2"
                                                            fontWeight={
                                                                800
                                                            }
                                                            sx={{
                                                                width: 44,
                                                                textAlign:
                                                                    'right',
                                                                flexShrink: 0,
                                                            }}
                                                        >
                                                            {
                                                                areaConnectivity
                                                            }
                                                            %
                                                        </Typography>
                                                    </Stack>

                                                    <Chip
                                                        label={
                                                            areaAction
                                                        }
                                                        color={
                                                            areaTone
                                                        }
                                                        size="small"
                                                        sx={{
                                                            fontWeight: 700,
                                                            flexShrink: 0,
                                                        }}
                                                    />
                                                </Box>
                                            </Paper>
                                        );
                                    }
                                )}
                            </Stack>
                        </SectionCard>
                    </Grid>

                    <Grid
                        item
                        xs={12}
                        sx={{ width: '100%' }}
                    >
                        <SectionCard
                            sx={{
                                p: {
                                    xs: 2,
                                    md: 2.5,
                                },
                                width: '100%',
                            }}
                        >
                            <Typography
                                variant="h6"
                                fontWeight={800}
                            >
                                Immediate LGU Actions
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mt: 0.5 }}
                            >
                                Practical decisions for
                                local response coordination.
                            </Typography>

                            <Divider sx={{ my: 2 }} />

                            <List
                                dense
                                disablePadding
                                sx={{ width: '100%' }}
                            >
                                {recommendedActions.map(
                                    (action) => (
                                        <ActionItem
                                            key={
                                                action.title
                                            }
                                            icon={
                                                action.icon
                                            }
                                            title={
                                                action.title
                                            }
                                            description={
                                                action.description
                                            }
                                        />
                                    )
                                )}
                            </List>
                        </SectionCard>
                    </Grid>

                    <Grid
                        item
                        xs={12}
                        sx={{ width: '100%' }}
                    >
                        <SectionCard
                            sx={{
                                p: {
                                    xs: 2.5,
                                    md: 3,
                                },
                                width: '100%',
                            }}
                        >
                            <Box sx={{ mb: 2.5 }}>
                                <Typography
                                    variant="h6"
                                    fontWeight={800}
                                >
                                    Regional Indicators
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Supporting metrics for
                                    monitoring and executive
                                    reporting.
                                </Typography>
                            </Box>

                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns:
                                        {
                                            xs: '1fr',
                                            sm: 'repeat(2, minmax(0, 1fr))',
                                        },
                                    gap: 2,
                                    width: '100%',
                                }}
                            >
                                <IndicatorCard
                                    title="Affected Citizens"
                                    value={formatNumber(
                                        totalAffectedUsers
                                    )}
                                    helper="Estimated users experiencing impact"
                                    tone="error"
                                    icon={<GroupsIcon />}
                                />

                                <IndicatorCard
                                    title="Active Outages"
                                    value={formatNumber(
                                        activeOutagesCount
                                    )}
                                    helper="Outage records requiring monitoring"
                                    tone="warning"
                                    icon={
                                        <CellTowerIcon />
                                    }
                                />

                                <IndicatorCard
                                    title="Regional Connectivity"
                                    value={`${connectivity}%`}
                                    helper="Current service continuity level"
                                    tone={
                                        connectivity < 50
                                            ? 'error'
                                            : connectivity <
                                            80
                                                ? 'warning'
                                                : 'success'
                                    }
                                    icon={<WifiIcon />}
                                />

                                <IndicatorCard
                                    title="Disaster Alerts"
                                    value={
                                        activeDisasterAlerts
                                    }
                                    helper={`${highRiskSites} high-risk sites (Index: ${restorationPriorityIndex})`}
                                    tone="info"
                                    icon={
                                        <WarningAmberIcon />
                                    }
                                />
                            </Box>
                        </SectionCard>
                    </Grid>

                    <Grid
                        item
                        xs={12}
                        sx={{ width: '100%' }}
                    >
                        <Paper
                            elevation={0}
                            sx={(theme) => {
                                const colors =
                                    getPaletteColors(
                                        theme,
                                        situation.tone
                                    );

                                return {
                                    width: '100%',
                                    boxSizing:
                                        'border-box',
                                    p: {
                                        xs: 3,
                                        md: 4,
                                    },
                                    borderRadius: 4,
                                    border: '1px solid',
                                    borderColor:
                                    colors.border,
                                    bgcolor:
                                    colors.softer,
                                    overflow: 'hidden',
                                };
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: {
                                        xs: 'column',
                                        sm: 'row',
                                    },
                                    gap: 2.5,
                                    alignItems:
                                        'flex-start',
                                    width: '100%',
                                }}
                            >
                                <Box
                                    sx={(theme) => {
                                        const colors =
                                            getPaletteColors(
                                                theme,
                                                situation.tone
                                            );

                                        return {
                                            width: 48,
                                            height: 48,
                                            borderRadius: 2,
                                            bgcolor:
                                            colors.soft,
                                            color:
                                            colors.main,
                                            display: 'flex',
                                            alignItems:
                                                'center',
                                            justifyContent:
                                                'center',
                                            flexShrink: 0,
                                        };
                                    }}
                                >
                                    <CampaignIcon />
                                </Box>

                                <Box
                                    sx={{
                                        flex: 1,
                                        minWidth: 0,
                                    }}
                                >
                                    <Typography
                                        variant="h6"
                                        fontWeight={800}
                                        sx={{
                                            lineHeight: 1.2,
                                            color: 'text.primary',
                                            mb: 1,
                                        }}
                                    >
                                        Executive Response
                                        Context
                                    </Typography>

                                    <Typography
                                        color="text.secondary"
                                        sx={{
                                            lineHeight: 1.6,
                                            fontSize:
                                                '0.95rem',
                                        }}
                                    >
                                        {
                                            situation.description
                                        }{' '}
                                        Use KONEK Advisor
                                        above to generate a
                                        current AI-assisted
                                        recommendation from
                                        the dashboard
                                        indicators.
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}