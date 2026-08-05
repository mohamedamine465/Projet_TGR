# 🏛️ Projet de Gestion de la Dette - TGR Rabat

Application web complète (Frontend + Backend) développée dans le cadre d'un stage d'initiation au sein de la **Direction des Systèmes d'Information (DSI) de la Trésorerie Générale du Royaume (TGR)** à Rabat.

Le système a pour but la gestion et le suivi des différentes dettes publiques et projets financés par l'état, via un espace d'administration centralisé, hautement sécurisé et moderne.

---

## 🌟 Modules Fonctionnels

Le projet s'articule autour de 3 grands modules métiers, sécurisés par profils utilisateurs :

1. **Dette du Trésor** 
   - Gestion des Prêts et Prêteurs (FMI, Banque Mondiale, etc.)
   - Suivi des Échéanciers et des Échéances
   - Opérations comptables : Avis de Crédit, Avis de Débit, Ordres de Paiement

2. **Programme MEDA** 
   - Suivi des Projets, des Dons et des Fonds de Roulement
   - Gestion des Approvisionnements et Avis d'Opérations

3. **Dette Intérieure** 
   - Saisie et suivi des Adjudications
   - Gestion des Bons d'Équipement
   - Suivi des Commissions et des Intérêts (avec liaison automatique des Dépenses)

---

## 🛠️ Stack Technique

### Frontend (Client)
* **Framework :** Vue 3 (Composition API)
* **Routing & State :** Vue Router, Pinia
* **Requêtes :** Axios (Instance configurée avec Intercepteurs)
* **UI/UX :** Composants mutualisés (`BaseInput`, `BaseButton`, etc.), CSS Natif Moderne (Variables CSS, Flexbox/Grid)
* **Tests E2E :** Cypress

### Backend (API)
* **Runtime :** Node.js (ES Modules)
* **Framework :** Express.js (v5) avec Middlewares de gestion globale d'erreurs
* **ORM & Base de données :** Prisma, PostgreSQL
* **Sécurité :** JWT (JSON Web Tokens), `bcrypt` (Hachage)

---

## 🔒 Sécurité et Architecture

Le système met en place plusieurs couches de sécurité strictes :
- **Authentification Stateless (JWT en Mémoire) :** Les tokens d'accès ne sont pas stockés dans le `localStorage` afin d'éliminer totalement les risques d'attaques XSS. Ils sont conservés en mémoire vive via Pinia.
- **Règles Métier TGR (Première Connexion) :** Tout compte utilisateur n'ayant jamais accédé au système (`dateDernierAcces` vide) voit son JWT bloqué et est contraint de modifier son mot de passe provisoire.
- **Contrôle d'Accès Basé sur les Rôles (RBAC) :** 
  - Différenciation par Type d'Utilisateur (`Administrateur` vs `Agent`).
  - Filtrage granulaire des routes métiers via les profils (`Dette du Tresor`, `Programme MEDA`, `Dette Interieure`).

---

## 🚀 Installation & Lancement Local

### 1. Prérequis
- Node.js (v18 ou supérieur)
- PostgreSQL en cours d'exécution
- Créer une base de données PostgreSQL (ex: `tgr_db`)

### 2. Configuration des variables d'environnement
Dans le dossier `/backend`, créez un fichier `.env` contenant :
```env
DATABASE_URL="postgresql://utilisateur:motdepasse@localhost:5432/tgr_db?schema=public"
JWT_SECRET="votre_cle_secrete_ultra_longue_ici"
PORT=3000
```

### 3. Installation des dépendances
Il est nécessaire d'installer les dépendances pour le frontend et le backend :

```bash
# Dans le dossier backend
cd backend
npm install

# Dans le dossier frontend
cd ../frontend
npm install
```

### 4. Initialisation de la Base de Données
Le projet utilise Prisma pour générer les tables et peupler la base avec des données de test réalistes. Depuis le répertoire `/backend` :

```bash
# Générer le client Prisma
npx prisma generate

# Pousser le schéma dans la base de données (et forcer la réinitialisation si besoin)
npx prisma db push --force-reset

# Peupler la base de données avec des données de test
npx prisma db seed
```

### 5. Lancement de l'application
Ouvrez deux terminaux différents.

**Terminal 1 : Backend (API)**
```bash
cd backend
npm run dev
# L'API sera accessible sur http://localhost:3000
```

**Terminal 2 : Frontend (Vue.js)**
```bash
cd frontend
npm run dev
# L'interface utilisateur sera accessible sur http://localhost:5173
```

---

## 👥 Comptes de Test (Seed)

Le script de peuplement génère les comptes suivants pour tester l'application :

| Rôle | Email | Mot de passe par défaut | Accès | Note de Première Connexion |
|---|---|---|---|---|
| Administrateur | `admin@tgr.gov.ma` | `admin` | Tous les profils | Désactivée (accès immédiat) |
| Agent | `agent1@tgr.gov.ma` | `agent1` | Dette du Trésor | **Activée (changement de MDP requis)** |
| Agent | `agent2@tgr.gov.ma` | `agent2` | Programme MEDA | **Activée (changement de MDP requis)** |
| Agent | `agent3@tgr.gov.ma` | `agent3` | Dette Intérieure | **Activée (changement de MDP requis)** |

---

## 🧪 Tests Automatisés

Le projet dispose d'une batterie de tests pour garantir sa stabilité et prévenir les régressions.

### 1. Tests Backend (API)
Les tests backend vérifient la logique métier, l'authentification et les accès à la base de données de test. L'environnement d'exécution utilise **Jest** (avec le support ES Modules).

Depuis le dossier `backend` :
```bash
# Exécution de l'ensemble des suites de test API
npm test
```

### 2. Tests Frontend (End-to-End)
Le framework **Cypress** est utilisé pour simuler le comportement d'un utilisateur réel (E2E) sur le navigateur (ex: simulation de connexion, navigation entre les modules protégés, tests des formulaires).

Depuis le dossier `frontend`, il existe deux manières de lancer les tests :

**Mode Interactif (UI) :** Ouvre une interface graphique permettant de voir le navigateur exécuter les tests en direct. Idéal pour le débogage.
```bash
npm run cypress
```

**Mode Headless (CI/CD) :** Exécute l'ensemble des tests en arrière-plan dans la console. Très utile pour l'intégration continue.
```bash
npm run test
```