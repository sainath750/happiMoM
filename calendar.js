// Calendar and Period Tracking JavaScript

// Calendar state
let currentDate = new Date();
let periodData = JSON.parse(localStorage.getItem('periodData')) || {
    periods: [],
    cycleLength: 28,
    periodLength: 5,
    lastPeriodStart: null
};

// Initialize calendar
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the calendar page
    if (window.location.pathname.includes('calendar.html') || window.location.href.includes('calendar.html')) {
        try {
            loadPeriodData();
            initializeCalendar();
            updatePredictions();
            updateInsights();
            setupEventListeners();
            console.log('Calendar initialized successfully');
        } catch (error) {
            console.error('Error initializing calendar:', error);
            // Try again after a short delay
            setTimeout(function() {
                try {
                    loadPeriodData();
                    initializeCalendar();
                    updatePredictions();
                    updateInsights();
                    setupEventListeners();
                } catch (retryError) {
                    console.error('Error retrying calendar initialization:', retryError);
                }
            }, 500);
        }
    }
});

// Initialize calendar display
function initializeCalendar() {
    const monthYear = document.getElementById('currentMonthYear');
    const calendarGrid = document.getElementById('calendarGrid');
    
    if (!monthYear || !calendarGrid) {
        console.error('Calendar elements not found');
        return;
    }
    
    // Set month/year header
    monthYear.textContent = currentDate.toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
    });
    
    // Clear calendar
    calendarGrid.innerHTML = '';
    
    // Add day headers
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayHeaders.forEach(day => {
        const header = document.createElement('div');
        header.className = 'calendar-day-header';
        header.textContent = day;
        calendarGrid.appendChild(header);
    });
    
    // Get first day of month and number of days
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day other-month';
        calendarGrid.appendChild(emptyDay);
    }
    
    // Add days of the month
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        
        // Check if today
        if (date.toDateString() === today.toDateString()) {
            dayElement.classList.add('today');
        }
        
        // Check if period day
        if (isPeriodDay(date)) {
            dayElement.classList.add('period-day');
        }
        
        // Check if predicted period day
        if (isPredictedPeriodDay(date)) {
            dayElement.classList.add('predicted-day');
        }
        
        // Check if fertile day
        if (isFertileDay(date)) {
            dayElement.classList.add('fertile-day');
        }
        
        // Check if ovulation day
        if (isOvulationDay(date)) {
            dayElement.classList.add('ovulation-day');
        }
        
        const dayNumber = document.createElement('span');
        dayNumber.className = 'day-number';
        dayNumber.textContent = day;
        dayElement.appendChild(dayNumber);
        
        dayElement.addEventListener('click', () => handleDayClick(date));
        calendarGrid.appendChild(dayElement);
    }
}

// Check if date is a period day
function isPeriodDay(date) {
    if (!periodData || !periodData.periods || periodData.periods.length === 0) {
        return false;
    }
    return periodData.periods.some(period => {
        if (!period || !period.start) return false;
        const start = new Date(period.start);
        const end = new Date(period.end || period.start);
        // Normalize dates to compare only dates, not times
        const checkDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const startDate = new Date(start.getFullYear(), start.getMonth(), start.getDate());
        const endDate = new Date(end.getFullYear(), end.getMonth(), end.getDate());
        return checkDate >= startDate && checkDate <= endDate;
    });
}

// Check if date is predicted period day
function isPredictedPeriodDay(date) {
    if (!periodData || !periodData.lastPeriodStart || !periodData.cycleLength) return false;
    
    const lastPeriod = new Date(periodData.lastPeriodStart);
    const nextPeriodStart = new Date(lastPeriod);
    nextPeriodStart.setDate(nextPeriodStart.getDate() + periodData.cycleLength);
    
    const nextPeriodEnd = new Date(nextPeriodStart);
    nextPeriodEnd.setDate(nextPeriodEnd.getDate() + (periodData.periodLength || 5) - 1);
    
    // Normalize dates
    const checkDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const startDate = new Date(nextPeriodStart.getFullYear(), nextPeriodStart.getMonth(), nextPeriodStart.getDate());
    const endDate = new Date(nextPeriodEnd.getFullYear(), nextPeriodEnd.getMonth(), nextPeriodEnd.getDate());
    
    return checkDate >= startDate && checkDate <= endDate && !isPeriodDay(date);
}

// Check if date is fertile day
function isFertileDay(date) {
    if (!periodData || !periodData.lastPeriodStart || !periodData.cycleLength) return false;
    
    const lastPeriod = new Date(periodData.lastPeriodStart);
    const ovulationDay = new Date(lastPeriod);
    ovulationDay.setDate(ovulationDay.getDate() + periodData.cycleLength - 14);
    
    const fertileStart = new Date(ovulationDay);
    fertileStart.setDate(fertileStart.getDate() - 5);
    
    const fertileEnd = new Date(ovulationDay);
    fertileEnd.setDate(fertileEnd.getDate() + 1);
    
    // Normalize dates
    const checkDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const startDate = new Date(fertileStart.getFullYear(), fertileStart.getMonth(), fertileStart.getDate());
    const endDate = new Date(fertileEnd.getFullYear(), fertileEnd.getMonth(), fertileEnd.getDate());
    
    return checkDate >= startDate && checkDate <= endDate && !isPeriodDay(date) && !isPredictedPeriodDay(date);
}

