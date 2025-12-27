// Baby Tracking JavaScript

// Baby data stored in localStorage
let babyData = JSON.parse(localStorage.getItem('babyData')) || {
    name: null,
    birthDate: null,
    gender: null,
    birthWeight: null,
    birthHeight: null,
    weightLog: [],
    heightLog: [],
    headCircLog: [],
    milestones: [],
    vaccinations: [],
    feedings: [],
    sleepLogs: [],
    diaperLogs: []
};

// Vaccination schedule based on age
const vaccinationSchedule = [
    { name: 'Hepatitis B (1st dose)', age: 0, ageUnit: 'birth' },
    { name: 'Hepatitis B (2nd dose)', age: 1, ageUnit: 'month' },
    { name: 'DTaP (1st dose)', age: 2, ageUnit: 'months' },
    { name: 'Hib (1st dose)', age: 2, ageUnit: 'months' },
    { name: 'Polio (1st dose)', age: 2, ageUnit: 'months' },
    { name: 'PCV13 (1st dose)', age: 2, ageUnit: 'months' },
    { name: 'Rotavirus (1st dose)', age: 2, ageUnit: 'months' },
    { name: 'DTaP (2nd dose)', age: 4, ageUnit: 'months' },
    { name: 'Hib (2nd dose)', age: 4, ageUnit: 'months' },
    { name: 'Polio (2nd dose)', age: 4, ageUnit: 'months' },
    { name: 'PCV13 (2nd dose)', age: 4, ageUnit: 'months' },
    { name: 'Rotavirus (2nd dose)', age: 4, ageUnit: 'months' },
    { name: 'DTaP (3rd dose)', age: 6, ageUnit: 'months' },
    { name: 'Hib (3rd dose)', age: 6, ageUnit: 'months' },
    { name: 'Polio (3rd dose)', age: 6, ageUnit: 'months' },
    { name: 'PCV13 (3rd dose)', age: 6, ageUnit: 'months' },
    { name: 'Hepatitis B (3rd dose)', age: 6, ageUnit: 'months' },
    { name: 'Influenza (Annual)', age: 6, ageUnit: 'months' },
    { name: 'MMR (1st dose)', age: 12, ageUnit: 'months' },
    { name: 'Varicella (1st dose)', age: 12, ageUnit: 'months' },
    { name: 'Hepatitis A (1st dose)', age: 12, ageUnit: 'months' },
    { name: 'PCV13 (4th dose)', age: 12, ageUnit: 'months' },
    { name: 'Hepatitis A (2nd dose)', age: 18, ageUnit: 'months' },
    { name: 'DTaP (4th dose)', age: 18, ageUnit: 'months' },
    { name: 'Hib (4th dose)', age: 18, ageUnit: 'months' },
    { name: 'MMR (2nd dose)', age: 4, ageUnit: 'years' },
    { name: 'Varicella (2nd dose)', age: 4, ageUnit: 'years' },
    { name: 'DTaP (5th dose)', age: 4, ageUnit: 'years' },
    { name: 'Polio (4th dose)', age: 4, ageUnit: 'years' }
];

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeBabyPage();
    setupEventListeners();
    updateAllSections();
});

// Initialize baby page
function initializeBabyPage() {
    if (!babyData.birthDate) {
        // Show modal to set baby info if not set
        document.getElementById('babyInfoModal').style.display = 'block';
    }
}

