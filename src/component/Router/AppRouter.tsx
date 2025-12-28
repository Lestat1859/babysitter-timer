import {RecoilRoot, useSetRecoilState} from "recoil";
import React, {useEffect, useState} from "react";
import AuthContext from "../../context/auth-context";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import View from "../View/View";
import Babysitting from "../Babysitting/Babysitting";
import AuthContainer from "../Auth/AuthContainer";
import {firebaseAuth} from "../../utils/firebase";
import {isUserInAuthWhiteList, parseCustomClaims, isUserAuthorizedAsync} from "../../utils/auth";
import {defaultAuth} from "../../interfaces/IAuth";
import ErrorPage from "../Error/ErrorPage";
import {IAuthUser} from "../../interfaces/IAuthUser";
import {User} from "firebase/auth";
import AccessDenied from "../Auth/AccessDenied";
import PendingApproval from "../Auth/PendingApproval";
import { authState, babysittingState } from "../../recoil/recoil_states";
import { fetchBabySittingsFromFireBase } from "../../services/BabySittingService";
import { getAuthorizedUser } from "../../services/AuthorizedUsersService";


import { AdminPanel } from "../Admin/AdminPanel";

const privateRouter = createBrowserRouter([
    {
        path: "/",
        element: <View/>,
    },
    {
        path: "/admin",
        element: <AdminPanel/>
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

// Composant interne qui gère la synchronisation avec Recoil
function AuthProvider({ children }: { children: React.ReactNode }) {
    const setAuthState = useSetRecoilState(authState);
    const setBabysittingState = useSetRecoilState(babysittingState);
    const [currentUser, setCurrentUser] = useState(defaultAuth);
    const [accessDenied, setAccessDenied] = useState(false);
    const [pendingApproval, setPendingApproval] = useState(false);

    // Synchroniser AuthContext avec Recoil authState
    useEffect(() => {
        setAuthState(currentUser);
    }, [currentUser, setAuthState]);

    // Charger les sessions depuis Firebase une seule fois après authentification
    useEffect(() => {
        if (currentUser.uid !== "null" && currentUser.email !== "null") {
            fetchBabySittingsFromFireBase(currentUser)
                .then((sessions) => {
                    setBabysittingState(sessions);
                    console.log(`✅ ${sessions.length} session(s) chargée(s) depuis Firebase`);
                })
                .catch((error) => {
                    console.error('❌ Erreur lors du chargement des sessions:', error);
                    setBabysittingState([]);
                });
        }
    }, [currentUser.uid, currentUser.email, setBabysittingState]);

    useEffect(() => {
        const auth = firebaseAuth;

        if (auth) {
            auth.onAuthStateChanged(async (user: User | null) => {
                if (user) {
                    // User is signed in
                    const authUser = firebaseUserToIAuthUser(user);
                    
                    try {
                        // Vérifier d'abord via Firestore en récupérant directement l'utilisateur
                        // On n'utilise pas isUserAuthorizedAsync car elle retourne false si isActive est false
                        const authorizedUser = await getAuthorizedUser(user.uid);
                        
                        if (authorizedUser) {
                            console.log('User found in Firestore:', authorizedUser);
                            if (authorizedUser.isActive) {
                                // Utiliser le rôle de Firestore
                                setCurrentUser({
                                    id: authUser.uid,
                                    email: authUser.email || authorizedUser.email,
                                    uid: authUser.uid,
                                    role: authorizedUser.role,
                                    isAdmin: authorizedUser.role === 'admin'
                                });
                                setAccessDenied(false);
                                setPendingApproval(false);
                            } else {
                                // Utilisateur trouvé mais désactivé -> En attente
                                console.log('User is inactive -> Pending Approval');
                                setCurrentUser(defaultAuth);
                                setPendingApproval(true);
                                setAccessDenied(false);
                            }
                        } else {
                            console.log('User not found in Firestore -> Checking whitelist');
                            // Fallback vers la whitelist pendant la transition
                            if (authUser.email && isUserInAuthWhiteList(authUser.email)) {
                                
                                // Utiliser les custom claims si disponibles
                                try {
                                    const idTokenResult = await user.getIdTokenResult();
                                    const { role, isAdmin } = parseCustomClaims(idTokenResult);
                                    
                                    setCurrentUser({
                                        id: authUser.uid,
                                        email: authUser.email,
                                        uid: authUser.uid,
                                        role: role,
                                        isAdmin: isAdmin
                                    });
                                    setAccessDenied(false);
                                    setPendingApproval(false);
                                } catch (error) {
                                    // Valeurs par défaut
                                    setCurrentUser({
                                        id: authUser.uid,
                                        email: authUser.email,
                                        uid: authUser.uid,
                                        role: 'user',
                                        isAdmin: false
                                    });
                                    setAccessDenied(false);
                                    setPendingApproval(false);
                                }
                            } else {
                                // Utilisateur non autorisé
                                setCurrentUser(defaultAuth);
                                setAccessDenied(true);
                                setPendingApproval(false);
                            }
                        }
                    } catch (error) {
                        setCurrentUser(defaultAuth);
                        setAccessDenied(true);
                        setPendingApproval(false);
                    }
                } else {
                    // User is signed out
                    setCurrentUser(defaultAuth);
                    setAccessDenied(false);
                    setPendingApproval(false);
                }
            });
        }
    }, []);

    if (pendingApproval) {
        return <PendingApproval />;
    }

    if (accessDenied) {
        return <AccessDenied />;
    }

    return (
        <AuthContext.Provider value={currentUser}>
            {children}
        </AuthContext.Provider>
    );
}

function AppRouter() {
    return (
        <RecoilRoot>
            <React.Suspense fallback={<div>Loading...</div>}>
                <AuthProvider>
                    <AuthContext.Consumer>
                        {(currentUser) => (
                            (currentUser.email !== "") && (currentUser.email !== "null") ? (
                                <RouterProvider router={privateRouter} />
                            ) : (
                                <RouterProvider router={publicRouter} />
                            )
                        )}
                    </AuthContext.Consumer>
                </AuthProvider>
            </React.Suspense>
        </RecoilRoot>
    );
}

export default AppRouter
