// components/EmptyState.jsx
import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';

export default function EmptyState({ title, description, icon }) {
    return (
        <Box
            sx={{
                py: 6,
                px: 3,
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Box
                sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(26,115,232,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                    color: 'primary.main',
                }}
            >
                {icon || <InboxOutlinedIcon fontSize="small" />}
            </Box>
            <Stack spacing={0.5} sx={{ maxWidth: 360 }}>
                <Typography variant="h6">{title}</Typography>
                <Typography variant="body2" color="text.secondary">
                    {description}
                </Typography>
            </Stack>
        </Box>
    );
}