\r\n<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Patient Profile - PollyClinic</title>
    <link rel="stylesheet" href="css/login.css">
    <style>
        body {
            background-image: url("img/sono-background.png");
            background-color: #cccccc;
            margin: 0;
        }
        
        .sidebar {
          height: 100vh;
          width: 250px;
          position: fixed;
          top: 0;
          left: 0;
          background-color: #2c3e50;
          padding-top: 20px;
        }
        
        .sidebar .logo {
          text-align: center;
          padding: 10px;
          border-bottom: 2px solid #34495e;
          margin-bottom: 10px;
          background-color: white;
          margin: 10px;
          border-radius: 8px;
        }
        
        .sidebar .logo img {
          max-width: 220px;
          height: auto;
        }
        
        .sidebar a {
          display: block;
          color: white;
          padding: 16px 20px;
          text-decoration: none;
          font-size: 16px;
          border-bottom: 1px solid #34495e;
        }
        
        .sidebar a:hover {
          background-color: #34495e;
        }
        
        .sidebar a.active {
          background-color: #3498db;
        }
        
        .sidebar .logout {
          position: absolute;
          bottom: 20px;
          width: calc(100% - 40px);
          background-color: #e74c3c;
        }
        
        .sidebar .logout:hover {
          background-color: #c0392b;
        }
        
        .main-content {
          margin-left: 250px;
          padding: 20px;
        }
        
        .profile-header {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .profile-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }
        
        .info-section {
            background: white;
            padding: 20px;
            border-radius: 8px;
        }
        
        .info-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
        }
        
        .info-row:last-child {
            border-bottom: none;
        }
        
        .appointments-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        
        .appointments-table th,
        .appointments-table td {
            padding: 10px;
            text-align: left;
            border: 1px solid #ddd;
        }
        
        .appointments-table th {
            background-color: #f8f9fa;
        }
    </style>
</head>
<body>
    <div class="sidebar">
      <div class="logo">
        <img src="img/logo.webp" alt="Hospital Logo">
      </div>
      <a href="main.jsp">Patient Info</a>
      <a href="appointment-booking.jsp">Book Appointment</a>
      <a href="patient_search.jsp">Patient Search</a>
      <a href="appointment-management.jsp">Appointments</a>
      <a href="patient-profile.jsp" class="active">Patient Profile</a>
      <a href="receptionist-dashboard.jsp">Dashboard</a>
      <a href="index.jsp" class="logout">Logout</a>
    </div>
    
    <div class="main-content">
        <div class="profile-header">
            <div>
                <h1>Patient Profile</h1>
                <p>Patient ID: <span id="patientId">--</span></p>
            </div>
            <div>
                <button class="login-btn" onclick="editProfile()">Edit Profile</button>
                <button class="login-btn" onclick="window.location.href='appointment-booking.jsp'" style="background-color: #28a745; margin-left: 10px;">Book Appointment</button>
            </div>
        </div>
        
        <div class="profile-info">
            <div class="info-section">
                <h3>Personal Information</h3>
                <div class="info-row">
                    <strong>Full Name:</strong>
                    <span id="fullName">--</span>
                </div>
                <div class="info-row">
                    <strong>Date of Birth:</strong>
                    <span id="dob">--</span>
                </div>
                <div class="info-row">
                    <strong>Gender:</strong>
                    <span id="gender">--</span>
                </div>
                <div class="info-row">
                    <strong>Phone:</strong>
                    <span id="phone">--</span>
                </div>
                <div class="info-row">
                    <strong>Email:</strong>
                    <span id="email">--</span>
                </div>
                <div class="info-row">
                    <strong>Address:</strong>
                    <span id="address">--</span>
                </div>
                <div class="info-row">
                    <strong>Emergency Contact:</strong>
                    <span id="emergencyContact">--</span>
                </div>
            </div>
            
            <div class="info-section">
                <h3>Medical Information</h3>
                <div class="info-row">
                    <strong>Blood Group:</strong>
                    <span id="bloodGroup">--</span>
                </div>
                <div class="info-row">
                    <strong>Allergies:</strong>
                    <span id="allergies">--</span>
                </div>
                <div class="info-row">
                    <strong>Current Medications:</strong>
                    <span id="medications">--</span>
                </div>
                <div class="info-row">
                    <strong>Medical History:</strong>
                    <span id="medicalHistory">--</span>
                </div>
                <div class="info-row">
                    <strong>Last Visit:</strong>
                    <span id="lastVisit">--</span>
                </div>
            </div>
        </div>
        
        <div class="info-section" style="margin-top: 20px;">
            <h3>Appointment History</h3>
            <table class="appointments-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Doctor</th>
                        <th>Reason</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="appointmentHistoryBody">
                    <!-- Appointment history will loaded by JDBC -->
                </tbody>
            </table>
        </div>
    </div>
    
    <script>
        function editProfile() {
            alert('Edit profile functionality would open a form to modify patient details');
        }
        
        function viewDetails() {
            alert('View appointment details functionality');
        }
        
        function cancelAppointment() {
            if(confirm('Are you sure you want to cancel this appointment?')) {
                alert('Appointment cancelled successfully');
            }
        }
    </script>
</body>
</html>










