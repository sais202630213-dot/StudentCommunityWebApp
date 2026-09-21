import { useState, useRef, useEffect } from 'react';
import { useApp } from '../context';
import {
  HomeIcon, BoardIcon, RocketIcon, UsersIcon, BriefcaseIcon,
  SearchIcon, BellIcon, UserIcon, ChevronDownIcon, SettingsIcon,
  LogOutIcon, ShieldIcon, XIcon, CheckIcon, TrendingUpIcon, PlusIcon,
} from '../icons';

function formatTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return '방금 전';
  if (m < 60) return `${m}분 전`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}시간 전`;
  const days = Math.floor(h / 24);
  if (days < 7) return `${days}일 전`;
  return d.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const { navState, navigate, categories, notifications, currentUser, unreadCount,
    markNotificationRead, markAllNotificationsRead, showToast } = useApp();

  const [searchValue, setSearchValue] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfile(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const navLinks = [
    { label: '홈', page: 'home' as const, icon: HomeIcon },
    { label: '게시판', page: 'board' as const, icon: BoardIcon },
    { label: '프로젝트', page: 'board' as const, opts: { categoryId: 'project' }, icon: RocketIcon },
    { label: '동아리', page: 'board' as const, opts: { categoryId: 'club' }, icon: UsersIcon },
    { label: '진로', page: 'board' as const, opts: { categoryId: 'career' }, icon: BriefcaseIcon },
  ];

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate('board', { categoryId: '__search__' });
    }
  }

  const userNotifs = notifications.filter(n => n.userId === currentUser.id);

  const showSidebar = ['home', 'board', 'post-detail'].includes(navState.page);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#050b18' }}>
      {/* Header */}
      <header className="sticky top-0 z-40 border-b" style={{ backgroundColor: 'rgba(5, 11, 24, 0.95)', backdropFilter: 'blur(12px)', borderColor: 'rgba(59,130,246,0.12)' }}>
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-4">
          {/* Logo */}
          <button
            onClick={() => navigate('home')}
            className="flex items-center gap-2.5 shrink-0 group"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' }}>
              <span className="text-white font-bold text-sm font-display">AI</span>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity" style={{ background: 'white' }} />
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-bold leading-tight font-display" style={{ color: '#e2e8f0' }}>
                서울<span className="gradient-text">인공지능고</span>
              </div>
              <div className="text-xs leading-tight" style={{ color: '#64748b', fontFamily: 'JetBrains Mono, monospace' }}>Community</div>
            </div>
          </button>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-1 ml-2">
            {navLinks.map(link => {
              const isActive = navState.page === link.page &&
                (!link.opts || link.opts.categoryId === navState.categoryId);
              return (
                <button
                  key={link.label}
                  onClick={() => navigate(link.page, link.opts)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                  style={{
                    color: isActive ? '#60a5fa' : '#94a3b8',
                    backgroundColor: isActive ? 'rgba(59,130,246,0.1)' : 'transparent',
                  }}
                  onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = '#e2e8f0'; }}
                  onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = '#94a3b8'; }}
                >
                  <link.icon size={15} />
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xs ml-auto">
            <div className="relative">
              <SearchIcon size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#64748b' }} />
              <input
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                placeholder="게시글 검색..."
                className="w-full pl-9 pr-3 py-1.5 rounded-lg text-sm outline-none transition-all"
                style={{
                  backgroundColor: 'rgba(15,31,56,0.8)',
                  border: '1px solid rgba(59,130,246,0.15)',
                  color: '#e2e8f0',
                }}
                onFocus={e => { e.currentTarget.style.borderColor = 'rgba(59,130,246,0.4)'; }}
                onBlur={e => { e.currentTarget.style.borderColor = 'rgba(59,130,246,0.15)'; }}
              />
            </div>
          </form>

          {/* Write button */}
          <button
            onClick={() => navigate('post-form')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium btn-primary text-white shrink-0"
          >
            <PlusIcon size={15} />
            글쓰기
          </button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => { setShowNotifications(v => !v); setShowProfile(false); }}
              className="relative w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
              style={{ color: '#94a3b8' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(59,130,246,0.1)'; (e.currentTarget as HTMLElement).style.color = '#60a5fa'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#94a3b8'; }}
            >
              <BellIcon size={19} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold text-white"
                  style={{ backgroundColor: '#ef4444', fontSize: '10px' }}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-11 w-80 rounded-xl border shadow-2xl fade-in overflow-hidden z-50"
                style={{ backgroundColor: '#0a1626', borderColor: 'rgba(59,130,246,0.2)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
                <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'rgba(59,130,246,0.1)' }}>
                  <span className="font-semibold text-sm font-display" style={{ color: '#e2e8f0' }}>알림</span>
                  <button onClick={markAllNotificationsRead} className="text-xs transition-colors" style={{ color: '#60a5fa' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#93c5fd'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#60a5fa'}>
                    모두 읽음
                  </button>
                </div>
                <div className="overflow-y-auto max-h-80">
                  {userNotifs.length === 0 ? (
                    <div className="py-8 text-center text-sm" style={{ color: '#64748b' }}>알림이 없습니다</div>
                  ) : userNotifs.slice(0, 8).map(n => (
                    <button
                      key={n.id}
                      onClick={() => {
                        markNotificationRead(n.id);
                        if (n.postId) navigate('post-detail', { postId: n.postId });
                        setShowNotifications(false);
                      }}
                      className="w-full text-left px-4 py-3 flex gap-3 items-start border-b transition-colors"
                      style={{
                        borderColor: 'rgba(59,130,246,0.08)',
                        backgroundColor: n.isRead ? 'transparent' : 'rgba(59,130,246,0.04)',
                      }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(59,130,246,0.08)'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = n.isRead ? 'transparent' : 'rgba(59,130,246,0.04)'}
                    >
                      <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: n.isRead ? '#374151' : '#3b82f6' }} />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium truncate" style={{ color: '#e2e8f0' }}>{n.title}</div>
                        <div className="text-xs mt-0.5 line-clamp-2" style={{ color: '#94a3b8' }}>{n.message}</div>
                        <div className="text-xs mt-1" style={{ color: '#475569' }}>{formatTime(n.createdAt)}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => { setShowProfile(v => !v); setShowNotifications(false); }}
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors"
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(59,130,246,0.08)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}
            >
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
                {currentUser.displayName[0]}
              </div>
              <span className="hidden sm:block text-sm font-medium" style={{ color: '#e2e8f0' }}>{currentUser.displayName}</span>
              <ChevronDownIcon size={14} className="hidden sm:block" style={{ color: '#64748b' }} />
            </button>

            {showProfile && (
              <div className="absolute right-0 top-11 w-52 rounded-xl border shadow-2xl fade-in z-50 py-1 overflow-hidden"
                style={{ backgroundColor: '#0a1626', borderColor: 'rgba(59,130,246,0.2)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
                <div className="px-4 py-3 border-b" style={{ borderColor: 'rgba(59,130,246,0.1)' }}>
                  <div className="font-semibold text-sm" style={{ color: '#e2e8f0' }}>{currentUser.displayName}</div>
                  <div className="text-xs mt-0.5" style={{ color: '#64748b' }}>{currentUser.email}</div>
                  {currentUser.grade && (
                    <div className="text-xs mt-1 px-1.5 py-0.5 rounded inline-block" style={{ backgroundColor: 'rgba(59,130,246,0.15)', color: '#60a5fa' }}>
                      {currentUser.grade}학년 {currentUser.classNum}
                    </div>
                  )}
                </div>
                {[
                  { icon: UserIcon, label: '마이페이지', action: () => { navigate('mypage'); setShowProfile(false); } },
                  { icon: ShieldIcon, label: '관리자 패널', action: () => { navigate('mypage', { categoryId: 'admin' }); setShowProfile(false); } },
                  { icon: SettingsIcon, label: '설정', action: () => showToast('info', '설정 페이지 준비 중입니다.') },
                ].map(item => (
                  <button key={item.label} onClick={item.action}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors"
                    style={{ color: '#94a3b8' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(59,130,246,0.08)'; (e.currentTarget as HTMLElement).style.color = '#e2e8f0'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#94a3b8'; }}>
                    <item.icon size={15} />
                    {item.label}
                  </button>
                ))}
                <div className="border-t mt-1 pt-1" style={{ borderColor: 'rgba(59,130,246,0.1)' }}>
                  <button
                    onClick={() => showToast('info', '로그아웃 기능은 데모에서 지원하지 않습니다.')}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors"
                    style={{ color: '#ef4444' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(239,68,68,0.08)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}
                  >
                    <LogOutIcon size={15} />
                    로그아웃
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg"
            style={{ color: '#94a3b8' }}
            onClick={() => setShowMobileMenu(v => !v)}
          >
            {showMobileMenu ? <XIcon size={20} /> : (
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="17" y2="6" /><line x1="3" y1="12" x2="17" y2="12" /><line x1="3" y1="18" x2="17" y2="18" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {showMobileMenu && (
          <div className="md:hidden border-t px-4 py-2 flex flex-col gap-1" style={{ borderColor: 'rgba(59,130,246,0.12)', backgroundColor: 'rgba(5,11,24,0.98)' }}>
            {navLinks.map(link => (
              <button key={link.label}
                onClick={() => { navigate(link.page, link.opts); setShowMobileMenu(false); }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors"
                style={{ color: '#94a3b8' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(59,130,246,0.08)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}
              >
                <link.icon size={16} />
                {link.label}
              </button>
            ))}
            <button onClick={() => { navigate('post-form'); setShowMobileMenu(false); }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium btn-primary text-white mt-1">
              <PlusIcon size={15} />글쓰기
            </button>
          </div>
        )}
      </header>

      {/* Main content */}
      <div className="flex-1 flex max-w-7xl mx-auto w-full px-4 py-6 gap-6">
        {/* Sidebar */}
        {showSidebar && (
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-20 space-y-4">
              {/* Categories */}
              <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: '#0a1626', borderColor: 'rgba(59,130,246,0.12)' }}>
                <div className="px-4 py-3 border-b flex items-center gap-2" style={{ borderColor: 'rgba(59,130,246,0.1)' }}>
                  <BoardIcon size={14} style={{ color: '#60a5fa' }} />
                  <span className="text-xs font-semibold uppercase tracking-wider font-display" style={{ color: '#94a3b8' }}>게시판</span>
                </div>
                <nav className="py-1">
                  <button
                    onClick={() => navigate('board')}
                    className="w-full flex items-center justify-between px-4 py-2 text-sm transition-colors"
                    style={{ color: !navState.categoryId && navState.page === 'board' ? '#60a5fa' : '#94a3b8', backgroundColor: !navState.categoryId && navState.page === 'board' ? 'rgba(59,130,246,0.1)' : 'transparent' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(59,130,246,0.06)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = !navState.categoryId && navState.page === 'board' ? 'rgba(59,130,246,0.1)' : 'transparent'}
                  >
                    <span>전체 게시판</span>
                  </button>
                  {categories.map(cat => {
                    const isActive = navState.categoryId === cat.id && navState.page === 'board';
                    return (
                      <button
                        key={cat.id}
                        onClick={() => navigate('board', { categoryId: cat.id })}
                        className="w-full flex items-center justify-between px-4 py-2 text-sm transition-colors"
                        style={{ color: isActive ? '#60a5fa' : '#94a3b8', backgroundColor: isActive ? 'rgba(59,130,246,0.1)' : 'transparent' }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(59,130,246,0.06)'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = isActive ? 'rgba(59,130,246,0.1)' : 'transparent'}
                      >
                        <span className="flex items-center gap-2">
                          <span>{cat.icon}</span>
                          <span>{cat.name}</span>
                        </span>
                        <span className="text-xs" style={{ color: '#475569' }}>{cat.postCount}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Stats */}
              <div className="rounded-xl border p-4" style={{ backgroundColor: '#0a1626', borderColor: 'rgba(59,130,246,0.12)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUpIcon size={14} style={{ color: '#60a5fa' }} />
                  <span className="text-xs font-semibold uppercase tracking-wider font-display" style={{ color: '#94a3b8' }}>통계</span>
                </div>
                <div className="space-y-2">
                  {[
                    { label: '전체 회원', value: '1,247명' },
                    { label: '오늘 게시글', value: '34개' },
                    { label: '오늘 방문', value: '892명' },
                  ].map(s => (
                    <div key={s.label} className="flex justify-between items-center">
                      <span className="text-xs" style={{ color: '#64748b' }}>{s.label}</span>
                      <span className="text-xs font-semibold font-mono" style={{ color: '#60a5fa' }}>{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        )}

        {/* Page content */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}

export function ToastContainer() {
  const { toasts, dismissToast } = useApp();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className="toast-slide-in pointer-events-auto flex items-center gap-3 pl-4 pr-3 py-3 rounded-xl shadow-2xl max-w-sm"
          style={{
            backgroundColor: t.type === 'success' ? '#052e16' : t.type === 'error' ? '#450a0a' : t.type === 'warning' ? '#431407' : '#0c1a3a',
            border: `1px solid ${t.type === 'success' ? '#16a34a' : t.type === 'error' ? '#dc2626' : t.type === 'warning' ? '#ea580c' : '#3b82f6'}33`,
          }}>
          <span style={{ fontSize: 16 }}>
            {t.type === 'success' ? '✅' : t.type === 'error' ? '❌' : t.type === 'warning' ? '⚠️' : 'ℹ️'}
          </span>
          <span className="text-sm flex-1" style={{ color: '#e2e8f0' }}>{t.message}</span>
          <button onClick={() => dismissToast(t.id)} style={{ color: '#64748b' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#94a3b8'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#64748b'}>
            <XIcon size={15} />
          </button>
        </div>
      ))}
    </div>
  );
}

export function ModalContainer() {
  const { modal, closeModal } = useApp();
  if (!modal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 fade-in"
      style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) closeModal(); }}>
      <div className="modal-in rounded-2xl border p-6 w-full max-w-md shadow-2xl"
        style={{ backgroundColor: '#0a1626', borderColor: 'rgba(59,130,246,0.2)', boxShadow: '0 40px 80px rgba(0,0,0,0.6)' }}>
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
            style={{ backgroundColor: modal.danger ? 'rgba(239,68,68,0.15)' : 'rgba(59,130,246,0.15)' }}>
            {modal.danger ? '🗑️' : '❓'}
          </div>
          <div>
            <h3 className="font-bold text-base font-display" style={{ color: '#e2e8f0' }}>{modal.title}</h3>
            <p className="text-sm mt-1" style={{ color: '#94a3b8' }}>{modal.message}</p>
          </div>
        </div>
        <div className="flex gap-3 justify-end">
          <button onClick={closeModal}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{ backgroundColor: 'rgba(59,130,246,0.1)', color: '#94a3b8' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(59,130,246,0.15)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(59,130,246,0.1)'}>
            {modal.cancelLabel ?? '취소'}
          </button>
          <button onClick={() => { modal.onConfirm(); closeModal(); }}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-all flex items-center gap-2"
            style={{ backgroundColor: modal.danger ? '#dc2626' : '#3b82f6' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.9'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}>
            <CheckIcon size={14} />
            {modal.confirmLabel ?? '확인'}
          </button>
        </div>
      </div>
    </div>
  );
}
