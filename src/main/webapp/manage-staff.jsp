<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Staff - PollyClinic</title>
    <link rel="stylesheet" href="css/login.css">
    <link rel="stylesheet" href="css/common-sidebar.css">
    <link rel="stylesheet" href="css/manage-staff.css">
</head>
<body>
    <div class="sidebar">
      <div class="logo">
        <img src="img/logo.webp" alt="Hospital Logo">
      </div>
      <a href="admin-dashboard.jsp">Dashboard</a>
      <a href="manage-doctors.jsp">Manage Doctors</a>
      <a href="manage-staff.jsp" class="active">Manage Staff</a>
      <a href="reports.jsp">Reports</a>
      <a href="system-settings.jsp">Settings</a>
      <a href="index.jsp" class="logout">Logout</a>
    </div>
    
    <div class="main-content">
      <div class="login-container" style="width: 50%; max-width: none;">
        <h1>Add New Receptionist</h1>
        
        <form id="staffForm">
            <div class="form-row">
                <div class="form-group">
                    <label for="username">Username:</label>
                    <input type="text" id="username" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="password">Password:</label>
                    <input type="password" id="password" class="form-control" required>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="name">Full Name:</label>
                    <input type="text" id="name" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="shift">Shift Timing:</label>
                    <select id="shift" class="form-control" required>
                        <option value="">Select Shift</option>
                        <option value="morning">Morning (8 AM - 4 PM)</option>
                        <option value="evening">Evening (4 PM - 12 AM)</option>
                        <option value="night">Night (12 AM - 8 AM)</option>
                    </select>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="phone">Phone:</label>
                    <input type="tel" id="phone" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="email">Email:</label>
                    <input type="email" id="email" class="form-control" required>
                </div>
            </div>
            
            <button type="submit" class="login-btn">Add Receptionist</button>
        </form>
      </div>
      
      <div class="staff-table">
        <h2 style="padding: 20px; margin: 0;">Existing Receptionists</h2>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Shift</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="staffTableBody">
                
            </tbody>
        </table>
      </div>
    </div>
    
    <script src="js/manage-staff.js"></script>
</body>
</html>









