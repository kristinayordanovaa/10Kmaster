// Demo Skills Data
let skills = [];

let editingSkillId = null;
let deletingSkillId = null;
let activeTimer = null;
let timerInterval = null;
let timerSeconds = 0;
let hoursThisWeek = 0;

// Time History
let timeHistory = [];
let editingTimeEntryId = null;

// Settings data
let selectedAvatar = 'img/user avatars/Avatar1.png';
const availableAvatars = [
    'img/user avatars/Avatar1.png',
    'img/user avatars/Avatar2.png',
    'img/user avatars/Avatar3.png',
    'img/user avatars/Avatar4.png',
    'img/user avatars/Avatar5.png',
    'img/user avatars/Avatar6.png',
    'img/user avatars/Avatar7.png',
    'img/user avatars/Avatar8.png',
    'img/user avatars/Avatar9.png',
    'img/user avatars/Avatar10.png',
    'img/user avatars/Avatar11.png',
    'img/user avatars/Avatar12.png',
    'img/user avatars/Avatar13.png',
    'img/user avatars/Avatar14.png',
    'img/user avatars/Avatar15.png',
    'img/user avatars/Avatar16.png'
];

// Achievements data
let userStats = {
    totalHoursLogged: 0,
    currentStreak: 0,
    longestStreak: 0,
    skillsTracked: 0,
    daysWithPractice: 0,
    sessionsLogged: 0,
    earlyBirdSessions: 0,
    nightOwlSessions: 0,
    weekendSessions: 0,
    holidaySessions: 0,
    monthsActive: 0,
    maxDailyHours: 0,
    maxWeeklyHours: 0
};

// Function to recalculate userStats from actual data
function updateUserStats() {
    // Total hours logged from skills
    userStats.totalHoursLogged = skills.reduce((sum, skill) => sum + skill.hours, 0);
    
    // Skills tracked
    userStats.skillsTracked = skills.length;
    
    // Sessions logged
    userStats.sessionsLogged = timeHistory.length;
    
    // Calculate streak and other time-based stats if we have time history
    if (timeHistory.length > 0) {
        // Sort timeHistory by date
        const sortedHistory = [...timeHistory].sort((a, b) => b.date - a.date);
        
        // Calculate current streak
        let currentStreak = 0;
        let checkDate = new Date();
        checkDate.setHours(0, 0, 0, 0);
        
        for (let i = 0; i < 365; i++) {
            const hasEntry = sortedHistory.some(entry => {
                const entryDate = new Date(entry.date);
                entryDate.setHours(0, 0, 0, 0);
                return entryDate.getTime() === checkDate.getTime();
            });
            
            if (hasEntry) {
                currentStreak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                break;
            }
        }
        userStats.currentStreak = currentStreak;
        userStats.longestStreak = Math.max(userStats.longestStreak, currentStreak);
        
        // Calculate days with practice
        const uniqueDays = new Set();
        timeHistory.forEach(entry => {
            const dateStr = new Date(entry.date).toDateString();
            uniqueDays.add(dateStr);
        });
        userStats.daysWithPractice = uniqueDays.size;
        
        // Calculate early bird and night owl sessions
        userStats.earlyBirdSessions = timeHistory.filter(entry => {
            const hour = new Date(entry.date).getHours();
            return hour < 7;
        }).length;
        
        userStats.nightOwlSessions = timeHistory.filter(entry => {
            const hour = new Date(entry.date).getHours();
            return hour >= 22;
        }).length;
        
        // Calculate weekend sessions
        userStats.weekendSessions = timeHistory.filter(entry => {
            const day = new Date(entry.date).getDay();
            return day === 0 || day === 6;
        }).length;
        
        // Calculate months active
        const uniqueMonths = new Set();
        timeHistory.forEach(entry => {
            const date = new Date(entry.date);
            uniqueMonths.add(`${date.getFullYear()}-${date.getMonth()}`);
        });
        userStats.monthsActive = uniqueMonths.size;
        
        // Calculate max daily hours
        const dailyHours = new Map();
        timeHistory.forEach(entry => {
            const dateStr = new Date(entry.date).toDateString();
            dailyHours.set(dateStr, (dailyHours.get(dateStr) || 0) + entry.hours);
        });
        userStats.maxDailyHours = dailyHours.size > 0 ? Math.max(...dailyHours.values()) : 0;
        
        // Calculate max weekly hours
        const weeklyHours = new Map();
        timeHistory.forEach(entry => {
            const date = new Date(entry.date);
            const weekStart = new Date(date);
            weekStart.setDate(date.getDate() - date.getDay());
            const weekKey = weekStart.toDateString();
            weeklyHours.set(weekKey, (weeklyHours.get(weekKey) || 0) + entry.hours);
        });
        userStats.maxWeeklyHours = weeklyHours.size > 0 ? Math.max(...weeklyHours.values()) : 0;
    }
}

