const animationDiv = document.querySelector('.animation-orange');

animationDiv.addEventListener('animationend', () => {
  animationDiv.classList.add('animation-ended');
});