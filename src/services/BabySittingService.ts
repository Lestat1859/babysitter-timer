import {IbabySitting} from "../interfaces/IbabySitting";

function addBabySittingToLocalStorage(babySitting: IbabySitting){
    let babySitings:IbabySitting[] = fetchBabySittingsFromLocalStorage();
    babySitings.push(babySitting);
    localStorage.setItem('babySittings', JSON.stringify(babySitings));
}

function updateBabySittingToLocalStorage(babySittingToUpdate: IbabySitting){
    let babySitings:IbabySitting[] = fetchBabySittingsFromLocalStorage();
    const babisittingPosition:number = babySitings.findIndex((babySitting)=>babySitting.id===babySittingToUpdate.id);
    babySitings[babisittingPosition] = babySittingToUpdate;
    localStorage.setItem('babySittings', JSON.stringify(babySitings));
}



function deleteBabySittingToLocalStorage(id:string){
    let babySittings: IbabySitting[] = fetchBabySittingsFromLocalStorage();
    babySittings = babySittings.filter((babySitting) => babySitting.id !== id);
    localStorage.setItem('babySittings', JSON.stringify(babySittings));
}



function fetchBabySittingsFromLocalStorage():IbabySitting[]{
    const babSittingLocalStorage:string = localStorage.getItem('babySittings') || "";
    let babySitings:IbabySitting[] = [];
    if (babSittingLocalStorage !==""){
        babySitings = JSON.parse(babSittingLocalStorage);
        babySitings.forEach((babySitting)=>{
            babySitting.arrivalDate = new Date(babySitting.arrivalDate)
            babySitting.departureDate = new Date(babySitting.departureDate)
        })
    }

    return babySitings;
}


export {
    addBabySittingToLocalStorage,
    deleteBabySittingToLocalStorage,
    fetchBabySittingsFromLocalStorage,
    updateBabySittingToLocalStorage
};
