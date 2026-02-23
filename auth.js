// Authentication handling
// Note: supabase client is initialized in supabase-config.js as window.supabaseClient
document.addEventListener('DOMContentLoaded', async () => {
    // Wait a tick to ensure supabase-config.js has initialized
    await new Promise(resolve => setTimeout(resolve, 100));
    
    if (!window.supabaseClient) {
        console.error('Supabase client not initialized');
        return;
    }
    
    // Check if we're on login page
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Check if we're on register page
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
});

// Handle login
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const button = document.getElementById('login-button');
    const errorDiv = document.getElementById('error-message');
    
    button.disabled = true;
    button.textContent = 'Signing in...';
    errorDiv.style.display = 'none';
    
    try {
        const { data, error } = await window.supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });
        
        if (error) throw error;
        
        // Check if user is admin
        const { data: profile, error: profileError } = await window.supabaseClient
            .from('profiles')
            .select('is_admin')
            .eq('id', data.user.id)
            .single();
        
        if (profileError) throw profileError;
        
        // Redirect based on role
        if (profile.is_admin) {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'dashboard.html';
        }
    } catch (error) {
        errorDiv.textContent = error.message;
        errorDiv.style.display = 'block';
        button.disabled = false;
        button.textContent = 'Sign In';
    }
}

// Handle registration
async function handleRegister(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const button = document.getElementById('register-button');
    const errorDiv = document.getElementById('error-message');
    const successDiv = document.getElementById('success-message');
    
    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';
    
    button.disabled = true;
    button.textContent = 'Creating account...';
    
    try {
        // Extract username from email (before @ symbol)
        const username = email.split('@')[0];
        
        const { data, error } = await window.supabaseClient.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    username: username
                }
            }
        });
        
        if (error) throw error;
        
        successDiv.textContent = 'Account created successfully! Redirecting...';
        successDiv.style.display = 'block';
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 2000);
        
    } catch (error) {
        errorDiv.textContent = error.message;
        errorDiv.style.display = 'block';
        button.disabled = false;
        button.textContent = 'Create Account';
    }
}

// Handle logout
async function handleLogout() {
    try {
        const { error } = await window.supabaseClient.auth.signOut();
        if (error) throw error;
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Error logging out:', error);
        alert('Error logging out. Please try again.');
    }
}

// Check authentication status
async function checkAuth(requireAuth = true) {
    const { data: { user } } = await window.supabaseClient.auth.getUser();
    
    if (requireAuth && !user) {
        window.location.href = 'login.html';
        return null;
    }
    
    return user;
}

// Check if user is admin
async function checkAdmin() {
    const user = await checkAuth(true);
    if (!user) return false;
    
    const { data: profile, error } = await window.supabaseClient
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();
    
    if (error || !profile || !profile.is_admin) {
        window.location.href = 'dashboard.html';
        return false;
    }
    
    return true;
}

// Get user profile
async function getUserProfile(userId) {
    const { data, error } = await window.supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
    
    if (error) {
        console.error('Error fetching profile:', error);
        return null;
    }
    
    return data;
}
