   // Инициализация AOS
        AOS.init();

        let modalPage = document.getElementById("modalPage");
        let popUP = document.getElementById("popUP");
        let overlay = document.getElementById("overlay");
        let closeBtn = document.getElementById("closeBtn");

        // Функция для открытия модального окна
        function openPopup() {
            popUP.classList.remove("hide-popup"); // Убираем класс закрытия
            popUP.classList.add("show-popup");
            popUP.style.visibility = "visible";
            overlay.classList.add("active-overlay");
            AOS.refresh();
        }

        // Функция для закрытия модального окна
        function closePopup() {
            popUP.classList.remove("show-popup");
            popUP.classList.add("hide-popup");
            overlay.classList.remove("active-overlay");

            // Убираем окно после завершения анимации
            setTimeout(() => {
                popUP.style.visibility = "hidden";
            }, 300);
        }

        // Открытие окна
        modalPage.addEventListener("click", openPopup);

        // Закрытие окна только при клике на крестик
        closeBtn.addEventListener("click", closePopup);



  // ФОРМА И АНИМАЦИЯ

// Function to handle the form switch
function switchForm(formType) {
    // Toggle active button class with smooth transition
    const buttons = document.querySelectorAll('.switchButtons button');
    buttons.forEach(button => {
        button.classList.remove('active'); // Remove active class from all buttons
        button.style.opacity = 0.6; // Set non-active buttons opacity to 0.6
    });

    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    // Apply fade-out and fade-in for forms
    if (formType === 'login') {
        document.querySelector('.switchButtons button:first-child').classList.add('active');
        document.querySelector('.switchButtons button:first-child').style.opacity = 1; // Set active button opacity to 1

        // Fade-out the register form before switching
        if (registerForm.style.display === 'block') {
            registerForm.style.transition = "opacity 0.5s ease-in-out";
            registerForm.style.opacity = 0; // Fade out register form
            setTimeout(() => {
                registerForm.style.display = 'none'; // Hide after fade-out
            }, 500); // Wait for fade-out to complete
        }

        // Fade-in the login form after a delay
        setTimeout(() => {
            loginForm.style.display = 'block';
            loginForm.style.transition = "opacity 0.5s ease-in-out";
            loginForm.style.opacity = 1; // Fade in the login form
        }, 500); // Wait for fade-out to complete before showing login form

    } else {
        document.querySelector('.switchButtons button:last-child').classList.add('active');
        document.querySelector('.switchButtons button:last-child').style.opacity = 1; // Set active button opacity to 1

        // Fade-out the login form before switching
        if (loginForm.style.display === 'block') {
            loginForm.style.transition = "opacity 0.5s ease-in-out";
            loginForm.style.opacity = 0; // Fade out login form
            setTimeout(() => {
                loginForm.style.display = 'none'; // Hide after fade-out
            }, 500); // Wait for fade-out to complete
        }

        // Fade-in the register form after a delay
        setTimeout(() => {
            registerForm.style.display = 'block';
            registerForm.style.transition = "opacity 0.5s ease-in-out";
            registerForm.style.opacity = 1; // Fade in the register form
        }, 500); // Wait for fade-out to complete before showing register form
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

function openNav() {
  // Open the sidebar and overlay
  document.getElementById("mySidebar").classList.add("open");
  document.getElementById("overlaytus").classList.add("show");

  // Disable scrolling by setting the body's and html's overflow to 'hidden'
  document.body.style.overflow = 'hidden';
  document.documentElement.style.overflow = 'hidden'; // This ensures scrolling is disabled for the entire document
}

function closeNav() {
  // Close the sidebar and overlay
  document.getElementById("mySidebar").classList.remove("open");
  document.getElementById("overlaytus").classList.remove("show");

  // Re-enable scrolling by restoring the body's and html's overflow property
  document.body.style.overflow = '';
  document.documentElement.style.overflow = ''; // This restores the default scrolling behavior
}

const languageBtn = document.querySelector('.language-btn');
const languageDropdown = document.querySelector('.language-dropdown');
const arrowIcon = document.querySelector('.arrow-icon'); // выбираем стрелку

languageBtn.addEventListener('click', () => {
    languageDropdown.classList.toggle('open');
    arrowIcon.classList.toggle('rotated'); // переключаем класс для поворота
});
