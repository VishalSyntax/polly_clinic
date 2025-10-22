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
        const response = await fetch('getAllAppointments');
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
        
        remarksHtml += '<div style="margin-bottom: 15px;">';
        remarksHtml += '<label for="newRemark">Add New Remark:</label>';
        remarksHtml += '<textarea class="form-control" id="newRemark" rows="3" style="margin-top: 5px; width: 100%; padding: 8px;"></textarea>';
        remarksHtml += '</div>';
        remarksHtml += '<div style="margin-bottom: 15px; text-align: center;">';
        remarksHtml += `<button class="btn btn-primary btn-sm" onclick="saveRemark('${appointmentId}', '${patientId}')" style="margin-right: 8px; padding: 6px 12px;">Save Remark</button>`;
        remarksHtml += `<button class="btn btn-warning btn-sm" onclick="completeAppointmentFromModal('${appointmentId}', '${patientId}')" style="padding: 6px 12px;">Complete Without Prescription</button>`;
        remarksHtml += '</div>';
        
        if (remarks.length === 0) {
            remarksHtml += '<h4>New Patient</h4>';
            remarksHtml += '<p style="color: #666; margin-bottom: 20px;">No previous remarks found.</p>';
        } else {
            remarksHtml += '<h4>Existing Patient - Previous Remarks:</h4>';
            remarks.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            remarks.forEach(remark => {
                remarksHtml += `<div style="border: 1px solid #ddd; padding: 10px; margin-bottom: 10px; border-radius: 5px; background-color: #f9f9f9;">`;
                remarksHtml += `<small style="color: #666; font-weight: bold;">${remark.date} - Dr. ${remark.doctorName}</small>`;
                remarksHtml += `<p style="margin: 5px 0 0 0;">${remark.remarks}</p>`;
                remarksHtml += '</div>';
            });
        }
        
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
                remarks: newRemark
            })
        });

        const result = await response.json();
        if (result.success) {
            alert('Remark saved successfully');
            document.getElementById('newRemark').value = '';
        } else {
            alert('Failed to save remark');
        }
    } catch (error) {
        console.error('Error saving remark:', error);
        alert('Error saving remark');
    }
}

// Complete appointment without prescription from modal
async function completeAppointmentFromModal(appointmentId, patientId) {
    if (!confirm('Are you sure you want to complete this appointment without prescription?')) {
        return;
    }
    
    try {
        const response = await fetch('completeAppointment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                appointmentId: appointmentId,
                patientId: patientId
            })
        });
        
        const result = await response.json();
        if (result.success) {
            alert('Appointment completed successfully');
            closeModal();
            loadAllAppointments();
        } else {
            alert('Failed to complete appointment');
        }
    } catch (error) {
        console.error('Error completing appointment:', error);
        alert('Error completing appointment');
    }
}

function closeModal() {
    const modal = document.getElementById('remarksModal');
    if (modal) {
        modal.remove();
    }
}

function generatePrescription(appointmentId, patientId) {
    window.location.href = `prescription-form.jsp?appointmentId=${appointmentId}&patientId=${patientId}`;
}
