# SYNTHESIS.md - TP2 : La Plateforme Node.js

## 📚 Synthèse Générale des Apprentissages

### Vue d'Ensemble

Ce document présente une synthèse complète des connaissances acquises lors du TP2 sur la plateforme Node.js. Il s'articule autour des concepts fondamentaux, des technologies pratiquées, et des compétences développées.

---

## 1️⃣ Node.js : Fondamentaux et Architecture

### Qu'est-ce que Node.js ?

Node.js est un **environnement d'exécution JavaScript** construit sur le moteur V8 de Chrome. Il permet d'exécuter du JavaScript côté serveur, en dehors du navigateur.

### Caractéristiques Principales

#### 1. Architecture Événementielle (Event-Driven)

```
┌─────────────────┐
│  Event Queue    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐      ┌──────────────┐
│   Event Loop    │─────▶│  Callbacks   │
└─────────────────┘      └──────────────┘
         │
         ▼
┌─────────────────┐
│ Thread Pool     │ (Opérations I/O)
└─────────────────┘
```

**Principe** : Les événements sont placés dans une file d'attente et traités séquentiellement par la boucle d'événements.

**Avantage** : Permet de gérer des milliers de connexions simultanées avec un seul thread.

#### 2. I/O Non-Bloquant

**Bloquant (Synchrone)** :
```javascript
// ❌ Bloque le thread pendant la lecture
const data = fs.readFileSync('file.txt');
console.log(data);
console.log('Suite du code'); // Attend la fin de la lecture
```

**Non-Bloquant (Asynchrone)** :
```javascript
// ✅ Ne bloque pas le thread
fs.readFile('file.txt', (err, data) => {
    console.log(data);
});
console.log('Suite du code'); // S'exécute immédiatement
```

**Avantage** : Le thread principal n'est jamais bloqué, meilleure performance.

#### 3. Single-Threaded mais Scalable

- **Un seul thread JavaScript** pour le code utilisateur
- **Thread Pool** en arrière-plan pour les opérations I/O
- **Event Loop** qui distribue le travail

**Cas d'usage idéaux** :
- Applications avec beaucoup d'I/O (API REST, WebSockets)
- Applications temps réel (chat, notifications)
- Streaming de données
- Microservices

**Cas d'usage à éviter** :
- Calculs intensifs (CPU-bound)
- Traitement d'images/vidéos lourds
- Calculs scientifiques complexes

---

## 2️⃣ Système de Modules Node.js

### Types de Modules

#### 1. Modules Core (Intégrés)

Ces modules sont fournis avec Node.js, pas besoin d'installation.

| Module | Utilité | Exemple |
|--------|---------|---------|
| `http` | Serveur/Client HTTP | `http.createServer()` |
| `fs` | File System | `fs.readFile()`, `fs.writeFile()` |
| `path` | Manipulation de chemins | `path.join()`, `path.resolve()` |
| `url` | Parsing d'URLs | `url.parse()` |
| `events` | Event Emitter | `new EventEmitter()` |
| `child_process` | Processus externes | `exec()`, `spawn()` |
| `crypto` | Cryptographie | `createHash()`, `randomBytes()` |

#### 2. Modules Externes (npm)

Installés via npm (Node Package Manager).

**Exemples utilisés dans le TP** :
- `formidable` : Parsing de formulaires multipart
- `express` : Framework web
- `socket.io` : WebSockets
- `mongoose` : ODM pour MongoDB
- `bcryptjs` : Hachage de mots de passe
- `jsonwebtoken` : JWT

**Installation** :
```bash
npm install express
npm install socket.io mongoose
```

#### 3. Modules Personnalisés

Créés par le développeur pour organiser le code.

**Export** :
```javascript
// server.js
function start() {
    // ...
}

module.exports.start = start;
// ou
exports.start = start;
```

**Import** :
```javascript
// index.js
const server = require('./server');
server.start();
```

---

## 3️⃣ Programmation Asynchrone en JavaScript

### Évolution des Approches

#### 1. Callbacks (Node.js classique)

```javascript
fs.readFile('file.txt', 'utf8', (error, data) => {
    if (error) {
        console.error(error);
        return;
    }
    console.log(data);
});
```

**Problème** : Callback Hell
```javascript
fs.readFile('file1.txt', (err, data1) => {
    fs.readFile('file2.txt', (err, data2) => {
        fs.readFile('file3.txt', (err, data3) => {
            // 😱 Pyramide de la mort
        });
    });
});
```

#### 2. Promises (ES6)

