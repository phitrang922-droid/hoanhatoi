const products = [
    {
        id: 1,
        name: "Hoa Hồng Đỏ",
        price: 35000,
        image: "images/roses_red_1766367916386.png",
        unit: "cành"
    },
    {
        id: 2,
        name: "Tulip Hồng",
        price: 45000,
        image: "images/tulips_pink_1766367933524.png",
        unit: "cành"
    },
    {
        id: 3,
        name: "Hoa Ly Trắng",
        price: 50000,
        image: "images/lilies_white_1766367953211.png",
        unit: "cành"
    },
    {
        id: 4,
        name: "Hướng Dương",
        price: 30000,
        image: "images/sunflowers_yellow_1766367977974.png",
        unit: "cành"
    },
    {
        id: 5,
        name: "Bó Hoa Mix",
        price: 550000,
        image: "images/mixed_bouquet_1766367995249.png",
        unit: "bó"
    }
];

const styles = [
    {
        id: 'round',
        name: 'Bó Tròn',
        price: 50000,
        description: 'Cổ điển & Sang trọng',
        image: 'images/round.png'
    },
    {
        id: 'handtied',
        name: 'Bó Tự Nhiên',
        price: 80000,
        description: 'Mộc mạc & Tinh tế',
        image: 'images/nature.png'
    },
    {
        id: 'cascade',
        name: 'Bó Thác Đổ',
        price: 100000,
        description: 'Lộng lẫy & Ấn tượng',
        image: 'images/cascade_bouquet.png'
    }
];



let cart = {};
let styleCart = {}; // Store quantity for each style

function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

function initProducts() {
    const grid = document.getElementById('flower-grid');
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="card-image">
            <div class="card-details">
                <h3 class="card-title">${product.name}</h3>
                <div class="card-price">${formatCurrency(product.price)} / ${product.unit}</div>
                <div class="quantity-controls">
                    <button class="qty-btn" onclick="updateQuantity(${product.id}, -1)">-</button>
                    <span class="qty-display" id="qty-${product.id}">0</span>
                    <button class="qty-btn" onclick="updateQuantity(${product.id}, 1)">+</button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function initStyles() {
    const grid = document.getElementById('style-grid');
    styles.forEach(style => {
        const card = document.createElement('div');
        card.className = 'style-card';
        card.id = `style-${style.id}`;

        // Show image if available, otherwise show emoji icon
        const iconHtml = style.image
            ? `<img src="${style.image}" alt="${style.name}" class="style-image">`
            : `<div class="style-icon">🎁</div>`;

        card.innerHTML = `
            ${iconHtml}
            <h3>${style.name}</h3>
            <p>${style.description}</p>
            <p style="margin-top:0.5rem; color:var(--primary-dark); margin-bottom:1rem;">+${formatCurrency(style.price)}</p>
            <div class="style-quantity-controls">
                <button class="style-qty-btn" onclick="event.stopPropagation(); updateStyleQuantity('${style.id}', -1)">-</button>
                <span class="style-qty-display" id="style-qty-${style.id}">0</span>
                <button class="style-qty-btn" onclick="event.stopPropagation(); updateStyleQuantity('${style.id}', 1)">+</button>
            </div>
        `;
        grid.appendChild(card);
    });
}



function updateQuantity(productId, change) {
    if (!cart[productId]) cart[productId] = 0;
    cart[productId] += change;
    if (cart[productId] < 0) cart[productId] = 0;

    document.getElementById(`qty-${productId}`).innerText = cart[productId];
    updateSummary();
}

function updateStyleQuantity(styleId, change) {
    if (!styleCart[styleId]) styleCart[styleId] = 0;
    styleCart[styleId] += change;
    if (styleCart[styleId] < 0) styleCart[styleId] = 0;

    document.getElementById(`style-qty-${styleId}`).innerText = styleCart[styleId];

    // Update selected state
    const styleCard = document.getElementById(`style-${styleId}`);
    if (styleCart[styleId] > 0) {
        styleCard.classList.add('selected');
    } else {
        styleCard.classList.remove('selected');
    }

    updateSummary();
}

function updateSummary() {
    let total = 0;
    let itemCount = 0;
    let itemsDescription = [];

    // Calculate flowers
    products.forEach(p => {
        const qty = cart[p.id] || 0;
        if (qty > 0) {
            total += p.price * qty;
            itemCount += qty;
            itemsDescription.push(`${qty} ${p.name}`);
        }
    });

    // Calculate styles
    let stylePrice = 0;
    let styleDescriptions = [];
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

    let styleName = styleDescriptions.length > 0
        ? styleDescriptions.join(', ')
        : 'Mặc định (Không gói)';
    total += stylePrice;

    // Update UI Elements
    const summaryPanel = document.getElementById('summary-panel');
    const selectedItemsEl = document.getElementById('selected-items');
    const selectedStyleEl = document.getElementById('selected-style');
    const totalPriceEl = document.getElementById('total-price');
    const cartCountEl = document.getElementById('cart-count');

    if (total > 0 || Object.keys(styleCart).some(id => styleCart[id] > 0)) {
        summaryPanel.classList.add('visible');
    } else {
        summaryPanel.classList.remove('visible');
    }

    selectedItemsEl.innerText = itemsDescription.length > 0 ? itemsDescription.join(', ') : 'Chưa chọn hoa';
    selectedStyleEl.innerText = `Kiểu gói: ${styleName}`;
    totalPriceEl.innerText = formatCurrency(total);
    cartCountEl.innerText = itemCount;

    // Save order data to localStorage for checkout page
    const orderData = {
        items: itemsDescription,
        style: styleName,
        total: total,
        cart: cart,
        styleCart: styleCart
    };
    localStorage.setItem('orderData', JSON.stringify(orderData));
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

        // Close menu when clicking on a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }
}

// Checkout function
function goToCheckout() {
    const orderData = JSON.parse(localStorage.getItem('orderData') || '{}');
    if (!orderData.total || orderData.total === 0) {
        alert('Vui lòng chọn ít nhất một sản phẩm trước khi đặt hàng!');
        return;
    }
    window.location.href = 'order.html';
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

    // Open login modal
    if (loginIcon) {
        loginIcon.addEventListener('click', () => {
            loginModal.classList.add('active');
        });
    }

    // Close login modal
    if (loginClose) {
        loginClose.addEventListener('click', () => {
            loginModal.classList.remove('active');
        });
    }

    // Switch to signup modal
    if (signupLink) {
        signupLink.addEventListener('click', (e) => {
            e.preventDefault();
            loginModal.classList.remove('active');
            signupModal.classList.add('active');
        });
    }

    // Switch to login modal
    if (loginLink) {
        loginLink.addEventListener('click', (e) => {
            e.preventDefault();
            signupModal.classList.remove('active');
            loginModal.classList.add('active');
        });
    }

    // Close signup modal
    if (signupClose) {
        signupClose.addEventListener('click', () => {
            signupModal.classList.remove('active');
        });
    }

    // Close modal when clicking outside
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

// Login Form Handler
function initLoginForm() {
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value;
            const remember = document.getElementById('remember-me').checked;

            // Validate
            if (!email || !password) {
                alert('Vui lòng điền đầy đủ thông tin!');
                return;
            }

            // Simulate login (in real app, this would call API)
            const userData = {
                email: email,
                loginTime: new Date().toISOString(),
                remember: remember
            };

            localStorage.setItem('userData', JSON.stringify(userData));
            localStorage.setItem('isLoggedIn', 'true');

            alert('Đăng nhập thành công!');
            document.getElementById('login-modal').classList.remove('active');

            // Update UI to show logged in state
            updateLoginUI();
        });
    }
}

