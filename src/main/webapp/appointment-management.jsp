<%\r\n    response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");`r`n    response.setHeader("Pragma", "no-cache");`r`n    response.setDateHeader("Expires", 0);\r\n%>`r`n<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Appointment Management - AppointCare</title>
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
        
        .filters {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            display: flex;
            gap: 15px;
            align-items: end;
        }
        
        .filter-group {
            flex: 1;
        }
        
        .appointments-table {
            background: white;
            border-radius: 8px;
            overflow: hidden;
        }
        
        .appointments-table table {
            width: 100%;
            border-collapse: collapse;
        }
        
        .appointments-table th,
        .appointments-table td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #eee;
        }
        
        .appointments-table th {
            background-color: #f8f9fa;
            font-weight: bold;
        }
        
        .status-badge {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
        }
        
        .status-confirmed { background-color: #d4edda; color: #155724; }
        .status-pending { background-color: #fff3cd; color: #856404; }
        .status-cancelled { background-color: #f8d7da; color: #721c24; }
        .status-completed { background-color: #d1ecf1; color: #0c5460; }
        
        .action-btn {
            padding: 4px 8px;
            margin: 2px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
        }
        
        .btn-view { background-color: #17a2b8; color: white; }
        .btn-edit { background-color: #ffc107; color: black; }
        .btn-cancel { background-color: #dc3545; color: white; }
        .btn-complete { background-color: #28a745; color: white; }
    </style>
</head>
<body>
    <div class="sidebar">
      <div class="logo">
        <img src="img/logo.webp" alt="Hospital Logo">
      </div>
      <a href="main.jsp">Patient Info</a>
      <a href="slot.jsp">Slot Booking</a>
      <a href="patient_search.jsp">Patient Search</a>
      <a href="appointment-management.jsp" class="active">Appointments</a>
      <a href="receptionist-dashboard.jsp">Dashboard</a>
      <a href="index.jsp" class="logout">Logout</a>
    </div>
    
    <div class="main-content">
        <h1>Appointment Management</h1>
        
        <div class="filters">
            <div class="filter-group">
                <label for="dateFilter">Date:</label>
                <input type="date" id="dateFilter" class="form-control">
            </div>
            <div class="filter-group">
                <label for="doctorFilter">Doctor:</label>
                <select id="doctorFilter" class="form-control">
                    <option value="">All Doctors</option>
                    <option value="dr_shruti">Dr. Shruti Patil</option>
                    <option value="dr_vishal">Dr. Vishal Patil</option>
                </select>
            </div>
            <div class="filter-group">
                <label for="statusFilter">Status:</label>
                <select id="statusFilter" class="form-control">
                    <option value="">All Status</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="pending">Pending</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="completed">Completed</option>
                </select>
            </div>
            <div class="filter-group">
                <button class="login-btn" onclick="filterAppointments()">Filter</button>
                <button class="login-btn" onclick="clearFilters()" style="background-color: #6c757d;">Clear</button>
            </div>
        </div>
        
        <div class="appointments-table">
            <table>
                <thead>
                    <tr>
                        <th>Appointment ID</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Patient</th>
                        <th>Doctor</th>
                        <th>Reason</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="appointmentsTableBody">
                    <!-- Appointments will be loaded via JDBC -->
                </tbody>
            </table>
        </div>
    </div>
    
    <script>
        function filterAppointments() {
            const date = document.getElementById('dateFilter').value;
            const doctor = document.getElementById('doctorFilter').value;
            const status = document.getElementById('statusFilter').value;
            
            alert(`Filtering appointments:\nDate: ${date || 'All'}\nDoctor: ${doctor || 'All'}\nStatus: ${status || 'All'}`);
        }
        
        function clearFilters() {
            document.getElementById('dateFilter').value = '';
            document.getElementById('doctorFilter').value = '';
            document.getElementById('statusFilter').value = '';
        }
        
        function viewAppointment(id) {
            alert(`Viewing appointment details for ${id}`);
        }
        
        function editAppointment(id) {
            alert(`Editing appointment ${id}`);
        }
        
        function cancelAppointment(id) {
            if(confirm(`Are you sure you want to cancel appointment ${id}?`)) {
                alert(`Appointment ${id} cancelled successfully`);
            }
        }
        
        function completeAppointment(id) {
            if(confirm(`Mark appointment ${id} as completed?`)) {
                alert(`Appointment ${id} marked as completed`);
            }
        }
    </script>
</body>
</html>