```javascript
fs.promises.readFile('file.txt', 'utf8')
    .then(data => {
        console.log(data);
        return fs.promises.readFile('file2.txt');
    })
    .then(data2 => {
        console.log(data2);
    })
    .catch(error => {
        console.error(error);
    });
```

**Avantages** :
- Chaînage plus lisible
- Gestion d'erreurs centralisée avec `.catch()`

#### 3. Async/Await (ES7) - **Recommandé**

```javascript
async function readFiles() {
    try {
        const data1 = await fs.promises.readFile('file1.txt', 'utf8');
        const data2 = await fs.promises.readFile('file2.txt', 'utf8');
        console.log(data1, data2);
    } catch (error) {
        console.error(error);
    }
}

readFiles();
```

**Avantages** :
- Code qui ressemble au style synchrone
- Gestion d'erreurs avec try-catch
- Plus facile à lire et maintenir

### Concepts Clés

**Asynchrone ≠ Parallèle**
- Asynchrone : Ne bloque pas en attendant
- Parallèle : Exécution simultanée sur plusieurs threads

**Event Loop Phases** :
1. Timers (`setTimeout`, `setInterval`)
2. Pending callbacks
3. Idle, prepare
4. Poll (I/O events)
5. Check (`setImmediate`)
6. Close callbacks

---

## 4️⃣ Développement d'Applications Web avec Node.js

### Architecture MVC

```
┌─────────────────────────────────────┐
│            CLIENT                    │
│     (Navigateur Web)                 │
└────────────┬────────────────────────┘
             │ HTTP Request
             ▼
┌─────────────────────────────────────┐
│         CONTROLLER                   │
│      (Router + Handlers)             │
│  - Route les requêtes                │
│  - Traite la logique métier          │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│            MODEL                     │
│    (Données et Business Logic)       │
│  - Utilisateurs                      │
│  - Sessions                          │
│  - Fichiers                          │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│            VIEW                      │
│      (HTML Généré)                   │
│  - Pages dynamiques                  │
│  - Templates                         │
└─────────────────────────────────────┘
```

### Gestion des Requêtes HTTP

#### Requête HTTP

```
GET /users/profile HTTP/1.1
Host: localhost:8888
User-Agent: Mozilla/5.0
Accept: application/json
Cookie: sessionId=abc123
```

#### Réponse HTTP

```
HTTP/1.1 200 OK
Content-Type: application/json
Set-Cookie: sessionId=xyz789; Path=/; HttpOnly

{"username": "jdupont", "email": "jean@example.com"}
```

### Routage

**Principe** : Associer une URL à un handler spécifique.

```javascript
const handle = {};
handle["/"] = handlers.home;
handle["/login"] = handlers.login;
handle["/api/users"] = handlers.getUsers;

function route(pathname) {
    if (handle[pathname]) {
        return handle[pathname]();
    }
    return "404 Not Found";
}
```

### Middleware

**Pattern** : Fonctions qui s'exécutent avant le handler final.

```javascript
function logger(req, res, next) {
    console.log(`${req.method} ${req.url}`);
    next(); // Passer au middleware suivant
}

function auth(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).send('Unauthorized');
    }
    next();
}

app.use(logger);
app.use('/api', auth);
```

---

## 5️⃣ Authentification et Sécurité

### Systèmes d'Authentification

#### 1. Session-Based (avec Cookies)

```
┌──────┐                    ┌──────────┐
│Client│                    │  Server  │
└───┬──┘                    └────┬─────┘
    │  POST /login              │
    │  {user, pass}             │
    ├──────────────────────────▶│
    │                            │ Verify credentials
    │                            │ Create session
    │  200 OK                    │ Store in memory/DB
    │  Set-Cookie: sessionId    │
    │◀──────────────────────────┤
    │                            │
    │  GET /profile              │
    │  Cookie: sessionId         │
    ├──────────────────────────▶│
    │                            │ Lookup session
    │  200 OK                    │ Return user data
    │  {user data}               │
    │◀──────────────────────────┤
```

**Implémentation** :
```javascript
const sessions = {};

// Login
const sessionId = generateId();
sessions[sessionId] = { username: 'jdupont' };
response.setHeader('Set-Cookie', `sessionId=${sessionId}; HttpOnly`);

// Vérification
const sessionId = parseCookie(request.headers.cookie).sessionId;
const session = sessions[sessionId];
if (!session) {
    return res.status(401).send('Unauthorized');
}
```

#### 2. Token-Based (JWT)

