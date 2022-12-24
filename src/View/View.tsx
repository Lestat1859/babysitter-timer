import React, {useEffect, useState} from 'react';

import BabySittingList from "../Babysitting/BabySittingList";
import BabySittingFilters from "../Babysitting/BabySittingFilters";
import BabySittingStats from "../Babysitting/BabySittingStats";

function View(){
    return(
        <>
            <BabySittingFilters />
            <BabySittingList />
            <BabySittingStats />
        </>
    )
}

export default View;

