document.addEventListener('DOMContentLoaded', function() {
    loadAllCompletedAppointments();
});

async function loadAllCompletedAppointments() {
    try {
        const doctorId = localStorage.getItem('userId');
        let url = 'getCompletedAppointments';
        if (doctorId && localStorage.getItem('userType') === 'doctor') {
            url += '?doctorId=' + doctorId;
        }
        const response = await fetch(url);
        const appointments = await response.json();
        displayAppointments(appointments);
    } catch (error) {
        console.error('Error loading completed appointments:', error);
    }
}

async function searchAppointments() {
    const searchTerm = document.getElementById('searchInput').value.trim();
    if (!searchTerm) {
        loadAllCompletedAppointments();
        return;
    }

    try {
        const doctorId = localStorage.getItem('userId');
        let url = `searchCompletedAppointments?search=${encodeURIComponent(searchTerm)}`;
        if (doctorId && localStorage.getItem('userType') === 'doctor') {
            url += '&doctorId=' + doctorId;
        }
        console.log('Search URL:', url);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const appointments = await response.json();
        console.log('Search results:', appointments);
        displayAppointments(appointments);
    } catch (error) {
        console.error('Error searching appointments:', error);
        alert('Error searching appointments: ' + error.message);
    }
}

function displayAppointments(appointments) {
    const tbody = document.getElementById('completedAppointmentsBody');
    tbody.innerHTML = '';

    if (appointments.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">No completed appointments found</td></tr>';
        return;
    }

    appointments.forEach(appointment => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${appointment.date}</td>
            <td>${appointment.patientId}</td>
            <td>${appointment.patientName}</td>
            <td>${appointment.contactNumber}</td>
            <td>${appointment.doctorName}</td>
            <td>
                <button class="btn btn-info btn-sm me-1" onclick="viewPrescription('${appointment.id}')">View Prescription</button>
                <button class="btn btn-secondary btn-sm" onclick="viewRemarks('${appointment.patientId}')">View Remarks</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

async function viewPrescription(appointmentId) {
    try {
        const response = await fetch(`getPrescription?appointmentId=${appointmentId}`);
        const prescription = await response.json();
        
        const content = document.getElementById('prescriptionContent');
        if (prescription.length === 0) {
            content.innerHTML = '<div class="alert alert-info">No prescription found for this appointment.</div>';
        } else {
            let html = '';
            prescription.forEach(med => {
                html += `
                    <div class="card mb-2">
                        <div class="card-body">
                            <strong>Medicine:</strong> ${med.medicineName}<br>
                            <strong>Quantity:</strong> ${med.quantity}<br>
                            <strong>Timing:</strong> ${med.timing}
                        </div>
                    </div>
                `;
            });
            content.innerHTML = html;
        }
        
        const modal = new bootstrap.Modal(document.getElementById('prescriptionModal'));
        modal.show();
    } catch (error) {
        console.error('Error loading prescription:', error);
        alert('Error loading prescription');
    }
}

function closePrescriptionModal() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('prescriptionModal'));
    if (modal) modal.hide();
}

async function viewRemarks(patientId) {
    try {
        const response = await fetch(`getPatientRemarks?patientId=${patientId}`);
        const remarks = await response.json();
        
        let remarksText = 'Patient Remarks History:\n\n';
        remarks.forEach(remark => {
            remarksText += `${remark.date} - ${remark.doctorName}:\n${remark.remarks}\n\n`;
        });
        
        alert(remarksText);
    } catch (error) {
        console.error('Error loading remarks:', error);
    }
}

// Allow search on Enter key
document.getElementById('searchInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchAppointments();
    }
});