const form = document.getElementById('airdropForm');
const tableBody = document.querySelector('#airdropTable');
const body = document.body;
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modalContent');

// Load data dari localStorage
window.onload = function() {
  const savedData = JSON.parse(localStorage.getItem('airdropData')) || [];
  savedData.forEach(item => addRow(item));
};

form.addEventListener('submit', function(e) {
  e.preventDefault();

  const data = {
    tanggal: document.getElementById('tanggal').value,
    jenis: document.getElementById('jenis').value,
    link: document.getElementById('link').value,
    properti: document.getElementById('properti').value,
    status: document.getElementById('status').value
  };

  addRow(data);
  saveData();
  form.reset();
  closeModal();
});

function addRow(data) {
  const row = document.createElement('tr');
  row.innerHTML = `
    <td class="border px-3 py-2">${data.tanggal}</td>
    <td class="border px-3 py-2">${data.jenis}</td>
    <td class="border px-3 py-2"><a href="${data.link}" target="_blank" class="text-blue-600 underline">${data.link}</a></td>
    <td class="border px-3 py-2">${data.properti}</td>
    <td class="border px-3 py-2">${data.status}</td>
    <td class="border px-3 py-2"><button class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Hapus</button></td>
  `;

  row.querySelector('button').addEventListener('click', function() {
    row.remove();
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
      tanggal: cells[0].textContent,
      jenis: cells[1].textContent,
      link: cells[2].querySelector('a').href,
      properti: cells[3].textContent,
      status: cells[4].textContent
    });
  });
  localStorage.setItem('airdropData', JSON.stringify(data));
}

function toggleTheme() {
  body.classList.toggle('light');
  body.classList.toggle('dark');
  if (body.classList.contains('dark')) {
    body.classList.replace('bg-gray-100', 'bg-gray-900');
    body.classList.replace('text-gray-800', 'text-gray-100');
  } else {
    body.classList.replace('bg-gray-900', 'bg-gray-100');
    body.classList.replace('text-gray-100', 'text-gray-800');
  }
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
  }, 300);
}

// Filter
function applyFilter() {
  const searchJenis = document.getElementById('searchJenis').value.toLowerCase();
  const filterStatus = document.getElementById('filterStatus').value;

  const rows = tableBody.querySelectorAll('tr');
  rows.forEach(row => {
    const jenis = row.cells[1].textContent.toLowerCase();
    const status = row.cells[4].textContent;
    const matchJenis = jenis.includes(searchJenis);
    const matchStatus = filterStatus === "" || status === filterStatus;
    row.style.display = (matchJenis && matchStatus) ? "" : "none";
  });
}

function resetFilter() {
  document.getElementById('searchJenis').value = "";
  document.getElementById('filterStatus').value = "";
  const rows = tableBody.querySelectorAll('tr');
  rows.forEach(row => row.style.display = "");
}
