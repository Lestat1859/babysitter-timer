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
import ErrorPage from "../Error/ErrorPage";
import {IAuthUser} from "../../interfaces/IAuthUser";
import {User} from "firebase/auth";
import AccessDenied from "../Auth/AccessDenied";


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
        element: <ErrorPage/>
    },
]);

const publicRouter = createBrowserRouter ([
    {
        path: "/",
        element: <AuthContainer/>
    },
    {
        path: "/login",
        element: <AuthContainer/>
    },
    {
        path: "*",
        element: <ErrorPage/>
    },
]);

const firebaseUserToIAuthUser = (user: User | null): IAuthUser => {
    if (user) {
        return {
            uid: user.uid,
            email: user.email,
        };
    } else {
        return defaultAuth;
    }
};

function AppRouter() {
    const [currentUser, setCurrentUser] = useState(defaultAuth);
    const [accessDenied, setAccessDenied] = useState(false);

    useEffect(() => {
        const auth = firebaseAuth;

        if (auth) {
            auth.onAuthStateChanged((user: User | null) => {
                if (user) {
                    // User is signed in
                    const authUser = firebaseUserToIAuthUser(user);
                    if (authUser.email && isUserInAuthWhiteList(authUser.email)) {
                        setCurrentUser({
                            id: authUser.uid,
                            email: authUser.email,
                            uid: authUser.uid
                        });
                        setAccessDenied(false);
                        //fetchBabySittingFromFireBase();
                    } else {
                        setCurrentUser(defaultAuth);
                        setAccessDenied(true);
                        // alert("Access Denied");
                        // TODO: Display error message on the page
                    }
                } else {
                    // User is signed out
                    setCurrentUser(defaultAuth);
                    setAccessDenied(false);
                }
            });
        }
    }, []);

    if (accessDenied) {
        return <AccessDenied />;
    }

    return (
        <RecoilRoot>
            <React.Suspense fallback={<div>Loading...</div>}>
                <AuthContext.Provider value={currentUser}>
                    {(currentUser.email !== "") && (currentUser.email !== "null") ? (
                        <RouterProvider router={privateRouter} />
                    ) : (
                        <RouterProvider router={publicRouter} />
                    )}
                </AuthContext.Provider>
            </React.Suspense>
        </RecoilRoot>
    );
}

export default AppRouter
