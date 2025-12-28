# 📖 Référence - BabySitter Timer

*Orienté information - "Je veux une information précise"*

La section Référence contient toute la documentation technique détaillée de BabySitter Timer. Elle décrit de façon exhaustive et précise les composants, interfaces, API et configurations de l'application.

## 🎯 Objectif de la référence

Cette section vous permet de :
- Trouver des informations techniques précises rapidement
- Comprendre les signatures exactes des fonctions et composants
- Consulter les spécifications complètes des interfaces
- Obtenir des informations fiables pour le développement

## 📋 Organisation de la référence

### Architecture et Composants

#### [Use Cases Métier](./use-cases.md)
Référence exhaustive des cas d'usage fonctionnels avec flux détaillés et contraintes techniques.

*Référence pour : analyse fonctionnelle, validation métier, spécifications*

#### [Interfaces TypeScript](./interfaces.md)
Définitions exhaustives de tous les types et interfaces utilisés dans l'application.

*Référence pour : développement TypeScript, contrats de données*

#### [Composants React](./composants.md)
Documentation complète de tous les composants React avec leurs props, méthodes et exemples d'usage.

*Référence pour : développement front-end, intégration de composants*

#### [Architecture des services](./services.md)
Documentation détaillée des services Firebase, utilitaires et logique métier.

*Référence pour : intégration backend, services externes*

### Configuration et Déploiement

#### [Configuration Firebase](./configuration.md)
Spécifications complètes de la configuration Firebase : authentification, Firestore, règles de sécurité.

*Référence pour : configuration production, sécurité*

#### [Variables d'environnement](./variables-env.md)
Liste exhaustive de toutes les variables d'environnement avec leurs types et valeurs par défaut.

*Référence pour : déploiement, configuration multi-environnements*

#### [Scripts et commandes](./scripts.md)
Documentation de tous les scripts npm et commandes disponibles pour le développement et le déploiement.

*Référence pour : automatisation, CI/CD*

### API et Données

#### [API Firestore](./api-firestore.md)
Schéma de la base de données, collections, documents et requêtes.

*Référence pour : développement backend, migration de données*

#### [Gestion d'état Recoil](./recoil-state.md)
Documentation complète des atomes, sélecteurs et états globaux de l'application.

*Référence pour : gestion d'état, synchronisation*

#### [Utilitaires](./utilitaires.md)
Fonctions utilitaires pour les dates, calculs, formatage et autres opérations communes.

*Référence pour : réutilisation de code, développement*

### Styles et Thèmes

#### [Système de thèmes](./themes.md)
Spécifications complètes du système de thèmes Material-UI personnalisé.

*Référence pour : personnalisation visuelle, accessibilité*

#### [Classes CSS et styles](./styles.md)
Documentation des styles personnalisés, classes CSS et conventions de nommage.

*Référence pour : stylisation, maintenance CSS*

## 💡 Comment utiliser cette référence

### Organisation par types d'information

- **Signatures** : Paramètres exact, types de retour
- **Exemples** : Code minimal d'utilisation
- **Notes** : Considérations importantes, limitations
- **Voir aussi** : Liens vers documentation connexe

### Conventions de documentation

```typescript
// Format standard pour les fonctions
function nomFonction(
  param1: Type1,     // Description du paramètre
  param2?: Type2     // Paramètre optionnel
): TypeRetour {      // Type de retour
  // Description du comportement
}
```

```typescript  
// Format standard pour les composants
interface ComponentProps {
  prop1: Type1;      // Propriété obligatoire
  prop2?: Type2;     // Propriété optionnelle
}

export const Component: React.FC<ComponentProps>
```

### Symboles utilisés

- ⚠️ **Important** : Information critique à retenir
- 💡 **Astuce** : Conseil d'utilisation optimale  
- 🔧 **Configuration** : Paramètres de configuration
- 📊 **Données** : Structure de données
- 🎨 **Style** : Apparence et thèmes
- 🔒 **Sécurité** : Considérations de sécurité

## 🔍 Navigation rapide

### Par type de développement

- **Frontend React** : [Composants](./composants.md) → [Interfaces](./interfaces.md) → [Thèmes](./themes.md)
- **Backend/Données** : [API Firestore](./api-firestore.md) → [Services](./services.md) → [Configuration](./configuration.md)
- **DevOps** : [Variables env](./variables-env.md) → [Scripts](./scripts.md) → [Configuration](./configuration.md)

### Par cas d'usage

- **Intégrer un composant** : [Composants](./composants.md) + [Interfaces](./interfaces.md)
- **Configurer l'environnement** : [Variables env](./variables-env.md) + [Configuration](./configuration.md)
- **Personnaliser l'apparence** : [Thèmes](./themes.md) + [Styles](./styles.md)

## 🔗 Liens avec les autres sections

- **Appliquer ces références** : Consultez les [**Guides pratiques**](../guides-pratiques/)
- **Comprendre le contexte** : Explorez les [**Explications**](../explications/)
- **Apprendre par la pratique** : Suivez les [**Tutoriels**](../tutoriels/)

---

*Cette référence respecte les principes Diataxis : orientation information, précision technique, et consultabilité rapide.*