// Demo Skills Data
let skills = [
    {
        id: 1,
        name: 'Piano',
        category: '🎵',
        hours: 3450,
        color: '#6366f1'
    },
    {
        id: 2,
        name: 'Spanish',
        category: '📚',
        hours: 1820,
        color: '#ec4899'
    },
    {
        id: 3,
        name: 'Web Development',
        category: '💻',
        hours: 5670,
        color: '#10b981'
    },
    {
        id: 4,
        name: 'Digital Painting',
        category: '🎨',
        hours: 890,
        color: '#f59e0b'
    },
    {
        id: 5,
        name: 'Rock Climbing',
        category: '🏃',
        hours: 2340,
        color: '#3b82f6'
    },
    {
        id: 6,
        name: 'Photography',
        category: '🎨',
        hours: 4120,
        color: '#8b5cf6'
    }
];

let editingSkillId = null;
let deletingSkillId = null;
let activeTimer = null;
let timerInterval = null;
let timerSeconds = 0;
let hoursThisWeek = 12.4;

// Settings data
let selectedAvatar = 'DU';
const availableAvatars = [
    '👨', '👩', '🧑', '👨‍💼', '👩‍💼', '🧑‍💼',
    '👨‍🎓', '👩‍🎓', '🧑‍🎓', '👨‍🎨', '👩‍🎨', '🧑‍🎨',
    '👨‍💻', '👩‍💻', '🧑‍💻', '👨‍🔬', '👩‍🔬', '🧑‍🔬',
    '🦸‍♂️', '🦸‍♀️', '🦸', '🧙‍♂️', '🧙‍♀️', '🧙',
    '🐶', '🐱', '🐭', '🐹', '🐰', '🦊',
    '🐻', '🐼', '🐨', '🐯', '🦁', '🐮'
];

// Achievements data
let userStats = {
    totalHoursLogged: 18290,
    currentStreak: 15,
    longestStreak: 47,
    skillsTracked: 6,
    daysWithPractice: 342,
    sessionsLogged: 156,
    earlyBirdSessions: 8,
    nightOwlSessions: 2,
    weekendSessions: 45,
    holidaySessions: 7,
    monthsActive: 12,
    maxDailyHours: 3,
    maxWeeklyHours: 38
};

