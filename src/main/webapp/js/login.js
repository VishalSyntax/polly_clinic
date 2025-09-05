document.addEventListener('DOMContentLoaded', function() {
    const adminToggle = document.getElementById('adminToggle');
    const userTypeSelect = document.getElementById('userType');
    
    if (adminToggle && userTypeSelect) {
        adminToggle.addEventListener('change', function() {
            if (this.checked) {
                // Show admin option
                let adminOption = userTypeSelect.querySelector('option[value="admin"]');
                if (!adminOption) {
                    adminOption = document.createElement('option');
                    adminOption.value = 'admin';
                    adminOption.textContent = 'Admin';
                    userTypeSelect.appendChild(adminOption);
                }
            } else {
                // Hide admin option and reset to receptionist
                const adminOption = userTypeSelect.querySelector('option[value="admin"]');
                if (adminOption) {
                    adminOption.remove();
                }
                userTypeSelect.value = 'receptionist';
            }
        });
    }
});

async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const userType = document.getElementById('userType').value;
    
    if (!username || !password || !userType) {
        alert('Please fill in all fields');
        return;
    }
    
    try {
        const response = await fetch('login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&userType=${encodeURIComponent(userType)}`
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Store user info in localStorage
            localStorage.setItem('userId', result.userId);
            localStorage.setItem('username', result.username);
            localStorage.setItem('userType', result.userType);
            localStorage.setItem('loginTime', new Date().toISOString());
            if (result.doctorName) {
                localStorage.setItem('doctorName', result.doctorName);
            }
            if (result.name) {
                localStorage.setItem('userName', result.name);
            }
            
            // Redirect based on user type
            switch(result.userType) {
                case 'admin':
                    window.location.href = 'admin-dashboard.html';
                    break;
                case 'doctor':
                    window.location.href = 'doctor-appointments.html';
                    break;
                case 'receptionist':
                    window.location.href = 'receptionist-dashboard.html';
                    break;
            }
        } else {
            alert(result.message || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed. Please try again.');
    }
}