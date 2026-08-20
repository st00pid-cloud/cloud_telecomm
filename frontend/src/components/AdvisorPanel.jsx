import { useState } from 'react';
import {
    Paper,
    Typography,
    Button,
    CircularProgress,
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

import { generateRecommendation } from '../services/advisorService';

export default function AdvisorPanel({ snapshot }) {
    const [loading, setLoading] = useState(false);
    const [recommendation, setRecommendation] = useState('');

    const handleGenerate = async () => {
        try {
            setLoading(true);

            const result =
                await generateRecommendation(snapshot);

            setRecommendation(result.recommendation);
        } catch (err) {
            setRecommendation(
                'Unable to generate recommendation.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper
            sx={{
                mt: 3,
                p: 3,
                borderRadius: 3,
            }}
        >
            <Typography
                variant="h6"
                fontWeight={700}
                gutterBottom
            >
                🤖 KONEK Advisor
            </Typography>

            <Typography
                color="text.secondary"
                sx={{ mb: 2 }}
            >
                AI-powered disaster telecom
                decision support.
            </Typography>

            <Button
                variant="contained"
                startIcon={<AutoAwesomeIcon />}
                onClick={handleGenerate}
                disabled={loading}
            >
                Generate Recommendation
            </Button>

            {loading && (
                <CircularProgress
                    size={24}
                    sx={{ ml: 2 }}
                />
            )}

            {recommendation && (
                <Typography
                    sx={{
                        mt: 3,
                        lineHeight: 1.8,
                    }}
                >
                    {recommendation}
                </Typography>
            )}
        </Paper>
    );
}