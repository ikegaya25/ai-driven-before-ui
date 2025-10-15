import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold">My Blog</h1>
          </Link>
          <nav className="flex items-center space-x-6">
            <Link 
              href="/" 
              className="hover:text-pink-200 transition-colors duration-200 hidden sm:block"
            >
              ホーム
            </Link>
            <Link 
              href="/posts/new" 
              className="bg-white !text-purple-700 px-4 py-2 rounded-full shadow-md hover:bg-pink-50 hover:!text-purple-800 hover:shadow-lg transition-all duration-200 hidden sm:block"
            >
              記事を書く
            </Link>
            <div className="flex items-center">
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10"
                  }
                }}
              />
            </div>
            {/* ハンバーガーメニューボタン */}
            <button
              onClick={onMenuClick}
              className="lg:hidden flex flex-col items-center justify-center w-10 h-10 space-y-1.5 hover:bg-white/10 rounded transition-colors duration-200"
              aria-label="メニュー"
            >
              <span className="w-6 h-0.5 bg-white"></span>
              <span className="w-6 h-0.5 bg-white"></span>
              <span className="w-6 h-0.5 bg-white"></span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}

