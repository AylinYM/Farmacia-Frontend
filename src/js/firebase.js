import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBc_xursIiFgTAHljBbBssevujiO5orB5k",
    authDomain: "aylinyapm.firebaseapp.com",
    projectId: "aylinyapm",
    storageBucket: "aylinyapm.firebasestorage.app",
    messagingSenderId: "598837550790",
    appId: "1:598837550790:web:4a726c46c55057ef9b01c7"
  };

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);