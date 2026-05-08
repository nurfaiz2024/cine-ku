/* =====================================================
   Cine-ku — Firebase initialization (modular SDK v10)
   -----------------------------------------------------
   GANTI firebaseConfig dengan config milik project Firebase kamu.
   Cara dapat config:
     1. https://console.firebase.google.com
     2. Buat project baru -> tambah Web App (</>)
     3. Salin firebaseConfig di bawah ini
     4. Authentication -> Sign-in method -> aktifkan Google
   ===================================================== */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCKWHFKdme0kgHKIas9sR5pasLaeFkdTfQ",
  authDomain: "cine-ku.firebaseapp.com",
  projectId: "cine-ku",
  storageBucket: "cine-ku.firebasestorage.app",
  messagingSenderId: "224144669399",
  appId: "1:224144669399:web:e7744fe276259bceffce92",
  measurementId: "G-5D4VE7ZYS6"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Expose ke modul lain
window.cineFirebase = { app, auth, googleProvider };
