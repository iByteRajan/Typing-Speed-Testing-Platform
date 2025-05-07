const firebaseConfig = {
    apiKey: "AIzaSyDNIwlP0xAT-alHTMA2bJRPBG0X6lrH1Rg",
    authDomain: "typing-speed-testing-platform.firebaseapp.com",
    projectId: "typing-speed-testing-platform",
    storageBucket: "typing-speed-testing-platform.firebasestorage.app",
    messagingSenderId: "776597539637",
    appId: "1:776597539637:web:178a960b9da94892a61a7c"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
console.log("Firebase initialized");
const db = firebase.firestore();
const auth = firebase.auth();

window.auth = auth;
window.db = db;