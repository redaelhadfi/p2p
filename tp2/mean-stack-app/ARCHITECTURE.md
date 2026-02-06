# Architecture MEAN Stack

## Vue d'ensemble

MEAN Stack est un stack technologique full-stack JavaScript composé de:

- **M**ongoDB - Base de données NoSQL orientée documents
- **E**xpress.js - Framework web backend pour Node.js
- **A**ngular - Framework frontend SPA (Single Page Application)
- **N**ode.js - Environnement d'exécution JavaScript côté serveur

## Architecture en couches

```
┌─────────────────────────────────────────────────┐
│            CLIENT (Browser)                      │
│  ┌───────────────────────────────────────────┐ │
│  │         Angular Frontend                   │ │
│  │  - Components                              │ │
│  │  - Services                                │ │
│  │  - Routing                                 │ │
│  │  - HTTP Client                             │ │
│  └───────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
                      ▼ HTTP/REST API
┌─────────────────────────────────────────────────┐
│          SERVER (Node.js + Express)             │
│  ┌───────────────────────────────────────────┐ │
│  │         Backend API                        │ │
│  │  - Routes                                  │ │
│  │  - Controllers                             │ │
│  │  - Middleware (Auth, Validation)           │ │
│  │  - Business Logic                          │ │
│  └───────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
                      ▼ Mongoose ODM
┌─────────────────────────────────────────────────┐
│          DATABASE (MongoDB)                     │
│  ┌───────────────────────────────────────────┐ │
│  │         Collections                        │ │
│  │  - users                                   │ │
│  │  - sessions                                │ │
│  │  - files                                   │ │
│  └───────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

## Composants détaillés

### 1. Frontend (Angular)

```
frontend/
├── src/
│   ├── app/
│   │   ├── components/         # Composants UI
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── dashboard/
│   │   │   └── profile/
│   │   ├── services/           # Services Angular
│   │   │   ├── auth.service.ts
│   │   │   ├── user.service.ts
│   │   │   └── file.service.ts
│   │   ├── models/             # Interfaces TypeScript
│   │   │   └── user.model.ts
│   │   ├── guards/             # Route Guards
│   │   │   └── auth.guard.ts
│   │   └── interceptors/       # HTTP Interceptors
│   │       └── auth.interceptor.ts
│   ├── assets/                 # Ressources statiques
│   └── environments/           # Configuration
```

### 2. Backend (Express + Node.js)

```
backend/
├── server.js                   # Point d'entrée
├── models/                     # Modèles Mongoose
│   ├── User.js
│   └── File.js
├── routes/                     # Définition des routes
│   ├── auth.js
│   ├── users.js
│   └── files.js
├── controllers/                # Logique métier
│   ├── authController.js
│   ├── userController.js
│   └── fileController.js
├── middleware/                 # Middleware personnalisé
│   ├── auth.js
│   ├── validation.js
│   └── errorHandler.js
└── config/                     # Configuration
    └── database.js
```

### 3. Base de données (MongoDB)

```
MongoDB Collections:

users {
    _id: ObjectId,
    firstname: String,
    lastname: String,
    login: String (unique),
    password: String (hashed),
    profileImage: String,
    createdAt: Date
}

sessions {
    _id: ObjectId,
    userId: ObjectId (ref: users),
    token: String,
    expiresAt: Date
}

files {
    _id: ObjectId,
    userId: ObjectId (ref: users),
    filename: String,
    path: String,
    size: Number,
    uploadedAt: Date
}
```

## Flux de données

### 1. Authentification
```
User (Angular) → Login Form
    ↓
    POST /api/auth/login
    ↓
Express Route → Auth Controller
    ↓
Mongoose → MongoDB (verify user)
    ↓
JWT Token Generated
    ↓
Token → Angular (stored in localStorage)
    ↓
Token in Authorization Header (future requests)
```

### 2. Upload de fichier
```
User → File Selection (Angular)
    ↓
    POST /api/files/upload (multipart/form-data)
    ↓
Auth Middleware (verify JWT)
    ↓
Multer Middleware (handle file)
    ↓
File saved to disk
    ↓
User model updated with file path (MongoDB)
    ↓
Response → Angular (success message)
```

## Avantages du MEAN Stack

1. **JavaScript partout** - Un seul langage pour frontend et backend
2. **JSON natif** - Format de données uniforme
3. **Performance** - Node.js non-bloquant, MongoDB rapide
4. **Scalabilité** - Architecture modulaire et extensible
5. **Communauté** - Large écosystème npm
6. **SPA** - Expérience utilisateur fluide avec Angular

## Technologies complémentaires

- **Socket.io** - Communication temps réel (WebSockets)
- **JWT** - Authentification stateless
- **Bcrypt** - Hachage de mots de passe
- **Multer** - Gestion d'upload de fichiers
- **Mongoose** - ODM pour MongoDB
- **CORS** - Gestion des requêtes cross-origin
- **TypeScript** - Typage statique pour Angular

## Déploiement

```
Development:
├── MongoDB local (localhost:27017)
├── Express API (localhost:3001)
└── Angular Dev Server (localhost:4200)

Production:
├── MongoDB Atlas (cloud)
├── Backend on Heroku/AWS/DigitalOcean
└── Frontend on Netlify/Vercel
```

## Bonnes pratiques

1. **Séparation des préoccupations** - MVC pattern
2. **Validation des données** - Frontend et Backend
3. **Gestion d'erreurs** - Try-catch et error handlers
4. **Sécurité** - HTTPS, JWT, input sanitization
5. **Documentation** - Swagger/OpenAPI pour l'API
6. **Tests** - Unit tests et e2e tests
7. **CI/CD** - Automatisation du déploiement
