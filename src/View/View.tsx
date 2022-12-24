import React, {useEffect, useState} from 'react';

import BabySittingList from "../Babysitting/BabySittingList";
import BabySittingFilters from "../Babysitting/BabySittingFilters";
import BabySittingStats from "../Babysitting/BabySittingStats";

function View(){

    return(
        <>
            <div>
                <h2>
                    Liste des présences
                </h2>
                <div>
                    <BabySittingFilters />
                </div>
                <div>
                    <BabySittingList />
                </div>
            </div>
            <BabySittingStats />
        </>
    );
}

export default View;

