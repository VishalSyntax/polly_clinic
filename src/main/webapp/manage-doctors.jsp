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
    <title>Manage Doctors - PollyClinic</title>
    <link rel="stylesheet" href="css/login.css">
    <link rel="stylesheet" href="css/common-sidebar.css">
    <link rel="stylesheet" href="css/manage-doctors.css">
</head>
<body>
    <div class="sidebar">
      <div class="logo">
        <img src="img/logo.webp" alt="Hospital Logo">
      </div>
      <a href="admin-dashboard.jsp">Dashboard</a>
      <a href="manage-doctors.jsp" class="active">Manage Doctors</a>
      <a href="manage-staff.jsp">Manage Staff</a>
      <a href="reports.jsp">Reports</a>
      <a href="system-settings.jsp">Settings</a>
      <a href="index.jsp" class="logout">Logout</a>
    </div>
    
    <div class="main-content">
      <div class="login-container" style="width: 50%; max-width: none;">
        <h1>Add New Doctor</h1>
        
        <form id="doctorForm">
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
                    <label for="specialization">Specialization:</label>
                    <input type="text" id="specialization" class="form-control" required>
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
            
            <div class="form-group">
                <label for="license">License Number:</label>
                <input type="text" id="license" class="form-control" required>
            </div>
            
            <button type="submit" class="login-btn">Add Doctor</button>
        </form>
      </div>
      
      <div class="doctors-table">
        <h2>Existing Doctors</h2>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Specialization</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="doctorsTableBody">
                <!-- Doctors will be loaded via JDBC -->
            </tbody>
        </table>
      </div>
    </div>
    
    <script>
        // Prevent back button access after logout
        if (!${user != null ? 'true' : 'false'}) {
            window.location.replace('index.jsp');
        }
    </script>
    <script src="js/manage-doctors.js"></script>
</body>
</html>
