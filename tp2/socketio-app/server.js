const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// Base de données en mémoire
let users = [];
let connectedUsers = {};

// Servir les fichiers statiques
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes REST API
app.post('/api/register', (req, res) => {
    const { firstname, lastname, login, password } = req.body;
    
    const existingUser = users.find(u => u.login === login);
    if (existingUser) {
        return res.status(400).json({ error: 'Login déjà existant' });
    }
    
    users.push({ firstname, lastname, login, password });
    console.log('New user registered:', login);
    
    res.json({ success: true, message: 'Inscription réussie' });
});

app.post('/api/login', (req, res) => {
    const { login, password } = req.body;
    
    const user = users.find(u => u.login === login && u.password === password);
    if (!user) {
        return res.status(401).json({ error: 'Identifiants incorrects' });
    }
    
    res.json({ 
        success: true, 
        user: { 
            login: user.login, 
            firstname: user.firstname, 
            lastname: user.lastname 
        } 
    });
});

// Gestion des connexions Socket.io
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    
    // Authentification de l'utilisateur
    socket.on('authenticate', (data) => {
        connectedUsers[socket.id] = data.login;
        socket.broadcast.emit('user-connected', {
            login: data.login,
            totalUsers: Object.keys(connectedUsers).length
        });
        
        // Envoyer la liste des utilisateurs connectés
        io.emit('users-list', Object.values(connectedUsers));
    });
    
    // Message de chat
    socket.on('chat-message', (data) => {
        console.log('Message from', data.user, ':', data.message);
        io.emit('chat-message', {
            user: data.user,
            message: data.message,
            timestamp: new Date().toLocaleTimeString()
        });
    });
    
    // Requête de fichiers
    socket.on('find-files', (data) => {
        const exec = require('child_process').exec;
        exec('ls -la', { timeout: 5000 }, (error, stdout, stderr) => {
            if (error) {
                socket.emit('find-files-result', { error: error.message });
            } else {
                socket.emit('find-files-result', { files: stdout });
            }
        });
    });
    
    // Notification de typage
    socket.on('typing', (data) => {
        socket.broadcast.emit('user-typing', { user: data.user });
    });
    
    socket.on('stop-typing', () => {
        socket.broadcast.emit('user-stop-typing');
    });
    
    // Déconnexion
    socket.on('disconnect', () => {
        const username = connectedUsers[socket.id];
        delete connectedUsers[socket.id];
        
        if (username) {
            console.log('User disconnected:', username);
            socket.broadcast.emit('user-disconnected', {
                login: username,
                totalUsers: Object.keys(connectedUsers).length
            });
            
            io.emit('users-list', Object.values(connectedUsers));
        }
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Socket.io server running on http://localhost:${PORT}`);
});
