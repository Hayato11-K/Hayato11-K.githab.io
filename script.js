// 地図初期化
const map = L.map('map').setView([35.681236, 139.767125], 13);

// OpenStreetMapタイル
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// 仮データ
const vendingMachines = [
  { lat: 35.681236, lng: 139.767125, name: "東京駅前", type: "飲料", cashless: true },
  { lat: 35.6895, lng: 139.6917, name: "新宿駅", type: "スナック", cashless: false },
  { lat: 35.710063, lng: 139.8107, name: "浅草寺前", type: "飲料", cashless: true },
];

// マーカー表示
vendingMachines.forEach(vm => {
  L.marker([vm.lat, vm.lng])
    .addTo(map)
    .bindPopup(`<b>${vm.name}</b><br>種類: ${vm.type}<br>電子マネー: ${vm.cashless ? "対応" : "非対応"}`);
});

// 現在地ボタン
document.getElementById('locateMe').addEventListener('click', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      map.setView([lat, lng], 15);
      L.marker([lat, lng]).addTo(map).bindPopup("現在地").openPopup();
    }, () => {
      alert("現在地の取得に失敗しました");
    });
  } else {
    alert("このブラウザでは現在地取得がサポートされていません");
  }
});

// サイドバー表示切り替え
const menuBtn = document.getElementById('menu');
const sidebar = document.getElementById('sidebar');

menuBtn.addEventListener('click', () => {
  sidebar.classList.toggle('show');
});

// 検索項目選択時（仮のアラート表示）
document.querySelectorAll('.search-option').forEach(button => {
  button.addEventListener('click', () => {
    const value = button.dataset.value;
    alert(`「${button.textContent}」が選択されました（機能は開発中）`);
    sidebar.classList.remove('show'); // 選択後にメニュー閉じる
  });
});
// 閉じるボタンでサイドバー非表示
document.getElementById('closeSidebar').addEventListener('click', () => {
  sidebar.classList.remove('show');
});
