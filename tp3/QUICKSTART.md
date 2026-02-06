# TP3 WebRTC - Guide de Démarrage Rapide

## 🚀 Méthode la Plus Simple

```bash
cd /Users/redaelhadfi/Desktop/p2p/tp3
./startup.sh
```

Choisir l'étape souhaitée dans le menu interactif!

---

## 📋 Lancement Manuel par Étape

### Étape 1 : getUserMedia (Capture Vidéo)

```bash
cd step1-getUserMedia
python3 -m http.server 8000
# Ouvrir http://localhost:8000
```

**Test** : Autoriser la caméra → Voir votre flux vidéo

---

### Étape 2 : RTCDataChannel (Échange P2P)

```bash
cd step2-datachannel
python3 -m http.server 8001
# Ouvrir http://localhost:8001
```

**Test** : Start → Entrer message → Send → Message reçu

---

### Étape 3 : Serveur de Signalisation

```bash
cd step3-signaling
npm install
node server.js
# Ouvrir http://localhost:8181 dans DEUX navigateurs
```

**Test** : Entrer même canal dans les deux → Échanger des messages

---

### Étape 4 : Application Complète WebRTC

```bash
cd complete-app
npm install
node server.js
# Ouvrir http://localhost:3000 dans DEUX navigateurs
```

**Fonctionnalités** :
- ✅ Audio/Vidéo bidirectionnel
- ✅ Chat P2P en temps réel
- ✅ Contrôles (Muet, Arrêter vidéo)
- ✅ Interface professionnelle

**Test** :
1. Navigateur 1 : Démarrer → Entrer canal "room1"
2. Navigateur 2 : Démarrer → Entrer canal "room1"
3. 🎉 Les deux vidéos apparaissent + Chat actif!

---

## 📝 Important

### Sécurité
- ⚠️ WebRTC nécessite **HTTPS** ou **localhost**
- ✅ Tous nos tests utilisent localhost (OK!)

### Navigateurs Supportés
- Chrome 53+
- Firefox 36+
- Safari 11+
- Edge 79+

### Permissions
- 📹 Autoriser l'accès caméra
- 🎤 Autoriser l'accès microphone
- 🔧 Paramètres → Confidentialité → Caméra/Microphone

---

## 🔍 Vérification Rapide

### Test getUserMedia
```javascript
// Console du navigateur (F12)
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    console.log('✅ getUserMedia est supporté!');
} else {
    console.log('❌ getUserMedia NON supporté');
}
```

---

## 📚 Documentation Complète

Pour des tests détaillés et dépannage :
- **[TESTING.md](TESTING.md)** - Guide de test complet avec tous les scénarios
- **[README.md](README.md)** - Documentation technique complète

---

## 🎯 Ordre Recommandé

1. **Étape 1** : Comprendre getUserMedia (5 min)
2. **Étape 2** : Tester RTCDataChannel (10 min)
3. **Étape 3** : Comprendre la signalisation (15 min)
4. **Étape 4** : Application complète (20 min)

**Total** : ~50 minutes pour tout tester

---

## 🆘 Problèmes Courants

### "Permission denied"
→ Autoriser caméra/microphone dans paramètres navigateur

### "Cannot connect"
→ Vérifier que le serveur est démarré (`node server.js`)

### "ICE failed"
→ Normal en localhost, fonctionne quand même!

### "Channel full"
→ Maximum 2 pairs par canal, choisir un autre nom

---

**Auteur** : Reda Elhadfi  
**Cours** : Communication P2P en temps réel sur le web  
**INPT** : INE3 (2025-2026)
