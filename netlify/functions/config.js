// Netlify serverless function to provide Supabase configuration
// Environment variables are set in Netlify dashboard

exports.handler = async function(event, context) {
    // Set CORS headers to allow requests from your domain
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    // Only allow GET requests
    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    // Check if environment variables are set
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Supabase configuration not found. Please set SUPABASE_URL and SUPABASE_ANON_KEY in Netlify environment variables.' 
            })
        };
    }

    // Return the configuration
    return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
            url: process.env.SUPABASE_URL,
            anonKey: process.env.SUPABASE_ANON_KEY
        })
    };
};