const achievements = [
    // Milestones
    { id: 'first-steps', category: 'milestones', name: 'First Steps', description: 'Log your first hour', icon: '👣', requirement: 1, current: () => userStats.totalHoursLogged, max: 1 },
    { id: 'century-club', category: 'milestones', name: 'Century Club', description: 'Reach 100 hours in any skill', icon: '💯', requirement: 100, current: () => skills.length ? Math.max(...skills.map(s => s.hours)) : 0, max: 100 },
    { id: 'halfway-there', category: 'milestones', name: 'Halfway There', description: 'Reach 5,000 hours in any skill', icon: '🎯', requirement: 5000, current: () => skills.length ? Math.max(...skills.map(s => s.hours)) : 0, max: 5000 },
    { id: 'master', category: 'milestones', name: 'Master', description: 'Complete 10,000 hours in a skill', icon: '👑', requirement: 10000, current: () => skills.length ? Math.max(...skills.map(s => s.hours)) : 0, max: 10000 },
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
    { id: 'focused', category: 'speed', name: 'Focused', description: 'Log 3+ hours in a single session', icon: '🎯', requirement: 1, current: () => timeHistory.filter(e => e.duration >= 3).length > 0 ? 1 : 0, max: 1 },
    
    // Special
    { id: 'weekend-warrior', category: 'special', name: 'Weekend Warrior', description: 'Practice on 10 weekends', icon: '🎉', requirement: 10, current: () => userStats.weekendSessions, max: 10 },
    { id: 'holiday-dedication', category: 'special', name: 'Holiday Dedication', description: 'Practice on 5 holidays', icon: '🎊', requirement: 5, current: () => userStats.holidaySessions, max: 5 },
    { id: 'year-complete', category: 'special', name: 'Year Complete', description: 'Practice in all 12 months', icon: '📆', requirement: 12, current: () => userStats.monthsActive, max: 12 },
    { id: 'perfect-week', category: 'special', name: 'Perfect Week', description: 'Practice every single day for 7 days', icon: '✨', requirement: 7, current: () => userStats.currentStreak >= 7 ? 7 : userStats.currentStreak, max: 7 },
    { id: 'the-grind', category: 'special', name: 'The Grind', description: 'Add time manually 100 times', icon: '⏰', requirement: 100, current: () => userStats.sessionsLogged, max: 100 }
];

