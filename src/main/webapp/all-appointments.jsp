<%\r\n    response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");`r`n    response.setHeader("Pragma", "no-cache");`r`n    response.setDateHeader("Expires", 0);\r\n%>`r`n<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>All Appointments - AppointCare</title>
    <link rel="stylesheet" href="css/login.css">
    <link rel="stylesheet" href="css/doctor-appointments.css">
</head>
<body>
    <div class="sidebar">
        <div class="logo">
            <img src="img/logo.webp" alt="Hospital Logo">
        </div>
        <a href="doctor-appointments.jsp">Today's Appointments</a>
        <a href="all-appointments.jsp" class="active">All Appointments</a>
        <a href="completed-appointments.jsp">Completed Appointments</a>
        <a href="index.jsp" class="logout">Logout</a>
    </div>

    <div class="main-content">
        <div class="login-container" style="width: 80%; max-width: none;">
            <div class="current-time" id="currentDateTime"></div>
            <h1>📋 All Appointments</h1>
            
            <div class="appointments-table">
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Patient ID</th>
                            <th>Patient Name</th>
                            <th>Contact Number</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="appointmentsTableBody">
                        
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <script src="js/all-appointments.js"></script>


</body>
</html>


