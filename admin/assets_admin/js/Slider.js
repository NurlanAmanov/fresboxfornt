document.addEventListener('DOMContentLoaded', () => {
  const sliderBody = document.getElementById('slider-body');
  const addSliderBtn = document.getElementById('add-slider-btn');
  const sliderModal = document.getElementById('slider-modal');
  const closeSliderModal = document.getElementById('close-slider-modal');
  const sliderForm = document.getElementById('slider-form');
  const toast = document.getElementById('toast');
  const sliderTitle = document.getElementById('slider-title');
  const sliderSubtitle = document.getElementById('slider-subtitle');
  const sliderImage = document.getElementById('slider-image');
  const sliderMessage = document.getElementById('sliderMessage');

  // Toast funksiyası
  function showToast(message, duration = 3000) {
    if (!toast) return;
    toast.textContent = message;
    toast.style.opacity = '1';
    setTimeout(() => { toast.style.opacity = '0'; }, duration);
  }

  // Sliderləri çək və cədvələ yaz
  async function loadSliders() {
    try {
      const res = await fetch('http://localhost:3000/api/slider/all');
      if (!res.ok) throw new Error('Sliderlər yüklənmədi');
      const sliders = await res.json();
      renderSliders(sliders);
    } catch (err) {
      showToast('Sliderlər yüklənmədi');
      if (sliderBody) sliderBody.innerHTML = '<tr><td colspan="5">Slider tapılmadı</td></tr>';
    }
  }

  function renderSliders(sliders = []) {
    if (!sliderBody) return;
    sliderBody.innerHTML = '';
    sliders.forEach(slider => {
      sliderBody.innerHTML += `
        <tr>
          <td>${slider.id}</td>
          <td>${slider.title}</td>
          <td>${slider.subtitle || ''}</td>
          <td>
            ${slider.image ? `<img src="http://localhost:3000/uploads/slider/${slider.image}" style="width:60px;">` : '-'}
          </td>
          <td>
            <button class="edit-btn" data-id="${slider.id}">Redaktə et</button>
            <button class="delete-btn" data-id="${slider.id}">Sil</button>
          </td>
        </tr>
      `;
    });
  }

  // Event delegation: Sil və Redaktə
  if (sliderBody) {
    sliderBody.addEventListener('click', async (e) => {
      const id = e.target.getAttribute('data-id');
      if (e.target.classList.contains('delete-btn')) {
        if (confirm('Slideri silmək istədiyinizə əminsiniz?')) {
          try {
            const res = await fetch(`http://localhost:3000/api/slider/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Silinmədi');
            showToast('Slider silindi!');
            loadSliders();
          } catch (err) {
            showToast('Silinərkən xəta baş verdi');
          }
        }
      }
      if (e.target.classList.contains('edit-btn')) {
        // Slideri tap və modalı doldur
        try {
          const res = await fetch(`http://localhost:3000/api/slider/all`);
          const sliders = await res.json();
          const slider = sliders.find(s => s.id == id);
          if (!slider) return showToast('Slider tapılmadı');
          sliderTitle.value = slider.title || '';
          sliderSubtitle.value = slider.subtitle || '';
          sliderImage.value = '';
          sliderForm.setAttribute('data-edit-id', id);
          sliderModal.style.display = 'block';
        } catch (err) {
          showToast('Slider tapılmadı');
        }
      }
    });
  }

  // Yeni slider əlavə et və ya redaktə et (POST/PUT)
  if (sliderForm) {
    sliderForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      sliderMessage.textContent = '';
      const formData = new FormData(sliderForm);
      const editId = sliderForm.getAttribute('data-edit-id');
      let url = 'http://localhost:3000/api/slider/add';
      let method = 'POST';
      if (editId) {
        url = `http://localhost:3000/api/slider/${editId}`;
        method = 'PUT';
      }
      try {
        const res = await fetch(url, { method, body: formData });
        const data = await res.json();
        if (res.ok) {
          showToast(editId ? 'Slider redaktə olundu!' : 'Slider əlavə olundu!');
          sliderForm.reset();
          sliderForm.removeAttribute('data-edit-id');
          if (sliderModal) sliderModal.style.display = 'none';
          loadSliders();
        } else {
          sliderMessage.textContent = data.error || 'Xəta baş verdi';
        }
      } catch (err) {
        sliderMessage.textContent = 'Serverə qoşulmaq olmur';
      }
    });
  }

  // Modal aç/bağla
  if (addSliderBtn && sliderModal) {
    addSliderBtn.addEventListener('click', () => {
      sliderModal.style.display = 'block';
      sliderForm.reset();
      sliderForm.removeAttribute('data-edit-id');
      sliderMessage.textContent = '';
    });
  }
  if (closeSliderModal && sliderModal) {
    closeSliderModal.addEventListener('click', () => {
      sliderModal.style.display = 'none';
      sliderForm.reset();
      sliderForm.removeAttribute('data-edit-id');
      sliderMessage.textContent = '';
    });
  }

  // İlk yükləmə
  loadSliders();
});