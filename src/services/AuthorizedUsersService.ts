import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';
import { firestoreDB } from '../utils/firebase';
import {
  IAuthorizedUser,
  CreateAuthorizedUserInput,
  UpdateAuthorizedUserInput,
} from '../interfaces/IAuthorizedUser';

const COLLECTION_NAME = 'authorizedUsers';

/**
 * Cache pour stocker les utilisateurs autorisés en mémoire
 * Permet d'éviter des appels répétés à Firestore
 */
class AuthorizedUsersCache {
  private cache: Map<string, IAuthorizedUser> = new Map();
  private lastFetchTime: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  isCacheValid(): boolean {
    return Date.now() - this.lastFetchTime < this.CACHE_DURATION;
  }

  set(users: IAuthorizedUser[]): void {
    this.cache.clear();
    users.forEach(user => this.cache.set(user.uid, user));
    this.lastFetchTime = Date.now();
  }

  get(uid: string): IAuthorizedUser | undefined {
    return this.cache.get(uid);
  }

  getByEmail(email: string): IAuthorizedUser | undefined {
    return Array.from(this.cache.values()).find(user => user.email === email);
  }

  getAll(): IAuthorizedUser[] {
    return Array.from(this.cache.values());
  }

  invalidate(): void {
    this.cache.clear();
    this.lastFetchTime = 0;
  }
}

const cache = new AuthorizedUsersCache();

/**
 * Convertit un document Firestore en IAuthorizedUser
 */
function firestoreDocToAuthorizedUser(docData: any, uid: string): IAuthorizedUser {
  return {
    uid,
    email: docData.email,
    role: docData.role,
    isActive: docData.isActive,
    createdAt: docData.createdAt?.toDate() || new Date(),
    updatedAt: docData.updatedAt?.toDate() || new Date(),
    createdBy: docData.createdBy,
  };
}

/**
 * Vérifie si un utilisateur est autorisé (par UID)
 */
export async function isUserAuthorized(uid: string): Promise<boolean> {
  try {
    // Vérifier d'abord le cache
    if (cache.isCacheValid()) {
      const cachedUser = cache.get(uid);
      return cachedUser?.isActive ?? false;
    }

    // Si pas en cache, récupérer depuis Firestore
    const userDoc = await getDoc(doc(firestoreDB, COLLECTION_NAME, uid));
    
    if (!userDoc.exists()) {
      return false;
    }

    const user = firestoreDocToAuthorizedUser(userDoc.data(), uid);
    return user.isActive;
  } catch (error) {
    console.error('Erreur lors de la vérification de l\'autorisation:', error);
    return false;
  }
}

/**
 * Vérifie si un utilisateur est autorisé (par email)
 */
export async function isUserAuthorizedByEmail(email: string): Promise<boolean> {
  try {
    // Vérifier d'abord le cache
    if (cache.isCacheValid()) {
      const cachedUser = cache.getByEmail(email);
      return cachedUser?.isActive ?? false;
    }

    // Si pas en cache, récupérer depuis Firestore
    const q = query(
      collection(firestoreDB, COLLECTION_NAME),
      where('email', '==', email),
      where('isActive', '==', true)
    );
    
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  } catch (error) {
    console.error('Erreur lors de la vérification de l\'autorisation par email:', error);
    return false;
  }
}

/**
 * Récupère un utilisateur autorisé par UID
 */
export async function getAuthorizedUser(uid: string): Promise<IAuthorizedUser | null> {
  try {
    // Vérifier d'abord le cache
    if (cache.isCacheValid()) {
      return cache.get(uid) || null;
    }

    const userDoc = await getDoc(doc(firestoreDB, COLLECTION_NAME, uid));
    
    if (!userDoc.exists()) {
      return null;
    }

    return firestoreDocToAuthorizedUser(userDoc.data(), uid);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    return null;
  }
}

/**
 * Récupère tous les utilisateurs autorisés
 * (Nécessite des droits admin - voir règles de sécurité)
 */
export async function getAllAuthorizedUsers(): Promise<IAuthorizedUser[]> {
  try {
    // Utiliser le cache si valide
    if (cache.isCacheValid()) {
      return cache.getAll();
    }

    const snapshot = await getDocs(collection(firestoreDB, COLLECTION_NAME));
    const users = snapshot.docs.map(doc => 
      firestoreDocToAuthorizedUser(doc.data(), doc.id)
    );

    // Mettre à jour le cache
    cache.set(users);

    return users;
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    return [];
  }
}

/**
 * Crée un nouvel utilisateur autorisé
 * (Nécessite des droits admin OU auto-inscription avec isActive=false - voir règles de sécurité)
 */
export async function createAuthorizedUser(
  input: CreateAuthorizedUserInput
): Promise<IAuthorizedUser> {
  try {
    const now = Timestamp.now();
    const userRef = doc(firestoreDB, COLLECTION_NAME, input.uid);
    
    const userData = {
      email: input.email,
      role: input.role,
      isActive: input.isActive,
      createdAt: now,
      updatedAt: now,
      createdBy: input.createdBy,
    };

    await setDoc(userRef, userData);

    // Invalider le cache
    cache.invalidate();

    return {
      uid: input.uid,
      ...userData,
      createdAt: now.toDate(),
      updatedAt: now.toDate(),
    };
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    throw error;
  }
}

/**
 * Met à jour un utilisateur autorisé
 * (Nécessite des droits admin - voir règles de sécurité)
 */
export async function updateAuthorizedUser(
  uid: string,
  input: UpdateAuthorizedUserInput
): Promise<void> {
  try {
    const userRef = doc(firestoreDB, COLLECTION_NAME, uid);
    
    const updateData: any = {
      ...input,
      updatedAt: Timestamp.now(),
    };

    await updateDoc(userRef, updateData);

    // Invalider le cache
    cache.invalidate();
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
    throw error;
  }
}

/**
 * Supprime un utilisateur autorisé
 * (Nécessite des droits admin - voir règles de sécurité)
 */
export async function deleteAuthorizedUser(uid: string): Promise<void> {
  try {
    await deleteDoc(doc(firestoreDB, COLLECTION_NAME, uid));

    // Invalider le cache
    cache.invalidate();
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    throw error;
  }
}

/**
 * Désactive/Active un utilisateur (soft delete)
 * (Nécessite des droits admin - voir règles de sécurité)
 */
export async function toggleUserActiveStatus(
  uid: string,
  isActive: boolean
): Promise<void> {
  await updateAuthorizedUser(uid, { isActive });
}

/**
 * Invalide le cache manuellement
 */
export function invalidateCache(): void {
  cache.invalidate();
}
