document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginButton = document.getElementById('loginButton');

    // Add a hover effect to the login button
    loginButton.addEventListener('mouseover', () => {
        loginButton.style.backgroundColor = '#4caf50'; // Green background
        loginButton.style.color = 'white'; // White text
    });

    loginButton.addEventListener('mouseout', () => {
        loginButton.style.backgroundColor = ''; // Reset to default
        loginButton.style.color = ''; // Reset to default
    });

    // Validate form inputs before submission
    loginForm.addEventListener('submit', (e) => {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (!username || !password) {
            alert('Both fields are required!');
            e.preventDefault(); // Prevent form submission
        } else {
            // Optionally, handle form submission with custom logic here
            console.log(`Username: ${username}, Password: ${password}`);
        }
    });
});
