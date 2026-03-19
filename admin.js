// Admin panel functionality
async function initializeAdmin() {
    // Wait for supabase-config.js to initialize (up to 10 seconds)
    let retries = 0;
    while (!window.supabaseClient && retries < 100) {
        await new Promise(resolve => setTimeout(resolve, 100));
        retries++;
    }
    
    if (!window.supabaseClient) {
        console.error('[Admin] Supabase client initialization timeout');
        return;
    }
    
    console.log('[Admin] Supabase client ready, checking admin security');
    
    // Check if user is admin
    const isAdmin = await checkAdmin();
    if (!isAdmin) return;
    
    // All admin functionality is now handled in blog-admin.js
    console.log('[Admin] Admin security check passed');
}

// Also listen for supabaseReady event in case initialization happens after script loads
function setupAdminEventListener() {
    window.addEventListener('supabaseReady', async () => {
        console.log('[Admin] supabaseReady event received');
        if (window.supabaseClient) {
            const isAdmin = await checkAdmin();
            if (!isAdmin) return;
            console.log('[Admin] Admin verification successful');
        }
    });
}

setupAdminEventListener();

// Call initialization when document is ready or immediately if already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAdmin);
} else {
    initializeAdmin();
}
