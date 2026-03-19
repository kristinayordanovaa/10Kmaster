// Supabase configuration - fetched securely from Netlify Functions
// Configuration is loaded from environment variables via serverless function
// Fallback to local development credentials if Netlify function is unavailable

(function() {
    console.log('[Supabase Config] Initializing...');
    
    let SUPABASE_URL = null;
    let SUPABASE_ANON_KEY = null;
    let libCheckAttempts = 0;
    const MAX_LIB_CHECK_RETRIES = 100; // Wait up to 10 seconds for Supabase library
    
    // Set local development credentials immediately
    const setLocalCredentials = () => {
        console.log('[Supabase Config] ⚙️ Loading local development credentials');
        SUPABASE_URL = 'https://ggbcxmyszuahivgjzmou.supabase.co';
        SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdnYmN4bXlzenVhaGl2Z2p6bW91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4MzIzNDMsImV4cCI6MjA4NzQwODM0M30.xNh9OnipOjkmd-QIqzUSUcEi-bbxz7IVmfoXEqc6TNs';
        return true;
    };
    
    // Fetch configuration from Netlify function
    const fetchConfig = async () => {
        try {
            console.log('[Supabase Config] 🌐 Fetching configuration from server...');
            const response = await fetch('/.netlify/functions/config', { timeout: 3000 });
            
            if (!response.ok) {
                throw new Error(`Failed to fetch config: ${response.status} ${response.statusText}`);
            }
            
            const config = await response.json();
            
            if (!config.url || !config.anonKey) {
                throw new Error('Invalid configuration received from server');
            }
            
            SUPABASE_URL = config.url;
            SUPABASE_ANON_KEY = config.anonKey;
            
            console.log('[Supabase Config] ✅ Configuration loaded from server');
        } catch (error) {
            console.error('[Supabase Config] ⚠️ Server config failed:', error.message);
            
            // For local development fallback
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname === '0.0.0.0') {
                console.warn('[Supabase Config] 💻 Using local development mode');
                setLocalCredentials();
            } else {
                console.error('[Supabase Config] ❌ Production mode but no server config available');
                return false;
            }
        }
        
        return true;
    };
    
    // Wait for Supabase library to load from CDN
    const waitForSupabaseLibrary = () => {
        libCheckAttempts++;
        
        if (window.supabase && window.supabase.createClient) {
            console.log('[Supabase Config] ✅ Supabase library loaded');
            initSupabase();
            return;
        }
        
        if (libCheckAttempts % 20 === 0) {
            console.log(`[Supabase Config] ⏳ Waiting for Supabase library... (${Math.round(libCheckAttempts * 100 / 1000)}s)`);
        }
        
        if (libCheckAttempts < MAX_LIB_CHECK_RETRIES) {
            setTimeout(waitForSupabaseLibrary, 100);
        } else {
            console.error('[Supabase Config] ❌ Supabase library failed to load after 10 seconds');
            console.error('[Supabase Config] Check if CDN script is blocked or network issues');
        }
    };
    
    // Function to initialize Supabase client
    const initSupabase = () => {
        console.log('[Supabase Config] 🔧 Initializing Supabase client');
        
        if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
            console.error('[Supabase Config] ❌ Configuration values missing');
            return;
        }
        
        if (!window.supabase || !window.supabase.createClient) {
            console.error('[Supabase Config] ❌ Supabase library not available');
            return;
        }
        
        try {
            window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log('[Supabase Config] ✅ Supabase client created successfully');
            console.log('[Supabase Config] 📡 Broadcasting supabaseReady event');
            
            // Dispatch custom event to notify other scripts that Supabase is ready
            window.dispatchEvent(new CustomEvent('supabaseReady'));
            
            // Also set a flag for polling-based checks
            window.supabaseClientReady = true;
        } catch (error) {
            console.error('[Supabase Config] ❌ Error creating Supabase client:', error);
        }
    };
    
    // Start the initialization process
    const start = async () => {
        // Set local credentials first (for localhost)
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname === '0.0.0.0') {
            setLocalCredentials();
        } else {
            // Try to fetch server config
            const configReady = await fetchConfig();
            if (!configReady) {
                console.error('[Supabase Config] ❌ Failed to get configuration');
                return;
            }
        }
        
        // Wait for Supabase library
        waitForSupabaseLibrary();
    };
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();
