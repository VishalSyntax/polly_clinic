\r\n\r\n<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Time Slots - PollyClinic</title>
    <link rel="stylesheet" href="css/login.css">
    <link rel="stylesheet" href="css/common-sidebar.css">
    <link rel="stylesheet" href="css/manage-timeslots.css">
</head>
<body>
    <div class="sidebar">
      <div class="logo">
        <img src="img/logo.webp" alt="Hospital Logo">
      </div>
      <a href="admin-dashboard.jsp">Dashboard</a>
      <a href="manage-doctors.jsp">Manage Doctors</a>
      <a href="manage-staff.jsp">Manage Staff</a>
      <a href="manage-timeslots.jsp" class="active">Time Slots</a>
      <a href="reports.jsp">Reports</a>
      <a href="system-settings.jsp">Settings</a>
      <a href="logout" class="logout">Logout</a>
    </div>
    
    <div class="main-content">
      <div class="login-container">
        <h1>Manage Time Slots</h1>
        
        <div class="timeslot-form">
            <h3>Add New Time Slot</h3>
            <form id="timeslotForm">
                <div class="form-group">
                    <label for="newSlotTime">Time Slot:</label>
                    <input type="time" id="newSlotTime" class="form-control" required>
                </div>
                <button type="submit" class="login-btn">Add Time Slot</button>
            </form>
        </div>
        
        <div class="timeslot-form">
            <h3>Current Time Slots</h3>
            <div class="slots-grid" id="slotsGrid">
                <!-- Time slots will be loaded here -->
            </div>
        </div>
      </div>
    </div>
    
    <script src="js/manage-timeslots.js"></script>
</body>
</html>












