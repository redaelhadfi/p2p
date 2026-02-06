# MEAN Stack Frontend - Angular Application

## 🎉 Frontend Angular Complété!

Application Angular complète pour le projet MEAN Stack TP2.

## 📦 Installation

```bash
# Installer les dépendances
npm install

# Installer Angular CLI globalement (si nécessaire)
npm install -g @angular/cli
```

## 🚀 Lancement

### Mode Développement
```bash
npm start
# ou
ng serve

# L'application sera disponible sur http://localhost:4200
```

### Mode Production
```bash
npm run build

# Les fichiers de production seront dans dist/mean-stack-frontend
```

## 📁 Structure

```
src/
├── app/
│   ├── components/
│   │   ├── navbar/           # Barre de navigation
│   │   ├── login/            # Page de connexion
│   │   ├── register/         # Page d'inscription
│   │   ├── dashboard/        # Tableau de bord
│   │   └── profile/          # Profil utilisateur
│   ├── services/
│   │   ├── auth.service.ts   # Service d'authentification
│   │   ├── user.service.ts   # Service utilisateur
│   │   └── file.service.ts   # Service de fichiers
│   ├── guards/
│   │   └── auth.guard.ts     # Protection des routes
│   ├── interceptors/
│   │   └── auth.interceptor.ts # Ajout automatique du token JWT
│   ├── app.module.ts         # Module principal
│   ├── app-routing.module.ts # Configuration des routes
│   └── app.component.ts      # Composant racine
├── environments/
│   ├── environment.ts        # Configuration développement
│   └── environment.prod.ts   # Configuration production
├── index.html
├── main.ts
└── styles.css               # Styles globaux
```

## 🎯 Fonctionnalités

### ✅ Authentification
- Inscription avec validation de formulaire
- Connexion avec JWT
- Déconnexion
- Protection des routes (AuthGuard)
- Interception HTTP automatique (AuthInterceptor)

### ✅ Gestion de Profil
- Affichage du profil utilisateur
- Modification des informations
- Upload d'avatar
- Gestion de fichiers

### ✅ Dashboard
- Vue d'ensemble des utilisateurs
- Statistiques
- Gestion des utilisateurs (suppression)

### ✅ Interface
- Design moderne et responsive
- Navigation intuitive
- Feedback utilisateur (alertes, messages)
- Loading states

## 🔌 Configuration Backend

L'application se connecte au backend sur `http://localhost:3000/api` par défaut.

Pour changer l'URL :
```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://votre-backend:3000/api'
};
```

## 📋 Routes

- `/` → Redirige vers /dashboard
- `/login` → Page de connexion
- `/register` → Page d'inscription
- `/dashboard` → Tableau de bord (protégé)
- `/profile` → Profil utilisateur (protégé)

## 🛠️ Technologies

- **Angular 17** - Framework frontend
- **TypeScript** - Langage typé
- **RxJS** - Programmation réactive
- **Angular Router** - Navigation
- **Reactive Forms** - Gestion des formulaires
- **HTTP Client** - Communication avec le backend

## 🎨 Style

Design moderne avec :
- Gradient backgrounds
- Card layout
- Responsive design
- Animations et transitions
- Icons et emojis

## 🔒 Sécurité

- Routes protégées par AuthGuard
- Token JWT stocké en localStorage
- Interception automatique des erreurs 401
- Validation des formulaires côté client

## 📝 Commandes Utiles

```bash
# Générer un nouveau composant
ng generate component components/nom-composant

# Générer un service
ng generate service services/nom-service

# Générer un guard
ng generate guard guards/nom-guard

# Build pour production
ng build --configuration production

# Tests
ng test

# Linter
ng lint
```

## 🚀 Déploiement

1. Build de production :
```bash
ng build --configuration production
```

2. Les fichiers seront dans `dist/mean-stack-frontend/`

3. Déployer sur un serveur web (Nginx, Apache, etc.)

## ⚠️ Prérequis Backend

Le backend doit exposer les endpoints suivants :

- `POST /api/register` - Inscription
- `POST /api/login` - Connexion
- `GET /api/profile` - Profil utilisateur
- `PUT /api/profile` - Mise à jour profil
- `GET /api/users` - Liste des utilisateurs
- `DELETE /api/users/:id` - Suppression utilisateur
- `POST /api/upload` - Upload de fichier
- `POST /api/upload-avatar` - Upload d'avatar
- `GET /api/files` - Liste des fichiers
- `DELETE /api/files/:filename` - Suppression de fichier

## 🎓 Auteur

**Reda Elhadfi**  
INE3 - INPT  
TP2 : Plateforme Node.js  
Année 2025-2026