const achievements = [
    // Milestones
    { id: 'first-steps', category: 'milestones', name: 'First Steps', description: 'Log your first hour', icon: '👣', requirement: 1, current: () => userStats.totalHoursLogged, max: 1 },
    { id: 'century-club', category: 'milestones', name: 'Century Club', description: 'Reach 100 hours in any skill', icon: '💯', requirement: 100, current: () => Math.max(...skills.map(s => s.hours)), max: 100 },
    { id: 'halfway-there', category: 'milestones', name: 'Halfway There', description: 'Reach 5,000 hours in any skill', icon: '🎯', requirement: 5000, current: () => Math.max(...skills.map(s => s.hours)), max: 5000 },
    { id: 'master', category: 'milestones', name: 'Master', description: 'Complete 10,000 hours in a skill', icon: '👑', requirement: 10000, current: () => Math.max(...skills.map(s => s.hours)), max: 10000 },
    { id: 'total-dedication', category: 'milestones', name: 'Total Dedication', description: 'Accumulate 10,000 hours across all skills', icon: '🏆', requirement: 10000, current: () => userStats.totalHoursLogged, max: 10000 },
    
    // Consistency
    { id: 'streak-starter', category: 'consistency', name: 'Streak Starter', description: 'Practice 3 days in a row', icon: '🔥', requirement: 3, current: () => userStats.currentStreak, max: 3 },
    { id: 'week-warrior', category: 'consistency', name: 'Week Warrior', description: 'Practice 7 days in a row', icon: '📅', requirement: 7, current: () => userStats.longestStreak, max: 7 },
    { id: 'monthly-master', category: 'consistency', name: 'Monthly Master', description: 'Practice 30 days in a row', icon: '🗓️', requirement: 30, current: () => userStats.longestStreak, max: 30 },
    { id: 'unstoppable', category: 'consistency', name: 'Unstoppable', description: '100-day streak', icon: '⚡', requirement: 100, current: () => userStats.longestStreak, max: 100 },
    { id: 'early-bird', category: 'consistency', name: 'Early Bird', description: 'Practice before 7 AM (5 times)', icon: '🌅', requirement: 5, current: () => userStats.earlyBirdSessions, max: 5 },
    { id: 'night-owl', category: 'consistency', name: 'Night Owl', description: 'Practice after 10 PM (5 times)', icon: '🌙', requirement: 5, current: () => userStats.nightOwlSessions, max: 5 },
    
    // Diversity
    { id: 'multi-talented', category: 'diversity', name: 'Multi-Talented', description: 'Track 3 different skills', icon: '🎨', requirement: 3, current: () => userStats.skillsTracked, max: 3 },
    { id: 'renaissance', category: 'diversity', name: 'Renaissance Person', description: 'Track 6+ different skills', icon: '🌟', requirement: 6, current: () => userStats.skillsTracked, max: 6 },
    { id: 'balanced-growth', category: 'diversity', name: 'Balanced Growth', description: 'Have 3 skills with 100+ hours each', icon: '⚖️', requirement: 3, current: () => skills.filter(s => s.hours >= 100).length, max: 3 },
    
    // Speed & Intensity
    { id: 'power-hour', category: 'speed', name: 'Power Hour', description: 'Log 5 hours in a single day', icon: '💪', requirement: 5, current: () => userStats.maxDailyHours, max: 5 },
    { id: 'marathon-week', category: 'speed', name: 'Marathon Week', description: 'Log 30+ hours in one week', icon: '🏃‍♂️', requirement: 30, current: () => userStats.maxWeeklyHours, max: 30 },
    { id: 'focused', category: 'speed', name: 'Focused', description: 'Log 3+ hours in a single session', icon: '🎯', requirement: 1, current: () => 1, max: 1 },
    
    // Special
    { id: 'weekend-warrior', category: 'special', name: 'Weekend Warrior', description: 'Practice on 10 weekends', icon: '🎉', requirement: 10, current: () => userStats.weekendSessions, max: 10 },
    { id: 'holiday-dedication', category: 'special', name: 'Holiday Dedication', description: 'Practice on 5 holidays', icon: '🎊', requirement: 5, current: () => userStats.holidaySessions, max: 5 },
    { id: 'year-complete', category: 'special', name: 'Year Complete', description: 'Practice in all 12 months', icon: '📆', requirement: 12, current: () => userStats.monthsActive, max: 12 },
    { id: 'perfect-week', category: 'special', name: 'Perfect Week', description: 'Practice every single day for 7 days', icon: '✨', requirement: 7, current: () => userStats.currentStreak >= 7 ? 7 : userStats.currentStreak, max: 7 },
    { id: 'the-grind', category: 'special', name: 'The Grind', description: 'Add time manually 100 times', icon: '⏰', requirement: 100, current: () => userStats.sessionsLogged, max: 100 }
];

// Initialize demo
document.addEventListener('DOMContentLoaded', function() {
    renderSkills();
    updateStats();
    initModal();
    initDeleteModal();
    initNavigation();
    initHeatmapTimeframe();
    generateHeatmap(12);
    initSettings();
    initAchievements();
});

// Render all skills
function renderSkills() {
    const grid = document.getElementById('skillsGrid');
    if (!grid) return;
    
    grid.innerHTML = skills.map(skill => createSkillCard(skill)).join('');
    
    // Add event listeners to all buttons
    document.querySelectorAll('.skill-edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.closest('.skill-edit-btn').dataset.id);
            openEditModal(id);
        });
    });
    
    document.querySelectorAll('.skill-delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.closest('.skill-delete-btn').dataset.id);
            deleteSkill(id);
        });
    });
    
    document.querySelectorAll('.skill-add-time-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const button = e.target.closest('.skill-add-time-btn');
            const id = parseInt(button.dataset.id);
            const minutes = parseInt(button.dataset.minutes);
            addTime(id, minutes);
        });
    });
    
    document.querySelectorAll('.skill-timer-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.closest('.skill-timer-btn').dataset.id);
            toggleTimer(id);
        });
    });
}

