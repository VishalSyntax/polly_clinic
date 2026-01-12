document.addEventListener('DOMContentLoaded', function() {
    loadTimeSlots();
});

document.getElementById('timeslotForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const slotTime = document.getElementById('newSlotTime').value;
    
    try {
        const response = await fetch('timeSlots', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ slotTime: slotTime })
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert('Time slot added successfully');
            this.reset();
            loadTimeSlots();
        } else {
            alert(result.message || 'Failed to add time slot');
        }
    } catch (error) {
        console.error('Error adding time slot:', error);
        alert('Failed to add time slot');
    }
});

async function loadTimeSlots() {
    try {
        const response = await fetch('timeSlots');
        const slots = await response.json();
        
        const grid = document.getElementById('slotsGrid');
        grid.innerHTML = '';
        
        slots.forEach(slot => {
            const slotDiv = document.createElement('div');
            slotDiv.className = 'slot-item';
            slotDiv.innerHTML = `
                ${slot.slotTime}
                <button class="remove-btn" onclick="removeTimeSlot(${slot.id})">&times;</button>
            `;
            grid.appendChild(slotDiv);
        });
    } catch (error) {
        console.error('Error loading time slots:', error);
    }
}

async function removeTimeSlot(slotId) {
    if (!confirm('Are you sure you want to remove this time slot?')) {
        return;
    }
    
    try {
        const response = await fetch(`timeSlots?id=${slotId}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert('Time slot removed successfully');
            loadTimeSlots();
        } else {
            alert(result.message || 'Failed to remove time slot');
        }
    } catch (error) {
        console.error('Error removing time slot:', error);
        alert('Failed to remove time slot');
    }
}