// Time History Functions (defined early to avoid reference errors)
function renderTimeHistory(days) {
    const container = document.getElementById('timeHistoryList');
    console.log('renderTimeHistory called, container:', container, 'days:', days, 'history length:', timeHistory.length);
    
    if (!container) {
        console.error('Time history container not found!');
        return;
    }
    
    // Filter entries based on timeframe
    let filteredHistory = timeHistory;
    if (days !== 'all') {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        filteredHistory = timeHistory.filter(entry => entry.date >= cutoffDate);
    }
    
    console.log('Filtered history length:', filteredHistory.length);
    console.log('First few entries:', filteredHistory.slice(0, 3));
    
    if (filteredHistory.length === 0) {
        container.innerHTML = '<div class="time-history-empty">No time entries found for this period.</div>';
        return;
    }
    
    console.log('Rendering', filteredHistory.length, 'entries');
    
    const htmlContent = filteredHistory.map(entry => {
        const dateStr = entry.date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
        
        return `
            <div class="time-history-row">
                <div class="time-history-col-date">${dateStr}</div>
                <div class="time-history-col-skill">
                    <span class="time-history-skill-name">${entry.skillName}</span>
                </div>
                <div class="time-history-col-time">${entry.hours}h</div>
                <div class="time-history-col-actions">
                    <button class="btn-icon btn-icon-edit" onclick="openEditTimeModal(${entry.id})" title="Edit">
                        ✏️
                    </button>
                    <button class="btn-icon btn-icon-delete" onclick="deleteTimeEntry(${entry.id})" title="Delete">
                        🗑️
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    console.log('Generated HTML length:', htmlContent.length);
    console.log('First 500 chars:', htmlContent.substring(0, 500));
    container.innerHTML = htmlContent;
    console.log('HTML set to container, children count:', container.children.length);
}

function generateSampleTimeHistory() {
    // Generate sample time history entries with hardcoded data for consistency
    const today = new Date();
    timeHistory = [];
    
    // Hardcoded sample entries to ensure data is always visible
    const sampleEntries = [
        { days: 0, skillName: 'Piano', hours: 2.5 },
        { days: 0, skillName: 'Web Development', hours: 1.5 },
        { days: 1, skillName: 'Spanish', hours: 1.0 },
        { days: 1, skillName: 'Piano', hours: 3.0 },
        { days: 2, skillName: 'Rock Climbing', hours: 2.0 },
        { days: 2, skillName: 'Photography', hours: 1.5 },
        { days: 3, skillName: 'Web Development', hours: 2.5 },
        { days: 3, skillName: 'Digital Painting', hours: 1.0 },
        { days: 4, skillName: 'Piano', hours: 2.0 },
        { days: 4, skillName: 'Spanish', hours: 1.5 },
        { days: 5, skillName: 'Photography', hours: 3.0 },
        { days: 6, skillName: 'Web Development', hours: 2.0 },
        { days: 7, skillName: 'Rock Climbing', hours: 1.5 },
        { days: 8, skillName: 'Piano', hours: 2.5 },
        { days: 9, skillName: 'Spanish', hours: 1.0 },
        { days: 10, skillName: 'Digital Painting', hours: 2.0 },
        { days: 11, skillName: 'Photography', hours: 1.5 },
        { days: 12, skillName: 'Web Development', hours: 3.0 },
        { days: 13, skillName: 'Piano', hours: 2.0 },
        { days: 14, skillName: 'Rock Climbing', hours: 1.5 }
    ];
    
    sampleEntries.forEach((entry, index) => {
        const date = new Date(today);
        date.setDate(date.getDate() - entry.days);
        date.setHours(9 + index % 12);
        date.setMinutes(0);
        
        const skill = skills.find(s => s.name === entry.skillName);
        if (skill) {
            timeHistory.push({
                id: 1000000 + index,
                skillId: skill.id,
                skillName: entry.skillName,
                hours: entry.hours,
                date: new Date(date),
                timestamp: date.getTime()
            });
        }
    });
    
    // Add more random entries for older dates
    for (let i = 15; i < 30; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        const entriesCount = Math.floor(Math.random() * 3) + 1;
        for (let j = 0; j < entriesCount; j++) {
            const skill = skills[Math.floor(Math.random() * skills.length)];
            const hours = parseFloat((Math.random() * 2.5 + 0.5).toFixed(2));
            
            const entryDate = new Date(date);
            entryDate.setHours(Math.floor(Math.random() * 14) + 8);
            entryDate.setMinutes(Math.floor(Math.random() * 60));
            
            timeHistory.push({
                id: 2000000 + i * 10 + j,
                skillId: skill.id,
                skillName: skill.name,
                hours: hours,
                date: new Date(date),
                timestamp: entryDate.getTime()
            });
        }
    }
    
    // Sort by date descending (newest first)
    timeHistory.sort((a, b) => b.timestamp - a.timestamp);
    
    console.log('Time history generated:', timeHistory.length, 'entries');
}

// Initialize demo
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing...');
    updateUserStats(); // Calculate stats from actual data first
    renderSkills();
    updateStats();
    initModal();
    initDeleteModal();
    initNavigation();
    initHeatmapTimeframe();
    generateHeatmap(12);
    initSettings();
    initAchievements();
    // Note: generateSampleTimeHistory() removed - users start with empty data
    initTimeHistory(); // Initialize UI with empty or loaded data
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
                    <div class="timer-time" id="timer-${skill.id}">00:00:00</div>
                </div>
            ` : ''}
            
            <div class="skill-hours">
                <div class="skill-hours-main">${Math.round(skill.hours).toLocaleString()}</div>
                <div class="skill-hours-sub">of 10,000 hours</div>
            </div>
            
            <div class="skill-progress-bar">
                <div class="skill-progress-fill" style="width: ${progressCapped}%; background: ${skill.color};"></div>
            </div>
            
            <div class="skill-progress-text">${progressCapped.toFixed(1)}% Complete</div>
            
            <div class="skill-buttons">
                <button class="btn ${isTimerActive ? 'btn-danger' : 'btn-primary'} btn-sm skill-timer-btn" data-id="${skill.id}">
                    <span>${isTimerActive ? '⏹' : '▶'}</span> ${isTimerActive ? 'Stop Timer' : 'Start Timer'}
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
    const weekHoursEl = document.getElementById('hoursThisWeek');
    const dayStreakEl = document.getElementById('dayStreak');
    
    if (totalHoursEl) totalHoursEl.textContent = totalHours.toLocaleString();
    if (skillCountEl) skillCountEl.textContent = skills.length;
    if (weekHoursEl) weekHoursEl.textContent = hoursThisWeek.toFixed(1);
    // Day streak calculation would require time history analysis
    // For now, defaulting to 0 unless calculated elsewhere
    if (dayStreakEl && dayStreakEl.textContent === '0') {
        dayStreakEl.textContent = '0';
    }
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
async function handleFormSubmit(e) {
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
            
            // Save to database if authenticated
            if (typeof saveSkillToDB === 'function') {
                await saveSkillToDB(skill);
            }
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
        
        // Save to database if authenticated
        if (typeof saveSkillToDB === 'function') {
            const dbSkill = await saveSkillToDB(newSkill);
            if (dbSkill) {
                newSkill.id = dbSkill.id; // Use the database ID
            }
        }
        
        skills.push(newSkill);
    }
    
    renderSkills();
    updateStats();
    updateUserStats(); // Recalculate stats
    if (typeof updateAchievementStats === 'function') updateAchievementStats(); // Update achievements
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
async function confirmDelete() {
    if (deletingSkillId) {
        // Delete from database if authenticated
        if (typeof deleteSkillFromDB === 'function') {
            await deleteSkillFromDB(deletingSkillId);
        }
        
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
async function addTime(id, minutes) {
    console.log('addTime called:', id, minutes);
    const skill = skills.find(s => s.id === id);
    console.log('Found skill:', skill);
    if (skill && skill.hours < 10000) {
        const hoursToAdd = minutes / 60;
        skill.hours = Math.min(skill.hours + hoursToAdd, 10000);
        hoursThisWeek += hoursToAdd;
        console.log('Added', hoursToAdd, 'hours. New total:', skill.hours);
        
        // Save updated hours to database
        if (typeof saveSkillToDB === 'function') {
            await saveSkillToDB(skill);
        }
        
        // Add entry to time history
        const newEntry = {
            id: Date.now() + Math.random(),
            skillId: skill.id,
            skillName: skill.name,
            duration: parseFloat(hoursToAdd.toFixed(2)),
            date: new Date(),
            timestamp: Date.now()
        };
        timeHistory.unshift(newEntry); // Add to beginning
        
        // Save time entry to database
        if (typeof saveTimeEntryToDB === 'function') {
            await saveTimeEntryToDB(newEntry);
        }
        
        // Re-render time history if on that section
        const currentTimeframe = document.getElementById('historyTimeframe');
        if (currentTimeframe) {
            const days = currentTimeframe.value === 'all' ? 'all' : parseInt(currentTimeframe.value);
            renderTimeHistory(days);
        }
        
        renderSkills();
        updateStats();
        updateUserStats(); // Recalculate stats from actual data
        if (typeof updateAchievementStats === 'function') updateAchievementStats(); // Update achievements
        
        // Show visual feedback
        const card = document.querySelector(`[data-id="${id}"]`);
        if (card) {
            const skillCard = card.closest('.demo-skill-card');
            if (skillCard) {
                skillCard.style.transform = 'scale(1.02)';
                setTimeout(() => {
                    skillCard.style.transform = 'scale(1)';
                }, 200);
            }
        }
        
        console.log('Time added successfully');
    }
}

// Toggle timer
function toggleTimer(id) {
    if (activeTimer === id) {
        stopTimer();
    } else {
        // Check if another timer is already running
        if (activeTimer && activeTimer !== id) {
            const activeSkill = skills.find(s => s.id === activeTimer);
            showNotification(`Timer is already running for ${activeSkill.name}. Stop it first!`, 'warning');
            return;
        }
        startTimer(id);
    }
}

// Start timer
function startTimer(id) {
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
        
        // Add entry to time history
        const newEntry = {
            id: Date.now() + Math.random(),
            skillId: skill.id,
            skillName: skill.name,
            hours: hoursToAdd,
            date: new Date(),
            timestamp: Date.now()
        };
        timeHistory.unshift(newEntry); // Add to beginning
        
        // Re-render time history if on that section
        const currentTimeframe = document.getElementById('historyTimeframe');
        if (currentTimeframe) {
            const days = currentTimeframe.value === 'all' ? 'all' : parseInt(currentTimeframe.value);
            renderTimeHistory(days);
        }
        
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
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `timer-notification ${type === 'warning' ? 'notification-warning' : ''}`;
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
            
            // If navigating to time history, re-render to ensure data is visible
            if (section === 'time-history') {
                const timeframe = document.getElementById('historyTimeframe');
                const days = timeframe ? (timeframe.value === 'all' ? 'all' : parseInt(timeframe.value)) : 7;
                renderTimeHistory(days);
            }
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
    
    // Generate dates for the timeframe
    const dates = [];
    for (let i = numDays - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        dates.push(date);
    }
    
    // Use actual timeHistory data instead of random data
    const heatmapData = dates.map(date => {
        // Find all time entries for this date
        const dateStr = date.toDateString();
        const entriesForDate = timeHistory.filter(entry => 
            entry.date.toDateString() === dateStr
        );
        
        if (entriesForDate.length === 0) {
            return { date, hours: 0, level: 0 };
        }
        
        // Sum hours for this date
        const hours = entriesForDate.reduce((sum, entry) => sum + entry.hours, 0);
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
    
    // Calculate cutoff date for the timeframe
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - (numWeeks * 7));
    
    // Calculate actual hours from timeHistory for each skill
    const skillHours = skills.map(skill => {
        // Filter time entries for this skill within the timeframe
        const entries = timeHistory.filter(entry => 
            entry.skillName === skill.name && entry.date >= cutoffDate
        );
        
        // Sum hours for this skill
        const hours = entries.reduce((sum, entry) => sum + entry.hours, 0);
        
        return {
            name: skill.name,
            hours: parseFloat(hours.toFixed(1)),
            color: skill.color
        };
    });
    
    // Filter out skills with 0 hours
    const activeSkills = skillHours.filter(s => s.hours > 0);
    
    // Sort by hours descending
    activeSkills.sort((a, b) => b.hours - a.hours);
    
    // Check if there's any data
    if (activeSkills.length === 0) {
        container.innerHTML = '<div class="skills-breakdown-empty">No practice data for this period.</div>';
        return;
    }
    
    // Find max hours for scaling
    const maxHours = Math.max(...activeSkills.map(s => s.hours));
    
    // Render skill bars
    container.innerHTML = activeSkills.map(skill => {
        const percentage = maxHours > 0 ? (skill.hours / maxHours) * 100 : 0;
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
                <img src="${avatar}" alt="Avatar" class="avatar-option-img">
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
        sidebarAvatar.innerHTML = `<img src="${avatar}" alt="Avatar" class="demo-avatar-img">`;
    }
    
    // Update avatar grid selection (only for preset avatars)
    document.querySelectorAll('.avatar-option').forEach(option => {
        option.classList.toggle('selected', option.dataset.avatar === avatar);
    });
    
    // Save to database if authenticated
    if (typeof updateProfileInDB === 'function') {
        updateProfileInDB({ avatar_url: avatar });
    }
    
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

// Time History Helper Functions
function initTimeHistory() {
    console.log('Initializing time history...');
    initHistoryTimeframe();
    initEditTimeModal();
    initDeleteTimeEntryModal();
    
    // Expose functions to window for onclick handlers
    window.openEditTimeModal = openEditTimeModal;
    window.deleteTimeEntry = deleteTimeEntry;
    
    // Initial render if on time history page
    const timeHistorySection = document.getElementById('time-history-section');
    if (timeHistorySection && timeHistorySection.classList.contains('active')) {
        renderTimeHistory(7);
    }
}

function initDeleteTimeEntryModal() {
    const modal = document.getElementById('deleteTimeEntryModal');
    const closeBtn = document.getElementById('closeDeleteTimeEntryModal');
    const cancelBtn = document.getElementById('cancelDeleteTimeEntryBtn');
    const confirmBtn = document.getElementById('confirmDeleteTimeEntryBtn');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeDeleteTimeEntryModal);
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeDeleteTimeEntryModal);
    }
    
    if (confirmBtn) {
        confirmBtn.addEventListener('click', confirmDeleteTimeEntry);
    }
    
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeDeleteTimeEntryModal();
        });
    }
}

function initHistoryTimeframe() {
    const selector = document.getElementById('historyTimeframe');
    if (selector) {
        selector.addEventListener('change', (e) => {
            const days = e.target.value === 'all' ? 'all' : parseInt(e.target.value);
            renderTimeHistory(days);
        });
    }
}

function initEditTimeModal() {
    const modal = document.getElementById('editTimeModal');
    const closeBtn = document.getElementById('closeEditTimeModal');
    const cancelBtn = document.getElementById('cancelEditTimeBtn');
    const form = document.getElementById('editTimeForm');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeEditTimeModal);
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeEditTimeModal);
    }
    
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeEditTimeModal();
        });
    }
    
    if (form) {
        form.addEventListener('submit', handleEditTimeSubmit);
    }
}

