// Profile Page JavaScript
// Note: auth.js must be loaded before this file

let profileData = {};

// Wait for page to load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Profile page loaded');
    
    // Make sure content is visible immediately
    const profileContent = document.getElementById('profileContent');
    if (profileContent) {
        profileContent.style.display = 'block';
        profileContent.style.visibility = 'visible';
    }
    
    // Wait a bit for auth.js to load, then initialize
    setTimeout(function() {
        initializeProfile();
    }, 150);
});

function initializeProfile() {
    console.log('Initializing profile...');
    
    // Check if auth functions exist
    if (typeof isAuthenticated === 'undefined') {
        console.warn('Auth.js not loaded, waiting...');
        setTimeout(initializeProfile, 100);
        return;
    }
    
    // Check authentication
    if (!isAuthenticated()) {
        console.log('User not authenticated');
        const profileContent = document.getElementById('profileContent');
        if (profileContent) {
            profileContent.innerHTML = '<div style="text-align: center; padding: 50px; background: white; border-radius: 10px; margin: 20px;"><h3>Please Login</h3><p>You need to be logged in to view your profile.</p><a href="login.html" style="display: inline-block; margin-top: 20px; padding: 12px 24px; background: var(--deep-pink); color: white; text-decoration: none; border-radius: 10px; font-weight: 600;">Go to Login</a></div>';
        }
        return;
    }
    
    // Get current user
    const currentUser = getCurrentUser();
    if (!currentUser) {
        console.error('No user data found');
        const profileContent = document.getElementById('profileContent');
        if (profileContent) {
            profileContent.innerHTML = '<div style="text-align: center; padding: 50px; background: white; border-radius: 10px; margin: 20px;"><h3>No User Data</h3><p>No user data found. Please login again.</p><a href="login.html" style="display: inline-block; margin-top: 20px; padding: 12px 24px; background: var(--deep-pink); color: white; text-decoration: none; border-radius: 10px; font-weight: 600;">Go to Login</a></div>';
        }
        return;
    }
    
    console.log('User authenticated:', currentUser);
    
    try {
        // Ensure content is visible
        const loadingState = document.getElementById('loadingState');
        const profileContent = document.getElementById('profileContent');
        
        if (loadingState) {
            loadingState.style.display = 'none';
        }
        if (profileContent) {
            profileContent.style.display = 'block';
            profileContent.style.visibility = 'visible';
        }
        
        // Load profile data
        loadProfileData();
        
        // Setup event listeners
        setupEventListeners();
        
        // Update UI with user data
        updateProfileUI();
        
        console.log('Profile initialized successfully');
    } catch (error) {
        console.error('Error initializing profile:', error);
        const profileContent = document.getElementById('profileContent');
        if (profileContent) {
            profileContent.style.display = 'block';
            profileContent.innerHTML = '<div style="text-align: center; padding: 50px; color: red; background: white; border-radius: 10px; margin: 20px;"><h3>Error Loading Profile</h3><p>Please refresh the page or <a href="login.html" style="color: var(--deep-pink);">login again</a>.</p><p style="font-size: 0.9rem; margin-top: 10px; color: #666;">Error: ' + (error.message || 'Unknown error') + '</p><button onclick="location.reload()" style="margin-top: 15px; padding: 10px 20px; background: var(--deep-pink); color: white; border: none; border-radius: 8px; cursor: pointer;">Refresh Page</button></div>';
        }
    }
}

// Load profile data from localStorage
function loadProfileData() {
    const savedProfile = localStorage.getItem('profileData');
    if (savedProfile) {
        profileData = JSON.parse(savedProfile);
    } else {
        // Initialize with user data from auth
        const currentUser = getCurrentUser();
        profileData = {
            firstName: currentUser?.firstName || '',
            lastName: currentUser?.lastName || '',
            email: currentUser?.email || '',
            mobile: currentUser?.mobile || '',
            dob: currentUser?.dob || '',
            gender: currentUser?.gender || '',
            bloodGroup: currentUser?.bloodGroup || '',
            height: currentUser?.height || '',
            weight: currentUser?.weight || '',
            emergencyContact: currentUser?.emergencyContact || '',
            address: currentUser?.address || '',
            city: currentUser?.city || '',
            state: currentUser?.state || '',
            country: currentUser?.country || '',
            zipCode: currentUser?.zipCode || '',
            medicalConditions: currentUser?.medicalConditions || '',
            allergies: currentUser?.allergies || ''
        };
    }
    
    // Populate form
    populateForm();
}

// Populate form with profile data
function populateForm() {
    try {
        Object.keys(profileData).forEach(key => {
            const field = document.getElementById(key);
            if (field) {
                field.value = profileData[key] || '';
            }
        });
    } catch (error) {
        console.error('Error populating form:', error);
    }
}

