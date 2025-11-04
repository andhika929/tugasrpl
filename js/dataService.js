/**
 * dataService.js
 * - Semua operasi CRUD terhadap Firestore collection "mahasiswa".
 * - Mengembalikan objek { success: boolean, data?, error? }
 */

import { collection, addDoc, getDocs, query, orderBy, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { db, serverTimestamp } from "./firebaseConfig.js";

/**
 * Nama collection di Firestore
 * UPPER_CASE untuk konstanta sesuai aturan.
 */
const COLLECTION_NAME = "mahasiswa";

/**
 * Buat dokumen mahasiswa baru.
 * @param {Object} mahasiswaObj - {nim, nama, mataKuliah, nilai}
 * @returns {Promise<{success:boolean, data?:any, error?:any}>}
 */
async function createMahasiswa(mahasiswaObj) {
  try {
    const colRef = collection(db, COLLECTION_NAME);
    const payload = {
      nim: String(mahasiswaObj.nim),
      nama: String(mahasiswaObj.nama),
      mataKuliah: String(mahasiswaObj.mataKuliah),
      nilai: Number(mahasiswaObj.nilai),
      createdAt: serverTimestamp()
    };
    const docRef = await addDoc(colRef, payload);
    return { success: true, data: { id: docRef.id, ...payload } };
  } catch (error) {
    return { success: false, error };
  }
}

/**
 * Ambil semua dokumen mahasiswa, terurut berdasarkan createdAt (terbaru terakhir).
 * @returns {Promise<{success:boolean, data?:Array, error?:any}>}
 */
async function getAllMahasiswa() {
  try {
    const colRef = collection(db, COLLECTION_NAME);
    // orderBy createdAt ascending (older -> newer). Bisa diubah sesuai kebutuhan.
    const q = query(colRef, orderBy('createdAt', 'asc'));
    const snapshot = await getDocs(q);
    const results = [];
    snapshot.forEach(docSnap => {
      results.push({ id: docSnap.id, ...docSnap.data() });
    });
    return { success: true, data: results };
  } catch (error) {
    return { success: false, error };
  }
}

/**
 * Update mahasiswa by id.
 * @param {string} id
 * @param {Object} updatedObj - fields to update
 * @returns {Promise<{success:boolean, data?:any, error?:any}>}
 */
async function updateMahasiswa(id, updatedObj) {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const payload = { ...updatedObj };
    // Do not modify createdAt here
    await updateDoc(docRef, payload);
    return { success: true, data: { id, ...payload } };
  } catch (error) {
    return { success: false, error };
  }
}

/**
 * Delete mahasiswa by id.
 * @param {string} id
 * @returns {Promise<{success:boolean, error?:any}>}
 */
async function deleteMahasiswa(id) {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
}

export { createMahasiswa, getAllMahasiswa, updateMahasiswa, deleteMahasiswa };
