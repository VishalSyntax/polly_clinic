document.addEventListener('DOMContentLoaded', function() {
    loadDashboardHeader();
    loadDashboardStats();
});

// Load dashboard header info
function loadDashboardHeader() {
    fetch('getUserInfo')
        .then(response => response.json())
        .then(data => {
            const userInfo = document.getElementById('userInfo');
            const currentDate = document.getElementById('current-date');
            if (userInfo) {
                userInfo.innerHTML = `
                    <i class="bi bi-person-badge me-2"></i><strong>${data.fullName}</strong> | 
                    <i class="bi bi-clock me-1"></i><span>Login Time: ${data.loginTime}</span>
                `;
            }
            if (currentDate) {
                currentDate.textContent = `Date: ${data.currentDate}`;
            }
        })
        .catch(error => {
            console.error('Error fetching user info:', error);
            const userInfo = document.getElementById('userInfo');
            if (userInfo) {
                userInfo.innerHTML = '<i class="bi bi-person-badge me-2"></i><strong>Receptionist</strong>';
            }
        });
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
