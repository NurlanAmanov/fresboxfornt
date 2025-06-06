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


    const sidebar = document.querySelector('.sidebar');
    const text = document.querySelector('.textHeadButton');

    function toggleSidebar(open) {
      if (open) {
        sidebar.classList.add('open');
        text.classList.add('hide-text');
      } else {
        sidebar.classList.remove('open');
        text.classList.remove('hide-text');
      }
    }

    function openNav() {
      toggleSidebar(true);
      document.getElementById("overlaytus").style.display = "block";
    }

    function closeNav() {
      toggleSidebar(false);
      document.getElementById("overlaytus").style.display = "none";
    }




    //  HELPER 2 


    
    function changeValue(delta) {
      const input = document.getElementById("numberInput");
      let value = parseInt(input.value) || 0;
      value = Math.max(1, value + delta); // минимум 1
      input.value = value;
    }

    function validateNumber(input) {
      input.value = input.value.replace(/\D/g, ''); // убирает все нецифры
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


    function showToast(message) {
      const toast = document.getElementById("toast");
      toast.textContent = message;
      toast.classList.add("show");

      setTimeout(() => {
        toast.classList.remove("show");
      }, 2000); // скрыть через 2 секунды
    }

    function changeValue(btn, delta) {
      const input = document.getElementById("numberInput");
      let value = parseInt(input.value) || 1;
      value += delta;
      if (value < 1) value = 1;
      input.value = value;
    }

    function validateNumber(input) {
      if (parseInt(input.value) < 1 || isNaN(parseInt(input.value))) {
        input.value = 1;
      }
    }

    document.getElementById("add-to-card-script").addEventListener("click", function (e) {
      e.preventDefault();

      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      // Проверка авторизации
      if (!token || !userId) {
        showToast("Zəhmət olmasa əvvəlcə hesabınıza daxil olun.");
        return;
      }

      const quantity = parseInt(document.getElementById("numberInput").value);
      if (!quantity || quantity < 1) {
        showToast("Zəhmət olmasa düzgün say daxil edin.");
        return;
      }

      const product = JSON.parse(localStorage.getItem("selectedProduct"));
      if (!product) {
        showToast("Məhsul məlumatı tapılmadı.");
        return;
      }

      product.cartQuantity = quantity;

      let cart = JSON.parse(localStorage.getItem("cartProducts")) || [];

      const existingProductIndex = cart.findIndex(p => p.id === product.id);
      if (existingProductIndex !== -1) {
        cart[existingProductIndex].cartQuantity += quantity;
      } else {
        cart.push(product);
      }

      localStorage.setItem("cartProducts", JSON.stringify(cart));

      showToast("Məhsul səbətə əlavə edildi!");

      setTimeout(() => {
        window.location.href = "cart.html";
      }, 1000);
    });




// SHOP HELLPER

// document.addEventListener('DOMContentLoaded', () => {
//   loadCategory();
//   loadProducts();

//   const toggleBtn = document.querySelector('.dropdown-toggle-mobile');
//   const filterBar = document.querySelector('.filter-left-bar');

//   if (toggleBtn && filterBar) {
//     toggleBtn.addEventListener('click', () => {
//       filterBar.classList.toggle('mobile-visible');
//     });
//   } else {
//     console.warn('Кнопка или блок с фильтрами не найдены');
//   }
// });



function toggleSidebar(open) {
  if (open) {
    sidebar.classList.add('open');
    text.classList.add('hide-text');
  } else {
    sidebar.classList.remove('open');
    text.classList.remove('hide-text');
  }
}

function openNav() {
  toggleSidebar(true);
  document.getElementById("overlaytus").style.display = "block";
}

function closeNav() {
  toggleSidebar(false);
  document.getElementById("overlaytus").style.display = "none";
}

