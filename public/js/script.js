

// Shared utility functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showError(input, message) {
    // Remove any existing error message
    const existingError = input.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Create error message element
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.style.color = 'var(--error)';
    errorElement.style.fontSize = '0.8rem';
    errorElement.style.marginTop = '0.25rem';
    errorElement.textContent = message;
    
    // Insert error message after the input
    input.parentElement.appendChild(errorElement);
    
    // Highlight the input field
    input.style.borderColor = 'var(--error)';
}

function clearError(input) {
    const existingError = input.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    input.style.borderColor = 'var(--accent-color)';
}

function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
        // If already logged in, redirect to home page
        window.location.href = 'index.html';
    }
}

// Login page functionality
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on the login page
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');

        // Form submission handler
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let isValid = true;
            
            // Clear previous error messages
            clearError(emailInput);
            clearError(passwordInput);
            
            // Email validation
            if (!emailInput.value.trim()) {
                showError(emailInput, 'Email is required');
                isValid = false;
            } else if (!isValidEmail(emailInput.value.trim())) {
                showError(emailInput, 'Please enter a valid email address');
                isValid = false;
            }
            
            // Password validation
            if (!passwordInput.value) {
                showError(passwordInput, 'Password is required');
                isValid = false;
            } else if (passwordInput.value.length < 6) {
                showError(passwordInput, 'Password must be at least 6 characters');
                isValid = false;
            }
            
            // If form is valid, proceed with login
            if (isValid) {
                // Store login status in localStorage
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userEmail', emailInput.value.trim());
                
                // Redirect to home page after successful login
                window.location.href = 'index.html';
            }
        });

        // Handle signup button
        const signupButton = document.getElementById('signup-redirect');
        if (signupButton) {
            signupButton.addEventListener('click', () => {
                window.location.href = 'signup.html';
            });
        }

        // Handle "Forgot password" link
        const forgotPasswordLink = document.querySelector('.forgot-password a');
        if (forgotPasswordLink) {
            forgotPasswordLink.addEventListener('click', (e) => {
                e.preventDefault();
                alert('Password reset functionality would go here');
            });
        }
        
        // Check login status when page loads
        checkLoginStatus();
    }

    // Signup page functionality
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        const fullnameInput = document.getElementById('fullname');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirm-password');
        const termsCheckbox = document.getElementById('terms');

   
        document.head.appendChild(style);

        // Form submission handler
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let isValid = true;
            
            // Clear previous error messages
            clearError(fullnameInput);
            clearError(emailInput);
            clearError(passwordInput);
            clearError(confirmPasswordInput);
            
            // Full name validation
            if (!fullnameInput.value.trim()) {
                showError(fullnameInput, 'Full name is required');
                isValid = false;
            }
            
            // Email validation
            if (!emailInput.value.trim()) {
                showError(emailInput, 'Email is required');
                isValid = false;
            } else if (!isValidEmail(emailInput.value.trim())) {
                showError(emailInput, 'Please enter a valid email address');
                isValid = false;
            }
            
            // Password validation
            if (!passwordInput.value) {
                showError(passwordInput, 'Password is required');
                isValid = false;
            } else if (passwordInput.value.length < 6) {
                showError(passwordInput, 'Password must be at least 6 characters');
                isValid = false;
            }
            
            // Confirm password validation
            if (passwordInput.value !== confirmPasswordInput.value) {
                showError(confirmPasswordInput, 'Passwords do not match');
                isValid = false;
            }
            
            // Terms checkbox validation
            if (!termsCheckbox.checked) {
                showError(termsCheckbox, 'You must agree to the Terms of Service');
                isValid = false;
            }
            
            // If form is valid, proceed with signup
            if (isValid) {
                // Store user data in localStorage
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userEmail', emailInput.value.trim());
                localStorage.setItem('userName', fullnameInput.value.trim());
                
                // Redirect to home page after successful signup
                window.location.href = 'index.html';
            }
        });

        // Handle login redirect button
        const loginRedirectButton = document.getElementById('login-redirect');
        if (loginRedirectButton) {
            loginRedirectButton.addEventListener('click', () => {
                window.location.href = 'login.html';
            });
        }
        
        // Check login status when page loads
        checkLoginStatus();
    }


});

//product carousel functionality

const imageUrls = [
    "https://images.unsplash.com/photo-1605773527852-c546a8584ea3?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=2067&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/flagged/photo-1561023367-4431103a484f?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1698671497722-fd2dd2b2316d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Y29tcHV0ZXIlMjBtb3VzZXxlbnwwfDB8MHx8fDA%3D",
    "https://images.unsplash.com/photo-1527814050087-3793815479db?q=80&w=1928&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    ];

    let currentIndex = 0;
    const mainImage = document.getElementById("mainImage");
    const thumbContainer = document.getElementById("thumbContainer");

    function renderThumbnails() {
        thumbContainer.innerHTML = '';
        imageUrls.forEach((url, index) => {
    const thumb = document.createElement("img");
    thumb.src = url;
    thumb.style.width = "60px";
    thumb.style.height = "45px";
if (index === currentIndex) {
  thumb.classList.add("active");

  // Scroll active thumbnail into view
  setTimeout(() => {
    thumb.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, 0);
}

thumb.onclick = () => {
  currentIndex = index;
  updateCarousel();
  resetAutoScroll(); 
};

thumbContainer.appendChild(thumb);
});
}

    function updateCarousel() {
    mainImage.src = imageUrls[currentIndex];
    renderThumbnails();
    }

    function prevImage() {
    currentIndex = (currentIndex - 1 + imageUrls.length) % imageUrls.length;
    updateCarousel();
    }

    function nextImage() {
    currentIndex = (currentIndex + 1) % imageUrls.length;
    updateCarousel();
    }

    updateCarousel();