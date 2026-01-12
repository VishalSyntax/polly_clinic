// Green API WhatsApp config to 25
const GREEN_API_URL = 'https://api.green-api.com';
const INSTANCE_ID = '7105319809';
const ACCESS_TOKEN = 'f557539d8a6e4ee0acd5144309849c63a12e5c5094564d73b7';

// Format phone number to international format
function formatPhoneNumber(phoneNumber) {
    if (!phoneNumber) return null;
    
    // Remove all non-digit characters
    let cleaned = phoneNumber.replace(/\D/g, '');
    
    // If number starts with 91, use as is
    if (cleaned.startsWith('91') && cleaned.length === 12) {
        return cleaned;
    }
    
    // If 10 digit number, add 91 prefix
    if (cleaned.length === 10) {
        return '91' + cleaned;
    }
    
    // Return original if already in correct format
    return cleaned;
}

let allAppointments = [];

document.addEventListener('DOMContentLoaded', function() {
    loadAppointments();
    
    // Add event listeners for filter radio buttons
    document.querySelectorAll('input[name="appointmentFilter"]').forEach(radio => {
        radio.addEventListener('change', filterAppointments);
    });
    
    // Handle modify form submission
    document.getElementById('modifyForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const newDoctor = document.getElementById('modifyDoctor').value;
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
                    newDoctorId: parseInt(newDoctor),
                    newDate: newDate,
                    newTime: newTime
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Send WhatsApp modification notification
                if (currentAppointment && currentAppointment.contactNumber) {
                    const doctorSelect = document.getElementById('modifyDoctor');
                    const doctorName = doctorSelect.selectedOptions[0].text;
                    
                    await sendModificationWhatsApp(currentAppointment.contactNumber, {
                        patientName: currentAppointment.patientName,
                        newDate: newDate,
                        newTime: newTime,
                        newDoctorName: doctorName
                    });
                }
                
                alert('Appointment updated successfully');
                closeModifyModal();
                loadAppointments();
            } else {
                alert('Failed to update appointment: ' + (result.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error updating appointment:', error);
            alert('Error updating appointment');
        }
    });
});

async function loadAppointments() {
    try {
        const response = await fetch('getAppointments');
        allAppointments = await response.json();
        
        // Sort appointments in descending order (upcoming first)
        allAppointments.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Apply current filter
        filterAppointments();
    } catch (error) {
        console.error('Error loading appointments:', error);
    }
}

async function filterAppointments() {
    const filterValue = document.querySelector('input[name="appointmentFilter"]:checked').value;
    const today = new Date().toISOString().split('T')[0];
    
    if (filterValue === 'cancelled') {
        await loadCancelledAppointments();
        return;
    }
    
    let filteredAppointments;
    if (filterValue === 'today') {
        filteredAppointments = allAppointments.filter(appointment => {
            return appointment.date === today && appointment.status !== 'cancelled';
        });
    } else {
        filteredAppointments = allAppointments.filter(appointment => appointment.status !== 'cancelled');
    }
    
    displayAppointments(filteredAppointments);
}