// Create skill card HTML
function createSkillCard(skill) {
    const progress = (skill.hours / 10000) * 100;
    const progressCapped = Math.min(progress, 100);
    const isTimerActive = activeTimer === skill.id;
    
    return `
        <div class="demo-skill-card ${isTimerActive ? 'timer-active' : ''}">
            <div class="skill-card-header">
                <div class="skill-card-title">
                    <span class="skill-icon">${skill.category}</span>
                    <h3>${skill.name}</h3>
                </div>
                <div class="skill-card-actions">
                    <button class="skill-action-btn skill-edit-btn" data-id="${skill.id}" title="Edit">✏️</button>
                    <button class="skill-action-btn skill-delete-btn" data-id="${skill.id}" title="Delete">🗑️</button>
                </div>
            </div>
            
            ${isTimerActive ? `
                <div class="skill-timer-display">
                    <div class="timer-icon">⏱️</div>
                    <div class="timer-time" id="timer-${skill.id}">00:00:00</div>
                </div>
            ` : ''}
            
            <div class="skill-hours">
                <div class="skill-hours-main">${skill.hours.toLocaleString()}</div>
                <div class="skill-hours-sub">of 10,000 hours</div>
            </div>
            
            <div class="skill-progress-bar">
                <div class="skill-progress-fill" style="width: ${progressCapped}%; background: ${skill.color};"></div>
            </div>
            
            <div class="skill-progress-text">${progressCapped.toFixed(1)}% Complete</div>
            
            <div class="skill-buttons">
                <button class="btn ${isTimerActive ? 'btn-danger' : 'btn-primary'} btn-sm skill-timer-btn" data-id="${skill.id}">
                    <span>${isTimerActive ? '⏹' : '▶️'}</span> ${isTimerActive ? 'Stop Timer' : 'Start Timer'}
                </button>
                <button class="btn btn-outline btn-sm skill-add-time-btn" data-id="${skill.id}" data-minutes="30">
                    <span>+</span> 30m
                </button>
                <button class="btn btn-outline btn-sm skill-add-time-btn" data-id="${skill.id}" data-minutes="60">
                    <span>+</span> 1h
                </button>
            </div>
        </div>
    `;
}

// Update stats
function updateStats() {
    const totalHours = skills.reduce((sum, skill) => sum + skill.hours, 0);
    const totalHoursEl = document.getElementById('totalHours');
    const skillCountEl = document.getElementById('skillCount');
    const weekHoursEl = document.querySelector('.demo-stat-card:nth-child(4) .demo-stat-value');
    
    if (totalHoursEl) totalHoursEl.textContent = totalHours.toLocaleString();
    if (skillCountEl) skillCountEl.textContent = skills.length;
    if (weekHoursEl) weekHoursEl.textContent = hoursThisWeek.toFixed(1);
}

// Initialize modal
function initModal() {
    const modal = document.getElementById('skillModal');
    const addBtn = document.getElementById('addSkillBtn');
    const closeBtn = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const form = document.getElementById('skillForm');
    
    if (addBtn) {
        addBtn.addEventListener('click', openAddModal);
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeModal);
    }
    
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }
    
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
    
    // ESC key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

// Open add modal
function openAddModal() {
    editingSkillId = null;
    document.getElementById('modalTitle').textContent = 'Add New Skill';
    document.getElementById('skillForm').reset();
    document.getElementById('skillModal').classList.add('active');
}

// Open edit modal
function openEditModal(id) {
    const skill = skills.find(s => s.id === id);
    if (!skill) return;
    
    editingSkillId = id;
    document.getElementById('modalTitle').textContent = 'Edit Skill';
    document.getElementById('skillName').value = skill.name;
    document.getElementById('skillCategory').value = skill.category;
    document.getElementById('skillHours').value = skill.hours;
    document.getElementById('skillColor').value = skill.color;
    document.getElementById('skillModal').classList.add('active');
}

// Close modal
function closeModal() {
    document.getElementById('skillModal').classList.remove('active');
    editingSkillId = null;
}

// Handle form submit
function handleFormSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('skillName').value.trim();
    const category = document.getElementById('skillCategory').value;
    const hours = parseInt(document.getElementById('skillHours').value) || 0;
    const color = document.getElementById('skillColor').value;
    
    if (!name) return;
    
    if (editingSkillId) {
        // Edit existing skill
        const skill = skills.find(s => s.id === editingSkillId);
        if (skill) {
            skill.name = name;
            skill.category = category;
            skill.hours = hours;
            skill.color = color;
        }
    } else {
        // Add new skill
        const newSkill = {
            id: Date.now(),
            name,
            category,
            hours,
            color
        };
        skills.push(newSkill);
    }
    
    renderSkills();
    updateStats();
    closeModal();
}

