document.addEventListener("DOMContentLoaded", function () {
  const cartContainer = document.querySelector(".purchases-list");
  const totalEl = document.getElementById("put_total_here");

  let cart = JSON.parse(localStorage.getItem("cartProducts")) || [];

  // Функция для пересчета общей суммы
  function calculateTotal(cartArray) {
    const total = cartArray.reduce((sum, product) => {
      const quantity = product.cartQuantity || 1;
      return sum + (product.price * quantity);
    }, 0);

    totalEl.textContent = `${total.toFixed(2)} AZN`;
  }

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Səbət boşdur.</p>";
    totalEl.textContent = "0 AZN";
    return;
  }

  cart.forEach(product => {
    const productHTML = `
<div class="cart-item" data-id="${product.id}">
  <img src="http://localhost:3000/uploads/product/${product.image}" alt="${product.title}">

  <div class="product-info">
    <div class="info-column">
      <h4>${product.title}</h4>
      ${product.weight ? `<p>${product.weight} kg</p>` : product.liter ? `<p>${product.liter} l</p>` : ''}
    </div>

    <div class="info-column">
      ${product.cartQuantity ? `<p>Miqdar</p><p class="price">${product.cartQuantity} ədəd</p>` : ''}
    </div>

    <div class="info-column">
      <p>Qiymət</p>
      <p class="price">${product.price} man</p>
    </div>

    <div class="info-column">
      <button class="remove-btn" data-id="${product.id}">Sil</button>
    </div>
  </div>
</div>

    `;
    cartContainer.insertAdjacentHTML("beforeend", productHTML);
  });

  // Считаем сумму при загрузке
  calculateTotal(cart);

  // Удаление товара из корзины
  cartContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-btn")) {
      const id = e.target.getAttribute("data-id");
      let updatedCart = cart.filter(p => p.id != id);
      localStorage.setItem("cartProducts", JSON.stringify(updatedCart));
      e.target.closest(".cart-item").remove();

      // Обновляем локальную переменную
      cart = updatedCart;

      if (updatedCart.length === 0) {
        cartContainer.innerHTML = "<p>Səbət boşdur.</p>";
        totalEl.textContent = "0 AZN";
      } else {
        calculateTotal(updatedCart);
      }
    }
  });
});



// Cart mehsul deyer


function changeValue(delta) {
const input = document.getElementById("numberInput");
let value = parseInt(input.value) || 0;
value = Math.max(1, value + delta); // минимум 1
input.value = value;
}

function validateNumber(input) {
input.value = input.value.replace(/\D/g, ''); // убирает все нецифры
}

// counter scripts for products
function changeValue(btn, delta) {
    const input = btn.closest("form").querySelector("input");
    let value = parseInt(input.value) || 0;
    value += delta;
    if (value < 1) value = 1;
    input.value = value;
}

function validateNumber(input) {
    let value = parseInt(input.value);
    if (isNaN(value) || value < 1) {
        input.value = 1;
    }
}

window.addEventListener("load", function () {
  const mobileAuthControl = document.getElementById('mobileAuthControl');
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  if (window.innerWidth <= 768) {
    if (token && userId) {
      // show icon
if (mobileAuthControl) {
  mobileAuthControl.innerHTML = `
    <a href="./profile.html" style="
      padding: 10px 30px;
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-top: 20px;
      text-decoration: none;
      font-size: 22px;
      color: white;
      transition: 0.3s;
    " onmouseover="this.style.backgroundColor='rgba(19, 125, 59, 0.95)'" 
       onmouseout="this.style.backgroundColor=''">
      <img src="./assets/img/iconizer-Profile.svg" alt="Profile" style="margin-right: 10px;">
      Profile
    </a>
  `;
  mobileAuthControl.style.display = 'flex';
}
    } else {
      // show register button
      if (mobileAuthControl) {
        mobileAuthControl.innerHTML = `
          <button class="sidebar-button" onclick="document.location='mobile_sing.html'">Qeydiyyatdan keç</button>
        `;
        mobileAuthControl.style.display = 'flex';
      }
    }
  }
});



    