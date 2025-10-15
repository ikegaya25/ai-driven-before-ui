# Clerk Webhook セットアップガイド

このガイドでは、ClerkのWebhookを設定してユーザー情報をデータベースに同期する方法を説明します。

## 1. データベースのマイグレーション

まず、新しいUserテーブルを作成するためにマイグレーションを実行します。

```bash
npx prisma migrate dev --name add_user_model
```

これにより、以下が実行されます：
- データベースに新しいUserテーブルが作成されます
- Postテーブルにuser関連のカラムが追加されます
- Prismaクライアントが再生成されます

## 2. Clerk Webhookの設定

### 2.1 Clerk Dashboardにアクセス

1. [Clerk Dashboard](https://dashboard.clerk.com/)にログイン
2. 使用しているアプリケーションを選択
3. 左メニューから「Webhooks」をクリック

### 2.2 Webhookエンドポイントを追加

1. 「Add Endpoint」ボタンをクリック
2. 以下の情報を入力：

   **Endpoint URL:**
   - 開発環境: `https://your-ngrok-url.ngrok.io/api/webhooks/clerk`
   - 本番環境: `https://yourdomain.com/api/webhooks/clerk`

   **Subscribe to events:**
   以下のイベントを選択してください：
   - ✅ `user.created` (ユーザー作成時)
   - ✅ `user.updated` (ユーザー更新時)
   - ✅ `user.deleted` (ユーザー削除時)

3. 「Create」ボタンをクリック

### 2.3 Webhook Secretを取得

1. 作成したWebhookエンドポイントをクリック
2. 「Signing Secret」をコピー
3. `.env.local`ファイルに追加：

```env
CLERK_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxxxxx
```

## 3. ローカル開発環境でのテスト

ローカル環境でWebhookをテストする場合は、ngrokを使用します。

### 3.1 ngrokのインストール

```bash
# Chocolateyを使用する場合
choco install ngrok

# または公式サイトからダウンロード
# https://ngrok.com/download
```

### 3.2 ngrokの起動

```bash
# Next.jsアプリを起動
npm run dev

# 別のターミナルでngrokを起動
ngrok http 3000
```

### 3.3 Clerk WebhookのURLを更新

ngrokから提供されたHTTPS URLを使用して、Clerk DashboardのWebhook URLを更新します：

```
https://xxxx-xxx-xxx-xxx-xxx.ngrok.io/api/webhooks/clerk
```

## 4. 動作確認

### 4.1 新規ユーザー登録

1. アプリケーションで新規ユーザー登録を実行
2. Clerk Dashboardの「Webhooks」→「Logs」で正常に送信されたか確認
3. データベースを確認：

```bash
npx prisma studio
```

4. Userテーブルに新しいレコードが追加されていることを確認

### 4.2 ログで確認

開発環境のコンソールログでも確認できます：
```
ユーザーを作成しました: { id: '...', clerkId: '...', email: '...' }
```

## 5. トラブルシューティング

### Webhook検証エラー

**エラー:** `Error: Verification error`

**解決策:**
- `CLERK_WEBHOOK_SECRET`が正しく設定されているか確認
- Clerk Dashboardで最新のSigning Secretを取得
- 環境変数を更新後、開発サーバーを再起動

### ユーザー作成エラー

**エラー:** `Error creating user`

**解決策:**
- データベース接続を確認
- マイグレーションが正しく実行されているか確認
- Prismaクライアントを再生成: `npx prisma generate`

### ngrok接続エラー

**解決策:**
- ngrokが正しく起動しているか確認
- Next.jsアプリが起動しているか確認（port 3000）
- ngrokの無料プランではセッションが期限切れになるため、URLを更新

## 6. 本番環境へのデプロイ

1. 本番環境のURLでWebhookエンドポイントを作成
2. 本番用の`CLERK_WEBHOOK_SECRET`を環境変数に設定
3. データベースのマイグレーションを実行
4. デプロイ後、テストユーザーで動作確認

## セキュリティのベストプラクティス

- ✅ Webhook Secretは絶対に公開しない
- ✅ `.env.local`はGitにコミットしない
- ✅ Webhook署名の検証を必ず実装（実装済み）
- ✅ 本番環境ではHTTPSを使用


