// Updated favorites.js to only show saved favorites
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('favorited-product');
  
  // Get saved favorites from localStorage
  const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
  
  // If no saved favorites, show a message
  if (savedFavorites.length === 0) {
    container.innerHTML = `
      <div class="empty-favorites">
        <h3>No Favorites Added Yet</h3>
        <p>Items you save will appear here.</p>
        <a href="store.html" class="browse-store-btn">Browse Products</a>
      </div>
    `;
    return;
  }
  
  // Display saved favorites
  savedFavorites.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.id = product.id;
    
    card.innerHTML = `
      <img class="product-main-image" src="${product.image}" alt="${product.name}" />
      <div class="product-info">
        <h4 class="product-name">${product.name}</h4>
        <p class="product-price">$${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}</p>
        <div class="product-actions">
          <button class="remove-favorite-btn">Remove</button>
          <button class="add-to-cart-btn">Add to Cart</button>
        </div>
      </div>
    `;
    
    // Make card clickable
    card.addEventListener('click', (e) => {
      // Don't navigate if clicking a button
      if (e.target.tagName === 'BUTTON') return;
      
      window.location.href = `product-page.html?id=${product.id}`;
    });
    
    container.appendChild(card);
  });
  
  // Add event listeners for Remove buttons
  setupRemoveButtons();
  
  // Add event listeners for Add to Cart buttons
  setupAddToCartButtons();
});

function setupRemoveButtons() {
  const removeButtons = document.querySelectorAll('.remove-favorite-btn');
  
  removeButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.stopPropagation(); // Prevent card click
      
      const productCard = this.closest('.product-card');
      const productId = parseInt(productCard.dataset.id);
      
      // Get favorites from localStorage
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      
      // Filter out the removed product
      const updatedFavorites = favorites.filter(item => item.id !== productId);
      
      // Save updated favorites to localStorage
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      
      // Add animation before removing
      productCard.style.opacity = '0';
      productCard.style.transform = 'scale(0.8)';
      
      // Remove card after animation
      setTimeout(() => {
        productCard.remove();
        
        // If no more favorites, show empty message
        if (updatedFavorites.length === 0) {
          const container = document.getElementById('favorited-product');
          container.innerHTML = `
            <div class="empty-favorites">
              <h3>No Favorites Added Yet</h3>
              <p>Items you save will appear here.</p>
              <a href="store.html" class="browse-store-btn">Browse Products</a>
            </div>
          `;
        }
      }, 300);
    });
  });
}

function setupAddToCartButtons() {
  const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
  
  addToCartButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.stopPropagation(); // Prevent card click
      
      const productCard = this.closest('.product-card');
      const productId = parseInt(productCard.dataset.id);
      
      // Get favorites to get product data
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      const product = favorites.find(item => item.id === productId);
      
      if (!product) return;
      
      // Get cart from localStorage
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      
      // Check if already in cart
      const existingItemIndex = cart.findIndex(item => item.id === productId);
      
      if (existingItemIndex >= 0) {
        // Increment quantity
        cart[existingItemIndex].quantity += 1;
      } else {
        // Add new item
        cart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1
        });
      }
      
      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(cart));
      
      // Show feedback
      this.textContent = 'Added!';
      this.style.backgroundColor = 'var(--green, #10B981)';
      this.style.color = 'white';
      
      // Reset after a delay
      setTimeout(() => {
        this.textContent = 'Add to Cart';
        this.style.backgroundColor = '';
        this.style.color = '';
      }, 2000);
    });
  });
}