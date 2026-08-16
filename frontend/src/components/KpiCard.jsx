// components/KpiCard.jsx
import React from 'react';
import { Card, Box, Typography, Stack } from '@mui/material';
import { statusColors } from '../theme';

// status controls a thin top accent line only — no colored side strips
export default function KpiCard({ label, value, unit, status, trend, icon }) {
    const accent = status ? statusColors[status] : statusColors.primary;

    return (
        <Card
            sx={{
                p: 2.5,
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    backgroundColor: accent,
                },
            }}
        >
            <Stack spacing={1}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                        {label}
                    </Typography>
                    {icon}
                </Stack>
                <Stack direction="row" alignItems="baseline" spacing={0.5}>
                    <Typography sx={{ fontSize: { xs: 28, md: 36 }, fontWeight: 600, lineHeight: 1 }}>
                        {value}
                    </Typography>
                    {unit && (
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {unit}
                        </Typography>
                    )}
                </Stack>
                {trend && (
                    <Typography variant="caption" sx={{ color: trend.positive ? statusColors.success : statusColors.critical }}>
                        {trend.label}
                    </Typography>
                )}
            </Stack>
        </Card>
    );
}