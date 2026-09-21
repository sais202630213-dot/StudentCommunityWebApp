import { useState } from 'react';
import { AppProvider, useApp } from './context';
import Layout, { ToastContainer, ModalContainer } from './components/Layout';
import HomePage from './pages/HomePage';
import BoardPage from './pages/BoardPage';
import PostDetailPage from './pages/PostDetailPage';
import PostFormPage from './pages/PostFormPage';
import MyPage from './pages/MyPage';

const DEMO_PAGES = [
  {
    label: '🏠 홈',
    action: (navigate: ReturnType<typeof useApp>['navigate']) => navigate('home'),
    match: (page: string) => page === 'home',
  },
  {
    label: '📋 전체 게시판',
    action: (navigate: ReturnType<typeof useApp>['navigate']) => navigate('board'),
    match: (page: string, cat?: string) => page === 'board' && !cat,
  },
  {
    label: '🤖 AI·머신러닝',
    action: (navigate: ReturnType<typeof useApp>['navigate']) => navigate('board', { categoryId: 'ai-ml' }),
    match: (page: string, cat?: string) => page === 'board' && cat === 'ai-ml',
  },
  {
    label: '📄 게시글 상세',
    action: (navigate: ReturnType<typeof useApp>['navigate']) => navigate('post-detail', { postId: 'p3' }),
    match: (page: string) => page === 'post-detail',
  },
  {
    label: '✏️ 글쓰기',
    action: (navigate: ReturnType<typeof useApp>['navigate']) => navigate('post-form'),
    match: (page: string) => page === 'post-form',
  },
  {
    label: '👤 마이페이지',
    action: (navigate: ReturnType<typeof useApp>['navigate']) => navigate('mypage'),
    match: (page: string, cat?: string) => page === 'mypage' && cat !== 'admin',
  },
  {
    label: '🛡️ 관리자',
    action: (navigate: ReturnType<typeof useApp>['navigate']) => navigate('mypage', { categoryId: 'admin' }),
    match: (page: string, cat?: string) => page === 'mypage' && cat === 'admin',
  },
];

function DemoNav() {
  const { navState, navigate } = useApp();
  const [open, setOpen] = useState(true);

  return (
    <div
      className="fixed bottom-4 left-1/2 z-50 flex flex-col items-center gap-2"
      style={{ transform: 'translateX(-50%)' }}
    >
      {open && (
        <div
          className="flex flex-wrap justify-center gap-1.5 px-4 py-3 rounded-2xl shadow-2xl"
          style={{
            backgroundColor: 'rgba(10, 22, 38, 0.97)',
            border: '1px solid rgba(59,130,246,0.25)',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
            maxWidth: '90vw',
          }}
        >
          <span
            className="w-full text-center text-xs font-medium mb-1"
            style={{ color: '#475569', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.05em' }}
          >
            페이지 바로가기
          </span>
          {DEMO_PAGES.map((p) => {
            const active = p.match(navState.page, navState.categoryId);
            return (
              <button
                key={p.label}
                onClick={() => p.action(navigate)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap"
                style={{
                  backgroundColor: active ? 'rgba(59,130,246,0.2)' : 'rgba(59,130,246,0.07)',
                  color: active ? '#60a5fa' : '#94a3b8',
                  border: `1px solid ${active ? 'rgba(59,130,246,0.45)' : 'rgba(59,130,246,0.12)'}`,
                  boxShadow: active ? '0 0 8px rgba(59,130,246,0.2)' : 'none',
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(59,130,246,0.13)';
                    (e.currentTarget as HTMLElement).style.color = '#e2e8f0';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(59,130,246,0.07)';
                    (e.currentTarget as HTMLElement).style.color = '#94a3b8';
                  }
                }}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      )}

      {/* 토글 버튼 */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="px-4 py-1.5 rounded-full text-xs font-medium transition-all"
        style={{
          backgroundColor: 'rgba(10,22,38,0.95)',
          border: '1px solid rgba(59,130,246,0.2)',
          color: '#64748b',
          backdropFilter: 'blur(12px)',
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#60a5fa')}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#64748b')}
      >
        {open ? '▼ 숨기기' : '▲ 페이지 이동'}
      </button>
    </div>
  );
}

function AppContent() {
  const { navState } = useApp();

  return (
    <>
      <Layout>
        {navState.page === 'home' && <HomePage />}
        {navState.page === 'board' && <BoardPage />}
        {navState.page === 'post-detail' && <PostDetailPage />}
        {navState.page === 'post-form' && <PostFormPage />}
        {navState.page === 'mypage' && <MyPage />}
      </Layout>
      <DemoNav />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
      <ToastContainer />
      <ModalContainer />
    </AppProvider>
  );
}
