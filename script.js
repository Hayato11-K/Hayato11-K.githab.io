// 地図初期化（ズームコントロール非表示） 
<script>
  const map = L.map('map').setView([35.8335, 139.9555], 17);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // 自動販売機データ（校舎ごとに複数台）
  const vendingMachines = {
    'さつき棟': [
      { type: '飲料', eMoney: '対応' },
      { type: '軽食・飲料', eMoney: '非対応' }
    ],
    'かえで棟': [
      { type: '飲料', eMoney: '対応' }
    ],
    'あすなろ棟': [
      { type: '飲料', eMoney: '対応' },
      { type: 'スナック', eMoney: '対応' }
    ],
    'ひいらぎ館': [
      { type: '飲料', eMoney: '非対応' }
    ]
  };

  // 校舎ごとにマーカー設置＋ポップアップで自販機情報表示
  const buildings = {
    'さつき棟': [35.8340902, 139.9560946],
    'かえで棟': [35.8329853, 139.9552611],
    'あすなろ棟': [35.8322353, 139.9558780],
    'ひいらぎ館': [35.8342272, 139.9549993]
  };

  for (const [name, coords] of Object.entries(buildings)) {
    const marker = L.marker(coords).addTo(map);

    // 対応する自販機情報を整形
    const machines = vendingMachines[name] || [];
    let popupContent = `<strong>${name}</strong><br><br>`;

    if (machines.length === 0) {
      popupContent += '自動販売機情報なし';
    } else {
      machines.forEach(machine => {
        popupContent += `
          <div style="margin-bottom: 0.5rem;">
            <strong>${machine.location}</strong><br>
            種類: ${machine.type}<br>
            電子マネー: ${machine.eMoney}
          </div>
        `;
      });
    }

    marker.bindPopup(popupContent);
  }
</script>

// サイドバー開閉
document.getElementById('menu').addEventListener('click', () => {
  document.getElementById('sidebar').classList.toggle('show');
});
document.getElementById('closeSidebar').addEventListener('click', () => {
  document.getElementById('sidebar').classList.remove('show');
});

// 電子マネー・種類フィルター
document.querySelectorAll('.search-option').forEach(button => {
  button.addEventListener('click', () => {
    const filterType = button.dataset.filter;
    const filterValue = button.dataset.value;

    const filtered = vendingMachines.map(b => ({
      ...b,
      machines: b.machines.filter(vm => {
        if (filterType === "cashless") {
          return vm.cashless === (filterValue === "true");
        } else if (filterType === "type") {
          return vm.type === filterValue;
        }
        return true;
      })
    })).filter(b => b.machines.length > 0);

    renderMarkers(filtered);
    document.getElementById('sidebar').classList.remove('show');
  });
});

// 入力検索＋種類
document.getElementById('searchBtn').addEventListener('click', () => {
  const keyword = document.getElementById('searchInput').value.trim();
  const selectedType = document.getElementById('typeSelect').value;

  const filtered = vendingMachines.map(b => ({
    ...b,
    machines: b.machines.filter(vm => {
      const matchKeyword = b.building.includes(keyword);
      const matchType = selectedType === "" || vm.type === selectedType;
      return matchKeyword && matchType;
    })
  })).filter(b => b.machines.length > 0);

  renderMarkers(filtered);
  document.getElementById('sidebar').classList.remove('show');
});

// Enterキーでも検索実行
document.getElementById('searchInput').addEventListener('keypress', e => {
  if (e.key === 'Enter') {
    document.getElementById('searchBtn').click();
  }
});
