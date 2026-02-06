var exec = require("child_process").exec;
var querystring = require("querystring");
var fs = require("fs");
var formidable = require("formidable");

// Base de données en mémoire pour les utilisateurs
var users = [];
var sessions = {};

// Fonction pour générer un ID de session
function generateSessionId() {
    return 'session_' + Math.random().toString(36).substr(2, 9) + Date.now();
}

// Fonction pour obtenir la session
function getSession(request) {
    var cookies = {};
    if (request.headers.cookie) {
        request.headers.cookie.split(';').forEach(function(cookie) {
            var parts = cookie.trim().split('=');
            cookies[parts[0]] = parts[1];
        });
    }
    return cookies.sessionId ? sessions[cookies.sessionId] : null;
}

// Handler pour la page d'accueil
function start(response, request) {
    console.log("Request handler 'start' was called.");
    
    var session = getSession(request);
    var username = session ? session.username : null;
    
    var html = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TP2 - Application Node.js</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        h1 {
            color: #667eea;
            text-align: center;
            margin-bottom: 10px;
            font-size: 2.5em;
        }
        .subtitle {
            text-align: center;
            color: #666;
            margin-bottom: 30px;
        }
        .user-info {
            background: #f0f0f0;
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 20px;
            text-align: center;
        }
        .services {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-top: 30px;
        }
        .service-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 10px;
            text-decoration: none;
            text-align: center;
            transition: transform 0.3s, box-shadow 0.3s;
        }
        .service-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.2);
        }
        .service-card h3 {
            margin-bottom: 10px;
        }
        .service-card p {
            font-size: 0.9em;
            opacity: 0.9;
        }
        .auth-section {
            background: #fff3cd;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 20px;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Application Node.js TP2</h1>
        <p class="subtitle">Communication P2P en temps réel sur le web</p>
        
        ${username ? `
            <div class="user-info">
                <strong>👤 Connecté en tant que:</strong> ${username}
                <br><a href="/logout">Se déconnecter</a>
            </div>
        ` : `
            <div class="auth-section">
                <p><strong>⚠️ Vous n'êtes pas connecté</strong></p>
                <p>Veuillez vous <a href="/register">inscrire</a> ou vous <a href="/login">connecter</a></p>
            </div>
        `}
        
        <h2 style="margin-top: 30px; color: #333;">📋 Services disponibles:</h2>
        
        <div class="services">
            <a href="/register" class="service-card">
                <h3>📝 Inscription</h3>
                <p>Créer un nouveau compte</p>
            </a>
            
            <a href="/login" class="service-card">
                <h3>🔐 Connexion</h3>
                <p>Se connecter au système</p>
            </a>
            
            <a href="/upload" class="service-card">
                <h3>📤 Upload</h3>
                <p>Télécharger une image</p>
            </a>
            
            <a href="/show" class="service-card">
                <h3>🖼️ Afficher</h3>
                <p>Voir votre image</p>
            </a>
            
            <a href="/find" class="service-card">
                <h3>🔍 Rechercher</h3>
                <p>Lister les fichiers</p>
            </a>
            
            <a href="/logout" class="service-card">
                <h3>🚪 Déconnexion</h3>
                <p>Fermer la session</p>
            </a>
        </div>
    </div>
</body>
</html>`;
    
    response.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
    response.write(html);
    response.end();
}

// Handler pour l'inscription
function register(response, request) {
    console.log("Request handler 'register' was called.");
    
    if (request.method === 'POST') {
        var body = '';
        
        request.on('data', function(chunk) {
            body += chunk.toString();
        });
        
        request.on('end', function() {
            var params = querystring.parse(body);
            
            // Vérifier si l'utilisateur existe déjà
            var existingUser = users.find(u => u.login === params.login);
            
            if (existingUser) {
                response.writeHead(400, {"Content-Type": "text/html; charset=utf-8"});
                response.write("<html><body><h1>❌ Erreur</h1>");
                response.write("<p>Ce login existe déjà!</p>");
                response.write("<a href='/register'>Réessayer</a></body></html>");
                response.end();
            } else {
                // Ajouter le nouvel utilisateur
                users.push({
                    firstname: params.firstname,
                    lastname: params.lastname,
                    login: params.login,
                    password: params.password,
                    profileImage: null
                });
                
                console.log("New user registered:", params.login);
                console.log("Total users:", users.length);
                
                response.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
                response.write("<html><body><h1>✅ Inscription réussie!</h1>");
                response.write("<p>Votre compte a été créé avec succès.</p>");
                response.write("<a href='/login'>Se connecter maintenant</a></body></html>");
                response.end();
            }
        });
    } else {
        var html = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Inscription</title>
    <style>
        body { font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px; }
        .form-container { max-width: 500px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; }
        h1 { color: #667eea; }
        input { width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ddd; border-radius: 5px; }
        button { background: #667eea; color: white; padding: 12px 30px; border: none; border-radius: 5px; cursor: pointer; }
        button:hover { background: #764ba2; }
    </style>
</head>
<body>
    <div class="form-container">
        <h1>📝 Inscription</h1>
        <form method="POST" action="/register">
            <input type="text" name="firstname" placeholder="Prénom" required>
            <input type="text" name="lastname" placeholder="Nom" required>
            <input type="text" name="login" placeholder="Login" required>
            <input type="password" name="password" placeholder="Mot de passe" required>
            <button type="submit">S'inscrire</button>
        </form>
        <p><a href="/">Retour à l'accueil</a></p>
    </div>
</body>
</html>`;
        
        response.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
        response.write(html);
        response.end();
    }
}

