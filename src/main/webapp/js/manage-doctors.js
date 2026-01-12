document.getElementById('doctorForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const doctorData = {
        username: document.getElementById('username').value,
        password: document.getElementById('password').value,
        name: document.getElementById('name').value,
        specialization: document.getElementById('specialization').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        license: document.getElementById('license').value
    };
    
    const editId = this.dataset.editId;
    const isEdit = !!editId;
    
    if (isEdit) {
        doctorData.id = parseInt(editId);
    }
    
    try {
        const url = isEdit ? 'updateDoctor' : 'addDoctor';
        const method = 'POST';
        const headers = isEdit ? 
            { 'Content-Type': 'application/json' } : 
            { 'Content-Type': 'application/x-www-form-urlencoded' };
        const body = isEdit ? 
            JSON.stringify(doctorData) : 
            new URLSearchParams(doctorData);
        
        const response = await fetch(url, { method, headers, body });
        const result = await response.json();
        
        alert(result.message || (isEdit ? 'Doctor updated successfully' : 'Doctor added successfully'));
        
        if (result.success) {
            this.reset();
            delete this.dataset.editId;
            document.querySelector('h1').textContent = 'Add New Doctor';
            document.querySelector('button[type="submit"]').textContent = 'Add Doctor';
            loadDoctors();
        }
    } catch (error) {
        alert(isEdit ? 'Failed to update doctor' : 'Failed to add doctor');
    }
});

function resetForm() {
    const form = document.getElementById('doctorForm');
    form.reset();
    delete form.dataset.editId;
    document.querySelector('h1').textContent = 'Add New Doctor';
    document.querySelector('button[type="submit"]').textContent = 'Add Doctor';
}

document.addEventListener('DOMContentLoaded', function() {
    loadDoctors();
});

async function loadDoctors() {
    try {
        const response = await fetch('getAllDoctors');
        const doctors = await response.json();
        
        const tbody = document.getElementById('doctorsTableBody');
        tbody.innerHTML = '';
        
        doctors.forEach(doctor => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${doctor.id}</td>
                <td>${doctor.name}</td>
                <td>${doctor.specialization}</td>
                <td>${doctor.phone}</td>
                <td>${doctor.email}</td>
                <td><span class="badge ${doctor.isActive ? 'bg-success' : 'bg-danger'}">${doctor.isActive ? 'Active' : 'Inactive'}</span></td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="editDoctor(${doctor.id})">Edit</button>
                    <button class="btn btn-sm ${doctor.isActive ? 'btn-danger' : 'btn-success'}" onclick="toggleStatus(${doctor.id})">${doctor.isActive ? 'Deactivate' : 'Activate'}</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading doctors:', error);
    }
}

function editDoctor(id) {
    // Populate form with doctor data for editing
    fetch('getAllDoctors')
        .then(response => response.json())
        .then(doctors => {
            const doctor = doctors.find(d => d.id === id);
            if (doctor) {
                document.getElementById('username').value = doctor.username;
                document.getElementById('name').value = doctor.name;
                document.getElementById('specialization').value = doctor.specialization;
                document.getElementById('phone').value = doctor.phone;
                document.getElementById('email').value = doctor.email;
                document.getElementById('license').value = doctor.license;
                
                // Change form to edit mode
                const form = document.getElementById('doctorForm');
                form.dataset.editId = id;
                document.querySelector('h1').textContent = 'Edit Doctor';
                document.querySelector('button[type="submit"]').textContent = 'Update Doctor';
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
            loadDoctors();
        } else {
            alert('Failed to update status');
        }
    } catch (error) {
        console.error('Error toggling status:', error);
    }
}
