const positionOfCardsRow = document.getElementById('positionOfCardsRow')

function goToProductPage(product) {
  localStorage.setItem("selectedProduct", JSON.stringify(product));
  window.location.href = `product-page.html?title=${encodeURIComponent(product.title)}`;
}


async function loadFAVSALEProducts() {
    try {
      const response = await fetch("https://api.back.freshbox.az/api/product/all");
      const data = await response.json();

      // Əgər nəticə array formadadırsa, davam et
      if (!Array.isArray(data)) {
        console.error("Məhsullar array formatında deyil!");
        return;
      }

      // Random 3 məhsulu seç
      const getRandomProducts = (arr, count) => {
        const shuffled = [...arr].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
      };

      const selectedProducts = getRandomProducts(data, 3);
      const container = document.getElementById("positionOfCardsRow");

      selectedProducts.forEach(product => {
        const card = document.createElement("div");
        card.className = "cardGreen";
       card.innerHTML = `
<div class="cardGreen">
  <div class="imgContainer">
    <img src="https://api.back.freshbox.az/uploads/product/${product.image}" alt="${product.title || 'product'}">
  </div>

  <div class="nameWeight">
    <h3>${product.title || 'No name'}</h3>

    <div class="stockAndWeight">
      <span class="stock-status" style="display: flex; align-items: center; gap: 4px;">
        ${
          product.stock === 1
            ? `<svg width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#4CAF50"/><path d="M7 13l3 3 7-7" stroke="white" stroke-width="2"/></svg> Stokda var`
            : `<svg width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#F44336"/><path d="M15 9l-6 6M9 9l6 6" stroke="white" stroke-width="2"/></svg> Stokda yoxdur`
        }
      </span>

      ${product.quantity > 0 ? `<span>${product.quantity} ədəd</span>` : ''}
      ${product.weight > 0 ? `<span>${product.weight} kg</span>` : ''}
      ${product.liter > 0 ? `<span>${product.liter} l</span>` : ''}
    </div>
  </div>

  <p>${product.price ? product.price + ' man' : 'Qiymət yoxdur'}</p>

<button onclick='goToProductPage(${JSON.stringify(product)})'>İndi sifariş et</button>


</div>

`;

        container.appendChild(card);
      });

    } catch (error) {
      console.error("API-dən məlumat alınarkən xəta baş verdi:", error);
    }
  }

  loadFAVSALEProducts();