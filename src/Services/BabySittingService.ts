import {IbabySitting} from "../Interfaces/IbabySitting";

function addBabySittingToLocalStorage(babySiting: IbabySitting){
    let babySitings:IbabySitting[] = fetchBabySittingsFromLocalStorage();
    babySitings.push(babySiting);
    localStorage.setItem('babySittings', JSON.stringify(babySitings));
}

function deleteBabySittingFromLocalStorage(id:string){
    let babySittings:IbabySitting[] = fetchBabySittingsFromLocalStorage();
    babySittings = babySittings.filter((babySitting)=>babySitting.id !== id);
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


export {addBabySittingToLocalStorage,deleteBabySittingFromLocalStorage,fetchBabySittingsFromLocalStorage};
