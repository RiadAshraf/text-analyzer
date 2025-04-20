let currentPage = 1;
const limit = 10; // Number of texts per page

async function checkAuthStatus() {
    try {
        const response = await fetch('/api/auth-status', { credentials: 'include' });
        if (!response.ok) {
            window.location.href = '/login.html'; // Redirect to login page if not authenticated
        }
    } catch (error) {
        console.error('Error checking authentication status:', error);
    }
}

// Call this function before fetching texts
checkAuthStatus();

// Fetch texts for the current page
async function fetchTexts(page) {
    try {
        const response = await fetch(`/api/texts-by-user?page=${page}&limit=${limit}`, {
            method: 'GET',
            credentials: 'include', // Include cookies for authentication
        });

        if (!response.ok) {
            const error = await response.json();
            alert(`Error: ${error.error}`);
            return;
        }

        const data = await response.json();
        displayTexts(data.texts);
        updatePaginationControls(data.currentPage, data.totalPages);
    } catch (error) {
        console.error('Error fetching texts:', error);
    }
}

// Display the texts in the container
function displayTexts(texts) {
    const container = document.getElementById('texts-container');
    container.innerHTML = ''; // Clear previous texts

    if (texts.length === 0) {
        container.innerHTML = '<p>No texts found.</p>'; // Display a message if no texts are found
        return;
    }

    texts.forEach((text) => {
        const textElement = document.createElement('div');
        textElement.className = 'text-item';
        textElement.innerHTML = `
            <p><strong>ID:</strong> ${text.id}</p>
            <p><strong>Content:</strong> ${text.content}</p>
            <div class="text-item-buttons">
                <button class="update-button" onclick="updateText(${text.id}, '${text.content}')">Update</button>
                <button class="delete-button" onclick="deleteText(${text.id})">Delete</button>
            </div>
        `;
        container.appendChild(textElement);
    });
}


// Update text function
function updateText(id, currentContent) {
    const newContent = prompt('Update the text:', currentContent);
    if (newContent === null || newContent.trim() === '') {
        alert('Update canceled or invalid input.');
        return;
    }

    fetch(`/api/texts/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newContent }),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Failed to update text.');
            }
            alert('Text updated successfully!');
            fetchTexts(currentPage); // Refresh the texts
        })
        .catch((error) => {
            console.error('Error updating text:', error);
            alert('An error occurred while updating the text.');
        });
}

// Delete text function
function deleteText(id) {
    if (!confirm('Are you sure you want to delete this text?')) {
        return;
    }

    fetch(`/api/texts/${id}`, {
        method: 'DELETE',
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Failed to delete text.');
            }
            alert('Text deleted successfully!');
            fetchTexts(currentPage); // Refresh the texts
        })
        .catch((error) => {
            console.error('Error deleting text:', error);
            alert('An error occurred while deleting the text.');
        });
}         

// Update pagination controls
function updatePaginationControls(current, total) {
    currentPage = current;
    document.getElementById('current-page').textContent = `Page ${current} of ${total}`;

    const prevButton = document.getElementById('prev-page');
    const nextButton = document.getElementById('next-page');

    prevButton.disabled = current === 1;
    nextButton.disabled = current === total;

    prevButton.onclick = () => fetchTexts(currentPage - 1);
    nextButton.onclick = () => fetchTexts(currentPage + 1);
}

// Fetch the first page on load
fetchTexts(currentPage);