\r\n<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Patient History - PollyClinic</title>
    <link rel="stylesheet" href="css/login.css">
    <link rel="stylesheet" href="css/common-sidebar.css">
    <link rel="stylesheet" href="css/appointments-table.css">
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
        <a href="patient-history.jsp" class="active">Patient History</a>
        <a href="index.jsp" class="logout">Logout</a>
    </div>
    
    <div class="main-content">
        <div class="login-container" style="width: 95%; max-width: none;">
            <h1>📋 Patient History</h1>
            <p>Patient ID: <span id="patientId"></span></p>
            
            <div class="appointments-table">
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Doctor</th>
                            <th>Status</th>
                            <th>Remarks</th>
                        </tr>
                    </thead>
                    <tbody id="historyTableBody">
                        <!-- History loaded via AJAX -->
                    </tbody>
                </table>
            </div>
            
            <div style="margin-top: 20px;">
                <button class="login-btn" onclick="window.history.back()">Back</button>
            </div>
        </div>
    </div>
    
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const urlParams = new URLSearchParams(window.location.search);
            const patientId = urlParams.get('patientId');
            
            if (patientId) {
                document.getElementById('patientId').textContent = patientId;
                loadPatientHistory(patientId);
            }
        });
        
        async function loadPatientHistory(patientId) {
            try {
                const response = await fetch(`getPatientHistory?patientId=${patientId}`);
                const history = await response.json();
                
                const tbody = document.getElementById('historyTableBody');
                tbody.innerHTML = '';
                
                if (history.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No history found</td></tr>';
                    return;
                }
                
                history.forEach(appointment => {
                    const row = document.createElement('tr');
                    const statusClass = appointment.status === 'completed' ? 'success' : 
                                       appointment.status === 'cancelled' ? 'danger' : 'info';
                    
                    row.innerHTML = `
                        <td>${appointment.date}</td>
                        <td>${appointment.time}</td>
                        <td>${appointment.doctorName}</td>
                        <td><span class="badge bg-${statusClass}">${appointment.status.toUpperCase()}</span></td>
                        <td>${appointment.remarks || 'No remarks'}</td>
                    `;
                    tbody.appendChild(row);
                });
            } catch (error) {
                console.error('Error loading patient history:', error);
            }
        }
    </script>
</body>
</html>










