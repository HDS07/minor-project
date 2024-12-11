document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) {
        console.error('Login form not found!');
        return;
    }

    loginForm.addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent default form submission
        console.log("Form submission prevented");

        const email = document.getElementById('email')?.value;
        const password = document.getElementById('password')?.value;

        if (!email || !password) {
            alert("Please enter both email and password.");
            return;
        }

        const formData = { email, password };
        console.log("Form data collected:", formData);

        const submitButton = document.querySelector('button[type="submit"]');
        if (submitButton) submitButton.disabled = true;

        try {
            // Login API call
            const loginResponse = await fetch('/api/v1/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!loginResponse.ok) {
                throw new Error(`Login failed: ${loginResponse.statusText}`);
            }

            const loginResult = await loginResponse.json();
            console.log("Login response received:", loginResult);

            // Run Java application API call using AJAX
            $.ajax({
                url: '/api/v1/users/run-java',
                method: 'POST',
                dataType: 'json',
                success: function (data) {
                    console.log("Run Java response received:", data);
                    // Redirect to the dashboard
                    window.location.href = '/api/v1/users/dashboard';
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.error('Java application error:', errorThrown);
                    alert(`Java application error: ${errorThrown}`);
                }
            });
        } catch (error) {
            console.error('Error:', error);
            alert(`Error: ${error.message}`);
        } finally {
            if (submitButton) submitButton.disabled = false;
        }
    });
});