# 環境変数設定

以下の環境変数を`.env`ファイルに追加してください：

```env
# 既存の設定
DATABASE_URL="postgresql://postgres.fzspopkevvdvxiwacalq:あなたのパスワード@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres"
CLERK_WEBHOOK_SECRET=whsec_YTk1PyJUnY3TU7iEj4F40PuUxwyga6N+

# 新しく追加する設定
NEXT_PUBLIC_SUPABASE_URL=https://fzspopkevvdvxiwacalq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=あなたのSupabaseのanonキー
```

## Supabaseの設定値の取得方法

1. https://supabase.com/dashboard にアクセス
2. あなたのプロジェクトを選択
3. 左メニューの「Settings」→「API」をクリック
4. 以下をコピー：
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Supabase Storageの設定

1. Supabase Dashboard → Storage
2. 「Create a new bucket」をクリック
3. バケット名: `images`
4. Public bucket: **ON**（公開バケットにする）
5. 「Create bucket」をクリック

## 次のステップ

1. 環境変数を設定
2. データベースマイグレーションを実行:
   ```bash
   npx prisma migrate dev --name add_favorites_and_images
   ```
3. Prismaクライアントを再生成:
   ```bash
   npx prisma generate
   ```
4. Next.jsを再起動:
   ```bash
   npm run dev
   ```
