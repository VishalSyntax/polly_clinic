\r\n\r\n<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PollyClinic - Patient Search</title>
    
    <link href="css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="css/login.css">
    <link rel="stylesheet" href="css/appointments-table.css">
    <link rel="stylesheet" href="css/bootstrap-sidebar-override.css">
    
    <style>
        .time-slots {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 10px;
        }
        
        .time-slot {
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            cursor: pointer;
            background-color: #f8f9fa;
            transition: all 0.2s;
        }
        
        .time-slot:hover {
            background-color: #e9ecef;
        }
        
        .time-slot.selected {
            background-color: #007bff;
            color: white;
            border-color: #007bff;
        }
        
        .time-slot.unavailable {
            background-color: #dc3545;
            color: white;
            cursor: not-allowed;
            opacity: 0.7;
        }
        
        .time-slot.unavailable:hover {
            background-color: #dc3545;
        }
    </style>
    
</head>
<body>
    <div class="sidebar">
      <div class="logo">
        <img src="img/logo.webp" alt="Hospital Logo">
      </div>
      <a href="receptionist-dashboard.jsp">Dashboard</a>
      <a href="appointment-booking.jsp">Book Appointment</a>
      <a href="view-appointments.jsp">View Appointments</a>
      <a href="patient_search.jsp" class="active">Patient Search</a>
      <a href="index.jsp" class="logout">Logout</a>
    </div>
    
    <div class="main-content">
        <div class="login-container" style="width: 70%; max-width: none;">
            <h1>Patient Search</h1>
            
            <form id="searchForm">
                <div class="form-group">
                    <label for="searchType">Search by:</label>
                    <select id="searchType" class="form-control">
                        <option value="id">Patient ID</option>
                        <option value="contact">Contact Number</option>
                        <option value="name">Patient Name</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="searchTerm">Search Term:</label>
                    <input type="text" id="searchTerm" class="form-control" placeholder="Enter Patient ID, Contact Number, or Name" required>
                </div>
                
                <button type="submit" class="login-btn">Search Patients</button>
            </form>

            <div id="results" class="d-none" style="margin-top: 20px;">
                <h3>Search Results</h3>
                <div id="patientList"></div>
                <div id="noResults" class="alert alert-info d-none">No patients found.</div>
            </div>
        </div>
    </div>

 
    <div class="modal fade" id="bookingModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Book Appointment</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="quickBookingForm">
                        <div class="mb-3">
                            <label class="form-label">Patient: <span id="modalPatientName"></span></label>
                        </div>
                        <div class="mb-3">
                            <label for="modalDoctor" class="form-label">Select Doctor:</label>
                            <select id="modalDoctor" class="form-select" required>
                                <option value="">Choose Doctor</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="modalDate" class="form-label">Select Date:</label>
                            <input type="date" id="modalDate" class="form-control" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Select Time Slot:</label>
                            <div class="time-slots" id="modalTimeSlots">
                                
                            </div>
                            <input type="hidden" id="modalSelectedTime" required>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" onclick="submitQuickBooking()">Book Appointment</button>
                </div>
            </div>
        </div>
    </div>

    <script src="js/bootstrap.bundle.min_2.js"></script>
    <script src="js/patient-search.js?v=27"></script>
</body>
</html>