// Setup event listeners
function setupEventListeners() {
    // Baby info
    document.getElementById('editBabyInfoBtn').addEventListener('click', () => {
        document.getElementById('babyInfoModal').style.display = 'block';
    });
    document.getElementById('babyInfoForm').addEventListener('submit', handleBabyInfoSubmit);

    // Growth charts
    document.getElementById('logWeightBtn').addEventListener('click', () => {
        document.getElementById('weightModal').style.display = 'block';
        document.getElementById('weightDate').valueAsDate = new Date();
    });
    document.getElementById('weightForm').addEventListener('submit', handleWeightSubmit);

    document.getElementById('logHeightBtn').addEventListener('click', () => {
        document.getElementById('heightModal').style.display = 'block';
        document.getElementById('heightDate').valueAsDate = new Date();
    });
    document.getElementById('heightForm').addEventListener('submit', handleHeightSubmit);

    document.getElementById('logHeadCircBtn').addEventListener('click', () => {
        document.getElementById('headCircModal').style.display = 'block';
        document.getElementById('headCircDate').valueAsDate = new Date();
    });
    document.getElementById('headCircForm').addEventListener('submit', handleHeadCircSubmit);

    // Milestones
    document.getElementById('addMilestoneBtn').addEventListener('click', () => {
        document.getElementById('milestoneModal').style.display = 'block';
        document.getElementById('milestoneDate').valueAsDate = new Date();
    });
    document.getElementById('milestoneForm').addEventListener('submit', handleMilestoneSubmit);

    // Feeding & Sleep
    document.getElementById('logFeedingBtn').addEventListener('click', () => {
        document.getElementById('feedingModal').style.display = 'block';
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        document.getElementById('feedingDateTime').value = now.toISOString().slice(0, 16);
    });
    document.getElementById('feedingForm').addEventListener('submit', handleFeedingSubmit);

    document.getElementById('logSleepBtn').addEventListener('click', () => {
        document.getElementById('sleepModal').style.display = 'block';
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        document.getElementById('sleepStart').value = now.toISOString().slice(0, 16);
        document.getElementById('sleepEnd').value = now.toISOString().slice(0, 16);
    });
    document.getElementById('sleepForm').addEventListener('submit', handleSleepSubmit);

    // Diaper
    document.getElementById('logDiaperBtn').addEventListener('click', () => {
        document.getElementById('diaperModal').style.display = 'block';
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        document.getElementById('diaperDateTime').value = now.toISOString().slice(0, 16);
    });
    document.getElementById('diaperForm').addEventListener('submit', handleDiaperSubmit);

    // Close modals
    document.querySelectorAll('.close-modal').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });
}

// Calculate baby's age
function calculateBabyAge() {
    if (!babyData.birthDate) return null;
    
    const birthDate = new Date(babyData.birthDate);
    const today = new Date();
    const diffTime = today - birthDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return null;
    
    const months = Math.floor(diffDays / 30);
    const weeks = Math.floor((diffDays % 30) / 7);
    const days = diffDays % 7;
    
    if (months > 0) {
        return `${months} month${months > 1 ? 's' : ''}, ${weeks} week${weeks !== 1 ? 's' : ''}`;
    } else if (weeks > 0) {
        return `${weeks} week${weeks > 1 ? 's' : ''}, ${days} day${days !== 1 ? 's' : ''}`;
    } else {
        return `${diffDays} day${diffDays !== 1 ? 's' : ''}`;
    }
}

// Update all sections
function updateAllSections() {
    updateBabyInfo();
    updateWellnessDashboard();
    updateGrowthCharts();
    updateMilestones();
    updateVaccinationSchedule();
    updateFeedingStats();
    updateSleepStats();
    updateDiaperStats();
}

