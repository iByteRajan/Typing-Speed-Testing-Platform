console.log("auth.js loaded");

window.addEventListener('load', function () {

    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    }
});

function signup() {
    const email = document.getElementById("email").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;

            // Save username to Firestore
            return db.collection("users").doc(user.uid).set({
                email: email,
                username: username,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        })

        .then(() => {
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

window.signup = signup;
window.login = login;
window.logout = logout;

window.addEventListener("load", function () {
    const user = firebase.auth().currentUser;

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            const userId = user.uid;

            db.collection("users").doc(userId).get().then((doc) => {
                if (doc.exists) {
                    const username = doc.data().username;
                    const usernameText = document.querySelector(".username-text");
                    if (usernameText) {
                        usernameText.textContent = username;
                    }
                } else {
                    console.log("No such user document!");
                }
            }).catch((error) => {
                console.error("Error getting user document:", error);
            });
        } else {
            // No user is signed in
            window.location.href = "signUpPage.html"; // redirect to login/signup if not logged in
        }
    });
});
