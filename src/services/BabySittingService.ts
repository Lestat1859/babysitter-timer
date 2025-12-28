import { IBabySitting } from "../interfaces/IBabySitting";
import { IAuth } from "../interfaces/IAuth";
import { firebaseDatabase } from "../utils/firebase";
import { set, ref, remove, get, query, orderByChild, equalTo } from "firebase/database";

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
            // Ajouter userEmail par défaut pour les anciennes données
            if (!babySitting.userEmail) {
                babySitting.userEmail = 'Iloukia';
            }
        })
    }
    return babySitings;
}

function addBabySittingToFireBase(babySitting: IBabySitting, userAuth?: IAuth){
    // Si userAuth est fourni, utiliser la nouvelle structure, sinon utiliser l'ancienne pour compatibilité
    const path = userAuth ? '/sessions/' + babySitting.id : '/Iloukia/' + babySitting.id;
    const data = {
        arrivalDate: babySitting.arrivalDate.getTime(),
        departureDate: babySitting.departureDate.getTime(),
        duration: babySitting.duration,
        ...(userAuth && {
            userId: userAuth.uid,
            userEmail: userAuth.email
        })
    };
    
    return set(ref(firebaseDatabase, path), data);
}

function updateBabySittingToFireBase(babySitting: IBabySitting, userAuth?: IAuth){
    // Si userAuth est fourni, utiliser la nouvelle structure, sinon utiliser l'ancienne pour compatibilité
    const path = userAuth ? '/sessions/' + babySitting.id : '/Iloukia/' + babySitting.id;
    
    const data = {
        arrivalDate: babySitting.arrivalDate.getTime(),
        departureDate: babySitting.departureDate.getTime(),
        duration: babySitting.duration,
        // Utiliser les userId/userEmail du babySitting pour préserver le propriétaire original
        ...(userAuth && {
            userId: babySitting.userId,
            userEmail: babySitting.userEmail
        })
    };
    
    return set(ref(firebaseDatabase, path), data);
}

function deleteBabySittingToFireBase(idBabySitting: string, fromSessions: boolean = true){
    const path = fromSessions ? '/sessions/' + idBabySitting : '/Iloukia/' + idBabySitting;
    console.log('🔍 [DEBUG] deleteBabySittingToFireBase appelée:', {
        idBabySitting,
        fromSessions,
        path,
        message: `Tentative de suppression dans le chemin: ${path}`
    });
    return remove(ref(firebaseDatabase, path));
}

/**
 * Récupère les sessions de babysitting depuis Firebase
 * @param userAuth - Informations d'authentification de l'utilisateur
 * @returns Promise<IBabySitting[]> - Liste des sessions
 *
 * Comportement :
 * - Admin : récupère toutes les sessions depuis /sessions/
 * - User : récupère uniquement les sessions de l'utilisateur (filtrées par userId)
 */
async function fetchBabySittingsFromFireBase(userAuth: IAuth): Promise<IBabySitting[]> {
    try {
        const sessionsRef = ref(firebaseDatabase, '/sessions');
        let snapshot;

        if (userAuth.isAdmin) {
            // Admin : récupérer toutes les sessions
            snapshot = await get(sessionsRef);
        } else {
            // User : récupérer uniquement les sessions de l'utilisateur
            const userQuery = query(
                sessionsRef,
                orderByChild('userId'),
                equalTo(userAuth.uid)
            );
            snapshot = await get(userQuery);
        }

        if (!snapshot.exists()) {
            return [];
        }

        const data = snapshot.val();
        const babySittings: IBabySitting[] = [];

        // Convertir l'objet Firebase en tableau d'IBabySitting
        Object.keys(data).forEach((key) => {
            const session = data[key];
            babySittings.push({
                id: key,
                arrivalDate: new Date(session.arrivalDate),
                departureDate: new Date(session.departureDate),
                duration: session.duration,
                userId: session.userId,
                userEmail: session.userEmail || 'Iloukia' // Fallback pour anciennes données
            });
        });

        return babySittings;
    } catch (error) {
        console.error('Erreur lors de la récupération des sessions depuis Firebase:', error);
        return [];
    }
}


export {
    addBabySittingToLocalStorage,
    deleteBabySittingToLocalStorage,
    fetchBabySittingsFromLocalStorage,
    updateBabySittingToLocalStorage,

    addBabySittingToFireBase,
    updateBabySittingToFireBase,
    deleteBabySittingToFireBase,
    fetchBabySittingsFromFireBase
};
