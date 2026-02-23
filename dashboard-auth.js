// Dashboard authentication and database integration (requires login)
let currentUser = null;
let currentProfile = null;

document.addEventListener('DOMContentLoaded', async () => {
    await initializeDashboard();
});

// Initialize dashboard (authentication required)
async function initializeDashboard() {
    // Check authentication - redirect to login if not authenticated
    const user = await checkAuth(true);
    if (!user) return; // checkAuth will handle redirect
    
    currentUser = user;
    
    // Get user profile
    currentProfile = await getUserProfile(user.id);
    if (!currentProfile) {
        console.error('Failed to load user profile');
        return;
    }
    
    // Update UI with user info
    updateUserUI();
    
    // Update nav button
    const navButton = document.getElementById('nav-auth-button');
    if (navButton) {
        navButton.textContent = 'Logout';
    }
    
    // Load user's skills from database
    await loadUserSkills();
    
    // Load user's time history
    await loadTimeHistory();
}

// Handle nav auth button click
async function handleNavAuth() {
    await handleLogout();
}

// Update UI with user information
function updateUserUI() {
    if (!currentProfile) return;
    
    // Update username
    const usernameElements = document.querySelectorAll('.demo-username');
    usernameElements.forEach(el => {
        el.textContent = currentProfile.username || 'User';
    });
    
    // Update plan
    const planElements = document.querySelectorAll('.demo-user-meta');
    planElements.forEach(el => {
        el.textContent = currentProfile.plan || 'Free Plan';
    });
    
    // Update avatar
    const avatarElements = document.querySelectorAll('.demo-avatar-img');
    avatarElements.forEach(el => {
        el.src = currentProfile.avatar_url || 'img/user avatars/Avatar1.png';
    });
    
    // Update welcome message
    const welcomeEl = document.getElementById('demo-welcome');
    if (welcomeEl) {
        welcomeEl.textContent = `Welcome back, ${currentProfile.username || 'User'}! Track your progress towards 10,000 hours of mastery!`;
    }
}

// Load user skills from database
async function loadUserSkills() {
    if (!currentUser) return;
    
    try {
        const { data, error } = await window.supabaseClient
            .from('skills')
            .select('*')
            .eq('user_id', currentUser.id)
            .order('created_at', { ascending: true });
        
        if (error) throw error;
        
        if (data && data.length > 0) {
            // Update the skills array in demo.js
            skills = data.map(skill => ({
                id: skill.id,
                name: skill.name,
                category: skill.category,
                hours: parseFloat(skill.hours),
                color: skill.color
            }));
        } else {
            // No skills yet - start with empty array
            skills = [];
        }
        
        // Refresh the UI
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
        
    } catch (error) {
        console.error('Error loading skills:', error);
    }
}

// Save skill to database
async function saveSkillToDB(skill) {
    if (!currentUser) return null;
    
    try {
        if (skill.id && typeof skill.id === 'number' && skill.id > 0) {
            // Update existing skill
            const { data, error } = await window.supabaseClient
                .from('skills')
                .update({
                    name: skill.name,
                    category: skill.category,
                    hours: skill.hours,
                    color: skill.color,
                    updated_at: new Date().toISOString()
                })
                .eq('id', skill.id)
                .eq('user_id', currentUser.id)
                .select()
                .single();
            
            if (error) throw error;
            return data;
        } else {
            // Insert new skill
            const { data, error } = await window.supabaseClient
                .from('skills')
                .insert([{
                    user_id: currentUser.id,
                    name: skill.name,
                    category: skill.category,
                    hours: skill.hours || 0,
                    color: skill.color
                }])
                .select()
                .single();
            
            if (error) throw error;
            return data;
        }
    } catch (error) {
        console.error('Error saving skill:', error);
        return null;
    }
}

// Delete skill from database
async function deleteSkillFromDB(skillId) {
    if (!currentUser) return false;
    
    try {
        const { error } = await window.supabaseClient
            .from('skills')
            .delete()
            .eq('id', skillId)
            .eq('user_id', currentUser.id);
        
        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error deleting skill:', error);
        return false;
    }
}

// Load time history from database
async function loadTimeHistory() {
    if (!currentUser) return;
    
    try {
        const { data, error } = await window.supabaseClient
            .from('time_entries')
            .select('*')
            .eq('user_id', currentUser.id)
            .order('date', { ascending: false });
        
        if (error) throw error;
        
        if (data) {
            timeHistory = data.map(entry => ({
                id: entry.id,
                skillName: entry.skill_name,
                duration: parseFloat(entry.duration),
                date: new Date(entry.date),
                hours: parseFloat(entry.duration)
            }));
        }
        
        // Update UI if on time history section
        if (typeof renderTimeHistory === 'function') {
            renderTimeHistory();
        }
        if (typeof updateUserStats === 'function') {
            updateUserStats();
        }
        if (typeof updateAchievementStats === 'function') {
            updateAchievementStats();
        }
        
    } catch (error) {
        console.error('Error loading time history:', error);
    }
}

// Save time entry to database
async function saveTimeEntryToDB(entry) {
    if (!currentUser) return null;
    
    try {
        const { data, error } = await window.supabaseClient
            .from('time_entries')
            .insert([{
                user_id: currentUser.id,
                skill_id: entry.skillId || null,
                skill_name: entry.skillName,
                duration: entry.duration,
                date: entry.date || new Date().toISOString(),
                notes: entry.notes || ''
            }])
            .select()
            .single();
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error saving time entry:', error);
        return null;
    }
}

// Update profile in database
async function updateProfileInDB(updates) {
    if (!currentUser) return false;
    
    try {
        const { data, error } = await window.supabaseClient
            .from('profiles')
            .update({
                ...updates,
                updated_at: new Date().toISOString()
            })
            .eq('id', currentUser.id)
            .select()
            .single();
        
        if (error) throw error;
        
        currentProfile = data;
        return true;
    } catch (error) {
        console.error('Error updating profile:', error);
        return false;
    }
}
