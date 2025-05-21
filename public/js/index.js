// Updated code for index.js to create consistent product cards

document.addEventListener('DOMContentLoaded', () => {
  // Elements to populate
  const featuredProductsSection = document.getElementById('featured-products');
  
  // Fetch products data
  fetch('/data/data.json')
    .then(response => response.json())
    .then(products => {
      // Show featured products grouped by category
      if (featuredProductsSection) {
        displayFeaturedProducts(featuredProductsSection, products);
      }
    })
    .catch(error => {
      console.error("Error loading products:", error);
    });
});

function displayFeaturedProducts(container, products) {
  // Group products by category
  const categories = {};
  products.forEach(product => {
    if (!categories[product.category]) {
      categories[product.category] = [];
    }
    categories[product.category].push(product);
  });
  
  // Create HTML for each category
  let featuredHTML = '';
  
  Object.keys(categories).forEach(category => {
    const categoryProducts = categories[category].slice(0, 3); // Show up to 3 products per category
    
    featuredHTML += `
      <div class="featured-category">
        <h3>${category}</h3>
        <div class="products-grid">
    `;
    
    categoryProducts.forEach(product => {
      featuredHTML += `
        <div class="product-card" data-product-id="${product.id}">
          <div class="product-card-image">
            <img src="${product.mainImage}" alt="${product.name}">
            <div class="product-card-overlay">
              <a href="product-page.html?id=${product.id}" class="view-product-btn">View Product</a>
            </div>
          </div>
          <div class="product-card-info">
            <h4 class="product-card-name">${product.name}</h4>
            <p class="product-card-price">$${product.price.toFixed(2)}</p>
          </div>
        </div>
      `;
    });
    
    featuredHTML += `
        </div>
        <div class="show-all">
          <a href="store.html?category=${encodeURIComponent(category)}">View All ${category}</a>
        </div>
      </div>
    `;
  });
  
  container.innerHTML = featuredHTML;
  
  // Add click event to product cards
  const productCards = container.querySelectorAll('.product-card');
  productCards.forEach(card => {
    card.addEventListener('click', (e) => {
      // Don't trigger if button or link was clicked directly
      if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') {
        return;
      }
      
      const productId = card.dataset.productId;
      window.location.href = `product-page.html?id=${productId}`;
    });
  });
}