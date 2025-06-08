

function getCategoryTitleFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('categoryTitle');
}

function showToast(message, isError = false) {
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.position = 'fixed';
  toast.style.bottom = '20px';
  toast.style.left = '50%';
  toast.style.transform = 'translateX(-50%)';
  toast.style.backgroundColor = isError ? '#F44336' : '#4CAF50';
  toast.style.color = '#fff';
  toast.style.padding = '10px 20px';
  toast.style.borderRadius = '5px';
  toast.style.opacity = '0';
  toast.style.visibility = 'hidden';
  toast.style.transition = 'opacity 0.5s ease, visibility 0.5s ease';
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.visibility = 'visible';
    toast.style.opacity = '1';
  }, 100);

  setTimeout(() => {
    toast.style.visibility = 'hidden';
    toast.style.opacity = '0';
    setTimeout(() => {
      toast.remove();
    }, 500); // Tostu silmək üçün
  }, 3000); // 3 saniyə sonra gizlətmək
}
async function toggleFavourite(productId, productCardElement, favElement) {
  try {
    // LocalStorage-dən istifadəçi ID-sini alırıq
    const userId = localStorage.getItem('userId');
    if (!userId) {
      showToast('İstifadəçi identifikasiyası tapılmadı. Lütfən, əvvəlcə daxil olun.', true);
      return;
    }

    const requestData = {
      user_id: userId,    // LocalStorage-dən alırıq
      product_id: productId, // Məhsul ID-sini məhsul kartından alırıq
    };

    console.log('Göndərilən məlumatlar:', JSON.stringify(requestData));

    const res = await fetch('http://localhost:3000/api/fave/add', {
      method: 'POST',
      headers: {
        'accept': '*/*',  // Swagger ilə uyğun olan başlıq
        'Content-Type': 'application/json', // JSON formatında məlumat göndəririk
      },
      body: JSON.stringify(requestData), // Məlumatları JSON formatında göndəririk
    });

    console.log('Cavab statusu:', res.status);

    if (!res.ok) {
      throw new Error('Məhsul sevimli olaraq işarələnə bilmədi');
    }

    const data = await res.json();


    // Əgər serverdən alınan məlumatda fav dəyəri varsa
    const isFav = data.fav === 1; // Fav statusunun yoxlanması

    // Fav statusunu yeniləyirik
    if (isFav) {
      favElement.setAttribute('data-fav', '1');
      favElement.querySelector('img').src = './assets/img/orangeHerz.svg';  // Fav iconu
      showToast('Məhsul sevimlilər siyahısına əlavə olundu.');
    } else {
      favElement.setAttribute('data-fav', '0');
      favElement.querySelector('img').src = './assets/img/heart.png';  // Həmişəlik icon
      showToast('Məhsul siyahısına əlavə olundu.');
    }

  } catch (error) {
    console.error(error);
    showToast('Sevimli məhsul kimi əlavə edilərkən xəta baş verdi.', true);
  }
}







function displayProducts(products) {
  const container = document.getElementById('productList');
  if (!container) {
    console.error("productList elementi tapılmadı");
    return;
  }
  container.innerHTML = '';

  products.forEach(product => {
    const productCardHTML = `
      <div class="products-card" data-id="${product.id}" data-fav="${product.fav || '0'}">
        <div class="imgae-circle">
          <div class="image-container">
            <img src="http://localhost:3000/uploads/product/${product.image}" alt="${product.title}">
          </div>
          <div class="favourite-circle" data-id="${product.id}" data-fav="${product.fav === 1 ? '1' : '0'}">
            <img src="${product.fav === 1 ? './assets/img/orangeHerz.svg' : './assets/img/heart.png'}" alt="fav-icon">
          </div>
        </div>
        <div class="name-weight">
          <h3>${product.title}</h3>
          <span class="stock-status">
            ${product.stock === 1
              ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#4CAF50"/><path d="M7 13l3 3 7-7" stroke="white" stroke-width="2"/></svg> Stokda var`
              : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#F44336"/><path d="M15 9l-6 6M9 9l6 6" stroke="white" stroke-width="2"/></svg> Stokda yoxdur`}
          </span>
          <span>${product.quantity > 0 ? product.quantity + ' ədəd' : ''}</span>
          <span>${product.weight > 0 ? product.weight + " kg" : ""}</span>
          <span>${product.liter > 0 ? product.liter + " l" : ""}</span>
        </div>
        <div class="price">
          <span>${product.price} man</span>
        </div>
        <div>
          <button role="link" class="order-btn" data-product='${encodeURIComponent(JSON.stringify(product))}'>İndi sifariş et</button>
        </div>
      </div>
    `;

    container.insertAdjacentHTML('beforeend', productCardHTML);
  });

  container.querySelectorAll('.order-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const productData = decodeURIComponent(e.currentTarget.getAttribute('data-product'));
      const product = JSON.parse(productData);
      goToProductPage(product);
    });
  });

  attachFavListeners();
}

async function loadProducts() {
  try {
    const categoryTitle = getCategoryTitleFromURL();


    const res = await fetch('http://localhost:3000/api/product/all');
    if (!res.ok) throw new Error('Məhsullar yüklənə bilmədi');
    let products = await res.json();

  
    if (categoryTitle) {
      const normalizedCategoryTitle = categoryTitle.toLowerCase().trim();
      products = products.filter(p => p.category_title && p.category_title.toLowerCase().trim() === normalizedCategoryTitle);
    }

   

    displayProducts(products);

    const quantityElem = document.getElementById('quatity-of-products');
    if (quantityElem) {
      quantityElem.textContent = `${products.length} məhsul`;
    }
  } catch (error) {
    console.error(error);
    const container = document.getElementById('productList');
    if(container) container.innerHTML = '<p>Məhsullar yüklənərkən xəta baş verdi.</p>';
  }
}

function goToProductPage(product) {
  localStorage.setItem("selectedProduct", JSON.stringify(product));
  const titleParam = encodeURIComponent(product.title);
  window.location.href = `product-page.html?title=${titleParam}`;
}

function attachFavListeners() {
  document.querySelectorAll(".favourite-circle").forEach(circle => {
    circle.addEventListener("click", async (e) => {
      e.stopPropagation();

      const productCardElement = e.currentTarget.closest('.products-card');
      const productId = e.currentTarget.getAttribute("data-id");

      if (productCardElement && productId) {
        await toggleFavourite(productId, productCardElement, e.currentTarget);
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
});
