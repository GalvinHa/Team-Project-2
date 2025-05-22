document.addEventListener('DOMContentLoaded', () => {
  // Get cart elements
  const cartContentEl = document.getElementById('cart-content');
  const cartSummaryEl = document.getElementById('cart-summary');
  
  // Get cart from localStorage
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  
  // Check if cart is empty
  if (cart.length === 0) {
    displayEmptyCart(cartContentEl, cartSummaryEl);
    return;
  }
  
  // Fetch products to get the latest data
  fetch('/data/data.json')
    .then(response => response.json())
    .then(products => {
      // Map cart items to product data
      const cartItems = cart.map(item => {
        const product = products.find(p => p.id === item.id);
        return {
          ...item,
          // Use stored data but get fresh image from products data
          image: product ? product.mainImage : item.image
        };
      });
      
      // Render cart
      displayCartItems(cartContentEl, cartItems);
      displayCartSummary(cartSummaryEl, cartItems);
    })
    .catch(error => {
      console.error("Error loading products:", error);
      
      // Fallback to using the data in localStorage only
      displayCartItems(cartContentEl, cart);
      displayCartSummary(cartSummaryEl, cart);
    });
});

function displayEmptyCart(contentEl, summaryEl) {
  contentEl.innerHTML = `
    <div class="empty-cart">
      <div class="empty-cart-icon">🛒</div>
      <h2>Your cart is empty</h2>
      <p>Looks like you haven't added any products to your cart yet.</p>
      <a href="store.html" class="continue-shopping-btn">Continue Shopping</a>
    </div>
  `;
  
  summaryEl.innerHTML = '';
}

function displayCartItems(contentEl, cartItems) {
  let cartHTML = `
    <div class="cart-header">
      <div class="cart-header-product">Product</div>
      <div class="cart-header-price">Price</div>
      <div class="cart-header-quantity">Quantity</div>
      <div class="cart-header-total">Total</div>
    </div>
    <div class="cart-items">
  `;
  
  cartItems.forEach(item => {
    cartHTML += `
      <div class="cart-item" data-id="${item.id}" data-option="${item.option || ''}">
        <div class="cart-item-product">
          <img src="${item.image}" alt="${item.name}">
          <div class="cart-item-details">
            <h3>${item.name}</h3>
            ${item.option ? `<p class="cart-item-option">Option: ${item.option}</p>` : ''}
          </div>
        </div>
        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
        <div class="cart-item-quantity">
          <button class="quantity-btn decrease">-</button>
          <input type="number" value="${item.quantity}" min="1" max="99" class="quantity-input" readonly>
          <button class="quantity-btn increase">+</button>
        </div>
        <div class="cart-item-total">$${(item.price * item.quantity).toFixed(2)}</div>
        <button class="remove-item-btn">×</button>
      </div>
    `;
  });
  
  cartHTML += `
    </div>
    <div class="cart-actions">
      <a href="store.html" class="continue-shopping-btn">Continue Shopping</a>
      <button class="clear-cart-btn">Clear Cart</button>
    </div>
  `;
  
  contentEl.innerHTML = cartHTML;
  
  // Add event listeners for quantity buttons
  const decreaseButtons = document.querySelectorAll('.quantity-btn.decrease');
  const increaseButtons = document.querySelectorAll('.quantity-btn.increase');
  const removeButtons = document.querySelectorAll('.remove-item-btn');
  const clearCartButton = document.querySelector('.clear-cart-btn');
  
  decreaseButtons.forEach(button => {
    button.addEventListener('click', handleDecreaseQuantity);
  });
  
  increaseButtons.forEach(button => {
    button.addEventListener('click', handleIncreaseQuantity);
  });
  
  removeButtons.forEach(button => {
    button.addEventListener('click', handleRemoveItem);
  });
  
  if (clearCartButton) {
    clearCartButton.addEventListener('click', handleClearCart);
  }
}

