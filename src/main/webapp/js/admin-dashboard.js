document.addEventListener('DOMContentLoaded', function() {
    loadAdminStats();
});

async function loadAdminStats() {
    try {
        const response = await fetch('getAdminStats');
        const stats = await response.json();
        
        document.getElementById('totalPatients').textContent = stats.totalPatients || 0;
        document.getElementById('activeDoctors').textContent = stats.activeDoctors || 0;
        document.getElementById('staffMembers').textContent = stats.staffMembers || 0;
        document.getElementById('todayAppointments').textContent = stats.todayAppointments || 0;
    } catch (error) {
        console.error('Error loading admin stats:', error);
    }
}
