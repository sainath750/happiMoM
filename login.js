// Login Page JavaScript
// Note: auth.js must be loaded before this file

document.addEventListener('DOMContentLoaded', function() {
    // Check if already logged in
    if (isAuthenticated()) {
        redirectAfterLogin();
        if (!sessionStorage.getItem('redirectAfterLogin')) {
            window.location.href = 'calendar.html';
        }
    }
    const loginForm = document.getElementById('loginForm');
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    
    // Toggle password visibility
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Update eye icon (you can replace with SVG icons if preferred)
            const eyeIcon = togglePassword.querySelector('.eye-icon');
            if (eyeIcon) {
                eyeIcon.textContent = type === 'password' ? '👁️' : '🙈';
            }
        });
    }
    
    // Form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const remember = document.getElementById('remember').checked;
            
            // Basic validation
            if (!email || !password) {
                showError('Please fill in all fields');
                return;
            }
            
            if (!isValidEmail(email)) {
                showError('Please enter a valid email address');
                return;
            }
            
            // Disable submit button
            const submitButton = loginForm.querySelector('.btn-login');
            submitButton.disabled = true;
            submitButton.textContent = 'Signing in...';
            
            // Simulate login process (replace with actual API call)
            setTimeout(() => {
                // Here you would make an actual API call to your backend
                console.log('Login attempt:', { email, password, remember });
                
                // Set authentication
                const user = {
                    email: email,
                    firstName: email.split('@')[0], // Demo: use email prefix as name
                    lastName: ''
                };
                
                // Check if profile exists
                const savedProfile = localStorage.getItem('profileData');
                if (savedProfile) {
                    const profile = JSON.parse(savedProfile);
                    user.firstName = profile.firstName || user.firstName;
                    user.lastName = profile.lastName || user.lastName;
                    user.mobile = profile.mobile || '';
                    user.dob = profile.dob || '';
                }
                
                setAuthentication(user, remember);
                
                // For demo purposes, show success message
                // In production, redirect to dashboard or handle response
                alert('Login successful! Redirecting to your calendar...');
                
                // Reset button
                submitButton.disabled = false;
                submitButton.textContent = 'Sign In';
                
                // Redirect after login
                redirectAfterLogin();
                if (!sessionStorage.getItem('redirectAfterLogin')) {
                    window.location.href = 'calendar.html';
                }
            }, 1500);
        });
    }
    
    // Email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Show error message
    function showError(message) {
        // Remove existing error messages
        const existingErrors = document.querySelectorAll('.error-message');
        existingErrors.forEach(error => error.remove());
        
        // Remove error classes
        document.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('error');
        });
        
        // Create and show new error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        // Insert error message after the form
        if (loginForm) {
            loginForm.appendChild(errorDiv);
        }
        
        // Scroll to error
        errorDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    // Add input validation on blur
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            const email = this.value;
            if (email && !isValidEmail(email)) {
                this.parentElement.classList.add('error');
            } else {
                this.parentElement.classList.remove('error');
            }
        });
    }
    
    // Remove error state on input
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            this.parentElement.classList.remove('error');
            const errorMessages = document.querySelectorAll('.error-message');
            errorMessages.forEach(error => error.remove());
        });
    });
});

