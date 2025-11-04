/**
 * validation.js
 * - Fungsi validasi input untuk form input nilai.
 * - Mengembalikan object { valid: boolean, message: string }
 */

/**
 * validasiInput
 * @param {Object} param0
 * @param {string} param0.nim
 * @param {string} param0.nama
 * @param {string} param0.mataKuliah
 * @param {any} param0.nilai
 * @returns {{valid:boolean, message:string}}
 */
function validasiInput({ nim, nama, mataKuliah, nilai }) {
  if (!nama || String(nama).trim() === '') {
    return { valid: false, message: 'Nama wajib diisi.' };
  }

  if (!nim || String(nim).trim() === '') {
    return { valid: false, message: 'NIM wajib diisi.' };
  }

  const nimStr = String(nim).trim();
  if (!/^\d+$/.test(nimStr)) {
    return { valid: false, message: 'NIM harus berupa angka.' };
  }

  if (nimStr.length < 5) {
    return { valid: false, message: 'NIM minimal 5 digit.' };
  }

  if (!mataKuliah || String(mataKuliah).trim() === '') {
    return { valid: false, message: 'Mata Kuliah wajib dipilih.' };
  }

  if (nilai === '' || nilai === null || typeof nilai === 'undefined') {
    return { valid: false, message: 'Nilai wajib diisi.' };
  }

  const nilaiNum = Number(nilai);
  if (Number.isNaN(nilaiNum)) {
    return { valid: false, message: 'Nilai harus berupa angka.' };
  }

  if (nilaiNum < 0 || nilaiNum > 100) {
    return { valid: false, message: 'Nilai harus antara 0 sampai 100.' };
  }

  return { valid: true, message: 'Valid' };
}

export { validasiInput };
