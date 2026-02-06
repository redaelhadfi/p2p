#!/bin/bash


echo "╔═══════════════════════════════════════════════╗"
echo "║   TP2 - Node.js Application Startup          ║"
echo "║   Communication P2P en temps réel             ║"
echo "╚═══════════════════════════════════════════════╝"
echo ""

# Function to display menu
show_menu() {
    echo "Choisissez l'application à démarrer:"
    echo ""
    echo "  1) Version 1 - Hello World"
    echo "  2) Version 2 - Modularisation"
    echo "  3) Version 3 - Routage"
    echo "  4) Version 4 - Request Handlers"
    echo "  5) Version 5 - Retour de contenu"
    echo "  6) Version 6 - Asynchronisme"
    echo "  7) Application Complète"
    echo "  8) Application Socket.io (Temps Réel)"
    echo "  9) Application MEAN Stack (Backend)"
    echo " 10) Application MEAN Stack (Frontend Angular)"
    echo " 11) Application MEAN Stack (Full Stack - Backend + Frontend)"
    echo "  0) Quitter"
    echo ""
}

start_version() {
    local version=$1
    echo ""
    echo "Démarrage de $version..."
    echo "URL: http://localhost:8888/"
    echo "Appuyez sur Ctrl+C pour arrêter"
    echo ""
    cd "$version" && node index.js 2>/dev/null || node server.js
}

# Main loop
while true; do
    show_menu
    read -p "Votre choix (0-11): " choice
    
    case $choice in
        1)
            start_version "version1"
            ;;
        2)
            start_version "version2"
            ;;
        3)
            start_version "version3"
            ;;
        4)
            start_version "version4"
            ;;
        5)
            start_version "version5"
            ;;
        6)
            start_version "version6"
            ;;
        7)
            echo ""
            echo "Démarrage de l'application complète..."
            echo "Vérification des dépendances..."
            cd complete-app
            if [ ! -d "node_modules" ]; then
                echo "Installation de formidable..."
                npm install formidable
            fi
            echo "URL: http://localhost:8888/"
            echo "Appuyez sur Ctrl+C pour arrêter"
            echo ""
            node index.js
            ;;
        8)
            echo ""
            echo "Démarrage de l'application Socket.io..."
            echo "Vérification des dépendances..."
            cd socketio-app
            if [ ! -d "node_modules" ]; then
                echo "Installation des dépendances..."
                npm install
            fi
            echo "URL: http://localhost:3000/"
            echo "Appuyez sur Ctrl+C pour arrêter"
            echo ""
            npm start
            ;;
        9)
            echo ""
            echo "Démarrage du backend MEAN Stack..."
            echo "Vérification des dépendances..."
            cd mean-stack-app/backend
            if [ ! -d "node_modules" ]; then
                echo "Installation des dépendances..."
                npm install
            fi
            if [ ! -f ".env" ]; then
                echo "Création du fichier .env..."
                cp .env.example .env
                echo "ATTENTION: Veuillez configurer .env avec vos paramètres MongoDB"
            fi
            echo "URL API: http://localhost:3001/"
            echo "Appuyez sur Ctrl+C pour arrêter"
            echo ""
            node server.js
            ;;
        10)
            echo ""
            echo "Démarrage du frontend Angular MEAN Stack..."
            echo "Vérification des dépendances..."
            cd mean-stack-app/frontend
            if [ ! -d "node_modules" ]; then
                echo "Installation des dépendances..."
                npm install
            fi
            echo "URL Frontend: http://localhost:4200/"
            echo "Backend doit être démarré séparément sur http://localhost:3001/"
            echo "Appuyez sur Ctrl+C pour arrêter"
            echo ""
            npm start
            ;;
        11)
            echo ""
            echo "Démarrage du Full Stack MEAN..."
            echo ""
            
            # Démarrer le backend en arrière-plan
            echo "1/2 - Démarrage du backend..."
            cd mean-stack-app/backend
            if [ ! -d "node_modules" ]; then
                echo "Installation des dépendances backend..."
                npm install
            fi
            if [ ! -f ".env" ]; then
                echo "Création du fichier .env..."
                cp .env.example .env
                echo "ATTENTION: Veuillez configurer .env avec vos paramètres MongoDB"
            fi
            node server.js &
            BACKEND_PID=$!
            
            # Attendre que le backend démarre
            sleep 3
            
            # Démarrer le frontend
            echo ""
            echo "2/2 - Démarrage du frontend Angular..."
            cd ../frontend
            if [ ! -d "node_modules" ]; then
                echo "Installation des dépendances frontend..."
                npm install
            fi
            echo ""
            echo "✅ Full Stack démarré!"
            echo "   Backend API: http://localhost:3001/"
            echo "   Frontend:    http://localhost:4200/"
            echo ""
            echo "Appuyez sur Ctrl+C pour arrêter les deux serveurs"
            echo ""
            
            # Fonction pour tuer les processus à la sortie
            trap "kill $BACKEND_PID 2>/dev/null; exit" INT TERM
            
            npm start
            
            # Tuer le backend si le frontend s'arrête
            kill $BACKEND_PID 2>/dev/null
            ;;
        0)
            echo ""
            echo "Au revoir!"
            exit 0
            ;;
        *)
            echo ""
            echo "Choix invalide. Veuillez choisir entre 0 et 11."
            echo ""
            sleep 2
            ;;
    esac
done
