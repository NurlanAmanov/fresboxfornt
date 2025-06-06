const roundMain = document.getElementById('roundMain');

async function getCategory() {
  const url = "https://api.back.freshbox.az/api/kategoriya/all";
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Response status: ${response.status}`);

    const categories = await response.json();

    roundMain.innerHTML = '';

    categories.forEach(cat => {
      const div = document.createElement('div');
      div.className = 'cardRound';
      div.style.cursor = 'pointer';

      div.innerHTML = `
        <div class="circle">
          <img style="object-position: left;" src="https://api.back.freshbox.az/uploads/category_images/${cat.image}">
        </div>
        <span>${cat.title}</span>
      `;

      // Klik eventi əlavə et
      div.addEventListener('click', () => {
        // URL-ə kateqoriya başlığını query param kimi əlavə edirik
        const categoryTitleEncoded = encodeURIComponent(cat.title);
        window.location.href = `shopcategory.html?categoryTitle=${categoryTitleEncoded}`;
      });

      roundMain.appendChild(div);
    });
  } catch (error) {
    console.error(error.message);
  }
}

getCategory();
