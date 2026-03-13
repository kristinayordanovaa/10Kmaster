// Authentication handling
// Note: supabase client is initialized in supabase-config.js as window.supabaseClient
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on login page
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        showLoginConfirmationMessage();
        loginForm.addEventListener('submit', handleLogin);
        
        // Handle forgot password modal
        const forgotPasswordLink = document.getElementById('forgot-password-link');
        const forgotPasswordModal = document.getElementById('forgot-password-modal');
        const closeModal = document.getElementById('close-modal');
        const resetPasswordForm = document.getElementById('reset-password-form');
        
        if (forgotPasswordLink && forgotPasswordModal) {
            forgotPasswordLink.addEventListener('click', (e) => {
                e.preventDefault();
                forgotPasswordModal.style.display = 'block';
            });
            
            closeModal.addEventListener('click', () => {
                forgotPasswordModal.style.display = 'none';
                document.getElementById('reset-error-message').style.display = 'none';
                document.getElementById('reset-success-message').style.display = 'none';
                resetPasswordForm.reset();
            });
            
            window.addEventListener('click', (e) => {
                if (e.target === forgotPasswordModal) {
                    forgotPasswordModal.style.display = 'none';
                    document.getElementById('reset-error-message').style.display = 'none';
                    document.getElementById('reset-success-message').style.display = 'none';
                    resetPasswordForm.reset();
                }
            });
            
            resetPasswordForm.addEventListener('submit', handlePasswordReset);
        }
    }

    // Check if we're on register page
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
});

function showLoginConfirmationMessage() {
    const successDiv = document.getElementById('success-message');
    if (!successDiv) return;

    const hashParams = new URLSearchParams(window.location.hash.replace('#', ''));
    const queryParams = new URLSearchParams(window.location.search);
    const isSignupConfirmation = hashParams.get('type') === 'signup' || queryParams.get('confirmed') === '1';

    if (!isSignupConfirmation) return;

    successDiv.innerHTML = `
        <div>Your account has been confirmed successfully.</div>
        <div style="margin-top: 8px;">You can now sign in.</div>
    `;
    successDiv.style.display = 'block';
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.focus();
        emailInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Wait for Supabase client to be initialized by supabase-config.js.
async function getSupabaseClient() {
    if (window.supabaseClient) return window.supabaseClient;

    await new Promise((resolve, reject) => {
        const timeoutMs = 10000;

        const onReady = () => {
            cleanup();
            resolve();
        };

        const onTimeout = setTimeout(() => {
            cleanup();
            reject(new Error('Authentication service is still loading. Please try again.'));
        }, timeoutMs);

        const cleanup = () => {
            clearTimeout(onTimeout);
            window.removeEventListener('supabaseReady', onReady);
        };

        window.addEventListener('supabaseReady', onReady);
    });

    if (!window.supabaseClient) {
        throw new Error('Authentication service is not available. Please refresh the page.');
    }

    return window.supabaseClient;
}

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
        const supabaseClient = await getSupabaseClient();

        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });
        
        if (error) throw error;
        
        // Check if user is admin
        const { data: profile, error: profileError } = await supabaseClient
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

// Handle password reset
async function handlePasswordReset(e) {
    e.preventDefault();
    
    const email = document.getElementById('reset-email').value;
    const button = document.getElementById('reset-button');
    const errorDiv = document.getElementById('reset-error-message');
    const successDiv = document.getElementById('reset-success-message');
    
    button.disabled = true;
    button.textContent = 'Sending...';
    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';
    
    try {
        const supabaseClient = await getSupabaseClient();

        const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password.html`
        });
        
        if (error) throw error;
        
        successDiv.textContent = 'Password reset link sent! Please check your email.';
        successDiv.style.display = 'block';
        
        // Reset form and close modal after 3 seconds
        setTimeout(() => {
            document.getElementById('forgot-password-modal').style.display = 'none';
            document.getElementById('reset-password-form').reset();
            successDiv.style.display = 'none';
        }, 3000);
        
    } catch (error) {
        errorDiv.textContent = error.message;
        errorDiv.style.display = 'block';
    } finally {
        button.disabled = false;
        button.textContent = 'Send Reset Link';
    }
}

// Handle registration
async function handleRegister(e) {
    e.preventDefault();
    
    const registerForm = document.getElementById('register-form');
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
        const supabaseClient = await getSupabaseClient();

        // Extract username from email (before @ symbol)
        const username = email.split('@')[0];
        
        const { data, error } = await supabaseClient.auth.signUp({
            email: email,
            password: password,
            options: {
                emailRedirectTo: `${window.location.origin}/login.html?confirmed=1`,
                data: {
                    username: username
                }
            }
        });
        
        if (error) throw error;

        // If email confirmation is enabled, Supabase returns user but no session.
        if (data?.session) {
            successDiv.textContent = 'Account created successfully! Redirecting...';
            successDiv.style.display = 'block';

            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 2000);
            return;
        }

        successDiv.textContent = 'Registration successful. Please check your email and click the confirmation link to activate your account.';
        successDiv.style.display = 'block';

        // Keep confirmation message visible and hide the form after successful signup.
        if (registerForm) {
            registerForm.style.display = 'none';
        }
        
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
        const supabaseClient = await getSupabaseClient();
        const { error } = await supabaseClient.auth.signOut();
        if (error) throw error;
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Error logging out:', error);
        alert('Error logging out. Please try again.');
    }
}

// Check authentication status
async function checkAuth(requireAuth = true) {
    const supabaseClient = await getSupabaseClient();
    const { data: { user } } = await supabaseClient.auth.getUser();
    
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
    
    const supabaseClient = await getSupabaseClient();

    const { data: profile, error } = await supabaseClient
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
    const supabaseClient = await getSupabaseClient();

    const { data, error } = await supabaseClient
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
