import { UserRole } from './IUserRole';

/**
 * Interface pour un utilisateur autorisé dans le système
 * Stocké dans la collection Firestore 'authorizedUsers'
 */
export interface IAuthorizedUser {
  /** UID Firebase (utilisé comme ID du document) */
  uid: string;
  
  /** Email de l'utilisateur */
  email: string;
  
  /** Niveau de droits de l'utilisateur */
  role: UserRole;
  
  /** Permet de désactiver temporairement un utilisateur sans le supprimer */
  isActive: boolean;
  
  /** Date de création de l'enregistrement */
  createdAt: Date;
  
  /** Date de dernière modification */
  updatedAt: Date;
  
  /** UID de l'admin qui a créé cet utilisateur (optionnel) */
  createdBy?: string;
}

/**
 * Type pour la création d'un utilisateur autorisé (sans les champs auto-générés)
 */
export type CreateAuthorizedUserInput = Omit<IAuthorizedUser, 'createdAt' | 'updatedAt'>;

/**
 * Type pour la mise à jour d'un utilisateur autorisé (tous les champs optionnels)
 */
export type UpdateAuthorizedUserInput = Partial<Omit<IAuthorizedUser, 'uid' | 'createdAt'>>;
