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
    let Message = "Login failed. Please check your credentials.";

    if (error.code === 'auth/user-not-found') {
        Message = "No account found with this email.";
    } else if (error.code === 'auth/wrong-password') {
        Message = "Incorrect password. Try again.";
    } else if (error.code === 'auth/invalid-email') {
        Message = "Invalid email format.";
    }

    document.getElementById("msg").innerText = Message;
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

            // Fetching user data from Firestore

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

            // Fetching scores to calculate average WPM

            db.collection("users").doc(userId).collection("scores").get().then((querySnapshot) => {
            let totalWPM = 0;
            let count = 0;

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.wpm !== undefined) {
                    totalWPM += data.wpm;
                    count++;
                }
            });

            const avgWPM = count > 0 ? Math.round(totalWPM / count) : 0;

            const avgWpmText = document.querySelector(".info-button");
            if (avgWpmText) {
                avgWpmText.textContent = `Avg Speed: ${avgWPM} WPM`;
            }
        }).catch((error) => {
            console.error("Error fetching scores:", error);
        });

        }
        else {
            const currentPage = window.location.pathname;
            if (!currentPage.includes("index.html") && !currentPage.includes("signUpPage.html")) {
                window.location.href = "signUpPage.html";
            }
        }
    });
});