// Handler pour la connexion
function login(response, request) {
    console.log("Request handler 'login' was called.");
    
    if (request.method === 'POST') {
        var body = '';
        
        request.on('data', function(chunk) {
            body += chunk.toString();
        });
        
        request.on('end', function() {
            var params = querystring.parse(body);
            
            // Vérifier les identifiants
            var user = users.find(u => u.login === params.login && u.password === params.password);
            
            if (user) {
                // Créer une session
                var sessionId = generateSessionId();
                sessions[sessionId] = {
                    username: user.login,
                    firstname: user.firstname,
                    lastname: user.lastname
                };
                
                console.log("User logged in:", user.login);
                
                response.writeHead(200, {
                    "Content-Type": "text/html; charset=utf-8",
                    "Set-Cookie": "sessionId=" + sessionId + "; Path=/"
                });
                response.write("<html><body><h1>✅ Connexion réussie!</h1>");
                response.write("<p>Bienvenue " + user.firstname + " " + user.lastname + "!</p>");
                response.write("<a href='/'>Aller à l'accueil</a></body></html>");
                response.end();
            } else {
                response.writeHead(401, {"Content-Type": "text/html; charset=utf-8"});
                response.write("<html><body><h1>❌ Erreur de connexion</h1>");
                response.write("<p>Login ou mot de passe incorrect!</p>");
                response.write("<a href='/login'>Réessayer</a></body></html>");
                response.end();
            }
        });
    } else {
        var html = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Connexion</title>
    <style>
        body { font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px; }
        .form-container { max-width: 500px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; }
        h1 { color: #667eea; }
        input { width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ddd; border-radius: 5px; }
        button { background: #667eea; color: white; padding: 12px 30px; border: none; border-radius: 5px; cursor: pointer; }
        button:hover { background: #764ba2; }
    </style>
</head>
<body>
    <div class="form-container">
        <h1>🔐 Connexion</h1>
        <form method="POST" action="/login">
            <input type="text" name="login" placeholder="Login" required>
            <input type="password" name="password" placeholder="Mot de passe" required>
            <button type="submit">Se connecter</button>
        </form>
        <p>Pas encore de compte? <a href="/register">S'inscrire</a></p>
        <p><a href="/">Retour à l'accueil</a></p>
    </div>
</body>
</html>`;
        
        response.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
        response.write(html);
        response.end();
    }
}

// Handler pour la déconnexion
function logout(response, request) {
    console.log("Request handler 'logout' was called.");
    
    var session = getSession(request);
    
    if (session) {
        // Supprimer la session
        var cookies = {};
        if (request.headers.cookie) {
            request.headers.cookie.split(';').forEach(function(cookie) {
                var parts = cookie.trim().split('=');
                cookies[parts[0]] = parts[1];
            });
        }
        if (cookies.sessionId) {
            delete sessions[cookies.sessionId];
        }
    }
    
    response.writeHead(200, {
        "Content-Type": "text/html; charset=utf-8",
        "Set-Cookie": "sessionId=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT"
    });
    response.write("<html><body><h1>👋 Déconnexion réussie</h1>");
    response.write("<p>Vous avez été déconnecté avec succès.</p>");
    response.write("<a href='/'>Retour à l'accueil</a></body></html>");
    response.end();
}

// Handler pour l'upload de fichier
function upload(response, request) {
    console.log("Request handler 'upload' was called.");
    
    var session = getSession(request);
    
    if (!session) {
        response.writeHead(401, {"Content-Type": "text/html; charset=utf-8"});
        response.write("<html><body><h1>❌ Non autorisé</h1>");
        response.write("<p>Vous devez être connecté pour uploader une image.</p>");
        response.write("<a href='/login'>Se connecter</a></body></html>");
        response.end();
        return;
    }
    
    if (request.method === 'POST') {
        var form = new formidable.IncomingForm();
        form.uploadDir = "./uploads";
        
        form.parse(request, function(error, fields, files) {
            if (error) {
                console.error("Error parsing form:", error);
                response.writeHead(500, {"Content-Type": "text/html; charset=utf-8"});
                response.write("<html><body><h1>Erreur</h1><p>Erreur lors de l'upload.</p></body></html>");
                response.end();
                return;
            }
            
            // Sauvegarder le chemin de l'image pour l'utilisateur
            var user = users.find(u => u.login === session.username);
            if (user && files.upload) {
                user.profileImage = files.upload[0].filepath;
                console.log("Image uploaded for user:", user.login);
            }
            
            response.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
            response.write("<html><body><h1>✅ Image uploadée!</h1>");
            response.write("<p>Votre image de profil a été enregistrée.</p>");
            response.write("<a href='/show'>Voir l'image</a> | <a href='/'>Accueil</a></body></html>");
            response.end();
        });
    } else {
        var html = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Upload d'image</title>
    <style>
        body { font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px; }
        .form-container { max-width: 500px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; }
        h1 { color: #667eea; }
        input[type="file"] { margin: 20px 0; }
        button { background: #667eea; color: white; padding: 12px 30px; border: none; border-radius: 5px; cursor: pointer; }
        button:hover { background: #764ba2; }
    </style>
</head>
<body>
    <div class="form-container">
        <h1>📤 Upload d'image de profil</h1>
        <form method="POST" action="/upload" enctype="multipart/form-data">
            <input type="file" name="upload" accept="image/*" required>
            <br>
            <button type="submit">Uploader</button>
        </form>
        <p><a href="/">Retour à l'accueil</a></p>
    </div>
</body>
</html>`;
        
        response.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
        response.write(html);
        response.end();
    }
}

// Handler pour afficher l'image
function show(response, request) {
    console.log("Request handler 'show' was called.");
    
    var session = getSession(request);
    
    if (!session) {
        response.writeHead(401, {"Content-Type": "text/html; charset=utf-8"});
        response.write("<html><body><h1>❌ Non autorisé</h1>");
        response.write("<p>Vous devez être connecté.</p>");
        response.write("<a href='/login'>Se connecter</a></body></html>");
        response.end();
        return;
    }
    
    var user = users.find(u => u.login === session.username);
    
    if (user && user.profileImage && fs.existsSync(user.profileImage)) {
        fs.readFile(user.profileImage, "binary", function(error, file) {
            if (error) {
                response.writeHead(500, {"Content-Type": "text/plain"});
                response.write("Erreur lors de la lecture de l'image");
                response.end();
            } else {
                response.writeHead(200, {"Content-Type": "image/png"});
                response.write(file, "binary");
                response.end();
            }
        });
    } else {
        response.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
        response.write("<html><body><h1>📷 Aucune image</h1>");
        response.write("<p>Vous n'avez pas encore uploadé d'image.</p>");
        response.write("<a href='/upload'>Uploader une image</a></body></html>");
        response.end();
    }
}

// Handler pour trouver/lister les fichiers
function find(response, request) {
    console.log("Request handler 'find' was called.");
    
    var session = getSession(request);
    
    if (!session) {
        response.writeHead(401, {"Content-Type": "text/html; charset=utf-8"});
        response.write("<html><body><h1>❌ Non autorisé</h1>");
        response.write("<p>Vous devez être connecté.</p>");
        response.write("<a href='/login'>Se connecter</a></body></html>");
        response.end();
        return;
    }
    
    // Lister les fichiers du répertoire courant de manière sécurisée
    exec("ls -la", { timeout: 5000 }, function(error, stdout, stderr) {
        if (error) {
            response.writeHead(500, {"Content-Type": "text/html; charset=utf-8"});
            response.write("<html><body><h1>Erreur</h1><pre>" + error + "</pre></body></html>");
            response.end();
        } else {
            response.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
            response.write("<html><head><meta charset='UTF-8'><title>Fichiers</title>");
            response.write("<style>body{font-family:monospace;padding:20px;background:#f5f5f5;}</style></head>");
            response.write("<body><h1>🔍 Liste des fichiers</h1>");
            response.write("<pre>" + stdout + "</pre>");
            response.write("<a href='/'>Retour à l'accueil</a></body></html>");
            response.end();
        }
    });
}

exports.start = start;
exports.register = register;
exports.login = login;
exports.logout = logout;
exports.upload = upload;
exports.show = show;
exports.find = find;
