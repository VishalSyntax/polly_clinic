document.addEventListener('DOMContentLoaded', function() {
    updateDateTime();
    setInterval(updateDateTime, 1000);
    loadAllAppointments();
    
    // Auto-refresh appointments every 30 seconds
    setInterval(loadAllAppointments, 30000);
});

function updateDateTime() {
    const now = new Date();
    document.getElementById('currentDateTime').textContent = now.toLocaleString();
}

async function loadAllAppointments() {
    try {
        const doctorId = localStorage.getItem('doctorId') || 1;
        // console.log('Loading all appointments for doctor ID:', doctorId); // Reduced logging for auto-refresh
        
        const response = await fetch(`getAllAppointments?doctorId=${doctorId}`);
        const appointments = await response.json();
        // console.log('All appointments received:', appointments); // Reduced logging for auto-refresh

        const tbody = document.getElementById('appointmentsTableBody');
        tbody.innerHTML = '';

        if (appointments.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 20px; color: #666;">
                        No appointments found.
                    </td>
                </tr>
            `;
            return;
        }
        
        appointments.forEach(appointment => {
            const row = document.createElement('tr');
            const statusClass = appointment.status === 'completed' ? 'success' : 
                               appointment.status === 'cancelled' ? 'danger' : 'info';
            
            row.innerHTML = `
                <td>${appointment.date}</td>
                <td>${appointment.time}</td>
                <td>${appointment.patientId}</td>
                <td>${appointment.patientName}</td>
                <td>${appointment.contactNumber}</td>
                <td><span class="badge bg-${statusClass}">${appointment.status.toUpperCase()}</span></td>
                <td>
                    ${appointment.status === 'scheduled' ? 
                        `<button class="action-btn btn-info" onclick="viewRemarks('${appointment.id}', '${appointment.patientId}')">Add Remarks</button>
                         <button class="action-btn btn-success" onclick="generatePrescription('${appointment.id}', '${appointment.patientId}')">Create Prescription</button>` :
                        `<button class="action-btn btn-info" onclick="viewRemarks('${appointment.id}', '${appointment.patientId}')">View Remarks</button>`
                    }
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading appointments:', error);
        const tbody = document.getElementById('appointmentsTableBody');
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 20px; color: #d32f2f;">
                    Error loading appointments. Please check console for details.
                </td>
            </tr>
        `;
    }
}

async function viewRemarks(appointmentId, patientId) {
    try {
        const response = await fetch(`getPatientRemarks?patientId=${patientId}`);
        const remarks = await response.json();

        let remarksHtml = '<div id="remarksModal" class="modal" style="display: block;">';
        remarksHtml += '<div class="modal-content">';
        remarksHtml += '<div class="modal-header">';
        remarksHtml += '<h3>Patient Remarks</h3>';
        remarksHtml += '<span class="close" onclick="closeModal()">&times;</span>';
        remarksHtml += '</div>';
        remarksHtml += '<div class="modal-body" style="max-height: 400px; overflow-y: auto;">';
        
        if (remarks.length === 0) {
            remarksHtml += '<h4>New Patient</h4>';
            remarksHtml += '<p style="color: #666; margin-bottom: 20px;">No previous remarks found.</p>';
        } else {
            remarksHtml += '<h4>Previous Remarks:</h4>';
            remarks.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            remarks.forEach(remark => {
                remarksHtml += `<div style="border: 1px solid #ddd; padding: 10px; margin-bottom: 10px; border-radius: 5px; background-color: #f9f9f9;">`;
                remarksHtml += `<small style="color: #666; font-weight: bold;">${remark.date} - Dr. ${remark.doctorName}</small>`;
                remarksHtml += `<p style="margin: 5px 0 0 0;">${remark.remarks}</p>`;
                remarksHtml += '</div>';
            });
        }
        
        remarksHtml += '<div style="margin-top: 20px;">';
        remarksHtml += '<label for="newRemark">Add New Remark:</label>';
        remarksHtml += '<textarea class="form-control" id="newRemark" rows="3" style="margin-top: 5px; width: 100%; padding: 8px;"></textarea>';
        remarksHtml += '</div>';
        remarksHtml += '</div>';
        remarksHtml += '<div style="margin-top: 20px; text-align: right;">';
        remarksHtml += '<button class="login-btn" onclick="closeModal()" style="background-color: #6c757d; margin-right: 10px;">Close</button>';
        remarksHtml += `<button class="login-btn" onclick="saveRemark('${appointmentId}', '${patientId}')">Save Remark</button>`;
        remarksHtml += '</div>';
        remarksHtml += '</div>';
        remarksHtml += '</div>';
        
        document.body.insertAdjacentHTML('beforeend', remarksHtml);
    } catch (error) {
        console.error('Error loading remarks:', error);
        alert('Error loading patient remarks');
    }
}

async function saveRemark(appointmentId, patientId) {
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
                appointmentId: appointmentId,
                patientId: patientId,
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
        alert('Error saving remark');
    }
}

function closeModal() {
    const modal = document.getElementById('remarksModal');
    if (modal) {
        modal.remove();
    }
}

function generatePrescription(appointmentId, patientId) {
    window.location.href = `prescription-form.html?appointmentId=${appointmentId}&patientId=${patientId}`;
}