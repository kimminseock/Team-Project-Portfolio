// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAgOIRcTNcFd3j4sFAfGoQpuzI6ei68kYQ",
    authDomain: "js-sample-a8601.firebaseapp.com",
    databaseURL: "https://js-sample-a8601-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "js-sample-a8601",
    storageBucket: "js-sample-a8601.firebasestorage.app",
    messagingSenderId: "96991964334",
    appId: "1:96991964334:web:c9e0e7a0ab36ffc232d13f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;