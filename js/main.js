/**
 * main.js
 * - Entry point for both index.html and lihat-data.html
 * - Menghubungkan modul: firebaseConfig (via dataService), dataService, validation, uiHandler
 *
 * Event wiring:
 * - index.html: btnSimpan -> handleSave (simpan atau update)
 * - lihat-data.html: DOMContentLoaded -> loadData(), btnRefresh -> loadData()
 *
 * Pastikan file ini dimuat sebagai <script type="module" src="/js/main.js"></script>
 */

import { createMahasiswa, getAllMahasiswa, updateMahasiswa, deleteMahasiswa } from "./dataService.js";
import { validasiInput } from "./validation.js";
import {
  showMessage,
  clearForm,
  fillFormForEdit,
  renderMahasiswaTable,
  showLoading,
  hideLoading
} from "./uiHandler.js";

/**
 * handleSave - event saat user klik tombol Simpan Data
 * Urutan logika:
 * 1. Ambil nilai form
 * 2. validasiInput()
 * 3. jika gagal -> tampilkan pesan "Simpan data gagal: <alasan>"
 * 4. jika berhasil -> jika editId kosong -> createMahasiswa(), else updateMahasiswa()
 * 5. jika sukses -> showMessage('success','Data berhasil disimpan'), clearForm(), (opsional) redirect/refresh daftar
 */
async function handleSave(event) {
  const btn = document.getElementById('btnSimpan');
  if (btn) btn.disabled = true;

  try {
    const nama = document.getElementById('nama')?.value ?? '';
    const nim = document.getElementById('nim')?.value ?? '';
    const mataKuliah = document.getElementById('mataKuliah')?.value ?? '';
    const nilai = document.getElementById('nilai')?.value ?? '';
    const editId = document.getElementById('editId')?.value ?? '';

    // Validasi
    const validation = validasiInput({ nim, nama, mataKuliah, nilai });
    if (!validation.valid) {
      showMessage('danger', `Simpan data gagal: ${validation.message}`, 6000);
      return;
    }

    // Prepare payload
    const payload = { nim: nim.trim(), nama: nama.trim(), mataKuliah: mataKuliah.trim(), nilai: Number(nilai) };

    if (editId && editId.trim() !== '') {
      // Update
      const res = await updateMahasiswa(editId, payload);
      if (res.success) {
        showMessage('success', 'Data berhasil disimpan (diupdate).', 4000);
        clearForm();
        // optional: refresh lihat-data page if open
      } else {
        showMessage('danger', `Simpan data gagal: ${res.error?.message || res.error}`, 6000);
      }
    } else {
      // Create
      const res = await createMahasiswa(payload);
      if (res.success) {
        showMessage('success', 'Data berhasil disimpan', 4000);
        clearForm();
      } else {
        showMessage('danger', `Simpan data gagal: ${res.error?.message || res.error}`, 6000);
      }
    }
  } catch (err) {
    showMessage('danger', `Simpan data gagal: ${err.message || err}`, 8000);
  } finally {
    if (btn) btn.disabled = false;
  }
}

/**
 * loadData - load data mahasiswa dari Firestore dan render di tabel.
 * Juga menangani events edit/delete yang memanggil dataService.
 */
async function loadData() {
  // show loader if available
  showLoading();
  try {
    const res = await getAllMahasiswa();
    if (!res.success) {
      showMessage('danger', `Gagal memuat data: ${res.error?.message || res.error}`, 6000);
      return;
    }

    // res.data is array
    const dataArray = res.data.map(item => {
      // Note: createdAt could be timestamp or undefined for very recent writes that haven't resolved timestamp
      return item;
    });

    // Render table with callbacks for edit & delete
    renderMahasiswaTable(dataArray, async (id) => {
      // edit callback: fetch item from array and fill form on index.html if present
      const found = dataArray.find(d => d.id === id);
      if (!found) {
        showMessage('danger', 'Data untuk edit tidak ditemukan', 4000);
        return;
      }

      // If user is on lihat-data.html but wants to edit via index.html, redirect
      if (location.pathname.endsWith('lihat-data.html')) {
        // Navigate to index and prefill using sessionStorage for simplicity
        sessionStorage.setItem('editMahasiswa', JSON.stringify(found));
        location.href = 'index.html';
        return;
      }

      // If on same page (single page), fill form
      fillFormForEdit(found);
    }, async (id) => {
      // delete callback
      const confirmed = confirm('Apakah Anda yakin ingin menghapus data ini?');
      if (!confirmed) return;
      const delRes = await deleteMahasiswa(id);
      if (delRes.success) {
        showMessage('success', 'Data berhasil dihapus.', 3500);
        // reload table
        await loadData();
      } else {
        showMessage('danger', `Gagal menghapus data: ${delRes.error?.message || delRes.error}`, 6000);
      }
    });

  } catch (err) {
    showMessage('danger', `Gagal memuat data: ${err.message || err}`, 6000);
  } finally {
    hideLoading();
  }
}

/**
 * onDomReady - attach event listeners depending on which page is loaded
 */
function onDomReady() {
  // If index.html
  const btnSimpan = document.getElementById('btnSimpan');
  if (btnSimpan) {
    btnSimpan.addEventListener('click', handleSave);

    // If we came from lihat-data edit action via sessionStorage, fill form
    const stored = sessionStorage.getItem('editMahasiswa');
    if (stored) {
      try {
        const obj = JSON.parse(stored);
        fillFormForEdit(obj);
      } catch (e) {
        // ignore
      } finally {
        sessionStorage.removeItem('editMahasiswa');
      }
    }
  }

  // If lihat-data.html
  const btnRefresh = document.getElementById('btnRefresh');
  if (btnRefresh) {
    btnRefresh.addEventListener('click', loadData);
  }

  // If there is table on page, load data
  if (document.querySelector('#tblMahasiswa')) {
    loadData();
  }
}

// init
window.addEventListener('DOMContentLoaded', onDomReady);
