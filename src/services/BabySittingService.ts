import { IBabySitting } from "../interfaces/IBabySitting";
import { firebaseDatabase } from "../utils/firebase";
import { set, ref, remove} from "firebase/database";

function addBabySittingToLocalStorage(babySitting: IBabySitting){
    let babySitings:IBabySitting[] = fetchBabySittingsFromLocalStorage();
    babySitings.push(babySitting);
    localStorage.setItem('babySittings', JSON.stringify(babySitings));
}

function updateBabySittingToLocalStorage( babySittingToUpdate: IBabySitting){
    let babySitings:IBabySitting[] = fetchBabySittingsFromLocalStorage();
    const babisittingPosition:number = babySitings.findIndex((babySitting)=>babySitting.id===babySittingToUpdate.id);
    babySitings[babisittingPosition] = babySittingToUpdate;
    localStorage.setItem('babySittings', JSON.stringify(babySitings));
}

function deleteBabySittingToLocalStorage(babySittingId:string){
    let babySittings: IBabySitting[] = fetchBabySittingsFromLocalStorage();
    babySittings = babySittings.filter((babySitting) => babySitting.id !== babySittingId);
    localStorage.setItem('babySittings', JSON.stringify(babySittings));
}

function fetchBabySittingsFromLocalStorage():IBabySitting[]{
    const babSittingLocalStorage:string = localStorage.getItem('babySittings') || "";
    let babySitings:IBabySitting[] = [];
    if (babSittingLocalStorage !==""){
        babySitings = JSON.parse(babSittingLocalStorage);
        babySitings.forEach((babySitting)=>{
            babySitting.arrivalDate = new Date(babySitting.arrivalDate)
            babySitting.departureDate = new Date(babySitting.departureDate)
        })
    }
    return babySitings;
}

function addBabySittingToFireBase(babySitting: IBabySitting){
    return set(ref(firebaseDatabase, '/Iloukia/'+babySitting.id), {
        arrivalDate:babySitting.arrivalDate.getTime(),
        departureDate:babySitting.departureDate.getTime(),
        duration:babySitting.duration
    });
}
function updateBabySittingToFireBase(babySitting: IBabySitting){
    return set(ref(firebaseDatabase, '/Iloukia/'+babySitting.id), {
        arrivalDate:babySitting.arrivalDate.getTime(),
        departureDate:babySitting.departureDate.getTime(),
        duration:babySitting.duration
    });
}
function deleteBabySittingToFireBase(idBabySitting: string){
    return remove(ref(firebaseDatabase,'/Iloukia/'+idBabySitting))
}



export {
    addBabySittingToLocalStorage,
    deleteBabySittingToLocalStorage,
    fetchBabySittingsFromLocalStorage,
    updateBabySittingToLocalStorage,

    addBabySittingToFireBase,
    updateBabySittingToFireBase,
    deleteBabySittingToFireBase
};
