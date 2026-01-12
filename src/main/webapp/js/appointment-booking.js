// Green API WhatsApp Config t0 25
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

let selectedTimeSlot = null;

// Load doctors on page load
document.addEventListener('DOMContentLoaded', async function() {
    displayUserInfo();
    loadDoctors();
    await generateTimeSlots();
    
    // Set minimum date to today and default value to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('appointmentDate').min = today;
    document.getElementById('appointmentDate').value = today;
});

async function loadDoctors() {
    try {
        const response = await fetch('getDoctors');
        const doctors = await response.json();
        
        const doctorSelect = document.getElementById('doctor');
        doctors.forEach(doctor => {
            const option = document.createElement('option');
            option.value = doctor.id;
            option.textContent = `${doctor.name} - ${doctor.specialization}`;
            doctorSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading doctors:', error);
    }
}

async function generateTimeSlots() {
    try {
        const response = await fetch('timeSlots');
        const timeSlots = await response.json();
        
        const timeSlotsContainer = document.getElementById('timeSlots');
        timeSlotsContainer.innerHTML = '';
        
        timeSlots.forEach(slot => {
            const slotDiv = document.createElement('div');
            slotDiv.className = 'time-slot';
            slotDiv.textContent = slot.slotTime;
            slotDiv.onclick = () => selectTimeSlot(slotDiv, slot.slotTime);
            timeSlotsContainer.appendChild(slotDiv);
        });
    } catch (error) {
        console.error('Error loading time slots:', error);
        // Fallback to default slots if database fails
        const defaultSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'];
        const timeSlotsContainer = document.getElementById('timeSlots');
        defaultSlots.forEach(time => {
            const slot = document.createElement('div');
            slot.className = 'time-slot';
            slot.textContent = time;
            slot.onclick = () => selectTimeSlot(slot, time);
            timeSlotsContainer.appendChild(slot);
        });
    }
}

function selectTimeSlot(element, time) {
    if (element.classList.contains('unavailable')) return;
    
    // Remove previous selection
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.classList.remove('selected');
    });
    
    // Select current slot
    element.classList.add('selected');
    selectedTimeSlot = time;
    document.getElementById('selectedTime').value = time;
}

// Check availability when doctor or date changes
document.getElementById('doctor').addEventListener('change', checkAvailability);
document.getElementById('appointmentDate').addEventListener('change', checkAvailability);

async function checkAvailability() {
    const doctorId = document.getElementById('doctor').value;
    const date = document.getElementById('appointmentDate').value;
    
    if (!doctorId || !date) return;
    
    try {
        const response = await fetch(`checkAvailability?doctorId=${doctorId}&date=${date}`);
        const bookedSlots = await response.json();
        
        // Reset all slots
        document.querySelectorAll('.time-slot').forEach(slot => {
            slot.classList.remove('unavailable');
        });
        
        // Mark unavailable slots
        bookedSlots.forEach(time => {
            document.querySelectorAll('.time-slot').forEach(slot => {
                if (slot.textContent === time) {
                    slot.classList.add('unavailable');
                }
            });
        });
    } catch (error) {
        console.error('Error checking availability:', error);
    }
}

document.getElementById('appointmentForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    if (!selectedTimeSlot) {
        alert('Please select a time slot');
        return;
    }
    
    const formData = {
        doctorId: document.getElementById('doctor').value,
        appointmentDate: document.getElementById('appointmentDate').value,
        appointmentTime: selectedTimeSlot,
        patientName: document.getElementById('patientName').value,
        contactNumber: document.getElementById('contactNumber').value,
        email: document.getElementById('email').value,
        address: document.getElementById('address').value
    };
    
    try {
        // First check if patient already exists by contact number
        const checkResponse = await fetch(`checkPatientExists?contact=${formData.contactNumber}`);
        const checkResult = await checkResponse.json();
        
        if (checkResult.exists) {
            alert('Patient is already registered. Please search by ID.');
            return;
        }
        
        const response = await fetch('bookAppointment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Send WhatsApp confirmation
            await sendWhatsAppConfirmation(formData, result.patientId);
            alert(`Appointment booked successfully! Patient ID: ${result.patientId}`);
            this.reset();
            
            // Restore current date after reset
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('appointmentDate').value = today;
            
            selectedTimeSlot = null;
            document.querySelectorAll('.time-slot').forEach(slot => {
                slot.classList.remove('selected');
            });
        } else {
            alert(result.message || 'Failed to book appointment');
        }
    } catch (error) {
        console.error('Error booking appointment:', error);
        alert('Failed to book appointment');
    }
});

async function sendWhatsAppConfirmation(appointmentData, patientId) {
    // Only send WhatsApp if contact number is provided
    if (!appointmentData.contactNumber || appointmentData.contactNumber.trim() === '') {
        console.log('No contact number provided, skipping WhatsApp notification');
        return;
    }
    
    const doctorName = document.getElementById('doctor').selectedOptions[0].text;
    const message = `🏥 *PollyClinic Appointment Confirmation*\n\n` +
                   `Dear ${appointmentData.patientName},\n\n` +
                   `Your appointment has been confirmed!\n\n` +
                   `📋 *Details:*\n` +
                   `Patient ID: ${patientId}\n` +
                   `Date: ${appointmentData.appointmentDate}\n` +
                   `Time: ${appointmentData.appointmentTime}\n` +
                   `Doctor: ${doctorName}\n\n` +
                   `Please arrive 15 minutes early.\n\n` +
                   `Thank you for choosing PollyClinic! 🙏`;
    
    try {
        const response = await fetch(`${GREEN_API_URL}/waInstance${INSTANCE_ID}/sendMessage/${ACCESS_TOKEN}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chatId: `${formatPhoneNumber(appointmentData.contactNumber)}@c.us`,
                message: message
            })
        });
        
        if (response.ok) {
            console.log('WhatsApp confirmation sent successfully');
        } else {
            console.error('Failed to send WhatsApp message');
        }
    } catch (error) {
        console.error('Error sending WhatsApp message:', error);
    }
}

function displayUserInfo() {
    const userName = localStorage.getItem('userName') || localStorage.getItem('username') || 'Receptionist';
    const loginTime = localStorage.getItem('loginTime');
    
    if (loginTime) {
        const loginDate = new Date(loginTime);
        const formattedTime = loginDate.toLocaleString();
        
        document.getElementById('userInfo').innerHTML = `
            <strong>👩💼 ${userName}</strong> | 
            <span>Login Time: ${formattedTime}</span>
        `;
    } else {
        document.getElementById('userInfo').innerHTML = `
            <strong>👩💼 ${userName}</strong>
        `;
    }
}