function openEditTimeModal(entryId) {
    const entry = timeHistory.find(e => e.id === entryId);
    if (!entry) return;
    
    editingTimeEntryId = entryId;
    
    document.getElementById('editTimeSkill').value = entry.skillName;
    document.getElementById('editTimeHours').value = entry.hours;
    
    // Format date for input (YYYY-MM-DD)
    const dateStr = entry.date.toISOString().split('T')[0];
    document.getElementById('editTimeDate').value = dateStr;
    
    document.getElementById('editTimeModal').classList.add('active');
}

function closeEditTimeModal() {
    document.getElementById('editTimeModal').classList.remove('active');
    editingTimeEntryId = null;
}

function handleEditTimeSubmit(e) {
    e.preventDefault();
    
    const hours = parseFloat(document.getElementById('editTimeHours').value);
    const dateStr = document.getElementById('editTimeDate').value;
    
    if (!hours || hours <= 0) {
        showSettingsMessage('Please enter a valid number of hours', 'error');
        return;
    }
    
    const entry = timeHistory.find(e => e.id === editingTimeEntryId);
    if (entry) {
        // Calculate the difference to update skill hours
        const hoursDiff = hours - entry.hours;
        const skill = skills.find(s => s.id === entry.skillId);
        
        if (skill) {
            skill.hours = Math.max(0, Math.min(skill.hours + hoursDiff, 10000));
            renderSkills();
            updateStats();
        }
        
        // Update entry
        entry.hours = hours;
        entry.date = new Date(dateStr);
        entry.timestamp = entry.date.getTime();
        
        // Re-sort
        timeHistory.sort((a, b) => b.timestamp - a.timestamp);
        
        // Re-render
        const currentTimeframe = document.getElementById('historyTimeframe').value;
        const days = currentTimeframe === 'all' ? 'all' : parseInt(currentTimeframe);
        renderTimeHistory(days);
        
        showSettingsMessage('Time entry updated successfully!');
    }
    
    closeEditTimeModal();
}

