// NOTE ON JSONPLACEHOLDER: 
// JSONPlaceholder is a mock API. It does not actually store created notes.
// For POST and DELETE, it returns successful responses but doesn't persist data.
// We handle this sensibly by updating the DOM manually upon successful API responses.

const API_URL = 'https://jsonplaceholder.typicode.com/posts';

const loadBtn = document.getElementById('load-btn');
const statusP = document.getElementById('status');
const notesList = document.getElementById('notes-list');
const noteForm = document.getElementById('note-form');
const titleInput = document.getElementById('title-input');
const bodyInput = document.getElementById('body-input');
const submitBtn = document.getElementById('submit-btn');

// --- Reusable Request Function ---
async function request(url, options = {}) {
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
}

// --- Render Function (using textContent to prevent XSS) ---
function renderNotes(notes) {
    while (notesList.firstChild) notesList.removeChild(notesList.firstChild);

    if (notes.length === 0) {
        const li = document.createElement('li');
        li.textContent = "No notes available.";
        li.style.color = "#777";
        notesList.appendChild(li);
        return;
    }

    notes.forEach(note => {
        const li = document.createElement('li');
        li.className = 'note-card';

        const contentDiv = document.createElement('div');
        contentDiv.className = 'note-content';

        const titleEl = document.createElement('h3');
        titleEl.textContent = note.title; // Safe insertion
        const bodyEl = document.createElement('p');
        bodyEl.textContent = note.body; // Safe insertion

        contentDiv.appendChild(titleEl);
        contentDiv.appendChild(bodyEl);

        // Delete Button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'delete-btn';
        deleteBtn.addEventListener('click', () => deleteNote(note.id, li));

        li.appendChild(contentDiv);
        li.appendChild(deleteBtn);
        notesList.appendChild(li);
    });
}

// --- GET (Load Notes) ---
async function loadNotes() {
    loadBtn.disabled = true;
    statusP.textContent = "Loading notes...";
    statusP.className = "";

    try {
        const notes = await request(`${API_URL}?limit=10`);
        renderNotes(notes);
        statusP.textContent = "Loaded 10 notes from the server.";
        statusP.className = "success";
    } catch (error) {
        console.error(error);
        statusP.textContent = "Failed to load notes. Please try again.";
        statusP.className = "error";
    } finally {
        loadBtn.disabled = false;
    }
}

// --- POST (Create Note) ---
noteForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const title = titleInput.value.trim();
    const body = bodyInput.value.trim();

    // Validation
    if (!title) {
        statusP.textContent = "Validation Error: Title is required.";
        statusP.className = "error";
        return;
    }
    if (title.length > 100) {
        statusP.textContent = "Validation Error: Title must be 100 characters or less.";
        statusP.className = "error";
        return;
    }

    submitBtn.disabled = true;
    statusP.textContent = "Creating note...";
    statusP.className = "";

    try {
        const newNote = await request(API_URL, {
            method: 'POST',
            body: JSON.stringify({ title, body, userId: 1 }),
            headers: { 'Content-type': 'application/json; charset=UTF-8' }
        });

        // Since the mock API doesn't save, we add it to the DOM manually
        const noteWithId = { ...newNote, id: newNote.id || Date.now() };
        
        // Render the new note at the top of the list
        const currentNotes = Array.from(notesList.children).map(li => {
            return { title: li.querySelector('h3')?.textContent || '', body: li.querySelector('p')?.textContent || '', id: Date.now() };
        });
        
        renderNotes([noteWithId, ...currentNotes]);
        
        statusP.textContent = `Note created (status 201, id ${noteWithId.id}).`;
        statusP.className = "success";
        noteForm.reset();
    } catch (error) {
        console.error(error);
        statusP.textContent = "Failed to create note.";
        statusP.className = "error";
    } finally {
        submitBtn.disabled = false;
    }
});

// --- DELETE (Delete Note) ---
async function deleteNote(id, liElement) {
    try {
        await request(`${API_URL}/${id}`, { method: 'DELETE' });
        
        // Because JSONPlaceholder doesn't actually delete, we remove it from the DOM
        liElement.remove();
        statusP.textContent = `Note ${id} deleted successfully (status 200).`;
        statusP.className = "success";
        
        // Check if list is empty
        if (notesList.children.length === 0) {
            renderNotes([]);
        }
    } catch (error) {
        console.error(error);
        statusP.textContent = "Failed to delete note.";
        statusP.className = "error";
    }
}

// Initialize
loadBtn.addEventListener('click', loadNotes);
