// Sample data for public demo (no authentication)
// This file is only used for demo.html to show interactive preview

// Override the empty arrays from demo.js with sample data
document.addEventListener('DOMContentLoaded', () => {
    // Sample skills data
    skills = [
        { id: 1, name: 'Guitar', category: 'Music', hours: 450, color: '#8B5CF6' },
        { id: 2, name: 'JavaScript', category: 'Programming', hours: 320, color: '#3B82F6' },
        { id: 3, name: 'Spanish', category: 'Language', hours: 180, color: '#F59E0B' },
        { id: 4, name: 'Digital Drawing', category: 'Art', hours: 210, color: '#EC4899' },
        { id: 5, name: 'Photography', category: 'Creative', hours: 140, color: '#10B981' },
        { id: 6, name: 'Chess', category: 'Games', hours: 95, color: '#6366F1' }
    ];
    
    // Calculate total hours from sample skills
    const totalHours = skills.reduce((sum, skill) => sum + skill.hours, 0);
    
    // Sample user stats based on the sample data
    userStats = {
        totalHours: totalHours,
        currentStreak: 12,
        longestStreak: 47,
        skillsMastered: 0,
        hoursThisWeek: 18.5,
        averageDaily: 2.6
    };
    
    // Generate sample time history for the last 90 days
    timeHistory = [];
    const now = new Date();
    const skillNames = skills.map(s => s.name);
    
    for (let i = 0; i < 90; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        
        // Add 1-3 random entries per day
        const entriesPerDay = Math.floor(Math.random() * 3) + 1;
        for (let j = 0; j < entriesPerDay; j++) {
            const randomSkill = skillNames[Math.floor(Math.random() * skillNames.length)];
            const duration = Math.random() * 3 + 0.5; // 0.5 to 3.5 hours
            
            timeHistory.push({
                id: timeHistory.length + 1,
                skillName: randomSkill,
                duration: duration,
                date: new Date(date),
                hours: duration
            });
        }
    }
    
    // Update the UI
    if (typeof renderSkills === 'function') {
        renderSkills();
    }
    if (typeof updateStats === 'function') {
        updateStats();
    }
    if (typeof updateUserStats === 'function') {
        updateUserStats();
    }
    if (typeof updateAchievementStats === 'function') {
        updateAchievementStats();
    }
    if (typeof renderTimeHistory === 'function') {
        renderTimeHistory();
    }
    
    // Update welcome message for demo
    const welcomeEl = document.getElementById('demo-welcome');
    if (welcomeEl) {
        welcomeEl.textContent = 'Welcome to 10K Master! This is a demo with sample data. Sign up to start tracking your own journey to 10,000 hours!';
    }
});
