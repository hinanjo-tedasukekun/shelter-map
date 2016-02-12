/*
 * 避難所マップのテスト
 */

// ポップアップを複数開けるように拡張する
L.Map = L.Map.extend({
  openPopup: function (popup, latlng, options) {
    if (!(popup instanceof L.Popup)) {
      var content = popup;

      popup = new L.Popup(options).setContent(content);
    }

    if (latlng) {
      popup.setLatLng(latlng);
    }

    if (this.hasLayer(popup)) {
      return this;
    }

    // NOTE THIS LINE : COMMENTING OUT THE CLOSEPOPUP CALL
    //this.closePopup();
    this._popup = popup;
    return this.addLayer(popup);
  }
});

$(function () {
  var
    // 避難所オブジェクトのプロトタイプ
    shelterProto = {
      // 番号
      id: 0,
      // 避難所名
      name: '',
      // 避難所の所在地
      address: '',
      // 座標
      coord: null,
      // 避難者数
      numOfRefugees: 0,
      // 更新日時
      updatedAt: "",

      // ポップアップのテキストを返す
      getPopupText: function getPopupText() {
        var parts = [
          '<p><b>[',
          this.id,
          '] ',
          this.name,
          '</b></p>',
          '<dl><dt>所在地</dt><dd>',
          this.address,
          '</dd><dt>避難者数</dt><dd>',
          this.numOfRefugees,
          '</dd><dt>更新日時</dt><dd>',
          this.updatedAt,
          '</dd></dl>'
        ];
        return parts.join('');
      }
    },

    // 新しい避難所オブジェクトを返す
    newShelter = function newShelter(id, name, address, coord, numOfRefugees, updatedAt) {
      var shelter = Object.create(shelterProto);

      shelter.id = id;
      shelter.name = name;
      shelter.address = address;
      shelter.coord = coord;
      shelter.numOfRefugees = numOfRefugees;
      shelter.updatedAt = updatedAt;

      return shelter;
    },

    // 避難所一覧
    /*
    shelters = [
      newShelter(1, "白脇小学校", "南区寺脇町431", [34.681929, 137.745106], 100),
      newShelter(2, "砂丘小学校", "南区白羽町2512", [34.667674, 137.725985], 100),
      newShelter(3, "新津小学校", "南区新橋町777", [34.682699, 137.702913], 100),
      newShelter(4, "新津中学校", "南区新橋町748", [34.683363, 137.701334], 100),
      newShelter(5, "（旧）五島小学校", "南区西島町510", [34.6663412, 137.7649839], 100),
      newShelter(6, "（旧）遠州浜小学校", "南区遠州浜二丁目9-1", [34.6681237, 137.7701123], 100),
      newShelter(7, "河輪小学校", "南区東町333", [34.676141, 137.782332], 100),
      newShelter(8, "東陽中学校", "南区西町700", [34.680748, 137.777398], 100),
      newShelter(9, "芳川小学校", "南区芳川町206-1", [34.692464, 137.766868], 100),
      newShelter(10, "南陽中学校", "南区芳川町80", [34.693644, 137.764735], 100),
      newShelter(11, "芳川北小学校", "南区頭陀寺町1046-1", [34.698932, 137.760976], 100),
      newShelter(12, "飯田小学校", "南区飯田町978", [34.698932, 137.760976], 100),
      newShelter(13, "東部中学校", "南区飯田町1038", [34.703039, 137.773882], 100),
      newShelter(14, "可美小学校", "南区若林町1748", [34.689835, 137.694976], 100),
      newShelter(15, "可美中学校", "南区増楽町700", [34.687923, 137.690746], 100),
      newShelter(16, "南の星小学校", "南区西島町1148-1", [34.662516, 137.768776], 100),
    ],
    */

    // 高いビル一覧
    buildings = [
      newShelter(0, '浜松南区役所避難所', '南区江之島町600番地の1', [34.66751, 137.75212], 1234, "2016/02/12 17:40:00"),
      //newShelter(19, 'ポリテクカレッジ浜松避難所', '南区法枝町693', [34.67734, 137.72008], 567),
    ],

    // 地図オブジェクト
    map = L.map('map').setView([34.67734, 137.72008], 13),
    circleSize = function circleSize(shelter) {
      return 10 * Math.sqrt(shelter.numOfRefugees);
    },
    $totalNum = $('#total-num'),
    $errors = $('#errors');

  // OpenStreetMap サーバーから地図を表示するように設定する
  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  // 非同期通信でデータを取得する
  $.ajax("./shelters.json", {
    dataType: 'json',
    success: function loadSuccess(data) {
      // 避難者数の合計を計算する
      var
        shelters = data.map(function (s) {
          return newShelter(
            s.id,
            s.name,
            s.address,
            s.coord,
            s.numOfRefugees,
            s.updatedAt
          );
        }),
        addNumOfRefugees = function addNumOfRefugees(acc, s) { return acc + s.numOfRefugees; },
        totalNumInShelters = shelters.reduce(addNumOfRefugees, 0),
        totalNumInBuildings = buildings.reduce(addNumOfRefugees, 0),
        totalNum = totalNumInShelters + totalNumInBuildings,
        now = new Date();

      $totalNum.text(totalNum);

      // 各避難所を表示する
      shelters.forEach(function (shelter) {
        var
          dtUpdatedAt = new Date(shelter.updatedAt),
          marker;

        // 赤丸
        L.circle(shelter.coord, circleSize(shelter), {
          color: 'red',
          fillColor: '#f03',
          fillOpacity: 0.25
        }).addTo(map);

        // マーカー
        marker = L.marker(shelter.coord).
          addTo(map).
          bindPopup(shelter.getPopupText());

        // 最近更新されていたらポップアップを開く
        if (now - dtUpdatedAt < 3000) {
          marker.openPopup();
        }
      });
    },
    error: function loadError(jqXHR, textStatus, errorThrown) {
      $errors.
        text(textStatus + ": " + errorThrown).
        show();
    }
  });

  // 各ビルを表示する
  buildings.forEach(function (shelter) {
    // 緑丸
    L.circle(shelter.coord, circleSize(shelter), {
      color: 'green',
      fillColor: 'green',
      fillOpacity: 0.25
    }).addTo(map);

    // マーカー
    L.marker(shelter.coord).
      addTo(map).
      bindPopup(shelter.getPopupText());
      //openPopup();
  });
});
