import React from "react";
import {fireBaseAnalytics, firebaseAuth} from "../../utils/firebase";
import {signOut } from "firebase/auth";
import {logEvent} from "firebase/analytics";

function SignOutButton(){

    const auth = firebaseAuth;

    const handleSignOut = async () => {
        logEvent(fireBaseAnalytics,"auth_button_signOut");
        try {
            if (auth) {
                await signOut(auth);
                alert("Successfully signed out!");
            }
        } catch (error) {
            console.log("error", error);
        }
    };

    return (
    <>
        <button className={" rounded-full" +
            "hover:text-white hover:bg-blue-600 hover:border-transparent " +
            "focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"}
                   onClick={() => handleSignOut()}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-50">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>

        </button>
    </>)
};

export default SignOutButton;