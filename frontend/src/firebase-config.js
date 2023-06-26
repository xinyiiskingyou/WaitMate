import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDNdgqTGOb5nrj1-0EMr4bNcoaGpcpxk98",
    authDomain: "waitmate-ba463.firebaseapp.com",
    projectId: "waitmate-ba463",
    storageBucket: "waitmate-ba463.appspot.com",
    messagingSenderId: "631290161826",
    appId: "1:631290161826:web:95fdcaa4ffc306a33745fb",
    measurementId: "G-NR03X95M2H"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);