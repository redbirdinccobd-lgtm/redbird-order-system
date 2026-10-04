// Storage key
const STORAGE_KEY = 'rbi_tasks_v1';

// Default state
const defaultState = {
  tasks: [],
  categories: []
};

let state = { ...defaultState };
let editingTaskId = null;

// Load state from localStorage
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      state = { ...defaultState };
      return;
    }
    state = { ...defaultState, ...JSON.parse(raw) };
  } catch (err) {
    console.error('Failed to load state:', err);
    state = { ...defaultState };
  }
}

// Save state to localStorage
function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// Generate unique ID
function generateId() {
  return Date.now() + Math.random().toString(36).substr(2, 9);
}

// Add task
function addTask() {
  const title = document.getElementById('taskInput').value.trim();
  const priority = document.getElementById('prioritySelect').value;
  const category = document.getElementById('categoryInput').value.trim();
  const dueDate = document.getElementById('dueDateInput').value;

  if (!title) {
    alert('Please enter a task title');
    return;
  }

  const task = {
    id: generateId(),
    title,
    priority,
    category,
    dueDate,
    completed: false,
    createdAt: new Date().toISOString()
  };

  state.tasks.push(task);

  if (category && !state.categories.includes(category)) {
    state.categories.push(category);
  }

  saveState();
  clearInputs();
  renderTasks();
  updateStats();
  renderCategories();
}

// Clear inputs
function clearInputs() {
  document.getElementById('taskInput').value = '';
  document.getElementById('prioritySelect').value = 'medium';
  document.getElementById('categoryInput').value = '';
  document.getElementById('dueDateInput').value = '';
}

// Toggle task completion
function toggleTask(id) {
  const task = state.tasks.find(t => t.id === id);
  if (task) {
    task.completed = !task.completed;
    saveState();
    renderTasks();
    updateStats();
  }
}

// Delete task
function deleteTask(id) {
  if (!confirm('Are you sure you want to delete this task?')) return;
  state.tasks = state.tasks.filter(t => t.id !== id);
  saveState();
  renderTasks();
  updateStats();
}

// Open edit modal
function openEditModal(id) {
  editingTaskId = id;
  const task = state.tasks.find(t => t.id === id);
  if (!task) return;

  document.getElementById('editTaskTitle').value = task.title || '';
  document.getElementById('editTaskDesc').value = task.description || '';
  document.getElementById('editTaskPriority').value = task.priority || 'medium';
  document.getElementById('editTaskCategory').value = task.category || '';
  document.getElementById('editTaskDueDate').value = task.dueDate || '';

  document.getElementById('editModal').classList.add('active');
}

// Close edit modal
function closeEditModal() {
  document.getElementById('editModal').classList.remove('active');
  editingTaskId = null;
}

// Save edited task
function saveEditedTask() {
  if (!editingTaskId) return;

  const task = state.tasks.find(t => t.id === editingTaskId);
  if (!task) return;

  const newCategory = document.getElementById('editTaskCategory').value.trim();
  const oldCategory = task.category;

  task.title = document.getElementById('editTaskTitle').value.trim();
  task.description = document.getElementById('editTaskDesc').value.trim();
  task.priority = document.getElementById('editTaskPriority').value;
  task.category = newCategory;
  task.dueDate = document.getElementById('editTaskDueDate').value;

  if (newCategory && !state.categories.includes(newCategory)) {
    state.categories.push(newCategory);
  }

  saveState();
  closeEditModal();
  renderTasks();
  renderCategories();
}

// Filter tasks
function filterTasks(filterType) {
  let filtered = state.tasks;

  switch (filterType) {
    case 'active':
      filtered = state.tasks.filter(t => !t.completed);
      break;
    case 'completed':
      filtered = state.tasks.filter(t => t.completed);
      break;
    case 'high':
      filtered = state.tasks.filter(t => t.priority === 'high');
      break;
    case 'today':
      const today = new Date().toISOString().split('T')[0];
      filtered = state.tasks.filter(t => t.dueDate === today);
      break;
  }

  return filtered;
}

// Search tasks
function searchTasks(query) {
  const q = query.toLowerCase();
  return state.tasks.filter(t => 
    t.title.toLowerCase().includes(q) || 
    t.category.toLowerCase().includes(q)
  );
}

// Sort tasks
function sortTasks(tasks, sortType) {
  const sorted = [...tasks];

  switch (sortType) {
    case 'date-asc':
      sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      break;
    case 'date-desc':
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      break;
    case 'priority':
      const priorityOrder = { high: 1, medium: 2, low: 3 };
      sorted.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
      break;
    case 'name':
      sorted.sort((a, b) => a.title.localeCompare(b.title));
      break;
  }

  return sorted;
}

