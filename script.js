// Countdown Timer
const countdown = document.getElementById('countdown');
const daysSpan = document.getElementById('days');
const hoursSpan = document.getElementById('hours');
const minutesSpan = document.getElementById('minutes');
const secondsSpan = document.getElementById('seconds');

// Set the launch date (adjust this to your desired launch date for EchoPlex)
// Example: October 27, 2025 (as per your initial roadmap for token launch/marketplace)
// Month is 0-indexed (January is 0, December is 11)
const launchDate = new Date('October 27, 2025 00:00:00').getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const distance = launchDate - now;

    // Time calculations for days, hours, minutes and seconds
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Display the results in the elements
    daysSpan.innerHTML = String(days).padStart(2, '0');
    hoursSpan.innerHTML = String(hours).padStart(2, '0');
    minutesSpan.innerHTML = String(minutes).padStart(2, '0');
    secondsSpan.innerHTML = String(seconds).padStart(2, '0');

    // If the countdown is finished, write some text
    if (distance < 0) {
        clearInterval(countdownInterval);
        countdown.innerHTML = '<span class="launched-message">EchoPlex Has Launched!</span>';
    }
}

// Update the countdown every 1 second
const countdownInterval = setInterval(updateCountdown, 1000);

// Initial call to display immediately
updateCountdown();


// Form Submission Handling (using Formspree)
const subscribeForm = document.getElementById('subscribeForm');
const formMessage = document.getElementById('formMessage');

subscribeForm.addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the default form submission (page reload)

    const form = event.target;
    const formData = new FormData(form);
    const emailInput = form.querySelector('input[type="email"]');

    formMessage.textContent = ''; // Clear previous messages
    formMessage.classList.remove('success', 'error'); // Remove previous styling

    if (!emailInput.value) {
        formMessage.textContent = 'Please enter your email address.';
        formMessage.classList.add('error');
        return;
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value)) {
        formMessage.textContent = 'Please enter a valid email address.';
        formMessage.classList.add('error');
        return;
    }

    try {
        const response = await fetch(form.action, {
            method: form.method,
            body: formData,
            headers: {
                'Accept': 'application/json' // Essential for Formspree to return JSON
            }
        });

        if (response.ok) {
            formMessage.textContent = 'Thank you for subscribing! We\'ll keep you updated.';
            formMessage.classList.add('success');
            form.reset(); // Clear the form
        } else {
            const data = await response.json();
            if (data && data.errors) {
                formMessage.textContent = 'Error: ' + data.errors.map(e => e.message).join(', ');
            } else {
                formMessage.textContent = 'Oops! There was a problem submitting your form.';
            }
            formMessage.classList.add('error');
        }
    } catch (error) {
        console.error('Network or submission error:', error);
        formMessage.textContent = 'Could not connect to the server. Please try again later.';
        formMessage.classList.add('error');
    }
});
