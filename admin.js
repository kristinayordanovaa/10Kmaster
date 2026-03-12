// Admin panel functionality
document.addEventListener('DOMContentLoaded', async () => {
    // Wait a tick to ensure supabase-config.js has initialized
    await new Promise(resolve => setTimeout(resolve, 100));
    
    if (!window.supabaseClient) {
        console.error('Supabase client not initialized');
        return;
    }
    
    // Check if user is admin
    const isAdmin = await checkAdmin();
    if (!isAdmin) return;
    
    // All admin functionality is now handled in blog-admin.js
    console.log('Admin panel loaded');
});
