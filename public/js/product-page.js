// Updated product-page.js with category-specific behavior
document.addEventListener('DOMContentLoaded', () => {
  // Get product ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  
  if (!productId) {
    console.error("No product ID found in URL");
    return;
  }
  
  // Fetch product data from data.json
  fetch('/data/data.json')
    .then(response => response.json())
    .then(products => {
      // Find the product with matching ID
      const product = products.find(p => p.id === parseInt(productId));
      
      if (!product) {
        console.error("Product not found");
        return;
      }
      
      // Update the page with product data
      updateProductPage(product);
      
      // Setup features based on product category
      if (product.category === 'Mice') {
        // Only setup options for Mice category
        setupOptionButtons();
        setupAddToCartButton();
      } else {
        // For other categories, simplify the Add to Cart button
        setupSimpleAddToCart(product);
      }
    })
    .catch(error => {
      console.error("Error loading product data:", error);
    });
});

function updateProductPage(product) {
  // Update product title
  const productTitle = document.querySelector('.product-title');
  if (productTitle) {
    productTitle.textContent = product.name;
  }
  
  // Update product price
  const productPrice = document.querySelector('.product-price');
  if (productPrice) {
    productPrice.textContent = `$${product.price.toFixed(2)} USD`;
  }
  
  // Update main image
  const mainImage = document.getElementById('mainImage');
  if (mainImage) {
    mainImage.src = product.mainImage;
    mainImage.alt = product.name;
  }
  
  // Update carousel images
  if (product.carouselImages && product.carouselImages.length > 0) {
    // Create a new array with main image and carousel images
    window.imageUrls = [product.mainImage, ...product.carouselImages];
    
    // Reset current index and update carousel
    window.currentIndex = 0;
    updateCarousel();
  }
  
  
  // Add product features
  const featuresList = document.querySelector('.product-feature-section ul');
  if (featuresList) {
    // Clear existing features
    featuresList.innerHTML = '';
    
    // If product has no description or it's the placeholder, add generic features
    if (!product.description || product.description === "Edit in JSON") {
      // Create generic features based on product category
      const genericFeatures = getGenericFeatures(product.category);
      
      genericFeatures.forEach(feature => {
        const li = document.createElement('li');
        li.textContent = feature;
        featuresList.appendChild(li);
      });
    } else {
      // Add product description as a feature
      product.description.forEach((point) => {
        const li = document.createElement("li");
        li.textContent = point;
        featuresList.appendChild(li);
      });
    }
  }
  
  // Store the product ID on the Add to Cart button for later use
  const addToCartBtn = document.querySelector('.add-to-cart-btn');
  if (addToCartBtn) {
    addToCartBtn.dataset.productId = product.id;
  }
}


// function getGenericFeatures(category) {
//   // Return category-specific features
//   switch (category) {
//     case 'Mice':
//       return [
//         'High-precision optical sensor',
//         'Ergonomic design for comfortable use',
//         'Customizable buttons',
//         'Durable construction',
//         'Compatible with all operating systems'
//       ];
//     case 'Keyboard':
//       return [
//         'Mechanical switches for precise feedback',
//         'RGB backlighting with customizable effects',
//         'N-key rollover for accurate input',
//         'Durable keycaps',
//         'Programmable macro keys'
//       ];
//     case 'Headphone':
//       return [
//         'Immersive sound quality',
//         'Comfortable over-ear design',
//         'Noise isolation technology',
//         'Built-in microphone',
//         'Long battery life'
//       ];
//     case 'Microphone':
//       return [
//         'Crystal clear audio capture',
//         'Adjustable sensitivity',
//         'Noise cancellation technology',
//         'Sturdy desktop stand included',
//         'Plug-and-play USB connection'
//       ];
//     default:
//       return [
//         'Premium quality construction',
//         'Designed for high performance',
//         'User-friendly interface',
//         'Durable and reliable',
//         'Excellent value for money'
//       ];
//   }
// }

