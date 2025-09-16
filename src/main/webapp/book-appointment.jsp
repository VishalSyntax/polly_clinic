\r\n<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Patient Registration - PollyClinic</title>
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
        
        .form-row {
            display: flex;
            gap: 15px;
        }
        
        .form-row .form-group {
            flex: 1;
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
      <a href="receptionist-dashboard.jsp">Dashboard</a>
      <a href="index.jsp" class="logout">Logout</a>
    </div>
    
    <div class="main-content">
      <div class="login-container">
        <h1>New Patient Registration</h1>
        
        <form id="patientForm">
            <div class="form-row">
                <div class="form-group">
                    <label for="firstName">First Name:</label>
                    <input type="text" id="firstName" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="lastName">Last Name:</label>
                    <input type="text" id="lastName" class="form-control" required>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="phone">Phone Number:</label>
                    <input type="tel" id="phone" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="email">Email:</label>
                    <input type="email" id="email" class="form-control">
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="dob">Date of Birth:</label>
                    <input type="date" id="dob" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="gender">Gender:</label>
                    <select id="gender" class="form-control" required>
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>
            </div>
            
            <div class="form-group">
                <label for="address">Address:</label>
                <textarea id="address" class="form-control" rows="3"></textarea>
            </div>
            
            <div class="form-group">
                <label for="emergencyContact">Emergency Contact:</label>
                <input type="tel" id="emergencyContact" class="form-control">
            </div>
            
            <div class="form-group">
                <label for="medicalHistory">Medical History:</label>
                <textarea id="medicalHistory" class="form-control" rows="3" placeholder="Any existing conditions, allergies, medications..."></textarea>
            </div>
            
            <button type="submit" class="login-btn">Register Patient</button>
            <button type="button" class="login-btn" onclick="window.location.href='appointment-booking.jsp'" style="background-color: #3498db; margin-left: 10px;">Book Appointment</button>
        </form>
      </div>
    </div>
    
    <script>
        document.getElementById('patientForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const patientData = {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                phone: document.getElementById('phone').value,
                email: document.getElementById('email').value,
                dob: document.getElementById('dob').value,
                gender: document.getElementById('gender').value,
                address: document.getElementById('address').value,
                emergencyContact: document.getElementById('emergencyContact').value,
                medicalHistory: document.getElementById('medicalHistory').value
            };
            
            // Generate patient ID
            const patientId = 'P' + Date.now().toString().slice(-6);
            
            alert(`Patient registered successfully!\nPatient ID: ${patientId}\nName: ${patientData.firstName} ${patientData.lastName}`);
            
            // Redirect to appointment booking
            if(confirm('Would you like to book an appointment now?')) {
                window.location.href = 'appointment-booking.jsp';
            } else {
                this.reset();
            }
        });
    </script>
</body>
</html>










