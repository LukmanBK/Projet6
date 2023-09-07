// Formulaire de connexion
document.querySelector(".form").addEventListener("submit", function (event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const user = {
    email: email,
    password: password,
  };

  // On réalise une requête POST vers l'API de connexion avec les informations utilisateur
  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((response) => {
      return response.json();
    })

    // Traitement du token d'authentification et gestion des messages d'erreur
    .then((data) => {
      console.log(data);
      const token = data.token;
      const wrongEmail = document.querySelector(".wrongEmail");
      const wrongPassword = document.querySelector(".wrongPassword");
      const existingWrongEmailMessage =
        wrongEmail.querySelector(".errorMessage");
      const existingWrongPasswordMessage =
        wrongPassword.querySelector(".errorMessage");

      // On affiche un message d'erreur spécifique si l'email n'est pas validé par le serveur
      if (data.message) {
        if (existingWrongEmailMessage) {
          existingWrongEmailMessage.innerText = "Email non valide";
        } else {
          const invalidEmail = document.createElement("p");
          invalidEmail.classList.add("errorMessage");
          invalidEmail.innerText = "Email non valide";
          wrongEmail.appendChild(invalidEmail);
        }
      } else {
        if (existingWrongEmailMessage) {
          existingWrongEmailMessage.innerText = "";
        }

        // On affiche un message d'erreur spécifique si le mot de passe n'est pas validé par le serveur
        if (data.error) {
          if (existingWrongPasswordMessage) {
            existingWrongPasswordMessage.innerText = "Mot de passe non valide";
          } else {
            const invalidPassword = document.createElement("p");
            invalidPassword.classList.add("errorMessage");
            invalidPassword.innerText = "Mot de passe non valide";
            wrongPassword.appendChild(invalidPassword);
          }
        } else {
          // On stock localement le token pour une utilisation ultérieure
          window.localStorage.setItem("token", token);
          // Redirection vers la page d'accueil si la connexion est confirmée
          window.location.href = "index.html";
        }
      }
    });
});
