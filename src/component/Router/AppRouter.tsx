import {RecoilRoot} from "recoil";
import React, {useEffect, useState} from "react";
import AuthContext from "../../context/auth-context";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import View from "../View/View";
import Babysitting from "../Babysitting/Babysitting";
import AuthContainer from "../Auth/AuthContainer";
import {firebaseAuth} from "../../utils/firebase";
import {isUserInAuthWhiteList} from "../../utils/auth";



const privateRouter = createBrowserRouter([
    {
        path: "/",
        element: <View/>,
    },
    {
        path: "/babysitting/add",
        element: <Babysitting/>
    },
    {
        path: "/babysitting/edit/:idBabysitting",
        element: <Babysitting/>
    },
    {
        path: "/login",
        element: <AuthContainer/>
    },
    {
        path: "*",
        element: <p>Error</p>
    },
]);

const publicRouter = createBrowserRouter ([
    {
        path: "*",
        element: <AuthContainer/>
    },
]);

function AppRouter(){

    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const auth = firebaseAuth;

        if (auth) {
            auth.onAuthStateChanged((authUser:any) => {
                if (authUser) {
                    if (isUserInAuthWhiteList(authUser.email)){
                        setCurrentUser(authUser.email);
                    }else{
                        setCurrentUser(null);
                        alert("Access Denied")
                    }
                } else {
                    setCurrentUser(null);
                }
            });
        }
    }, []);

    return (
        <RecoilRoot>
            <React.Suspense fallback={<div>Loading...</div>}>
                <AuthContext.Provider value={currentUser}>
                    {currentUser !== null ? (
                        <RouterProvider router={privateRouter} />
                    ):(
                        <RouterProvider router={publicRouter} />
                    )}
                </AuthContext.Provider>
            </React.Suspense>
        </RecoilRoot>
    )
}

export default AppRouter