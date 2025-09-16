// Green API WhatsApp Config
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

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('searchForm').addEventListener('submit', searchPatients);
});

async function searchPatients(event) {
    event.preventDefault();
    
    const searchType = document.getElementById('searchType').value;
    const searchTerm = document.getElementById('searchTerm').value.trim();
    
    if (!searchTerm) {
        alert('Please enter a search term');
        return;
    }
    
    try {
        const response = await fetch(`searchPatients?type=${searchType}&term=${encodeURIComponent(searchTerm)}`);
        if (!response.ok) {
            throw new Error('Search failed');
        }
        const patients = await response.json();
        displayResults(patients);
    } catch (error) {
        console.error('Search error:', error);
        alert('Error searching patients');
    }
}

function displayResults(patients) {
    const resultsDiv = document.getElementById('results');
    const patientList = document.getElementById('patientList');
    const noResults = document.getElementById('noResults');
    
    resultsDiv.classList.remove('d-none');
    
    if (patients.length === 0) {
        patientList.innerHTML = '';
        noResults.classList.remove('d-none');
    } else {
        noResults.classList.add('d-none');
        patientList.innerHTML = '';
        
        patients.forEach(patient => {
            const cardDiv = document.createElement('div');
            cardDiv.className = 'card';
            cardDiv.style.marginBottom = '15px';
            
            // Create table structure safely
            const cardBody = document.createElement('div');
            cardBody.className = 'card-body';
            
            const tableDiv = document.createElement('div');
            tableDiv.className = 'table-responsive';
            
            const table = document.createElement('table');
            table.className = 'table table-striped table-hover mb-0';
            
            const tbody = document.createElement('tbody');
            
            // Create rows safely without innerHTML
            const rows = [
                ['Patient ID:', patient.id],
                ['Name:', patient.name],
                ['Contact:', patient.contact],
                ['Email:', patient.email || 'N/A']
            ];
            
            rows.forEach(([label, value]) => {
                const row = document.createElement('tr');
                const labelCell = document.createElement('td');
                const valueCell = document.createElement('td');
                
                const strong = document.createElement('strong');
                strong.textContent = label;
                labelCell.appendChild(strong);
                valueCell.textContent = value;
                
                row.appendChild(labelCell);
                row.appendChild(valueCell);
                tbody.appendChild(row);
            });
            
            table.appendChild(tbody);
            tableDiv.appendChild(table);
            cardBody.appendChild(tableDiv);
            
            // Create button
            const buttonDiv = document.createElement('div');
            buttonDiv.style.marginTop = '10px';
            
            const bookBtn = document.createElement('button');
            bookBtn.type = 'button';
            bookBtn.className = 'login-btn';
            bookBtn.textContent = 'Book Appointment';
            
            bookBtn.addEventListener('click', () => {
                bookAppointment(patient.id, patient.name);
            });
            
            buttonDiv.appendChild(bookBtn);
            cardBody.appendChild(buttonDiv);
            cardDiv.appendChild(cardBody);
            patientList.appendChild(cardDiv);
        });
    }
}

let currentPatientId, currentPatientName, currentPatientContact;

async function bookAppointment(patientId, patientName) {
    currentPatientId = patientId;
    currentPatientName = patientName;
    
    // Find patient contact from search results
    const searchResults = document.querySelectorAll('#patientList .card');
    searchResults.forEach(card => {
        const patientIdCell = card.querySelector('tbody tr:first-child td:last-child');
        if (patientIdCell && patientIdCell.textContent === patientId) {
            const contactCell = card.querySelector('tbody tr:nth-child(3) td:last-child');
            if (contactCell) {
                currentPatientContact = contactCell.textContent;
            }
        }
    });
    
    try {
        const response = await fetch(`checkPatientStatus?patientId=${encodeURIComponent(patientId)}`);
        
        if (!response.ok) {
            alert('Error checking patient status');
            return;
        }
        
        const statusData = await response.json();
        console.log('Patient status check result:', statusData);
        
        if (statusData.error) {
            alert('Database error occurred: ' + statusData.error);
            return;
        }
        
        // Check if patient has scheduled appointment
        if (statusData.hasScheduledAppointment === true) {
            alert(`Appointment is already booked with ${statusData.doctorName}`);
            return;
        }
        
        // Show modal for booking
        showBookingModal(patientName);
        
    } catch (error) {
        console.error('Error checking patient status:', error);
        alert('Error checking patient status');
    }
}

