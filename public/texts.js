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
        `;
        container.appendChild(textElement);
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