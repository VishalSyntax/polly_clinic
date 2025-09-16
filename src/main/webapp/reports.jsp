<%\r\n    response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");`r`n    response.setHeader("Pragma", "no-cache");`r`n    response.setDateHeader("Expires", 0);\r\n%>`r`n<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reports - PollyClinic</title>
    <link rel="stylesheet" href="css/login.css">
    <link rel="stylesheet" href="css/common-sidebar.css">
    <link rel="stylesheet" href="css/appointments-table.css">
</head>
<body>
    <div class="sidebar">
        <div class="logo">
            <img src="img/logo.webp" alt="Hospital Logo">
        </div>
        <a href="admin-dashboard.jsp">Dashboard</a>
        <a href="manage-doctors.jsp">Manage Doctors</a>
        <a href="manage-staff.jsp">Manage Staff</a>
        <a href="reports.jsp" class="active">Reports</a>
        <a href="system-settings.jsp">Settings</a>
        <a href="index.jsp" class="logout">Logout</a>
    </div>
    
    
</body>
</html>


