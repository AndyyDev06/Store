document.addEventListener("DOMContentLoaded", function() {
    const productsLink = document.getElementById('products-link');
    const registerLink = document.getElementById('register-link');
    const loginLink = document.getElementById('login-link');
    const profileLink = document.getElementById('profile-link');
    const productSection = document.getElementById('product-list');
    const profilePage = document.getElementById('profile-page');
    const shoppingCartModal = document.getElementById('shopping-cart-modal');
    const closeCartModal = document.getElementById('close-cart-modal');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotal = document.getElementById('cart-total');
    const checkoutButton = document.getElementById('checkout-button');
    const logoutButton = document.getElementById('logout-button');
    const cartButton = document.getElementById('cart-button'); // Cart button in header

    const registrationModal = document.getElementById('registration-modal');
    const loginModal = document.getElementById('login-modal');
    const closeRegistrationModal = document.getElementById('close-registration-modal');
    const closeLoginModal = document.getElementById('close-login-modal');

    productsLink.addEventListener('click', () => showSection(productSection));
    registerLink.addEventListener('click', () => showModal(registrationModal));
    loginLink.addEventListener('click', () => showModal(loginModal));
    profileLink.addEventListener('click', () => showSection(profilePage));
    logoutButton.addEventListener('click', logoutUser);
    closeCartModal.addEventListener('click', () => hideModal(shoppingCartModal));

    closeRegistrationModal.addEventListener('click', () => hideModal(registrationModal));
    closeLoginModal.addEventListener('click', () => hideModal(loginModal));

    document.addEventListener('click', (event) => {
        if (event.target === registrationModal) {
            hideModal(registrationModal);
        } else if (event.target === loginModal) {
            hideModal(loginModal);
        } else if (event.target === shoppingCartModal) {
            hideModal(shoppingCartModal);
        }
    });

    document.getElementById('register').addEventListener('submit', registerUser);
    document.getElementById('login').addEventListener('submit', loginUser);

    loadProducts();

    function loadProducts() {
        fetch('data/products.json')
            .then(response => response.json())
            .then(products => displayProducts(products));
    }

    function displayProducts(products) {
        const productContainer = document.querySelector('.products');
        productContainer.innerHTML = '';
        products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.classList.add('product');

            productElement.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p>$${product.price.toFixed(2)}</p>
                <p>${product.availability}</p>
                <button class="add-to-cart-button" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}">Add to Cart</button>
            `;

            productElement.querySelector('.add-to-cart-button').addEventListener('click', () => {
                addToCart(product.id, product.name, product.price);
            });

            productContainer.appendChild(productElement);
        });
    }

    function showSection(section) {
        productSection.classList.add('hidden');
        profilePage.classList.add('hidden');
        shoppingCartModal.classList.add('hidden');

        section.classList.remove('hidden');
        section.classList.add('active');
    }

    function showModal(modal) {
        modal.style.display = 'flex';
    }

    function hideModal(modal) {
        modal.style.display = 'none';
    }

    function registerUser(event) {
        event.preventDefault();
        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;

        // Save user data to localStorage (for demo purposes)
        localStorage.setItem('user', JSON.stringify({ username, email, password }));

        alert('Registration successful! You can now log in.');
        hideModal(registrationModal);
        showModal(loginModal);
    }

    function loginUser(event) {
        event.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        const user = JSON.parse(localStorage.getItem('user'));

        if (user && user.email === email && user.password === password) {
            alert('Login successful!');
            showUserProfile(user);
            hideModal(loginModal);
        } else {
            alert('Invalid email or password.');
        }
    }

    function showUserProfile(user) {
        const profileInfo = document.getElementById('profile-info');
        profileInfo.innerText = `Username: ${user.username}\nEmail: ${user.email}`;
        showSection(profilePage);
    }

    function logoutUser() {
        alert('You have been logged out.');
        showSection(productSection);
    }

    let cart = [];

    function addToCart(id, name, price) {
        const existingCartItem = cart.find(item => item.id === id);
        if (existingCartItem) {
            existingCartItem.quantity++;
        } else {
            cart.push({ id, name, price, quantity: 1 });
        }
    }

    function updateCart() {
        cartItemsContainer.innerHTML = '';
        let total = 0;

        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');

            cartItem.innerHTML = `
                <img src="images/${item.id}.jpg" alt="${item.name}">
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)}</p>
                </div>
                <div class="item-quantity">
                    <button class="quantity-btn decrease-btn" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn increase-btn" data-id="${item.id}">+</button>
                </div>
                <div class="item-price">
                    $${(item.price * item.quantity).toFixed(2)}
                </div>
                <button class="remove-btn" data-id="${item.id}">Remove</button>
            `;

            cartItem.querySelector('.increase-btn').addEventListener('click', () => increaseQuantity(item.id));
            cartItem.querySelector('.decrease-btn').addEventListener('click', () => decreaseQuantity(item.id));
            cartItem.querySelector('.remove-btn').addEventListener('click', () => removeFromCart(item.id));

            cartItemsContainer.appendChild(cartItem);
            total += item.price * item.quantity;
        });

        cartTotal.textContent = `Total: $${total.toFixed(2)}`;
        showModal(shoppingCartModal);
    }

    function increaseQuantity(id) {
        const cartItem = cart.find(item => item.id === id);
        if (cartItem) {
            cartItem.quantity++;
            updateCart();
        }
    }

    function decreaseQuantity(id) {
        const cartItem = cart.find(item => item.id === id);
        if (cartItem && cartItem.quantity > 1) {
            cartItem.quantity--;
            updateCart();
        }
    }

    function removeFromCart(id) {
        const cartItemIndex = cart.findIndex(item => item.id === id);
        if (cartItemIndex !== -1) {
            cart.splice(cartItemIndex, 1);
            updateCart();
        }
    }

    function updateCart() {
        // Clear previous items
        cartItemsContainer.innerHTML = '';
    
        let total = 0;
    
        // Iterate through each item in the cart
        cart.forEach(item => {
            // Create a div element for each cart item
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
    
            // Construct the HTML for the cart item
            cartItem.innerHTML = `
                <div class="item-image">
                    <img src="images/${item.id}.jpg" alt="${item.name}">
                </div>
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p>Price: $${item.price.toFixed(2)}</p>
                </div>
                <div class="item-quantity">
                    <button class="quantity-btn decrease-btn" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn increase-btn" data-id="${item.id}">+</button>
                </div>
                <div class="item-price">
                    Total: $${(item.price * item.quantity).toFixed(2)}
                </div>
                <button class="remove-btn" data-id="${item.id}">Remove</button>
            `;
    
            // Add event listeners for quantity buttons and remove button
            cartItem.querySelector('.increase-btn').addEventListener('click', () => increaseQuantity(item.id));
            cartItem.querySelector('.decrease-btn').addEventListener('click', () => decreaseQuantity(item.id));
            cartItem.querySelector('.remove-btn').addEventListener('click', () => removeFromCart(item.id));
    
            // Append the cart item to the cartItemsContainer
            cartItemsContainer.appendChild(cartItem);
    
            // Update the total price
            total += item.price * item.quantity;
        });
    
        // Update the total price display
        cartTotal.textContent = `Total: $${total.toFixed(2)}`;
    
        // Show the shopping cart modal
        showModal(shoppingCartModal);
    }

// Payment!

// Example: Use Stripe.js for payment integration
const stripe = Stripe('YOUR_STRIPE_PUBLISHABLE_KEY');

// Handle form submission
const form = document.getElementById('checkout-form');

form.addEventListener('submit', async function(event) {
    event.preventDefault();

    try {
        // Gather customer information from the form
        const cardElement = elements.create('card');
        const { paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
        });

        // Send payment information to your backend server to process
        const response = await fetch('/process-payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                payment_method_id: paymentMethod.id,
                amount: calculateTotal(), // Implement this function to calculate total amount
                currency: 'USD',
            }),
        });

        if (response.ok) {
            // Payment successful, show confirmation to the user
            alert('Payment successful!');
            clearCart(); // Implement this function to clear the cart after successful payment
        } else {
            // Payment failed, handle error
            alert('Payment failed. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
});

    

    checkoutButton.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your cart is empty. Please add items before checking out.');
        } else {
            // Implement checkout process (payment, order placement, etc.)
            alert('Redirecting to checkout process.');
            // Placeholder for actual checkout integration
            cart = [];
            updateCart();
        }
    });

    cartButton.addEventListener('click', () => {
        updateCart(); // Update cart content before showing modal
    });

    // Example function to handle checkout redirection
function redirectToCheckout() {
    // Assuming you have a function to calculate total and prepare cart data
    const total = calculateTotal();
    const cartData = prepareCartData(); // Implement this function as needed

    // Store cart data in localStorage or sessionStorage if needed
    localStorage.setItem('cartData', JSON.stringify(cartData));

    // Redirect to checkout page
    window.location.href = 'checkout.html';
}

// Example function to calculate total amount
function calculateTotal() {
    let total = 0;
    cart.forEach(item => {
        total += item.price * item.quantity;
    });
    return total.toFixed(2);
}

// Example function to prepare cart data for checkout
function prepareCartData() {
    // Implement logic to format cart data as needed for checkout page
    return cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
    }));
}

// Event listener example for a "Proceed to Checkout" button
checkoutButton.addEventListener('click', redirectToCheckout);

});
