import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import { Logout as LogoutIcon } from "@mui/icons-material";
import { fireBaseAnalytics, firebaseAuth } from "../../utils/firebase";
import { signOut } from "firebase/auth";
import { logEvent } from "firebase/analytics";
import { toast } from "react-toastify";

function SignOutButton() {
    const auth = firebaseAuth;

    const handleSignOut = async () => {
        logEvent(fireBaseAnalytics, "auth_button_signOut");
        try {
            if (auth) {
                await signOut(auth);
                toast.success("Déconnexion réussie !");
            }
        } catch (error) {
            console.log("error", error);
            toast.error("Erreur lors de la déconnexion");
        }
    };

    return (
        <Tooltip title="Se déconnecter">
            <IconButton
                onClick={() => handleSignOut()}
                aria-label="Se déconnecter"
                sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                    },
                    transition: 'all 0.2s ease-in-out',
                    width: 40,
                    height: 40,
                }}
                size="medium"
            >
                <LogoutIcon />
            </IconButton>
        </Tooltip>
    );
}

export default SignOutButton;
