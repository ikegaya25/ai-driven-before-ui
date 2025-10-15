import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 安全な画像アップロード用の関数
export async function uploadImage(file: File, userId: string): Promise<string | null> {
  try {
    // ファイルサイズチェック（5MB制限）
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('ファイルサイズが大きすぎます（5MB以下）');
    }

    // ファイル形式の厳密なチェック
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('サポートされていないファイル形式です');
    }

    // ファイル拡張子の検証
    const fileName = file.name.toLowerCase();
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));
    
    if (!hasValidExtension) {
      throw new Error('無効なファイル拡張子です');
    }

    // 安全なファイル名を生成
    const sanitizedUserId = userId.replace(/[^a-zA-Z0-9-_]/g, '');
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExt = fileName.split('.').pop()?.toLowerCase();
    const safeFileName = `${sanitizedUserId}-${timestamp}-${randomString}.${fileExt}`;
    
    // Supabase Storageにアップロード
    const { data, error } = await supabase.storage
      .from('images')
      .upload(safeFileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('画像アップロードエラー:', error);
      return null;
    }

    // 公開URLを取得
    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(safeFileName);

    return publicUrl;
  } catch (error) {
    console.error('画像アップロードエラー:', error);
    return null;
  }
}

// 画像削除用の関数
export async function deleteImage(imageUrl: string): Promise<boolean> {
  try {
    // URLからファイル名を抽出
    const fileName = imageUrl.split('/').pop();
    if (!fileName) return false;

    const { error } = await supabase.storage
      .from('images')
      .remove([fileName]);

    if (error) {
      console.error('画像削除エラー:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('画像削除エラー:', error);
    return false;
  }
}
