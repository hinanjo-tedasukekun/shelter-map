# 避難所マップ 試作版
避難所を地図に表示するプログラムの試作版です。OpenStreetMap の地図データを使い、その上に避難者数等の情報を表示します。

現時点ではインターネットに接続する必要があります。地図データをダウンロードできたら、インターネットに接続していなくても使えるようになります。

![避難所マップ](shelter-map.png)

# 準備
ダウンロードしたファイルは `C:\\shelter-map` に置いてください。

初回のみ Ruby のライブラリのインストールが必要です。Ruby をインストールした Cygwin 上で以下を実行します。

```
gem install --no-document --http-proxy='プロキシサーバーのアドレス' sinatra
```

本部用プログラムを起動する前に、Cygwin上で以下を実行してローカル環境用 Web サーバーを起動しておきます。

```
cd /cygdrive/c/shelter-map
ruby app.rb
```

その後、本部用プログラムを起動すると地図が表示されます。

# 使用ライブラリ
* [Leaflet](http://leafletjs.com/)
* [Sinatra](http://www.sinatrarb.com/)