function setupOptionButtons() {
  // Add click event listeners to option buttons
  const optionBtns = document.querySelectorAll('.option-btn');
  optionBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      // Remove active class from all buttons
      optionBtns.forEach(b => b.classList.remove('active'));
      
      // Add active class to clicked button
      this.classList.add('active');
      
      // Update dropdown to match (for mobile view)
      const dropdown = document.querySelector('.option-dropdown');
      if (dropdown) {
        dropdown.value = this.textContent.toLowerCase().replace(/\s+/g, '-');
      }
    });
  });
  
  // Add change event listener to dropdown
  const dropdown = document.querySelector('.option-dropdown');
  if (dropdown) {
    dropdown.addEventListener('change', function() {
      // Update option buttons to match dropdown
      const optionBtns = document.querySelectorAll('.option-btn');
      optionBtns.forEach(btn => {
        const btnValue = btn.textContent.toLowerCase().replace(/\s+/g, '-');
        if (btnValue === this.value) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    });
  }
}

function setupAddToCartButton() {
  const addToCartBtn = document.querySelector('.add-to-cart-btn');
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', function() {
      const productId = parseInt(this.dataset.productId);
      
      // Get the selected option
      let selectedOption = '';
      const activeOptionBtn = document.querySelector('.option-btn.active');
      if (activeOptionBtn) {
        selectedOption = activeOptionBtn.textContent;
      } else {
        const dropdown = document.querySelector('.option-dropdown');
        if (dropdown && dropdown.value) {
          selectedOption = dropdown.options[dropdown.selectedIndex].text;
        }
      }
      
      // If no option is selected, show an alert
      if (!selectedOption) {
        alert('Please select a product option before adding to cart.');
        return;
      }
      
      // Fetch the product data again to get the current information
      fetch('/data/data.json')
        .then(response => response.json())
        .then(products => {
          const product = products.find(p => p.id === productId);
          
          if (!product) {
            console.error("Product not found");
            return;
          }
          
          // Get existing cart from localStorage or initialize empty array
          const cart = JSON.parse(localStorage.getItem('cart') || '[]');
          
          // Check if this product with the same option is already in the cart
          const existingItemIndex = cart.findIndex(item => 
            item.id === product.id && item.option === selectedOption
          );
          
          if (existingItemIndex >= 0) {
            // Increment quantity if already in cart
            cart[existingItemIndex].quantity += 1;
          } else {
            // Add new item to cart
            cart.push({
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.mainImage,
              option: selectedOption,
              quantity: 1
            });
          }
          
          // Save updated cart to localStorage
          localStorage.setItem('cart', JSON.stringify(cart));
          
          // Show confirmation
          showAddToCartConfirmation(product.name, selectedOption);
        })
        .catch(error => {
          console.error("Error adding product to cart:", error);
        });
    });
  }
}

// For non-Mice categories, use a simpler Add to Cart function
function setupSimpleAddToCart(product) {
  const addToCartBtn = document.querySelector('.add-to-cart-btn');
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', function() {
      // Get existing cart from localStorage or initialize empty array
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      
      // Check if this product is already in the cart
      const existingItemIndex = cart.findIndex(item => item.id === product.id);
      
      if (existingItemIndex >= 0) {
        // Increment quantity if already in cart
        cart[existingItemIndex].quantity += 1;
      } else {
        // Add new item to cart without option
        cart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.mainImage,
          quantity: 1
        });
      }
      
      // Save updated cart to localStorage
      localStorage.setItem('cart', JSON.stringify(cart));
      
      // Show confirmation without option
      showAddToCartConfirmation(product.name);
    });
  }
}

