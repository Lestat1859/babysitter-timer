import useInput from "./useInput";
import {firebaseAuth} from "../../utils/firebase";
import {createUserWithEmailAndPassword } from "firebase/auth";


function AuthSignUp(){
    const email = useInput("")
    const password = useInput("")
    const auth = firebaseAuth;

    const signUp = async (event:any) => {
        event.preventDefault();
        try {
            if (auth) {
                const user = await createUserWithEmailAndPassword(auth,email.value, password.value)
                console.log("user", user)
                //alert(`Welcome ${email.value}!`);
            }
        } catch (error : any) {
            console.log("error", error);
            alert(error.message);
        }
    };


    return (
        <>
            <h4>Sign Up</h4>
            <form onSubmit={signUp}>
                <input placeholder="Email" {...email}/>
                <input placeholder="Password" type="password" {...password}/>
                <button type="submit">S'inscrire'</button>
            </form>
        </>
    );
};

export default AuthSignUp;