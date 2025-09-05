document.addEventListener('DOMContentLoaded', function() {
    displayUserInfo();
});

function displayUserInfo() {
    const userName = localStorage.getItem('userName') || localStorage.getItem('username') || 'Receptionist';
    const loginTime = localStorage.getItem('loginTime');
    
    if (loginTime) {
        const loginDate = new Date(loginTime);
        const formattedTime = loginDate.toLocaleString();
        
        document.getElementById('userInfo').innerHTML = `
            <strong>👩‍💼 ${userName}</strong> | 
            <span>Login Time: ${formattedTime}</span>
        `;
    } else {
        document.getElementById('userInfo').innerHTML = `
            <strong>👩‍💼 ${userName}</strong>
        `;
    }
}