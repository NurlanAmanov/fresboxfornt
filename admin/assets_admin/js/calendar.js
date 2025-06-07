document.addEventListener('DOMContentLoaded', () => {
  const usernum = document.getElementById('usernum');
  const userList = document.getElementById('user-list');
  const chartCanvas = document.getElementById('user-chart');
  const startDateInput = document.getElementById('start-date');
  const endDateInput = document.getElementById('end-date');

  if (!usernum || !userList || !chartCanvas || !startDateInput || !endDateInput || typeof Chart === 'undefined') {
    console.error('Error: Missing elements or Chart.js library.');
    if (userList) userList.innerHTML = '<p style="color: #e74c3c;">Qrafik və ya elementlər tapılmadı.</p>';
    return;
  }

  let users = [];
  let userChart;

  function formatDate(dateString) {
    if (!dateString) return null;
    try {
      if (dateString.includes(', ')) {
        const [datePart, timePart] = dateString.split(', ');
        const [day, month, year] = datePart.split('.');
        const [hours, minutes, seconds] = timePart.split(':');
        return new Date(`${year}-${month}-${day}T${hours}:${minutes}:${seconds}`);
      }
      return new Date(dateString);
    } catch (e) {
      console.error('Date error:', dateString);
      return null;
    }
  }

  function showDailyStats(startDate = null, endDate = null) {
    // Tarix aralığına görə filtr
    const filteredUsers = users.filter(user => {
      const date = formatDate(user.created_at);
      if (!date) return false;
      if (startDate && endDate) {
        return date >= startDate && date <= endDate;
      }
      return true;
    });

    // Günlük statistika
    const dailyCounts = {};
    filteredUsers.forEach(user => {
      const date = formatDate(user.created_at);
      if (date) {
        const dayKey = date.toLocaleDateString('az-AZ', { day: '2-digit', month: 'long', year: 'numeric' });
        dailyCounts[dayKey] = (dailyCounts[dayKey] || 0) + 1;
      }
    });

    // Siyahı üçün HTML
    let html = '<li><strong>Günlük Statistikası:</strong></li>';
    for (const day in dailyCounts) {
      html += `<li>${day}: ${dailyCounts[day]} nəfər</li>`;
    }
    userList.innerHTML = Object.keys(dailyCounts).length ? html : '<li style="color: #7f8c8d;">İstifadəçi yoxdur.</li>';

    // Ümumi istifadəçi sayı
    usernum.textContent = filteredUsers.length;

    // Chart.js qrafiki
    if (userChart) userChart.destroy();
    userChart = new Chart(chartCanvas, {
      type: 'bar',
      data: {
        labels: Object.keys(dailyCounts).map(day => day.split(' ')[0] + ' ' + day.split(' ')[1]), // "01 May" formatı
        datasets: [{
          label: 'Günlük İstifadəçi Sayı',
          data: Object.values(dailyCounts),
          backgroundColor: 'rgba(30, 144, 255, 0.6)',
          borderColor: 'rgba(30, 144, 255, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: { beginAtZero: true, title: { display: true, text: 'İstifadəçi Sayı' } },
          x: { title: { display: true, text: 'Tarix' }, ticks: { autoSkip: true, maxTicksLimit: 10 } }
        },
        plugins: { legend: { display: true } },
        responsive: true
      }
    });
  }

  // Tarix seçimi dəyişəndə qrafiki yenilə
  function updateChart() {
    const startDate = startDateInput.value ? new Date(startDateInput.value) : null;
    const endDate = endDateInput.value ? new Date(endDateInput.value) : null;
    if (startDate && endDate && startDate <= endDate) {
      endDate.setDate(endDate.getDate() + 1); // Son tarixi daxil etmək üçün
      showDailyStats(startDate, endDate);
    } else {
      showDailyStats(); // Tarix seçilməyibsə bütün məlumatlar
    }
  }

  startDateInput.addEventListener('change', updateChart);
  endDateInput.addEventListener('change', updateChart);

  // API-dən məlumatları yüklə
  fetch('https://api.back.freshbox.az/api/user/all')
    .then(res => {
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      return res.json();
    })
    .then(data => {
      users = data;
    
      showDailyStats();
    })
    .catch(err => {
      console.error('API error:', err);
      userList.innerHTML = `<p style="color: #e74c3c;">Xəta: ${err.message}</p>`;
    });
});