function displayAppointments(appointments) {
    const tbody = document.getElementById('appointmentsTableBody');
    tbody.innerHTML = '';
    
    const filterValue = document.querySelector('input[name="appointmentFilter"]:checked').value;
    
    appointments.forEach(appointment => {
        const row = document.createElement('tr');
        
        if (filterValue === 'cancelled') {
            row.innerHTML = `
                <td>${appointment.date}</td>
                <td>${appointment.time || 'N/A'}</td>
                <td>${appointment.patientId}</td>
                <td>${appointment.patientName}</td>
                <td>${appointment.contactNumber}</td>
                <td>${appointment.doctorName}</td>
                <td>
                    <button class="btn btn-outline-secondary btn-sm w-100" onclick="viewCancelRemarks('${appointment.patientId}')">View Cancel History</button>
                </td>
            `;
        } else {
            row.innerHTML = `
                <td>${appointment.date}</td>
                <td>${appointment.time || 'N/A'}</td>
                <td>${appointment.patientId}</td>
                <td>${appointment.patientName}</td>
                <td>${appointment.contactNumber || 'N/A'}</td>
                <td>${appointment.doctorName || 'N/A'}</td>
                <td>
                    <div class="d-grid gap-1">
                        <button class="btn btn-info btn-sm" onclick="viewHistory('${appointment.patientId}')">View History</button>
                        <div class="d-flex gap-1">
                            <button class="btn btn-danger btn-sm flex-fill" onclick="showCancelModal(${appointment.id}, '${appointment.patientId}')">Cancel</button>
                            <button class="btn btn-warning btn-sm flex-fill" onclick="modifyAppointment(${appointment.id})">Modify</button>
                        </div>
                    </div>
                </td>
            `;
        }
        tbody.appendChild(row);
    });
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

let currentCancelAppointmentId = null;
let currentCancelPatientId = null;

function showCancelModal(appointmentId, patientId) {
    currentCancelAppointmentId = appointmentId;
    currentCancelPatientId = patientId;
    
    document.getElementById('cancelRemark').value = '';
    const modal = new bootstrap.Modal(document.getElementById('cancelModal'));
    modal.show();
}

async function confirmCancellation() {
    const cancelReason = document.getElementById('cancelRemark').value.trim();
    
    if (!cancelReason) {
        alert('Please enter a cancellation reason');
        return;
    }
    
    try {
        const response = await fetch('cancelAppointmentWithRemark', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                appointmentId: currentCancelAppointmentId,
                patientId: currentCancelPatientId,
                cancelReason: cancelReason,
                cancelledBy: localStorage.getItem('userName') || 'Receptionist'
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Send WhatsApp cancellation notification
            const appointment = allAppointments.find(apt => apt.id == currentCancelAppointmentId);
            if (appointment && appointment.contactNumber) {
                await sendCancellationWhatsApp(appointment.contactNumber, {
                    patientName: appointment.patientName,
                    date: appointment.date,
                    time: appointment.time,
                    doctorName: appointment.doctorName
                });
            }
            
            alert('Appointment cancelled successfully');
            // Remove focus before closing modal
            document.activeElement.blur();
            const modal = bootstrap.Modal.getInstance(document.getElementById('cancelModal'));
            modal.hide();
            loadAppointments();
        } else {
            alert('Failed to cancel appointment: ' + result.message);
        }
    } catch (error) {
        console.error('Error cancelling appointment:', error);
        alert('Error cancelling appointment');
    }
}

async function loadCancelledAppointments() {
    try {
        const response = await fetch('getCancelledAppointments');
        const cancelledAppointments = await response.json();
        displayAppointments(cancelledAppointments);
    } catch (error) {
        console.error('Error loading cancelled appointments:', error);
    }
}

async function viewCancelRemarks(patientId) {
    try {
        const response = await fetch(`getCancellationRemarks?patientId=${patientId}`);
        const remarks = await response.json();
        
        const content = document.getElementById('cancelRemarksContent');
        
        if (remarks.length === 0) {
            content.innerHTML = '<p>No cancellation history found for this patient.</p>';
        } else {
            content.innerHTML = '<h5>Cancellation History:</h5>';
            remarks.forEach(remark => {
                content.innerHTML += `
                    <div class="card mb-2">
                        <div class="card-body">
                            <p><strong>Appointment:</strong> ${remark.appointmentDate} at ${remark.appointmentTime}</p>
                            <p><strong>Cancelled By:</strong> ${remark.cancelledBy}</p>
                            <p><strong>Cancelled At:</strong> ${new Date(remark.cancelledAt).toLocaleString()}</p>
                            <p><strong>Reason:</strong> ${remark.reason}</p>
                        </div>
                    </div>
                `;
            });
        }
        
        const modal = new bootstrap.Modal(document.getElementById('cancelRemarksModal'));
        modal.show();
    } catch (error) {
        console.error('Error loading cancellation remarks:', error);
        alert('Error loading cancellation history');
    }
}

async function sendCancellationWhatsApp(contactNumber, appointmentDetails) {
    if (!contactNumber || contactNumber.trim() === '') {
        return;
    }
    
    const message = `🚫 *PollyClinic Appointment Cancelled*\n\n` +
                   `Dear ${appointmentDetails.patientName},\n\n` +
                   `Your appointment has been cancelled.\n\n` +
                   `📋 *Cancelled Appointment:*\n` +
                   `Date: ${appointmentDetails.date}\n` +
                   `Time: ${appointmentDetails.time}\n` +
                   `Doctor: ${appointmentDetails.doctorName}\n\n` +
                   `Please contact on 9975750931 to reschedule.\n\n` +
                   `PollyClinic Team 🙏`;
    
    try {
        const response = await fetch(`${GREEN_API_URL}/waInstance${INSTANCE_ID}/sendMessage/${ACCESS_TOKEN}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chatId: `${formatPhoneNumber(contactNumber)}@c.us`,
                message: message
            })
        });
        
        const result = await response.json();
        
        if (!response.ok && result.correspondentsStatus && result.correspondentsStatus.status === 'CORRESPONDENTS_QUOTE_EXCEEDED') {
            console.warn('WhatsApp quota exceeded. Please upgrade your Green API plan.');
        }
    } catch (error) {
        console.error('Error sending WhatsApp message:', error);
    }
}

let currentAppointmentId = null;
let currentAppointment = null;

async function modifyAppointment(appointmentId) {
    currentAppointmentId = appointmentId;
    
    // Find current appointment details
    currentAppointment = allAppointments.find(apt => apt.id == appointmentId);
    
    // Load doctors
    await loadDoctorsForModify();
    
    // Set default values
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('modifyDate').min = today;
    document.getElementById('modifyDate').value = today; // Set current date as default
    
    // Set current doctor as selected if available
    if (currentAppointment && currentAppointment.doctorId) {
        document.getElementById('modifyDoctor').value = currentAppointment.doctorId;
    }
    
    const modal = new bootstrap.Modal(document.getElementById('modifyModal'));
    modal.show();
}

async function loadDoctorsForModify() {
    try {
        const response = await fetch('getDoctors');
        if (response.ok) {
            const doctors = await response.json();
            const doctorSelect = document.getElementById('modifyDoctor');
            doctorSelect.innerHTML = '<option value="">Choose Doctor</option>';
            doctors.forEach(doctor => {
                const option = document.createElement('option');
                option.value = doctor.id;
                option.textContent = `${doctor.name} - ${doctor.specialization}`;
                doctorSelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error loading doctors:', error);
    }
}

function closeHistoryModal() {
    // Remove focus before closing modal
    document.activeElement.blur();
    const modal = bootstrap.Modal.getInstance(document.getElementById('historyModal'));
    if (modal) modal.hide();
}

function closeModifyModal() {
    // Remove focus before closing modal
    document.activeElement.blur();
    const modal = bootstrap.Modal.getInstance(document.getElementById('modifyModal'));
    if (modal) modal.hide();
    document.getElementById('modifyForm').reset();
    currentAppointmentId = null;
}

async function sendModificationWhatsApp(contactNumber, appointmentDetails) {
    if (!contactNumber || contactNumber.trim() === '') {
        return;
    }
    
    const message = `✏️ *PollyClinic Appointment Modified*\n\n` +
                   `Dear ${appointmentDetails.patientName},\n\n` +
                   `Your appointment updated with new details.\n\n` +
                   `📋 *New Appointment Details:*\n` +
                   `Date: ${appointmentDetails.newDate}\n` +
                   `Time: ${appointmentDetails.newTime}\n` +
                   `Doctor: ${appointmentDetails.newDoctorName}\n\n` +
                   `Please arrive 15 minutes early.\n\n` +
                   `Thank you for choosing PollyClinic! 🙏`;
    
    try {
        const response = await fetch(`${GREEN_API_URL}/waInstance${INSTANCE_ID}/sendMessage/${ACCESS_TOKEN}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chatId: `${formatPhoneNumber(contactNumber)}@c.us`,
                message: message
            })
        });
        
        const result = await response.json();
        
        if (!response.ok && result.correspondentsStatus && result.correspondentsStatus.status === 'CORRESPONDENTS_QUOTE_EXCEEDED') {
            console.warn('WhatsApp quota exceeded. Please upgrade your Green API plan.');
        }
    } catch (error) {
        console.error('Error sending WhatsApp message:', error);
    }
}

function updateAppointment() {
    document.getElementById('modifyForm').dispatchEvent(new Event('submit'));
}

