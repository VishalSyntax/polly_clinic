// Initialize EmailJS
emailjs.init("YOUR_EMAILJS_USER_ID");

// Global variables
let currentAppointmentId = null;
let currentPatientId = null;

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    updateDateTime();
    setInterval(updateDateTime, 1000);
    displayDoctorInfo();
    loadTodayAppointments();
    
    // Auto-refresh appointments every 30 seconds
    setInterval(loadTodayAppointments, 30000);
});

// Display doctor info
function displayDoctorInfo() {
    const doctorName = localStorage.getItem('doctorName') || localStorage.getItem('userName') || localStorage.getItem('username');
    const loginTime = localStorage.getItem('loginTime');
    
    if (loginTime) {
        const loginDate = new Date(loginTime);
        const formattedTime = loginDate.toLocaleString();
        
        document.getElementById('doctorInfo').innerHTML = `
            <strong>👨⚕️ ${doctorName}</strong> | 
            <span>Login Time: ${formattedTime}</span>
        `;
    } else {
        document.getElementById('doctorInfo').innerHTML = `
            <strong>👨⚕️ ${doctorName}</strong>
        `;
    }
}

// Update current date and time
function updateDateTime() {
    const now = new Date();
    document.getElementById('currentDateTime').textContent = now.toLocaleString();
}

// Load today's appointments
async function loadTodayAppointments() {
    try {
        const doctorId = localStorage.getItem('doctorId') || 1;
        // console.log('Loading appointments for doctor ID:', doctorId); // Reduced logging for auto-refresh
        
        const response = await fetch(`getTodayAppointments?doctorId=${doctorId}`);
        const appointments = await response.json();
        console.log('Appointments received:', appointments);

        const tbody = document.getElementById('appointmentsTableBody');
        tbody.innerHTML = '';

        if (appointments.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 20px; color: #666;">
                        No appointments scheduled for today.
                        <br><small>Note: Only appointments for today (${new Date().toLocaleDateString()}) are shown.</small>
                    </td>
                </tr>
            `;
            return;
        }

        // Sort appointments by time
        appointments.sort((a, b) => a.time.localeCompare(b.time));
        
        appointments.forEach(appointment => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${appointment.patientId}</td>
                <td>${appointment.time}</td>
                <td>${appointment.patientName}</td>
                <td>${appointment.contactNumber}</td>
                <td>
                    <button class="action-btn btn-info" onclick="viewRemarks('${appointment.id}', '${appointment.patientId}')">Add Remarks</button>
                    <button class="action-btn btn-success" onclick="generatePrescription('${appointment.id}', '${appointment.patientId}')">Create Prescription</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading appointments:', error);
        const tbody = document.getElementById('appointmentsTableBody');
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 20px; color: #d32f2f;">
                    Error loading appointments. Please check console for details.
                </td>
            </tr>
        `;
    }
}

// View patient remarks
async function viewRemarks(appointmentId, patientId) {
    currentAppointmentId = appointmentId;
    currentPatientId = patientId;

    try {
        const response = await fetch(`getPatientRemarks?patientId=${patientId}`);
        const remarks = await response.json();

        const existingRemarksDiv = document.getElementById('existingRemarks');
        
        if (remarks.length === 0) {
            existingRemarksDiv.innerHTML = `
                <h4>New Patient</h4>
                <p style="color: #666; margin-bottom: 20px;">No previous remarks found. This appears to be a new patient.</p>
            `;
        } else {
            existingRemarksDiv.innerHTML = '<h4>Existing Patient - Previous Remarks:</h4>';
            remarks.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            remarks.forEach(remark => {
                existingRemarksDiv.innerHTML += `
                    <div style="border: 1px solid #ddd; padding: 10px; margin-bottom: 10px; border-radius: 5px; background-color: #f9f9f9;">
                        <small style="color: #666; font-weight: bold;">${remark.date} - ${remark.doctorName}</small>
                        <p style="margin: 5px 0 0 0;">${remark.remarks}</p>
                    </div>
                `;
            });
        }

        document.getElementById('remarksModal').style.display = 'block';
    } catch (error) {
        console.error('Error loading remarks:', error);
    }
}

// Save new remark
async function saveRemark() {
    const newRemark = document.getElementById('newRemark').value.trim();
    if (!newRemark) {
        alert('Please enter a remark');
        return;
    }

    try {
        const response = await fetch('saveRemark', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                appointmentId: currentAppointmentId,
                patientId: currentPatientId,
                remarks: newRemark,
                doctorId: parseInt(localStorage.getItem('doctorId')) || 1
            })
        });

        const result = await response.json();
        if (result.success) {
            alert('Remark saved successfully');
            closeModal();
        } else {
            alert('Failed to save remark');
        }
    } catch (error) {
        console.error('Error saving remark:', error);
    }
}

// Generate prescription
function generatePrescription(appointmentId, patientId) {
    window.location.href = `prescription-form.jsp?appointmentId=${appointmentId}&patientId=${patientId}`;
}

// Close modal
function closeModal() {
    document.getElementById('remarksModal').style.display = 'none';
    document.getElementById('newRemark').value = '';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('remarksModal');
    if (event.target === modal) {
        closeModal();
    }
}
