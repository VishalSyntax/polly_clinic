document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('searchForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const searchType = document.getElementById('searchType').value;
        const searchTerm = document.getElementById('searchTerm').value;
        
        // This would typically make an AJAX call to search for patients
        // For now, we'll show a placeholder result
        
        const resultsDiv = document.getElementById('results');
        const patientList = document.getElementById('patientList');
        const noResults = document.getElementById('noResults');
        
        // Simulate search results
        if (searchTerm.trim()) {
            patientList.innerHTML = `
                <div class="patient-item">
                    <strong>Patient ID:</strong> P123456<br>
                    <strong>Name:</strong> John Doe<br>
                    <strong>Contact:</strong> 9876543210<br>
                    <strong>Email:</strong> john@example.com
                </div>
            `;
            patientList.classList.remove('hidden');
            noResults.classList.add('hidden');
        } else {
            patientList.classList.add('hidden');
            noResults.classList.remove('hidden');
        }
        
        resultsDiv.classList.remove('hidden');
    });
});
