// Load blog posts from Supabase
async function loadBlogPosts() {
    console.log('[Blog Loader] Starting to load blog posts...');
    const container = document.getElementById('blog-posts-container');
    
    if (!container) {
        console.error('[Blog Loader] Container not found!');
        return;
    }
    
    // Show loading state
    container.innerHTML = '<div style="text-align: center; padding: 48px; color: #666;">Loading posts...</div>';
    
    // Wait for Supabase client to be initialized
    let attempts = 0;
    while (!window.supabaseClient && attempts < 100) {
        await new Promise(resolve => setTimeout(resolve, 50));
        attempts++;
    }
    
    if (!window.supabaseClient) {
        console.error('[Blog Loader] Supabase client not initialized after 5 seconds');
        container.innerHTML = '<div style="text-align: center; padding: 48px; color: #e74c3c;">Failed to connect to database. Please refresh the page.</div>';
        return;
    }
    
    console.log('[Blog Loader] Supabase client ready, fetching posts...');
    
    try {
        // Fetch published blog posts from Supabase
        const { data: posts, error } = await window.supabaseClient
            .from('blog_posts')
            .select('*')
            .eq('published', true)
            .order('published_at', { ascending: false });
        
        if (error) {
            console.error('[Blog Loader] Database error:', error);
            throw error;
        }
        
        console.log('[Blog Loader] Fetched posts:', posts?.length || 0);
        
        if (!posts || posts.length === 0) {
            container.innerHTML = '<div style="text-align: center; padding: 48px; color: #666;">No blog posts yet. Check back soon!</div>';
            return;
        }
        
        // Generate blog cards
        const blogCardsHtml = posts.map(post => {
            const headerImage = post.header_image_url || 'img/blog/default.jpg';
            const excerpt = post.excerpt || post.content.substring(0, 150) + '...';
            const publishedDate = post.published_at ? new Date(post.published_at).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            }) : '';
            
            console.log('[Blog Loader] Creating card for:', post.title, 'with ID:', post.id);
            
            return `
                <a href="blog-post.html#${post.id}" class="blog-card">
                    ${post.header_image_url ? `
                        <div class="blog-card-image" style="background-image: url('${headerImage}');"></div>
                    ` : ''}
                    <div class="blog-card-content">
                        <h3>${post.title}</h3>
                        <p>${excerpt}</p>
                        ${publishedDate ? `<div class="blog-card-date">${publishedDate}</div>` : ''}
                    </div>
                </a>
            `;
        }).join('');
        
        container.innerHTML = blogCardsHtml;
        console.log('[Blog Loader] Successfully rendered', posts.length, 'blog posts');
        
    } catch (error) {
        console.error('[Blog Loader] Error loading blog posts:', error);
        container.innerHTML = '<div style="text-align: center; padding: 48px; color: #e74c3c;">Error loading posts. Please try again later.</div>';
    }
}

// Call loadBlogPosts when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadBlogPosts);
} else {
    loadBlogPosts();
}
