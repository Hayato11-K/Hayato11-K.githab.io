// 地図初期化（ズームコントロール非表示）
const map = L.map('map', {
  zoomControl: false // ← これで +− を非表示
}).setView([35.681236, 139.767125], 13);

// OSMタイル
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// あとは以前の `script.js` と同じ内容（前回送信済みの完全版）でOK

// 仮の自販機データ
const vendingMachines = [
  { lat: 35.681236, lng: 139.767125, name: "東京駅前", type: "飲料", cashless: true },
  { lat: 35.6895, lng: 139.6917, name: "新宿駅", type: "スナック", cashless: false },
  { lat: 35.710063, lng: 139.8107, name: "浅草寺前", type: "飲料", cashless: true },
  { lat: 35.7013, lng: 139.9826, name: "船橋駅", type: "飲料", cashless: false },
  { lat: 35.6146, lng: 140.1063, name: "千葉駅", type: "スナック", cashless: true },
    ];

// マーカー格納用
let markers = [];

// マーカー表示処理
function renderMarkers(filteredList = vendingMachines) {
  // 古いマーカー削除
  markers.forEach(m => map.removeLayer(m));
  markers = [];

  // 新しいマーカー描画
  filteredList.forEach(vm => {
    const marker = L.marker([vm.lat, vm.lng])
      .addTo(map)
      .bindPopup(`<b>${vm.name}</b><br>種類: ${vm.type}<br>電子マネー: ${vm.cashless ? "対応" : "非対応"}`);
    markers.push(marker);
  });
}

// 初期表示
renderMarkers();

// 現在地取得ボタン
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

// サイドバーの開閉
document.getElementById('menu').addEventListener('click', () => {
  document.getElementById('sidebar').classList.toggle('show');
});
document.getElementById('closeSidebar').addEventListener('click', () => {
  document.getElementById('sidebar').classList.remove('show');
});

// サイドバーのボタン（電子マネー or 種類）フィルター（単独フィルター）
document.querySelectorAll('.search-option').forEach(button => {
  button.addEventListener('click', () => {
    const filterType = button.dataset.filter;
    const filterValue = button.dataset.value;

    let filtered = vendingMachines;

    if (filterType === "cashless") {
      filtered = vendingMachines.filter(vm => vm.cashless === (filterValue === "true"));
    } else if (filterType === "type") {
      filtered = vendingMachines.filter(vm => vm.type === filterValue);
    }

    renderMarkers(filtered);
    document.getElementById('sidebar').classList.remove('show');
  });
});

// 🔍 入力検索＋種類のプルダウン検索
document.getElementById('searchBtn').addEventListener('click', () => {
  const keyword = document.getElementById('searchInput').value.trim();
  const selectedType = document.getElementById('typeSelect').value;

  let filtered = vendingMachines;

  renderMarkers(filtered);
  document.getElementById('sidebar').classList.remove('show');
});

// 🔍 Enterキーでも検索実行
document.getElementById('searchInput').addEventListener('keypress', e => {
  if (e.key === 'Enter') {
    document.getElementById('searchBtn').click();
  }
});
