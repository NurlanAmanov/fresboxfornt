document.addEventListener('DOMContentLoaded', () => {
  const userBody = document.getElementById('user-body');
  const editModal = document.getElementById('edit-user-modal');
  const closeBtn = document.getElementById('close-edit-user-modal');
  const editForm = document.getElementById('edit-user-form');
const usernum = document.getElementById('usernum')
  const deleteConfirmModal = document.getElementById('delete-confirm-modal');
  const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
  const cancelDeleteBtn = document.getElementById('cancel-delete-btn');

  const toast = document.getElementById('toast');

  let users = [];
  let userIdToDelete = null;

  // Toast göstərmə funksiyası
  function showToast(message, duration = 3000) {
    toast.textContent = message;
    toast.style.opacity = '1';
    toast.style.pointerEvents = 'auto';
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.pointerEvents = 'none';
    }, duration);
  }

  // İstifadəçiləri serverdən yüklə və cədvələ doldur
  function loadUsers() {
    fetch('https://api.back.freshbox.az/api/user/with-profiles')
      .then(res => {
        if (!res.ok) throw new Error('Serverdən məlumat alınmadı');
        return res.json();
      })
      .then(data => {
        users = data;
        usernum.innerHTML=users.length
        userBody.innerHTML = users.map(user => `
          <tr>
            <td>${user.id}</td>
            <td>${user.full_name}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td>${user.address}</td>
            <td><img src="https://api.back.freshbox.az/uploads/profile_images/${user.profl_img}" alt="Profil" style="width:60px; border-radius:50%;"></td>
         <td>
  <button id="edit-btn-${user.id}" onclick="editUser(${user.id})">Redaktə et</button>
  <button id="delete-btn-${user.id}" onclick="openDeleteModal(${user.id})">Sil</button>
</td>

          </tr>
        `).join('');
      })
      .catch(err => {
        console.error(err);
        showToast('İstifadəçilər yüklənərkən xəta baş verdi');
      });
  }

  // Modal bağlama düyməsi
  closeBtn.addEventListener('click', () => {
    editModal.style.display = 'none';
  });

  // Redaktə modalı üçün funksional - istifadəçi tapıb formu doldur
  window.editUser = function(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) {
      showToast('İstifadəçi tapılmadı');
      return;
    }
    editModal.style.display = 'flex';

    document.getElementById('edit-user-id').value = user.id;
    document.getElementById('edit-full-name').value = user.full_name || '';
    document.getElementById('edit-email').value = user.email || '';
    document.getElementById('edit-phone').value = user.phone || '';
    document.getElementById('edit-address').value = user.address || '';
    document.getElementById('edit-profl-img').value = '';
  };

  // Form göndərilməsini idarə et və PUT sorğusu göndər
  editForm.addEventListener('submit', e => {
    e.preventDefault();

    const userId = document.getElementById('edit-user-id').value;

    const formData = new FormData();
    formData.append('full_name', document.getElementById('edit-full-name').value);
    formData.append('email', document.getElementById('edit-email').value);
    formData.append('phone', document.getElementById('edit-phone').value);
    formData.append('address', document.getElementById('edit-address').value);

    const fileInput = document.getElementById('edit-profl-img');
    if (fileInput.files.length > 0) {
      formData.append('profl_img', fileInput.files[0]);
    }

    fetch(`https://api.back.freshbox.az/api/user/profile/${userId}`, {
      method: 'PUT',
      body: formData
    })
    .then(res => {
      if (!res.ok) throw new Error('Yenilənmə uğursuz oldu');
      return res.json();
    })
    .then(data => {
      showToast(data.message || 'Profil uğurla yeniləndi');
      editModal.style.display = 'none';
      loadUsers();
    })
    .catch(err => {
      console.error(err);
      showToast('Yenilənərkən xəta baş verdi');
    });
  });

  // Silmə modalını aç
  window.openDeleteModal = function(userId) {
    userIdToDelete = userId;
    deleteConfirmModal.style.display = 'flex';
  };

  // Silmə modalını ləğv et
  cancelDeleteBtn.addEventListener('click', () => {
    userIdToDelete = null;
    deleteConfirmModal.style.display = 'none';
  });

  // Silməni təsdiqlə və DELETE sorğusu göndər
  confirmDeleteBtn.addEventListener('click', () => {
    if (!userIdToDelete) return;

    fetch(`https://api.back.freshbox.az/api/user/${userIdToDelete}`, {
      method: 'DELETE'
    })
    .then(res => {
      if (!res.ok) throw new Error('Silinmə uğursuz oldu');
      return res.json();
    })
    .then(data => {
      showToast(data.message || 'İstifadəçi uğurla silindi');
      deleteConfirmModal.style.display = 'none';
      userIdToDelete = null;
      loadUsers();
    })
    .catch(err => {
      console.error(err);
      showToast('Silinərkən xəta baş verdi');
      deleteConfirmModal.style.display = 'none';
      userIdToDelete = null;
    });
  });

  // İlk yüklənmə zamanı istifadəçiləri yüklə
  loadUsers();
});
