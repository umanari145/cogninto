# cogninto_sample

Cogninto(AWSの認証サービス)のサンプル

## ファイル構成

- index.html 最初にメールアドレスとパスワードを登録(仮登録状態)
- verification.html コード登録
- signin.html アカウントが有効になっていることの確認(consoleにtokenあり)
- js/main.js 認証ロジックをここに記述
- js/aws_config.js awsの環境変数


## ビルド
```
npm run dev
```

## 開発時
```
npm run watch
```


## 認証フロー

1. index.htmlで最初にメールアドレスとパスワードを登録(この状態では仮登録)
2. メールが届き、コードが書かれている
3. verification.htmlでメールアドレスとコードを登録
4. 成功すればユーザーが認証される。その後、ユーザーとパスワードを入力してアカウントが認証されていることが確認できる