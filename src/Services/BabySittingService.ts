import {IbabySitting} from "../Interfaces/IbabySitting";

function addBabySittingToLocalStorage(babySiting: IbabySitting){

    const babSittingLocalStorage:string = localStorage.getItem('babySittings') || "";
    let babySitings:IbabySitting[] = [];


    if(babSittingLocalStorage!==""){

        babySitings.push(babySiting);
    }else{
        babySitings.push(babySiting);
    }
    localStorage.setItem('babySittings', JSON.stringify(babySitings));
}

function fetchBabySittingsFromLocalStorage():IbabySitting[]{
    const babSittingLocalStorage:string = localStorage.getItem('babySittings') || "";
    let babySitings:IbabySitting[] = []
    babySitings = JSON.parse(babSittingLocalStorage);
    return babySitings
}




export {addBabySittingToLocalStorage,fetchBabySittingsFromLocalStorage};
