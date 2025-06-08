window.addEventListener("DOMContentLoaded", () => {
    const product = JSON.parse(localStorage.getItem("selectedProduct"));
    const params = new URLSearchParams(window.location.search);
    const titleFromUrl = params.get("title");

    if (!product && !titleFromUrl) return;

    // title
    if (titleFromUrl) {
        document.title = decodeURIComponent(titleFromUrl) + " | FreshBox";
    } else if (product?.title) {
        document.title = product.title + " | FreshBox";
    }

    // show the product
    if (product) {
        document.getElementById("put_name_here").textContent = `${product.title} ${product.weight > 0 ? '(' + product.weight + ' kq)' : ''}`;
       const priceElem = document.getElementById("put_price_here");
const discountedElem = document.getElementById("put_discounted_here");

if (product.discounted) {
  priceElem.innerHTML = `<span style="text-decoration: line-through; color: gray;">${product.price} AZN</span>`;
  discountedElem.textContent = `${product.discounted} AZN`;
  discountedElem.style.color = 'red';
  discountedElem.style.display = '';
} else {
  priceElem.textContent = `${product.price} AZN`;
  discountedElem.textContent = '';
  discountedElem.style.display = 'none';
}

        document.getElementById('add_category_here').textContent = `${product.category_title || product.category_name}`;
        document.getElementById('put_quantity_here').textContent = `${product.quantity > 0 ? product.quantity + ' ədəd' : ''}`;
        document.getElementById('put_liter_here').textContent = `${product.liter > 0 ? product.liter + " l" : ""}`;
        if (product.description) {
            document.getElementById("put_description_here").textContent = product.description;
        }

        const img = document.querySelector(".product-image-box img");
        img.src = `https://api.back.freshbox.az/uploads/product/${product.image}`;
        img.alt = product.title;

        if (product.category_title) {
            const catElem = document.getElementById("breadcrumb_category");
            if (catElem) catElem.textContent = product.category_title;
        }

        if (product.title) {
            const titleElem = document.getElementById("breadcrumb_title");
            if (titleElem) titleElem.textContent = product.title;
        }
    }
});


async function loadRecommendations() {
  const limit = 3; // neçə məhsul göstərmək istədiyini buradan təyin et
  const recommendation = document.getElementById('recommendation_box');
  if (!recommendation) return;

  recommendation.innerHTML = ''; // təmizləyirik

  try {
    const res = await fetch("https://api.back.freshbox.az/api/product/all");
    const data = await res.json();

    // Random şəkildə "limit" sayda məhsul seç
    const recommended = data.sort(() => 0.5 - Math.random()).slice(0, limit);

    const html = recommended.map(product => {
      const discountedPrice = product.discount
        ? (product.price - (product.price * product.discount / 100)).toFixed(2)
        : null;

      return `
        <div class="card_recommendation" data-id="${product.id}">
          <div class="image-circle">
            <div class="image_box">
              <img src="https://api.back.freshbox.az/uploads/product/${product.image}" alt="${product.title}">
            </div>
            <button style="cursor: pointer;">
              <div class="wish_list_circle">
                <img src="${product.fav === 1 ? './assets/img/orangeHerz.svg' : './assets/img/heart.png'}" alt="heart-icon">
              </div>
            </button>
          </div>
          <div class="name-weight">
            <h3>${product.title}</h3>
            <span>${product.weight > 0 ? product.weight + ' kg' : ''}</span>
          </div>
          <div class="price">
            ${
              discountedPrice
                ? `
                  <span style="text-decoration: line-through; color: #888;">${product.price} man</span>
                  <span style="color: red; font-weight: bold; margin-left: 6px;">${discountedPrice} man</span>
                `
                : `<span>${product.price} man</span>`
            }
          </div>
          <div>
            <button role="link" onclick='goToProductPage(${JSON.stringify(product)})'>İndi sifariş et</button>
          </div>
        </div>
      `;
    }).join('');

    recommendation.innerHTML = html;

  } catch (error) {
    console.error("Tövsiyə olunan məhsullar yüklənmədi:", error);
    recommendation.innerHTML = `<p>Xəta baş verdi. Məhsullar yüklənmədi.</p>`;
  }
}


loadRecommendations();




const favvproduc = document.getElementById('add_to_favourite');

if (favvproduc) {
  favvproduc.addEventListener('click', async (e) => {
    e.stopPropagation();

    // productId və userId-i localStorage-dan götürürük
    const productId = localStorage.getItem('productId');  // productId burada saxlanmalıdır
    const userId = localStorage.getItem('userId');

    const productCardElement = favvproduc.closest('.products-card');

    if (!productId || !productCardElement) {
      console.warn('Product ID və ya productCardElement tapılmadı!');
      return;
    }

    await toggleFavourite(productId, productCardElement, favvproduc, userId);
  });
}

async function toggleFavourite(productId, productCardElement, favCircleElement, userId) {
  const token = localStorage.getItem('token');

  if (!token || !userId) {
    showToast("Zəhmət olmasa daxil olun", true);
    return;
  }

  try {
    const isFav = favCircleElement.getAttribute("data-fav") === "1";

    const url = isFav
      ? 'https://api.back.freshbox.az/api/fave/delete'
      : 'https://api.back.freshbox.az/api/fave/add';

    const method = isFav ? 'DELETE' : 'POST';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        user_id: userId,
        product_id: productId,
      }),
    });

    if (res.ok) {
      const isNowFav = !isFav;
      favCircleElement.setAttribute("data-fav", isNowFav ? "1" : "0");
      const img = favCircleElement.querySelector('img');
      if (img) {
        img.src = isNowFav ? './assets/img/orangeHerz.svg' : './assets/img/heart.png';
      }
      showToast(isNowFav ? "Sevimlilərə əlavə olundu" : "Sevimlilərdən silindi");
    } else {
      throw new Error('Server error');
    }
  } catch (error) {
    console.error('Sevimliyə əlavə/silmə xətası:', error);
    showToast("Xəta baş verdi", true);
  }
}
