const API_URL = 'http://127.0.0.1:8000/api/tasks/';

// DOM Elements
const todoForm = document.getElementById('todoForm');
const todoList = document.getElementById('todoList');
const editModal = new bootstrap.Modal(document.getElementById('editModal'));

// Fetch all todos
async function fetchTodos() {
    try {
        const response = await fetch(API_URL);
        const todos = await response.json();
        displayTodos(todos);
    } catch (error) {
        console.error('Error fetching todos:', error);
    }
}

// Create a new todo
async function createTodo(todo) {
    try {
        const response = await fetch(API_URL + 'create/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(todo),
        });
        if (!response.ok) throw new Error('Failed to create todo');
        fetchTodos();
    } catch (error) {
        console.error('Error creating todo:', error);
    }
}

// Update a todo
async function updateTodo(id, todo) {
    try {
        const response = await fetch(`${API_URL}${id}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(todo),
        });
        if (!response.ok) throw new Error('Failed to update todo');
        fetchTodos();
    } catch (error) {
        console.error('Error updating todo:', error);
    }
}

// Delete a todo
async function deleteTodo(id) {
    try {
        const response = await fetch(`${API_URL}${id}/`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete todo');
        fetchTodos();
    } catch (error) {
        console.error('Error deleting todo:', error);
    }
}

// Display todos in the DOM
function displayTodos(todos) {
    todoList.innerHTML = '';
    todos.forEach(todo => {
        const todoElement = document.createElement('div');
        todoElement.className = `list-group-item todo-item`;

        // Apply strikethrough to title if complete
        const titleClass = todo.complete ? 'text-decoration-line-through text-muted' : '';

        todoElement.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <div class="todo-content">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" 
                               ${todo.complete ? 'checked' : ''} 
                               onchange="toggleComplete(${todo.id}, ${!todo.complete})">
                        <label class="form-check-label ${titleClass}">${todo.title}</label>
                    </div>
                    ${todo.description ? `<div class="todo-description">${todo.description}</div>` : ''}
                </div>
                <div class="todo-actions">
                    <button class="btn btn-primary btn-sm" onclick="openEditModal(${todo.id}, '${todo.title}', '${todo.description}', ${todo.complete})">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteTodo(${todo.id})">Delete</button>
                </div>
            </div>
        `;

        todoList.appendChild(todoElement);
    });
}


// Handle form submission
todoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    
    if (!title) return;
    
    await createTodo({
        title,
        description,
        complete: false
    });
    
    todoForm.reset();
});

// Toggle todo completion
window.toggleComplete = async (id, complete) => {
    await updateTodo(id, { complete });
};

// Open edit modal with todo data
window.openEditModal = (id, title, description, complete) => {
    document.getElementById('editId').value = id;
    document.getElementById('editTitle').value = title;
    document.getElementById('editDescription').value = description;
    document.getElementById('editcomplete').checked = complete;
    editModal.show();
};

// Save edited todo
window.saveEdit = async () => {
    const id = document.getElementById('editId').value;
    const title = document.getElementById('editTitle').value;
    const description = document.getElementById('editDescription').value;
    const complete = document.getElementById('editcomplete').checked;

    if (!title) {
        alert('Title is required!');
        return;
    }

    try {
        const response = await fetch(`${API_URL}${id}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title,
                description,
                complete
            }),
        });
        
        if (!response.ok) throw new Error('Failed to update todo');
        
        editModal.hide();
        fetchTodos(); // Refresh the todo list
    } catch (error) {
        console.error('Error updating todo:', error);
        alert('Failed to update todo. Please try again.');
    }
};

// Initialize the app
fetchTodos(); 