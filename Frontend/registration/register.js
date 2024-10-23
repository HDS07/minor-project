document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Get form values
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Clear previous errors
    document.getElementById('emailExistsMessage').style.display = 'none';
    document.getElementById('emailError').style.display = 'none';
    document.getElementById('passwordError').style.display = 'none';

    // Regular expression to check for letters and numbers only
    const usernamePattern = /^[a-zA-Z0-9]+$/;

    // Username validation
    if (!username) {
        alert('Username is required');
        return;
    }
    if (!usernamePattern.test(username)) {
        alert('Username must contain only letters and numbers');
        return;
    }

    // Check if email is already registered (dummy check, replace with actual server-side check)
    const registeredEmails = ['test@example.com', 'user@example.com']; // Example registered emails
    if (registeredEmails.includes(email)) {
        document.getElementById('emailExistsMessage').style.display = 'block';
        document.getElementById('emailError').style.display = 'block';
        return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
        document.getElementById('passwordError').style.display = 'block';
        return;
    }

    // If all checks pass, you can proceed with form submission or further processing
    alert('Registration successful!');
});
