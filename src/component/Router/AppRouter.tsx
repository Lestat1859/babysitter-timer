import {RecoilRoot} from "recoil";
import React, {useEffect, useState} from "react";
import AuthContext from "../../context/auth-context";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import View from "../View/View";
import Babysitting from "../Babysitting/Babysitting";
import AuthContainer from "../Auth/AuthContainer";
import {firebaseAuth} from "../../utils/firebase";
import {isUserInAuthWhiteList} from "../../utils/auth";
import {defaultAuth} from "../../interfaces/IAuth";



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

    const [currentUser, setCurrentUser] = useState(defaultAuth);

    useEffect(() => {
        const auth = firebaseAuth;

        if (auth) {
            auth.onAuthStateChanged((authUser:any) => {
                if (authUser) {
                    if (isUserInAuthWhiteList(authUser.email)){
                        setCurrentUser({
                            id: authUser.uid,
                            email: authUser.email});
                    }else{
                        setCurrentUser(defaultAuth);
                        alert("Access Denied")
                    }
                } else {
                    setCurrentUser(defaultAuth);
                }
            });
        }

    }, []);

    return (
        <RecoilRoot>
            <React.Suspense fallback={<div>Loading...</div>}>
                <AuthContext.Provider value={currentUser}>
                    {(currentUser.email !== "") && (currentUser.email != "null") ? (
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