```
┌──────┐                    ┌──────────┐
│Client│                    │  Server  │
└───┬──┘                    └────┬─────┘
    │  POST /login              │
    │  {user, pass}             │
    ├──────────────────────────▶│
    │                            │ Verify credentials
    │  200 OK                    │ Generate JWT
    │  {token: "eyJhbG..."}     │
    │◀──────────────────────────┤
    │                            │
    │  GET /profile              │
    │  Authorization: Bearer ... │
    ├──────────────────────────▶│
    │                            │ Verify JWT signature
    │  200 OK                    │ Decode payload
    │  {user data}               │
    │◀──────────────────────────┤
```

**JWT Structure** :
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.  # Header
eyJ1c2VySWQiOiIxMjMiLCJuYW1lIjoiSm9obiJ9.  # Payload
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c   # Signature
```

**Implémentation** :
```javascript
const jwt = require('jsonwebtoken');

// Login
const token = jwt.sign(
    { userId: user._id, login: user.login },
    'secret-key',
    { expiresIn: '24h' }
);

// Vérification
const decoded = jwt.verify(token, 'secret-key');
```

### Sécurité des Mots de Passe

**❌ JAMAIS** :
```javascript
// Stockage en clair
user.password = "secret123";
```

**✅ TOUJOURS** :
```javascript
const bcrypt = require('bcryptjs');

// Hachage
const salt = await bcrypt.genSalt(10);
const hash = await bcrypt.hash(password, salt);
user.password = hash;

// Vérification
const isValid = await bcrypt.compare(candidatePassword, user.password);
```

**Principe** :
- **Salt** : Valeur aléatoire ajoutée avant le hachage
- **Rounds** : Nombre d'itérations (10 = 2^10 = 1024 itérations)
- **One-way** : Impossible de retrouver le mot de passe original

---

## 6️⃣ Communication Temps Réel avec Socket.io

### HTTP vs WebSocket

#### HTTP (Requête-Réponse)

```
Client ────Request────▶ Server
Client ◀───Response──── Server
```
- Unidirectionnel
- Client initie toujours
- Overhead des headers à chaque requête

#### WebSocket (Bidirectionnel)

```
Client ◀──────────────▶ Server
       Full-duplex
```
- Connexion persistante
- Communication bidirectionnelle
- Faible latence
- Idéal pour temps réel

### Socket.io : Concepts

**Événements** :
```javascript
// Serveur
socket.on('chat-message', (data) => {
    io.emit('chat-message', data); // Broadcast à tous
});

// Client
socket.emit('chat-message', { user: 'John', msg: 'Hello' });
socket.on('chat-message', (data) => {
    console.log(data);
});
```

**Rooms** :
```javascript
// Joindre une room
socket.join('room1');

// Envoyer à une room
io.to('room1').emit('message', 'Hello room1');

// Quitter une room
socket.leave('room1');
```

**Namespaces** :
```javascript
// Namespace pour le chat
const chatNamespace = io.of('/chat');
chatNamespace.on('connection', (socket) => {
    // ...
});

// Namespace pour les notifications
const notifNamespace = io.of('/notifications');
```

---

## 7️⃣ Stack MEAN (MongoDB, Express, Angular, Node.js)

### Architecture Complète

```
┌─────────────────────────────────────────┐
│         ANGULAR (Frontend)              │
│  - Components (UI)                      │
│  - Services (Business Logic)            │
│  - Routing                              │
│  - HTTP Client                          │
└────────────────┬────────────────────────┘
                 │ HTTP/REST API
                 ▼
┌─────────────────────────────────────────┐
│    EXPRESS + NODE.JS (Backend)          │
│  - Routes                               │
│  - Controllers                          │
│  - Middleware                           │
│  - Business Logic                       │
└────────────────┬────────────────────────┘
                 │ Mongoose ODM
                 ▼
┌─────────────────────────────────────────┐
│         MONGODB (Database)              │
│  - Collections (documents)              │
│  - Indexes                              │
│  - Aggregations                         │
└─────────────────────────────────────────┘
```

### Avantages du MEAN Stack

✅ **JavaScript partout** : Un seul langage pour tout le stack  
✅ **JSON natif** : Communication fluide entre les couches  
✅ **Open-Source** : Tous les composants sont gratuits et open-source  
✅ **Communauté** : Large communauté et nombreuses ressources  
✅ **Performance** : Node.js rapide, MongoDB scalable  
✅ **Moderne** : Technologies actuelles et maintenues

### MongoDB : Base de Données NoSQL

**Document** (équivalent d'une ligne en SQL) :
```json
{
    "_id": ObjectId("507f1f77bcf86cd799439011"),
    "firstname": "Jean",
    "lastname": "Dupont",
    "login": "jdupont",
    "password": "$2a$10$...",
    "profileImage": "/uploads/jdupont.jpg",
    "createdAt": ISODate("2026-02-05T10:00:00Z")
}
```

**Collection** (équivalent d'une table SQL) :
- users
- sessions
- files

**Avantages** :
- Schéma flexible
- Scalabilité horizontale
- Requêtes rapides
- Pas de JOINs (données embarquées)

---

## 8️⃣ Express.js : Framework Web

### Pourquoi Express ?

Sans Express (Node.js pur) :
```javascript
const http = require('http');

