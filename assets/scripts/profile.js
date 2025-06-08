async function getFavoritesByUser(userId) {
  try {
    const response = await fetch(`http://localhost:3000/api/fave/${userId}`);
    if (!response.ok) throw new Error(`Xəta baş verdi: ${response.status}`);
    const data = await response.json();

    // Mapla sevimli məhsulları
    displayFavoriteProducts(data);
  } catch (error) {
    console.error("Sevimli məhsullar alınarkən xəta:", error);
  }
}

// Məhsulları favourite-box div-inə maplama funksiyası
function displayFavoriteProducts(products) {
  const container = document.querySelector('.favourites-box');
  if (!container) {
    console.error('`.favourites-box` konteyneri tapılmadı!');
    return;
  }

  container.innerHTML = ''; // əvvəlcə təmizləyirik

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
<div class="product-meta">
  
  ${product.quantity > 0 ? `<span class="meta-item">${product.quantity} ədəd</span>` : ''}
  ${product.liter > 0 ? `<span class="meta-item">${product.liter} l</span>` : ''}
  ${product.weight > 0 ? `<span class="meta-item weight-right">${product.weight} kg</span>` : ''}
</div>

</div>

        <div class="price">
          <span>${product.price} man</span>
        </div>
        <div>
    
        </div>
      </div>
    `;
    container.insertAdjacentHTML('beforeend', productCardHTML);
  });

  // Ürək ikonları üçün eventləri əlavə et
  attachFavListeners();
}

// localStorage-dan userId oxuyuruq və funksiyanı çağırırıq
const userId = localStorage.getItem('userId');
if (userId) {
  getFavoritesByUser(userId);
} else {
  // console.log("İstifadəçi daxil olmayıb.");
}
// Sevimlərdən məhsulu silmək funksiyası
async function removeFavourite(productId) {
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token'); // varsa auth üçün

  if (!userId) {
    showToast("Zəhmət olmasa daxil olun", true);
    return false;
  }

  try {
    const res = await fetch(`http://localhost:3000/api/fave/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        // Authorization: `Bearer ${token}`, // lazım olsa
      },
      body: JSON.stringify({
        user_id: userId,
        product_id: productId
      })
    });

    if (res.ok) {
      showToast("Məhsul sevimlərdən silindi");
      // Sevimliləri yenilə
      await getFavoritesByUser(userId);
      return true;
    } else {
      const errorData = await res.json();
      showToast(`Xəta: ${errorData.message || 'Sevimlərdən silmək mümkün olmadı'}`, true);
      return false;
    }
  } catch (error) {
    console.error('Sevimlərdən silmək xətası:', error);
    showToast("Xəta baş verdi", true);
    return false;
  }
}

// Ürək ikonuna klik dinləyicisini əlavə et
function attachFavListeners() {
  document.querySelectorAll(".favourite-circle").forEach(circle => {
    circle.addEventListener("click", async (e) => {
      e.stopPropagation();

      const productCardElement = e.currentTarget.closest('.products-card');
      const productId = e.currentTarget.getAttribute("data-id");

      if (productCardElement && productId) {
        await removeFavourite(productId);
      }
    });
  });
}

if (userId) {
  getFavoritesByUser(userId);
} else {
  // console.log("İstifadəçi daxil olmayıb.");
}
function showToast(message, isError = false) {
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.position = 'fixed';
  toast.style.bottom = '20px';
  toast.style.left = '50%';
  toast.style.transform = 'translateX(-50%)';
  toast.style.padding = '10px 20px';
  toast.style.backgroundColor = isError ? 'red' : 'green';
  toast.style.color = 'white';
  toast.style.borderRadius = '5px';
  toast.style.zIndex = '9999';
  toast.style.fontSize = '14px';
  toast.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 2000);
}
 const buttons = document.querySelectorAll('.leftSide .buttonStyles');
        const tabContents = document.querySelectorAll('.tab-content');
        const logoutModal = document.getElementById('logoutModal');
        const confirmLogout = document.getElementById('confirmLogout');
        const cancelLogout = document.getElementById('cancelLogout');
      
        buttons.forEach(button => {
          button.addEventListener('click', () => {
            const tab = button.getAttribute('data-tab');
      
            if (tab === 'logout') {
              logoutModal.classList.add('active');
              return;
            }
      
            buttons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
      
            tabContents.forEach(content => content.classList.remove('active'));
            document.getElementById(tab).classList.add('active');
          });
        });
      
        // Плавное закрытие popup и редирект
        confirmLogout.addEventListener('click', () => {
          logoutModal.classList.remove('active');
          setTimeout(() => {
            window.location.href = './index.html';
          }, 300); // дождемся окончания анимации
        });
      
        cancelLogout.addEventListener('click', () => {
          logoutModal.classList.remove('active');
        });

        
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
        