// Initialize delete modal
function initDeleteModal() {
    const modal = document.getElementById('deleteModal');
    const closeBtn = document.getElementById('closeDeleteModal');
    const cancelBtn = document.getElementById('cancelDeleteBtn');
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeDeleteModal);
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeDeleteModal);
    }
    
    if (confirmBtn) {
        confirmBtn.addEventListener('click', confirmDelete);
    }
    
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeDeleteModal();
        });
    }
}

// Open delete modal
function openDeleteModal(id) {
    const skill = skills.find(s => s.id === id);
    if (!skill) return;
    
    deletingSkillId = id;
    document.getElementById('deleteSkillName').textContent = skill.name;
    document.getElementById('deleteModal').classList.add('active');
}

// Close delete modal
function closeDeleteModal() {
    document.getElementById('deleteModal').classList.remove('active');
    deletingSkillId = null;
}

// Confirm delete
function confirmDelete() {
    if (deletingSkillId) {
        skills = skills.filter(s => s.id !== deletingSkillId);
        renderSkills();
        updateStats();
        closeDeleteModal();
    }
}

// Delete skill
function deleteSkill(id) {
    openDeleteModal(id);
}

// Add time to skill (in minutes)
function addTime(id, minutes) {
    const skill = skills.find(s => s.id === id);
    if (skill && skill.hours < 10000) {
        const hoursToAdd = minutes / 60;
        skill.hours = Math.min(skill.hours + hoursToAdd, 10000);
        hoursThisWeek += hoursToAdd;
        renderSkills();
        updateStats();
        
        // Show visual feedback
        const card = document.querySelector(`[data-id="${id}"]`).closest('.demo-skill-card');
        card.style.transform = 'scale(1.02)';
        setTimeout(() => {
            card.style.transform = 'scale(1)';
        }, 200);
    }
}

// Toggle timer
function toggleTimer(id) {
    if (activeTimer === id) {
        stopTimer();
    } else {
        startTimer(id);
    }
}

// Start timer
function startTimer(id) {
    // Stop any existing timer
    if (activeTimer) {
        stopTimer();
    }
    
    activeTimer = id;
    timerSeconds = 0;
    
    timerInterval = setInterval(() => {
        timerSeconds++;
        updateTimerDisplay(id);
    }, 1000);
    
    renderSkills();
}

// Stop timer
function stopTimer() {
    if (!activeTimer) return;
    
    clearInterval(timerInterval);
    
    // Convert seconds to hours and add to skill
    const hoursToAdd = Math.round((timerSeconds / 3600) * 100) / 100; // Round to 2 decimals
    const skill = skills.find(s => s.id === activeTimer);
    
    if (skill && hoursToAdd > 0) {
        skill.hours = Math.min(skill.hours + hoursToAdd, 10000);
        hoursThisWeek += hoursToAdd;
        
        // Show notification
        showNotification(`Added ${hoursToAdd.toFixed(2)} hours to ${skill.name}!`);
    }
    
    activeTimer = null;
    timerSeconds = 0;
    timerInterval = null;
    
    renderSkills();
    updateStats();
}

// Update timer display
function updateTimerDisplay(id) {
    const timerEl = document.getElementById(`timer-${id}`);
    if (!timerEl) return;
    
    const hours = Math.floor(timerSeconds / 3600);
    const minutes = Math.floor((timerSeconds % 3600) / 60);
    const seconds = timerSeconds % 60;
    
    timerEl.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'timer-notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Initialize navigation
function initNavigation() {
    const navItems = document.querySelectorAll('.demo-nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = item.dataset.section;
            
            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            // Show corresponding section
            document.querySelectorAll('.demo-section-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(`${section}-section`).classList.add('active');
        });
    });
}

// Initialize heatmap timeframe selector
function initHeatmapTimeframe() {
    const selector = document.getElementById('heatmapTimeframe');
    if (selector) {
        selector.addEventListener('change', (e) => {
            const weeks = parseInt(e.target.value);
            generateHeatmap(weeks);
        });
    }
}

