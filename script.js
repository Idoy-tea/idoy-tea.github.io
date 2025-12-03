const form = document.getElementById('airdropForm');
const tableBody = document.querySelector('#airdropTable');
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modalContent');

const statusOptions = ["Pending", "Claimed", "Expired"];
let editingRow = null;

// Load data dari localStorage
window.onload = function() {
  const savedData = JSON.parse(localStorage.getItem('airdropData')) || [];
  savedData.forEach(item => addRow(item));
};

form.addEventListener('submit', function(e) {
  e.preventDefault();

  const checkboxes = document.querySelectorAll('#properti input[type="checkbox"]');
  const selectedProps = [];
  checkboxes.forEach(cb => {
    if (cb.checked) selectedProps.push(cb.value);
  });

  const data = {
    nama: document.getElementById('nama').value,
    tanggal: document.getElementById('tanggal').value,
    jenis: document.getElementById('jenis').value,
    link: document.getElementById('link').value,
    properti: selectedProps.join(', '),
    wallet: document.getElementById('wallet').value,
    status: document.getElementById('status').value
  };

  if (editingRow) {
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
    <td class="px-3 py-2"><a href="${data.link}" target="_blank" class="text-blue-600 dark:text-blue-400">🔗</a></td>
    <td class="px-3 py-2">${data.properti}</td>
    <td class="px-3 py-2">${data.wallet}</td>
    <td class="px-3 py-2 status-cell cursor-pointer">${data.status}</td>
    <td class="px-3 py-2">
      <button class="edit-btn text-yellow-500">✏️</button>
      <button class="delete-btn text-red-500">🗑️</button>
    </td>
  `;

  row.querySelector('.delete-btn').addEventListener('click', function() {
    row.remove();
    saveData();
  });

  row.querySelector('.edit-btn').addEventListener('click', function() {
    document.getElementById('nama').value = data.nama;
    document.getElementById('tanggal').value = data.tanggal;
    document.getElementById('jenis').value = data.jenis;
    document.getElementById('link').value = data.link;

    const checkboxes = document.querySelectorAll('#properti input[type="checkbox"]');
    checkboxes.forEach(cb => {
      cb.checked = data.properti.includes(cb.value);
    });

    document.getElementById('wallet').value = data.wallet;
    document.getElementById('status').value = data.status;

    editingRow = row;
    openModal();
  });

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

// Simpan data ke localStorage
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

// Modal control
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

// Export JSON
function exportJSON() {
  const data = localStorage.getItem('airdropData') || '[]';
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'airdrop-data.json';
  a.click();
  URL.revokeObjectURL(url);
}

// Export Excel (pakai SheetJS)
function exportExcel() {
  const data = JSON.parse(localStorage.getItem('airdropData')) || [];
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Airdrop");
  XLSX.writeFile(workbook, "airdrop-data.xlsx");
}

// Import JSON
function importData(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const parsed = JSON.parse(e.target.result);
      localStorage.setItem('airdropData', JSON.stringify(parsed));
      // render ulang tabel
      tableBody.innerHTML = '';
      parsed.forEach(item => addRow(item));
    } catch (err) {
      alert('File tidak valid.');
    }
  };
  reader.readAsText(file);
}
