<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PollyClinic - Login</title>
    <link rel="stylesheet" href="css/login.css">
    <link rel="stylesheet" href="css/bg-img.css">

</head>
<body>
    <div class="login-container">
        <div class="admin-toggle">
            <a href="#" id="adminToggle">Admin Login</a>
        </div>
        
        <div style="text-align: center; margin-bottom: 0px; width: 100%;">
            <div style="background-color: white; padding: 0px; border-radius: 8px; display: inline-block;">
                <img src="img/logo.webp" alt="Hospital Logo" style="max-width: 370px; height: auto;">
            </div>
        </div>
        <h1>PollyClinic Login</h1>
        
        <% if (request.getAttribute("errorMessage") != null) { %>
            <div style="color: red; text-align: center; margin-bottom: 15px; padding: 10px; background-color: #ffe6e6; border: 1px solid #ff9999; border-radius: 5px;">
                <%= request.getAttribute("errorMessage") %>
            </div>
        <% } %>
        
        <div class="user-types">
            <button class="user-btn active" id="receptionistBtn">Receptionist</button>
            <button class="user-btn" id="doctorBtn">Doctor</button>
            <button class="user-btn hidden" id="adminBtn">Admin</button>
        </div>
        
        <form id="loginForm" action="login" method="post">
            <div class="form-group">
                <label for="username">Username:</label>
                <input type="text" id="username" name="username" class="form-control" required>
            </div>
            
            <div class="form-group">
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" class="form-control" required>
            </div>
            
            <button type="submit" class="login-btn">Login</button>
        </form>
        
        
    </div>
<script src="js/login.js"></script>
</body>
</html>
