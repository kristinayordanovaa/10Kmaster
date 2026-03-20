import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export default async (request, context) => {
    try {
        // Extract slug from URL path
        const url = new URL(request.url);
        const pathParts = url.pathname.split('/').filter(Boolean);
        const slug = pathParts[pathParts.length - 1];

        if (!slug) {
            return new Response('Not found', { status: 404 });
        }

        // Initialize Supabase client
        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');

        if (!supabaseUrl || !supabaseKey) {
            console.error('[Blog SSR] Missing Supabase credentials');
            return new Response('Configuration error', { status: 500 });
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        // Fetch blog post from Supabase
        const { data: post, error } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('slug', slug)
            .eq('published', true)
            .single();

        if (error || !post) {
            console.error('[Blog SSR] Post not found:', slug, error);
            return new Response('Not found', { status: 404 });
        }

        // HTML template with complete content
        const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(post.title)} - 10 to Master</title>
    <meta name="description" content="${escapeHtml(post.excerpt || post.description || truncateText(post.content, 160))}">
    <meta name="author" content="${escapeHtml(post.author || '10 to Master')}">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="article">
    <meta property="og:url" content="https://10tomaster.com/blog/${slug}">
    <meta property="og:title" content="${escapeHtml(post.title)}">
    <meta property="og:description" content="${escapeHtml(post.excerpt || post.description || truncateText(post.content, 160))}">
    ${post.header_image_url ? `<meta property="og:image" content="${escapeHtml(post.header_image_url)}">` : ''}
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="https://10tomaster.com/blog/${slug}">
    <meta property="twitter:title" content="${escapeHtml(post.title)}">
    <meta property="twitter:description" content="${escapeHtml(post.excerpt || post.description || truncateText(post.content, 160))}">
    ${post.header_image_url ? `<meta property="twitter:image" content="${escapeHtml(post.header_image_url)}">` : ''}
    
    <!-- Article metadata -->
    <meta property="article:published_time" content="${new Date(post.published_at).toISOString()}">
    <meta property="article:author" content="${escapeHtml(post.author || '10 to Master')}">
    ${post.tags ? `<meta property="article:tag" content="${post.tags.split(',').map(escapeHtml).join(',')}}">` : ''}
    
    <!-- Canonical URL -->
    <link rel="canonical" href="https://10tomaster.com/blog/${slug}">
    
    <link rel="stylesheet" href="/styles.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"><\/script>
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar">
        <div class="container">
            <div class="nav-content">
                <div class="logo">
                    <a href="/index.html" style="text-decoration: none; color: inherit; display: flex; align-items: center;">
                        <span class="logo-text">10 to Master</span>
                    </a>
                </div>
                <div class="nav-links">
                    <a href="/index.html">Home</a>
                    <a href="/index.html#pricing">Pricing</a>
                    <a href="/demo.html">Demo</a>
                    <a href="/blog.html">Blog</a>
                </div>
                <div class="nav-cta">
                    <a href="/login.html" class="btn btn-primary" style="text-decoration: none;">Login</a>
                </div>
            </div>
        </div>
    </nav>

    <!-- Blog Post Header -->
    <section class="blog-post-header" ${post.header_image_url ? `style="background-image: url('${escapeHtml(post.header_image_url)}');"` : ''} id="post-header-image">
        <div class="blog-post-header-overlay"></div>
        <div class="container">
            <h1 id="post-title">${escapeHtml(post.title)}</h1>
            ${post.published_at ? `<div class="blog-post-meta">${new Date(post.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>` : ''}
        </div>
    </section>

    <!-- Blog Post Content -->
    <section class="blog-post-content">
        <div class="container">
            <a href="/blog.html" class="blog-back-link">← Back to Blog</a>
            
            <article id="post-content" class="blog-post-article">
                ${markedToHtml(post.content)}
            </article>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-links">
                    <div class="footer-column">
                        <h4>Resources</h4>
                        <a href="/help-center.html">Help Center</a>
                        <a href="/blog.html">Blog</a>
                        <a href="/about.html">About</a>
                    </div>
                    <div class="footer-column">
                        <h4>Legal</h4>
                        <a href="/privacy.html">Privacy</a>
                        <a href="/terms.html">Terms</a>
                        <a href="/cookies.html">Cookies</a>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2026 10 to Master. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"><\/script>
    <script src="/supabase-config.js"><\/script>
    <script src="/script.js"><\/script>
</body>
</html>`;

        return new Response(html, {
            status: 200,
            headers: {
                'Content-Type': 'text/html; charset=utf-8',
                'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400'
            }
        });

    } catch (error) {
        console.error('[Blog SSR] Error:', error);
        return new Response('Internal server error', { status: 500 });
    }
};

// Helper functions
function escapeHtml(text) {
    if (!text) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

function truncateText(text, length) {
    if (!text) return '';
    return text.length > length ? text.substring(0, length) + '...' : text;
}

function markedToHtml(markdown) {
    if (!markdown) return '';
    // Simple markdown parsing - if you use marked library, call it here
    // For now, wrap paragraphs and handle basic formatting
    return markdown
        .split('\n\n')
        .map(para => {
            if (para.startsWith('#')) {
                const level = para.match(/^#+/)[0].length;
                const content = para.replace(/^#+\s/, '');
                return `<h${level}>${escapeHtml(content)}</h${level}>`;
            }
            return `<p>${escapeHtml(para)}</p>`;
        })
        .join('');
}
