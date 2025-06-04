const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:8000/api/token/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) throw new Error('Login failed');

        const data = await response.json();
        // Save tokens to localStorage
        localStorage.setItem('access', data.access);
        localStorage.setItem('refresh', data.refresh);

        alert('Login successful!');
        // Optionally redirect
        // window.location.href = '/dashboard.html';

    } catch (err) {
        console.error('Login error:', err);
        alert('Invalid credentials');
    }
});
