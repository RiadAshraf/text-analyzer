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

// Delete text function
async function deleteText(id) {
    if (!confirm('Are you sure you want to delete this text?')) {
        return;
    }

    console.log('Deleting text with ID:', id);

    try {
        console.log('Sending DELETE request to server...');
        const response = await fetch(`/api/texts-by-user/${id}`, {
            method: 'DELETE',
            credentials: 'include', // Include cookies for authentication
        });

        console.log('Response status:', response.status);
        const responseBody = await response.text();
        console.log('Response body:', responseBody);
        if (response.status === 404) {
            alert('Text not found or already deleted.');
            return;
        }
        if (!response.ok) {
            throw new Error('Failed to delete text.');
        }

        alert('Text deleted successfully!');
        await fetchTexts(currentPage); // Refresh the texts
    } catch (error) {
        console.error('Error deleting text:', error);
        alert('An error occurred while deleting the text !!.');
    }
}

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
        
        // Create text content elements
        const idParagraph = document.createElement('p');
        idParagraph.innerHTML = `<strong>ID:</strong> ${text.id}`;
        
        const contentParagraph = document.createElement('p');
        contentParagraph.innerHTML = `<strong>Content:</strong> ${text.content}`;
        
        // Create buttons container
        const buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'text-item-buttons';
        
        // Create update button
        const updateButton = document.createElement('button');
        updateButton.className = 'update-button';
        updateButton.textContent = 'Update';
        updateButton.dataset.id = text.id;
        updateButton.dataset.content = text.content;
        updateButton.addEventListener('click', function() {
            updateText(this.dataset.id, this.dataset.content);
        });
        
        // Create delete button
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';
        deleteButton.textContent = 'Delete';
        deleteButton.dataset.id = text.id;
        deleteButton.addEventListener('click', function() {
            deleteText(this.dataset.id);
        });
        
        // Append buttons to button container
        buttonsDiv.appendChild(updateButton);
        buttonsDiv.appendChild(deleteButton);
        
        // Append all elements to text element
        textElement.appendChild(idParagraph);
        textElement.appendChild(contentParagraph);
        textElement.appendChild(buttonsDiv);
        
        // Append text element to container
        container.appendChild(textElement);
    });
}


// Update text function
async function updateText(id, currentContent) {
    const newContent = prompt('Update the text:', currentContent);
    if (newContent === null || newContent.trim() === '') {
        alert('Update canceled or invalid input.');
        return;
    }
    console.log('Updating text with ID:', id, 'to new content:', newContent);
    try {
        const response = await fetch(`/api/texts-by-user/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: newContent }),
        });

        if (!response.ok) {
            throw new Error('Failed to update text.');
        }
        alert('Text updated successfully!');
        await fetchTexts(currentPage); // Refresh the texts
    } catch (error) {
        console.error('Error updating text:', error);
        alert('An error occurred while updating the text.');
    }
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