// Generate heatmap data and render
function generateHeatmap(numWeeks = 12) {
    const grid = document.getElementById('heatmapGrid');
    const monthsContainer = document.getElementById('heatmapMonths');
    const subtitle = document.getElementById('heatmapSubtitle');
    if (!grid) return;
    
    // Update subtitle
    const timeframeText = {
        1: 'past week',
        4: 'past 4 weeks',
        12: 'past 3 months',
        26: 'past 6 months',
        52: 'past year'
    };
    if (subtitle) {
        subtitle.textContent = `Your practice intensity over the ${timeframeText[numWeeks] || 'selected period'}`;
    }
    
    const today = new Date();
    const numDays = numWeeks * 7;
    
    // Generate dates for last 12 weeks
    const dates = [];
    for (let i = numDays - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        dates.push(date);
    }
    
    // Generate random practice data
    const heatmapData = dates.map(date => {
        // Higher probability of practice on weekdays
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
        const probability = isWeekend ? 0.5 : 0.8;
        
        if (Math.random() > probability) {
            return { date, hours: 0, level: 0 };
        }
        
        // Random hours between 0.5 and 4
        const hours = Math.random() * 3.5 + 0.5;
        let level;
        if (hours < 1) level = 1;
        else if (hours < 2) level = 2;
        else if (hours < 3) level = 3;
        else level = 4;
        
        return { date, hours: parseFloat(hours.toFixed(1)), level };
    });
    
    // Group by weeks
    const weeks = [];
    for (let i = 0; i < heatmapData.length; i += 7) {
        weeks.push(heatmapData.slice(i, i + 7));
    }
    
    // Generate month labels
    const months = [];
    let currentMonth = -1;
    weeks.forEach((week, weekIndex) => {
        const firstDay = week[0].date;
        const month = firstDay.getMonth();
        if (month !== currentMonth) {
            currentMonth = month;
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            months.push({
                name: monthNames[month],
                position: weekIndex
            });
        }
    });
    
    // Render month labels
    monthsContainer.innerHTML = months.map(m => 
        `<div class="heatmap-month" style="grid-column: ${m.position + 1};">${m.name}</div>`
    ).join('');
    
    // Render heatmap cells
    grid.innerHTML = weeks.map(week => `
        <div class="heatmap-week">
            ${week.map(day => `
                <div class="heatmap-cell" 
                     data-level="${day.level}" 
                     data-date="${day.date.toDateString()}"
                     data-hours="${day.hours}"
                     title="${day.date.toDateString()}: ${day.hours}h">
                </div>
            `).join('')}
        </div>
    `).join('');
    
    // Add hover effect
    document.querySelectorAll('.heatmap-cell').forEach(cell => {
        cell.addEventListener('mouseenter', (e) => {
            const hours = e.target.dataset.hours;
            const date = e.target.dataset.date;
            if (parseFloat(hours) > 0) {
                e.target.style.transform = 'scale(1.2)';
            }
        });
        
        cell.addEventListener('mouseleave', (e) => {
            e.target.style.transform = 'scale(1)';
        });
    });
    
    // Generate skill breakdown
    generateSkillBreakdown(numWeeks);
}

// Generate skill breakdown chart
function generateSkillBreakdown(numWeeks) {
    const container = document.getElementById('skillsBreakdown');
    if (!container) return;
    
    // Generate random hours for each skill based on timeframe
    const skillHours = skills.map(skill => {
        // More weeks = more hours, but keep it reasonable
        const baseHours = Math.random() * 20 * (numWeeks / 12);
        return {
            name: skill.name,
            hours: parseFloat(baseHours.toFixed(1)),
            color: skill.color
        };
    });
    
    // Sort by hours descending
    skillHours.sort((a, b) => b.hours - a.hours);
    
    // Find max hours for scaling
    const maxHours = Math.max(...skillHours.map(s => s.hours));
    
    // Render skill bars
    container.innerHTML = skillHours.map(skill => {
        const percentage = (skill.hours / maxHours) * 100;
        return `
            <div class="skill-bar-container">
                <div class="skill-bar-info">
                    <span class="skill-bar-name">${skill.name}</span>
                    <span class="skill-bar-hours">${skill.hours}h</span>
                </div>
                <div class="skill-bar-track">
                    <div class="skill-bar-fill" style="width: ${percentage}%; background-color: ${skill.color};"></div>
                </div>
            </div>
        `;
    }).join('');
}

// Settings Functions
function initSettings() {
    renderAvatarGrid();
    initPasswordForm();
}

