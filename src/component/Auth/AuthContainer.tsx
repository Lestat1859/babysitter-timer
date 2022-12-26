import useInput from "./useInput";
import {firebaseAuth} from "../../utils/firebase";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";


function AuthContainer(){
    const email = useInput("")
    const password = useInput("")
    const auth = firebaseAuth;

    const signIn = async (event:any) => {
        try {
            if (auth) {
                const user = await signInWithEmailAndPassword(auth,email.value, password.value)
                console.log("user", user)
                alert(`Welcome Back!`);
            }
        } catch (error : any) {
            console.log("error", error);
            alert(error.message);
        }
    };

    const signUp = async (event:any) => {
        try {
            if (auth) {
                const user = await createUserWithEmailAndPassword(auth,email.value, password.value)
                console.log("user", user)
                alert(`Welcome ${email.value}!`);
            }
        } catch (error : any) {
            console.log("error", error);
            alert(error.message);
        }
    };



    return (
        <>
            <h4>Connexion</h4>
                <input placeholder="Email" {...email}/>
                <input placeholder="Password" type="password" {...password}/>
                <div>
                    <button onClick={signIn} type="submit">Se connecter</button>/
                    <button onClick={signUp} type="submit">S'inscrire</button>
                </div>
        </>
    )
}

export default AuthContainer