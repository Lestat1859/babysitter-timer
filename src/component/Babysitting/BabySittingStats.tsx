import React from "react";
import { useRecoilValue } from "recoil";
import { babysittingStatsState } from "../../recoil/recoil_states";
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Paper, 
  Avatar
} from "@mui/material";
import { 
  CalendarMonth as CalendarIcon,
  AccessTime as AccessTimeIcon,
  ShowChart as ShowChartIcon,
  PaidOutlined as PaidIcon
} from "@mui/icons-material";

function BabySittingStats() {
    const { totalBabySittings, totalBabySittingHours, totalAmount } = useRecoilValue(babysittingStatsState);
    const averageHours = totalBabySittings > 0 ? parseFloat((totalBabySittingHours / totalBabySittings).toFixed(2)) : 0;
    
    // Format hours and minutes for display
    const formatHoursMinutes = (hours: number) => {
        const wholeHours = Math.floor(hours);
        const minutes = Math.round((hours - wholeHours) * 60);
        return `${wholeHours}h ${minutes}m`;
    };

    // Only render if there are babysittings
    if (totalBabySittings === 0) return null;

    return (
        <Card sx={{ mb: 4, borderRadius: 3, boxShadow: 2 }}>
            <CardContent sx={{ pb: 3 }}>
                <Typography variant="h5" component="h2" fontWeight="bold" mb={2}>
                    Statistiques
                </Typography>
                
                <Paper 
                    elevation={0} 
                    sx={{ 
                        p: 3, 
                        mb: 2, 
                        bgcolor: 'primary.lighter', 
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'primary.light'
                    }}
                >
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                        {/* Number of sessions */}
                        <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(25% - 12px)' } }}>
                            <Box 
                                sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    p: 2, 
                                    bgcolor: 'background.paper', 
                                    borderRadius: 2,
                                    boxShadow: 1,
                                    border: '1px solid',
                                    borderColor: 'primary.light',
                                    height: '100%'
                                }}
                            >
                                <Avatar 
                                    color="primary"
                                    sx={{ 
                                        mr: 2
                                    }}
                                >
                                    <CalendarIcon />
                                </Avatar>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" fontWeight="medium">
                                        Nombre de gardes
                                    </Typography>
                                    <Typography variant="h6" fontWeight="bold">
                                        {totalBabySittings}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                        
                        {/* Total duration */}
                        <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(25% - 12px)' } }}>
                            <Box 
                                sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    p: 2, 
                                    bgcolor: 'background.paper', 
                                    borderRadius: 2,
                                    boxShadow: 1,
                                    border: '1px solid',
                                    borderColor: 'primary.light',
                                    height: '100%'
                                }}
                            >
                                <Avatar 
                                    color="primary"
                                    sx={{ 
                                        mr: 2
                                    }}
                                >
                                    <AccessTimeIcon />
                                </Avatar>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" fontWeight="medium">
                                        Durée Totale
                                    </Typography>
                                    <Typography variant="h6" fontWeight="bold">
                                        {totalBabySittingHours} heures
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                        
                        {/* Total amount */}
                        <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(25% - 12px)' } }}>
                            <Box 
                                sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    p: 2, 
                                    bgcolor: 'background.paper', 
                                    borderRadius: 2,
                                    boxShadow: 1,
                                    border: '1px solid',
                                    borderColor: 'primary.light',
                                    height: '100%'
                                }}
                            >
                                <Avatar 
                                    color="primary"
                                    sx={{ 
                                        mr: 2
                                    }}
                                >
                                    <PaidIcon />
                                </Avatar>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" fontWeight="medium">
                                        À déclarer
                                    </Typography>
                                    <Typography variant="h6" fontWeight="bold">
                                        {totalAmount} €
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                        
                        {/* Average duration */}
                        <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(25% - 12px)' } }}>
                            <Box 
                                sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    p: 2, 
                                    bgcolor: 'background.paper', 
                                    borderRadius: 2,
                                    boxShadow: 1,
                                    border: '1px solid',
                                    borderColor: 'primary.light',
                                    height: '100%'
                                }}
                            >
                                <Avatar 
                                    color="primary"
                                    sx={{ 
                                        mr: 2
                                    }}
                                >
                                    <ShowChartIcon />
                                </Avatar>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" fontWeight="medium">
                                        Durée moyenne
                                    </Typography>
                                    <Typography variant="h6" fontWeight="bold">
                                        {formatHoursMinutes(averageHours)}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Paper>
            </CardContent>
        </Card>
    );
}

export default BabySittingStats;
