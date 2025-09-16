\r\n<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Patient Remarks - PollyClinic</title>
    <link rel="stylesheet" href="css/login.css">
    <link rel="stylesheet" href="css/common-sidebar.css">
    <link rel="stylesheet" href="css/doctor-appointments.css">
</head>
<body>
    <div class="sidebar">
        <div class="logo">
            <img src="img/logo.webp" alt="Hospital Logo">
        </div>
        <a href="doctor-appointments.jsp">Today's Appointments</a>
        <a href="all-appointments.jsp">All Appointments</a>
        <a href="completed-appointments.jsp">Completed Appointments</a>
        <a href="patient-remarks.jsp" class="active">Patient Remarks</a>
        <a href="index.jsp" class="logout">Logout</a>
    </div>
    
    <div class="main-content">
        <div class="login-container" style="width: 80%; max-width: none;">
            <h1>📝 Patient Remarks</h1>
            <p>Patient ID: <span id="patientId"></span></p>
            
            <div id="existingRemarks" style="margin-bottom: 30px;">
                <!-- Existing remarks loaded here -->
            </div>
            
            <div class="form-group">
                <label for="newRemark">Add New Remark:</label>
                <textarea id="newRemark" class="form-control" rows="4" placeholder="Enter patient remarks..."></textarea>
            </div>
            
            <div class="form-group">
                <button class="login-btn" onclick="saveRemark()">Save Remark</button>
                <button class="login-btn" onclick="window.history.back()" style="background-color: #6c757d; margin-left: 10px;">Back</button>
            </div>
        </div>
    </div>
    
    <script>
        let currentAppointmentId, currentPatientId;
        
        document.addEventListener('DOMContentLoaded', function() {
            const urlParams = new URLSearchParams(window.location.search);
            currentAppointmentId = urlParams.get('appointmentId');
            currentPatientId = urlParams.get('patientId');
            
            if (currentPatientId) {
                document.getElementById('patientId').textContent = currentPatientId;
                loadExistingRemarks(currentPatientId);
            }
        });
        
        async function loadExistingRemarks(patientId) {
            try {
                const response = await fetch(`getPatientRemarks?patientId=${patientId}`);
                const remarks = await response.json();
                
                const existingRemarksDiv = document.getElementById('existingRemarks');
                
                if (remarks.length === 0) {
                    existingRemarksDiv.innerHTML = `
                        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #17a2b8;">
                            <h4>New Patient</h4>
                            <p>No previous remarks found. This appears to be a new patient.</p>
                        </div>
                    `;
                } else {
                    existingRemarksDiv.innerHTML = '<h3>Previous Remarks:</h3>';
                    remarks.sort((a, b) => new Date(b.date) - new Date(a.date));
                    
                    remarks.forEach(remark => {
                        existingRemarksDiv.innerHTML += `
                            <div style="border: 1px solid #ddd; padding: 15px; margin-bottom: 15px; border-radius: 5px; background-color: #f9f9f9;">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                    <strong style="color: #2c3e50;">Dr. ${remark.doctorName}</strong>
                                    <small style="color: #666;">${remark.date}</small>
                                </div>
                                <p style="margin: 0; line-height: 1.5;">${remark.remarks}</p>
                            </div>
                        `;
                    });
                }
            } catch (error) {
                console.error('Error loading remarks:', error);
            }
        }
        
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
                        doctorId: parseInt(localStorage.getItem('userId')) || 2
                    })
                });
                
                const result = await response.json();
                if (result.success) {
                    alert('Remark saved successfully');
                    document.getElementById('newRemark').value = '';
                    loadExistingRemarks(currentPatientId);
                } else {
                    alert('Failed to save remark');
                }
            } catch (error) {
                console.error('Error saving remark:', error);
                alert('Error saving remark');
            }
        }
    </script>
</body>
</html>










