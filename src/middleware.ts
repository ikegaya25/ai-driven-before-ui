import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// 認証が必要なルートを定義
const isProtectedRoute = createRouteMatcher([
  '/posts/new(.*)',
  '/posts/(.*)/edit(.*)',
  '/api/blog(.*)',
]);

export default clerkMiddleware((auth, req) => {
  // 保護されたルートで認証をチェック
  if (isProtectedRoute(req)) {
    auth().protect();
  }
});

export const config = {
  matcher: [
    // すべてのルートでClerkを実行
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // APIルート
    '/(api|trpc)(.*)',
  ],
};