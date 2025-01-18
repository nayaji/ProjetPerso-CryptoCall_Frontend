const phoneNumbers = {
    "FR": {
        "call": "0123456784", // Numéro pour l'appel en France
        "sms": "CODE au 0000"   // Numéro pour les SMS en France
    },
    "BE": {
        "call": "012345678", // Numéro pour l'appel
        "sms": "CODE au 0000"   // Numéro pour les SMS
    },
    "ES": {
        "call": "012345678", // Numéro pour l'appel en Espagne
        "sms": "CODE au 0000"   // Numéro pour les SMS en Espagne
    }
    // Ajoute d'autres pays et numéros ici si nécessaire
};

function showPhoneNumber() {
    const country = document.getElementById('countrySelect').value;
    const method = document.getElementById('methodSelect').value;
    const phoneNumberDisplay = document.getElementById('phoneNumberDisplay');
    const phoneNumber = document.getElementById('phoneNumber');

    // Si un pays et une méthode sont sélectionnés, affiche le numéro
    if (country && method && phoneNumbers[country] && phoneNumbers[country][method]) {
        phoneNumberDisplay.style.display = 'block';
        phoneNumber.textContent = phoneNumbers[country][method]; // Affiche le numéro selon la méthode
    } else {
        phoneNumberDisplay.style.display = 'none'; // Cache la section si aucune méthode ou pays n'est sélectionné
    }
}

function submitVerificationCode() {
    const verificationCode = document.getElementById('verificationCode').value;
    const country = document.getElementById('countrySelect').value;

    // Vérifie que le code est bien entré et que le pays est sélectionné
    if (!verificationCode || !country) {
        alert("Veuillez sélectionner un pays et entrer le code de vérification.");
        return;
    }

    // Effectuer l'appel API pour envoyer le code et enregistrer dans la base de données
    fetch('https://rich-anemone-ideal.ngrok-free.app/verify', { // Remplace l'URL par celle de ton API
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            phantom_address: "Adresse_Phantom", // Remplace avec l'adresse Phantom de l'utilisateur
            verification_code: verificationCode,
            country: country
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Code envoyé et enregistré avec succès!");
            window.location.href = "dashboard.html"; // Redirection vers la page dashboard.html
        } else {
            alert("Une erreur est survenue lors de l'enregistrement du code.");
        }
    })
    .catch(error => {
        console.error("Erreur lors de l'envoi du code:", error);
        alert("Une erreur est survenue lors de l'envoi du code.");
    });
}
