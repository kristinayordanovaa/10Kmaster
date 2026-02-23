// Supabase configuration
const SUPABASE_URL = 'https://ggbcxmyszuahivgjzmou.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdnYmN4bXlzenVhaGl2Z2p6bW91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4MzIzNDMsImV4cCI6MjA4NzQwODM0M30.xNh9OnipOjkmd-QIqzUSUcEi-bbxz7IVmfoXEqc6TNs';

// Initialize Supabase client on window object to make it globally accessible
(function() {
    // Function to initialize Supabase
    const initSupabase = () => {
        if (window.supabase && window.supabase.createClient) {
            // Store the Supabase library reference
            const supabaseLib = window.supabase;
            // Create client and attach to window
            window.supabaseClient = supabaseLib.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log('Supabase client initialized on window.supabaseClient');
        } else {
            console.error('Supabase library not loaded');
        }
    };
    
    // Try to initialize immediately if library is already loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSupabase);
    } else {
        initSupabase();
    }
})();
