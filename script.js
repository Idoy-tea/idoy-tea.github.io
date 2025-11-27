const form = document.getElementById('airdropForm');
const tableBody = document.querySelector('#airdropTable tbody');
const body = document.body;

// Load data dari localStorage saat halaman dibuka
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
});

function addRow(data) {
  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${data.tanggal}</td>
    <td>${data.jenis}</td>
    <td><a href="${data.link}" target="_blank">${data.link}</a></td>
    <td>${data.properti}</td>
    <td>${data.status}</td>
    <td><button class="delete-btn">Hapus</button></td>
  `;

  row.querySelector('.delete-btn').addEventListener('click', function() {
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
}

// Filter Pencarian
function applyFilter() {
  const searchJenis = document.getElementById('searchJenis').value.toLowerCase();
  const filterStatus = document.getElementById('filterStatus').value;

  const rows = tableBody.querySelectorAll('tr');
  rows.forEach(row => {
    const jenis = row.cells[1].textContent.toLowerCase();
    const status = row.cells[4].textContent;

    const matchJenis = jenis.includes(searchJenis);
    const matchStatus = filterStatus === "" || status === filterStatus;

    if (matchJenis && matchStatus) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
}

function resetFilter() {
  document.getElementById('searchJenis').value = "";
  document.getElementById('filterStatus').value = "";
  const rows = tableBody.querySelectorAll('tr');
  rows.forEach(row => row.style.display = "");
}
