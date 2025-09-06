// Patient search functionality
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('searchForm').addEventListener('submit', searchPatients);
});

async function searchPatients(event) {
    event.preventDefault();
    
    const searchType = document.getElementById('searchType').value;
    const searchTerm = document.getElementById('searchTerm').value.trim();
    
    if (!searchTerm) {
        alert('Please enter a search term');
        return;
    }
    
    try {
        const response = await fetch(`searchPatients?type=${searchType}&term=${encodeURIComponent(searchTerm)}`);
        const patients = await response.json();
        
        displayResults(patients);
    } catch (error) {
        console.error('Search error:', error);
        alert('Error searching patients');
    }
}

function displayResults(patients) {
    const resultsDiv = document.getElementById('results');
    const patientList = document.getElementById('patientList');
    const noResults = document.getElementById('noResults');
    
    resultsDiv.classList.remove('hidden');
    
    if (patients.length === 0) {
        patientList.innerHTML = '';
        noResults.classList.remove('hidden');
    } else {
        noResults.classList.add('hidden');
        patientList.innerHTML = patients.map(patient => `
            <div class="patient-card">
                <h4>Patient ID: ${patient.id}</h4>
                <p><strong>Name:</strong> ${patient.name}</p>
                <p><strong>Contact:</strong> ${patient.contact}</p>
                <p><strong>Email:</strong> ${patient.email}</p>
                <button type="button" class="login-btn book-appointment-btn" data-patient-id="${patient.id}" data-patient-name="${patient.name.replace(/'/g, '&apos;').replace(/"/g, '&quot;')}">Book Appointment</button>
            </div>
        `).join('');
    }
}

function bookAppointment(patientId, patientName) {
    window.location.href = `appointment-booking.html?patientId=${patientId}&patientName=${encodeURIComponent(patientName)}`;
}