// Render tasks
function renderTasks() {
  const currentFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
  const searchQuery = document.getElementById('searchInput').value;
  const sortType = document.getElementById('sortSelect').value;

  let tasks = filterTasks(currentFilter);
  if (searchQuery) {
    tasks = tasks.filter(t => searchTasks(searchQuery).includes(t));
  }
  tasks = sortTasks(tasks, sortType);

  const tasksList = document.getElementById('tasksList');

  if (!tasks.length) {
    tasksList.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📝</div>
        <p>No tasks found. Create one to get started!</p>
      </div>
    `;
    return;
  }

  tasksList.innerHTML = tasks.map(task => `
    <div class="task-item ${task.completed ? 'completed' : ''}">
      <input
        type="checkbox"
        class="task-checkbox"
        ${task.completed ? 'checked' : ''}
        onchange="toggleTask('${task.id}')"
      />
      <div class="task-content">
        <div class="task-header">
          <span class="task-text">${escapeHtml(task.title)}</span>
          <span class="task-badge badge-${task.priority}">● ${task.priority}</span>
          ${task.category ? `<span class="task-badge badge-category">${escapeHtml(task.category)}</span>` : ''}
        </div>
        <div class="task-meta">
          ${task.dueDate ? `📅 Due: ${formatDate(task.dueDate)}` : '📅 No due date'}
        </div>
      </div>
      <div class="task-actions">
        <button class="task-btn" onclick="openEditModal('${task.id}')" title="Edit">✏️</button>
        <button class="task-btn" onclick="deleteTask('${task.id}')" title="Delete">🗑</button>
      </div>
    </div>
  `).join('');
}

// Update statistics
function updateStats() {
  const total = state.tasks.length;
  const completed = state.tasks.filter(t => t.completed).length;
  const pending = total - completed;
  const percentage = total > 0 ? (completed / total) * 100 : 0;

  document.getElementById('totalTasks').textContent = total;
  document.getElementById('completedTasks').textContent = completed;
  document.getElementById('pendingTasks').textContent = pending;
  document.getElementById('progressFill').style.width = percentage + '%';
}

// Render categories
function renderCategories() {
  const categoriesList = document.getElementById('categoriesList');
  const uniqueCategories = [...new Set(state.tasks.map(t => t.category).filter(Boolean))];

  if (!uniqueCategories.length) {
    categoriesList.innerHTML = '<p style="color: var(--muted); font-size: 12px; margin: 0;">No categories yet</p>';
    return;
  }

  categoriesList.innerHTML = uniqueCategories.map(category => `
    <button class="category-tag" onclick="filterByCategory('${escapeHtml(category)}')"
      title="Filter by this category">
      ${escapeHtml(category)}
    </button>
  `).join('');
}

// Filter by category
function filterByCategory(category) {
  const filtered = state.tasks.filter(t => t.category === category);
  const tasksList = document.getElementById('tasksList');

  if (!filtered.length) {
    tasksList.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📁</div>
        <p>No tasks in this category</p>
      </div>
    `;
    return;
  }

  const sorted = sortTasks(filtered, document.getElementById('sortSelect').value);
  tasksList.innerHTML = sorted.map(task => `
    <div class="task-item ${task.completed ? 'completed' : ''}">
      <input
        type="checkbox"
        class="task-checkbox"
        ${task.completed ? 'checked' : ''}
        onchange="toggleTask('${task.id}')"
      />
      <div class="task-content">
        <div class="task-header">
          <span class="task-text">${escapeHtml(task.title)}</span>
          <span class="task-badge badge-${task.priority}">● ${task.priority}</span>
        </div>
        <div class="task-meta">
          ${task.dueDate ? `📅 Due: ${formatDate(task.dueDate)}` : '📅 No due date'}
        </div>
      </div>
      <div class="task-actions">
        <button class="task-btn" onclick="openEditModal('${task.id}')" title="Edit">✏️</button>
        <button class="task-btn" onclick="deleteTask('${task.id}')" title="Delete">🗑</button>
      </div>
    </div>
  `).join('');
}

// Export tasks
function exportTasks() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `redbird-tasks-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// Import tasks
function importTasks() {
  document.getElementById('importFile').click();
}

// Clear all tasks
function clearAllTasks() {
  if (!confirm('This will delete ALL tasks. Continue?')) return;
  state = { ...defaultState };
  saveState();
  renderTasks();
  updateStats();
  renderCategories();
}

// Format date
function formatDate(dateString) {
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Escape HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Event listeners
function bindEvents() {
  document.getElementById('addBtn').addEventListener('click', addTask);
  document.getElementById('taskInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
  });

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderTasks();
    });
  });

  document.getElementById('searchInput').addEventListener('input', renderTasks);
  document.getElementById('sortSelect').addEventListener('change', renderTasks);

  document.getElementById('exportBtn').addEventListener('click', exportTasks);
  document.getElementById('importBtn').addEventListener('click', importTasks);
  document.getElementById('clearBtn').addEventListener('click', clearAllTasks);

  document.getElementById('importFile').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = JSON.parse(reader.result);
        if (imported.tasks && Array.isArray(imported.tasks)) {
          state = { ...defaultState, ...imported };
          saveState();
          renderTasks();
          updateStats();
          renderCategories();
          alert('Tasks imported successfully!');
        }
      } catch (err) {
        alert('Invalid file format');
      }
    };
    reader.readAsText(file);
  });

  document.getElementById('saveEditBtn').addEventListener('click', saveEditedTask);
  document.getElementById('cancelEditBtn').addEventListener('click', closeEditModal);
  document.querySelector('.modal-close').addEventListener('click', closeEditModal);

  document.getElementById('themeToggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
  });
}

// Initialize app
function init() {
  loadState();
  bindEvents();
  renderTasks();
  updateStats();
  renderCategories();

  // Add sample tasks if empty
  if (state.tasks.length === 0) {
    state.tasks = [
      {
        id: generateId(),
        title: 'Complete project proposal',
        priority: 'high',
        category: 'Work',
        dueDate: new Date().toISOString().split('T')[0],
        completed: false,
        createdAt: new Date().toISOString()
      },
      {
        id: generateId(),
        title: 'Review email and updates',
        priority: 'medium',
        category: 'Work',
        dueDate: '',
        completed: false,
        createdAt: new Date().toISOString()
      },
      {
        id: generateId(),
        title: 'Buy groceries',
        priority: 'low',
        category: 'Personal',
        dueDate: '',
        completed: false,
        createdAt: new Date().toISOString()
      }
    ];
    saveState();
    renderTasks();
    updateStats();
    renderCategories();
  }
}

window.addEventListener('DOMContentLoaded', init);

window.addEventListener('beforeunload', () => {
  saveState();
});
