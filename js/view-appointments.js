emailjs.init("DaTM_GydmK934LWAm");

document.addEventListener('DOMContentLoaded', function() {
    loadAppointments();
});

async function loadAppointments() {
    try {
        const response = await fetch('getAppointments');
        const appointments = await response.json();
        
        const tbody = document.getElementById('appointmentsTableBody');
        tbody.innerHTML = '';
        
        // Sort appointments in descending order (upcoming first)
        appointments.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        appointments.forEach(appointment => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${appointment.date}</td>
                <td>${appointment.patientId}</td>
                <td>${appointment.patientName}</td>
                <td>
                    <button class="btn btn-info btn-sm me-1" onclick="viewHistory('${appointment.patientId}')">View History</button>
                    <button class="btn btn-danger btn-sm me-1" onclick="cancelAppointment(${appointment.id}, '${appointment.email}')">Cancel</button>
                    <button class="btn btn-warning btn-sm" onclick="modifyAppointment(${appointment.id})">Modify</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading appointments:', error);
    }
}

async function viewHistory(patientId) {
    try {
        const response = await fetch(`getPatientHistory?patientId=${patientId}`);
        const history = await response.json();
        
        const historyContent = document.getElementById('historyContent');
        
        if (history.length === 0) {
            historyContent.innerHTML = '<p>No previous appointments found.</p>';
        } else {
            historyContent.innerHTML = '<h4>Previous Appointments:</h4>';
            history.forEach(appointment => {
                const statusClass = appointment.status === 'completed' ? 'success' : 
                                   appointment.status === 'cancelled' ? 'danger' : 'info';
                historyContent.innerHTML += `
                    <div class="card mb-2">
                        <div class="card-body">
                            <p><strong>Date:</strong> ${appointment.date} at ${appointment.time}</p>
                            <p><strong>Doctor:</strong> ${appointment.doctorName}</p>
                            <p><strong>Status:</strong> <span class="badge bg-${statusClass}">${appointment.status.toUpperCase()}</span></p>
                            ${appointment.remarks ? `<p><strong>Remarks:</strong> ${appointment.remarks}</p>` : ''}
                        </div>
                    </div>
                `;
            });
        }
        
        const modal = new bootstrap.Modal(document.getElementById('historyModal'));
        modal.show();
    } catch (error) {
        console.error('Error loading patient history:', error);
        alert('Error loading patient history');
    }
}

async function cancelAppointment(appointmentId, email) {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    
    try {
        const response = await fetch('cancelAppointment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ appointmentId })
        });
        
        const result = await response.json();
        
        if (result.success) {
            await sendCancellationEmail(email, result.appointmentDetails);
            alert('Appointment cancelled successfully');
            loadAppointments();
        } else {
            alert('Failed to cancel appointment');
        }
    } catch (error) {
        console.error('Error cancelling appointment:', error);
    }
}

async function sendCancellationEmail(email, appointmentDetails) {
    const templateParams = {
        to_email: email,
        patient_name: appointmentDetails.patientName,
        appointment_date: appointmentDetails.date,
        appointment_time: appointmentDetails.time,
        doctor_name: appointmentDetails.doctorName
    };
    
    try {
        await emailjs.send('service_vf4qmrt', 'appointment_cancellation', templateParams);
    } catch (error) {
        console.error('Error sending cancellation email:', error);
    }
}

let currentAppointmentId = null;

function modifyAppointment(appointmentId) {
    currentAppointmentId = appointmentId;
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('modifyDate').min = today;
    
    const modal = new bootstrap.Modal(document.getElementById('modifyModal'));
    modal.show();
}

function closeHistoryModal() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('historyModal'));
    if (modal) modal.hide();
}

function closeModifyModal() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('modifyModal'));
    if (modal) modal.hide();
    document.getElementById('modifyForm').reset();
    currentAppointmentId = null;
}

function updateAppointment() {
    document.getElementById('modifyForm').dispatchEvent(new Event('submit'));
}

// Handle modify form submission
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('modifyForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const newDate = document.getElementById('modifyDate').value;
        const newTime = document.getElementById('modifyTime').value;
        
        try {
            const response = await fetch('modifyAppointment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    appointmentId: currentAppointmentId,
                    newDate: newDate,
                    newTime: newTime
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                alert('Appointment updated successfully');
                closeModifyModal();
                loadAppointments(); // Reload the appointments table
            } else {
                alert('Failed to update appointment: ' + (result.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error updating appointment:', error);
            alert('Error updating appointment');
        }
    });
});