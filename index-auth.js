// Check if user is already logged in on index page
document.addEventListener('DOMContentLoaded', function() {
    // If user is authenticated, show a "Go to Dashboard" button
    if (isAuthenticated()) {
        const heroSection = document.querySelector('.hero .cta-buttons');
        if (heroSection) {
            const dashboardBtn = document.createElement('a');
            dashboardBtn.href = 'calendar.html';
            dashboardBtn.className = 'btn btn-primary';
            dashboardBtn.textContent = 'Go to Dashboard';
            dashboardBtn.style.marginTop = '10px';
            heroSection.appendChild(dashboardBtn);
        }
    }
});


