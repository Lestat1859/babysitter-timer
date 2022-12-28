import React, {useContext} from 'react';

import BabySittingList from "../Babysitting/BabySittingList";
import BabySittingFilters from "../Babysitting/BabySittingFilters";
import BabySittingStats from "../Babysitting/BabySittingStats";
import SignOutButton from "../Auth/SignOutButton";
import AuthContext from "../../context/auth-context";

function View(){

    const currentUser=useContext(AuthContext);

    return(
        <>
            <div className={"mb-5 pt-4 pb-4 px-8 max-w-full bg-blue-500 border-solid shadow-lg flex justify-between" } >
                <p className={"font-medium text-md text-gray-50 md:text-xl"}> Suivi des présences périscolaires</p>
                <div className={"flex items-center"}>

                    <p className={"mr-3 text-gray-50 hidden md:block"}>Bienvenue {currentUser} </p>
                    {
                        currentUser !== null ?
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

