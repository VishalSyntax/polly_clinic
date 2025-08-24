document.addEventListener('DOMContentLoaded', function() {
    const receptionistBtn = document.getElementById('receptionistBtn');
    const doctorBtn = document.getElementById('doctorBtn');
    const adminBtn = document.getElementById('adminBtn');
    const adminToggle = document.getElementById('adminToggle');
    const loginForm = document.getElementById('loginForm');
    
    let userType = 'receptionist';
    let adminVisible = false;
    

    adminToggle.addEventListener('click', function(e) {
        e.preventDefault();
        adminVisible = !adminVisible;
        
        if (adminVisible) {
            adminBtn.classList.remove('hidden');
            adminToggle.textContent = 'Hide Admin';
        } else {
            adminBtn.classList.add('hidden');
            
            if (userType === 'admin') {
                receptionistBtn.classList.add('active');
                adminBtn.classList.remove('active');
                userType = 'receptionist';
            }
            
            adminToggle.textContent = 'Admin Login';
        }
    });
    
    receptionistBtn.addEventListener('click', function(e) {
        e.preventDefault();
        receptionistBtn.classList.add('active');
        doctorBtn.classList.remove('active');
        adminBtn.classList.remove('active');
        userType = 'receptionist';
    });
    
    doctorBtn.addEventListener('click', function(e) {
        e.preventDefault();
        doctorBtn.classList.add('active');
        receptionistBtn.classList.remove('active');
        adminBtn.classList.remove('active');
        userType = 'doctor';
    });
    
    adminBtn.addEventListener('click', function(e) {
        e.preventDefault();
        adminBtn.classList.add('active');
        receptionistBtn.classList.remove('active');
        doctorBtn.classList.remove('active');
        userType = 'admin';
    });
    
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (!username || !password) {
            alert('Please enter both username and password');
            return;
        }
        
        try {
            const response = await fetch('/ClinicBook/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&userType=${encodeURIComponent(userType)}`
            });
            
            const result = await response.json();
            
            if (result.success) {
                localStorage.setItem('userType', userType);
                localStorage.setItem('username', username);
                localStorage.setItem('loginTime', new Date().toLocaleString());
                
                switch(userType) {
                    case 'receptionist':
                        localStorage.setItem('receptionistName', username);
                        window.location.href = 'receptionist-dashboard.html';
                        break;
                    case 'doctor':
                        window.location.href = 'Doctor_Interface/doctor.html';
                        break;
                    case 'admin':
                        window.location.href = 'admin-dashboard.html';
                        break;
                }
            } else {
                alert(result.message || 'Invalid credentials');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Login failed. Please check server connection.');
        }
    });
});
