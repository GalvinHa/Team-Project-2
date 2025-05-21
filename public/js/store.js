// Updated store.js without View Product overlay
document.addEventListener('DOMContentLoaded', () => {
  const productListContainer = document.getElementById('productList');
  const categoryCheckboxes = document.querySelectorAll('input[name="product-type"]');
  let selectedCategory = "All"; // Default category
  
  // Fetch products data
  fetch('/data/data.json')
    .then(response => response.json())
    .then(products => {
      // Display initial products
      displayProducts(productListContainer, products, selectedCategory);
      
      // Set up event listeners for category selection
      categoryCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
          if (this.checked) {
            // Uncheck other checkboxes
            categoryCheckboxes.forEach(cb => {
              if (cb !== this) cb.checked = false;
            });
            
            selectedCategory = this.value;
            displayProducts(productListContainer, products, selectedCategory);
          } else {
            // If unchecked, select "All"
            if (selectedCategory === this.value) {
              const allCheckbox = document.querySelector('input[value="All"]');
              if (allCheckbox) {
                allCheckbox.checked = true;
                selectedCategory = "All";
                displayProducts(productListContainer, products, selectedCategory);
              }
            }
          }
        });
      });
      
      // Set up mobile category dropdown
      const categoryMobile = document.querySelector('.product-category-mobile');
      if (categoryMobile) {
        categoryMobile.addEventListener('change', function() {
          selectedCategory = this.value;
          
          // Update checkboxes to match dropdown
          categoryCheckboxes.forEach(checkbox => {
            checkbox.checked = checkbox.value === selectedCategory;
          });
          
          displayProducts(productListContainer, products, selectedCategory);
        });
      }
    })
    .catch(error => {
      console.error("Failed to load products:", error);
      if (productListContainer) {
        productListContainer.innerHTML = `
          <div class="empty-products">
            <h3>Unable to load products</h3>
            <p>We're sorry, but there was an error loading the products. Please try again later.</p>
          </div>
        `;
      }
    });
});

function displayProducts(container, products, category) {
  if (!container) return;
  
  // Filter products by category if not "All"
  const filteredProducts = category === "All" 
    ? products 
    : products.filter(product => {
        // Case-insensitive comparison and handle plurals
        const productCategory = product.category.toLowerCase();
        const filterCategory = category.toLowerCase();
        
        // Handle plural forms (e.g., "Keyboards" matches "Keyboard")
        if (filterCategory.endsWith('s') && productCategory === filterCategory.slice(0, -1)) {
          return true;
        }
        
        // Regular match
        return productCategory === filterCategory;
      });
  
  if (filteredProducts.length === 0) {
    container.innerHTML = `
      <div class="empty-products">
        <h3>No products found</h3>
        <p>We couldn't find any products in the "${category}" category.</p>
      </div>
    `;
    return;
  }
  
  // Clear container
  container.innerHTML = '';
  
  // Create product cards
  filteredProducts.forEach(product => {
    // Create card div
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.id = product.id;
    
    // Create product card HTML - removed the overlay with View Product button
    card.innerHTML = `
      <div class="product-card-image">
        <img src="${product.mainImage}" alt="${product.name}">
      </div>
      <div class="product-card-info">
        <h4 class="product-name">${product.name}</h4>
        <p class="product-price">$${product.price.toFixed(2)}</p>
        <div class="product-actions">
          <button class="save-btn">Save Later</button>
          <button class="add-cart-btn">Add to Cart</button>
        </div>
      </div>
    `;
    
    // Make card clickable
    card.addEventListener('click', (e) => {
      // Don't trigger if clicking a button or link
      if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A') {
        return;
      }
      
      // Navigate to product page
      window.location.href = `product-page.html?id=${product.id}`;
    });
    
    // Add to container
    container.appendChild(card);
  });
  
  // Set up button functionality
  setupSaveButtons();
  setupAddToCartButtons();
}

function setupSaveButtons() {
  const saveButtons = document.querySelectorAll('.save-btn');
  
  saveButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.stopPropagation(); // Prevent card click
      
      const productCard = this.closest('.product-card');
      const productId = parseInt(productCard.dataset.id);
      
      // Get favorites from localStorage
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      
      // Check if already in favorites
      const isAlreadyFavorite = favorites.some(item => item.id === productId);
      
      if (!isAlreadyFavorite) {
        // Get product details from card
        const productName = productCard.querySelector('.product-name').textContent;
        const productPrice = parseFloat(productCard.querySelector('.product-price').textContent.replace('$', ''));
        const productImage = productCard.querySelector('.product-card-image img').src;
        










        // Add to favorites
        favorites.push({
          id: productId,
          name: productName,
          price: productPrice,
          image: productImage
        });
        
        // Save to localStorage
        localStorage.setItem('favorites', JSON.stringify(favorites));
        
        // Show feedback
        this.textContent = 'Saved!';
        this.style.backgroundColor = 'var(--green)';
        this.style.color = 'white';
        
        // Reset after a delay
        setTimeout(() => {
          this.textContent = 'Save Later';
          this.style.backgroundColor = '';
          this.style.color = '';
        }, 2000);
      } else {
        // Already saved
        this.textContent = 'Already Saved';
        
        // Reset after a delay
        setTimeout(() => {
          this.textContent = 'Save Later';
        }, 2000);
      }
    });
  });
}











function setupAddToCartButtons() {
  const addToCartButtons = document.querySelectorAll('.add-cart-btn');
  
  addToCartButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.stopPropagation(); // Prevent card click
      
      const productCard = this.closest('.product-card');
      const productId = parseInt(productCard.dataset.id);
      
      // Get cart from localStorage
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      
      // Check if already in cart
      const existingItemIndex = cart.findIndex(item => item.id === productId);
      
      // Get product details from card
      const productName = productCard.querySelector('.product-name').textContent;
      const productPrice = parseFloat(productCard.querySelector('.product-price').textContent.replace('$', ''));
      const productImage = productCard.querySelector('.product-card-image img').src;
      
      if (existingItemIndex >= 0) {
        // Increment quantity
        cart[existingItemIndex].quantity += 1;
      } else {
        // Add new item
        cart.push({
          id: productId,
          name: productName,
          price: productPrice,
          image: productImage,
          quantity: 1
        });
      }
      
      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(cart));
      
      // Show feedback
      this.textContent = 'Added!';
      this.style.backgroundColor = 'var(--green)';
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