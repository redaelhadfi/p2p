// Compatibilité multi-navigateurs pour getUserMedia
navigator.getUserMedia = navigator.getUserMedia  
                       || navigator.webkitGetUserMedia 
                       || navigator.mozGetUserMedia;

// Contraintes pour la capture vidéo uniquement
var constraints = {audio: false, video: true};
var video = document.querySelector("video");

// Fonction de succès : afficher le flux vidéo
function successCallback(stream) {
    window.stream = stream;
    if (window.URL) {
        video.srcObject = stream;
    } else {
        video.src = stream;
    }
    video.play();
}

// Fonction d'erreur : afficher l'erreur dans la console
function errorCallback(error) {
    console.log("navigator.getUserMedia error: ", error);
}

// Appel de getUserMedia avec les contraintes
navigator.getUserMedia(constraints, successCallback, errorCallback);
