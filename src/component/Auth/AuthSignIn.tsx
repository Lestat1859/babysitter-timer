import useInput from "./useInput";
import {firebaseAuth} from "../../utils/firebase";
import {signInWithEmailAndPassword } from "firebase/auth";


function AuthSignIn(){
    const email = useInput("")
    const password = useInput("")
    const auth = firebaseAuth;

    const signIn = async (event:any) => {
        event.preventDefault();
        try {
            if (auth) {
                const user = await signInWithEmailAndPassword(auth,email.value, password.value)
                console.log("user", user)
                //alert(`Welcome Back!`);
            }
        } catch (error : any) {
            console.log("error", error);
            alert(error.message);
        }
    };


    return (
        <>
            <h4>Sign In</h4>
            <form onSubmit={signIn}>
                <input placeholder="Email" {...email}/>
                <input placeholder="Password" type="password" {...password}/>
                <button type="submit">Se connecter</button>
            </form>
        </>

    );
};

export default AuthSignIn;