function showAddToCartConfirmation(productName, option) {
  // Create a confirmation message element
  const confirmation = document.createElement('div');
  confirmation.className = 'cart-confirmation';
  
  let messageHtml = `
    <div class="cart-confirmation-content">
      <p><strong>${productName}</strong>`;
  
  if (option) {
    messageHtml += ` with option <strong>${option}</strong>`;
  }
  
  messageHtml += ` added to cart!</p>
      <div class="cart-confirmation-buttons">
        <button class="continue-shopping-btn">Continue Shopping</button>
        <button class="view-cart-btn">View Cart</button>
      </div>
    </div>
  `;
  
  confirmation.innerHTML = messageHtml;
  
  // Add styles to the confirmation
  confirmation.style.position = 'fixed';
  confirmation.style.marginTop = '100px';

  confirmation.style.top = '20px';
  confirmation.style.right = '20px';
  confirmation.style.maxWidth = '300px';
  confirmation.style.backgroundColor = 'white';
  confirmation.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
  confirmation.style.borderRadius = '4px';
  confirmation.style.padding = '15px';
  confirmation.style.zIndex = '1000';
  confirmation.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  confirmation.style.opacity = '0';
  confirmation.style.transform = 'translateX(30px)';
  
  // Add styles to buttons
  const buttons = confirmation.querySelectorAll('button');
  buttons.forEach(btn => {
    btn.style.padding = '8px 12px';
    btn.style.margin = '5px';
    btn.style.border = 'none';
    btn.style.borderRadius = '4px';
    btn.style.cursor = 'pointer';
  });
  
  const continueBtn = confirmation.querySelector('.continue-shopping-btn');
  continueBtn.style.backgroundColor = '#f0f0f0';
  
  const viewCartBtn = confirmation.querySelector('.view-cart-btn');
  viewCartBtn.style.backgroundColor = 'var(--accent-color, #9CA3AF)';
  viewCartBtn.style.color = 'white';
  
  // Add to document
  document.body.appendChild(confirmation);
  
  // Show with animation
  setTimeout(() => {
    confirmation.style.opacity = '1';
    confirmation.style.transform = 'translateX(0)';
  }, 10);
  
  // Add event listeners to buttons
  continueBtn.addEventListener('click', () => {
    // Hide and remove the confirmation
    confirmation.style.opacity = '0';
    confirmation.style.transform = 'translateX(30px)';
    setTimeout(() => {
      document.body.removeChild(confirmation);
    }, 300);
  });
  
  viewCartBtn.addEventListener('click', () => {
    // Navigate to cart page
    window.location.href = 'cart.html';
  });
  
  // Auto-hide after 5 seconds
  setTimeout(() => {
    if (document.body.contains(confirmation)) {
      confirmation.style.opacity = '0';
      confirmation.style.transform = 'translateX(30px)';
      setTimeout(() => {
        if (document.body.contains(confirmation)) {
          document.body.removeChild(confirmation);
        }
      }, 300);
    }
  }, 5000);
}

// Carousel functions
function updateCarousel() {
  const mainImage = document.getElementById("mainImage");
  const thumbContainer = document.getElementById("thumbContainer");
  
  if (mainImage && window.imageUrls && window.imageUrls.length > 0) {
    mainImage.src = window.imageUrls[window.currentIndex];
    renderThumbnails();
  }
}

function renderThumbnails() {
  const thumbContainer = document.getElementById("thumbContainer");
  if (thumbContainer && window.imageUrls) {
    thumbContainer.innerHTML = '';
    window.imageUrls.forEach((url, index) => {
      const thumb = document.createElement("img");
      thumb.src = url;
      thumb.style.width = "60px";
      thumb.style.height = "45px";
      if (index === window.currentIndex) {
        thumb.classList.add("active");
        
        // Scroll active thumbnail into view
        setTimeout(() => {
          thumb.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
        }, 0);
      }
      
      thumb.onclick = () => {
        window.currentIndex = index;
        updateCarousel();
      };
      
      thumbContainer.appendChild(thumb);
    });
  }
}

function prevImage() {
  if (window.imageUrls && window.imageUrls.length > 0) {
    window.currentIndex = (window.currentIndex - 1 + window.imageUrls.length) % window.imageUrls.length;
    updateCarousel();
  }
}

function nextImage() {
  if (window.imageUrls && window.imageUrls.length > 0) {
    window.currentIndex = (window.currentIndex + 1) % window.imageUrls.length;
    updateCarousel();
  }
}