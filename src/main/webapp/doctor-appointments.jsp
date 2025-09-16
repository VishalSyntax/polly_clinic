<%
    response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    response.setHeader("Pragma", "no-cache");
    response.setDateHeader("Expires", 0);
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Doctor Appointments - PollyClinic</title>
    <link rel="stylesheet" href="css/login.css">
    <link rel="stylesheet" href="css/doctor-appointments.css">
    <script src="https://cdn.emailjs.com/dist/email.min.js"></script>
</head>
<body>
    <div class="sidebar">
        <div class="logo">
            <img src="img/logo.webp" alt="Hospital Logo">
        </div>
        <a href="doctor-appointments.jsp" class="active">Today's Appointments</a>
        <a href="all-appointments.jsp">All Appointments</a>
        <a href="completed-appointments.jsp">Completed Appointments</a>
        <a href="index.jsp" class="logout">Logout</a>
    </div>

    <div class="main-content">
        <div class="login-container" style="width: 80%; max-width: none;">
            <div class="current-time" id="currentDateTime"></div>
            <div class="doctor-info" id="doctorInfo" style="background: #f8f9fa; padding: 10px; border-radius: 5px; margin-bottom: 15px; font-size: 14px;">
                
            </div>
            <h1>📅 Today's Appointments - Dr. ${user}</h1>
            
            <div class="appointments-table">
                <table>
                    <thead>
                        <tr>
                            <th>Patient ID</th>
                            <th>Time Slot</th>
                            <th>Patient Name</th>
                            <th>Contact Number</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="appointmentsTableBody">
                      
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Remarks Modal -->
    <div id="remarksModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Patient Remarks</h3>
                <span class="close" onclick="closeModal()">&times;</span>
            </div>
            <div class="modal-body">
                <div id="existingRemarks"></div>
                <div style="margin-top: 20px;">
                    <label for="newRemark">Add New Remark:</label>
                    <textarea class="form-control" id="newRemark" rows="3" style="margin-top: 5px;"></textarea>
                </div>
            </div>
            <div style="margin-top: 20px; text-align: right;">
                <button class="login-btn" onclick="closeModal()" style="background-color: #6c757d; margin-right: 10px;">Close</button>
                <button class="login-btn" onclick="saveRemark()">Save Remark</button>
            </div>
        </div>
    </div>

    <script>
        // Prevent back button access after logout
        if (!${user != null ? 'true' : 'false'}) {
            window.location.replace('index.jsp');
        }
    </script>
    <script src="js/doctor-appointments.js"></script>
</body>
</html>
