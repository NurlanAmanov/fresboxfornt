document.addEventListener("DOMContentLoaded", () => {
  const tbody = document.getElementById("payment-body");
  const activity = document.getElementById('activity-data');
  let payments = [];

  // Statusların backend-ə uyğun ingiliscə dəyərləri və istifadəçiyə azərbaycanca label-lər
  const orderStatuses = [
    { value: 'pending', label: 'Gözləyir' },
    { value: 'accepted', label: 'Qəbul edildi' },
    { value: 'shipped', label: 'Göndərildi' },
    { value: 'delivered', label: 'Çatdırıldı' },
    { value: 'cancelled', label: 'Ləğv edildi' }
  ];

  function renderPaymentsTable() {
    tbody.innerHTML = "";

    payments.forEach(payment => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td data-label="ID">${payment.order_id}</td>
        <td data-label="İstifadəçi">${payment.full_name}</td>
        <td data-label="Email">${payment.email}</td>
        <td data-label="Ünvan">${payment.address}, ${payment.city_name}</td>
        <td data-label="Məbləğ">${payment.total_price}₼</td>
        <td data-label="Tarix">${new Date(payment.created_at).toLocaleDateString('az-AZ')}</td>
        <td data-label="Status">
          <select onchange="changeOrderStatus(${payment.order_id}, this.value)">
            ${orderStatuses.map(status => `
              <option value="${status.value}" ${payment.status === status.value ? 'selected' : ''}>
                ${status.label}
              </option>
            `).join('')}
          </select>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  function renderActivityTable() {
    if (!payments.length) {
      activity.innerHTML = '<p style="text-align:center; color: gray;">Heç bir fəaliyyət yoxdur</p>';
      return;
    }

    let tableHTML = `
      <table border="1" style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="padding: 8px; text-align: left;">ID</th>
            <th style="padding: 8px; text-align: left;">İstifadəçi</th>
            <th style="padding: 8px; text-align: left;">Status</th>
            <th style="padding: 8px; text-align: left;">Tarix</th>
          </tr>
        </thead>
        <tbody>
          ${payments.map(payment => `
            <tr>
              <td style="padding: 8px;">${payment.order_id}</td>
              <td style="padding: 8px;">${payment.full_name}</td>
              <td style="padding: 8px;">
                ${orderStatuses.find(s => s.value === payment.status)?.label || payment.status}
              </td>
              <td style="padding: 8px;">${new Date(payment.created_at).toLocaleString('az-AZ')}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    activity.innerHTML = tableHTML;
  }

  window.changeOrderStatus = function(orderId, newStatus) {
    console.log("Göndərilən orderId:", orderId);
    console.log("Göndərilən newStatus:", newStatus);

    fetch("https://api.back.freshbox.az/api/admin/order/status", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        order_id: orderId,
        status: newStatus
      })
    })
    .then(res => {
      if (!res.ok) throw new Error("Status yenilənmədi");
      return res.json();
    })
    .then(data => {
      alert(data.message || "Status uğurla yeniləndi");
      loadPayments();
    })
    .catch(err => {
      console.error(err);
      alert("Status yenilənərkən xəta baş verdi");
    });
  };

  function loadPayments() {
    fetch("https://api.back.freshbox.az/api/admin/orders")
      .then(res => {
        if (!res.ok) throw new Error("Məlumat alınarkən xəta baş verdi");
        return res.json();
      })
      .then(data => {
        payments = data;
        renderPaymentsTable();
        renderActivityTable();
      })
      .catch(err => {
        console.error(err);
        tbody.innerHTML = `<tr><td colspan="7" style="color:red; text-align:center;">Məlumat yüklənmədi</td></tr>`;
        activity.innerHTML = '<p style="color:red; text-align:center;">Fəaliyyət məlumatı yüklənmədi</p>';
      });
  }

  loadPayments();
});
