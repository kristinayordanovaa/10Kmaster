// Blog Administration Functions
let allBlogPosts = [];
let currentEditingPost = null;

// Helper function to generate slug from title
function generateSlug(title) {
    return title.toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

// Initialize blog posts on load
document.addEventListener('DOMContentLoaded', async () => {
    // Wait a tick to ensure supabase-config.js has initialized
    await new Promise(resolve => setTimeout(resolve, 100));
    
    if (!window.supabaseClient) {
        console.error('Supabase client not initialized');
        return;
    }
    
    // Check if user is admin (checkAdmin function is in auth.js)
    // This will redirect if not admin
    const isAdmin = await checkAdmin();
    if (isAdmin) {
        // Load blog posts immediately
        loadBlogPosts();
        
        // Add event listeners for SEO field updates
        setupSEOFieldListeners();
    }
});

// Setup event listeners for SEO fields
function setupSEOFieldListeners() {
    const titleInput = document.getElementById('blog-title-input');
    const slugInput = document.getElementById('blog-slug-input');
    const descriptionInput = document.getElementById('blog-description');
    const slugPreview = document.getElementById('slug-preview');
    const descriptionCount = document.getElementById('description-count');
    
    // Auto-generate slug from title
    if (titleInput && slugInput) {
        titleInput.addEventListener('input', (e) => {
            // Only auto-generate if slug is empty or matches previous title's slug
            if (!slugInput.dataset.manuallyEdited) {
                const newSlug = generateSlug(e.target.value);
                slugInput.value = newSlug;
                if (slugPreview) slugPreview.textContent = newSlug || 'your-slug';
            }
        });
        
        // Mark as manually edited when user types in slug field
        slugInput.addEventListener('input', (e) => {
            slugInput.dataset.manuallyEdited = 'true';
            if (slugPreview) slugPreview.textContent = e.target.value || 'your-slug';
        });
    }
    
    // Update character count for description
    if (descriptionInput && descriptionCount) {
        descriptionInput.addEventListener('input', (e) => {
            descriptionCount.textContent = e.target.value.length;
        });
    }
}

// Load all blog posts
async function loadBlogPosts() {
    const loadingState = document.getElementById('blog-loading-state');
    const tableWrapper = document.getElementById('blog-table-wrapper');
    const emptyState = document.getElementById('blog-empty-state');
    
    loadingState.style.display = 'block';
    tableWrapper.style.display = 'none';
    emptyState.style.display = 'none';
    
    try {
        const { data: posts, error } = await window.supabaseClient
            .from('blog_posts')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        allBlogPosts = posts || [];
        
        loadingState.style.display = 'none';
        
        if (allBlogPosts.length === 0) {
            emptyState.style.display = 'block';
        } else {
            tableWrapper.style.display = 'block';
            renderBlogPosts();
        }
        
        document.getElementById('blog-count').textContent = `(${allBlogPosts.length})`;
        
    } catch (error) {
        console.error('Error loading blog posts:', error);
        loadingState.style.display = 'none';
        alert('Error loading blog posts: ' + error.message);
    }
}

// Render blog posts table
function renderBlogPosts() {
    const tbody = document.getElementById('blog-table-body');
    tbody.innerHTML = '';
    
    allBlogPosts.forEach(post => {
        const tr = document.createElement('tr');
        
        const publishedDate = post.published_at ? new Date(post.published_at).toLocaleDateString() : 'Not published';
        const updatedDate = new Date(post.updated_at).toLocaleDateString();
        
        tr.innerHTML = `
            <td><strong>${post.title}</strong></td>
            <td>
                <span class="blog-status ${post.published ? 'published' : 'draft'}">
                    ${post.published ? 'Published' : 'Draft'}
                </span>
            </td>
            <td>${publishedDate}</td>
            <td>${updatedDate}</td>
            <td>
                <div class="blog-actions">
                    <button class="blog-action-button blog-action-view" onclick="viewBlogPost('${post.id}')">View</button>
                    <button class="blog-action-button blog-action-edit" onclick="editBlogPost('${post.id}')">Edit</button>
                    <button class="blog-action-button blog-action-delete" onclick="deleteBlogPost('${post.id}', '${post.title.replace(/'/g, "\\'")}')">Delete</button>
                </div>
            </td>
        `;
        
        tbody.appendChild(tr);
    });
}

// Open blog editor (for new post)
function openBlogEditor() {
    currentEditingPost = null;
    document.getElementById('blog-editor-title').textContent = 'Add Blog Post';
    document.getElementById('blog-form').reset();
    document.getElementById('blog-id').value = '';
    document.getElementById('blog-current-image').style.display = 'none';
    
    // Reset slug manual edit flag
    const slugInput = document.getElementById('blog-slug-input');
    if (slugInput) {
        slugInput.dataset.manuallyEdited = '';
    }
    
    // Reset counters
    document.getElementById('slug-preview').textContent = 'your-slug';
    document.getElementById('description-count').textContent = '0';
    
    document.getElementById('blog-editor-modal').style.display = 'flex';
}

// Close blog editor
function closeBlogEditor() {
    document.getElementById('blog-editor-modal').style.display = 'none';
    currentEditingPost = null;
}

// Edit blog post
async function editBlogPost(postId) {
    const post = allBlogPosts.find(p => p.id === postId);
    if (!post) return;
    
    currentEditingPost = post;
    document.getElementById('blog-editor-title').textContent = 'Edit Blog Post';
    document.getElementById('blog-id').value = post.id;
    document.getElementById('blog-title-input').value = post.title;
    document.getElementById('blog-slug-input').value = post.slug || generateSlug(post.title);
    document.getElementById('blog-description').value = post.description || '';
    document.getElementById('blog-excerpt').value = post.excerpt || '';
    document.getElementById('blog-content-input').value = post.content;
    
    // Mark slug as manually edited if it exists
    const slugInput = document.getElementById('blog-slug-input');
    if (slugInput && post.slug) {
        slugInput.dataset.manuallyEdited = 'true';
    }
    
    // Update counters
    document.getElementById('slug-preview').textContent = post.slug || generateSlug(post.title);
    document.getElementById('description-count').textContent = (post.description || '').length;
    
    // Show current header image if exists
    if (post.header_image_url) {
        document.getElementById('blog-current-image').style.display = 'block';
        document.getElementById('blog-current-image-preview').src = post.header_image_url;
    } else {
        document.getElementById('blog-current-image').style.display = 'none';
    }
    
    document.getElementById('blog-editor-modal').style.display = 'flex';
}

// View blog post (open in new tab)
function viewBlogPost(postId) {
    const post = allBlogPosts.find(p => p.id === postId);
    if (!post) return;
    
    // Use clean /blog/slug URL if slug exists, otherwise fall back to ID
    const postUrl = post.slug ? `/blog/${post.slug}` : `blog-post.html#${post.id}`;
    window.open(postUrl, '_blank');
}

// Delete blog post
async function deleteBlogPost(postId, postTitle) {
    if (!confirm(`Are you sure you want to delete the post "${postTitle}"?`)) {
        return;
    }
    
    try {
        const post = allBlogPosts.find(p => p.id === postId);
        
        // Delete header image from storage if exists
        if (post && post.header_image_url && post.header_image_url.includes('supabase')) {
            try {
                const imagePath = post.header_image_url.split('/').pop();
                await window.supabaseClient.storage
                    .from('blog-images')
                    .remove([imagePath]);
            } catch (storageError) {
                console.warn('Error deleting blog image:', storageError);
            }
        }
        
        // Delete post from database
        const { error } = await window.supabaseClient
            .from('blog_posts')
            .delete()
            .eq('id', postId);
        
        if (error) throw error;
        
        alert('Blog post deleted successfully!');
        await loadBlogPosts();
        
    } catch (error) {
        console.error('Error deleting blog post:', error);
        alert('Error deleting post: ' + error.message);
    }
}

// Handle blog form submission
document.addEventListener('DOMContentLoaded', () => {
    const blogForm = document.getElementById('blog-form');
    if (blogForm) {
        blogForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await saveBlogPost();
        });
    }
});

