// Mobile Menu Toggle (same as main page)
function initMobileMenu() {
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const navLinks = document.getElementById('nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }
}

// Contact Form Handler
function initContactForm() {
    const form = document.getElementById('contact-form');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value.trim()
            };
            
            // Validate form
            if (!formData.name || !formData.email || !formData.subject || !formData.message) {
                showMessage('Vui lòng điền đầy đủ các trường bắt buộc.', 'error');
                return;
            }
            
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                showMessage('Email không hợp lệ. Vui lòng kiểm tra lại.', 'error');
                return;
            }
            
            // Simulate form submission (in real app, this would send to server)
            showMessage('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.', 'success');
            
            // Reset form after 2 seconds
            setTimeout(() => {
                form.reset();
                hideMessage();
            }, 3000);
        });
    }
}

// Show message function
function showMessage(text, type) {
    // Remove existing messages
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.textContent = text;
    
    // Insert before form
    const form = document.getElementById('contact-form');
    if (form) {
        form.parentNode.insertBefore(messageDiv, form);
    }
}

// Hide message function
function hideMessage() {
    const message = document.querySelector('.form-message');
    if (message) {
        message.remove();
    }
}

// Login Modal Functions (same as main page)
function initLoginModal() {
    const loginIcon = document.getElementById('login-icon');
    const loginModal = document.getElementById('login-modal');
    const loginClose = document.getElementById('login-close');
    const signupModal = document.getElementById('signup-modal');
    const signupClose = document.getElementById('signup-close');
    const signupLink = document.getElementById('signup-link');
    const loginLink = document.getElementById('login-link');
    
    if (loginIcon) {
        loginIcon.addEventListener('click', () => {
            loginModal.classList.add('active');
        });
    }
    
    if (loginClose) {
        loginClose.addEventListener('click', () => {
            loginModal.classList.remove('active');
        });
    }
    
    if (signupLink) {
        signupLink.addEventListener('click', (e) => {
            e.preventDefault();
            loginModal.classList.remove('active');
            signupModal.classList.add('active');
        });
    }
    
    if (loginLink) {
        loginLink.addEventListener('click', (e) => {
            e.preventDefault();
            signupModal.classList.remove('active');
            loginModal.classList.add('active');
        });
    }
    
    if (signupClose) {
        signupClose.addEventListener('click', () => {
            signupModal.classList.remove('active');
        });
    }
    
    if (loginModal) {
        loginModal.addEventListener('click', (e) => {
            if (e.target === loginModal) {
                loginModal.classList.remove('active');
            }
        });
    }
    
    if (signupModal) {
        signupModal.addEventListener('click', (e) => {
            if (e.target === signupModal) {
                signupModal.classList.remove('active');
            }
        });
    }
}

function initLoginForm() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value;
            if (!email || !password) {
                alert('Vui lòng điền đầy đủ thông tin!');
                return;
            }
            localStorage.setItem('userData', JSON.stringify({ email: email }));
            localStorage.setItem('isLoggedIn', 'true');
            alert('Đăng nhập thành công!');
            document.getElementById('login-modal').classList.remove('active');
        });
    }
}

function initSignupForm() {
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('signup-name').value.trim();
            const email = document.getElementById('signup-email').value.trim();
            const phone = document.getElementById('signup-phone').value.trim();
            const password = document.getElementById('signup-password').value;
            const confirmPassword = document.getElementById('signup-confirm-password').value;
            
            if (!name || !email || !phone || !password || !confirmPassword) {
                alert('Vui lòng điền đầy đủ thông tin!');
                return;
            }
            
            if (password.length < 6) {
                alert('Mật khẩu phải có ít nhất 6 ký tự!');
                return;
            }
            
            if (password !== confirmPassword) {
                alert('Mật khẩu xác nhận không khớp!');
                return;
            }
            
            localStorage.setItem('userData', JSON.stringify({ name, email, phone }));
            localStorage.setItem('isLoggedIn', 'true');
            alert('Đăng ký thành công!');
            document.getElementById('signup-modal').classList.remove('active');
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initContactForm();
    initLoginModal();
    initLoginForm();
    initSignupForm();
});

