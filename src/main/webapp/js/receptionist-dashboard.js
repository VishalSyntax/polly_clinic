document.addEventListener('DOMContentLoaded', function() {
    displayUserInfo();
    loadDashboardStats();
});

function displayUserInfo() {
    const userName = localStorage.getItem('userName') || localStorage.getItem('username') || 'Receptionist';
    const loginTime = localStorage.getItem('loginTime');
    
    if (loginTime) {
        const loginDate = new Date(loginTime);
        const formattedTime = loginDate.toLocaleString();
        
        document.getElementById('userInfo').innerHTML = `
            <strong>${userName}</strong><br>
            <small>Login: ${formattedTime}</small>
        `;
    } else {
        document.getElementById('userInfo').innerHTML = `
            <strong>${userName}</strong><br>
            <small>Receptionist Dashboard</small>
        `;
    }
}

async function loadDashboardStats() {
    try {
        const response = await fetch('getDashboardStats');
        if (response.ok) {
            const stats = await response.json();
            
            document.getElementById('totalAppointments').textContent = stats.totalAppointments || 0;
            document.getElementById('scheduledCount').textContent = stats.scheduledCount || 0;
            document.getElementById('cancelledCount').textContent = stats.cancelledCount || 0;
            document.getElementById('completedCount').textContent = stats.completedCount || 0;
            document.getElementById('totalPatients').textContent = stats.totalPatients || 0;
        }
        
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
        // Set default values on error
        document.getElementById('totalAppointments').textContent = '0';
        document.getElementById('scheduledCount').textContent = '0';
        document.getElementById('cancelledCount').textContent = '0';
        document.getElementById('completedCount').textContent = '0';
        document.getElementById('totalPatients').textContent = '0';
    }
}
