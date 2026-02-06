# Diagrammes UML - TP2 Application Node.js

## 1. Diagramme de Classes

```
┌─────────────────────────────────────┐
│            Server                    │
├─────────────────────────────────────┤
│ - http: HttpServer                  │
│ - router: Router                    │
│ - handlers: RequestHandlers         │
├─────────────────────────────────────┤
│ + start(route, handle): void        │
│ + onRequest(req, res): void         │
└─────────────────────────────────────┘
                ▼
┌─────────────────────────────────────┐
│            Router                    │
├─────────────────────────────────────┤
│ - handle: Map<string, Function>     │
├─────────────────────────────────────┤
│ + route(handle, pathname, ...): void│
└─────────────────────────────────────┘
                ▼
┌─────────────────────────────────────┐
│       RequestHandlers                │
├─────────────────────────────────────┤
│ - users: User[]                     │
│ - sessions: Map<string, Session>    │
├─────────────────────────────────────┤
│ + start(response): void             │
│ + register(response, request): void │
│ + login(response, request): void    │
│ + logout(response, request): void   │
│ + upload(response, request): void   │
│ + show(response, request): void     │
│ + find(response, request): void     │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│              User                    │
├─────────────────────────────────────┤
│ - firstname: String                 │
│ - lastname: String                  │
│ - login: String                     │
│ - password: String                  │
│ - profileImage: String              │
├─────────────────────────────────────┤
│ + toJSON(): Object                  │
│ + comparePassword(pwd): Boolean     │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│            Session                   │
├─────────────────────────────────────┤
│ - sessionId: String                 │
│ - username: String                  │
│ - firstname: String                 │
│ - lastname: String                  │
│ - createdAt: Date                   │
└─────────────────────────────────────┘
```

## 2. Diagramme de Séquence - Authentification

```
Client          Server          Router          RequestHandlers          Users DB
  │               │               │                    │                    │
  │─POST /login──▶│               │                    │                    │
  │               │               │                    │                    │
  │               │─route()──────▶│                    │                    │
  │               │               │                    │                    │
  │               │               │──login(req,res)───▶│                    │
  │               │               │                    │                    │
  │               │               │                    │──find(login)──────▶│
  │               │               │                    │                    │
  │               │               │                    │◀──user────────────│
  │               │               │                    │                    │
  │               │               │                    │──verify password───│
  │               │               │                    │                    │
  │               │               │                    │──create session────│
  │               │               │                    │                    │
  │               │               │                    │──set cookie────────│
  │               │               │                    │                    │
  │               │               │◀──response─────────│                    │
  │               │               │                    │                    │
  │               │◀──response────│                    │                    │
  │               │               │                    │                    │
  │◀─200 OK──────│               │                    │                    │
  │  + Cookie     │               │                    │                    │
```

## 3. Diagramme de Séquence - Upload de fichier

```
Client          Server          Router        RequestHandlers      FileSystem
  │               │               │                  │                 │
  │─POST /upload─▶│               │                  │                 │
  │  multipart    │               │                  │                 │
  │               │               │                  │                 │
  │               │─route()──────▶│                  │                 │
  │               │               │                  │                 │
  │               │               │──upload()───────▶│                 │
  │               │               │                  │                 │
  │               │               │                  │──get session────│
  │               │               │                  │                 │
  │               │               │                  │──check auth─────│
  │               │               │                  │                 │
  │               │               │                  │──parse form─────│
  │               │               │                  │                 │
  │               │               │                  │──save file─────▶│
  │               │               │                  │                 │
  │               │               │                  │◀─filepath───────│
  │               │               │                  │                 │
  │               │               │                  │──update user────│
  │               │               │                  │                 │
  │               │               │◀─response────────│                 │
  │               │               │                  │                 │
  │               │◀─response─────│                  │                 │
  │               │               │                  │                 │
  │◀200 OK────────│               │                  │                 │
```

## 4. Diagramme d'Activité - Processus d'inscription

```
        [Début]
           │
           ▼
    ┌─────────────┐
    │ Afficher    │
    │ formulaire  │
    └─────────────┘
           │
           ▼
    ┌─────────────┐
    │ Saisir      │
    │ informations│
    └─────────────┘
           │
           ▼
    ┌─────────────┐
    │ Valider     │◄──────┐
    │ champs      │       │
    └─────────────┘       │
           │              │
           ▼              │
    ╱────────────╲        │
   ╱  Données     ╲       │
  ╱   valides?    ╲──Non─┘
  ╲               ╱
   ╲─────────────╱
           │Oui
           ▼
    ┌─────────────┐
    │ Vérifier    │
    │ login unique│
    └─────────────┘
           │
           ▼
    ╱────────────╲
   ╱  Login       ╲
  ╱   existe?     ╲──Oui──▶[Erreur: Login existe]
  ╲               ╱
   ╲─────────────╱
           │Non
           ▼
    ┌─────────────┐
    │ Hasher      │
    │ password    │
    └─────────────┘
           │
           ▼
    ┌─────────────┐
    │ Enregistrer │
    │ user en BD  │
    └─────────────┘
           │
           ▼
    ┌─────────────┐
    │ Afficher    │
    │ succès      │
    └─────────────┘
           │
           ▼
        [Fin]
```

