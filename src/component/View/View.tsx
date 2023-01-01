import React, {useContext, useEffect} from 'react';

import BabySittingList from "../Babysitting/BabySittingList";
import BabySittingFilters from "../Babysitting/BabySittingFilters";
import BabySittingStats from "../Babysitting/BabySittingStats";
import SignOutButton from "../Auth/SignOutButton";
import AuthContext from "../../context/auth-context";
import {useRecoilState} from "recoil";
import {babysittingState} from "../../recoil/recoil_states";
import {child, get, ref} from "firebase/database";
import {IBabySitting} from "../../interfaces/IBabySitting";
import {firebaseDatabase} from "../../utils/firebase";

function View(){

    const currentUser=useContext(AuthContext);
    const [babysittings, setBabysittings] = useRecoilState(babysittingState);

    function fetchBabySittingFromFireBase(){
        const dbRef = ref(firebaseDatabase);
        get(child(dbRef, `Iloukia/`)).then((snapshot) => {
            if (snapshot.exists()) {
                const babysittingsFetched:any = [];
                snapshot.forEach((babysittingInFirebase)=>{
                    const babysitting:IBabySitting = {
                        id:babysittingInFirebase.key || "" ,
                        arrivalDate:new Date(babysittingInFirebase.val().arrivalDate),
                        departureDate:new Date(babysittingInFirebase.val().departureDate),
                        duration:babysittingInFirebase.val().duration
                    }
                    babysittingsFetched.push(babysitting);
                })
                setBabysittings(babysittingsFetched);
            } else {
            }
        }).catch((error) => {
            console.error(error);
        });
    }


    useEffect(() => {
            fetchBabySittingFromFireBase()
    }, []);


/*
    useEffect(() => {
        console.log("Chargement View");
        console.table(babysittings);
    }, [babysittings]);
*/

    return(
        <>
            <div className={"mb-5 pt-4 pb-4 px-8 max-w-full bg-blue-500 border-solid shadow-lg flex justify-between" } >
                <p className={"font-medium text-md text-gray-50 md:text-xl"}> Suivi des présences périscolaires</p>
                <div className={"flex items-center"}>

                    <p className={"mr-3 text-gray-50 hidden md:block"}>Bienvenue {currentUser.email} </p>
                    {
                        currentUser.email !== "" ?
                            (<SignOutButton />) : (<></>)
                    }
                </div>
            </div>


            <BabySittingFilters />
            <BabySittingList />
            <BabySittingStats />
        </>
    )
}

export default View;

