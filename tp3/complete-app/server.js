var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

// Route principale
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Gestion des connexions Socket.io
io.on('connection', function(socket) {
    console.log('Client connecté:', socket.id);

    socket.on('create or join', function(room) {
        console.log('Demande de création/jonction de canal:', room);
        var clientsInRoom = io.sockets.adapter.rooms.get(room);
        var numClients = clientsInRoom ? clientsInRoom.size : 0;

        console.log('Nombre de clients dans le canal ' + room + ':', numClients);

        if (numClients === 0) {
            socket.join(room);
            console.log('Client ' + socket.id + ' a créé le canal ' + room);
            socket.emit('created', room);
        } else if (numClients === 1) {
            console.log('Client ' + socket.id + ' a rejoint le canal ' + room);
            socket.join(room);
            socket.emit('joined', room);
            io.to(room).emit('ready');
        } else {
            console.log('Canal ' + room + ' est plein');
            socket.emit('full', room);
        }
    });

    socket.on('message', function(message) {
        console.log('Message reçu:', message.type || message);
        socket.broadcast.emit('message', message);
    });

    socket.on('disconnect', function() {
        console.log('Client déconnecté:', socket.id);
    });
});

// Démarrer le serveur
var PORT = process.env.PORT || 3000;
http.listen(PORT, function() {
    console.log('╔════════════════════════════════════════════╗');
    console.log('║   Serveur WebRTC démarré avec succès!     ║');
    console.log('╠════════════════════════════════════════════╣');
    console.log('║  URL: http://localhost:' + PORT + '               ║');
    console.log('║  Socket.io: Actif                          ║');
    console.log('║  Signalisation: Opérationnelle             ║');
    console.log('╚════════════════════════════════════════════╝');
    console.log('');
    console.log('Ouvrez l\'URL dans deux navigateurs différents');
    console.log('pour tester la communication P2P');
    console.log('');
});