// Check if date is ovulation day
function isOvulationDay(date) {
    if (!periodData || !periodData.lastPeriodStart || !periodData.cycleLength) return false;
    
    const lastPeriod = new Date(periodData.lastPeriodStart);
    const ovulationDay = new Date(lastPeriod);
    ovulationDay.setDate(ovulationDay.getDate() + periodData.cycleLength - 14);
    
    // Normalize dates for comparison
    const checkDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const ovDate = new Date(ovulationDay.getFullYear(), ovulationDay.getMonth(), ovulationDay.getDate());
    
    return checkDate.getTime() === ovDate.getTime();
}

// Handle day click
function handleDayClick(date) {
    console.log('Clicked date:', date);
    // You can add functionality to show day details or add symptoms
}

// Update predictions
function updatePredictions() {
    const nextPeriodDate = document.getElementById('nextPeriodDate');
    const daysUntilPeriod = document.getElementById('daysUntilPeriod');
    const cycleLength = document.getElementById('cycleLength');
    const periodLength = document.getElementById('periodLength');
    
    if (!nextPeriodDate || !daysUntilPeriod || !cycleLength || !periodLength) {
        console.warn('Prediction elements not found');
        return;
    }
    
    if (periodData.lastPeriodStart) {
        const lastPeriod = new Date(periodData.lastPeriodStart);
        const nextPeriod = new Date(lastPeriod);
        nextPeriod.setDate(nextPeriod.getDate() + periodData.cycleLength);
        
        const today = new Date();
        const daysUntil = Math.ceil((nextPeriod - today) / (1000 * 60 * 60 * 24));
        
        nextPeriodDate.textContent = nextPeriod.toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric',
            year: 'numeric'
        });
        
        if (daysUntil > 0) {
            daysUntilPeriod.textContent = `In ${daysUntil} days`;
        } else if (daysUntil === 0) {
            daysUntilPeriod.textContent = 'Today';
        } else {
            daysUntilPeriod.textContent = `${Math.abs(daysUntil)} days ago`;
        }
    } else {
        nextPeriodDate.textContent = 'Track your first period';
        daysUntilPeriod.textContent = 'Start tracking to get predictions';
    }
    
    cycleLength.textContent = `${periodData.cycleLength} days`;
    periodLength.textContent = `${periodData.periodLength} days`;
}

// Setup event listeners
function setupEventListeners() {
    try {
        // Month navigation
        const prevMonthBtn = document.getElementById('prevMonth');
        const nextMonthBtn = document.getElementById('nextMonth');
        
        if (prevMonthBtn) {
            prevMonthBtn.addEventListener('click', () => {
                currentDate.setMonth(currentDate.getMonth() - 1);
                initializeCalendar();
            });
        }
        
        if (nextMonthBtn) {
            nextMonthBtn.addEventListener('click', () => {
                currentDate.setMonth(currentDate.getMonth() + 1);
                initializeCalendar();
            });
        }
    
        // Quick action buttons
        const startPeriodBtn = document.getElementById('startPeriodBtn');
        const endPeriodBtn = document.getElementById('endPeriodBtn');
        const addSymptomBtn = document.getElementById('addSymptomBtn');
        
        if (startPeriodBtn) {
            startPeriodBtn.addEventListener('click', () => {
                openModal('startPeriodModal');
                const periodStartDate = document.getElementById('periodStartDate');
                if (periodStartDate) {
                    periodStartDate.valueAsDate = new Date();
                }
            });
        }
        
        if (endPeriodBtn) {
            endPeriodBtn.addEventListener('click', () => {
                endCurrentPeriod();
            });
        }
        
        if (addSymptomBtn) {
            addSymptomBtn.addEventListener('click', () => {
                openModal('symptomModal');
                const symptomDate = document.getElementById('symptomDate');
                if (symptomDate) {
                    symptomDate.valueAsDate = new Date();
                }
            });
        }
        
        // Form submissions
        const startPeriodForm = document.getElementById('startPeriodForm');
        const symptomForm = document.getElementById('symptomForm');
        
        if (startPeriodForm) {
            startPeriodForm.addEventListener('submit', (e) => {
                e.preventDefault();
                startPeriod();
            });
        }
        
        if (symptomForm) {
            symptomForm.addEventListener('submit', (e) => {
                e.preventDefault();
                addSymptom();
            });
        }
        
        // Close modals
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                closeAllModals();
            });
        });
        
        // Close modal on outside click
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                closeAllModals();
            }
        });
    } catch (error) {
        console.error('Error setting up event listeners:', error);
    }
}

