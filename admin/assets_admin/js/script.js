const body = document.querySelector("body"),
  modeToggle = body.querySelector(".mode-toggle");
sidebar = body.querySelector("nav");
sidebarToggle = body.querySelector(".sidebar-toggle");
let getMode = localStorage.getItem("mode");
if (getMode && getMode === "dark") {
  body.classList.toggle("dark");
}
let getStatus = localStorage.getItem("status");
if (getStatus && getStatus === "close") {
  sidebar.classList.toggle("close");
}
modeToggle.addEventListener("click", () => {
  body.classList.toggle("dark");
  if (body.classList.contains("dark")) {
    localStorage.setItem("mode", "dark");
  } else {
    localStorage.setItem("mode", "light");
  }
});
sidebarToggle.addEventListener("click", () => {
  sidebar.classList.toggle("close");
  if (sidebar.classList.contains("close")) {
    localStorage.setItem("status", "close");
  } else {
    localStorage.setItem("status", "open");
  }
})

// skript əgər form daxil olmaq ucun dolu deyil onda admin panelə giriş qadağa olur

const token = localStorage.getItem('authToken');

if (!token) {
  // Если токена нет — выкидываем обратно
  window.location.href = './login.html';
}

function logout() {
  localStorage.removeItem('authToken');
  window.location.href = './login.html';
}


// tabs and animation

document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(".nav-links a");
  const tabs = document.querySelectorAll(".content-tab");

  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      const targetId = link.getAttribute("data-target");
      const targetTab = document.getElementById(targetId);

      if (targetTab.classList.contains("active")) return;

      tabs.forEach(tab => {
        tab.classList.remove("active");
      });

      setTimeout(() => {
        targetTab.classList.add("active");
      }, 10);
    });
  });
});



// Bu isə log out duynəsinə basanda login_to kecid edir 

function handleLogout() {



  window.location.href = "admin.html";
}