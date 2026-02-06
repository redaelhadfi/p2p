// Variables globales
var localVideo = document.getElementById('localVideo');
var remoteVideo = document.getElementById('remoteVideo');
var startButton = document.getElementById('startButton');
var callButton = document.getElementById('callButton');
var hangupButton = document.getElementById('hangupButton');
var muteAudioButton = document.getElementById('muteAudioButton');
var muteVideoButton = document.getElementById('muteVideoButton');
var chatInput = document.getElementById('chatInput');
var sendMessageButton = document.getElementById('sendMessageButton');
var chatMessages = document.getElementById('chatMessages');
var logsConsole = document.getElementById('logsConsole');
var clearLogsButton = document.getElementById('clearLogsButton');
var statusText = document.getElementById('statusText');
var statusIndicator = document.getElementById('statusIndicator');
var channelInfo = document.getElementById('channelInfo');

var localStream;
var remoteStream;
var peerConnection;
var dataChannel;
var socket;
var channel;
var isInitiator = false;
var isAudioMuted = false;
var isVideoMuted = false;

// Configuration ICE avec serveurs STUN
var pcConfig = {
    iceServers: [
        {urls: 'stun:stun.l.google.com:19302'},
        {urls: 'stun:stun1.l.google.com:19302'}
    ]
};

// Event listeners
startButton.onclick = start;
callButton.onclick = call;
hangupButton.onclick = hangup;
muteAudioButton.onclick = toggleAudio;
muteVideoButton.onclick = toggleVideo;
sendMessageButton.onclick = sendChatMessage;
clearLogsButton.onclick = clearLogs;

chatInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !chatInput.disabled) {
        sendChatMessage();
    }
});

// Fonction de logging
function log(message, type = 'info') {
    var timestamp = new Date().toLocaleTimeString();
    var logEntry = document.createElement('div');
    logEntry.className = 'log-entry log-' + type;
    logEntry.textContent = '[' + timestamp + '] ' + message;
    logsConsole.appendChild(logEntry);
    logsConsole.scrollTop = logsConsole.scrollHeight;
    console.log(message);
}

function clearLogs() {
    logsConsole.innerHTML = '';
}

function updateStatus(status, text) {
    statusIndicator.className = 'status-' + status;
    statusText.textContent = text;
}

// Démarrer l'application
function start() {
    log('Demande d\'accès aux périphériques média...', 'info');
    startButton.disabled = true;
    
    // Connexion au serveur de signalisation
    connectToSignalingServer();
    
    // Obtenir les flux média locaux
    navigator.mediaDevices.getUserMedia({
        audio: true,
        video: {
            width: { ideal: 1280 },
            height: { ideal: 720 }
        }
    })
    .then(gotStream)
    .catch(function(error) {
        log('getUserMedia error: ' + error.message, 'error');
        alert('Erreur d\'accès à la caméra/microphone: ' + error.message);
        startButton.disabled = false;
    });
}

function gotStream(stream) {
    log('Flux média local obtenu avec succès', 'success');
    localStream = stream;
    localVideo.srcObject = stream;
    callButton.disabled = false;
    muteAudioButton.disabled = false;
    muteVideoButton.disabled = false;
    updateStatus('connected', 'Média capturé - Prêt à appeler');
}

function connectToSignalingServer() {
    socket = io.connect('http://localhost:3000');
    
    channel = prompt('Entrez le nom du canal:');
    if (channel !== "" && channel !== null) {
        log('Tentative de connexion au canal: ' + channel, 'info');
        socket.emit('create or join', channel);
        channelInfo.textContent = 'Canal: ' + channel;
    }
    
    socket.on('created', function(room) {
        log('Canal ' + room + ' créé - En attente d\'un pair...', 'success');
        isInitiator = true;
        updateStatus('connected', 'Initiateur - En attente');
    });
    
    socket.on('joined', function(room) {
        log('Vous avez rejoint le canal ' + room, 'success');
        isInitiator = false;
        updateStatus('connected', 'Connecté au canal');
    });
    
    socket.on('full', function(room) {
        log('Le canal ' + room + ' est plein!', 'error');
        alert('Le canal est plein! Choisissez un autre nom.');
    });
    
    socket.on('ready', function() {
        log('Canal prêt pour l\'établissement de la connexion P2P', 'success');
        if (isInitiator) {
            call();
        }
    });
    
    socket.on('message', function(message) {
        log('Message reçu du serveur de signalisation', 'info');
        if (message.type === 'offer') {
            log('Offre SDP reçue', 'info');
            if (!isInitiator) {
                createPeerConnection();
            }
            peerConnection.setRemoteDescription(new RTCSessionDescription(message));
            peerConnection.createAnswer()
                .then(setLocalAndSendMessage)
                .catch(onSignalingError);
        } else if (message.type === 'answer') {
            log('Réponse SDP reçue', 'info');
            peerConnection.setRemoteDescription(new RTCSessionDescription(message));
        } else if (message.type === 'candidate') {
            log('Candidat ICE reçu', 'info');
            var candidate = new RTCIceCandidate({
                sdpMLineIndex: message.label,
                candidate: message.candidate
            });
            peerConnection.addIceCandidate(candidate);
        }
    });
}

