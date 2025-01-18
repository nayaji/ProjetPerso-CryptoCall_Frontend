// Vérifie si Phantom est installé
function isPhantomInstalled() {
    return typeof window.solana !== "undefined" && window.solana.isPhantom;
}

// Fonction pour se connecter à Phantom
async function connectToPhantom() {
    if (isPhantomInstalled()) {
        try {
            // Demande la connexion au portefeuille
            const response = await window.solana.connect();
            const publicKey = response.publicKey.toString();
            console.log("Connecté avec l'adresse :", publicKey);

            // Sauvegarde l'état de connexion
            sessionStorage.setItem("phantomConnected", true);
            sessionStorage.setItem("phantomAddress", publicKey);

            // Envoi de la clé publique au serveur
            await sendPublicKeyToServer(publicKey);

            // Redirection vers la page sécurisée
            window.location.href = "dashboard.html";
        } catch (err) {
            console.error("Connexion échouée :", err);
        }
    } else {
        // Redirection vers la page d'installation de Phantom
        window.location.href = "https://phantom.app/";
    }
}

// Fonction pour envoyer la clé publique au serveur
async function sendPublicKeyToServer(publicKey) {
    try {
        console.log("Envoi de la clé publique au serveur :", publicKey);
        const response = await fetch('https://rich-anemone-ideal.ngrok-free.app/save-public-key', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ publicKey }),
        });

        // Récupère la réponse brute du serveur
        const rawResponse = await response.text();
        console.log("Réponse brute du serveur :", rawResponse);

        // Tente de parser la réponse en JSON
        let result;
        try {
            result = JSON.parse(rawResponse);
        } catch (parseError) {
            console.error("Réponse non-JSON reçue :", rawResponse);
            throw new Error("La réponse du serveur n'est pas au format JSON.");
        }

        // Si la réponse est correcte
        if (response.ok) {
            console.log("Clé publique enregistrée avec succès :", result);

            // Stocke l'ID utilisateur dans le localStorage
            const id = result.id; // Assurez-vous que votre backend renvoie un champ `id`
            localStorage.setItem('userId', id);
        } else {
            console.error("Erreur lors de l'enregistrement :", result.error);
        }
    } catch (error) {
        console.error("Erreur de connexion avec le serveur :", error);
    }
}

// Attacher l'événement au bouton
document.getElementById("connectButton").addEventListener("click", connectToPhantom);

// Vérifie si l'utilisateur est déjà connecté
window.onload = function () {
    if (sessionStorage.getItem("phantomConnected")) {
        window.location.href = "dashboard.html"; // Redirection si déjà connecté
    }
};
