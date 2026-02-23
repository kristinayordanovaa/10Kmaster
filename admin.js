// Admin panel functionality
let allUsers = [];

document.addEventListener('DOMContentLoaded', async () => {
    // Check if user is admin
    const isAdmin = await checkAdmin();
    if (!isAdmin) return;
    
    // Load users
    await loadUsers();
});

// Load all users
async function loadUsers() {
    const loadingState = document.getElementById('loading-state');
    const usersTableWrapper = document.getElementById('users-table-wrapper');
    const emptyState = document.getElementById('empty-state');
    const errorDiv = document.getElementById('error-message');
    
    loadingState.style.display = 'block';
    usersTableWrapper.style.display = 'none';
    emptyState.style.display = 'none';
    errorDiv.style.display = 'none';
    
    try {
        const { data: profiles, error } = await window.supabaseClient
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        allUsers = profiles || [];
        
        loadingState.style.display = 'none';
        
        if (allUsers.length === 0) {
            emptyState.style.display = 'block';
        } else {
            usersTableWrapper.style.display = 'block';
            renderUsers();
        }
        
        document.getElementById('users-count').textContent = `(${allUsers.length})`;
        
    } catch (error) {
        console.error('Error loading users:', error);
        loadingState.style.display = 'none';
        errorDiv.textContent = 'Error loading users: ' + error.message;
        errorDiv.style.display = 'block';
    }
}

// Render users table
function renderUsers() {
    const tbody = document.getElementById('users-table-body');
    tbody.innerHTML = '';
    
    allUsers.forEach(user => {
        const tr = document.createElement('tr');
        
        const createdDate = new Date(user.created_at).toLocaleDateString();
        
        tr.innerHTML = `
            <td class="user-email">${user.email}</td>
            <td>${user.username || 'N/A'}</td>
            <td>
                <span class="user-badge ${user.is_admin ? 'admin' : 'user'}">
                    ${user.is_admin ? 'Admin' : 'User'}
                </span>
            </td>
            <td>${createdDate}</td>
            <td>
                <button 
                    class="delete-button" 
                    onclick="deleteUser('${user.id}', '${user.email}')"
                    ${user.is_admin ? 'disabled title="Cannot delete admin users"' : ''}
                >
                    Delete
                </button>
            </td>
        `;
        
        tbody.appendChild(tr);
    });
}

// Delete user
async function deleteUser(userId, userEmail) {
    if (!confirm(`Are you sure you want to delete user: ${userEmail}?`)) {
        return;
    }
    
    const errorDiv = document.getElementById('error-message');
    errorDiv.style.display = 'none';
    
    try {
        // First delete the profile (which will cascade delete skills and time_entries)
        const { error: profileError } = await window.supabaseClient
            .from('profiles')
            .delete()
            .eq('id', userId);
        
        if (profileError) throw profileError;
        
        // Note: Deleting from auth.users requires admin privileges
        // For now, we'll just delete the profile
        // In production, you'd use a server-side admin API to delete the auth user
        
        // Reload users
        await loadUsers();
        
    } catch (error) {
        console.error('Error deleting user:', error);
        errorDiv.textContent = 'Error deleting user: ' + error.message;
        errorDiv.style.display = 'block';
    }
}