function renderAvatarGrid() {
    const avatarGrid = document.getElementById('avatarGrid');
    if (!avatarGrid) return;
    
    avatarGrid.innerHTML = availableAvatars.map(avatar => {
        const isSelected = avatar === selectedAvatar;
        return `
            <div class="avatar-option ${isSelected ? 'selected' : ''}" data-avatar="${avatar}">
                ${avatar}
            </div>
        `;
    }).join('');
    
    // Add click handlers
    document.querySelectorAll('.avatar-option').forEach(option => {
        option.addEventListener('click', () => {
            const avatar = option.dataset.avatar;
            selectAvatar(avatar);
        });
    });
}

function selectAvatar(avatar) {
    selectedAvatar = avatar;
    
    // Update sidebar avatar
    const sidebarAvatar = document.querySelector('.demo-avatar');
    if (sidebarAvatar) {
        sidebarAvatar.textContent = avatar;
    }
    
    // Update avatar grid
    document.querySelectorAll('.avatar-option').forEach(option => {
        option.classList.toggle('selected', option.dataset.avatar === avatar);
    });
    
    // Show success message (simple approach)
    showSettingsMessage('Avatar updated successfully!');
}

function initPasswordForm() {
    const passwordForm = document.getElementById('passwordForm');
    if (!passwordForm) return;
    
    passwordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // Validation
        if (newPassword.length < 8) {
            showSettingsMessage('Password must be at least 8 characters long', 'error');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            showSettingsMessage('Passwords do not match', 'error');
            return;
        }
        
        // Simulate password update
        showSettingsMessage('Password updated successfully!');
        passwordForm.reset();
    });
}

function showSettingsMessage(message, type = 'success') {
    // Create toast notification
    const toast = document.createElement('div');
    toast.className = `settings-toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Achievements Functions
function initAchievements() {
    renderAchievements();
    updateAchievementStats();
}

function renderAchievements() {
    // Group achievements by category
    const categories = {
        milestones: achievements.filter(a => a.category === 'milestones'),
        consistency: achievements.filter(a => a.category === 'consistency'),
        diversity: achievements.filter(a => a.category === 'diversity'),
        speed: achievements.filter(a => a.category === 'speed'),
        special: achievements.filter(a => a.category === 'special')
    };
    
    // Render each category
    renderAchievementCategory('milestonesGrid', categories.milestones);
    renderAchievementCategory('consistencyGrid', categories.consistency);
    renderAchievementCategory('diversityGrid', categories.diversity);
    renderAchievementCategory('speedGrid', categories.speed);
    renderAchievementCategory('specialGrid', categories.special);
}

function renderAchievementCategory(containerId, achievements) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = achievements.map(achievement => {
        const currentValue = achievement.current();
        const isEarned = currentValue >= achievement.requirement;
        const progress = Math.min((currentValue / achievement.max) * 100, 100);
        
        return `
            <div class="achievement-card ${isEarned ? 'earned' : 'locked'}">
                <div class="achievement-icon ${isEarned ? '' : 'grayscale'}">${achievement.icon}</div>
                <div class="achievement-info">
                    <h4 class="achievement-name">${achievement.name}</h4>
                    <p class="achievement-description">${achievement.description}</p>
                    <div class="achievement-progress">
                        <div class="achievement-progress-bar">
                            <div class="achievement-progress-fill" style="width: ${progress}%"></div>
                        </div>
                        <div class="achievement-progress-text">
                            ${isEarned ? '✓ Completed' : `${currentValue.toLocaleString()} / ${achievement.requirement.toLocaleString()}`}
                        </div>
                    </div>
                </div>
                ${isEarned ? '<div class="achievement-badge">✓</div>' : ''}
            </div>
        `;
    }).join('');
}

function updateAchievementStats() {
    const earnedCount = achievements.filter(a => a.current() >= a.requirement).length;
    const totalCount = achievements.length;
    const progressPercent = Math.round((earnedCount / totalCount) * 100);
    
    const earnedEl = document.getElementById('achievementsEarned');
    const totalEl = document.getElementById('achievementsTotal');
    const progressEl = document.getElementById('achievementsProgress');
    
    if (earnedEl) earnedEl.textContent = earnedCount;
    if (totalEl) totalEl.textContent = totalCount;
    if (progressEl) progressEl.textContent = `${progressPercent}%`;
}
