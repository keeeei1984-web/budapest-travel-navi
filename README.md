# Budapest Travel Navi

2027年2月10日〜13日、ブダペスト旅行向けの日本語PWAです。React・TypeScript・Viteで作成し、APIキーなしで動きます。

## 使い方

- **ホーム**でホテルに戻る、次の目的地へ移動、ホテルと航空便の編集ができます。次の目的地は選択日にある最初の未訪問予定です。
- **移動**で出発地・目的地・移動方法を選びます。Google マップが経路と所要時間を表示します。ナビの利用可否は端末、移動方法、出発地に依存します。
- **旅程**で日付を選び、候補・ホテル・空港を追加できます。矢印で順序を編集し、予約時刻やメモを保存できます。
- **候補**で観光地・レストランを追加、並べ替え、削除できます。「詳細・並べ替え」から料理、メモ、公式サイト、予約URLを編集できます。
- **ツール**で交通・100Eの案内、英語とハンガリー語の会話、通貨換算、持ち物を確認できます。レートはFrankfurterの公開APIで取得し、基準日と端末への保存日時を表示します。

ホテルは要確認です。店舗の営業、提供メニュー、予約状況は利用前に各店舗で確認してください。データは端末のブラウザに保存されます。別端末への同期はありません。Safariのデータを消去すると編集内容も削除されます。

## iPhoneから初回公開

1. 下記のソース一式を取得して「ファイル」アプリでZIPを展開します。
2. SafariでGitHubを開き、空の**公開**リポジトリ（例として `budapest-travel-navi`）を作ります。既定ブランチ名は `main` にします。
3. リポジトリの **Add file → Upload files** でファイルを追加します。階層を保持してアップロードできない場合は、**Add file → Create new file** で `src/main.tsx` のようにパスを入力して、ZIP内の各テキストファイルの内容を貼り付けます。`.github/workflows/pages.yml`、`package-lock.json` も登録します。
4. 写真やアイコンはバイナリファイルです。リポジトリ内で `public` フォルダを開き、**Add file → Upload files** からZIP内の `public` にある画像を選びます。
5. GitHubの **Settings → Pages → Build and deployment → Source** を **GitHub Actions** に変更します。
6. **Actions → Build and publish to GitHub Pages → Run workflow** から `main` で実行します。成功後の **Settings → Pages** に公開URLが表示されます。
7. 公開URLをiPhoneのSafariで開き、共有メニューから **ホーム画面に追加 → 追加** を選びます。追加したアイコンからオンラインで起動し、「オフライン準備済み」を確認します。機内モードで開き直し、旅程や会話集を確認できます。

公開リポジトリには予約番号や個人情報を含めないでください。個人用メモはアプリの編集欄に入力します。オフラインで旅程や会話集を開けます。外部の地図・予約・最新レートの取得は通信が必要です。英語音声はiPhoneの音声設定に依存します。

## iPhoneから更新

日々の旅程・候補・チェックリストはアプリ内で編集すると端末に保存されます。アプリコードや初期候補を変える場合は、SafariでGitHubの対象ファイルを開き、鉛筆アイコンで編集してコミットします。`main` の更新後にActionsがビルドと再公開を行います。公開後はアプリを閉じて開き直し、更新を確認します。初期候補の変更は、保存済みの候補がまだない端末で反映されます。

- `src/data.ts` は候補、日付、会話集、持ち物の初期データ
- `src/tools.tsx` は交通ガイドと旅行ツール
- `src/style.css` は配色やレイアウト
- `public/manifest.webmanifest` はホーム画面用の情報

## ローカル開発

Node.js 24を使用します。

```sh
npm ci
npm run dev
npm run build
npm run preview
```

製品ビルドにはService Workerが含まれます。オフライン確認には `npm run preview` を使います。

[GitHub Pagesの公開元設定](https://docs.github.com/ja/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) · [Appleのホーム画面追加手順](https://support.apple.com/ja-jp/guide/iphone/iphea86e5236/ios) · [写真（Unsplash）](https://images.unsplash.com/photo-1549877452-9c387954fbc2)