async function showBookingModal(patientName) {
    // Set patient name (non-editable)
    document.getElementById('modalPatientName').textContent = patientName;
    
    // Show modal first
    const modal = new bootstrap.Modal(document.getElementById('bookingModal'));
    modal.show();
    
    // Load doctors
    try {
        const response = await fetch('getDoctors');
        if (response.ok) {
            const doctors = await response.json();
            const doctorSelect = document.getElementById('modalDoctor');
            doctorSelect.innerHTML = '<option value="">Choose Doctor</option>';
            doctors.forEach(doctor => {
                const option = document.createElement('option');
                option.value = doctor.id;
                option.textContent = `${doctor.name} - ${doctor.specialization}`;
                doctorSelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error loading doctors:', error);
    }
    
    // Load time slots
    await loadTimeSlots();
    
    // Set minimum date to today and default value to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('modalDate').min = today;
    document.getElementById('modalDate').value = today;
    
    // Add event listeners for availability checking
    const dateInput = document.getElementById('modalDate');
    const doctorSelect = document.getElementById('modalDoctor');
    
    // Remove existing listeners
    dateInput.removeEventListener('change', checkTimeSlotAvailability);
    doctorSelect.removeEventListener('change', checkTimeSlotAvailability);
    doctorSelect.removeEventListener('change', checkDoctorConflict);
    
    // Add new listeners
    dateInput.addEventListener('change', checkTimeSlotAvailability);
    doctorSelect.addEventListener('change', checkTimeSlotAvailability);
    doctorSelect.addEventListener('change', checkDoctorConflict);
}

async function loadTimeSlots() {
    const timeSlotsContainer = document.getElementById('modalTimeSlots');
    timeSlotsContainer.innerHTML = '';
    
    try {
        const response = await fetch('timeSlots');
        if (response.ok) {
            const timeSlots = await response.json();
            
            if (Array.isArray(timeSlots) && timeSlots.length > 0) {
                timeSlots.forEach(slot => {
                    const timeValue = slot.slotTime || slot.time || slot.slot_time || slot.timeSlot;
                    if (typeof timeValue === 'string') {
                        const timeParts = timeValue.split(':');
                        const cleanTime = `${timeParts[0]}:${timeParts[1]}`;
                        const hour = parseInt(timeParts[0]);
                        const minute = timeParts[1];
                        
                        let displayTime;
                        if (hour === 0) {
                            displayTime = `12:${minute} AM`;
                        } else if (hour === 12) {
                            displayTime = `12:${minute} PM`;
                        } else if (hour > 12) {
                            displayTime = `${hour - 12}:${minute} PM`;
                        } else {
                            displayTime = `${hour}:${minute} AM`;
                        }
                        
                        createTimeSlotButton(timeSlotsContainer, cleanTime, displayTime);
                    }
                });
            } else {
                addFallbackTimeSlots();
            }
        } else {
            addFallbackTimeSlots();
        }
    } catch (error) {
        console.error('Error loading time slots:', error);
        addFallbackTimeSlots();
    }
}

function addFallbackTimeSlots() {
    const timeSlotsContainer = document.getElementById('modalTimeSlots');
    const fallbackSlots = [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
    ];
    
    fallbackSlots.forEach(time => {
        const hour = parseInt(time.split(':')[0]);
        const minute = time.split(':')[1];
        
        let displayTime;
        if (hour === 0) {
            displayTime = `12:${minute} AM`;
        } else if (hour === 12) {
            displayTime = `12:${minute} PM`;
        } else if (hour > 12) {
            displayTime = `${hour - 12}:${minute} PM`;
        } else {
            displayTime = `${hour}:${minute} AM`;
        }
        
        createTimeSlotButton(timeSlotsContainer, time, displayTime);
    });
}

function createTimeSlotButton(container, timeValue, displayTime) {
    const slotButton = document.createElement('div');
    slotButton.className = 'time-slot';
    slotButton.textContent = displayTime;
    slotButton.dataset.time = timeValue;
    
    slotButton.addEventListener('click', function() {
        if (this.classList.contains('unavailable')) {
            return;
        }
        
        // Remove selected class from all slots
        container.querySelectorAll('.time-slot').forEach(slot => {
            slot.classList.remove('selected');
        });
        
        // Add selected class to clicked slot
        this.classList.add('selected');
        
        // Update hidden input
        document.getElementById('modalSelectedTime').value = timeValue;
    });
    
    container.appendChild(slotButton);
}

async function submitQuickBooking() {
    const doctor = document.getElementById('modalDoctor').value;
    const date = document.getElementById('modalDate').value;
    const time = document.getElementById('modalSelectedTime').value;
    
    if (!doctor || !date || !time) {
        alert('Please fill all fields');
        return;
    }
    
    try {
        const response = await fetch('bookAppointment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                patientId: currentPatientId,
                doctorId: parseInt(doctor),
                appointmentDate: date,
                appointmentTime: time
            })
        });
        
        if (!response.ok) {
            alert('Server error occurred');
            return;
        }
        
        const result = await response.json();
        
        if (result.success) {
            // Send WhatsApp confirmation
            await sendWhatsAppConfirmation();
            alert('Appointment booked successfully!');
            const modal = bootstrap.Modal.getInstance(document.getElementById('bookingModal'));
            modal.hide();
        } else {
            alert('Failed to book appointment: ' + result.message);
        }
    } catch (error) {
        console.error('Error booking appointment:', error);
        alert('Error booking appointment');
    }
}

