<%\r\n    response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");`r`n    response.setHeader("Pragma", "no-cache");`r`n    response.setDateHeader("Expires", 0);\r\n%>`r`n<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Completed Appointments - PollyClinic</title>
    <link href="css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="css/login.css">
    <link rel="stylesheet" href="css/completed-appointments.css">
    <link rel="stylesheet" href="css/bootstrap-sidebar-override.css">
</head>
<body>
    <div class="sidebar">
      <div class="logo">
        <img src="img/logo.webp" alt="Hospital Logo">
      </div>
      <a href="doctor-appointments.jsp">Today's Appointments</a>
      <a href="all-appointments.jsp">All Appointments</a>
      <a href="completed-appointments.jsp" class="active">Completed Appointments</a>
      <a href="index.jsp" class="logout">Logout</a>
    </div>

    <div class="main-content">
        <div class="login-container" style="width: 80%; max-width: none;">
            <h1>📋 Completed Appointments</h1>
            
            <div class="card mb-4">
                <div class="card-body">
                    <div class="row g-3 align-items-end">
                        <div class="col-md-8">
                            <label for="searchInput" class="form-label">Search:</label>
                            <input type="text" class="form-control" id="searchInput" placeholder="Search by Patient ID, Contact Number, or Patient Name">
                        </div>
                        <div class="col-md-4">
                            <button class="btn btn-primary me-2" onclick="searchAppointments()">Search</button>
                            <button class="btn btn-secondary" onclick="loadAllCompletedAppointments()">Show All</button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="card">
                <div class="card-body p-0">
                    <div class="table-responsive">
                        <table class="table table-striped table-hover mb-0">
                            <thead class="table-light">
                                <tr>
                                    <th>Date</th>
                                    <th>Patient ID</th>
                                    <th>Patient Name</th>
                                    <th>Contact</th>
                                    <th>Doctor</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="completedAppointmentsBody">
                                
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Bootstrap Prescription Modal -->
    <div class="modal fade" id="prescriptionModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Prescription Details</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body" id="prescriptionContent">
                    <!-- Prescription content will be loaded here -->
                </div>
            </div>
        </div>
    </div>

    <script src="js/bootstrap.bundle.min_2.js"></script>
    <script src="js/completed-appointments.js"></script>
</body>
</html>