// Start period
function startPeriod() {
    try {
        const startDateEl = document.getElementById('periodStartDate');
        const flowIntensityEl = document.getElementById('flowIntensity');
        
        if (!startDateEl || !flowIntensityEl) {
            alert('Form fields not found');
            return;
        }
        
        const startDate = startDateEl.value;
        const flowIntensity = flowIntensityEl.value;
    
        const period = {
            start: startDate,
            end: null,
            flowIntensity: flowIntensity
        };
        
        if (!periodData.periods) {
            periodData.periods = [];
        }
        
        periodData.periods.push(period);
        periodData.lastPeriodStart = startDate;
        
        // Calculate end date based on period length
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + periodData.periodLength - 1);
        period.end = endDate.toISOString().split('T')[0];
        
        savePeriodData();
        initializeCalendar();
        updatePredictions();
        updateInsights();
        closeAllModals();
        
        alert('Period started! We\'ll track it for you.');
    } catch (error) {
        console.error('Error starting period:', error);
        alert('Error starting period. Please try again.');
    }
}

// End current period
function endCurrentPeriod() {
    try {
        if (!periodData || !periodData.periods) {
            alert('No period data found');
            return;
        }
        
        const activePeriod = periodData.periods.find(p => !p.end);
        if (activePeriod) {
            activePeriod.end = new Date().toISOString().split('T')[0];
            
            // Update cycle length based on last two periods
            if (periodData.periods.length >= 2) {
                const periods = periodData.periods.slice(-2);
                const cycleLength = Math.round(
                    (new Date(periods[1].start) - new Date(periods[0].start)) / (1000 * 60 * 60 * 24)
                );
                if (cycleLength > 0) {
                    periodData.cycleLength = cycleLength;
                }
            }
            
            savePeriodData();
            initializeCalendar();
            updatePredictions();
            updateInsights();
            alert('Period ended! Your cycle data has been updated.');
        } else {
            alert('No active period to end.');
        }
    } catch (error) {
        console.error('Error ending period:', error);
        alert('Error ending period. Please try again.');
    }
}

// Add symptom
function addSymptom() {
    try {
        const dateEl = document.getElementById('symptomDate');
        const typeEl = document.getElementById('symptomType');
        const severityEl = document.getElementById('symptomSeverity');
        
        if (!dateEl || !typeEl || !severityEl) {
            alert('Form fields not found');
            return;
        }
        
        const date = dateEl.value;
        const type = typeEl.value;
        const severity = severityEl.value;
    
    if (!periodData.symptoms) {
        periodData.symptoms = [];
    }
    
    periodData.symptoms.push({
        date: date,
        type: type,
        severity: severity
    });
    
    savePeriodData();
    closeAllModals();
    alert('Symptom added successfully!');
    } catch (error) {
        console.error('Error adding symptom:', error);
        alert('Error adding symptom. Please try again.');
    }
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

// Save period data to localStorage
function savePeriodData() {
    localStorage.setItem('periodData', JSON.stringify(periodData));
}

// Load period data from localStorage
function loadPeriodData() {
    const saved = localStorage.getItem('periodData');
    if (saved) {
        periodData = JSON.parse(saved);
    }
}

// Update insights
function updateInsights() {
    try {
        if (!periodData || !periodData.periods) {
            return;
        }
        
        if (periodData.periods.length >= 3) {
            const recentPeriods = periodData.periods.slice(-3);
            const cycleLengths = [];
            
            for (let i = 1; i < recentPeriods.length; i++) {
                const length = Math.round(
                    (new Date(recentPeriods[i].start) - new Date(recentPeriods[i-1].start)) / (1000 * 60 * 60 * 24)
                );
                cycleLengths.push(length);
            }
            
            const avgCycle = Math.round(cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length);
            const avgCycleEl = document.getElementById('avgCycle');
            if (avgCycleEl) {
                avgCycleEl.textContent = `${avgCycle} days`;
            }
            
            const periodLengths = recentPeriods.map(p => {
                if (p.end) {
                    return Math.round(
                        (new Date(p.end) - new Date(p.start)) / (1000 * 60 * 60 * 24)
                    ) + 1;
                }
                return periodData.periodLength;
            });
            
            const avgPeriod = Math.round(periodLengths.reduce((a, b) => a + b, 0) / periodLengths.length);
            const avgPeriodEl = document.getElementById('avgPeriod');
            if (avgPeriodEl) {
                avgPeriodEl.textContent = `${avgPeriod} days`;
            }
            
            // Calculate regularity
            const cycleVariance = Math.max(...cycleLengths) - Math.min(...cycleLengths);
            const regularity = cycleVariance <= 3 ? 'Regular' : 'Irregular';
            const regularityEl = document.getElementById('regularity');
            if (regularityEl) {
                regularityEl.textContent = regularity;
            }
        }
        
        // Update ovulation date
        if (periodData.lastPeriodStart) {
            const lastPeriod = new Date(periodData.lastPeriodStart);
            const ovulationDay = periodData.cycleLength - 14;
            const ovulationDateEl = document.getElementById('ovulationDate');
            if (ovulationDateEl) {
                ovulationDateEl.textContent = `Day ${ovulationDay}`;
            }
        }
    } catch (error) {
        console.error('Error updating insights:', error);
    }
}

// Update insights function is called in main initialization