// Save blog post
async function saveBlogPost() {
    const postId = document.getElementById('blog-id').value;
    const title = document.getElementById('blog-title-input').value.trim();
    const slug = document.getElementById('blog-slug-input').value.trim();
    const description = document.getElementById('blog-description').value.trim();
    const excerpt = document.getElementById('blog-excerpt').value.trim();
    const content = document.getElementById('blog-content-input').value.trim();
    const headerImageFile = document.getElementById('blog-header-image').files[0];
    
    if (!title || !slug || !description || !content) {
        alert('Please fill in all required fields (Title, Slug, Description, and Content)');
        return;
    }
    
    // Validate slug format (lowercase, alphanumeric and hyphens only)
    const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugPattern.test(slug)) {
        alert('Slug must be lowercase, alphanumeric with hyphens only (e.g., my-blog-post)');
        return;
    }
    
    try {
        // Check if slug is already used by another post
        const { data: existingPosts } = await window.supabaseClient
            .from('blog_posts')
            .select('id')
            .eq('slug', slug);
        
        if (existingPosts && existingPosts.length > 0) {
            // If editing, allow same slug for same post
            if (!postId || existingPosts[0].id !== postId) {
                alert('This URL slug is already in use. Please choose a different one.');
                return;
            }
        }
        
        let headerImageUrl = currentEditingPost?.header_image_url || null;
        
        // Upload header image if provided
        if (headerImageFile) {
            const fileExt = headerImageFile.name.split('.').pop();
            const fileName = `${Date.now()}-${slug}.${fileExt}`;
            
            const { data: uploadData, error: uploadError } = await window.supabaseClient.storage
                .from('blog-images')
                .upload(fileName, headerImageFile, {
                    cacheControl: '3600',
                    upsert: false
                });
            
            if (uploadError) throw uploadError;
            
            const { data: urlData } = window.supabaseClient.storage
                .from('blog-images')
                .getPublicUrl(fileName);
            
            headerImageUrl = urlData.publicUrl;
            
            // Delete old image if editing
            if (currentEditingPost && currentEditingPost.header_image_url && currentEditingPost.header_image_url.includes('supabase')) {
                try {
                    const oldImagePath = currentEditingPost.header_image_url.split('/').pop();
                    await window.supabaseClient.storage
                        .from('blog-images')
                        .remove([oldImagePath]);
                } catch (e) {
                    console.warn('Could not delete old image:', e);
                }
            }
        }
        
        // Get current user
        const { data: { user } } = await window.supabaseClient.auth.getUser();
        
        const postData = {
            title,
            slug,
            description,
            excerpt: excerpt || null,
            content,
            header_image_url: headerImageUrl,
            published: true,
            published_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        
        if (postId) {
            // Update existing post
            const { error } = await window.supabaseClient
                .from('blog_posts')
                .update(postData)
                .eq('id', postId);
            
            if (error) throw error;
        } else {
            // Create new post
            postData.author_id = user.id;
            
            const { error } = await window.supabaseClient
                .from('blog_posts')
                .insert([postData]);
            
            if (error) throw error;
        }
        
        alert('Blog post saved successfully!');
        closeBlogEditor();
        await loadBlogPosts();
        
    } catch (error) {
        console.error('Error saving blog post:', error);
        alert('Error saving post: ' + error.message);
    }
}

// Text formatting for the editor
function formatText(format) {
    const textarea = document.getElementById('blog-content-input');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const beforeText = textarea.value.substring(0, start);
    const afterText = textarea.value.substring(end);
    
    let newText = '';
    
    switch(format) {
        case 'bold':
            newText = `**${selectedText || 'bold text'}**`;
            break;
        case 'italic':
            newText = `*${selectedText || 'italic text'}*`;
            break;
        case 'heading':
            newText = `## ${selectedText || 'Heading'}`;
            break;
        case 'quote':
            newText = `> ${selectedText || 'Quote'}`;
            break;
        case 'ul':
            newText = `- ${selectedText || 'List item'}`;
            break;
        case 'ol':
            newText = `1. ${selectedText || 'List item'}`;
            break;
        case 'link':
            const url = prompt('Enter URL:');
            if (url) {
                newText = `[${selectedText || 'link text'}](${url})`;
            }
            break;
    }
    
    if (newText) {
        textarea.value = beforeText + newText + afterText;
        textarea.focus();
        textarea.setSelectionRange(start, start + newText.length);
    }
}
