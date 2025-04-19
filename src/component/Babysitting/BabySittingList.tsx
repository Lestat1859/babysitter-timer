
import BabySittingElement from "./BabySittingElement";
import { useRecoilValue } from "recoil";
import { filteredBabySittingState, babysittingFilterState } from '../../recoil/recoil_states';
import { monthList } from "../../utils/months";
import React from "react";
import { useNavigate } from "react-router-dom";
import Buttons from "../Buttons/Buttons";
import { logEvent } from "firebase/analytics";
import { fireBaseAnalytics } from "../../utils/firebase";
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Paper, 
  Stack,
  Divider
} from "@mui/material";
import { CalendarToday as CalendarIcon } from "@mui/icons-material";

function BabySittingList() {
    const babySittings = useRecoilValue(filteredBabySittingState);
    const filter = useRecoilValue(babysittingFilterState);
    const navigate = useNavigate();

    function handleNewBabysitting() {
        logEvent(fireBaseAnalytics, "babysitting_list_button_add");
        navigate("/babysitting/add");
    }

    // Get current period description from filter state
    const getCurrentPeriod = () => {
        // Month index in monthList is 0-based, but filter.month is 1-based
        const month = filter.month > 0 && filter.month <= 12 ? monthList[filter.month - 1] : '';
        return `${month} ${filter.year}`;
    };

    return (
        <Card sx={{ mb: 4, borderRadius: 3, boxShadow: 2 }}>
            <CardContent sx={{ pb: 3 }}>
                {/* Header with Add Button */}
                <Box 
                    sx={{ 
                        display: 'flex', 
                        flexDirection: { xs: 'column', sm: 'row' }, 
                        justifyContent: 'space-between', 
                        alignItems: { xs: 'flex-start', sm: 'center' }, 
                        mb: 3 
                    }}
                >
                    <Box>
                        <Typography variant="h5" component="h2" fontWeight="bold" mb={0.5}>
                            Détail des présences
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Période: <Box component="span" fontWeight="medium">{getCurrentPeriod()}</Box>
                        </Typography>
                    </Box>

                    <Box sx={{ mt: { xs: 2, sm: 0 } }}>
                        <Buttons 
                            label="Ajouter" 
                            clickFunction={handleNewBabysitting} 
                            type="standard" 
                            iconImage="add"
                            size="large"
                        />
                    </Box>
                </Box>

                {/* Babysitting List */}
                {babySittings.length !== 0 ? (
                    <Paper 
                        variant="outlined" 
                        sx={{ 
                            borderRadius: 2,
                            overflow: 'hidden'
                        }}
                    >
                        <Stack divider={<Divider />}>
                            {babySittings.map((durationItem, index) => (
                                <Box key={`BabySittingElement-${index}`}>
                                    <BabySittingElement
                                        id={durationItem.id}
                                        arrivalDate={durationItem.arrivalDate}
                                        departureDate={durationItem.departureDate}
                                        duration={durationItem.duration}
                                    />
                                </Box>
                            ))}
                        </Stack>
                    </Paper>
                ) : (
                    <Paper 
                        variant="outlined" 
                        sx={{ 
                            py: 6, 
                            px: 2, 
                            textAlign: 'center',
                            bgcolor: 'grey.50',
                            borderRadius: 2
                        }}
                    >
                        <CalendarIcon 
                            sx={{ 
                                fontSize: 48, 
                                color: 'text.disabled', 
                                mb: 2 
                            }} 
                        />
                        <Typography variant="h6" color="text.primary" fontWeight="medium" mb={1}>
                            Aucune garde durant cette période
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mb={3}>
                            Ajoutez une nouvelle session de babysitting pour commencer.
                        </Typography>
                        <Buttons 
                            label="Ajouter une session" 
                            clickFunction={handleNewBabysitting} 
                            type="standard" 
                            iconImage="add"
                        />
                    </Paper>
                )}
            </CardContent>
        </Card>
    );
}

export default BabySittingList;
