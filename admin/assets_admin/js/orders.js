document.addEventListener("DOMContentLoaded", () => {
  const tbody = document.getElementById("payment-body");
  const activity = document.getElementById("activity-data");
  const paginationContainer = document.getElementById("payment-pagination");
  let payments = [];
  let currentPage = 1;
  const itemsPerPage = 5;

  const orderStatuses = [
    { value: "pending", label: "Gözləyir" },
    { value: "accepted", label: "Qəbul edildi" },
    { value: "shipped", label: "Göndərildi" },
    { value: "delivered", label: "Çatdırıldı" },
    { value: "cancelled", label: "Ləğv edildi" },
  ];

  function renderPaymentsTable() {
    tbody.innerHTML = "";

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedPayments = payments.slice(start, end);

    paginatedPayments.forEach((payment) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td data-label="ID">${payment.order_id}</td>
        <td data-label="İstifadəçi">${payment.full_name}</td>
        <td data-label="Email">${payment.email}</td>
        <td data-label="Ünvan">${payment.address}, ${payment.city_name}</td>
        <td data-label="Məbləğ">${payment.total_price}₼</td>
        <td data-label="Tarix">${new Date(payment.created_at).toLocaleDateString("az-AZ")}</td>
        <td data-label="Status">
          <select onchange="changeOrderStatus(${payment.order_id}, this.value)">
            ${orderStatuses
              .map(
                (status) => `
              <option value="${status.value}" ${
                  payment.status === status.value ? "selected" : ""
                }>
                ${status.label}
              </option>`
              )
              .join("")}
          </select>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  function renderActivityTable() {
    if (!payments.length) {
      activity.innerHTML =
        '<p style="text-align:center; color: gray;">Heç bir fəaliyyət yoxdur</p>';
      return;
    }

    let tableHTML = `
      <table border="1" style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="padding: 8px;">ID</th>
            <th style="padding: 8px;">İstifadəçi</th>
            <th style="padding: 8px;">Status</th>
            <th style="padding: 8px;">Tarix</th>
          </tr>
        </thead>
        <tbody>
          ${payments
            .map(
              (payment) => `
            <tr>
              <td style="padding: 8px;">${payment.order_id}</td>
              <td style="padding: 8px;">${payment.full_name}</td>
              <td style="padding: 8px;">
                ${
                  orderStatuses.find((s) => s.value === payment.status)?.label ||
                  payment.status
                }
              </td>
              <td style="padding: 8px;">${new Date(
                payment.created_at
              ).toLocaleString("az-AZ")}</td>
            </tr>`
            )
            .join("")}
        </tbody>
      </table>
    `;

    activity.innerHTML = tableHTML;
  }

  function renderPagination() {
    paginationContainer.innerHTML = "";
    const totalPages = Math.ceil(payments.length / itemsPerPage);

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      btn.style.padding = "5px 10px";
      btn.style.marginRight = "5px";
      btn.style.border = "1px solid #999";
      btn.style.backgroundColor = i === currentPage ? "#36b39d" : "white";
      btn.style.color = i === currentPage ? "white" : "black";
      btn.style.cursor = "pointer";

      btn.addEventListener("click", () => {
        currentPage = i;
        renderPaymentsTable();
        renderPagination();
      });

      paginationContainer.appendChild(btn);
    }
  }

  window.changeOrderStatus = function (orderId, newStatus) {
    fetch("http://localhost:3000/api/admin/order/status", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        order_id: orderId,
        status: newStatus,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Status yenilənmədi");
        return res.json();
      })
      .then((data) => {
        alert(data.message || "Status uğurla yeniləndi");
        loadPayments();
      })
      .catch((err) => {
        console.error(err);
        alert("Status yenilənərkən xəta baş verdi");
      });
  };

  function loadPayments() {
    fetch("http://localhost:3000/api/admin/orders")
      .then((res) => {
        if (!res.ok) throw new Error("Məlumat alınarkən xəta baş verdi");
        return res.json();
      })
      .then((data) => {
        payments = data;
        currentPage = 1;
        renderPaymentsTable();
        renderActivityTable();
        renderPagination();
      })
      .catch((err) => {
        console.error(err);
        tbody.innerHTML = `<tr><td colspan="7" style="color:red; text-align:center;">Məlumat yüklənmədi</td></tr>`;
        activity.innerHTML =
          '<p style="color:red; text-align:center;">Fəaliyyət məlumatı yüklənmədi</p>';
      });
  }

  loadPayments();
});
