// Patient search functionality
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('searchForm').addEventListener('submit', searchPatients);
    
    // Event delegation for book appointment buttons
    document.addEventListener('click', function(e) {
        console.log('Click detected on:', e.target);
        if (e.target.classList.contains('book-appointment-btn')) {
            console.log('Book appointment button clicked');
            const patientId = e.target.getAttribute('data-patient-id');
            const patientName = e.target.getAttribute('data-patient-name');
            console.log('Patient ID:', patientId, 'Patient Name:', patientName);
            bookAppointment(patientId, patientName);
        }
    });
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
                        <button type="button" class="login-btn book-appointment-btn" data-patient-id="${patient.id}" data-patient-name="${patient.name.replace(/'/g, '&apos;').replace(/"/g, '&quot;')}">Book Appointment</button>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

async function bookAppointment(patientId, patientName) {
    console.log('bookAppointment called with:', patientId, patientName);
    try {
        console.log('Checking patient status...');
        // Check patient's last appointment status
        const response = await fetch(`checkPatientStatus?patientId=${encodeURIComponent(patientId)}`);
        console.log('Response received:', response);
        const statusData = await response.json();
        console.log('Status data:', statusData);
        
        if (statusData.hasScheduledAppointment) {
            alert(`Appointment already booked for ${statusData.doctorName}`);
            return;
        }
        
        console.log('Proceeding to appointment booking page...');
        // Proceed with booking if no scheduled appointment
        window.location.href = `appointment-booking.html?patientId=${patientId}&patientName=${encodeURIComponent(patientName)}`;
    } catch (error) {
        console.error('Error checking patient status:', error);
        alert('Error checking patient status. Proceeding with booking.');
        // If check fails, proceed with booking (fallback)
        window.location.href = `appointment-booking.html?patientId=${patientId}&patientName=${encodeURIComponent(patientName)}`;
    }
}