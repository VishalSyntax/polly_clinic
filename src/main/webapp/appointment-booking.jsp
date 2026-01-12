<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Book Appointment - AppointCare</title>
    <link href="css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="css/login.css">
    <link rel="stylesheet" href="css/common-sidebar.css">
    <link rel="stylesheet" href="css/appointment-booking.css">
    <link rel="stylesheet" href="css/bootstrap-sidebar-override.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" rel="stylesheet">
    <script src="https://cdn.emailjs.com/dist/email.min.js"></script>
</head>
<body>
    <div class="sidebar">
      <div class="logo">
        <img src="img/logo.webp" alt="Hospital Logo">
      </div>
      <a href="receptionist-dashboard.jsp">Dashboard</a>
      <a href="appointment-booking.jsp" class="active">Book Appointment</a>
      <a href="view-appointments.jsp">View Appointments</a>
      <a href="patient_search.jsp">Patient Search</a>
      <a href="logout" class="logout">Logout</a>
    </div>
    
    <div class="main-content">
      <div class="login-container" style="width: 60%; max-width: none;">
        <div class="user-info" id="userInfo" style="background: #f8f9fa; padding: 10px; border-radius: 5px; margin-bottom: 15px; font-size: 14px;">
            <!-- User info will be loaded here -->
        </div>
        <h1>Book New Appointment</h1>
        
        <form id="appointmentForm">
            <div class="form-group">
                <label for="doctor">Select Doctor:</label>
                <select id="doctor" class="form-control" required>
                    <option value="">Choose Doctor</option>
                </select>
            </div>
            
            <div class="form-group">
                <label for="appointmentDate">Select Date:</label>
                <input type="date" id="appointmentDate" class="form-control" required>
            </div>
            
            <div class="form-group">
                <label>Select Time Slot:</label>
                <div class="time-slots" id="timeSlots">
                    <!-- Time slots will be loaded -->
                </div>
                <input type="hidden" id="selectedTime" required>
            </div>
            
            <h2>Patient Information</h2>
            
            <div class="form-group">
                <label for="patientName">Patient Name:</label>
                <input type="text" id="patientName" class="form-control" required>
            </div>
            
            <div class="form-group">
                <label for="address">Address:</label>
                <input type="text" id="address" class="form-control" required>
            </div>
            
            <div class="form-group">
                <label for="contactNumber">Contact Number:</label>
                <input type="tel" id="contactNumber" class="form-control" required>
            </div>
            
            <div class="form-group">
                <label for="email">Email (Optional):</label>
                <input type="email" id="email" class="form-control">
            </div>
            
            <button type="submit" class="login-btn">Book Appointment</button>
        </form>
      </div>
    </div>
    
    <script src="js/bootstrap.bundle.min.js"></script>
    <script src="js/appointment-booking.js"></script>
    <script>\r\n        // Prevent back button access after logout\r\n        history.pushState(null, null, location.href);\r\n        window.onpopstate = function () {\r\n            history.go(1);\r\n        };\r\n    </script>\r\n</body>
</html>











