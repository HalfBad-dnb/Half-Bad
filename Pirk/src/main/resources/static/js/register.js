// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    const responseMessage = document.getElementById('responseMessage'); // Div to show success/error message

    // Handle form submission
    registerForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent default form submission

        // Get form values
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const email = document.getElementById('email').value;

        // Validate form inputs
        if (!username || !password || !email) {
            responseMessage.textContent = 'Please fill out all fields.';
            responseMessage.style.color = 'red';
            return;
        }

        if (password.length < 6) {
            responseMessage.textContent = 'Password must be at least 6 characters long.';
            responseMessage.style.color = 'red';
            return;
        }

        // Prepare data for backend
        const data = {
            username: username,
            password: password,
            email: email
        };

        // Send the data to backend via POST request to port 8081
        fetch('http://localhost:8081/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json()) // Wait for the response to be converted to JSON
        .then(responseData => {
            // Handle successful response
            if (responseData.success) {
                responseMessage.textContent = 'Registration successful!';
                responseMessage.style.color = 'green';
                registerForm.reset(); // Optionally reset the form after successful registration
            } else {
                responseMessage.textContent = responseData.message || 'Registration failed.';
                responseMessage.style.color = 'red';
            }
        })
        .catch(error => {
            responseMessage.textContent = 'An error occurred during registration.';
            responseMessage.style.color = 'red';
            console.error('Error:', error);
        });
    });
});
