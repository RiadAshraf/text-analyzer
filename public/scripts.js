let isAuthenticated = false; // Default to false
let loggedInUserId = null; // Store the unique user ID

// Check if the user is logged in
const checkAuthStatus = async () => {
    try {
        const response = await fetch('/api/auth-status'); // Create this endpoint in the backend
        if (response.ok) {
            const user = await response.json();
            console.log(`Logged in as: ${user.displayName} ( ID: ${user.id})`);
            loggedInUserId = user.id; // Store the unique user ID
            document.getElementById('login-button').style.display = 'none';
            document.getElementById('logout-button').style.display = 'block';
            isAuthenticated = true; // User is logged in
        } else {
            document.getElementById('login-button').style.display = 'block';
            document.getElementById('logout-button').style.display = 'none';
            isAuthenticated = false; // User is not logged in
        }
    } catch (error) {
        console.error('Error checking auth status:', error);
        isAuthenticated = false; // User is not logged in
    }
};

const resetResults = () => {
    document.getElementById('word-count').textContent = '0';
    document.getElementById('character-count').textContent = '0';
    document.getElementById('sentence-count').textContent = '0';
    document.getElementById('paragraph-count').textContent = '0';
    document.getElementById('longest-word').textContent = 'N/A';
};


// Login button logic
document.getElementById('login-button').addEventListener('click', () => {
    // Redirect to the Google OAuth login route
    window.location.href = '/auth/google';
});

// Logout button logic
document.getElementById('logout-button').addEventListener('click', async () => {
    try {
        // Make a request to the logout route
        await fetch('/logout', { method: 'POST' });
        alert('Logged out successfully');
        location.reload(); // Reload the page after logout
    } catch (error) {
        console.error('Logout failed:', error);
        alert('An error occurred while logging out.');
    }
});

// Helper function to call an API and update the result
const callApi = async (endpoint, resultId) => {
    const text = document.getElementById('text-area').value;

    if (!text.trim()) {
        alert('Please enter some text to analyze.');
        return;
    }

    // Reset all results before making the API call
    resetResults();

    try {
        console.log(`Calling API: ${endpoint} with text: "${text}"`); // Debugging log
        
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: text }),
        });

        console.log(`Response status: ${response.status}`); // Debugging log

        if (!response.ok) {
            throw new Error(`Failed to fetch data from ${endpoint}`);
        }

        const data = await response.json();
        console.log(`Response data:`, data); // Debugging log

        document.getElementById(resultId).textContent = data.result || 'N/A';
    } catch (error) {
        console.error(`Error calling API ${endpoint}:`, error.message);
        alert('An error occurred while processing your request. Please try again later.');
    }
};


// Event listeners for individual buttons
document.getElementById('word-count-button').addEventListener('click', () => {
    if (!isAuthenticated) {
        alert('You are not logged in. Please log in first.');
        return; // Prevent further execution
    }
    callApi('/api/word-count', 'word-count');
});

document.getElementById('character-count-button').addEventListener('click', () => {
    if (!isAuthenticated) {
        alert('You are not logged in. Please log in first.');
        return; // Prevent further execution
    }
    callApi('/api/character-count', 'character-count');
});

document.getElementById('sentence-count-button').addEventListener('click', () => {
    if (!isAuthenticated) {
        alert('You are not logged in. Please log in first.');
        return;
    }
    callApi('/api/sentence-count', 'sentence-count');
});

document.getElementById('paragraph-count-button').addEventListener('click', () => {
    if (!isAuthenticated) {
        alert('You are not logged in. Please log in first.');
        return;
    }
    callApi('/api/paragraph-count', 'paragraph-count');
});

document.getElementById('longest-word-button').addEventListener('click', () => {
    if (!isAuthenticated) {
        alert('You are not logged in. Please log in first.');
        return;
    }
    callApi('/api/longest-word', 'longest-word');
});




// Call the function on page load
checkAuthStatus();

// Analyze button logic
document.getElementById('analyze-button').addEventListener('click', async () => {
    if (!isAuthenticated) {
        alert('You are not logged in. Please log in first.');
        return; // Prevent further execution
    }
    const text = document.getElementById('text-area').value;

    if (!text.trim()) {
        alert('Please enter some text to analyze.');
        return;
    }

    // Reset all results before making the API call
    resetResults();

    try {
        // Make the POST request to the backend
        const response = await fetch('/api/texts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: text, user: 'anonymous' }),
        });

        if (!response.ok) {
            throw new Error('Failed to analyze text');
        }

        // Parse the response
        const data = await response.json();

        // Update the results section with the analysis
        document.getElementById('analyzed-text').innerHTML = `<strong>Analyzed Text:</strong> ${text}`;
        document.getElementById('word-count').textContent = data.wordCount || '0';
        document.getElementById('character-count').textContent = data.characterCount || '0';
        document.getElementById('sentence-count').textContent = data.sentenceCount || '0';
        document.getElementById('paragraph-count').textContent = data.paragraphCount || '0';
        document.getElementById('longest-word').textContent = data.longestWord || 'N/A';

        // Optionally clear the text area
        document.getElementById('text-area').value = '';
    } catch (error) {
        console.error(`AnalyzeText: Error analyzing text - ${error.message}`);
        logger.error(`AnalyzeText: Error analyzing text - ${error.message}`);
        
        alert('An error occurred while analyzing the text. Try again later.');
    }
});

