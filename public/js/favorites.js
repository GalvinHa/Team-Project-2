fetch('/data/data.json') 
  .then(res => res.json())
  .then(products => {
    const container = document.getElementById('favorited-product');

    products.forEach(product => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <img class="product-main-image" src="${product.mainImage}" alt="${product.name}" />
        <h4 class="product-name">${product.name}</h4>
        <p class="product-price">$${product.price.toFixed(2)}</p>
      `;
      container.appendChild(card);
    });
  })
  .catch(error => {
    console.error("Failed to load products:", error);
  });