// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Replace the following with your app's Firebase project configuration
// You can find this in your Firebase Console: Project Settings > General > Your apps
const firebaseConfig = {
    apiKey: "AIzaSyDXcbEIc5nKTcMw7Fx4AgZIh7t-epZSNmo",
    authDomain: "todo-list-1d61c.firebaseapp.com",
    projectId: "todo-list-1d61c",
    storageBucket: "todo-list-1d61c.firebasestorage.app",
    messagingSenderId: "934985945244",
    appId: "1:934985945244:web:57136d41dcc24e346c9d59",
    measurementId: "G-0GB9CBZT2V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