async function checkDoctorConflict() {
    const doctorId = document.getElementById('modalDoctor').value;
    
    if (!doctorId) {
        return;
    }
    
    try {
        const response = await fetch(`checkPatientStatus?patientId=${encodeURIComponent(currentPatientId)}`);
        
        if (!response.ok) {
            return;
        }
        
        const statusData = await response.json();
        console.log('Doctor conflict check result:', statusData);
        
        if (statusData.error) {
            return;
        }
        
        // Check if patient has scheduled appointment
        if (statusData.hasScheduledAppointment === true) {
            alert(`Appointment is already booked with ${statusData.doctorName}`);
            // Reset doctor selection
            document.getElementById('modalDoctor').value = '';
            // Clear time slots
            document.getElementById('modalTimeSlots').innerHTML = '';
            document.getElementById('modalSelectedTime').value = '';
            return;
        }
        
    } catch (error) {
        console.error('Error checking doctor conflict:', error);
    }
}

async function checkTimeSlotAvailability() {
    const date = document.getElementById('modalDate').value;
    const doctorId = document.getElementById('modalDoctor').value;
    const timeSlotsContainer = document.getElementById('modalTimeSlots');
    
    if (!date || !doctorId) {
        // Reset all slots to normal state
        const slots = timeSlotsContainer.querySelectorAll('.time-slot');
        slots.forEach(slot => {
            slot.classList.remove('unavailable');
        });
        return;
    }
    
    try {
        const response = await fetch(`checkAvailability?doctorId=${doctorId}&date=${date}`);
        const bookedSlots = await response.json();
        
        // Reset all slots
        timeSlotsContainer.querySelectorAll('.time-slot').forEach(slot => {
            slot.classList.remove('unavailable');
        });
        
        // Mark unavailable slots - match appointment-booking.js logic
        bookedSlots.forEach(bookedTime => {
            timeSlotsContainer.querySelectorAll('.time-slot').forEach(slot => {
                const slotTime = slot.dataset.time;
                // Convert booked time to HH:MM format if it has seconds
                const normalizedBookedTime = bookedTime.includes(':') ? bookedTime.substring(0, 5) : bookedTime;
                
                if (slotTime === normalizedBookedTime) {
                    slot.classList.add('unavailable');
                    slot.classList.remove('selected');
                }
            });
        });
    } catch (error) {
        console.error('Error checking availability:', error);
    }
}

async function sendWhatsAppConfirmation() {
    try {
        if (!currentPatientContact || currentPatientContact.trim() === '') {
            console.log('No contact number found, skipping WhatsApp notification');
            return;
        }
        
        const doctorSelect = document.getElementById('modalDoctor');
        const doctorName = doctorSelect.selectedOptions[0].text;
        const appointmentDate = document.getElementById('modalDate').value;
        const appointmentTime = document.getElementById('modalSelectedTime').value;
        
        const message = `🏥 *PollyClinic Appointment Confirmation*\n\n` +
                       `Dear ${currentPatientName},\n\n` +
                       `your appointment has been confirmed\n\n` +
                       `📋 *Details:*\n` +
                       `Patient ID: ${currentPatientId}\n` +
                       `Date: ${appointmentDate}\n` +
                       `Time: ${appointmentTime}\n` +
                       `Doctor: ${doctorName}\n\n` +
                       `Please arrive 15 minutes early.\n\n` +
                       `Thank you for choosing PollyClinic 🙏`;
        
        const whatsappResponse = await fetch(`${GREEN_API_URL}/waInstance${INSTANCE_ID}/sendMessage/${ACCESS_TOKEN}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chatId: `${formatPhoneNumber(currentPatientContact)}@c.us`,
                message: message
            })
        });
        
        if (whatsappResponse.ok) {
            console.log('WhatsApp confirmation sent successfully');
        } else {
            console.error('Failed to send WhatsApp message');
        }
    } catch (error) {
        console.error('Error sending WhatsApp message:', error);
    }
}