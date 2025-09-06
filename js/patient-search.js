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
    
    resultsDiv.classList.remove('d-none');
    
    if (patients.length === 0) {
        patientList.innerHTML = '';
        noResults.classList.remove('d-none');
    } else {
        noResults.classList.add('d-none');
        patientList.innerHTML = patients.map(patient => `
            <div class="card" style="margin-bottom: 15px;">
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-striped table-hover mb-0">
                            <tbody>
                                <tr><td><strong>Patient ID:</strong></td><td>${patient.id}</td></tr>
                                <tr><td><strong>Name:</strong></td><td>${patient.name}</td></tr>
                                <tr><td><strong>Contact:</strong></td><td>${patient.contact}</td></tr>
                                <tr><td><strong>Email:</strong></td><td>${patient.email || 'N/A'}</td></tr>
                            </tbody>
                        </table>
                    </div>
                    <div style="margin-top: 10px;">
                        <button class="login-btn" onclick="bookAppointment('${patient.id}', '${patient.name}')">Book Appointment</button>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

function bookAppointment(patientId, patientName) {
    window.location.href = `appointment-booking.html?patientId=${patientId}&patientName=${encodeURIComponent(patientName)}`;
}