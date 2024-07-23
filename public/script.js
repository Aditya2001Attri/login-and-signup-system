document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const logoutBtn = document.getElementById('logoutBtn');
    const welcome = document.getElementById('welcome');
    const userInfo = document.getElementById('userInfo');
    const authButtons = document.getElementById('authButtons');

    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
        fetchUserInfo(token);
    }

    // Handle login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });

                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem('token', data.token);
                    window.location.href = '/';
                } else {
                    alert(data.msg);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    }

    // Handle signup form submission
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('/api/auth/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, email, password }),
                });

                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem('token', data.token);
                    window.location.href = '/';
                } else {
                    alert(data.msg);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    }

    // Handle logout button click
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('token');
            window.location.reload();
        });
    }

    // Fetch user info for authenticated users
    async function fetchUserInfo(token) {
        try {
            const response = await fetch('/api/auth/me', {
                headers: {
                    'x-auth-token': token
                }
            });
            const user = await response.json();
            if (response.ok) {
                welcome.textContent = `Welcome, ${user.username}!`;
                userInfo.textContent = `Email: ${user.email}`;
                logoutBtn.style.display = 'block';
                if (authButtons) authButtons.style.display = 'none';
            } else {
                throw new Error(user.msg);
            }
        } catch (error) {
            console.error('Error:', error);
            localStorage.removeItem('token');
        }
    }
});
