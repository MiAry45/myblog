// Utility to fetch posts from localStorage
function getPosts() {
    return JSON.parse(localStorage.getItem('posts') || '[]');
}

function savePosts(posts) {
    localStorage.setItem('posts', JSON.stringify(posts));
}

// Render today's posts on index.html
function renderTodayPosts() {
    const container = document.getElementById('posts-container');
    if (!container) return;
    const posts = getPosts();
    const todayStr = new Date().toISOString().slice(0, 10);
    const todayPosts = posts.filter(p => p.date === todayStr);

    if (todayPosts.length === 0) {
        container.innerHTML = '<p>No posts for today.</p>';
        return;
    }

    container.innerHTML = todayPosts.map(p => `
        <article class="glass-card">
            <h2>${p.title}</h2>
            <small>${p.date}</small>
            <p>${p.content.slice(0, 100)}...</p>
            <a href="post.html?id=${p.id}" class="glass-btn">Read more</a>
        </article>
    `).join('');
}

// Render single post on post.html
function renderSinglePost() {
    const container = document.getElementById('post-container');
    if (!container) return;
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const posts = getPosts();
    const post = posts.find(p => p.id == id);
    if (!post) {
        container.innerHTML = '<p>Post not found.</p>';
        return;
    }
    container.innerHTML = `
        <article class="glass-card">
            <h2>${post.title}</h2>
            <small>${post.date}</small>
            <p>${post.content}</p>
            <a href="index.html" class="glass-btn">Back</a>
        </article>
    `;
}

// Handle new post submission
function initNewPostForm() {
    const form = document.getElementById('new-post-form');
    if (!form) return;
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const posts = getPosts();
        posts.push({
            id: Date.now(),
            title: form.title.value,
            content: form.content.value,
            date: new Date().toISOString().slice(0, 10)
        });
        savePosts(posts);
        window.location.href = 'index.html';
    });
}

// Initialize appropriate functions based on page
window.addEventListener('DOMContentLoaded', () => {
    renderTodayPosts();
    renderSinglePost();
    initNewPostForm();
});
