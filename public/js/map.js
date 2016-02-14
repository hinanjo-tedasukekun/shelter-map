/*
 * 避難所マップのテスト
 */

/*global $, L */

// ポップアップを複数開けるように拡張する
L.Map = L.Map.extend({
  openPopup: function openPopup(popup, latlng, options) {
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
      updatedAt: "2015/04/01 00:00:00",

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
    newShelter = function newShelter(params) {
      var shelter = Object.create(shelterProto);

      shelter.id = params.id;
      shelter.name = params.name;
      shelter.address = params.address;

      // 座標はコピーする
      shelter.coord = params.coord.slice();

      shelter.numOfRefugees = params.numOfRefugees;
      shelter.updatedAt = params.updatedAt;

      return shelter;
    },

    // 避難所一覧
    /*
    shelters = [
      newShelter({
        id: 1,
        name: "白脇小学校",
        address: "南区寺脇町431",
        coord: [34.681929, 137.745106],
        numOfRefugees: 100,
        updatedAt: "2016/02/12 18:00:00"
      }),
      newShelter({
        id: 2,
        name: "砂丘小学校",
        address: "南区白羽町2512",
        coord: [34.667674, 137.725985],
        numOfRefugees: 100,
        updatedAt: "2016/02/12 18:00:00"
      }),
      newShelter({
        id: 3,
        name: "新津小学校",
        address: "南区新橋町777",
        coord: [34.682699, 137.702913],
        numOfRefugees: 100,
        updatedAt: "2016/02/12 18:00:00"
      }),
      newShelter({
        id: 4,
        name: "新津中学校",
        address: "南区新橋町748",
        coord: [34.683363, 137.701334],
        numOfRefugees: 100,
        updatedAt: "2016/02/12 18:00:00"
      }),
      newShelter({
        id: 5,
        name: "（旧）五島小学校",
        address: "南区西島町510",
        coord: [34.6663412, 137.7649839],
        numOfRefugees: 100,
        updatedAt: "2016/02/12 18:00:00"
      }),
      newShelter({
        id: 6,
        name: "（旧）遠州浜小学校",
        address: "南区遠州浜二丁目9-1",
        coord: [34.6681237, 137.7701123],
        numOfRefugees: 100,
        updatedAt: "2016/02/12 18:00:00"
      }),
      newShelter({
        id: 7,
        name: "河輪小学校",
        address: "南区東町333",
        coord: [34.676141, 137.782332],
        numOfRefugees: 100,
        updatedAt: "2016/02/12 18:00:00"
      }),
      newShelter({
        id: 8,
        name: "東陽中学校",
        address: "南区西町700",
        coord: [34.680748, 137.777398],
        numOfRefugees: 100,
        updatedAt: "2016/02/12 18:00:00"
      }),
      newShelter({
        id: 9,
        name: "芳川小学校",
        address: "南区芳川町206-1",
        coord: [34.692464, 137.766868],
        numOfRefugees: 100,
        updatedAt: "2016/02/12 18:00:00"
      }),
      newShelter({
        id: 10,
        name: "南陽中学校",
        address: "南区芳川町80",
        coord: [34.693644, 137.764735],
        numOfRefugees: 100,
        updatedAt: "2016/02/12 18:00:00"
      }),
      newShelter({
        id: 11,
        name: "芳川北小学校",
        address: "南区頭陀寺町1046-1",
        coord: [34.698932, 137.760976],
        numOfRefugees: 100,
        updatedAt: "2016/02/12 18:00:00"
      }),
      newShelter({
        id: 12,
        name: "飯田小学校",
        address: "南区飯田町978",
        coord: [34.698932, 137.760976],
        numOfRefugees: 100,
        updatedAt: "2016/02/12 18:00:00"
      }),
      newShelter({
        id: 13,
        name: "東部中学校",
        address: "南区飯田町1038",
        coord: [34.703039, 137.773882],
        numOfRefugees: 100,
        updatedAt: "2016/02/12 18:00:00"
      }),
      newShelter({
        id: 14,
        name: "可美小学校",
        address: "南区若林町1748",
        coord: [34.689835, 137.694976],
        numOfRefugees: 100,
        updatedAt: "2016/02/12 18:00:00"
      }),
      newShelter({
        id: 15,
        name: "可美中学校",
        address: "南区増楽町700",
        coord: [34.687923, 137.690746],
        numOfRefugees: 100,
        updatedAt: "2016/02/12 18:00:00"
      }),
      newShelter({
        id: 16,
        name: "南の星小学校",
        address: "南区西島町1148-1",
        coord: [34.662516, 137.768776],
        numOfRefugees: 100,
        updatedAt: "2016/02/12 18:00:00"
      }),
    ],
    */

    // 高いビル一覧
    buildings = [
      newShelter({
        id: 0,
        name: '浜松南区役所避難所',
        address: '南区江之島町600番地の1',
        coord: [34.66751, 137.75212],
        numOfRefugees: 1234,
        updatedAt: "2016/02/12 17:40:00"
      }),
      //newShelter(19, 'ポリテクカレッジ浜松避難所', '南区法枝町693', [34.67734, 137.72008], 567),
    ],

    // 地図オブジェクト
    map = L.map('map', {
      center: [34.67734, 137.72008],
      zoom: 13,
      // ズームレベルを保存したタイルの範囲に制限する
      minZoom: 13,
      maxZoom: 15,
      // 表示できる領域をタイルの範囲に制限する
      maxBounds: [
        [34.617, 137.559],
        [34.778, 137.834]
      ],
      layers: [
        // ローカル環境に保存したタイルを使う
        L.tileLayer('tiles/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        })
      ]
    }),

    // 円の大きさを避難者数から計算する
    circleSize = function circleSize(shelter) {
      return 10 * Math.sqrt(shelter.numOfRefugees);
    },

    // jQuery オブジェクト
    $totalNum = $('#total-num'),
    $errors = $('#errors');

  // 非同期通信でデータを取得する
  $.ajax("./shelters.json", {
    dataType: 'json',

    // 取得に成功したときの処理
    success: function loadSuccess(data) {
      // 避難者数の合計を計算する
      var
        shelters = data.map(function (shelter) {
          return newShelter(shelter);
        }),
        addNumOfRefugees = function addNumOfRefugees(sum, shelter) {
          return sum + shelter.numOfRefugees;
        },
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

        // 赤丸を描く
        L.circle(shelter.coord, circleSize(shelter), {
          color: 'red',
          fillColor: '#f03',
          fillOpacity: 0.25
        }).addTo(map);

        // マーカーを設置し、ポップアップと結びつける
        marker = L.marker(shelter.coord).
          addTo(map).
          bindPopup(shelter.getPopupText());

        // 最近更新されていたらポップアップを開く
        // 数値はミリ秒単位
        if (now - dtUpdatedAt < 3000) {
          marker.openPopup();
        }
      });
    },

    // 取得に失敗したときの処理
    error: function loadError(jqXHR, textStatus, errorThrown) {
      // エラーメッセージを表示する
      $errors.
        text(textStatus + ": " + errorThrown).
        show();
    }
  });

  // 各ビルを表示する
  buildings.forEach(function (shelter) {
    // 緑丸を描く
    L.circle(shelter.coord, circleSize(shelter), {
      color: 'green',
      fillColor: 'green',
      fillOpacity: 0.25
    }).addTo(map);

    // マーカーを設置し、ポップアップと結びつける
    L.marker(shelter.coord).
      addTo(map).
      bindPopup(shelter.getPopupText());
  });
});
