import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container,
  Chip,
  Avatar,
  CircularProgress,
  IconButton,
  Tooltip
} from '@mui/material';
import { AccessTime as AccessTimeIcon, Person as PersonIcon, AdminPanelSettings as AdminIcon } from '@mui/icons-material';

import BabySittingList from "../Babysitting/BabySittingList";
import BabySittingFilters from "../Babysitting/BabySittingFilters";
import BabySittingStats from "../Babysitting/BabySittingStats";
import SignOutButton from "../Auth/SignOutButton";
import ThemeToggle from "../common/ThemeToggle";
import FloatingActionButton from "../common/FloatingActionButton";
import AuthContext from "../../context/auth-context";
import { useRecoilState } from "recoil";
import { priceTimeIntervalState } from "../../recoil/recoil_states";
import { child, ref, onValue } from "firebase/database";
import { firebaseDatabase, fireBaseAnalytics } from "../../utils/firebase";
import { IPriceTimeInterval } from "../../interfaces/IPriceTimeInterval";
import { logEvent } from "firebase/analytics";
import { useUserRole } from '../../hooks/useUserRole';
import { AdminButton } from '../Auth/AdminOnly';

function View() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const currentUser = useContext(AuthContext);
    const { isAdmin } = useUserRole();
    // This state variable is used indirectly through recoil selectors
    const [, setPriceTimerIntervals] = useRecoilState(priceTimeIntervalState);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    function fetchPriceTimerintervalFromFirebase() {
        const dbRef = ref(firebaseDatabase);
        const path = "PriceTimeInterval/";
        onValue(child(dbRef, path), (snapshot) => {
            if (snapshot.exists()) {
                const priceTimerintervalFetched: any = [];
                snapshot.forEach((priceTimerintervalInFirebase) => {
                    const val = priceTimerintervalInFirebase.val();
                    const priceTimerinterval: IPriceTimeInterval = {
                        begin: new Date(val.begin),
                        price: val.price,
                        userId: val.userId
                    };
                    
                    if (val.end) {
                        priceTimerinterval.end = new Date(val.end);
                    }
                    
                    priceTimerintervalFetched.push(priceTimerinterval);
                })
                setPriceTimerIntervals(priceTimerintervalFetched);
            }
        });
    }

    useEffect(() => {
        fetchPriceTimerintervalFromFirebase();
        setIsLoading(false);
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
                    background: 'linear-gradient(90deg, #3b82f6 0%, #4f46e5 100%)',
                    boxShadow: 3,
                    borderBottom: 'none',
                    width: '100%',
                    margin: 0,
                    padding: 0
                }}
            >
                <Toolbar sx={{ padding: { xs: 0, sm: '0 16px' } }}>
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
                                label={
                                    <Box display="flex" alignItems="center">
                                        <Typography variant="body2" sx={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {currentUser.email}
                                        </Typography>
                                        {isAdmin && (
                                            <Box
                                                component="span"
                                                sx={{
                                                    ml: 1,
                                                    px: 0.8,
                                                    py: 0.2,
                                                    borderRadius: 1,
                                                    border: '1px solid gold',
                                                    color: 'gold',
                                                    fontSize: '0.7rem',
                                                    fontWeight: 'bold',
                                                    lineHeight: 1,
                                                    bgcolor: 'rgba(255, 215, 0, 0.1)'
                                                }}
                                            >
                                                Admin
                                            </Box>
                                        )}
                                    </Box>
                                }
                                sx={{
                                    mr: 2,
                                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                                    color: 'white',
                                    display: { xs: 'none', md: 'flex' },
                                    height: 40,
                                    '& .MuiChip-label': {
                                        paddingRight: isAdmin ? 1.5 : 2
                                    }
                                }}
                            />
                            
                            <Box display="flex" alignItems="center" gap={1}>
                                <AdminButton>
                                    <Tooltip title="Panneau d'administration">
                                        <IconButton
                                            onClick={() => navigate('/admin')}
                                            sx={{
                                                bgcolor: 'rgba(255, 255, 255, 0.1)',
                                                color: 'gold',
                                                '&:hover': {
                                                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                                                },
                                                transition: 'all 0.2s ease-in-out',
                                                width: 40,
                                                height: 40,
                                            }}
                                        >
                                            <AdminIcon />
                                        </IconButton>
                                    </Tooltip>
                                </AdminButton>
                                <ThemeToggle />
                                <SignOutButton />
                            </Box>
                        </Box>
                    )}
                </Toolbar>
            </AppBar>

            <BabySittingFilters />
            
            <Container 
                maxWidth="lg" 
                sx={{ 
                    pt: 0
                }}
            >
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