// Update profile UI
function updateProfileUI() {
    try {
        const currentUser = getCurrentUser();
        const firstName = profileData.firstName || currentUser?.firstName || 'User';
        const lastName = profileData.lastName || currentUser?.lastName || '';
        const email = profileData.email || currentUser?.email || 'user@example.com';
        
        // Update header
        const profileNameEl = document.getElementById('profileName');
        const profileEmailEl = document.getElementById('profileEmail');
        const avatarInitialsEl = document.getElementById('avatarInitials');
        
        if (profileNameEl) {
            profileNameEl.textContent = `${firstName} ${lastName}`.trim() || 'User Name';
        }
        if (profileEmailEl) {
            profileEmailEl.textContent = email;
        }
        
        // Update avatar initials
        if (avatarInitialsEl) {
            const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
            const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
            const initials = (firstInitial + lastInitial) || 'U';
            avatarInitialsEl.textContent = initials;
        }
    } catch (error) {
        console.error('Error updating profile UI:', error);
    }
}

// Setup event listeners
function setupEventListeners() {
    try {
        // Form submission
        const profileForm = document.getElementById('profileForm');
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                saveProfile();
            });
        }
        
        // Cancel button
        const cancelBtn = document.getElementById('cancelBtn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to discard changes?')) {
                    loadProfileData(); // Reload original data
                }
            });
        }
        
        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to logout?')) {
                    if (typeof logout === 'function') {
                        logout();
                    } else {
                        window.location.href = 'login.html';
                    }
                }
            });
        }
        
        // Change password
        const changePasswordBtn = document.getElementById('changePasswordBtn');
        if (changePasswordBtn) {
            changePasswordBtn.addEventListener('click', () => {
                openModal('passwordModal');
            });
        }
        
        // Password form
        const passwordForm = document.getElementById('passwordForm');
        if (passwordForm) {
            passwordForm.addEventListener('submit', (e) => {
                e.preventDefault();
                changePassword();
            });
        }
        
        // Privacy settings
        const privacySettingsBtn = document.getElementById('privacySettingsBtn');
        if (privacySettingsBtn) {
            privacySettingsBtn.addEventListener('click', () => {
                alert('Privacy settings feature coming soon!');
            });
        }
        
        // Notifications
        const notificationsBtn = document.getElementById('notificationsBtn');
        if (notificationsBtn) {
            notificationsBtn.addEventListener('click', () => {
                alert('Notification settings feature coming soon!');
            });
        }
        
        // Edit avatar
        const editAvatarBtn = document.getElementById('editAvatarBtn');
        if (editAvatarBtn) {
            editAvatarBtn.addEventListener('click', () => {
                alert('Avatar upload feature coming soon!');
            });
        }
        
        // Close modals
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', closeAllModals);
        });
        
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                closeAllModals();
            }
        });
    } catch (error) {
        console.error('Error setting up event listeners:', error);
    }
}

// Save profile
function saveProfile() {
    try {
        const profileForm = document.getElementById('profileForm');
        if (!profileForm) {
            alert('Form not found');
            return;
        }
        
        // Collect form data
        const formData = new FormData(profileForm);
        const updatedProfile = {};
        
        for (let [key, value] of formData.entries()) {
            updatedProfile[key] = value;
        }
        
        // Update profile data
        profileData = { ...profileData, ...updatedProfile };
        
        // Save to localStorage
        localStorage.setItem('profileData', JSON.stringify(profileData));
        
        // Update user in auth data
        const currentUser = getCurrentUser();
        if (currentUser) {
            const authDataStr = localStorage.getItem('authData');
            if (authDataStr) {
                const authData = JSON.parse(authDataStr);
                authData.user = { ...authData.user, ...updatedProfile };
                localStorage.setItem('authData', JSON.stringify(authData));
            }
        }
        
        // Update UI
        updateProfileUI();
        
        // Show success message
        showSuccessMessage('Profile updated successfully!');
    } catch (error) {
        console.error('Error saving profile:', error);
        alert('Error saving profile. Please try again.');
    }
}

// Change password
function changePassword() {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validation
    if (newPassword.length < 8) {
        alert('Password must be at least 8 characters long');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        alert('New passwords do not match');
        return;
    }
    
    // In a real app, you would verify current password with backend
    // For demo purposes, we'll just save it
    const authData = JSON.parse(localStorage.getItem('authData'));
    if (authData) {
        authData.user.password = newPassword; // In real app, this should be hashed
        localStorage.setItem('authData', JSON.stringify(authData));
    }
    
    // Show success
    alert('Password updated successfully!');
    closeAllModals();
    document.getElementById('passwordForm').reset();
}

// Open modal
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

// Close all modals
function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

// Show success message
function showSuccessMessage(message) {
    // Create success notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--nurturing-green);
        color: var(--text-dark);
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 3000;
        font-weight: 600;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

