/**
 * uiHandler.js
 * - Fungsi-fungsi helper untuk rendering dan UI messages.
 * - renderMahasiswaTable, showMessage, clearForm, fillFormForEdit, showLoading/hideLoading
 */

/**
 * showMessage
 * Menampilkan alert Bootstrap di #alertContainer
 * @param {'success'|'danger'|'info'} type
 * @param {string} message
 * @param {number} timeoutMs - jika di set, alert otomatis hilang
 */
function showMessage(type, message, timeoutMs = 4000) {
  const container = document.getElementById('alertContainer');
  if (!container) return;
  const id = `alert-${Date.now()}`;
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
    <div id="${id}" class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`;
  container.appendChild(wrapper);

  if (timeoutMs > 0) {
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        // bootstrap fade out
        el.classList.remove('show');
        el.classList.add('hide');
        el.remove();
      }
    }, timeoutMs);
  }
}

/**
 * clearForm - reset semua input di form Input Nilai
 */
function clearForm() {
  const form = document.getElementById('formInputNilai');
  if (!form) return;
  form.reset();
  const editId = document.getElementById('editId');
  if (editId) editId.value = '';
}

/**
 * fillFormForEdit - isi form dengan data mahasiswa untuk edit
 * @param {Object} mahasiswa - {id, nim, nama, mataKuliah, nilai}
 */
function fillFormForEdit(mahasiswa) {
  const nama = document.getElementById('nama');
  const nim = document.getElementById('nim');
  const mataKuliah = document.getElementById('mataKuliah');
  const nilai = document.getElementById('nilai');
  const editId = document.getElementById('editId');

  if (nama) nama.value = mahasiswa.nama || '';
  if (nim) nim.value = mahasiswa.nim || '';
  if (mataKuliah) mataKuliah.value = mahasiswa.mataKuliah || '';
  if (nilai) nilai.value = mahasiswa.nilai || '';
  if (editId) editId.value = mahasiswa.id || '';
  showMessage('info', 'Mode edit: lakukan perubahan lalu tekan "Simpan Data" untuk memperbarui.', 5000);
}

/**
 * renderMahasiswaTable - render array data ke tabel di lihat-data.html
 * @param {Array<Object>} dataArray - array of mahasiswa objects
 * @param {Function} onEdit - callback(id) when edit clicked
 * @param {Function} onDelete - callback(id) when delete clicked
 */
function renderMahasiswaTable(dataArray = [], onEdit = () => {}, onDelete = () => {}) {
  const tbody = document.querySelector('#tblMahasiswa tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  dataArray.forEach((item, index) => {
    const tanggal = item.createdAt && item.createdAt.toDate ? item.createdAt.toDate().toLocaleString() : (item.createdAt || '');
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${item.nim || ''}</td>
      <td>${item.nama || ''}</td>
      <td>${item.mataKuliah || ''}</td>
      <td>${item.nilai ?? ''}</td>
      <td>${tanggal}</td>
      <td>
        <button class="btn btn-sm btn-outline-primary btn-edit" data-id="${item.id}">Edit</button>
        <button class="btn btn-sm btn-outline-danger btn-delete" data-id="${item.id}">Delete</button>
      </td>
    `;

    tbody.appendChild(tr);
  });

  // attach events for edit/delete
  tbody.querySelectorAll('.btn-edit').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      onEdit(id);
    });
  });

  tbody.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      onDelete(id);
    });
  });
}

/**
 * showLoading / hideLoading - for lihat-data page
 */
function showLoading() {
  const el = document.getElementById('loadingIndicator');
  if (el) el.style.display = 'block';
}
function hideLoading() {
  const el = document.getElementById('loadingIndicator');
  if (el) el.style.display = 'none';
}

export {
  showMessage,
  clearForm,
  fillFormForEdit,
  renderMahasiswaTable,
  showLoading,
  hideLoading
};
