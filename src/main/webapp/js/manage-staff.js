// Prevent back button access after logout
history.pushState(null, null, location.href);
window.onpopstate = function () {
    history.go(1);
};

// Form submission handler
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

// Load receptionists on page load
document.addEventListener('DOMContentLoaded', function() {
    loadReceptionists();
});

// Function to load existing receptionists
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

// Function to edit staff
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

// Function to toggle status
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