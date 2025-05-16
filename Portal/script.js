// script.js
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('serviceRequestForm');
    
    // Success Modal Functions
    function showSuccessModal(caseTitle, email, company) {
        const modal = document.getElementById('successModal');
        document.getElementById('successCaseTitle').textContent = caseTitle;
        document.getElementById('successEmail').textContent = email;
        document.getElementById('successCompany').textContent = company;
        modal.style.display = 'flex';
        
        // Reset form after showing success
        form.reset();
    }

    function closeSuccessModal() {
        document.getElementById('successModal').style.display = 'none';
    }

    // Form Submission Handler
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form values
        const caseTitle = document.getElementById('caseTitle').value;
        const caseDescription = document.getElementById('caseDescription').value;
        const email = document.getElementById('email').value;
        const company = document.getElementById('company').value;
        
        try {
            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';
            
            // Submit to Power Automate flow
            const response = await fetch('https://prod-07.northeurope.logic.azure.com:443/workflows/62ae6e8688c74c6e8ebf221e90766cca/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=COkwzs1vZcH5fDwSxgp-M6zWGYUDSg8U1EtxMPSAH1w', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    caseTitle,
                    caseDescription,
                    email,
                    company
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to submit request');
            }
            
            const result = await response.json();
            
            if (result.success) {
                showSuccessModal(caseTitle, email, company);
            } else {
                throw new Error('Submission failed');
            }
        } catch (error) {
            console.error('Error submitting request:', error);
            alert('There was an error submitting your request. Please try again.');
        } finally {
            // Reset button state
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Request';
        }
    });
});

// Make closeSuccessModal available globally for the HTML button
window.closeSuccessModal = function() {
    document.getElementById('successModal').style.display = 'none';
};