// Signup Form Handler
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

            // Validate
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

            // Simulate signup (in real app, this would call API)
            const userData = {
                name: name,
                email: email,
                phone: phone,
                signupTime: new Date().toISOString()
            };

            localStorage.setItem('userData', JSON.stringify(userData));
            localStorage.setItem('isLoggedIn', 'true');

            alert('Đăng ký thành công! Bạn đã được đăng nhập tự động.');
            document.getElementById('signup-modal').classList.remove('active');

            // Update UI to show logged in state
            updateLoginUI();
        });
    }
}

// Update Login UI
function updateLoginUI() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const loginIcon = document.getElementById('login-icon');

    if (loginIcon) {
        if (isLoggedIn) {
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            loginIcon.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
            `;
            loginIcon.title = userData.name || userData.email || 'Tài khoản';
        } else {
            loginIcon.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                    <polyline points="10 17 15 12 10 7"></polyline>
                    <line x1="15" y1="12" x2="3" y2="12"></line>
                </svg>
            `;
            loginIcon.title = 'Đăng nhập';
        }
    }
}

// Load saved cart and style data
function loadSavedData() {
    const orderData = JSON.parse(localStorage.getItem('orderData') || '{}');

    // Restore cart
    if (orderData.cart) {
        cart = orderData.cart;
        products.forEach(product => {
            const qty = cart[product.id] || 0;
            const qtyDisplay = document.getElementById(`qty-${product.id}`);
            if (qtyDisplay) {
                qtyDisplay.innerText = qty;
            }
        });
    }

    // Restore style cart
    if (orderData.styleCart) {
        styleCart = orderData.styleCart;
        Object.keys(styleCart).forEach(styleId => {
            const qty = styleCart[styleId] || 0;
            const qtyDisplay = document.getElementById(`style-qty-${styleId}`);
            const styleCard = document.getElementById(`style-${styleId}`);
            if (qtyDisplay) {
                qtyDisplay.innerText = qty;
            }
            if (styleCard && qty > 0) {
                styleCard.classList.add('selected');
            }
        });
    }

    // Update summary
    updateSummary();
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initProducts();
    initStyles();

    loadSavedData(); // Load saved data after styles are initialized
    initMobileMenu();
    initLoginModal();
    initLoginForm();
    initSignupForm();
    updateLoginUI();

    // Add checkout button event listener
    const checkoutButton = document.querySelector('.checkout-button');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', goToCheckout);
    }
});
