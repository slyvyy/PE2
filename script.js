document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (data.success) {
            // Redirect to localhost
            window.location.href = 'http://localhost:5176/';
        } else {
            alert(data.error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred during login');
    }
});
