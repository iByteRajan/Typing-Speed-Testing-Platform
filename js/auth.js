let auth;

window.addEventListener('load', function() { 
    auth = firebase.auth();

    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    }
});

function signup() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            window.location.href = "landingPage.html"; 
        })
        .catch((error) => {
            document.getElementById("msg").innerText = error.message;
        });
}

function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            window.location.href = "landingPage.html";
        })
        .catch((error) => {
            document.getElementById("msg").innerText = error.message;
        });
}

function logout() {
    if (confirm("Are you sure you want to logout?")) {
        auth.signOut()
        .then(() => {
            window.location.href = "signUpPage.html";
        })
        .catch((error) => {
            console.log(error.message);
        });
    }
}
