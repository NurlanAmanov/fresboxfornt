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
const paginationDiv = document.getElementById("pagination");

let products = [];
let editingProductId = null;  // Redaktə edilən məhsulun ID-si
let productIdToDelete = null; // Silinəcək məhsulun ID-si

// Pagination üçün dəyişənlər
let currentPage = 1;
const itemsPerPage = 10;

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
async function loadProducts(page = 1) {
  try {
    const res = await fetch('http://localhost:3000/api/product/all');
    if (!res.ok) throw new Error('Məhsullar yüklənmədi');

    products = await res.json();
    mehnum.textContent = products.length;

    currentPage = page;
    renderProducts();
    renderPagination();

  } catch (err) {
    console.error(err);
    showToast('Məhsullar yüklənərkən xəta baş verdi');
  }
}

// Məhsulları səhifəyə uyğun göstər
function renderProducts() {
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedProducts = products.slice(start, end);

  productBody.innerHTML = paginatedProducts.map(product => {
    const id = product.id ?? product._id ?? 'unknown';

    return `
      <tr>
        <td>${id}</td>
        <td>${product.title}</td>
        <td class="ellipsis">${product.description}</td>
        <td>${product.price} ₼</td>
        <td>${product.discount > 0 ? product.discount + '%' : '-'}</td>
        <td>${product.weight > 0 ? product.weight : '-'} kq</td>
        <td>${product.number > 0 ? product.number : '-'}</td>
        <td>${product.liter ? product.liter + 'L' : '-'}</td>
        <td>${product.quantity > 0 ? product.quantity : '-'}</td>
        <td>${product.category_title}</td>
        <td><img src="http://localhost:3000/uploads/product/${product.image}" alt="${product.title}" style="width: 60px;"></td>
        <td>
          <button class="edit-btn" data-id="${id}">Redaktə et</button>
          <button class="delete-btn" data-id="${id}">Sil</button>
        </td>
      </tr>
    `;
  }).join('');
}

// Pagination düymələri yarat
function renderPagination() {
  const totalPages = Math.ceil(products.length / itemsPerPage);
  paginationDiv.innerHTML = '';

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    btn.style.padding = '5px 10px';
    btn.style.border = '1px solid #999';
    btn.style.cursor = 'pointer';
    btn.style.backgroundColor = (i === currentPage) ? '#36b39d' : 'white';
    btn.style.color = (i === currentPage) ? 'white' : 'black';

    btn.addEventListener('click', () => loadProducts(i));
    paginationDiv.appendChild(btn);
  }
}

// Event delegation - Redaktə və Sil düymələri
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

// Modal açma
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

// Məhsulu redaktə et
function openEditModal(productId) {
  const product = products.find(p => (p.id == productId || p._id == productId));
  if (!product) return showToast("Məhsul tapılmadı");

  editingProductId = productId;
  form.title.value = product.title || '';
  form.description.value = product.description || '';
  form.price.value = product.price || '';
  form.discount.value = product.discount || '';
  form.weight.value = product.weight || '';
  form.number.value = product.number || '';
  form.liter.value = product.liter || '';
  form.quantity.value = product.quantity || '';
  form.category_id.value = product.category_id || '';
  form.image.value = '';

  modal.style.display = 'block';
}

// Form submit (Əlavə / Redaktə)
form.addEventListener('submit', async e => {
  e.preventDefault();
  const formData = new FormData(form);
  const url = editingProductId
    ? `http://localhost:3000/api/product/${editingProductId}`
    : 'http://localhost:3000/api/product/add';
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
    loadProducts(currentPage);

  } catch (err) {
    console.error(err);
    showToast(err.message);
  }
});

// Kateqoriyaları yüklə
async function loadCategories() {
  try {
    const res = await fetch('http://localhost:3000/api/kategoriya/all');
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

// Məhsul silmək
function deleteProduct(productId) {
  productIdToDelete = productId;
  deleteConfirmModal.style.display = 'flex';
}

confirmDeleteBtn.addEventListener('click', async () => {
  if (!productIdToDelete) return;

  try {
    const res = await fetch(`http://localhost:3000/api/product/${productIdToDelete}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Məhsul silinmədi');

    showToast('Məhsul uğurla silindi');
    loadProducts(currentPage);

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

// Başlanğıcda məhsulları və kateqoriyaları yüklə
window.onload = () => {
  loadProducts();
  loadCategories();
};
