import React, {useEffect, useState, useContext} from 'react';

import BabySittingList from "../Babysitting/BabySittingList";
import BabySittingFilters from "../Babysitting/BabySittingFilters";
import BabySittingStats from "../Babysitting/BabySittingStats";
import SignOutButton from "../Auth/SignOutButton";
import AuthContext from "../../context/auth-context";

function View(){

    const currentUser=useContext(AuthContext);

    return(
        <>
            Connecté : {currentUser}
            {
                currentUser !== null ?
                    (<SignOutButton />) : (<></>)
            }

            <p></p>

            <BabySittingFilters />
            <BabySittingList />
            <BabySittingStats />
        </>
    )
}

export default View;