let deletingTimeEntryId = null;

function deleteTimeEntry(entryId) {
    const entry = timeHistory.find(e => e.id === entryId);
    if (!entry) return;
    
    // Show custom confirmation modal
    deletingTimeEntryId = entryId;
    const dateStr = entry.date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
    });
    
    document.getElementById('deleteTimeEntryDetails').innerHTML = `
        <div class="delete-time-entry-info">
            <div><strong>Skill:</strong> ${entry.skillName}</div>
            <div><strong>Time:</strong> ${entry.hours}h</div>
            <div><strong>Date:</strong> ${dateStr}</div>
        </div>
    `;
    
    document.getElementById('deleteTimeEntryModal').classList.add('active');
}

function confirmDeleteTimeEntry() {
    if (!deletingTimeEntryId) return;
    
    const entry = timeHistory.find(e => e.id === deletingTimeEntryId);
    if (!entry) return;
    
    // Update skill hours
    const skill = skills.find(s => s.id === entry.skillId);
    if (skill) {
        skill.hours = Math.max(0, skill.hours - entry.hours);
        renderSkills();
        updateStats();
    }
    
    // Remove entry
    timeHistory = timeHistory.filter(e => e.id !== deletingTimeEntryId);
    
    // Re-render
    const currentTimeframe = document.getElementById('historyTimeframe').value;
    const days = currentTimeframe === 'all' ? 'all' : parseInt(currentTimeframe);
    renderTimeHistory(days);
    
    showSettingsMessage('Time entry deleted successfully!');
    
    closeDeleteTimeEntryModal();
}

function closeDeleteTimeEntryModal() {
    document.getElementById('deleteTimeEntryModal').classList.remove('active');
    deletingTimeEntryId = null;
}