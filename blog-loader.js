// Blog posts index - Add new blog posts here
const blogPosts = [
    {
        slug: 'the-science-behind-10000-hours',
        title: 'The Science Behind the 10,000 Hour Rule',
        excerpt: 'Is mastery really about hitting a magic number? Let\'s dive into the research behind deliberate practice and what it takes to truly master a skill.'
    },
    {
        slug: '5-tips-consistent-practice',
        title: '5 Tips for Building a Consistent Practice Habit',
        excerpt: 'Consistency is the secret sauce to mastery. Here\'s how to make practice a natural part of your daily routine.'
    },
    {
        slug: 'tracking-progress-effectively',
        title: 'How to Track Your Progress Effectively',
        excerpt: 'Not all practice hours are equal. Learn how to track what matters and measure real improvement.'
    },
    {
        slug: 'overcoming-practice-plateaus',
        title: 'Overcoming Practice Plateaus',
        excerpt: 'Stuck in your progress? Here\'s how to break through plateaus and continue your journey to mastery.'
    }
];

// Load blog posts on page load
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('blog-posts-container');
    
    if (container) {
        // Generate blog cards
        const blogCardsHtml = blogPosts.map(post => `
            <a href="blog-post.html?post=${post.slug}" class="blog-card">
                <h3>${post.title}</h3>
                <p>${post.excerpt}</p>
            </a>
        `).join('');
        
        container.innerHTML = blogCardsHtml;
    }
});
