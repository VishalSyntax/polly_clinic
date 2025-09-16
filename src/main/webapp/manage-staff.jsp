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
    <title>Manage Staff - AppointCare</title>
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
                <!-- Staff will be loaded via JDBC -->
            </tbody>
        </table>
      </div>
    </div>
    
    <script>
        // Prevent back button access after logout
        if (!${user != null ? 'true' : 'false'}) {
            window.location.replace('index.jsp');
        }
        
        document.getElementById('staffForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const staffData = {
                username: document.getElementById('username').value,
                password: document.getElementById('password').value,
                name: document.getElementById('name').value,
                shift: document.getElementById('shift').value,
                phone: document.getElementById('phone').value,
                email: document.getElementById('email').value
            };
            
            const editId = this.dataset.editId;
            const isEdit = !!editId;
            
            if (isEdit) {
                staffData.id = parseInt(editId);
            }
            
            try {
                const url = isEdit ? 'updateReceptionist' : 'addReceptionist';
                const method = 'POST';
                const headers = isEdit ? 
                    { 'Content-Type': 'application/json' } : 
                    { 'Content-Type': 'application/x-www-form-urlencoded' };
                const body = isEdit ? 
                    JSON.stringify(staffData) : 
                    new URLSearchParams(staffData);
                
                const response = await fetch(url, { method, headers, body });
                const result = await response.json();
                
                alert(result.message || (isEdit ? 'Receptionist updated successfully' : 'Receptionist added successfully'));
                
                if (result.success) {
                    this.reset();
                    delete this.dataset.editId;
                    document.querySelector('h1').textContent = 'Add New Receptionist';
                    document.querySelector('button[type="submit"]').textContent = 'Add Receptionist';
                    loadReceptionists();
                }
            } catch (error) {
                alert(isEdit ? 'Failed to update receptionist' : 'Failed to add receptionist');
            }
        });
        
        document.addEventListener('DOMContentLoaded', function() {
            loadReceptionists();
        });
        
        async function loadReceptionists() {
            try {
                const response = await fetch('getAllReceptionists');
                const receptionists = await response.json();
                
                const tbody = document.getElementById('staffTableBody');
                tbody.innerHTML = '';
                
                receptionists.forEach(receptionist => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${receptionist.id}</td>
                        <td>${receptionist.name}</td>
                        <td>${receptionist.phone}</td>
                        <td>${receptionist.email}</td>
                        <td>${receptionist.shift}</td>
                        <td><span class="badge ${receptionist.isActive ? 'bg-success' : 'bg-danger'}">${receptionist.isActive ? 'Active' : 'Inactive'}</span></td>
                        <td>
                            <button class="btn btn-sm btn-warning" onclick="editStaff(${receptionist.id})">Edit</button>
                            <button class="btn btn-sm ${receptionist.isActive ? 'btn-danger' : 'btn-success'}" onclick="toggleStatus(${receptionist.id})">${receptionist.isActive ? 'Deactivate' : 'Activate'}</button>
                        </td>
                    `;
                    tbody.appendChild(row);
                });
            } catch (error) {
                console.error('Error loading receptionists:', error);
            }
        }
        
        function editStaff(id) {
            fetch('getAllReceptionists')
                .then(response => response.json())
                .then(receptionists => {
                    const receptionist = receptionists.find(r => r.id === id);
                    if (receptionist) {
                        document.getElementById('username').value = receptionist.username;
                        document.getElementById('name').value = receptionist.name;
                        document.getElementById('phone').value = receptionist.phone;
                        document.getElementById('email').value = receptionist.email;
                        document.getElementById('shift').value = receptionist.shift;
                        
                        const form = document.getElementById('staffForm');
                        form.dataset.editId = id;
                        document.querySelector('h1').textContent = 'Edit Receptionist';
                        document.querySelector('button[type="submit"]').textContent = 'Update Receptionist';
                    }
                });
        }
        
        async function toggleStatus(id) {
            try {
                const response = await fetch('toggleUserStatus', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId: id })
                });
                
                const result = await response.json();
                if (result.success) {
                    loadReceptionists();
                } else {
                    alert('Failed to update status');
                }
            } catch (error) {
                console.error('Error toggling status:', error);
            }
        }
    </script>
</body>
</html>
