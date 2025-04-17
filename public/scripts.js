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

// Check if the user is logged in
const checkAuthStatus = async () => {
    try {
        const response = await fetch('/api/auth-status'); // Create this endpoint in the backend
        if (response.ok) {
            const user = await response.json();
            console.log(`Logged in as: ${user.displayName}`);
            document.getElementById('login-button').style.display = 'none';
            document.getElementById('logout-button').style.display = 'block';
        } else {
            document.getElementById('login-button').style.display = 'block';
            document.getElementById('logout-button').style.display = 'none';
        }
    } catch (error) {
        console.error('Error checking auth status:', error);
    }
};

// Call the function on page load
checkAuthStatus();

// Analyze button logic
document.getElementById('analyze-button').addEventListener('click', async () => {
    const text = document.getElementById('text-area').value;

    if (!text.trim()) {
        alert('Please enter some text to analyze.');
        return;
    }

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