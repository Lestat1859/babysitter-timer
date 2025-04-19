import React, { useContext, useEffect, useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  Container, 
  Chip, 
  Avatar, 
  CircularProgress 
} from '@mui/material';
import { AccessTime as AccessTimeIcon, Person as PersonIcon } from '@mui/icons-material';

import BabySittingList from "../Babysitting/BabySittingList";
import BabySittingFilters from "../Babysitting/BabySittingFilters";
import BabySittingStats from "../Babysitting/BabySittingStats";
import SignOutButton from "../Auth/SignOutButton";
import ThemeToggle from "../common/ThemeToggle";
import FloatingActionButton from "../common/FloatingActionButton";
import AuthContext from "../../context/auth-context";
import { useRecoilState } from "recoil";
import { babysittingState, priceTimeIntervalState } from "../../recoil/recoil_states";
import { child, ref, onValue } from "firebase/database";
import { IBabySitting } from "../../interfaces/IBabySitting";
import { firebaseDatabase, fireBaseAnalytics } from "../../utils/firebase";
import { IPriceTimeInterval } from "../../interfaces/IPriceTimeInterval";
import { logEvent } from "firebase/analytics";

function View() {
    const [isLoading, setIsLoading] = useState(true);
    const currentUser = useContext(AuthContext);
    // These state variables are used indirectly through recoil selectors
    const [, setBabysittings] = useRecoilState(babysittingState);
    const [, setPriceTimerIntervals] = useRecoilState(priceTimeIntervalState);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    function fetchPriceTimerintervalFromFirebase() {
        const dbRef = ref(firebaseDatabase);
        const path = "PriceTimeInterval/";
        onValue(child(dbRef, path), (snapshot) => {
            if (snapshot.exists()) {
                const priceTimerintervalFetched: any = [];
                snapshot.forEach((priceTimerintervalInFirebase) => {
                    const priceTimerinterval: IPriceTimeInterval = {
                        begin: new Date(priceTimerintervalInFirebase.val().begin),
                        end: new Date(priceTimerintervalInFirebase.val().end),
                        price: priceTimerintervalInFirebase.val().price
                    }
                    priceTimerintervalFetched.push(priceTimerinterval);
                })
                setPriceTimerIntervals(priceTimerintervalFetched);
            }
        });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    function fetchBabySittingFromFireBase() {
        const dbRef = ref(firebaseDatabase);
        const path = "Iloukia/";
        onValue(child(dbRef, path), (snapshot) => {
            if (snapshot.exists()) {
                const babysittingsFetched: any = [];
                snapshot.forEach((babysittingInFirebase) => {
                    const babysitting: IBabySitting = {
                        id: babysittingInFirebase.key || "",
                        arrivalDate: new Date(babysittingInFirebase.val().arrivalDate),
                        departureDate: new Date(babysittingInFirebase.val().departureDate),
                        duration: babysittingInFirebase.val().duration
                    }
                    babysittingsFetched.push(babysitting);
                })
                setBabysittings(babysittingsFetched);
            }
        });
    }

    useEffect(() => {
        Promise.all([
            fetchBabySittingFromFireBase(),
            fetchPriceTimerintervalFromFirebase()
        ]).finally(() => {
            setIsLoading(false);
        });
        logEvent(fireBaseAnalytics, 'view_home');
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Render loading indicator or main content
    if (isLoading) {
        return (
            <Box 
                display="flex" 
                justifyContent="center" 
                alignItems="center" 
                minHeight="100vh"
            >
                <Box textAlign="center">
                    <CircularProgress color="primary" size={40} sx={{ mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                        Chargement des données...
                    </Typography>
                </Box>
            </Box>
        );
    }

    return (
        <>
            <AppBar 
                position="sticky" 
                sx={{ 
                    mb: 3,
                    background: 'linear-gradient(90deg, #3b82f6 0%, #4f46e5 100%)',
                    boxShadow: 3,
                    borderBottom: '1px solid rgba(59, 130, 246, 0.2)'
                }}
            >
                <Toolbar>
                    <Box display="flex" alignItems="center">
                        <Avatar 
                            sx={{ 
                                mr: 2, 
                                bgcolor: 'rgba(255, 255, 255, 0.1)',
                                width: 40,
                                height: 40
                            }}
                        >
                            <AccessTimeIcon />
                        </Avatar>
                        <Typography 
                            variant="h6" 
                            component="h1" 
                            sx={{ 
                                fontWeight: 600,
                                fontSize: { xs: '1rem', md: '1.25rem' }
                            }}
                        >
                            Suivi des présences périscolaires
                        </Typography>
                    </Box>
                    
                    <Box sx={{ flexGrow: 1 }} />
                    
                    {currentUser.email !== "" && (
                        <Box display="flex" alignItems="center">
                            <Chip
                                icon={<PersonIcon color="primary" />}
                                label={currentUser.email}
                                sx={{
                                    mr: 2,
                                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                                    color: 'white',
                                    display: { xs: 'none', md: 'flex' },
                                    '& .MuiChip-label': {
                                        maxWidth: 150,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }
                                }}
                            />
                            <Box display="flex" alignItems="center" gap={1}>
                                <ThemeToggle />
                                <SignOutButton />
                            </Box>
                        </Box>
                    )}
                </Toolbar>
            </AppBar>

            <Container maxWidth="lg">
                <BabySittingFilters />
                <BabySittingList />
                <BabySittingStats />
                <FloatingActionButton 
                    tooltip="Ajouter une présence"
                    to="/babysitting/add"
                    showOnDesktop={true} 
                />
            </Container>
        </>
    );
}

export default View;
