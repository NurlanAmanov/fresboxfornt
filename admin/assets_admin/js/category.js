document.addEventListener('DOMContentLoaded', () => {
  let categories = [];
  let categoryToDeleteId = null;

  // Toast funksiyası
  function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.style.opacity = '1';
    toast.style.pointerEvents = 'auto';

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.pointerEvents = 'none';
    }, duration);
  }

  // Elementlər
  const categoryBody = document.getElementById("category-body");
  const categoryModal = document.getElementById("category-modal");
  const closeCategoryModal = document.getElementById("close-category-modal");
  const categoryForm = document.getElementById("category-form");
  const addCategoryBtn = document.getElementById('add-category-btn');
  const categoryMessage = document.getElementById('categoryMessage');
  const categoryFileInput = document.getElementById('category-file');
const katnum = document.getElementById('katnum')
  const editCategoryModal = document.getElementById('edit-category-modal');
  const closeEditCategoryModalBtn = document.getElementById('close-edit-category-modal');
  const categoryTitleInput = document.getElementById('category-title');
  const editCategoryForm = document.getElementById('edit-category-form');
  const currentImageName = document.getElementById('current-image-name');

  // Silmək üçün modal elementləri
  const deleteConfirmModal = document.getElementById('delete-confirm-modal');
  const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
  const cancelDeleteBtn = document.getElementById('cancel-delete-btn');

  let currentCategoryId = null;

  // Fayl adı göstəricisi əlavə et
  const fileNameDisplay = document.createElement('span');
  categoryFileInput.insertAdjacentElement('afterend', fileNameDisplay);
  fileNameDisplay.textContent = 'Fayl seçilməyib';

  categoryFileInput.addEventListener('change', () => {
    if (categoryFileInput.files.length > 0) {
      fileNameDisplay.textContent = categoryFileInput.files[0].name;
    } else {
      fileNameDisplay.textContent = 'Fayl seçilməyib';
    }
  });

  // Kateqoriyaları serverdən yüklə və göstər
  async function loadCategories() {
    try {
      const response = await fetch('http://localhost:3000/api/kategoriya/all');
      if (!response.ok) throw new Error('Serverdən məlumat alınarkən xəta baş verdi');
      categories = await response.json();
      renderCategories(categories);
      katnum.innerHTML=categories.length

      
    } catch (error) {
      console.error(error);
      showToast('Kateqoriyalar yüklənərkən xəta baş verdi.');
    }
  }

  // Kateqoriyaları table-a yaz
  function renderCategories(categories = []) {
    categoryBody.innerHTML = '';
    categories.forEach(cat => {
      categoryBody.innerHTML += `
        <tr>
          <td>${cat.id}</td>
          <td>${cat.title}</td>
          <td><img src="http://localhost:3000/uploads/category_images/${cat.image}" alt="${cat.title}" style="width:50px; height:auto;"></td>
          <td>
            <button class="edit-btn" onclick="editCategory(${cat.id})">Redaktə et</button>
            <button class="delete-btn" onclick="deleteCategory(${cat.id})">Sil</button>
          </td>
        </tr>
      `;
    });
  }

  // Kateqoriyanı redaktə etmək üçün modalı aç və məlumatları doldur
  window.editCategory = function(categoryId) {
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) {
      showToast('Kateqoriya tapılmadı');
      return;
    }
    currentCategoryId = category.id;
    categoryTitleInput.value = category.title;
    currentImageName.textContent = category.image || 'Şəkil yoxdur';
    editCategoryModal.style.display = 'block';
  };

  // Sil düyməsinə basanda modalı aç və kateqoriya id-sini yadda saxla
  window.deleteCategory = function(catId) {
    categoryToDeleteId = catId;
    deleteConfirmModal.style.display = 'flex';
  };

  // Silmək təsdiqləndi
  confirmDeleteBtn.addEventListener('click', async () => {
    if (!categoryToDeleteId) return;

    try {
      const response = await fetch(`http://localhost:3000/api/kategoriya/${categoryToDeleteId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Silmə əməliyyatı uğursuz oldu');
      showToast('Kateqoriya uğurla silindi.');
      await loadCategories();
    } catch (error) {
      console.error('Silərkən xəta:', error);
      showToast('Kateqoriya silinərkən xəta baş verdi.');
    } finally {
      deleteConfirmModal.style.display = 'none';
      categoryToDeleteId = null;
    }
  });

  // Silmə əməliyyatını ləğv et
  cancelDeleteBtn.addEventListener('click', () => {
    deleteConfirmModal.style.display = 'none';
    categoryToDeleteId = null;
  });

  // Modal xaricinə kliklə bağlamaq
  window.addEventListener('click', (e) => {
    if (e.target === categoryModal) {
      categoryModal.style.display = 'none';
      categoryForm.reset();
      fileNameDisplay.textContent = 'Fayl seçilməyib';
      categoryMessage.textContent = '';
      categoryMessage.className = 'message';
    }
    if (e.target === editCategoryModal) {
      editCategoryModal.style.display = 'none';
      editCategoryForm.reset();
    }
    if (e.target === deleteConfirmModal) {
      deleteConfirmModal.style.display = 'none';
      categoryToDeleteId = null;
    }
  });

  // Yeni kateqoriya əlavə etmə modalını aç
  if (addCategoryBtn) {
    addCategoryBtn.addEventListener('click', () => {
      categoryModal.style.display = 'block';
    });
  }

  // Yeni kateqoriya modalını bağla
  if (closeCategoryModal) {
    closeCategoryModal.addEventListener('click', () => {
      categoryModal.style.display = 'none';
      categoryForm.reset();
      fileNameDisplay.textContent = 'Fayl seçilməyib';
      categoryMessage.textContent = '';
      categoryMessage.className = 'message';
    });
  }

  // Yeni kateqoriya əlavə etmə form submit
  if (categoryForm) {
categoryForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  categoryMessage.textContent = '';
  categoryMessage.className = 'message';

  const formData = new FormData(categoryForm);

  if (!formData.get('title')) {
    categoryMessage.textContent = 'Kateqoriya adı daxil edin.';
    categoryMessage.classList.add('error');
    return;
  }
  const imageFile = formData.get('image');
  if (!imageFile || imageFile.size === 0) {
    categoryMessage.textContent = 'Kateqoriya üçün şəkil seçin.';
    categoryMessage.classList.add('error');
    return;
  }

  try {
    const res = await fetch('http://localhost:3000/api/kategoriya', {
      method: 'POST',
      body: formData,  // multipart/form-data avtomatik olur
    });
    const data = await res.json();

    if (res.ok) {
      showToast('Kateqoriya əlavə edildi!');
      categoryForm.reset();
      fileNameDisplay.textContent = 'Fayl seçilməyib';
      categoryModal.style.display = 'none';
      await loadCategories();
    } else {
      categoryMessage.textContent = data.error || 'Xəta baş verdi.';
      categoryMessage.classList.add('error');
    }
  } catch (err) {
    categoryMessage.textContent = 'Serverə qoşulmaq mümkün olmadı.';
    categoryMessage.classList.add('error');
    console.error(err);
  }
});

  }

  // Redaktə modalını bağlama düyməsi
  if (closeEditCategoryModalBtn) {
    closeEditCategoryModalBtn.addEventListener('click', () => {
      editCategoryModal.style.display = 'none';
      editCategoryForm.reset();
    });
  }

  // Kateqoriya redaktə formu submit
  if (editCategoryForm) {
    editCategoryForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const updatedTitle = categoryTitleInput.value.trim();
      if (!updatedTitle) {
        showToast('Kateqoriya adı boş ola bilməz.');
        return;
      }

      try {
        const res = await fetch(`http://localhost:3000/api/kategoriya/${currentCategoryId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: updatedTitle }),
        });
        const data = await res.json();

        if (res.ok) {
          showToast('Kateqoriya uğurla yeniləndi!');
          editCategoryModal.style.display = 'none';
          editCategoryForm.reset();
          await loadCategories();
        } else {
          showToast(data.error || 'Xəta baş verdi.');
        }
      } catch (err) {
        showToast('Serverə qoşulmaq mümkün olmadı.');
        console.error(err);
      }
    });
  }

  // İlk kateqoriyaları yüklə
  loadCategories();
});
