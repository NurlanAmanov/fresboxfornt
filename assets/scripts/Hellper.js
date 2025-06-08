document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("add-to-cart-form");
  const numberInput = document.getElementById("numberInput");
  const sidebar = document.querySelector('.sidebar');
  const text = document.querySelector('.textHeadButton');
  const overlay = document.getElementById("overlaytus");

  // 🛒 Səbətə əlavə et formunun submit
  if (form && numberInput) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        showToast("Zəhmət olmasa əvvəlcə hesabınıza daxil olun.");
        return;
      }

      let quantity = parseInt(numberInput.value.trim());
      if (isNaN(quantity) || quantity < 1) {
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
  }

  // ➕➖ Say artımı
  window.changeValue = function (delta) {
    const input = document.getElementById("numberInput");
    if (input) {
      let value = parseInt(input.value.trim());
      if (isNaN(value) || value < 1) value = 1;
      input.value = Math.max(1, value + delta);
    }
  };

  // 🔢 Say yoxlanışı
  window.validateNumber = function (input) {
    input.value = input.value.replace(/\D/g, '');
    if (input.value === '' || parseInt(input.value) < 1) {
      input.value = 1;
    }
  };

  // ☰ Sidebar idarəsi
  window.toggleSidebar = function (open) {
    if (sidebar && text) {
      if (open) {
        sidebar.classList.add('open');
        text.classList.add('hide-text');
        if (overlay) overlay.style.display = "block";
      } else {
        sidebar.classList.remove('open');
        text.classList.remove('hide-text');
        if (overlay) overlay.style.display = "none";
      }
    }
  };

  window.openNav = function () {
    toggleSidebar(true);
  };

  window.closeNav = function () {
    toggleSidebar(false);
  };
});

// 🔔 Toast bildirişi
function showToast(message) {
  const toast = document.getElementById("toast");
  if (toast) {
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 2000);
  }
}
