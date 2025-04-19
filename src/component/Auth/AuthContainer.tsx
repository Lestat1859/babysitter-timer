import React, { useState } from "react";
import useInput from "./useInput";
import { fireBaseAnalytics, firebaseAuth } from "../../utils/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { logEvent } from "firebase/analytics";
import { toast } from 'react-toastify';
import { 
    Box, 
    Card, 
    CardContent, 
    Typography, 
    Button, 
    CircularProgress,
    useTheme,
    Paper
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { 
    Email as EmailIcon, 
    Lock as LockIcon,
    Login as LoginIcon,
    PersonAdd as SignUpIcon
} from "@mui/icons-material";

function AuthContainer() {
    const email = useInput("");
    const password = useInput("");
    const auth = firebaseAuth;
    const [isLoading, setIsLoading] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const theme = useTheme();

    const validateInputs = () => {
        let isValid = true;
        setEmailError("");
        setPasswordError("");
        
        // Email validation
        if (!email.value) {
            setEmailError("L'email est requis");
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email.value)) {
            setEmailError("Format d'email invalide");
            isValid = false;
        }
        
        // Password validation
        if (!password.value) {
            setPasswordError("Le mot de passe est requis");
            isValid = false;
        } else if (password.value.length < 6) {
            setPasswordError("Le mot de passe doit contenir au moins 6 caractères");
            isValid = false;
        }
        
        return isValid;
    };

    const handleAuthError = (error: any) => {
        console.log("error", error);
        
        // Translate common Firebase auth errors to user-friendly messages
        if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
            toast.error("Email ou mot de passe incorrect");
        } else if (error.code === "auth/email-already-in-use") {
            toast.error("Cet email est déjà utilisé");
        } else if (error.code === "auth/network-request-failed") {
            toast.error("Problème de connexion réseau");
        } else if (error.code === "auth/too-many-requests") {
            toast.error("Trop de tentatives, veuillez réessayer plus tard");
        } else {
            toast.error(error.message);
        }
    };

    const signIn = async (event: React.FormEvent) => {
        event.preventDefault();
        
        if (!validateInputs()) return;
        
        setIsLoading(true);
        logEvent(fireBaseAnalytics, "auth_button_signIn");
        
        try {
            if (auth) {
                const user = await signInWithEmailAndPassword(auth, email.value, password.value);
                console.log("user", user.user.email);
                toast.success(`Bienvenue ${user.user.email}!`);
            }
        } catch (error: any) {
            handleAuthError(error);
        } finally {
            setIsLoading(false);
        }
    };

    const signUp = async (event: React.MouseEvent) => {
        event.preventDefault();
        
        if (!validateInputs()) return;
        
        setIsLoading(true);
        logEvent(fireBaseAnalytics, "auth_button_signUp");
        
        try {
            if (auth) {
                const user = await createUserWithEmailAndPassword(auth, email.value, password.value);
                console.log("user", user.user.email);
                toast.success(`Compte créé avec succès! Bienvenue ${user.user.email}!`);
            }
        } catch (error: any) {
            handleAuthError(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card 
            sx={{ 
                maxWidth: 500, 
                width: '100%', 
                mx: 'auto', 
                mt: 3, 
                borderRadius: 3, 
                boxShadow: 3,
                overflow: 'visible'
            }}
        >
            {/* Image at the top of the card */}
            <Box 
                component="img"
                src="/images/babysitting-illustration.png"
                alt="Illustration of babysitting"
                sx={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12,
                }}
            />
            
            {/* Header */}
            <Box 
                sx={{ 
                    bgcolor: 'primary.main', 
                    color: 'white',
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography variant="h5" component="h2" fontWeight="bold">
                    Bienvenue
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                    Pour continuer, veuillez vous authentifier ou créer un compte
                </Typography>
            </Box>

            <CardContent sx={{ p: 3 }}>
                <Box component="form" onSubmit={signIn}>
                    {/* Email Field */}
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="body2" component="label" color="text.secondary" gutterBottom>
                            Email
                        </Typography>
                        <Paper
                            elevation={0}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                p: 1,
                                borderRadius: 2,
                                border: '1px solid',
                                borderColor: emailError ? 'error.main' : 'divider',
                                bgcolor: alpha(theme.palette.primary.main, 0.05),
                                mb: emailError ? 0.5 : 0,
                                '& input:-webkit-autofill': {
                                    WebkitBoxShadow: `0 0 0 100px ${alpha(theme.palette.primary.main, 0.05)} inset !important`,
                                    WebkitTextFillColor: `${theme.palette.text.primary} !important`,
                                    caretColor: theme.palette.text.primary
                                }
                            }}
                        >
                            <EmailIcon color="primary" sx={{ mx: 1 }} />
                            <input
                                type="email"
                                value={email.value}
                                onChange={email.onChange}
                                placeholder="Votre email"
                                autoComplete="email"
                                style={{
                                    border: 'none',
                                    outline: 'none',
                                    width: '100%',
                                    padding: '8px',
                                    background: 'transparent',
                                    color: theme.palette.text.primary,
                                    fontSize: '1rem'
                                }}
                            />
                        </Paper>
                        {emailError && (
                            <Typography variant="caption" color="error" sx={{ ml: 1 }}>
                                {emailError}
                            </Typography>
                        )}
                    </Box>
                    
                    {/* Password Field */}
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="body2" component="label" color="text.secondary" gutterBottom>
                            Mot de passe
                        </Typography>
                        <Paper
                            elevation={0}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                p: 1,
                                borderRadius: 2,
                                border: '1px solid',
                                borderColor: passwordError ? 'error.main' : 'divider',
                                bgcolor: alpha(theme.palette.primary.main, 0.05),
                                mb: passwordError ? 0.5 : 0,
                                '& input:-webkit-autofill': {
                                    WebkitBoxShadow: `0 0 0 100px ${alpha(theme.palette.primary.main, 0.05)} inset !important`,
                                    WebkitTextFillColor: `${theme.palette.text.primary} !important`,
                                    caretColor: theme.palette.text.primary
                                }
                            }}
                        >
                            <LockIcon color="primary" sx={{ mx: 1 }} />
                            <input
                                type="password"
                                value={password.value}
                                onChange={password.onChange}
                                placeholder="Votre mot de passe"
                                autoComplete="current-password"
                                style={{
                                    border: 'none',
                                    outline: 'none',
                                    width: '100%',
                                    padding: '8px',
                                    background: 'transparent',
                                    color: theme.palette.text.primary,
                                    fontSize: '1rem'
                                }}
                            />
                        </Paper>
                        {passwordError && (
                            <Typography variant="caption" color="error" sx={{ ml: 1 }}>
                                {passwordError}
                            </Typography>
                        )}
                    </Box>

                    {/* Buttons */}
                    <Box 
                        sx={{ 
                            display: 'flex',
                            justifyContent: 'space-between',
                            flexDirection: { xs: 'column', sm: 'row' },
                            gap: 2,
                            mt: 2
                        }}
                    >
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={signUp}
                            disabled={isLoading}
                            startIcon={isLoading ? <CircularProgress size={20} /> : <SignUpIcon />}
                            fullWidth={true}
                            sx={{ 
                                width: { xs: '100%', sm: 'auto' }
                            }}
                        >
                            S'inscrire
                        </Button>
                        
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            disabled={isLoading}
                            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
                            size="large"
                            fullWidth={true}
                            sx={{ 
                                width: { xs: '100%', sm: 'auto' }
                            }}
                        >
                            Se connecter
                        </Button>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}

export default AuthContainer;
