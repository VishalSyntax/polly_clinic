<%\r\n    response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");`r`n    response.setHeader("Pragma", "no-cache");`r`n    response.setDateHeader("Expires", 0);\r\n%>`r`n<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Modify Appointment - PollyClinic</title>
    <link rel="stylesheet" href="css/login.css">
    <link rel="stylesheet" href="css/common-sidebar.css">
    <link rel="stylesheet" href="css/appointment-booking.css">
</head>
<body>
    <div class="sidebar">
        <div class="logo">
            <img src="img/logo.webp" alt="Hospital Logo">
        </div>
        <a href="receptionist-dashboard.jsp">Dashboard</a>
        <a href="appointment-booking.jsp">Book Appointment</a>
        <a href="view-appointments.jsp">View Appointments</a>
        <a href="patient_search.jsp">Patient Search</a>
        <a href="index.jsp" class="logout">Logout</a>
    </div>
    
    <div class="main-content">
        <div class="login-container" style="width: 60%; max-width: none;">
            <h1>🔄 Modify Appointment</h1>
            
            <form id="modifyForm">
                <div class="form-group">
                    <label for="appointmentId">Appointment ID:</label>
                    <input type="text" id="appointmentId" class="form-control" readonly>
                </div>
                
                <div class="form-group">
                    <label for="patientName">Patient Name:</label>
                    <input type="text" id="patientName" class="form-control" readonly>
                </div>
                
                <div class="form-group">
                    <label for="newDate">New Date:</label>
                    <input type="date" id="newDate" class="form-control" required>
                </div>
                
                <div class="form-group">
                    <label for="newTime">New Time:</label>
                    <select id="newTime" class="form-control" required>
                        <option value="">Select Time</option>
                        <option value="09:00">09:00 AM</option>
                        <option value="09:30">09:30 AM</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="10:30">10:30 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="11:30">11:30 AM</option>
                        <option value="14:00">02:00 PM</option>
                        <option value="14:30">02:30 PM</option>
                        <option value="15:00">03:00 PM</option>
                        <option value="15:30">03:30 PM</option>
                        <option value="16:00">04:00 PM</option>
                        <option value="16:30">04:30 PM</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <button type="submit" class="login-btn">Update Appointment</button>
                    <button type="button" class="login-btn" onclick="window.history.back()" style="background-color: #6c757d; margin-left: 10px;">Cancel</button>
                </div>
            </form>
        </div>
    </div>
    
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const urlParams = new URLSearchParams(window.location.search);
            const appointmentId = urlParams.get('appointmentId');
            
            if (appointmentId) {
                document.getElementById('appointmentId').value = appointmentId;
                loadAppointmentDetails(appointmentId);
            }
            
            // Set minimum date to today
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('newDate').min = today;
        });
        
        async function loadAppointmentDetails(appointmentId) {
            try {
                const response = await fetch(`getAppointmentDetails?appointmentId=${appointmentId}`);
                const appointment = await response.json();
                
                if (appointment) {
                    document.getElementById('patientName').value = appointment.patientName;
                }
            } catch (error) {
                console.error('Error loading appointment details:', error);
            }
        }
        
        document.getElementById('modifyForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const appointmentId = document.getElementById('appointmentId').value;
            const newDate = document.getElementById('newDate').value;
            const newTime = document.getElementById('newTime').value;
            
            try {
                const response = await fetch('modifyAppointment', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        appointmentId: appointmentId,
                        newDate: newDate,
                        newTime: newTime
                    })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    alert('Appointment updated successfully!');
                    window.location.href = 'view-appointments.jsp';
                } else {
                    alert('Failed to update appointment: ' + result.message);
                }
            } catch (error) {
                console.error('Error updating appointment:', error);
                alert('Error updating appointment');
            }
        });
    </script>
</body>
</html>


