import React from "react";
import {firebaseAuth} from "../../utils/firebase";
import {signOut } from "firebase/auth";

function SignOutButton(){

    const auth = firebaseAuth;

    const handleSignOut = async () => {
        try {
            if (auth) {
                await signOut(auth);
                alert("Successfully signed out!");
            }
        } catch (error) {
            console.log("error", error);
        }
    };

    return <button onClick={() => handleSignOut()}>se déconnecter</button>;
};

export default SignOutButton;