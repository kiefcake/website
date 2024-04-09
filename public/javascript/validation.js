// validation.js

// Form validation function
function validateForm() {
    var name = document.getElementById("name").value.trim();
    var email = document.getElementById("email").value.trim();
    
    if (name === "" || email === "") {
        alert("Please fill out all required fields.");
        return false; // Prevent form submission
    }
    
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert("Please enter a valid email address.");
        return false; // Prevent form submission
    }
    
    return true; // Allow form submission if all validations pass
}

// Attach the validateForm function to the form's submit event
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector("form");
    form.addEventListener("submit", function(event) {
        if (!validateForm()) {
            event.preventDefault(); // Prevent form submission if validation fails
        }
    });
});