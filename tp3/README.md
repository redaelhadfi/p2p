# TP3 : La Plateforme WebRTC ✅
## Communication P2P en Temps Réel sur le Web


**Cours:** Communication P2P en temps réel sur le web  
**Niveau:** INE3  
**Institution:** INPT (Institut National des Postes et Télécommunications)  
**Année Académique:** 2025-2026  
**Auteur:** Reda Elhadfi , alae LAITA



## 📋 Table des Matières

1. [Description du Projet](#description-du-projet)
2. [Objectifs](#objectifs)
3. [Architecture WebRTC](#architecture-webrtc)
4. [Structure du Projet](#structure-du-projet)
5. [Prérequis](#prérequis)
6. [Installation](#installation)
7. [Étapes d'Implémentation](#étapes-dimplémentation)
8. [Guide d'Utilisation](#guide-dutilisation)
9. [Technologies Utilisées](#technologies-utilisées)
10. [Références](#références)

---

## 🎯 Description du Projet

L'objectif de ce TP est de développer une **application P2P** en se basant sur les technologies **WebRTC** et **HTML5** selon les principes présentés dans le cadre du cours. 

### Fonctionnalités Principales

L'application doit permettre à deux utilisateurs, devant leurs navigateurs, de :

1. **✅ Télécharger une page web** et ouvrir une session P2P
2. **✅ Échanger des flux média** (audio et vidéo)
   - Capturés à partir des périphériques multimédia de chaque utilisateur
3. **✅ Échanger des données** (texte)
   - Via un forum de discussion (chat)

**STATUT : TOUTES LES FONCTIONNALITÉS IMPLÉMENTÉES ET TESTÉES ✅**

### Défis Techniques

Les utilisateurs peuvent avoir :
- Des machines avec des caractéristiques différentes (audio, vidéo, résolution, bande passante)
- Des connexions derrière des NATs et des Pare-feux

### Solution : Canal de Signalisation

Un canal de signalisation est nécessaire pour :
- **Négocier** des paramètres communs de session
- **Découvrir** chaque pair
- **Franchir** les NATs et les Pare-feux

**Technologies utilisées :**
- XHR (XMLHttpRequest)
- WebSocket
- Node.js
- ICE (Interactive Connectivity Establishment)
- STUN (Session Traversal Utilities for NAT)
- TURN (Traversal Using Relays around NAT)

---

## 🎯 Objectifs

1. **Maîtriser l'API WebRTC**
   - getUserMedia() pour la capture média
   - RTCPeerConnection pour les flux audio/vidéo
   - RTCDataChannel pour les données arbitraires

2. **Implémenter un serveur de signalisation**
   - WebSocket avec Node.js
   - Gestion des sessions
   - Échange de SDP (Session Description Protocol)

3. **Gérer la traversée NAT**
   - Configuration ICE
   - Serveurs STUN
   - Serveurs TURN (si nécessaire)

4. **Développer une application P2P complète**
   - Interface utilisateur HTML5
   - Communication en temps réel
   - Gestion des erreurs

---

## 🏗️ Architecture WebRTC

```
┌─────────────────────────────────────────────────────────────┐
│                    NAVIGATEUR CLIENT A                       │
│  ┌────────────────────────────────────────────────────┐     │
│  │  getUserMedia() → Flux Audio/Vidéo Local          │     │
│  │  RTCPeerConnection → Connexion P2P                 │     │
│  │  RTCDataChannel → Canal de données                 │     │
│  └────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
                        │
                        │ Signalisation (WebSocket)
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              SERVEUR DE SIGNALISATION (Node.js)              │
│  ┌────────────────────────────────────────────────────┐     │
│  │  WebSocket Server                                  │     │
│  │  - Échange de SDP (Offer/Answer)                   │     │
│  │  - Échange de ICE Candidates                       │     │
│  │  - Gestion des rooms                               │     │
│  └────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
                        │
                        │ Signalisation (WebSocket)
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                    NAVIGATEUR CLIENT B                       │
│  ┌────────────────────────────────────────────────────┐     │
│  │  getUserMedia() → Flux Audio/Vidéo Local          │     │
│  │  RTCPeerConnection → Connexion P2P                 │     │
│  │  RTCDataChannel → Canal de données                 │     │
│  └────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
                        │
                        │ Connexion P2P directe
                        │ (après traversée NAT)
                        ▼
        ┌───────────────────────────────────┐
        │  Flux Audio/Vidéo + Données       │
        │  (Communication directe P2P)      │
        └───────────────────────────────────┘

        Serveurs externes (si nécessaire):
        ┌──────────────────────────────────┐
        │   STUN Server                    │
        │   (Découverte adresse publique)  │
        └──────────────────────────────────┘
        ┌──────────────────────────────────┐
        │   TURN Server                    │
        │   (Relais si P2P impossible)     │
        └──────────────────────────────────┘
```

---

## 📁 Structure du Projet

```
tp3/
├── README.md                          # Documentation principale
├── step1-getUserMedia/                # Étape 1: Capture média
│   ├── index.html                     # Page HTML
│   └── js/
│       └── getUserMedia.js            # Script de capture
├── step2-signaling/                   # Étape 2: Serveur de signalisation
│   ├── server.js                      # Serveur WebSocket Node.js
│   ├── package.json                   # Dépendances npm
│   └── public/
│       └── index.html                 # Client de signalisation
├── step3-rtcpeerconnection/           # Étape 3: Connexion P2P audio/vidéo
│   ├── server.js                      # Serveur de signalisation
│   └── public/
│       ├── index.html                 # Interface client
│       └── js/
│           └── rtcpeer.js             # Logique RTCPeerConnection
├── step4-datachannel/                 # Étape 4: Canal de données
│   ├── server.js                      # Serveur
│   └── public/
│       ├── index.html                 # Interface avec chat
│       └── js/
│           └── datachannel.js         # RTCDataChannel
└── complete-app/                      # Application complète intégrée
    ├── server.js                      # Serveur de signalisation
    ├── package.json
    └── public/
        ├── index.html                 # Interface complète
        ├── css/
        │   └── style.css              # Styles
        └── js/
            └── app.js                 # Logique complète WebRTC
```

---

## 🔧 Prérequis

### Environnement de Travail

Pour développer cette application, vous devez disposer de :

1. **Navigateur moderne** (dans une récente version)
   - Chrome (recommandé)
   - Firefox
   - Opera
   - Safari
   - Edge

2. **Node.js et npm**
   - Node.js version 14.x ou supérieure
   - npm (gestionnaire de paquets)

3. **Périphériques multimédia**
   - Caméra (intégrée ou externe)
   - Microphone (intégré ou externe)

4. **Connexion Internet**
   - Bon débit recommandé pour les flux vidéo
   - Nécessaire pour les serveurs STUN/TURN

5. **Éditeur de code**
   - VS Code (recommandé)
   - Sublime Text
   - Atom
   - etc.

### Vérification des Prérequis

```bash
# Vérifier Node.js
node --version

# Vérifier npm
npm --version

# Vérifier la disponibilité des périphériques
# Ouvrir Chrome → chrome://settings/content/camera
# Ouvrir Chrome → chrome://settings/content/microphone
```

---

## 📦 Installation

### Installation Globale

```bash
# Cloner ou naviguer vers le projet
cd /Users/redaelhadfi/Desktop/p2p/tp3

# Pour chaque étape nécessitant Node.js
cd step2-signaling
npm install

cd ../step3-rtcpeerconnection
npm install

cd ../step4-datachannel
npm install

cd ../complete-app
npm install
```

### Installation des Modules Node.js

Les modules principaux utilisés :
- `ws` : WebSocket pour Node.js
- `express` : Framework web
- `socket.io` : Communication temps réel (alternative à ws)

```bash
# Installation rapide pour l'application complète
cd complete-app
npm install express socket.io
```

---

## 🔄 Étapes d'Implémentation

### Étape 1 : Capture des flux audio et vidéo du pair local

**Objectif** : Utiliser l'API MediaStream (getUserMedia) pour capturer les flux audio/vidéo

**Fichiers** :
- `step1-getUserMedia/index.html`
- `step1-getUserMedia/js/getUserMedia.js`

**API Utilisée** : `navigator.getUserMedia()`

**Concepts** :
- Contraintes média (audio, video, résolution)
- Stream MediaStream
- Élément HTML5 `<video>`
- Gestion des permissions

**Lancement** :
```bash
cd step1-getUserMedia
# Ouvrir index.html dans un navigateur
# ⚠️ HTTPS requis (ou localhost)
```

**Test** :
1. Ouvrir `index.html` dans Chrome
2. Autoriser l'accès à la caméra
3. Voir le flux vidéo s'afficher

---

### Étape 2 : Établissement d'un canal de signalisation

**Objectif** : Créer un serveur WebSocket pour la signalisation entre pairs

**Concepts** :
- WebSocket bidirectionnel
- Serveur Node.js
- Échange de messages JSON
- Gestion de sessions

**À implémenter** :
- Serveur WebSocket (Node.js)
- Client WebSocket (JavaScript)
- Protocole de signalisation (SDP, ICE)

---

### Étape 3 : RTCPeerConnection pour audio/vidéo

**Objectif** : Établir une connexion P2P pour échanger des flux média

**API Utilisée** : `RTCPeerConnection`

**Concepts** :
- Offer/Answer (SDP)
- ICE Candidates
- ontrack / addStream
- Configuration STUN/TURN

---

### Étape 4 : RTCDataChannel pour données

**Objectif** : Établir un canal de données pour le chat

**API Utilisée** : `RTCDataChannel`

**Concepts** :
- createDataChannel()
- ondatachannel
- send() / onmessage
- Chat en temps réel

---

### Étape 5 : Configuration ICE, STUN, TURN

**Objectif** : Traverser les NATs et pare-feux

**Serveurs publics** :
```javascript
var iceServers = {
    iceServers: [
        {urls: 'stun:stun.l.google.com:19302'},
        {urls: 'stun:stun1.l.google.com:19302'}
    ]
};
```

---

## 📖 Guide d'Utilisation

### Étape 1 : getUserMedia

```bash
# Méthode 1 : Serveur HTTP simple
cd step1-getUserMedia
python3 -m http.server 8000
# Ouvrir http://localhost:8000

# Méthode 2 : Via le script de démarrage
./startup.sh
# Choisir option 1
```

**⚠️ Important** : Les API WebRTC nécessitent HTTPS ou localhost pour des raisons de sécurité.

---

### Étape 2 : RTCDataChannel

```bash
cd step2-datachannel
python3 -m http.server 8001
# Ouvrir http://localhost:8001
```

**Test** :
1. Cliquer sur "Start" pour créer la connexion P2P
2. Entrer un message dans le champ texte
3. Cliquer sur "Send"
4. Le message apparaît dans le champ de réception

---

### Étape 3 : Serveur de Signalisation

```bash
cd step3-signaling
npm install
node server.js
# Ouvrir http://localhost:8181 dans DEUX navigateurs
```

**Test** :
1. Ouvrir deux onglets/navigateurs
2. Entrer le même nom de canal dans les deux
3. Le premier devient "initiateur"
4. Le second rejoint le canal
5. Échanger des messages via les prompts

---

### Étape 4 : Application Complète

```bash
cd complete-app
npm install
node server.js
# Ouvrir http://localhost:3000 dans DEUX navigateurs
```

**Fonctionnalités** :
- ✅ Capture audio/vidéo (getUserMedia)
- ✅ Signalisation avec Socket.io
- ✅ RTCPeerConnection pour flux média
- ✅ RTCDataChannel pour chat
- ✅ Configuration ICE/STUN
- ✅ Interface utilisateur complète
- ✅ Contrôles (Muet, Arrêter vidéo)
- ✅ Console de logs en temps réel

---

## 🛠️ Technologies Utilisées

### Frontend
- **HTML5** : Structure et éléments média
- **CSS3** : Styles et responsive design
- **JavaScript ES6+** : Logique client

### API WebRTC
- **getUserMedia()** : Capture média
- **RTCPeerConnection** : Connexion P2P
- **RTCDataChannel** : Canal de données
- **RTCSessionDescription** : SDP
- **RTCIceCandidate** : ICE

### Backend
- **Node.js** : Environnement serveur
- **WebSocket (ws)** : Communication bidirectionnelle
- **Express** : Framework web
- **Socket.io** : Alternative WebSocket

### Protocoles et Standards
- **WebRTC** : Web Real-Time Communication
- **SDP** : Session Description Protocol
- **ICE** : Interactive Connectivity Establishment
- **STUN** : Session Traversal Utilities for NAT
- **TURN** : Traversal Using Relays around NAT

---