function displayCartSummary(summaryEl, cartItems) {
  // Calculate totals
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08; // Assuming 8% tax rate
  const shipping = subtotal > 100 ? 0 : 10.99; // Free shipping over $100
  const total = subtotal + tax + shipping;
  
  const summaryHTML = `
    <h2>Order Summary</h2>
    <div class="summary-row">
      <span>Subtotal</span>
      <span>$${subtotal.toFixed(2)}</span>
    </div>
    <div class="summary-row">
      <span>Tax (8%)</span>
      <span>$${tax.toFixed(2)}</span>
    </div>
    <div class="summary-row">
      <span>Shipping</span>
      <span>${shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
    </div>
    <div class="summary-row total">
      <span>Total</span>
      <span>$${total.toFixed(2)}</span>
    </div>
    <div class="promo-code">
      <input type="text" placeholder="Promo Code">
      <button>Apply</button>
    </div>
    <button class="checkout-btn">Proceed to Checkout</button>
  `;
  
  summaryEl.innerHTML = summaryHTML;


  // Add event listener for checkout button
  const checkoutButton = summaryEl.querySelector('.checkout-btn');
  if (checkoutButton) {
    checkoutButton.addEventListener('click', () => {
      alert('Checkout functionality would be implemented here(cart.js)');
    });
  }
}



function handleDecreaseQuantity(e) {
  const item = e.target.closest('.cart-item');
  const quantityInput = item.querySelector('.quantity-input');
  const currentQuantity = parseInt(quantityInput.value);
  
  if (currentQuantity > 1) {
    quantityInput.value = currentQuantity - 1;
    updateCartItem(item, currentQuantity - 1);
  }
}

function handleIncreaseQuantity(e) {
  const item = e.target.closest('.cart-item');
  const quantityInput = item.querySelector('.quantity-input');
  const currentQuantity = parseInt(quantityInput.value);
  
  if (currentQuantity < 99) {
    quantityInput.value = currentQuantity + 1;
    updateCartItem(item, currentQuantity + 1);
  }
}

function handleRemoveItem(e) {
  const item = e.target.closest('.cart-item');
  const productId = parseInt(item.dataset.id);
  const option = item.dataset.option;
  
  // Get current cart
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  
  // Filter out the item to remove
  const updatedCart = cart.filter(cartItem => {
    if (cartItem.id === productId) {
      // If there's an option, check that too
      if (option && cartItem.option) {
        return cartItem.option !== option;
      }
      // No option, just check the ID
      return false;
    }
    return true;
  });
  
  // Save updated cart
  localStorage.setItem('cart', JSON.stringify(updatedCart));
  
  // Animation for removing item
  item.style.opacity = '0';
  item.style.transform = 'translateX(30px)';
  
  setTimeout(() => {
    // Remove item from DOM
    item.remove();
    
    // Check if cart is now empty
    if (updatedCart.length === 0) {
      window.location.reload(); // Refresh to show empty cart
    } else {
      // Update cart summary
      updateCartSummary();
    }
  }, 300);
}

function handleClearCart() {
  // Confirm before clearing
  if (confirm('Are you sure you want to clear your cart?')) {
    // Clear cart in localStorage
    localStorage.removeItem('cart');
    
    // Refresh page to show empty cart
    window.location.reload();
  }
}

function updateCartItem(itemElement, newQuantity) {
  const productId = parseInt(itemElement.dataset.id);
  const option = itemElement.dataset.option;
  const priceElement = itemElement.querySelector('.cart-item-price');
  const totalElement = itemElement.querySelector('.cart-item-total');
  
  // Get current cart
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  
  // Find and update the item
  const cartItem = cart.find(item => {
    if (item.id === productId) {
      if (option && item.option) {
        return item.option === option;
      }
      return !item.option;
    }
    return false;
  });
  
  if (cartItem) {
    // Update quantity
    cartItem.quantity = newQuantity;
    
    // Update total in the DOM
    const price = parseFloat(priceElement.textContent.substring(1));
    totalElement.textContent = `$${(price * newQuantity).toFixed(2)}`;
    
    // Save updated cart
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update summary
    updateCartSummary();
  }
}

function updateCartSummary() {
  const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
  const summaryEl = document.getElementById('cart-summary');
  
  if (summaryEl) {
    displayCartSummary(summaryEl, cartItems);
  }
}