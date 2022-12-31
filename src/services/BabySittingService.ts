import { IBabySitting } from "../interfaces/IBabySitting";
import { firebaseDatabase } from "../utils/firebase";
import { getDatabase, set, ref,child, get } from "firebase/database";

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
}
function deleteBabySittingToFireBase(babySitting: IBabySitting){
}
function fetchBabySittingFromFireBase(){
    const dbRef = ref(getDatabase());
    get(child(dbRef, `iloukia/`)).then((snapshot) => {
        if (snapshot.exists()) {
            console.log(snapshot.val());
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });
}


export {
    addBabySittingToLocalStorage,
    deleteBabySittingToLocalStorage,
    fetchBabySittingsFromLocalStorage,
    updateBabySittingToLocalStorage,

    addBabySittingToFireBase,
    updateBabySittingToFireBase,
    deleteBabySittingToFireBase,
    fetchBabySittingFromFireBase
};
