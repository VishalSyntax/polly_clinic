<%\r\n    response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");`r`n    response.setHeader("Pragma", "no-cache");`r`n    response.setDateHeader("Expires", 0);\r\n%>`r`n<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generate Prescription - AppointCare</title>
    <link rel="stylesheet" href="css/login.css">
    <link rel="stylesheet" href="css/prescription-form.css">
    <script src="https://cdn.emailjs.com/dist/email.min.js"></script>
</head>
<body>
    <div class="sidebar">
        <div class="logo">
            <img src="img/logo.webp" alt="Hospital Logo">
        </div>
        <a href="doctor-appointments.jsp">Today's Appointments</a>
        <a href="all-appointments.jsp">All Appointments</a>
        <a href="completed-appointments.jsp">Completed Appointments</a>
        <a href="index.jsp" class="logout">Logout</a>
    </div>

    <div class="main-content">
        <div class="login-container">
            <div class="current-time" id="currentDateTime"></div>
            <h1>🩺 Prescription Form</h1>
            <p style="color: #666; margin-bottom: 20px;">Patient ID: <span id="patientId" style="font-weight: bold;"></span></p>
            
            <form id="prescriptionForm" onsubmit="submitPrescription(event)">
                <div id="medicineContainer">
                    <div class="medicine-row">
                        <div class="row">
                            <div class="col">
                                <label class="form-label">Medicine Name:</label>
                                <input type="text" class="form-control medicine-name" required>
                            </div>
                            <div class="col">
                                <label class="form-label">Quantity:</label>
                                <input type="text" class="form-control quantity" required>
                            </div>
                            <div class="col">
                                <label class="form-label">Timing:</label>
                                <select class="form-control timing" required>
                                    <option value="">Select Timing</option>
                                    <option value="Morning - Before Meal">Morning - Before Meal</option>
                                    <option value="Morning - After Meal">Morning - After Meal</option>
                                    <option value="Evening - Before Meal">Evening - Before Meal</option>
                                    <option value="Evening - After Meal">Evening - After Meal</option>
                                    <option value="Night - Before Meal">Night - Before Meal</option>
                                    <option value="Night - After Meal">Night - After Meal</option>
                                    <option value="Twice Daily">Twice Daily</option>
                                    <option value="Thrice Daily">Thrice Daily</option>
                                </select>
                            </div>
                            <div style="width: 50px;">
                                <label class="form-label">&nbsp;</label>
                                <button type="button" class="remove-btn" onclick="removeMedicine(this)" style="display:none;">×</button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div style="text-align: center;">
                    <button type="button" class="add-medicine-btn" onclick="addMedicine()">+ Add Medicine</button>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="login-btn btn-secondary" onclick="printPrescription()">Print</button>
                    <button type="submit" class="login-btn">Submit Prescription</button>
                </div>
            </form>
        </div>
    </div>

    <script src="js/prescription-form.js"></script>
</body>
</html>


