// theme.js
import { createTheme } from '@mui/material/styles';

const colors = {
    primary: '#1A73E8',
    background: '#F8FAFD',
    surface: '#FFFFFF',
    border: '#E5E7EB',
    textPrimary: '#202124',
    textSecondary: '#5F6368',
    critical: '#D93025',
    warning: '#F9AB00',
    success: '#1E8E3E',
    info: '#1A73E8',
    muted: '#9AA0A6',
};

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: { main: colors.primary },
        error: { main: colors.critical },
        warning: { main: colors.warning },
        success: { main: colors.success },
        info: { main: colors.info },
        background: { default: colors.background, paper: colors.surface },
        text: { primary: colors.textPrimary, secondary: colors.textSecondary },
        divider: colors.border,
    },
    shape: { borderRadius: 12 },
    typography: {
        fontFamily: '"Google Sans", "Inter", -apple-system, BlinkMacSystemFont, sans-serif',
        h4: { fontSize: '32px', fontWeight: 600, letterSpacing: '-0.01em' },
        h5: { fontSize: '20px', fontWeight: 600 },
        h6: { fontSize: '15px', fontWeight: 500 },
        body1: { fontSize: '14px' },
        body2: { fontSize: '13px', color: colors.textSecondary },
        caption: { fontSize: '12px', color: colors.textSecondary },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: { backgroundColor: colors.background },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    border: `1px solid ${colors.border}`,
                    boxShadow: 'none',
                    backgroundImage: 'none',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    border: `1px solid ${colors.border}`,
                    boxShadow: 'none',
                    borderRadius: 12,
                    transition: 'box-shadow 120ms ease, transform 120ms ease',
                    '&:hover': {
                        boxShadow: '0 1px 6px rgba(32,33,36,0.12)',
                    },
                },
            },
        },
        MuiButton: {
            defaultProps: { disableElevation: true },
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 500,
                    borderRadius: 8,
                    height: 36,
                    paddingLeft: 16,
                    paddingRight: 16,
                },
                outlined: {
                    borderColor: colors.border,
                    '&:hover': { borderColor: colors.primary, backgroundColor: 'rgba(26,115,232,0.04)' },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: { borderRadius: 6, fontWeight: 500, fontSize: '12px' },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderBottom: `1px solid ${colors.border}`,
                    fontSize: '13px',
                    padding: '10px 16px',
                },
                head: {
                    fontWeight: 600,
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    color: colors.textSecondary,
                    backgroundColor: colors.surface,
                },
            },
        },
        MuiTableRow: {
            styleOverrides: {
                root: {
                    '&:hover': { backgroundColor: 'rgba(26,115,232,0.04)' },
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    backgroundColor: colors.surface,
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: colors.surface,
                    color: colors.textPrimary,
                    borderBottom: `1px solid ${colors.border}`,
                },
            },
        },
    },
});

export const statusColors = colors;
export default theme;