function call() {
    log('Démarrage de l\'appel...', 'info');
    callButton.disabled = true;
    hangupButton.disabled = false;
    
    createPeerConnection();
    
    if (isInitiator) {
        log('Création de l\'offre SDP...', 'info');
        peerConnection.createOffer()
            .then(setLocalAndSendMessage)
            .catch(onSignalingError);
    }
}

function createPeerConnection() {
    try {
        peerConnection = new RTCPeerConnection(pcConfig);
        peerConnection.onicecandidate = handleIceCandidate;
        peerConnection.ontrack = handleRemoteStreamAdded;
        peerConnection.onremovestream = handleRemoteStreamRemoved;
        log('RTCPeerConnection créée avec configuration ICE', 'success');
        
        // Ajouter le flux local
        localStream.getTracks().forEach(track => {
            peerConnection.addTrack(track, localStream);
        });
        log('Flux local ajouté à la PeerConnection', 'info');
        
        // Créer le DataChannel pour le chat
        if (isInitiator) {
            createDataChannel();
        } else {
            peerConnection.ondatachannel = receiveDataChannel;
        }
        
    } catch (error) {
        log('Erreur lors de la création de PeerConnection: ' + error.message, 'error');
    }
}

function createDataChannel() {
    try {
        dataChannel = peerConnection.createDataChannel('chat');
        setupDataChannel();
        log('DataChannel créé', 'success');
    } catch (error) {
        log('Erreur lors de la création du DataChannel: ' + error.message, 'error');
    }
}

function receiveDataChannel(event) {
    log('DataChannel reçu', 'success');
    dataChannel = event.channel;
    setupDataChannel();
}

function setupDataChannel() {
    dataChannel.onopen = function() {
        log('DataChannel ouvert - Chat disponible', 'success');
        chatInput.disabled = false;
        sendMessageButton.disabled = false;
    };
    
    dataChannel.onclose = function() {
        log('DataChannel fermé', 'warning');
        chatInput.disabled = true;
        sendMessageButton.disabled = true;
    };
    
    dataChannel.onmessage = function(event) {
        displayChatMessage(event.data, false);
    };
}

function sendChatMessage() {
    var message = chatInput.value.trim();
    if (message && dataChannel && dataChannel.readyState === 'open') {
        dataChannel.send(message);
        displayChatMessage(message, true);
        chatInput.value = '';
        log('Message envoyé: ' + message, 'info');
    }
}

function displayChatMessage(message, isSent) {
    var messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message ' + (isSent ? 'message-sent' : 'message-received');
    
    var messageText = document.createElement('div');
    messageText.textContent = message;
    
    var messageTime = document.createElement('div');
    messageTime.className = 'message-time';
    messageTime.textContent = new Date().toLocaleTimeString();
    
    messageDiv.appendChild(messageText);
    messageDiv.appendChild(messageTime);
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function setLocalAndSendMessage(sessionDescription) {
    peerConnection.setLocalDescription(sessionDescription);
    log('Description locale définie', 'info');
    sendMessage(sessionDescription);
}

function sendMessage(message) {
    log('Envoi du message au serveur de signalisation', 'info');
    socket.emit('message', message);
}

function handleIceCandidate(event) {
    if (event.candidate) {
        log('Candidat ICE trouvé', 'info');
        sendMessage({
            type: 'candidate',
            label: event.candidate.sdpMLineIndex,
            id: event.candidate.sdpMid,
            candidate: event.candidate.candidate
        });
    } else {
        log('Collecte des candidats ICE terminée', 'success');
    }
}

function handleRemoteStreamAdded(event) {
    log('Flux distant ajouté', 'success');
    remoteVideo.srcObject = event.streams[0];
    remoteStream = event.streams[0];
    updateStatus('connected', 'Appel en cours');
}

function handleRemoteStreamRemoved(event) {
    log('Flux distant supprimé', 'warning');
    remoteVideo.srcObject = null;
}

function hangup() {
    log('Fermeture de la connexion...', 'info');
    stop();
    sendMessage({type: 'bye'});
}

function stop() {
    if (peerConnection) {
        peerConnection.close();
        peerConnection = null;
    }
    
    if (dataChannel) {
        dataChannel.close();
        dataChannel = null;
    }
    
    hangupButton.disabled = true;
    callButton.disabled = false;
    chatInput.disabled = true;
    sendMessageButton.disabled = true;
    updateStatus('disconnected', 'Déconnecté');
    log('Connexion fermée', 'success');
}

function toggleAudio() {
    if (localStream) {
        isAudioMuted = !isAudioMuted;
        localStream.getAudioTracks()[0].enabled = !isAudioMuted;
        muteAudioButton.textContent = isAudioMuted ? '🔊 Activer Audio' : '🔇 Muet';
        log('Audio ' + (isAudioMuted ? 'désactivé' : 'activé'), 'info');
    }
}

function toggleVideo() {
    if (localStream) {
        isVideoMuted = !isVideoMuted;
        localStream.getVideoTracks()[0].enabled = !isVideoMuted;
        muteVideoButton.textContent = isVideoMuted ? '📹 Activer Vidéo' : '🚫 Arrêter Vidéo';
        log('Vidéo ' + (isVideoMuted ? 'désactivée' : 'activée'), 'info');
    }
}

function onSignalingError(error) {
    log('Erreur de signalisation: ' + error.message, 'error');
}

// Gestion de la fermeture de la fenêtre
window.onbeforeunload = function() {
    if (peerConnection) {
        hangup();
    }
};
