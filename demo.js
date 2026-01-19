// Demo Skills Data
let skills = [
    {
        id: 1,
        name: 'Piano',
        category: '🎵',
        hours: 3450,
        color: '#6366f1'
    },
    {
        id: 2,
        name: 'Spanish',
        category: '📚',
        hours: 1820,
        color: '#ec4899'
    },
    {
        id: 3,
        name: 'Web Development',
        category: '💻',
        hours: 5670,
        color: '#10b981'
    },
    {
        id: 4,
        name: 'Digital Painting',
        category: '🎨',
        hours: 890,
        color: '#f59e0b'
    },
    {
        id: 5,
        name: 'Rock Climbing',
        category: '🏃',
        hours: 2340,
        color: '#3b82f6'
    },
    {
        id: 6,
        name: 'Photography',
        category: '🎨',
        hours: 4120,
        color: '#8b5cf6'
    }
];

let editingSkillId = null;
let deletingSkillId = null;

// Initialize demo
document.addEventListener('DOMContentLoaded', function() {
    renderSkills();
    updateStats();
    initModal();
    initDeleteModal();
});

// Render all skills
function renderSkills() {
    const grid = document.getElementById('skillsGrid');
    if (!grid) return;
    
    grid.innerHTML = skills.map(skill => createSkillCard(skill)).join('');
    
    // Add event listeners to all buttons
    document.querySelectorAll('.skill-edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.closest('.skill-edit-btn').dataset.id);
            openEditModal(id);
        });
    });
    
    document.querySelectorAll('.skill-delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.closest('.skill-delete-btn').dataset.id);
            deleteSkill(id);
        });
    });
    
    document.querySelectorAll('.skill-add-hour-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.closest('.skill-add-hour-btn').dataset.id);
            addHour(id);
        });
    });
}

// Create skill card HTML
function createSkillCard(skill) {
    const progress = (skill.hours / 10000) * 100;
    const progressCapped = Math.min(progress, 100);
    
    return `
        <div class="demo-skill-card">
            <div class="skill-card-header">
                <div class="skill-card-title">
                    <span class="skill-icon">${skill.category}</span>
                    <h3>${skill.name}</h3>
                </div>
                <div class="skill-card-actions">
                    <button class="skill-action-btn skill-edit-btn" data-id="${skill.id}" title="Edit">✏️</button>
                    <button class="skill-action-btn skill-delete-btn" data-id="${skill.id}" title="Delete">🗑️</button>
                </div>
            </div>
            
            <div class="skill-hours">
                <div class="skill-hours-main">${skill.hours.toLocaleString()}</div>
                <div class="skill-hours-sub">of 10,000 hours</div>
            </div>
            
            <div class="skill-progress-bar">
                <div class="skill-progress-fill" style="width: ${progressCapped}%; background: ${skill.color};"></div>
            </div>
            
            <div class="skill-progress-text">${progressCapped.toFixed(1)}% Complete</div>
            
            <button class="btn btn-outline btn-sm skill-add-hour-btn" data-id="${skill.id}">
                <span>+</span> Add 1 Hour
            </button>
        </div>
    `;
}

// Update stats
function updateStats() {
    const totalHours = skills.reduce((sum, skill) => sum + skill.hours, 0);
    const totalHoursEl = document.getElementById('totalHours');
    const skillCountEl = document.getElementById('skillCount');
    
    if (totalHoursEl) totalHoursEl.textContent = totalHours.toLocaleString();
    if (skillCountEl) skillCountEl.textContent = skills.length;
}

// Initialize modal
function initModal() {
    const modal = document.getElementById('skillModal');
    const addBtn = document.getElementById('addSkillBtn');
    const closeBtn = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const form = document.getElementById('skillForm');
    
    if (addBtn) {
        addBtn.addEventListener('click', openAddModal);
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeModal);
    }
    
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }
    
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
    
    // ESC key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

// Open add modal
function openAddModal() {
    editingSkillId = null;
    document.getElementById('modalTitle').textContent = 'Add New Skill';
    document.getElementById('skillForm').reset();
    document.getElementById('skillModal').classList.add('active');
}

// Open edit modal
function openEditModal(id) {
    const skill = skills.find(s => s.id === id);
    if (!skill) return;
    
    editingSkillId = id;
    document.getElementById('modalTitle').textContent = 'Edit Skill';
    document.getElementById('skillName').value = skill.name;
    document.getElementById('skillCategory').value = skill.category;
    document.getElementById('skillHours').value = skill.hours;
    document.getElementById('skillColor').value = skill.color;
    document.getElementById('skillModal').classList.add('active');
}

// Close modal
function closeModal() {
    document.getElementById('skillModal').classList.remove('active');
    editingSkillId = null;
}

// Handle form submit
function handleFormSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('skillName').value.trim();
    const category = document.getElementById('skillCategory').value;
    const hours = parseInt(document.getElementById('skillHours').value) || 0;
    const color = document.getElementById('skillColor').value;
    
    if (!name) return;
    
    if (editingSkillId) {
        // Edit existing skill
        const skill = skills.find(s => s.id === editingSkillId);
        if (skill) {
            skill.name = name;
            skill.category = category;
            skill.hours = hours;
            skill.color = color;
        }
    } else {
        // Add new skill
        const newSkill = {
            id: Date.now(),
            name,
            category,
            hours,
            color
        };
        skills.push(newSkill);
    }
    
    renderSkills();
    updateStats();
    closeModal();
}

// Initialize delete modal
function initDeleteModal() {
    const modal = document.getElementById('deleteModal');
    const closeBtn = document.getElementById('closeDeleteModal');
    const cancelBtn = document.getElementById('cancelDeleteBtn');
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeDeleteModal);
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeDeleteModal);
    }
    
    if (confirmBtn) {
        confirmBtn.addEventListener('click', confirmDelete);
    }
    
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeDeleteModal();
        });
    }
}

// Open delete modal
function openDeleteModal(id) {
    const skill = skills.find(s => s.id === id);
    if (!skill) return;
    
    deletingSkillId = id;
    document.getElementById('deleteSkillName').textContent = skill.name;
    document.getElementById('deleteModal').classList.add('active');
}

// Close delete modal
function closeDeleteModal() {
    document.getElementById('deleteModal').classList.remove('active');
    deletingSkillId = null;
}

// Confirm delete
function confirmDelete() {
    if (deletingSkillId) {
        skills = skills.filter(s => s.id !== deletingSkillId);
        renderSkills();
        updateStats();
        closeDeleteModal();
    }
}

// Delete skill
function deleteSkill(id) {
    openDeleteModal(id);
}

// Add hour to skill
function addHour(id) {
    const skill = skills.find(s => s.id === id);
    if (skill && skill.hours < 10000) {
        skill.hours += 1;
        renderSkills();
        updateStats();
        
        // Show visual feedback
        const card = document.querySelector(`[data-id="${id}"]`).closest('.demo-skill-card');
        card.style.transform = 'scale(1.02)';
        setTimeout(() => {
            card.style.transform = 'scale(1)';
        }, 200);
    }
}