http.createServer((req, res) => {
    const url = req.url;
    
    if (url === '/users' && req.method === 'GET') {
        // Handler GET /users
    } else if (url === '/users' && req.method === 'POST') {
        // Handler POST /users
    } else if (url.startsWith('/users/')) {
        // Handler GET /users/:id
    }
    // ...
}).listen(3000);
```

Avec Express :
```javascript
const express = require('express');
const app = express();

app.get('/users', (req, res) => {
    res.json(users);
});

app.post('/users', (req, res) => {
    // Create user
});

app.get('/users/:id', (req, res) => {
    const id = req.params.id;
    // Get user by id
});

app.listen(3000);
```

### Fonctionnalités Express

**Routage** :
```javascript
app.get('/path', handler);
app.post('/path', handler);
app.put('/path', handler);
app.delete('/path', handler);
```

**Middleware** :
```javascript
app.use(express.json()); // Parsing JSON
app.use(express.static('public')); // Fichiers statiques
app.use(cors()); // CORS
```

**Paramètres** :
```javascript
// Query params: /search?q=node
app.get('/search', (req, res) => {
    const query = req.query.q;
});

// Route params: /users/123
app.get('/users/:id', (req, res) => {
    const id = req.params.id;
});

// Body: POST avec JSON
app.post('/users', (req, res) => {
    const user = req.body;
});
```

---

## 9️⃣ Bonnes Pratiques Node.js

### 1. Gestion des Erreurs

```javascript
// ✅ Avec async/await
async function getData() {
    try {
        const data = await fetchData();
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error; // Re-throw ou gérer
    }
}

// ✅ Error middleware Express
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message });
});
```

### 2. Variables d'Environnement

```javascript
// .env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/myapp
JWT_SECRET=super-secret-key

// app.js
require('dotenv').config();

const port = process.env.PORT || 3000;
const dbUri = process.env.MONGODB_URI;
```

### 3. Sécurité

```javascript
// Helmet : Headers sécurisés
const helmet = require('helmet');
app.use(helmet());

// Rate limiting : Limite les requêtes
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // Max 100 requêtes
});
app.use(limiter);

// Validation : Valider les entrées
const { body, validationResult } = require('express-validator');

app.post('/users', [
    body('email').isEmail(),
    body('password').isLength({ min: 6 })
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    // ...
});
```

### 4. Performance

```javascript
// Compression : Compresser les réponses
const compression = require('compression');
app.use(compression());

// Caching : Redis pour le cache
const redis = require('redis');
const client = redis.createClient();

// Connection pooling : MongoDB
mongoose.connect(uri, {
    poolSize: 10
});
```

---

## 🔟 Points Clés à Retenir

### Node.js

✅ Architecture événementielle et non-bloquante  
✅ Idéal pour applications I/O intensives  
✅ JavaScript côté serveur  
✅ npm : Énorme écosystème de packages  

### Asynchronisme

✅ Callbacks → Promises → Async/Await  
✅ Ne jamais bloquer l'Event Loop  
✅ Gérer toujours les erreurs  

### Architecture Web

✅ Pattern MVC pour organiser le code  
✅ REST API pour la communication  
✅ Middleware pour la logique transversale  

### Sécurité

✅ JAMAIS de mots de passe en clair  
✅ Toujours valider les entrées  
✅ Utiliser HTTPS en production  
✅ JWT ou sessions pour l'authentification  

### Temps Réel

✅ WebSocket pour communication bidirectionnelle  
✅ Socket.io simplifie l'implémentation  
✅ Événements pour structurer la communication  

### MEAN Stack

✅ JavaScript full-stack  
✅ MongoDB pour la flexibilité  
✅ Express pour le backend  
✅ Angular pour le frontend  

---

## 📈 Conclusion

Ce TP m'a permis de maîtriser :

1. **Les fondamentaux de Node.js** : architecture événementielle, asynchronisme
2. **Le développement d'applications web modernes** : MVC, REST API, authentification
3. **Les technologies temps réel** : WebSocket, Socket.io
4. **Le stack MEAN complet** : de la base de données au frontend
5. **Les bonnes pratiques** : sécurité, performance, organisation du code

Ces compétences sont directement applicables dans le développement professionnel et constituent une base solide pour les projets futurs.
