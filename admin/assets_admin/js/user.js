document.addEventListener('DOMContentLoaded', () => {
  const userBody = document.getElementById('user-body');
  const editModal = document.getElementById('edit-user-modal');
  const closeBtn = document.getElementById('close-edit-user-modal');
  const editForm = document.getElementById('edit-user-form');
  // const usernum = document.getElementById('usernum');
  const deleteConfirmModal = document.getElementById('delete-confirm-modal');
  const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
  const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
  const toast = document.getElementById('toast');
  const paginationContainer = document.getElementById('user-pagination');

  let users = [];
  let userIdToDelete = null;
  let currentPage = 1;
  const itemsPerPage = 5;

  function showToast(message, duration = 3000) {
    toast.textContent = message;
    toast.style.opacity = '1';
    toast.style.pointerEvents = 'auto';
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.pointerEvents = 'none';
    }, duration);
  }

  function fetchUsers() {
    return fetch('http://localhost:3000/api/user/with-profiles')
      .then(res => {
        if (!res.ok) throw new Error('Serverdən məlumat alınmadı');
        return res.json();
      });
  }

  function initUsers() {
    if (users.length === 0) {
      fetchUsers()
        .then(data => {
          users = data;
          // usernum.innerHTML = users.length;
          renderUsers();
          renderUserPagination();
        })
        .catch(err => {
          console.error(err);
          showToast('İstifadəçilər yüklənərkən xəta baş verdi');
        });
    } else {
      renderUsers();
      renderUserPagination();
    }
  }

  function refreshUsers() {
    fetchUsers()
      .then(data => {
        users = data;
        // usernum.innerHTML = users.length;
        renderUsers();
        renderUserPagination();
      })
      .catch(err => {
        console.error(err);
        showToast('Məlumat yenilənmədi');
      });
  }

  function renderUsers() {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedUsers = users.slice(start, end);

    userBody.innerHTML = paginatedUsers.map(user => `
      <tr>
        <td>${user.id}</td>
        <td>${user.full_name}</td>
        <td>${user.email}</td>
        <td>${user.phone}</td>
        <td>${user.address}</td>
        <td>${user.profile_created_at}</td>
        <td><img src="http://localhost:3000/uploads/profile_images/${user.profl_img}" alt="Profil" style="width:60px; border-radius:50%;"></td>
      <td>
          <button id="edit-btn-${user.id}" onclick="editUser(${user.id})">Redaktə et</button>
          <button id="delete-btn-${user.id}" onclick="openDeleteModal(${user.id})">Sil</button>
        </td>
      </tr>
    `).join('');
  }

  function renderUserPagination() {
    const totalPages = Math.ceil(users.length / itemsPerPage);
    paginationContainer.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement('button');
      btn.textContent = i;
      btn.style.padding = '5px 10px';
      btn.style.marginRight = '5px';
      btn.style.border = '1px solid #999';
      btn.style.backgroundColor = (i === currentPage) ? '#36b39d' : 'white';
      btn.style.color = (i === currentPage) ? 'white' : 'black';
      btn.style.cursor = 'pointer';

      btn.addEventListener('click', () => {
        currentPage = i;
        renderUsers();
      });

      paginationContainer.appendChild(btn);
    }
  }

  window.editUser = function(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return showToast('İstifadəçi tapılmadı');

    editModal.style.display = 'flex';
    document.getElementById('edit-user-id').value = user.id;
    document.getElementById('edit-full-name').value = user.full_name || '';
    document.getElementById('edit-email').value = user.email || '';
    document.getElementById('edit-phone').value = user.phone || '';
    document.getElementById('edit-address').value = user.address || '';
    document.getElementById('edit-profl-img').value = '';
  };

  closeBtn.addEventListener('click', () => {
    editModal.style.display = 'none';
  });

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

    fetch(`http://localhost:3000/api/user/profile/${userId}`, {
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
      refreshUsers(); // yalnız yenidən çək
    })
    .catch(err => {
      console.error(err);
      showToast('Yenilənərkən xəta baş verdi');
    });
  });

  window.openDeleteModal = function(userId) {
    userIdToDelete = userId;
    deleteConfirmModal.style.display = 'flex';
  };

  cancelDeleteBtn.addEventListener('click', () => {
    userIdToDelete = null;
    deleteConfirmModal.style.display = 'none';
  });

  confirmDeleteBtn.addEventListener('click', () => {
    if (!userIdToDelete) return;

    fetch(`http://localhost:3000/api/user/${userIdToDelete}`, {
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
      refreshUsers();
    })
    .catch(err => {
      console.error(err);
      showToast('Silinərkən xəta baş verdi');
      deleteConfirmModal.style.display = 'none';
      userIdToDelete = null;
    });
  });

  // İlk dəfə məlumatı yüklə
  initUsers();
});
