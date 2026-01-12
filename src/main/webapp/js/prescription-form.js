// Green API WhatsApp Config to 25
const GREEN_API_URL = 'https://api.green-api.com';
const INSTANCE_ID = '7105319809';
const ACCESS_TOKEN = 'f557539d8a6e4ee0acd5144309849c63a12e5c5094564d73b7';

// Format phone number to international format
function formatPhoneNumber(phoneNumber) {
    if (!phoneNumber) return null;
    
    // Remove all non-digit characters
    let cleaned = phoneNumber.replace(/\D/g, '');
    
    // If number starts with 91, use as is
    if (cleaned.startsWith('91') && cleaned.length === 12) {
        return cleaned;
    }
    
    // If 10 digit number, add 91 prefix
    if (cleaned.length === 10) {
        return '91' + cleaned;
    }
    
    // Return original if already in correct format or unknown format
    return cleaned;
}

let appointmentId, patientId;

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    const urlParams = new URLSearchParams(window.location.search);
    appointmentId = urlParams.get('appointmentId');
    patientId = urlParams.get('patientId');
    
    document.getElementById('patientId').textContent = patientId;
});

// Update current date and time
function updateDateTime() {
    const now = new Date();
    document.getElementById('currentDateTime').textContent = now.toLocaleString();
}

// Add new medicine row
function addMedicine() {
    const container = document.getElementById('medicineContainer');
    const newRow = document.createElement('div');
    newRow.className = 'medicine-row';
    newRow.innerHTML = `
        <div class="row">
            <div class="col">
                <label class="form-label">Medicine Name:</label>
                <input type="text" class="form-control medicine-name" required>
            </div>
            <div class="col">
                <label class="form-label">Quantity:</label>
                <input type="text" class="form-control quantity" required>
            </div>
            <div class="col">
                <label class="form-label">Timing:</label>
                <select class="form-control timing" required>
                    <option value="">Select Timing</option>
                    <option value="Morning - Before Meal">Morning - Before Meal</option>
                    <option value="Morning - After Meal">Morning - After Meal</option>
                    <option value="Evening - Before Meal">Evening - Before Meal</option>
                    <option value="Evening - After Meal">Evening - After Meal</option>
                    <option value="Night - Before Meal">Night - Before Meal</option>
                    <option value="Night - After Meal">Night - After Meal</option>
                    <option value="Twice Daily">Twice Daily</option>
                    <option value="Thrice Daily">Thrice Daily</option>
                </select>
            </div>
            <div style="width: 50px;">
                <label class="form-label">&nbsp;</label>
                <button type="button" class="remove-btn" onclick="removeMedicine(this)">×</button>
            </div>
        </div>
    `;
    container.appendChild(newRow);
}

// Remove medicine row
function removeMedicine(button) {
    button.closest('.medicine-row').remove();
}

// Print prescription
function printPrescription() {
    const medicines = [];
    document.querySelectorAll('.medicine-row').forEach(row => {
        const medicine = {
            name: row.querySelector('.medicine-name').value,
            quantity: row.querySelector('.quantity').value,
            timing: row.querySelector('.timing').value
        };
        if (medicine.name) medicines.push(medicine);
    });
    
    const printContent = `
        <div style="padding: 20px; font-family: Arial, sans-serif;">
            <h2>Prescription</h2>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${new Date().toLocaleTimeString()}</p>
            <p><strong>Patient ID:</strong> ${patientId}</p>
            <hr>
            <h3>Medicines:</h3>
            ${medicines.map(med => `
                <p><strong>${med.name}</strong> - ${med.quantity} - ${med.timing}</p>
            `).join('')}
        </div>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
}

// Submit prescription
async function submitPrescription(event) {
    event.preventDefault();
    
    const medicines = [];
    document.querySelectorAll('.medicine-row').forEach(row => {
        const medicine = {
            name: row.querySelector('.medicine-name').value,
            quantity: row.querySelector('.quantity').value,
            timing: row.querySelector('.timing').value
        };
        if (medicine.name && medicine.quantity && medicine.timing) {
            medicines.push(medicine);
        }
    });
    
    if (medicines.length === 0) {
        alert('Please add at least one medicine');
        return;
    }
    
    try {
        const response = await fetch('submitPrescription', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                appointmentId: appointmentId,
                patientId: patientId,
                doctorId: parseInt(localStorage.getItem('doctorId')) || 1,
                medicines: medicines
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Send prescription ready WhatsApp message
            await sendPrescriptionWhatsApp(result.patientContact, result.patientName, medicines);
            alert('Prescription submitted successfully!');
            window.location.href = 'doctor-appointments.jsp';
        } else {
            alert('Failed to submit prescription: ' + result.message);
        }
    } catch (error) {
        console.error('Error submitting prescription:', error);
        alert('Error submitting prescription. Please try again.');
    }
}

// Send prescription ready WhatsApp message
async function sendPrescriptionWhatsApp(patientContact, patientName, medicines) {
    if (!patientContact || patientContact.trim() === '') {
        console.log('No contact number provided, skipping WhatsApp notification');
        return;
    }
    
    const prescriptionDetails = medicines.map(med => 
        `• ${med.name} - ${med.quantity} - ${med.timing}`
    ).join('\n');
    
    const doctorName = localStorage.getItem('doctorName') || localStorage.getItem('userName') || 'Doctor';
    const message = `💊 *PollyClinic Prescription Ready*\n\n` +
                   `Dear ${patientName},\n\n` +
                   `Your prescription has been prepared by ${doctorName}.\n\n` +
                   `📋 *Prescription Details:*\n` +
                   `Patient ID: ${patientId}\n` +
                   `Date: ${new Date().toLocaleDateString()}\n\n` +
                   `💊 *Medicines:*\n${prescriptionDetails}\n\n` +
                   `Pls collect your medicines from our medical shop only.\n\n` +
                   `PollyClinic Team 🙏`;
    
    try {
        const response = await fetch(`${GREEN_API_URL}/waInstance${INSTANCE_ID}/sendMessage/${ACCESS_TOKEN}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chatId: `${formatPhoneNumber(patientContact)}@c.us`,
                message: message
            })
        });
        
        if (response.ok) {
            console.log('WhatsApp prescription notification sent successfully');
        } else {
            console.error('Failed to send WhatsApp message');
        }
    } catch (error) {
        console.error('Error sending WhatsApp message:', error);
    }
}
