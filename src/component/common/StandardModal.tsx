import React from 'react';
import {
    Dialog,
    DialogContent,
    Box,
    Typography,
    IconButton,
    Paper,
    Button,
    useTheme,
    useMediaQuery,
    Stack,
    Fade,
    Slide
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { ArrowBack as ArrowBackIcon, Save as SaveIcon } from '@mui/icons-material';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface StandardModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    summary?: React.ReactNode;
    recap?: React.ReactNode;
    primaryAction?: {
        label: string;
        onClick: () => void;
        disabled?: boolean;
        loading?: boolean;
        icon?: React.ReactNode;
    };
    children: React.ReactNode;
}

export const StandardModal: React.FC<StandardModalProps> = ({
    open,
    onClose,
    title,
    summary,
    recap,
    primaryAction,
    children
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullScreen={isMobile}
            maxWidth="sm"
            fullWidth
            TransitionComponent={Transition}
            PaperProps={{
                sx: {
                    bgcolor: 'background.default',
                    borderRadius: isMobile ? 0 : 3,
                    overflow: 'hidden'
                }
            }}
        >
            {/* 1. Header */}
            <Box
                sx={{
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: 2,
                    zIndex: 1
                }}
            >
                <Typography variant="h6" fontWeight={600}>
                    {title}
                </Typography>
                <IconButton
                    onClick={onClose}
                    sx={{ color: 'inherit' }}
                    edge="end"
                    aria-label="close"
                >
                    <ArrowBackIcon />
                </IconButton>
            </Box>

            <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column' }}>
                <Stack spacing={3} sx={{ p: 3, pb: 10 }}>
                    
                    {/* 2. Résumé dynamique */}
                    {summary && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 1 }}>
                            {summary}
                        </Box>
                    )}

                    {/* 3. Formulaire (Sections) */}
                    {children}

                    {/* 4. Récapitulatif visuel */}
                    {recap && (
                        <Paper
                            elevation={0}
                            sx={{
                                p: 2,
                                bgcolor: 'primary.lighter',
                                border: '1px solid',
                                borderColor: 'primary.main',
                                borderRadius: 3,
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '4px',
                                    height: '100%',
                                    bgcolor: 'primary.main'
                                }}
                            />
                            {recap}
                        </Paper>
                    )}

                    {/* 5. CTA Principal */}
                    {primaryAction && (
                        <Button
                            variant="contained"
                            fullWidth
                            size="large"
                            onClick={primaryAction.onClick}
                            disabled={primaryAction.disabled || primaryAction.loading}
                            startIcon={primaryAction.icon || <SaveIcon />}
                            sx={{
                                mt: 2,
                                py: 1.5,
                                fontSize: '1rem',
                                boxShadow: 4
                            }}
                        >
                            {primaryAction.loading ? 'Chargement...' : primaryAction.label}
                        </Button>
                    )}
                </Stack>
            </DialogContent>
        </Dialog>
    );
};

export const ModalSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <Box>
        <Typography
            variant="subtitle2"
            color="text.secondary"
            sx={{
                mb: 1.5,
                textTransform: 'uppercase',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.5px',
                ml: 1
            }}
        >
            {title}
        </Typography>
        <Paper
            elevation={0}
            sx={{
                p: 2,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 3,
                bgcolor: 'background.paper'
            }}
        >
            <Stack spacing={2}>
                {children}
            </Stack>
        </Paper>
    </Box>
);
