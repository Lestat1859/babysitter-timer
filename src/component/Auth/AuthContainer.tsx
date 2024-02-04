import useInput from "./useInput";
import {fireBaseAnalytics, firebaseAuth} from "../../utils/firebase";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";
import {logEvent} from "firebase/analytics";


function AuthContainer(){
    const email = useInput("")
    const password = useInput("")
    const auth = firebaseAuth;

    const signIn = async (event:any) => {
        logEvent(fireBaseAnalytics,"auth_button_signIn");
        try {
            if (auth) {
                const user = await signInWithEmailAndPassword(auth,email.value, password.value)
                console.log("user", user.user.email)
                alert(`Welcome Back!`);
            }
        } catch (error : any) {
            console.log("error", error);
            alert(error.message);
        }
    };

    const signUp = async (event:any) => {
        logEvent(fireBaseAnalytics,"auth_button_signUp");
        try {
            if (auth) {
                const user = await createUserWithEmailAndPassword(auth,email.value, password.value)
                console.log("user", user.user.email)
                alert(`Welcome ${email.value}!`);
            }
        } catch (error : any) {
            console.log("error", error);
            alert(error.message);
        }
    };

    return (
        <div className={"mt-24 pt-6 pb-6 px-8 max-w-lg mx-auto bg-gray-100 rounded-xl shadow-lg items-center"}>

            <div>
                <h2 className={"mb-3 text-3xl font-semibold"}>Bienvenue</h2>
                <p className={"text-sm text-gray-600 mb-6"}>Pour continuer, veuillez vous authentifier ou créer un compte</p>
                <div className={""}>
                    <div className={"mb-3 flex flex-col"}>
                        <label className={"text-md"}>Email </label>

                        <div className={"relative"}>
                            <div className={"flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none"}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                                     className="w-6 h-6 ">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                </svg>
                            </div>
                            <input className={"border p-1.5 pl-12 w-full"} placeholder="Email" {...email} />
                        </div>

                    </div >
                    <div className={"mb-3 flex flex-col"}>
                        <label className={"text-md"}>Mot de passe </label>

                        <div className={"relative"}>
                            <div className={"flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none"}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                                </svg>
                            </div>
                            <input className={"border p-1.5 pl-12 w-full"} placeholder="Password" type="password" {...password}/>
                        </div>
                    </div>
                </div>

            </div>


            <div className={"mt-12 mb-1 ml-0 border-t border-gray-300"}>
            </div>

            <div>
                <div className={"mt-6 flex justify-around"}>
                    <button className={"mx-1 px-4 py-2 text-sm text-blue-600 font-semibold rounded-md border border-blue-600 " +
                        "hover:text-white hover:bg-blue-600 hover:border-transparent " +
                        "focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"}
                            onClick={signUp} type="submit">
                        <div className={"flex items-center"}>
                            <p className={"mr-2"}>S'inscrire</p>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12" />
                            </svg>
                        </div>
                    </button>
                    <button className={"mx-1 px-4 py-2 text-sm text-blue-600 font-semibold rounded-md border border-blue-600 " +
                        "hover:text-white hover:bg-blue-600 hover:border-transparent " +
                        "focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"}
                            onClick={signIn} type="submit">
                        <div className={"flex items-center"}>
                            <p className={"mr-2"}>Se connecter</p>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                            </svg>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AuthContainer