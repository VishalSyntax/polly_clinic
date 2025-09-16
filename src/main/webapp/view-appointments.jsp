\r\n<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>View Appointments - PollyClinic</title>
    <link href="css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="css/login.css">
    <link rel="stylesheet" href="css/appointments-table.css">
    <link rel="stylesheet" href="css/bootstrap-sidebar-override.css">

</head>
<body>
    <div class="sidebar">
      <div class="logo">
        <img src="img/logo.webp" alt="Hospital Logo">
      </div>
      <a href="receptionist-dashboard.jsp">Dashboard</a>
      <a href="appointment-booking.jsp">Book Appointment</a>
      <a href="view-appointments.jsp" class="active">View Appointments</a>
      <a href="patient_search.jsp">Patient Search</a>
      <a href="index.jsp" class="logout">Logout</a>
    </div>
    
    <div class="main-content">
        <div class="login-container" style="width: 70%; max-width: none;">
            <h1>View Appointments</h1>
            
            <div class="text-center mb-3">
                <div class="btn-group" role="group" aria-label="Appointment filter">
                    <input type="radio" class="btn-check" name="appointmentFilter" id="todayFilter" value="today" checked>
                    <label class="btn btn-outline-primary" for="todayFilter">Today's</label>
                    
                    <input type="radio" class="btn-check" name="appointmentFilter" id="allFilter" value="all">
                    <label class="btn btn-outline-primary" for="allFilter">All</label>
                    
                    <input type="radio" class="btn-check" name="appointmentFilter" id="cancelledFilter" value="cancelled">
                    <label class="btn btn-outline-primary" for="cancelledFilter">Cancelled</label>
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
                            <tbody id="appointmentsTableBody">
                                
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>

    
    <div class="modal fade" id="historyModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Patient Appointment History</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body" id="historyContent">
                  
                </div>
            </div>
        </div>
    </div>

 
    <div class="modal fade" id="modifyModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Modify Appointment</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="modifyForm">
                        <div class="mb-3">
                            <label for="modifyDoctor" class="form-label">Select Doctor:</label>
                            <select id="modifyDoctor" class="form-select" required>
                                <option value="">Choose Doctor</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="modifyDate" class="form-label">New Date:</label>
                            <input type="date" id="modifyDate" class="form-control" required>
                        </div>
                        <div class="mb-3">
                            <label for="modifyTime" class="form-label">New Time:</label>
                            <select id="modifyTime" class="form-select" required>
                                <option value="09:00">09:00 AM</option>
                                <option value="09:30">09:30 AM</option>
                                <option value="10:00">10:00 AM</option>
                                <option value="10:30">10:30 AM</option>
                                <option value="11:00">11:00 AM</option>
                                <option value="11:30">11:30 AM</option>
                                <option value="14:00">02:00 PM</option>
                                <option value="14:30">02:30 PM</option>
                                <option value="15:00">03:00 PM</option>
                                <option value="15:30">03:30 PM</option>
                                <option value="16:00">04:00 PM</option>
                                <option value="16:30">04:30 PM</option>
                            </select>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" onclick="updateAppointment()">Update Appointment</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Cancel Appointment Modal -->
    <div class="modal fade" id="cancelModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Cancel Appointment</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label for="cancelRemark" class="form-label">Cancellation Reason:</label>
                        <textarea id="cancelRemark" class="form-control" rows="3" placeholder="Enter reason for cancellation" required></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-danger" onclick="confirmCancellation()">Confirm Cancel</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Cancel Remarks Modal -->
    <div class="modal fade" id="cancelRemarksModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Cancellation History</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body" id="cancelRemarksContent">
                    <!-- Cancel remarks will be loaded here -->
                </div>
            </div>
        </div>
    </div>
    
<script src="js/bootstrap.bundle.min_2.js"></script>
    <script src="js/view-appointments.js"></script>
    <script>\r\n        // Prevent back button access after logout\r\n        history.pushState(null, null, location.href);\r\n        window.onpopstate = function () {\r\n            history.go(1);\r\n        };\r\n    </script>\r\n</body>
</html>












