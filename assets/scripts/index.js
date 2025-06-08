document.addEventListener('DOMContentLoaded', () => {
  // ELEMENTLƏR
  const registerForm = document.getElementById('registerFormAction');
  const registerMessage = document.getElementById('registerMessage');
  const loginForm = document.getElementById('loginFormAction');
  // const loginMessage = document.getElementById('loginMessage'); // lazım olarsa aç
  const authButtons = document.querySelector('.auth-buttons');
  const userIcon = document.querySelector('.user-icon');

  const profileUpdateForm = document.getElementById('profileUpdateForm');
  const profileUpdateMessage = document.getElementById('profileUpdateMessage');

  const editPhotoBtn = document.getElementById('editPhotoBtn');
  const updatePhotoInput = document.getElementById('update_photo');
  const profilePhoto = document.getElementById('profilePhoto');

  const passwordForm = document.getElementById('passwordForm');
  const passwordMessage = document.getElementById('passwordMessage');
  const changePassBtn = document.getElementById('change-pass');

  // LOCAL STORAGE-DƏN İSTİFADƏÇİ MƏLUMATLARI
  let token = localStorage.getItem('token') || "";
  let userId = localStorage.getItem('userId') || "";

  // ==== FUNKSİYALAR ==== //

  function showMessage(element, message, isError = false) {
    if (!element) return;
    element.textContent = message;
    element.className = isError ? 'error' : 'success';
  }

  function showSuccess(message) {
    alert(message); // İstəyə görə Toast və ya modal ola bilər
  }

  function saveAuthState(data) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('userId', data.user.id);
    localStorage.setItem('fullName', data.user.full_name);
    localStorage.setItem('email', data.user.email);
    localStorage.setItem('phone', data.user.phone || '');
    localStorage.setItem('address', data.user.address || '');
  }

  function replaceAuthButton() {
    const authControl = document.getElementById('authControl');
    if (authControl) {
      authControl.innerHTML = `
        <a href="./profile.html">
         
      <img src="./assets/img/Profile.svg" alt="Profile">

        </a>
      `;
    }
    if (authButtons) authButtons.style.display = 'none';
    if (userIcon) userIcon.style.display = 'flex';
  }

  function hidePopup() {
    const popup = document.getElementById('popUP');
    const overlay = document.getElementById('overlay');
    if (popup) popup.style.display = 'none';
    if (overlay) overlay.style.display = 'none';
  }

  function displayProfilePhoto(url) {
    if (url) {
      profilePhoto.src = url;
      localStorage.setItem('profile_img', url);
    } else {
      profilePhoto.src = './assets/img/no-profile-picture-icon.svg';
      localStorage.removeItem('profile_img');
    }
  }

  // ==== SESİYON VARSA BUTTONLARI YENİLƏ ==== //
  if (token && userId) {
    replaceAuthButton();
  }

  // ==== REGISTER FORM HANDLER ==== //
registerForm?.addEventListener('submit', async e => {
  e.preventDefault();
  registerMessage.textContent = '';
  registerMessage.className = 'message';

  const full_name = registerForm.full_name.value.trim();
  const email = registerForm.email.value.trim();
  const phone = registerForm.phone.value.trim();
  const password = registerForm.password.value;

  if (!full_name || !email || !password || !phone) {
    showMessage(registerMessage, 'Zəhmət olmasa bütün sahələri doldurun.', true);
    return;
  }

  if (password.length < 8) {
    showMessage(registerMessage, 'Parol ən az 8 simvoldan ibarət olmalıdır.', true);
    return;
  }

  try {
    const res = await fetch('https://api.back.freshbox.az/api/user/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ full_name, email, password, phone }),
    });

    const data = await res.json();

    if (res.ok) {
      showSuccess(`Xoş gəldiniz, ${data.user.full_name}!`);
      registerForm.reset();
      saveAuthState(data);
      replaceAuthButton();
      hidePopup();
      if (window.innerWidth <= 768) window.location.href = './index.html';
    } else {
      showMessage(registerMessage, data.error || 'Xəta baş verdi.', true);
    }
  } catch {
    showMessage(registerMessage, 'Serverə qoşulmaq mümkün olmadı.', true);
  }
});

  // ==== LOGIN FORM HANDLER ==== //
  loginForm?.addEventListener('submit', async e => {
    e.preventDefault();

    const email = loginForm.email.value.trim();
    const password = loginForm.password.value;

    try {
      const res = await fetch('https://api.back.freshbox.az/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        showSuccess(`Добро пожаловать, ${data.user.full_name}!`);
        loginForm.reset();
        saveAuthState(data);
        replaceAuthButton();
        hidePopup();
        if (window.innerWidth <= 768) window.location.href = './index.html';
      } else {
        // Lazım olsa login mesajı göstərə bilərsən
      }
    } catch {
      // Lazım olsa server error mesajı göstərə bilərsən
    }
  });

  // ==== PROFİL MƏLUMATLARINI YÜKLƏ ==== //
  async function loadProfileData(userId) {
    try {
      const res = await fetch(`https://api.back.freshbox.az/api/user/with-profiles/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Profil məlumatları gətirilə bilmədi.');
      const data = await res.json();

      document.getElementById('update_full_name').value = data.full_name || '';
      document.getElementById('update_email').value = data.email || '';
      document.getElementById('update_phone').value = data.phone || '';
      document.getElementById('update_address').value = data.address || '';

      displayProfilePhoto(data.profl_img_url || data.profile_img_url || data.profile_img);
    } catch (err) {
      showMessage(profileUpdateMessage, err.message, true);
    }
  }

  if (profileUpdateForm && token && userId) {
    loadProfileData(userId);

    // Şəkil seçimi önizləmə (submit göndərmir)
    editPhotoBtn?.addEventListener('click', () => updatePhotoInput.click());

    updatePhotoInput?.addEventListener('change', e => {
      const file = e.target.files[0];
      if (!file) return;

      const maxFileSizeMB = 5;
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

      if (!allowedTypes.includes(file.type)) {
        alert('Yalnız JPEG, PNG və ya WEBP şəkilləri yükləyə bilərsiniz.');
        updatePhotoInput.value = '';
        return;
      }
      if (file.size > maxFileSizeMB * 1024 * 1024) {
        alert(`Şəkil ölçüsü maksimum ${maxFileSizeMB}MB olmalıdır.`);
        updatePhotoInput.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onload = function(evt) {
        profilePhoto.src = evt.target.result;
      };
      reader.readAsDataURL(file);
    });

    // FORM SUBMIT (şəkil + digər sahələr)
    profileUpdateForm.addEventListener('submit', async e => {
      e.preventDefault();
      profileUpdateMessage.textContent = '';
      profileUpdateMessage.className = 'message';

      try {
        const formData = new FormData(profileUpdateForm);

        if (updatePhotoInput.files.length > 0) {
          formData.append('profl_img', updatePhotoInput.files[0]);
        }

        const res = await fetch(`https://api.back.freshbox.az/api/user/profile/${userId}`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData,
        });

        const data = await res.json();

        if (res.ok) {
          showMessage(profileUpdateMessage, 'Profil məlumatları uğurla yeniləndi!');
          if (data.user?.profl_img_url) {
            displayProfilePhoto(data.user.profl_img_url);
          }
          updatePhotoInput.value = '';
        } else {
          showMessage(profileUpdateMessage, data.error || 'Xəta baş verdi.', true);
        }
      } catch {
        showMessage(profileUpdateMessage, 'Serverə qoşulmaq mümkün olmadı.', true);
      }
    });
  }

  // ==== LOGOUT MODAL ==== //
  const logoutModal = document.getElementById("logoutModal");
  const confirmLogoutBtn = document.getElementById("confirmLogout");
  const cancelLogoutBtn = document.getElementById("cancelLogout");

  window.showLogoutModal = function() {
    logoutModal.style.display = "flex";
  };

  cancelLogoutBtn?.addEventListener("click", () => {
    logoutModal.style.display = "none";
  });

  confirmLogoutBtn?.addEventListener("click", () => {
    localStorage.clear();
    logoutModal.style.display = "none";
    if (authButtons) authButtons.style.display = "flex";
    if (userIcon) userIcon.style.display = "none";
    window.location.href = "./index.html";
  });

  // ==== ŞİFRƏ DƏYİŞMƏ ==== //
  function showPasswordMessage(message, isError) {
    if (!passwordMessage) return;
    passwordMessage.textContent = message;
    passwordMessage.style.color = isError ? 'red' : 'green';
    passwordMessage.className = isError ? 'error' : 'success';
  }

  async function changePassword() {
    if (!passwordForm) return;

    const oldPassword = passwordForm.oldPassword.value.trim();
    const newPassword = passwordForm.newPassword.value.trim();
    const confirmPassword = passwordForm.confirmPassword.value.trim();

    showPasswordMessage('', false);

    if (!oldPassword || !newPassword || !confirmPassword) {
      showPasswordMessage('Bütün sahələri doldurun.', true);
      return;
    }

    if (newPassword.length < 8) {
      showPasswordMessage('Yeni parol ən azı 8 simvoldan ibarət olmalıdır.', true);
      return;
    }

    if (newPassword !== confirmPassword) {
      showPasswordMessage('Yeni parollar uyğun gəlmir.', true);
      return;
    }

    if (!token || !userId) {
      showPasswordMessage('İstifadəçi daxil olmayıb.', true);
      return;
    }

    try {
      const res = await fetch(`https://api.back.freshbox.az/api/user/password/${userId}`, {
        method: 'PUT',
        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ oldPassword, newPassword, confirmPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        showPasswordMessage('Parol uğurla dəyişdirildi!', false);
        passwordForm.reset();
      } else {
        showPasswordMessage(data.message || data.error || 'Xəta baş verdi.', true);
      }
    } catch {
      showPasswordMessage('Serverə qoşulmaq mümkün olmadı.', true);
    }
  }

  if (changePassBtn) {
    changePassBtn.addEventListener('click', changePassword);
  }
});


window.addEventListener('DOMContentLoaded', () => {
  const btnbar = document.getElementById('btnbar');

  function checkScreenSize() {
    if (window.innerWidth <= 400) {
      btnbar.style.display = 'inline';
    } else {
      btnbar.style.display = 'none';
    }
  }

  checkScreenSize();

  window.addEventListener('resize', checkScreenSize);

  window.addEventListener('scroll', () => {
    if (window.innerWidth <= 400) {
      if (window.scrollY < 100) {
        btnbar.style.color = '#f4901e'; // scroll azdırsa
      } else {
        btnbar.style.color = 'black'; // scroll çoxdursa
      }
    }
  });
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


  document.querySelectorAll('.cardRound').forEach(card => {
    card.addEventListener('click', () => {
      const categoryName = card.querySelector('span').innerText;
      // Сохраняем имя категории, передаём его через URL
      window.location.href = `shop.html?categoryTitle=${encodeURIComponent(categoryName)}`;
    });
  });