// Update baby info
function updateBabyInfo() {
    const age = calculateBabyAge();
    if (age) {
        document.getElementById('babyAge').textContent = age;
        const birthDate = new Date(babyData.birthDate);
        document.getElementById('babyBirthDate').textContent = `Born: ${birthDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;
    } else {
        document.getElementById('babyAge').textContent = 'Not set';
        document.getElementById('babyBirthDate').textContent = 'Set your baby\'s birth date to get started';
    }
}

// Update wellness dashboard
function updateWellnessDashboard() {
    const dashboard = document.getElementById('wellnessDashboard');
    const age = calculateBabyAge();
    
    if (!age) {
        dashboard.innerHTML = '<p>Please set your baby\'s information to see the dashboard.</p>';
        return;
    }
    
    const latestWeight = babyData.weightLog.length > 0 ? 
        babyData.weightLog[babyData.weightLog.length - 1] : null;
    const latestHeight = babyData.heightLog.length > 0 ? 
        babyData.heightLog[babyData.heightLog.length - 1] : null;
    
    dashboard.innerHTML = `
        <div class="dashboard-card">
            <div class="dashboard-icon">👶</div>
            <h4>Age</h4>
            <p class="dashboard-value">${age}</p>
        </div>
        <div class="dashboard-card">
            <div class="dashboard-icon">⚖️</div>
            <h4>Latest Weight</h4>
            <p class="dashboard-value">${latestWeight ? latestWeight.value + ' kg' : 'Not logged'}</p>
        </div>
        <div class="dashboard-card">
            <div class="dashboard-icon">📏</div>
            <h4>Latest Height</h4>
            <p class="dashboard-value">${latestHeight ? latestHeight.value + ' cm' : 'Not logged'}</p>
        </div>
        <div class="dashboard-card">
            <div class="dashboard-icon">🎯</div>
            <h4>Milestones</h4>
            <p class="dashboard-value">${babyData.milestones.length}</p>
        </div>
    `;
}

// Update growth charts
function updateGrowthCharts() {
    const latestWeight = babyData.weightLog.length > 0 ? 
        babyData.weightLog[babyData.weightLog.length - 1] : null;
    const latestHeight = babyData.heightLog.length > 0 ? 
        babyData.heightLog[babyData.heightLog.length - 1] : null;
    const latestHeadCirc = babyData.headCircLog.length > 0 ? 
        babyData.headCircLog[babyData.headCircLog.length - 1] : null;
    
    document.getElementById('currentWeight').textContent = latestWeight ? 
        `${latestWeight.value} kg` : '--';
    document.getElementById('weightPercentile').textContent = latestWeight ? 
        'Tracked' : 'Not logged';
    
    document.getElementById('currentHeight').textContent = latestHeight ? 
        `${latestHeight.value} cm` : '--';
    document.getElementById('heightPercentile').textContent = latestHeight ? 
        'Tracked' : 'Not logged';
    
    document.getElementById('currentHeadCirc').textContent = latestHeadCirc ? 
        `${latestHeadCirc.value} cm` : '--';
    document.getElementById('headCircPercentile').textContent = latestHeadCirc ? 
        'Tracked' : 'Not logged';
}

// Update milestones
function updateMilestones() {
    const grid = document.getElementById('milestonesGrid');
    
    if (babyData.milestones.length === 0) {
        grid.innerHTML = '<p>No milestones logged yet. Add your first milestone!</p>';
        return;
    }
    
    // Sort by date, newest first
    const sortedMilestones = [...babyData.milestones].sort((a, b) => 
        new Date(b.date) - new Date(a.date)
    );
    
    grid.innerHTML = sortedMilestones.map(milestone => {
        const date = new Date(milestone.date);
        const milestoneNames = {
            'first-smile': 'First Smile 😊',
            'first-laugh': 'First Laugh 😂',
            'roll-over': 'Roll Over 🔄',
            'sit-up': 'Sit Up 🪑',
            'crawl': 'Crawl 🐛',
            'first-word': 'First Word 🗣️',
            'stand': 'Stand Up 🦵',
            'walk': 'First Steps 🚶',
            'other': 'Milestone 🎯'
        };
        
        return `
            <div class="milestone-card">
                <div class="milestone-icon">${getMilestoneIcon(milestone.type)}</div>
                <h4>${milestoneNames[milestone.type] || 'Milestone'}</h4>
                <p class="milestone-date">${date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                ${milestone.notes ? `<p class="milestone-notes">${milestone.notes}</p>` : ''}
            </div>
        `;
    }).join('');
}

function getMilestoneIcon(type) {
    const icons = {
        'first-smile': '😊',
        'first-laugh': '😂',
        'roll-over': '🔄',
        'sit-up': '🪑',
        'crawl': '🐛',
        'first-word': '🗣️',
        'stand': '🦵',
        'walk': '🚶',
        'other': '🎯'
    };
    return icons[type] || '🎯';
}

// Update vaccination schedule
function updateVaccinationSchedule() {
    if (!babyData.birthDate) {
        document.getElementById('vaccinationList').innerHTML = 
            '<p>Please set your baby\'s birth date to see the vaccination schedule.</p>';
        return;
    }
    
    const birthDate = new Date(babyData.birthDate);
    const today = new Date();
    
    const vaccinations = vaccinationSchedule.map(vacc => {
        const dueDate = new Date(birthDate);
        if (vacc.ageUnit === 'birth') {
            dueDate.setDate(dueDate.getDate());
        } else if (vacc.ageUnit === 'month' || vacc.ageUnit === 'months') {
            dueDate.setMonth(dueDate.getMonth() + vacc.age);
        } else if (vacc.ageUnit === 'years') {
            dueDate.setFullYear(dueDate.getFullYear() + vacc.age);
        }
        
        const isDue = dueDate <= today;
        const isOverdue = dueDate < today && !babyData.vaccinations.some(v => v.name === vacc.name);
        const isCompleted = babyData.vaccinations.some(v => v.name === vacc.name);
        
        return {
            ...vacc,
            dueDate,
            isDue,
            isOverdue,
            isCompleted
        };
    }).filter(v => {
        // Only show vaccinations that are due or upcoming (within next 6 months)
        const sixMonthsFromNow = new Date();
        sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
        return v.dueDate <= sixMonthsFromNow;
    });
    
    const list = document.getElementById('vaccinationList');
    list.innerHTML = vaccinations.map(vacc => {
        let statusClass = 'upcoming';
        let statusText = 'Upcoming';
        
        if (vacc.isCompleted) {
            statusClass = 'completed';
            statusText = 'Completed';
        } else if (vacc.isOverdue) {
            statusClass = 'overdue';
            statusText = 'Overdue';
        } else if (vacc.isDue) {
            statusClass = 'due';
            statusText = 'Due Now';
        }
        
        return `
            <div class="vaccination-item ${statusClass}">
                <div class="vaccination-icon">💉</div>
                <div class="vaccination-content">
                    <h4>${vacc.name}</h4>
                    <p>Due: ${vacc.dueDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>
                <div class="vaccination-status ${statusClass}">${statusText}</div>
            </div>
        `;
    }).join('');
}

// Update feeding stats
function updateFeedingStats() {
    const today = new Date().toDateString();
    const todayFeedings = babyData.feedings.filter(f => 
        new Date(f.dateTime).toDateString() === today
    );
    
    const totalFeeds = todayFeedings.length;
    const totalDuration = todayFeedings.reduce((sum, f) => sum + (f.duration || 0), 0);
    
    document.getElementById('totalFeeds').textContent = totalFeeds;
    document.getElementById('totalFeedingDuration').textContent = totalDuration + ' min';
}

// Update sleep stats
function updateSleepStats() {
    const today = new Date().toDateString();
    const todaySleeps = babyData.sleepLogs.filter(s => {
        const sleepDate = new Date(s.startTime).toDateString();
        return sleepDate === today;
    });
    
    const totalSleepHours = todaySleeps.reduce((sum, s) => {
        const start = new Date(s.startTime);
        const end = new Date(s.endTime);
        const hours = (end - start) / (1000 * 60 * 60);
        return sum + hours;
    }, 0);
    
    const naps = todaySleeps.filter(s => s.type === 'nap').length;
    
    document.getElementById('totalSleep').textContent = totalSleepHours.toFixed(1) + ' hrs';
    document.getElementById('totalNaps').textContent = naps;
}

// Update diaper stats
function updateDiaperStats() {
    const today = new Date().toDateString();
    const todayDiapers = babyData.diaperLogs.filter(d => 
        new Date(d.dateTime).toDateString() === today
    );
    
    const wetCount = todayDiapers.filter(d => d.type === 'wet' || d.type === 'both').length;
    const dirtyCount = todayDiapers.filter(d => d.type === 'dirty' || d.type === 'both').length;
    
    document.getElementById('wetDiaperCount').textContent = wetCount;
    document.getElementById('dirtyDiaperCount').textContent = dirtyCount;
}

// Form handlers
function handleBabyInfoSubmit(e) {
    e.preventDefault();
    babyData.name = document.getElementById('babyName').value;
    babyData.birthDate = document.getElementById('babyBirthDateInput').value;
    babyData.gender = document.getElementById('babyGender').value;
    babyData.birthWeight = parseFloat(document.getElementById('birthWeight').value) || null;
    babyData.birthHeight = parseFloat(document.getElementById('birthHeight').value) || null;
    
    // Add birth measurements to logs if provided
    if (babyData.birthWeight) {
        babyData.weightLog.push({
            date: babyData.birthDate,
            value: babyData.birthWeight
        });
    }
    if (babyData.birthHeight) {
        babyData.heightLog.push({
            date: babyData.birthDate,
            value: babyData.birthHeight
        });
    }
    
    saveBabyData();
    document.getElementById('babyInfoModal').style.display = 'none';
    updateAllSections();
}

function handleWeightSubmit(e) {
    e.preventDefault();
    babyData.weightLog.push({
        date: document.getElementById('weightDate').value,
        value: parseFloat(document.getElementById('weightValue').value)
    });
    saveBabyData();
    document.getElementById('weightModal').style.display = 'none';
    updateGrowthCharts();
    updateWellnessDashboard();
}

function handleHeightSubmit(e) {
    e.preventDefault();
    babyData.heightLog.push({
        date: document.getElementById('heightDate').value,
        value: parseFloat(document.getElementById('heightValue').value)
    });
    saveBabyData();
    document.getElementById('heightModal').style.display = 'none';
    updateGrowthCharts();
    updateWellnessDashboard();
}

function handleHeadCircSubmit(e) {
    e.preventDefault();
    babyData.headCircLog.push({
        date: document.getElementById('headCircDate').value,
        value: parseFloat(document.getElementById('headCircValue').value)
    });
    saveBabyData();
    document.getElementById('headCircModal').style.display = 'none';
    updateGrowthCharts();
}

function handleMilestoneSubmit(e) {
    e.preventDefault();
    babyData.milestones.push({
        date: document.getElementById('milestoneDate').value,
        type: document.getElementById('milestoneType').value,
        notes: document.getElementById('milestoneNotes').value
    });
    saveBabyData();
    document.getElementById('milestoneModal').style.display = 'none';
    updateMilestones();
    updateWellnessDashboard();
}

function handleFeedingSubmit(e) {
    e.preventDefault();
    babyData.feedings.push({
        dateTime: document.getElementById('feedingDateTime').value,
        type: document.getElementById('feedingType').value,
        duration: parseInt(document.getElementById('feedingDuration').value) || null,
        amount: parseInt(document.getElementById('feedingAmount').value) || null
    });
    saveBabyData();
    document.getElementById('feedingModal').style.display = 'none';
    updateFeedingStats();
}

function handleSleepSubmit(e) {
    e.preventDefault();
    babyData.sleepLogs.push({
        startTime: document.getElementById('sleepStart').value,
        endTime: document.getElementById('sleepEnd').value,
        type: document.getElementById('sleepType').value
    });
    saveBabyData();
    document.getElementById('sleepModal').style.display = 'none';
    updateSleepStats();
}

function handleDiaperSubmit(e) {
    e.preventDefault();
    babyData.diaperLogs.push({
        dateTime: document.getElementById('diaperDateTime').value,
        type: document.getElementById('diaperType').value,
        notes: document.getElementById('diaperNotes').value
    });
    saveBabyData();
    document.getElementById('diaperModal').style.display = 'none';
    updateDiaperStats();
}

// Save baby data to localStorage
function saveBabyData() {
    localStorage.setItem('babyData', JSON.stringify(babyData));
}


