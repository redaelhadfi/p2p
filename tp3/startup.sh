#!/bin/bash

# Script de démarrage pour TP3 WebRTC
# Auteur: Reda Elhadfi

clear
echo "╔══════════════════════════════════════════════════════════╗"
echo "║          TP3: Plateforme WebRTC - Menu Principal         ║"
echo "║        Communication P2P en Temps Réel sur le Web        ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""
echo "Choisissez une étape à exécuter:"
echo ""
echo "  1) Étape 1: getUserMedia (Capture Vidéo)"
echo "  2) Étape 2: RTCDataChannel (Échange de données P2P)"
echo "  3) Étape 3: Serveur de Signalisation Socket.io"
echo "  4) Application Complète WebRTC (Audio/Vidéo + Chat)"
echo ""
echo "  5) Installer les dépendances Node.js"
echo "  6) Installer toutes les dépendances"
echo ""
echo "  0) Quitter"
echo ""
echo "════════════════════════════════════════════════════════════"
read -p "Votre choix: " choice

case $choice in
    1)
        echo ""
        echo "🚀 Lancement de l'Étape 1: getUserMedia"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        cd step1-getUserMedia
        echo "📂 Répertoire: $(pwd)"
        echo ""
        echo "Démarrage du serveur HTTP sur le port 8000..."
        python3 -m http.server 8000
        ;;
    2)
        echo ""
        echo "🚀 Lancement de l'Étape 2: RTCDataChannel"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        cd step2-datachannel
        echo "📂 Répertoire: $(pwd)"
        echo ""
        echo "Démarrage du serveur HTTP sur le port 8001..."
        python3 -m http.server 8001
        ;;
    3)
        echo ""
        echo "🚀 Lancement de l'Étape 3: Serveur de Signalisation"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        cd step3-signaling
        
        if [ ! -d "node_modules" ]; then
            echo "📦 Installation des dépendances npm..."
            npm install
        fi
        
        echo "📂 Répertoire: $(pwd)"
        echo ""
        echo "Démarrage du serveur Socket.io sur le port 8181..."
        node server.js
        ;;
    4)
        echo ""
        echo "🚀 Lancement de l'Application Complète WebRTC"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        cd complete-app
        
        if [ ! -d "node_modules" ]; then
            echo "📦 Installation des dépendances npm..."
            npm install
        fi
        
        echo "📂 Répertoire: $(pwd)"
        echo ""
        echo "✅ Serveur WebRTC démarré!"
        echo "🌐 Ouvrez http://localhost:3000 dans DEUX navigateurs"
        echo ""
        node server.js
        ;;
    5)
        echo ""
        echo "📦 Installation des dépendances pour l'étape choisie"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
        echo "Quelle étape?"
        echo "  3) Étape 3 - Signalisation"
        echo "  4) Application complète"
        read -p "Choix: " step_choice
        
        if [ "$step_choice" == "3" ]; then
            cd step3-signaling
            npm install
        elif [ "$step_choice" == "4" ]; then
            cd complete-app
            npm install
        fi
        
        echo ""
        echo "✅ Installation terminée!"
        ;;
    6)
        echo ""
        echo "📦 Installation de toutes les dépendances Node.js"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        
        echo "📦 Installation pour Étape 3..."
        cd step3-signaling
        npm install
        cd ..
        
        echo ""
        echo "📦 Installation pour Application Complète..."
        cd complete-app
        npm install
        cd ..
        
        echo ""
        echo "✅ Toutes les installations terminées!"
        ;;
    0)
        echo ""
        echo "👋 Au revoir!"
        exit 0
        ;;
    *)
        echo ""
        echo "❌ Choix invalide"
        ;;
esac
