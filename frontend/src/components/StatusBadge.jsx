// components/StatusBadge.jsx
import React from 'react';
import { Chip } from '@mui/material';
import { statusColors } from '../theme';

// status: 'critical' | 'warning' | 'success' | 'info' | 'muted'
const STATUS_MAP = {
    critical: { label: 'Critical', color: statusColors.critical },
    warning: { label: 'Warning', color: statusColors.warning },
    success: { label: 'Normal', color: statusColors.success },
    info: { label: 'Info', color: statusColors.info },
    muted: { label: 'Unknown', color: statusColors.muted },
};

export default function StatusBadge({ status = 'muted', label }) {
    const config = STATUS_MAP[status] || STATUS_MAP.muted;
    return (
        <Chip
            size="small"
            label={label || config.label}
            sx={{
                color: config.color,
                backgroundColor: `${config.color}14`, // ~8% opacity
                border: `1px solid ${config.color}33`,
                '& .MuiChip-label': { px: 1 },
            }}
        />
    );
}