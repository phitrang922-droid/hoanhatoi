// Products data (same as main page)
const products = [
    {
        id: 1,
        name: "Hoa Hồng Đỏ",
        price: 35000,
        unit: "cành"
    },
    {
        id: 2,
        name: "Tulip Hồng",
        price: 45000,
        unit: "cành"
    },
    {
        id: 3,
        name: "Hoa Ly Trắng",
        price: 50000,
        unit: "cành"
    },
    {
        id: 4,
        name: "Hướng Dương",
        price: 30000,
        unit: "cành"
    },
    {
        id: 5,
        name: "Bó Hoa Mix",
        price: 550000,
        unit: "bó"
    }
];

const styles = [
    {
        id: 'round',
        name: 'Bó Tròn',
        price: 50000
    },
    {
        id: 'handtied',
        name: 'Bó Tự Nhiên',
        price: 80000
    },
    {
        id: 'cascade',
        name: 'Bó Thác Đổ',
        price: 100000
    }
];

function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

// Load and display order data
function loadOrderData() {
    const orderData = JSON.parse(localStorage.getItem('orderData') || '{}');
    
    if (!orderData.cart || Object.keys(orderData.cart).length === 0) {
        // Show empty state
        const orderItemsList = document.getElementById('order-items-list');
        orderItemsList.innerHTML = `
            <div class="empty-order">
                <h3>Chưa có sản phẩm nào trong đơn hàng</h3>
                <p>Vui lòng quay lại trang chủ để chọn sản phẩm</p>
                <a href="index.html">Mua sắm ngay</a>
            </div>
        `;
        return;
    }
    
    // Display order items
    const orderItemsList = document.getElementById('order-items-list');
    orderItemsList.innerHTML = '';
    
    let subtotal = 0;
    const cart = orderData.cart || {};
    
    products.forEach(product => {
        const qty = cart[product.id] || 0;
        if (qty > 0) {
            const itemTotal = product.price * qty;
            subtotal += itemTotal;
            
            const itemDiv = document.createElement('div');
            itemDiv.className = 'order-item';
            itemDiv.innerHTML = `
                <div class="order-item-info">
                    <div class="order-item-name">${product.name}</div>
                    <div class="order-item-details">${qty} ${product.unit} × ${formatCurrency(product.price)}</div>
                </div>
                <div class="order-item-price">${formatCurrency(itemTotal)}</div>
            `;
            orderItemsList.appendChild(itemDiv);
        }
    });
    
    // Display style prices
    let stylePrice = 0;
    let styleDescriptions = [];
    const styleCart = orderData.styleCart || {};
    
    Object.keys(styleCart).forEach(styleId => {
        const qty = styleCart[styleId] || 0;
        if (qty > 0) {
            const style = styles.find(s => s.id === styleId);
            if (style) {
                stylePrice += style.price * qty;
                styleDescriptions.push(`${qty}x ${style.name}`);
            }
        }
    });
    
    // Update totals
    document.getElementById('subtotal').textContent = formatCurrency(subtotal);
    document.getElementById('style-price').textContent = formatCurrency(stylePrice);
    document.getElementById('final-total').textContent = formatCurrency(subtotal + stylePrice);
}

// Mobile Menu Toggle
function initMobileMenu() {
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const navLinks = document.getElementById('nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }
}

// Order Form Handler
function initOrderForm() {
    const form = document.getElementById('order-form');
    const messageDiv = document.getElementById('form-message');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get order data
            const orderData = JSON.parse(localStorage.getItem('orderData') || '{}');
            
            if (!orderData.cart || Object.keys(orderData.cart).length === 0) {
                showMessage('Vui lòng chọn sản phẩm trước khi đặt hàng!', 'error');
                return;
            }
            
            // Get form data
            const formData = {
                customerName: document.getElementById('customer-name').value.trim(),
                customerPhone: document.getElementById('customer-phone').value.trim(),
                customerEmail: document.getElementById('customer-email').value.trim(),
                deliveryAddress: document.getElementById('delivery-address').value.trim(),
                deliveryDistrict: document.getElementById('delivery-district').value.trim(),
                deliveryCity: document.getElementById('delivery-city').value.trim(),
                orderNote: document.getElementById('order-note').value.trim()
            };
            
            // Validate form
            if (!formData.customerName || !formData.customerPhone || !formData.customerEmail || 
                !formData.deliveryAddress || !formData.deliveryDistrict || !formData.deliveryCity) {
                showMessage('Vui lòng điền đầy đủ thông tin bắt buộc!', 'error');
                return;
            }
            
            // Validate email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.customerEmail)) {
                showMessage('Email không hợp lệ. Vui lòng kiểm tra lại.', 'error');
                return;
            }
            
            // Validate phone (basic)
            const phoneRegex = /^[0-9]{10,11}$/;
            const cleanPhone = formData.customerPhone.replace(/\s/g, '');
            if (!phoneRegex.test(cleanPhone)) {
                showMessage('Số điện thoại không hợp lệ. Vui lòng nhập 10-11 chữ số.', 'error');
                return;
            }
            
            // Calculate final total
            let subtotal = 0;
            const cart = orderData.cart || {};
            products.forEach(product => {
                const qty = cart[product.id] || 0;
                if (qty > 0) {
                    subtotal += product.price * qty;
                }
            });
            
            let stylePrice = 0;
            if (orderData.currentStyle) {
                const style = styles.find(s => s.id === orderData.currentStyle);
                if (style) {
                    stylePrice = style.price;
                }
            }
            const finalTotal = subtotal + stylePrice;
            
            // Save complete order
            const orderId = 'ORD-' + Date.now();
            const completeOrder = {
                ...orderData,
                customerInfo: formData,
                orderDate: new Date().toISOString(),
                orderId: orderId
            };
            
            localStorage.setItem('lastOrder', JSON.stringify(completeOrder));
            
            // Show success modal
            showSuccessModal(orderId, finalTotal);
            
            // Clear cart after showing modal
            localStorage.removeItem('orderData');
        });
    }
}

function showMessage(text, type) {
    const messageDiv = document.getElementById('form-message');
    if (messageDiv) {
        messageDiv.textContent = text;
        messageDiv.className = `form-message ${type}`;
    }
}

function showSuccessModal(orderId, total) {
    const modal = document.getElementById('success-modal');
    const orderIdElement = document.getElementById('success-order-id');
    const totalElement = document.getElementById('success-total');
    const closeButton = document.getElementById('success-close-button');
    
    if (modal && orderIdElement && totalElement) {
        orderIdElement.textContent = orderId;
        totalElement.textContent = formatCurrency(total);
        modal.classList.add('active');
        
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
        
        // Close button handler
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                modal.classList.remove('active');
                document.body.style.overflow = '';
                window.location.href = 'index.html';
            });
        }
        
        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
                window.location.href = 'index.html';
            }
        });
    }
}

// Login Modal Functions
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

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadOrderData();
    initMobileMenu();
    initOrderForm();
    initLoginModal();
    initLoginForm();
    initSignupForm();
});

