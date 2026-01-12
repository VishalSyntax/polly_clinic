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
    loginForm.addEventListener('submit', function(e) {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if (!username || !password) {
            e.preventDefault();
            alert('Please fill in all fields');
            return;
        }
        
        // Add hidden input for userType
        let userTypeInput = document.getElementById('userTypeInput');
        if (!userTypeInput) {
            userTypeInput = document.createElement('input');
            userTypeInput.type = 'hidden';
            userTypeInput.name = 'userType';
            userTypeInput.id = 'userTypeInput';
            loginForm.appendChild(userTypeInput);
        }
        userTypeInput.value = selectedUserType;
    });
});
