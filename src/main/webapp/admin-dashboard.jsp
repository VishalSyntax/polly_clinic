<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - PollyClinic</title>
    <link rel="stylesheet" href="css/login.css">
    <link rel="stylesheet" href="css/common-sidebar.css">
    <link rel="stylesheet" href="css/admin-dashboard.css">
</head>
<body>
    <div class="sidebar">
      <div class="logo">
        <img src="img/logo.webp" alt="Hospital Logo">
      </div>
      <a href="admin-dashboard.jsp" class="active">Dashboard</a>
      <a href="manage-doctors.jsp">Manage Doctors</a>
      <a href="manage-staff.jsp">Manage Staff</a>
      <a href="manage-timeslots.jsp">Time Slots</a>
      <a href="reports.jsp">Reports</a>
      <a href="system-settings.jsp">Settings</a>
      <a href="logout" class="logout">Logout</a>
    </div>
    
    <div class="main-content">
      <div class="login-container" style="width: 60%; max-width: none;">
        <h1>Admin Dashboard</h1>
        
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-number" id="totalPatients">0</div>
                <div>Total Patients</div>
            </div>
            <div class="stat-card">
                <div class="stat-number" id="activeDoctors">0</div>
                <div>Active Doctors</div>
            </div>
            <div class="stat-card">
                <div class="stat-number" id="staffMembers">0</div>
                <div>Staff Members</div>
            </div>
            <div class="stat-card">
                <div class="stat-number" id="todayAppointments">0</div>
                <div>Today's Appointments</div>
            </div>
        </div>
        
        <h2>Quick Actions</h2>
        <div class="admin-actions">
            <button class="login-btn" onclick="window.location.href='manage-doctors.jsp'">Add New Doctor</button>
            <button class="login-btn" onclick="window.location.href='manage-staff.jsp'">Add Staff Member</button>
            <button class="login-btn" onclick="window.location.href='reports.jsp'">View Reports</button>
            <button class="login-btn" onclick="window.location.href='system-settings.jsp'">System Settings</button>
        </div>
        
        <h2>Recent Activity</h2>
        <div class="activity-table">
            <table>
                <thead>
                    <tr>
                        <th>Time</th>
                        <th>Action</th>
                        <th>User</th>
                    </tr>
                </thead>
                <tbody id="activityTableBody">
                    <!-- Activity logs will loaded bye JDBC -->
                </tbody>
            </table>
        </div>
      </div>
    </div>
    
    <script>
        // Prevent back button access after logout
        window.addEventListener('load', function() {
            if (performance.navigation.type === 2) {
                window.location.replace('index.jsp');
            }
        });
        
        // Clear history on logout
        document.querySelector('.logout').addEventListener('click', function(e) {
            e.preventDefault();
            window.location.replace('index.jsp');
        });
    </script>
    <script src="js/admin-dashboard.js"></script>
</body>
</html>