## 5. Diagramme de Cas d'Utilisation

```
                    ╔════════════════════════╗
                    ║  Application Node.js   ║
                    ╚════════════════════════╝

┌──────────┐                                      ┌──────────────┐
│          │        (S'inscrire)                  │              │
│          │──────────────────────────────────────│              │
│          │                                      │              │
│          │        (Se connecter)                │              │
│          │──────────────────────────────────────│   Système    │
│          │                                      │   Fichiers   │
│          │        (Uploader image)              │              │
│Utilisateur│──────────────────────────────────────│              │
│          │            │                         │              │
│          │            │«include»                │              │
│          │            ▼                         │              │
│          │     (Authentification)               │              │
│          │                                      │              │
│          │        (Voir image)                  │              │
│          │──────────────────────────────────────│              │
│          │                                      │              │
│          │        (Lister fichiers)             │              │
│          │──────────────────────────────────────│              │
│          │                                      │              │
│          │        (Se déconnecter)              │              │
│          │──────────────────────────────────────│              │
└──────────┘                                      └──────────────┘
```

## 6. Diagramme d'État - Session Utilisateur

```
        ┌──────────────┐
        │              │
        │  Anonyme     │◄──────────┐
        │              │           │
        └──────────────┘           │
               │                   │
               │[register]         │
               ▼                   │
        ┌──────────────┐           │
        │              │           │
        │  Inscrit     │           │
        │              │           │
        └──────────────┘           │
               │                   │
               │[login]            │
               ▼                   │
        ┌──────────────┐           │
        │              │           │
        │  Connecté    │           │
        │              │           │
        └──────────────┘           │
          │    │    │              │
          │    │    │[logout]      │
          │    │    └──────────────┘
          │    │
          │    │[upload]
          │    ▼
          │  ┌──────────────┐
          │  │              │
          │  │  Uploading   │
          │  │              │
          │  └──────────────┘
          │         │
          │         │[complete]
          │         ▼
          │  ┌──────────────┐
          │  │              │
          │  │  Image OK    │
          │  │              │
          │  └──────────────┘
          │
          │[view]
          ▼
    ┌──────────────┐
    │              │
    │  Viewing     │
    │              │
    └──────────────┘
```

## 7. Diagramme de Déploiement

```
┌────────────────────────────────────────────────────┐
│                  Client Machine                     │
│  ┌──────────────────────────────────────────────┐ │
│  │          Web Browser                          │ │
│  │  ┌────────────────────────────────────────┐  │ │
│  │  │        HTML/CSS/JavaScript             │  │ │
│  │  └────────────────────────────────────────┘  │ │
│  └──────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────┘
                        │
                        │ HTTP
                        ▼
┌────────────────────────────────────────────────────┐
│                  Server Machine                     │
│  ┌──────────────────────────────────────────────┐ │
│  │            Node.js Runtime                    │ │
│  │  ┌────────────────────────────────────────┐  │ │
│  │  │        Application Code                │  │ │
│  │  │  - server.js                           │  │ │
│  │  │  - router.js                           │  │ │
│  │  │  - requestHandlers.js                  │  │ │
│  │  └────────────────────────────────────────┘  │ │
│  └──────────────────────────────────────────────┘ │
│                        │                           │
│                        │ File I/O                  │
│                        ▼                           │
│  ┌──────────────────────────────────────────────┐ │
│  │          File System                          │ │
│  │  - uploads/                                   │ │
│  │  - default-image.html                         │ │
│  └──────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────┘
```

## 8. Diagramme de Composants

```
┌─────────────────────────────────────────────────────────┐
│                   Node.js Application                    │
│                                                          │
│  ┌────────────┐      ┌────────────┐                     │
│  │            │      │            │                     │
│  │   index.js │─────▶│ server.js  │                     │
│  │            │      │            │                     │
│  └────────────┘      └────────────┘                     │
│                            │                             │
│                            ▼                             │
│                     ┌────────────┐                       │
│                     │            │                       │
│                     │ router.js  │                       │
│                     │            │                       │
│                     └────────────┘                       │
│                            │                             │
│                            ▼                             │
│              ┌──────────────────────────┐               │
│              │                          │               │
│              │  requestHandlers.js      │               │
│              │                          │               │
│              │  - start()               │               │
│              │  - register()            │               │
│              │  - login()               │               │
│              │  - logout()              │               │
│              │  - upload()              │               │
│              │  - show()                │               │
│              │  - find()                │               │
│              │                          │               │
│              └──────────────────────────┘               │
│                       │        │                         │
│          ┌────────────┘        └──────────┐             │
│          ▼                                 ▼             │
│   ┌────────────┐                    ┌────────────┐      │
│   │            │                    │            │      │
│   │   fs       │                    │ formidable │      │
│   │ (Node.js)  │                    │  (npm)     │      │
│   │            │                    │            │      │
│   └────────────┘                    └────────────┘      │
│                                                          │
└─────────────────────────────────────────────────────────┘
```
