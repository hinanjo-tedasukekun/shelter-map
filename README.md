# 避難所マップ
避難所情報を地図に表示する Web アプリです。[OpenStreetMap](http://www.openstreetmap.org/) の地図データを使い、その上に避難者数等の情報を表示します。

地図データをローカル環境で生成したため、インターネットに接続する必要がなくなりました。

![避難所マップ](shelter-map.png)

# 準備
ダウンロードしたファイルは `C:\shelter-map\` に置いてください。

初回のみ Ruby のライブラリのインストールが必要です。Ruby をインストールした Cygwin 上で以下を実行します。

```sh
gem install --no-document --http-proxy='プロキシサーバーのアドレス' sinatra
```

本部用プログラムを起動する前に、Cygwin上で以下を実行してローカル環境用 Web サーバーを起動しておきます。

```sh
cd /cygdrive/c/shelter-map
ruby app.rb
```

その後、本部用プログラムを起動すると地図が表示されます。

# 使用ライブラリ
* [Leaflet](http://leafletjs.com/)
* [Sinatra](http://www.sinatrarb.com/)
