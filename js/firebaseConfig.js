/**
 * firebaseConfig.js
 * - Membungkus inisialisasi Firebase (modular Web SDK v9+)
 * - Export: db (Firestore instance)
 *
 * NOTE:
 *  - Ganti placeholder FIREBASE_... dengan nilai dari Firebase Console Anda.
 *  - File ini menggunakan CDN module imports agar cukup bekerja pada static hosting tanpa bundler.
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getFirestore,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

/**
 * GANTI nilai-nilai berikut dengan konfigurasi proyek Firebase Anda.
 * Jangan commit kunci nyata ke repo publik.
 */
const firebaseConfig = {
  apiKey: "AIzaSyC-s_KTkB9FmCup2YR5p6JPie21yH09vCQ",
  authDomain: "input-nilai-rpl.firebaseapp.com",
  projectId: "input-nilai-rpl",
  storageBucket: "input-nilai-rpl.firebasestorage.app",
  messagingSenderId: "22393936717",
  appId: "1:22393936717:web:57c6ca2a9b05fc91803504",
  measurementId: "G-XWKWSD6LSM"
};

// Initialize Firebase app and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * Export db (Firestore instance) dan helper timestamp.
 */
export { db, serverTimestamp };
