document.addEventListener('DOMContentLoaded', function() {
    const adminToggle = document.getElementById('adminToggle');
    const adminBtn = document.getElementById('adminBtn');
    const receptionistBtn = document.getElementById('receptionistBtn');
    const doctorBtn = document.getElementById('doctorBtn');
    const loginForm = document.getElementById('loginForm');
    
    // to save last selected user type from localStorage but default to receptionist
    let selectedUserType = localStorage.getItem('lastSelectedUserType') || 'receptionist';
    
    //  for receptionist and doctor
    if (selectedUserType === 'receptionist' || selectedUserType === 'doctor') {
        selectUserType(selectedUserType);
    } else {
        selectedUserType = 'receptionist';
        selectUserType('receptionist');
    }
    
    // Admin toggle functionality
    if (adminToggle) {
        adminToggle.addEventListener('click', function(e) {
            e.preventDefault();
            if (adminBtn.classList.contains('hidden')) {
                adminBtn.classList.remove('hidden');
            } else {
                adminBtn.classList.add('hidden');
                if (selectedUserType === 'admin') {
                    selectUserType('receptionist');
                }
            }
        });
    }
    
    // User type button functionality
    receptionistBtn.addEventListener('click', () => selectUserType('receptionist'));
    doctorBtn.addEventListener('click', () => selectUserType('doctor'));
    adminBtn.addEventListener('click', () => selectUserType('admin'));
    
    function selectUserType(type) {
        // Remove active class from all buttons
        document.querySelectorAll('.user-btn').forEach(btn => btn.classList.remove('active'));
        
        // Add active class to selected button
        document.getElementById(type + 'Btn').classList.add('active');
        
        selectedUserType = type;
        
        // only for receptionist and doctor for checking
        if (type === 'receptionist' || type === 'doctor') {
            localStorage.setItem('lastSelectedUserType', type);
        }
    }
    
    // Form submission
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        await login();
    });
    
    async function login() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if (!username || !password) {
            alert('Please fill in all fields');
            return;
        }
        
        try {
            const response = await fetch('login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&userType=${encodeURIComponent(selectedUserType)}`
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Store user info in localStorage
                localStorage.setItem('userId', result.userId);
                localStorage.setItem('username', username);
                localStorage.setItem('userType', result.userType);
                localStorage.setItem('loginTime', new Date().toISOString());
                if (result.doctorName) {
                    localStorage.setItem('doctorName', result.doctorName);
                }
                if (result.doctorId) {
                    localStorage.setItem('doctorId', result.doctorId);
                }
                if (result.name) {
                    localStorage.setItem('userName', result.name);
                }
                
                // after successfull login redirect following pages
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
});