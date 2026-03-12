// Supabase configuration - fetched securely from Netlify Functions
// Configuration is loaded from environment variables via serverless function

// Initialize Supabase client on window object to make it globally accessible
(function() {
    console.log('[Supabase Config] Initializing...');
    
    let SUPABASE_URL = null;
    let SUPABASE_ANON_KEY = null;
    
    // Fetch configuration from Netlify function
    const fetchConfig = async () => {
        try {
            console.log('[Supabase Config] Fetching configuration from server...');
            const response = await fetch('/.netlify/functions/config');
            
            if (!response.ok) {
                throw new Error(`Failed to fetch config: ${response.status} ${response.statusText}`);
            }
            
            const config = await response.json();
            
            if (!config.url || !config.anonKey) {
                throw new Error('Invalid configuration received from server');
            }
            
            SUPABASE_URL = config.url;
            SUPABASE_ANON_KEY = config.anonKey;
            
            console.log('[Supabase Config] ✓ Configuration loaded successfully');
            
            // Initialize Supabase after config is loaded
            initSupabase();
        } catch (error) {
            console.error('[Supabase Config] ✗ Failed to load configuration:', error);
            
            // For local development fallback (optional)
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                console.warn('[Supabase Config] Running in local mode - using fallback if available');
                // You can set local dev values here if needed
                // SUPABASE_URL = 'your-local-url';
                // SUPABASE_ANON_KEY = 'your-local-key';
                // initSupabase();
            }
        }
    };
    
    // Function to initialize Supabase
    const initSupabase = () => {
        console.log('[Supabase Config] Init function called');
        console.log('[Supabase Config] window.supabase exists:', !!window.supabase);
        
        if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
            console.error('[Supabase Config] ✗ Configuration not loaded yet');
            return;
        }
        
        if (window.supabase && window.supabase.createClient) {
            // Store the Supabase library reference
            const supabaseLib = window.supabase;
            // Create client and attach to window
            window.supabaseClient = supabaseLib.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log('[Supabase Config] ✓ Supabase client initialized successfully');
            console.log('[Supabase Config] Client available at window.supabaseClient');
            
            // Dispatch custom event to notify other scripts that Supabase is ready
            window.dispatchEvent(new CustomEvent('supabaseReady'));
        } else {
            console.error('[Supabase Config] ✗ Supabase library not loaded yet');
            // Retry after a short delay
            setTimeout(initSupabase, 100);
        }
    };
    
    // Start the initialization process
    if (document.readyState === 'loading') {
        console.log('[Supabase Config] Document still loading, waiting for DOMContentLoaded');
        document.addEventListener('DOMContentLoaded', fetchConfig);
    } else {
        console.log('[Supabase Config] Document ready, fetching config now');
        fetchConfig();
    }
})();
