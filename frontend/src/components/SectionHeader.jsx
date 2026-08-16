// components/SectionHeader.jsx
import React from 'react';
import { Box, Typography, Stack } from '@mui/material';

export default function SectionHeader({ title, subtitle, actions }) {
    return (
        <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ mb: 2 }}
        >
            <Box>
                <Typography variant="h5">{title}</Typography>
                {subtitle && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                        {subtitle}
                    </Typography>
                )}
            </Box>
            {actions && <Box>{actions}</Box>}
        </Stack>
    );
}