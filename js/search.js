document.addEventListener('DOMContentLoaded', function () {
  const searchForm = document.getElementById('searchForm');
  const resultsDiv = document.getElementById('results');

  searchForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const searchType = document.getElementById('searchType').value;
    const searchTerm = document.getElementById('searchTerm').value.trim().toLowerCase();

    if (!searchTerm) {
      alert('Please enter a search term');
      return;
    }

    const patientList = document.getElementById('patientList');
    patientList.innerHTML = '<p>Searching...</p>';

    try {
      // Adjust the URL and query parameters as per  backend API
      // // Replace /api/search?type=...&term=... with your actual backend endpoint.
      // The backend should return a JSON array of patient objects.
      const response = await fetch(`/api/search?type=${encodeURIComponent(searchType)}&term=${encodeURIComponent(searchTerm)}`);
      const filteredResults = await response.json();

      patientList.innerHTML = '';

      if (!filteredResults || filteredResults.length === 0) {
        patientList.innerHTML = '<p>No patients found</p>';
      } else {
        filteredResults.forEach(patient => {
          const card = document.createElement('div');
          card.className = 'patient-card';
          card.innerHTML = `
            <p><strong>ID:</strong> ${patient.id}</p>
            <p><strong>Name:</strong> ${patient.name}</p>
            <p><strong>Email:</strong> ${patient.email}</p>
          `;
          patientList.appendChild(card);
        });
      }
    } catch (error) {
      patientList.innerHTML = '<p>Error fetching results.</p>';
      console.error(error);
    }

    resultsDiv.classList.remove('hidden');
    searchForm.reset();
  });
});