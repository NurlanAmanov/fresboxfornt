// DOM elementlərini əldə et
const productBody = document.getElementById('product-body');
const modal = document.getElementById("product-modal");
const closeModal = document.getElementById("close-modal");
const form = document.getElementById("product-form");
const categorySelect = document.getElementById('category_id');
const deleteConfirmModal = document.getElementById('delete-confirm-modal');
const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
const mehnum = document.getElementById("mehnum");

let products = [];
let editingProductId = null;  // Redaktə edilən məhsulun ID-si
let productIdToDelete = null; // Silinəcək məhsulun ID-si

// Toast funksiyası
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.style.visibility = 'visible';
  toast.style.opacity = '1';

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.visibility = 'hidden';
  }, 3000);
}

// Məhsulları backend-dən çəkmək və göstərmək
async function loadProducts() {
  try {
    const res = await fetch('https://api.back.freshbox.az/api/product/all');
    if (!res.ok) throw new Error('Məhsullar yüklənmədi');

    products = await res.json();

    // Debug üçün console
 

    renderProducts();
    mehnum.textContent = products.length; // Məhsul sayını göstər

  } catch (err) {
    console.error(err);
    showToast('Məhsullar yüklənərkən xəta baş verdi');
  }
}

// Məhsulları cədvələ əlavə etmək (event delegation üçün data-id istifadə olunur)
function renderProducts() {
  productBody.innerHTML = products.map(product => {
    // id və ya _id istifadə etmək (serverdən gələn məlumatın strukturu)
    const id = product.id ?? product._id ?? 'unknown';

    return `
    <tr>
      <td>${id}</td>
      <td>${product.title}</td>
      <td>${product.description}</td>
      <td>${product.price} ₼</td>
      <td>${product.stock}</td>
      <td>${product.discount > 0 ? product.discount + '%' : '-'}</td>
      <td>${product.weight > 0 ? product.weight : '-'} kq</td>
      <td>${product.number > 0 ? product.number : '-'}</td>
      <td>${product.liter ? product.liter + 'L' : '-'}</td>
      <td>${product.quantity > 0 ? product.quantity : '-'}</td>
      <td>${product.category_title}</td>
      <td><img src="https://api.back.freshbox.az/uploads/product/${product.image}" alt="${product.title}" style="width: 60px;"></td>
      <td>
        <button class="edit-btn" data-id="${id}">Redaktə et</button>
        <button class="delete-btn" data-id="${id}">Sil</button>
      </td>
    </tr>
  `}).join('');
}

// Event delegation - Redaktə və Sil düymələrinin kliklərini idarə et
productBody.addEventListener('click', (e) => {
  if (e.target.classList.contains('edit-btn')) {
    const id = e.target.getAttribute('data-id');
    if (id) openEditModal(id);
  }
  if (e.target.classList.contains('delete-btn')) {
    const id = e.target.getAttribute('data-id');
    if (id) deleteProduct(id);
  }
});

// Modal açma funksiyaları
document.getElementById('add-product-btn').addEventListener('click', () => {
  editingProductId = null;
  form.reset();
  modal.style.display = 'block';
});

closeModal.addEventListener('click', () => {
  modal.style.display = 'none';
  form.reset();
});

window.addEventListener('click', e => {
  if (e.target === modal) {
    modal.style.display = 'none';
    form.reset();
  }
});

// Məhsul redaktəsi üçün modal açma
function openEditModal(productId) {
  // productId string ola bilər, ona görə == yox, === yox, lax yoxlama
  const product = products.find(p => (p.id == productId || p._id == productId));
  if (!product) return showToast("Məhsul tapılmadı");

  editingProductId = productId;

  form.title.value = product.title || '';
  form.description.value = product.description || '';
  form.price.value = product.price || '';
  form.stock.value = product.stock || '';
  form.discount.value = product.discount || '';
  form.weight.value = product.weight || '';
  form.number.value = product.number || '';
  form.liter.value = product.liter || '';
  form.quantity.value = product.quantity || '';
  form.category_id.value = product.category_id || '';
  form.image.value = ''; // Yeni şəkil yükləmək üçün sıfırla

  modal.style.display = 'block';
}

// Form submit funksiyası (əlavə et / redaktə et)
form.addEventListener('submit', async e => {
  e.preventDefault();

  const formData = new FormData(form);
  const url = editingProductId
    ? `https://api.back.freshbox.az/api/product/${editingProductId}`
    : 'https://api.back.freshbox.az/api/product/add';

  const method = editingProductId ? 'PUT' : 'POST';

  try {
    const res = await fetch(url, { method, body: formData });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Xəta baş verdi');
    }

    showToast(editingProductId ? 'Məhsul redaktə olundu' : 'Məhsul əlavə edildi');
    modal.style.display = 'none';
    form.reset();
    editingProductId = null;
    loadProducts();

  } catch (err) {
    console.error(err);
    showToast(err.message);
  }
});

// Kateqoriyaları yükləmək və select-ə əlavə etmək
async function loadCategories() {
  try {
    const res = await fetch('https://api.back.freshbox.az/api/kategoriya/all');
    if (!res.ok) throw new Error('Kateqoriyalar yüklənmədi');

    const data = await res.json();
    categorySelect.innerHTML = '<option value="">Kateqoriya seçin</option>';
    data.forEach(category => {
      const option = document.createElement('option');
      option.value = category.id ?? category._id ?? '';
      option.textContent = category.title ?? 'Unknown';
      categorySelect.appendChild(option);
    });
  } catch (err) {
    console.error(err);
    showToast('Kateqoriyalar yüklənərkən xəta baş verdi');
  }
}

// Məhsulu silmək funksiyası və təsdiq modalı
function deleteProduct(productId) {
  productIdToDelete = productId;
  deleteConfirmModal.style.display = 'flex';
}

confirmDeleteBtn.addEventListener('click', async () => {
  if (!productIdToDelete) return;

  try {
    const res = await fetch(`https://api.back.freshbox.az/api/product/${productIdToDelete}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Məhsul silinmədi');

    showToast('Məhsul uğurla silindi');
    loadProducts();

  } catch (err) {
    console.error(err);
    showToast('Məhsul silinərkən xəta baş verdi');
  } finally {
    productIdToDelete = null;
    deleteConfirmModal.style.display = 'none';
  }
});

cancelDeleteBtn.addEventListener('click', () => {
  productIdToDelete = null;
  deleteConfirmModal.style.display = 'none';
});

// Səhifə yüklənəndə
window.onload = () => {
  loadProducts();
  loadCategories();
};
