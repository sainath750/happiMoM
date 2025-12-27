// Authentication System

// Check if user is authenticated
function isAuthenticated() {
    const authData = localStorage.getItem('authData');
    if (!authData) return false;
    
    try {
        const auth = JSON.parse(authData);
        // Check if session is still valid (24 hours)
        if (auth.expires && new Date(auth.expires) > new Date()) {
            return true;
        } else {
            // Session expired, clear it
            localStorage.removeItem('authData');
            return false;
        }
    } catch (e) {
        return false;
    }
}

// Get current user data
function getCurrentUser() {
    const authData = localStorage.getItem('authData');
    if (!authData) return null;
    
    try {
        const auth = JSON.parse(authData);
        if (auth.expires && new Date(auth.expires) > new Date()) {
            return auth.user;
        }
    } catch (e) {
        return null;
    }
    return null;
}

// Set authentication
function setAuthentication(user, remember = false) {
    const expires = new Date();
    if (remember) {
        expires.setDate(expires.getDate() + 30); // 30 days
    } else {
        expires.setHours(expires.getHours() + 24); // 24 hours
    }
    
    const authData = {
        user: user,
        expires: expires.toISOString(),
        loggedIn: true
    };
    
    localStorage.setItem('authData', JSON.stringify(authData));
}

// Logout
function logout() {
    localStorage.removeItem('authData');
    window.location.href = 'login.html';
}

// Require authentication - redirect to login if not authenticated
function requireAuth() {
    if (!isAuthenticated()) {
        // Store the current page to redirect back after login
        const currentPage = window.location.pathname.split('/').pop();
        if (currentPage !== 'login.html' && currentPage !== 'signup.html' && currentPage !== 'index.html') {
            sessionStorage.setItem('redirectAfterLogin', currentPage);
        }
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Redirect after login if needed
function redirectAfterLogin() {
    const redirectPage = sessionStorage.getItem('redirectAfterLogin');
    if (redirectPage) {
        sessionStorage.removeItem('redirectAfterLogin');
        window.location.href = redirectPage;
    }
}

// Check authentication on page load for protected pages
document.addEventListener('DOMContentLoaded', function() {
    // List of pages that require authentication
    const protectedPages = ['calendar.html', 'pregnancy.html', 'profile.html'];
    const currentPage = window.location.pathname.split('/').pop() || window.location.href.split('/').pop();
    
    if (protectedPages.includes(currentPage)) {
        if (!isAuthenticated()) {
            // Store the current page to redirect back after login
            sessionStorage.setItem('redirectAfterLogin', currentPage);
            window.location.href = 'login.html';
            return; // Will redirect to login
        }
    }
    
    // If on login page and already authenticated, redirect to calendar
    if (currentPage === 'login.html' && isAuthenticated()) {
        redirectAfterLogin();
        if (!sessionStorage.getItem('redirectAfterLogin')) {
            window.location.href = 'calendar.html';
        }
    }
});

