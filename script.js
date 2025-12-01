const form = document.getElementById('airdropForm');
const tableBody = document.querySelector('#airdropTable');
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modalContent');

const statusOptions = ["Pending", "Claimed", "Expired"];
let editingRow = null; // untuk mode edit

// Load data dari localStorage
window.onload = function() {
  const savedData = JSON.parse(localStorage.getItem('airdropData')) || [];
  savedData.forEach(item => addRow(item));
};

form.addEventListener('submit', function(e) {
  e.preventDefault();

  const data = {
    nama: document.getElementById('nama').value,
    tanggal: document.getElementById('tanggal').value,
    jenis: document.getElementById('jenis').value,
    link: document.getElementById('link').value,
    properti: document.getElementById('properti').value,
    wallet: document.getElementById('wallet').value,
    status: document.getElementById('status').value
  };

  if (editingRow) {
    // update baris lama
    editingRow.remove();
    editingRow = null;
  }

  addRow(data);
  saveData();
  form.reset();
  closeModal();
});

function addRow(data) {
  const row = document.createElement('tr');
  row.className = "hover:bg-gray-100 dark:hover:bg-gray-700";
  row.innerHTML = `
    <td class="px-3 py-2">${data.nama}</td>
    <td class="px-3 py-2">${data.tanggal}</td>
    <td class="px-3 py-2">${data.jenis}</td>
    <td class="px-3 py-2">
      <a href="${data.link}" target="_blank" class="inline-block text-blue-600 dark:text-blue-400 hover:scale-110 transition">
        <!-- Heroicon: External Link -->
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
             stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round"
                d="M13.5 4.5H19.5M19.5 4.5V10.5M19.5 4.5L9 15M4.5 19.5H9.75C10.9926 19.5 12 18.4926 12 17.25V12.75C12 11.5074 10.9926 10.5 9.75 10.5H4.5V19.5Z" />
        </svg>
      </a>
    </td>
    <td class="px-3 py-2">${data.properti}</td>
    <td class="px-3 py-2">${data.wallet}</td>
    <td class="px-3 py-2 status-cell cursor-pointer">${data.status}</td>
    <td class="px-3 py-2 flex gap-2">
      <!-- Tombol Edit -->
      <button class="edit-btn text-yellow-500 hover:scale-110 transition">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
             stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round"
                d="M16.862 4.487l2.651 2.651m-2.651-2.651a2.25 2.25 0 00-3.182 0l-9.193 9.193a4.5 4.5 0 00-1.318 2.25l-.318 2.25a.75.75 0 00.854.854l2.25-.318a4.5 4.5 0 002.25-1.318l9.193-9.193a2.25 2.25 0 000-3.182z" />
        </svg>
      </button>
      <!-- Tombol Hapus -->
      <button class="delete-btn text-red-500 hover:scale-110 transition">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
             stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </td>
  `;

  // Hapus baris
  row.querySelector('.delete-btn').addEventListener('click', function() {
    row.remove();
    saveData();
  });

  // Edit baris
  row.querySelector('.edit-btn').addEventListener('click', function() {
    document.getElementById('nama').value = data.nama;
    document.getElementById('tanggal').value = data.tanggal;
    document.getElementById('jenis').value = data.jenis;
    document.getElementById('link').value = data.link;
    document.getElementById('properti').value = data.properti;
    document.getElementById('wallet').value = data.wallet;
    document.getElementById('status').value = data.status;

    editingRow = row; // simpan referensi baris yang sedang diedit
    openModal();
  });

  // Toggle status dengan klik
  const statusCell = row.querySelector('.status-cell');
  statusCell.addEventListener('click', function() {
    let current = statusCell.textContent;
    let idx = statusOptions.indexOf(current);
    let next = statusOptions[(idx + 1) % statusOptions.length];
    statusCell.textContent = next;
    saveData();
  });

  tableBody.appendChild(row);
}

function saveData() {
  const rows = tableBody.querySelectorAll('tr');
  const data = [];
  rows.forEach(row => {
    const cells = row.querySelectorAll('td');
    data.push({
      nama: cells[0].textContent,
      tanggal: cells[1].textContent,
      jenis: cells[2].textContent,
      link: cells[3].querySelector('a').href,
      properti: cells[4].textContent,
      wallet: cells[5].textContent,
      status: cells[6].textContent
    });
  });
  localStorage.setItem('airdropData', JSON.stringify(data));
}

// Toggle tema
function toggleTheme() {
  document.body.classList.toggle('dark');
}

// Modal control dengan animasi
function openModal() {
  modal.classList.remove('hidden');
  setTimeout(() => {
    modalContent.classList.remove('opacity-0', 'scale-95');
    modalContent.classList.add('opacity-100', 'scale-100');
  }, 50);
}

function closeModal() {
  modalContent.classList.remove('opacity-100', 'scale-100');
  modalContent.classList.add('opacity-0', 'scale-95');
  setTimeout(() => {
    modal.classList.add('hidden');
  }, 200);
}

const myPassword = "Bunga&bintanG"; 

function checkAuth() {
  const input = prompt("Masukkan password untuk edit data:");
  return input === myPassword;
}

// Contoh penggunaan di tombol tambah
function openModal() {
  if (!checkAuth()) {
    alert("Password salah, tidak bisa edit!");
    return;
  }
  modal.classList.remove('hidden');
  setTimeout(() => {
    modalContent.classList.remove('opacity-0', 'scale-95');
    modalContent.classList.add('opacity-100', 'scale-100');
  }, 50);
}
// Filter data
function applyFilter() {
  const jenisFilter = document.getElementById('searchJenis').value.toLowerCase();
  const statusFilter = document.getElementById('filterStatus').value;

  const rows = tableBody.querySelectorAll('tr');
  rows.forEach(row => {
    const jenis = row.cells[2].textContent.toLowerCase();
    const status = row.cells[6].textContent;
    const matchJenis = !jenisFilter || jenis.includes(jenisFilter);
    const matchStatus = !statusFilter || status === statusFilter;
    row.style.display = (matchJenis && matchStatus) ? '' : 'none';
  });
}

function resetFilter() {
  document.getElementById('searchJenis').value = '';
  document.getElementById('filterStatus').value = '';
  const rows = tableBody.querySelectorAll('tr');
  rows.forEach(row => row.style.display = '');
}
