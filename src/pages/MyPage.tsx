import { useState } from 'react';
import { useApp } from '../context';
import {
  UserIcon, EditIcon, TrashIcon, BookmarkIcon, HeartIcon, MessageIcon,
  ShieldIcon, EyeIcon, CheckIcon, XIcon, BoardIcon, PlusIcon,
} from '../icons';

type MyTab = 'posts' | 'comments' | 'bookmarks' | 'likes' | 'notifications';
type AdminTab = 'posts' | 'comments' | 'reports' | 'notice';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' });
}

const CATEGORY_COLORS: Record<string, string> = {
  notice: '#ef4444', 'ai-ml': '#3b82f6', programming: '#22c55e',
  project: '#a855f7', club: '#eab308', career: '#f97316', free: '#64748b',
};

export default function MyPage() {
  const {
    currentUser, navState, navigate, posts, comments, likes, bookmarks, notifications,
    reports, deletePost, deleteComment, resolveReport, markNotificationRead,
    markAllNotificationsRead, showToast, showModal, getCategoryById, getUserById,
  } = useApp();

  const isAdminMode = navState.categoryId === 'admin';
  const [myTab, setMyTab] = useState<MyTab>('posts');
  const [adminTab, setAdminTab] = useState<AdminTab>('posts');

  const myPosts = posts.filter(p => p.authorId === currentUser.id);
  const myComments = comments.filter(c => c.authorId === currentUser.id && !c.isDeleted);
  const myBookmarks = bookmarks.filter(b => b.userId === currentUser.id);
  const myLikedPosts = likes.filter(l => l.userId === currentUser.id && l.targetType === 'post');
  const myNotifications = notifications.filter(n => n.userId === currentUser.id);
  const unread = myNotifications.filter(n => !n.isRead).length;

  const allPosts = [...posts];
  const allComments = [...comments].filter(c => !c.isDeleted);
  const pendingReports = reports.filter(r => r.status === 'pending');

  function handleDeletePost(id: string) {
    showModal({
      title: '게시글 삭제',
      message: '이 게시글을 삭제하시겠습니까?',
      confirmLabel: '삭제',
      danger: true,
      onConfirm: () => { deletePost(id); showToast('success', '게시글이 삭제되었습니다.'); },
    });
  }

  function handleDeleteComment(id: string) {
    showModal({
      title: '댓글 삭제',
      message: '이 댓글을 삭제하시겠습니까?',
      confirmLabel: '삭제',
      danger: true,
      onConfirm: () => { deleteComment(id); showToast('success', '댓글이 삭제되었습니다.'); },
    });
  }

  return (
    <div className="fade-in-up space-y-5">
      {/* Mode toggle */}
      <div className="flex gap-2">
        <button onClick={() => navigate('mypage')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
          style={{ backgroundColor: !isAdminMode ? 'rgba(59,130,246,0.15)' : 'rgba(59,130,246,0.08)', color: !isAdminMode ? '#60a5fa' : '#94a3b8', border: `1px solid ${!isAdminMode ? 'rgba(59,130,246,0.4)' : 'rgba(59,130,246,0.12)'}` }}>
          <UserIcon size={15} />
          마이페이지
        </button>
        <button onClick={() => navigate('mypage', { categoryId: 'admin' })}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
          style={{ backgroundColor: isAdminMode ? 'rgba(239,68,68,0.15)' : 'rgba(59,130,246,0.08)', color: isAdminMode ? '#f87171' : '#94a3b8', border: `1px solid ${isAdminMode ? 'rgba(239,68,68,0.4)' : 'rgba(59,130,246,0.12)'}` }}>
          <ShieldIcon size={15} />
          관리자 패널
          {pendingReports.length > 0 && (
            <span className="w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold text-white" style={{ backgroundColor: '#ef4444' }}>
              {pendingReports.length}
            </span>
          )}
        </button>
      </div>

      {!isAdminMode ? (
        /* MY PAGE */
        <>
          {/* Profile card */}
          <div className="rounded-xl border p-5" style={{ backgroundColor: '#0a1626', borderColor: 'rgba(59,130,246,0.12)' }}>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shrink-0"
                style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' }}>
                {currentUser.displayName[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg font-bold font-display" style={{ color: '#e2e8f0' }}>{currentUser.displayName}</h2>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{
                    backgroundColor: currentUser.role === 'admin' ? 'rgba(239,68,68,0.15)' : 'rgba(59,130,246,0.15)',
                    color: currentUser.role === 'admin' ? '#f87171' : '#60a5fa',
                  }}>
                    {currentUser.role === 'admin' ? '관리자' : currentUser.role === 'teacher' ? '교사' : '학생'}
                  </span>
                  {currentUser.grade && (
                    <span className="text-sm" style={{ color: '#64748b' }}>{currentUser.grade}학년 {currentUser.classNum}</span>
                  )}
                </div>
                <div className="text-sm mt-1" style={{ color: '#64748b' }}>{currentUser.email}</div>
                {currentUser.bio && (
                  <div className="text-sm mt-2" style={{ color: '#94a3b8' }}>{currentUser.bio}</div>
                )}
                <div className="text-xs mt-2" style={{ color: '#475569' }}>가입일: {formatDate(currentUser.joinDate)}</div>
              </div>
              <button onClick={() => showToast('info', '프로필 편집 기능 준비 중입니다.')}
                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all"
                style={{ backgroundColor: 'rgba(59,130,246,0.1)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.2)' }}>
                <EditIcon size={12} />
                편집
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-3 mt-5 pt-4 border-t" style={{ borderColor: 'rgba(59,130,246,0.1)' }}>
              {[
                { label: '작성 게시글', value: myPosts.length, icon: BoardIcon, color: '#3b82f6' },
                { label: '작성 댓글', value: myComments.length, icon: MessageIcon, color: '#8b5cf6' },
                { label: '북마크', value: myBookmarks.length, icon: BookmarkIcon, color: '#f97316' },
                { label: '좋아요한 글', value: myLikedPosts.length, icon: HeartIcon, color: '#ef4444' },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <div className="text-xl font-bold font-display mb-0.5" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-xs" style={{ color: '#64748b' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 overflow-x-auto">
            {[
              { id: 'posts' as MyTab, label: '내 게시글', count: myPosts.length },
              { id: 'comments' as MyTab, label: '내 댓글', count: myComments.length },
              { id: 'bookmarks' as MyTab, label: '북마크', count: myBookmarks.length },
              { id: 'likes' as MyTab, label: '좋아요한 글', count: myLikedPosts.length },
              { id: 'notifications' as MyTab, label: '알림', count: unread, badge: unread },
            ].map(tab => (
              <button key={tab.id} onClick={() => setMyTab(tab.id)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex items-center gap-1.5"
                style={{ backgroundColor: myTab === tab.id ? 'rgba(59,130,246,0.15)' : 'transparent', color: myTab === tab.id ? '#60a5fa' : '#64748b', border: `1px solid ${myTab === tab.id ? 'rgba(59,130,246,0.3)' : 'transparent'}` }}>
                {tab.label}
                {tab.badge != null && tab.badge > 0 && (
                  <span className="w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold text-white" style={{ backgroundColor: '#ef4444', fontSize: '10px' }}>
                    {tab.badge > 9 ? '9+' : tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: '#0a1626', borderColor: 'rgba(59,130,246,0.12)' }}>
            {/* My Posts */}
            {myTab === 'posts' && (
              myPosts.length === 0 ? <EmptyState icon="📝" label="작성한 게시글이 없습니다" /> : (
                <div className="divide-y" style={{ borderColor: 'rgba(59,130,246,0.06)' }}>
                  {myPosts.map(post => {
                    const cat = getCategoryById(post.categoryId);
                    return (
                      <div key={post.id} className="flex items-center gap-3 px-4 py-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {cat && <span className="text-xs" style={{ color: CATEGORY_COLORS[post.categoryId] }}>{cat.name}</span>}
                            <span className="text-xs" style={{ color: '#475569' }}>{formatDate(post.createdAt)}</span>
                          </div>
                          <button onClick={() => navigate('post-detail', { postId: post.id })}
                            className="text-sm text-left transition-colors" style={{ color: '#e2e8f0' }}
                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#60a5fa'}
                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#e2e8f0'}>
                            {post.title}
                          </button>
                          <div className="flex items-center gap-3 mt-1 text-xs" style={{ color: '#475569' }}>
                            <span className="flex items-center gap-1"><EyeIcon size={10} />{post.viewCount}</span>
                            <span className="flex items-center gap-1"><HeartIcon size={10} />{post.likeCount}</span>
                            <span className="flex items-center gap-1"><MessageIcon size={10} />{post.commentCount}</span>
                          </div>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <button onClick={() => navigate('post-form', { editPostId: post.id })}
                            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                            style={{ color: '#60a5fa' }}
                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(59,130,246,0.1)'}
                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}>
                            <EditIcon size={13} />
                          </button>
                          <button onClick={() => handleDeletePost(post.id)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                            style={{ color: '#f87171' }}
                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(239,68,68,0.1)'}
                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}>
                            <TrashIcon size={13} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            )}

            {/* My Comments */}
            {myTab === 'comments' && (
              myComments.length === 0 ? <EmptyState icon="💬" label="작성한 댓글이 없습니다" /> : (
                <div className="divide-y" style={{ borderColor: 'rgba(59,130,246,0.06)' }}>
                  {myComments.map(c => {
                    const post = posts.find(p => p.id === c.postId);
                    return (
                      <div key={c.id} className="px-4 py-3">
                        {post && (
                          <button onClick={() => navigate('post-detail', { postId: post.id })}
                            className="text-xs mb-1 flex items-center gap-1 transition-colors" style={{ color: '#64748b' }}
                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#60a5fa'}
                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#64748b'}>
                            📄 {post.title}
                          </button>
                        )}
                        <div className="flex items-start gap-2">
                          <p className="text-sm flex-1" style={{ color: '#cbd5e1' }}>{c.content}</p>
                          <div className="flex gap-1 shrink-0">
                            <button onClick={() => handleDeleteComment(c.id)}
                              className="w-6 h-6 rounded flex items-center justify-center transition-colors"
                              style={{ color: '#f87171' }}
                              onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(239,68,68,0.1)'}
                              onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}>
                              <TrashIcon size={12} />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs" style={{ color: '#475569' }}>
                          <span>{formatDate(c.createdAt)}</span>
                          <span className="flex items-center gap-1"><HeartIcon size={10} />{c.likeCount}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            )}

            {/* Bookmarks */}
            {myTab === 'bookmarks' && (
              myBookmarks.length === 0 ? <EmptyState icon="🔖" label="북마크한 게시글이 없습니다" /> : (
                <div className="divide-y" style={{ borderColor: 'rgba(59,130,246,0.06)' }}>
                  {myBookmarks.map(b => {
                    const post = posts.find(p => p.id === b.postId);
                    if (!post) return null;
                    const cat = getCategoryById(post.categoryId);
                    return (
                      <button key={b.id} onClick={() => navigate('post-detail', { postId: post.id })}
                        className="w-full text-left px-4 py-3 flex items-center gap-3 transition-colors"
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(59,130,246,0.04)'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}>
                        <BookmarkIcon size={14} filled style={{ color: '#a78bfa', flexShrink: 0 }} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            {cat && <span className="text-xs" style={{ color: CATEGORY_COLORS[post.categoryId] }}>{cat.name}</span>}
                          </div>
                          <div className="text-sm truncate" style={{ color: '#e2e8f0' }}>{post.title}</div>
                        </div>
                        <div className="text-xs shrink-0" style={{ color: '#475569' }}>{formatDate(b.createdAt)}</div>
                      </button>
                    );
                  })}
                </div>
              )
            )}

            {/* Likes */}
            {myTab === 'likes' && (
              myLikedPosts.length === 0 ? <EmptyState icon="❤️" label="좋아요한 게시글이 없습니다" /> : (
                <div className="divide-y" style={{ borderColor: 'rgba(59,130,246,0.06)' }}>
                  {myLikedPosts.map(l => {
                    const post = posts.find(p => p.id === l.targetId);
                    if (!post) return null;
                    const cat = getCategoryById(post.categoryId);
                    return (
                      <button key={l.id} onClick={() => navigate('post-detail', { postId: post.id })}
                        className="w-full text-left px-4 py-3 flex items-center gap-3 transition-colors"
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(59,130,246,0.04)'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}>
                        <HeartIcon size={14} filled style={{ color: '#f87171', flexShrink: 0 }} />
                        <div className="flex-1 min-w-0">
                          {cat && <span className="text-xs block mb-0.5" style={{ color: CATEGORY_COLORS[post.categoryId] }}>{cat.name}</span>}
                          <div className="text-sm truncate" style={{ color: '#e2e8f0' }}>{post.title}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )
            )}

            {/* Notifications */}
            {myTab === 'notifications' && (
              myNotifications.length === 0 ? <EmptyState icon="🔔" label="알림이 없습니다" /> : (
                <>
                  {unread > 0 && (
                    <div className="px-4 py-2 flex justify-end border-b" style={{ borderColor: 'rgba(59,130,246,0.08)' }}>
                      <button onClick={markAllNotificationsRead} className="text-xs transition-colors" style={{ color: '#60a5fa' }}>
                        모두 읽음 처리
                      </button>
                    </div>
                  )}
                  <div className="divide-y" style={{ borderColor: 'rgba(59,130,246,0.06)' }}>
                    {myNotifications.map(n => (
                      <button key={n.id} onClick={() => { markNotificationRead(n.id); if (n.postId) navigate('post-detail', { postId: n.postId }); }}
                        className="w-full text-left px-4 py-3 flex gap-3 transition-colors"
                        style={{ backgroundColor: n.isRead ? 'transparent' : 'rgba(59,130,246,0.04)' }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(59,130,246,0.08)'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = n.isRead ? 'transparent' : 'rgba(59,130,246,0.04)'}>
                        <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: n.isRead ? '#374151' : '#3b82f6' }} />
                        <div>
                          <div className="text-sm font-medium" style={{ color: '#e2e8f0' }}>{n.title}</div>
                          <div className="text-xs mt-0.5" style={{ color: '#94a3b8' }}>{n.message}</div>
                          <div className="text-xs mt-1" style={{ color: '#475569' }}>{formatDate(n.createdAt)}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )
            )}
          </div>
        </>
      ) : (
        /* ADMIN PANEL */
        <>
          <div className="rounded-xl border p-4" style={{ backgroundColor: 'rgba(239,68,68,0.05)', borderColor: 'rgba(239,68,68,0.2)' }}>
            <div className="flex items-center gap-2 mb-1">
              <ShieldIcon size={16} style={{ color: '#f87171' }} />
              <span className="font-bold font-display" style={{ color: '#f87171' }}>관리자 패널</span>
            </div>
            <p className="text-xs" style={{ color: '#94a3b8' }}>
              게시글, 댓글, 신고를 관리하는 관리자 전용 패널입니다.
              총 {allPosts.length}개 게시글, {allComments.length}개 댓글, {pendingReports.length}개 미처리 신고
            </p>
          </div>

          {/* Admin tabs */}
          <div className="flex gap-1">
            {([
              { id: 'posts' as AdminTab, label: '게시글 관리', count: allPosts.length },
              { id: 'comments' as AdminTab, label: '댓글 관리', count: allComments.length },
              { id: 'reports' as AdminTab, label: '신고 관리', count: pendingReports.length, badge: pendingReports.length },
              { id: 'notice' as AdminTab, label: '공지 작성' },
            ]).map(tab => (
              <button key={tab.id} onClick={() => setAdminTab(tab.id)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex items-center gap-1.5"
                style={{ backgroundColor: adminTab === tab.id ? 'rgba(239,68,68,0.15)' : 'rgba(59,130,246,0.08)', color: adminTab === tab.id ? '#f87171' : '#64748b', border: `1px solid ${adminTab === tab.id ? 'rgba(239,68,68,0.3)' : 'transparent'}` }}>
                {tab.label}
                {tab.badge != null && tab.badge > 0 && (
                  <span className="w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold text-white" style={{ backgroundColor: '#ef4444', fontSize: '10px' }}>
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: '#0a1626', borderColor: 'rgba(59,130,246,0.12)' }}>
            {/* Admin: All Posts */}
            {adminTab === 'posts' && (
              allPosts.length === 0 ? <EmptyState icon="📝" label="게시글이 없습니다" /> : (
                <div>
                  <div className="px-4 py-2.5 grid text-xs font-medium border-b" style={{ gridTemplateColumns: '1fr 80px 70px 50px 50px 60px', borderColor: 'rgba(59,130,246,0.1)', color: '#475569' }}>
                    <span>제목</span>
                    <span className="text-center">작성자</span>
                    <span className="text-center">날짜</span>
                    <span className="text-center">조회</span>
                    <span className="text-center">추천</span>
                    <span className="text-center">관리</span>
                  </div>
                  <div className="divide-y" style={{ borderColor: 'rgba(59,130,246,0.06)' }}>
                    {allPosts.map(post => {
                      const author = getUserById(post.authorId);
                      const cat = getCategoryById(post.categoryId);
                      return (
                        <div key={post.id} className="grid items-center px-4 py-2.5 gap-2" style={{ gridTemplateColumns: '1fr 80px 70px 50px 50px 60px' }}>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              {cat && <span className="text-xs" style={{ color: CATEGORY_COLORS[post.categoryId] }}>{cat.name}</span>}
                              {post.isNotice && <span className="text-xs px-1 rounded" style={{ backgroundColor: 'rgba(239,68,68,0.15)', color: '#f87171' }}>공지</span>}
                            </div>
                            <button onClick={() => navigate('post-detail', { postId: post.id })}
                              className="text-xs text-left truncate w-full transition-colors" style={{ color: '#e2e8f0' }}
                              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#60a5fa'}
                              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#e2e8f0'}>
                              {post.title}
                            </button>
                          </div>
                          <span className="text-xs text-center truncate" style={{ color: '#94a3b8' }}>{post.isAnonymous ? '익명' : author?.displayName}</span>
                          <span className="text-xs text-center" style={{ color: '#475569' }}>{formatDate(post.createdAt)}</span>
                          <span className="text-xs text-center" style={{ color: '#475569' }}>{post.viewCount}</span>
                          <span className="text-xs text-center" style={{ color: '#475569' }}>{post.likeCount}</span>
                          <div className="flex gap-1 justify-center">
                            <button onClick={() => navigate('post-form', { editPostId: post.id })}
                              className="w-6 h-6 rounded flex items-center justify-center" style={{ color: '#60a5fa' }}
                              onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(59,130,246,0.1)'}
                              onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}>
                              <EditIcon size={11} />
                            </button>
                            <button onClick={() => handleDeletePost(post.id)}
                              className="w-6 h-6 rounded flex items-center justify-center" style={{ color: '#f87171' }}
                              onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(239,68,68,0.1)'}
                              onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}>
                              <TrashIcon size={11} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )
            )}

            {/* Admin: All Comments */}
            {adminTab === 'comments' && (
              allComments.length === 0 ? <EmptyState icon="💬" label="댓글이 없습니다" /> : (
                <div className="divide-y" style={{ borderColor: 'rgba(59,130,246,0.06)' }}>
                  {allComments.map(c => {
                    const author = getUserById(c.authorId);
                    const post = posts.find(p => p.id === c.postId);
                    return (
                      <div key={c.id} className="px-4 py-3 flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          {post && (
                            <button onClick={() => navigate('post-detail', { postId: post.id })}
                              className="text-xs mb-1 transition-colors" style={{ color: '#64748b' }}
                              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#60a5fa'}
                              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#64748b'}>
                              📄 {post.title}
                            </button>
                          )}
                          <p className="text-sm" style={{ color: '#cbd5e1' }}>{c.content}</p>
                          <div className="flex items-center gap-3 mt-1 text-xs" style={{ color: '#475569' }}>
                            <span>{author?.displayName}</span>
                            <span>{formatDate(c.createdAt)}</span>
                          </div>
                        </div>
                        <button onClick={() => handleDeleteComment(c.id)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors" style={{ color: '#f87171' }}
                          onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(239,68,68,0.1)'}
                          onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}>
                          <TrashIcon size={13} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )
            )}

            {/* Admin: Reports */}
            {adminTab === 'reports' && (
              reports.length === 0 ? <EmptyState icon="🚩" label="신고가 없습니다" /> : (
                <div className="divide-y" style={{ borderColor: 'rgba(59,130,246,0.06)' }}>
                  {reports.map(r => {
                    const reporter = getUserById(r.reporterId);
                    const targetPost = r.targetType === 'post' ? posts.find(p => p.id === r.targetId) : null;
                    const targetComment = r.targetType === 'comment' ? allComments.find(c => c.id === r.targetId) : null;
                    return (
                      <div key={r.id} className="px-4 py-4 flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${r.status === 'pending' ? 'bg-yellow-500/15 text-yellow-400' : r.status === 'resolved' ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'}`}>
                              {r.status === 'pending' ? '처리 대기' : r.status === 'resolved' ? '처리됨' : '기각됨'}
                            </span>
                            <span className="text-xs" style={{ color: '#64748b' }}>{r.targetType === 'post' ? '게시글' : '댓글'} 신고</span>
                          </div>
                          <div className="text-sm mb-1" style={{ color: '#cbd5e1' }}>
                            <span className="font-medium" style={{ color: '#94a3b8' }}>신고 사유: </span>
                            {r.reason}
                          </div>
                          {targetPost && (
                            <button onClick={() => navigate('post-detail', { postId: targetPost.id })}
                              className="text-xs transition-colors" style={{ color: '#60a5fa' }}>
                              📄 {targetPost.title}
                            </button>
                          )}
                          {targetComment && (
                            <div className="text-xs p-2 rounded mt-1" style={{ backgroundColor: 'rgba(15,31,56,0.5)', color: '#94a3b8' }}>
                              "{targetComment.content.slice(0, 80)}..."
                            </div>
                          )}
                          <div className="text-xs mt-1" style={{ color: '#475569' }}>
                            신고자: {reporter?.displayName} · {formatDate(r.createdAt)}
                          </div>
                        </div>
                        {r.status === 'pending' && (
                          <div className="flex gap-1 shrink-0">
                            <button onClick={() => { resolveReport(r.id, 'resolved'); showToast('success', '신고가 처리되었습니다.'); }}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors"
                              style={{ backgroundColor: 'rgba(34,197,94,0.15)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.2)' }}>
                              <CheckIcon size={11} />처리
                            </button>
                            <button onClick={() => { resolveReport(r.id, 'rejected'); showToast('info', '신고가 기각되었습니다.'); }}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors"
                              style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}>
                              <XIcon size={11} />기각
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )
            )}

            {/* Admin: Notice */}
            {adminTab === 'notice' && (
              <div className="p-5">
                <h3 className="font-semibold font-display mb-4" style={{ color: '#e2e8f0' }}>새 공지사항 작성</h3>
                <button onClick={() => navigate('post-form', { categoryId: 'notice' })}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl border-2 border-dashed text-sm font-medium transition-all"
                  style={{ borderColor: 'rgba(239,68,68,0.3)', color: '#f87171' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(239,68,68,0.5)'; (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(239,68,68,0.05)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(239,68,68,0.3)'; (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}>
                  <PlusIcon size={16} />
                  공지사항 작성하기
                </button>
                <div className="mt-5 space-y-2">
                  <h4 className="text-sm font-medium" style={{ color: '#94a3b8' }}>기존 공지사항</h4>
                  {posts.filter(p => p.isNotice).map(post => (
                    <div key={post.id} className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ backgroundColor: 'rgba(15,31,56,0.5)' }}>
                      <span className="text-sm flex-1 truncate" style={{ color: '#e2e8f0' }}>{post.title}</span>
                      <button onClick={() => navigate('post-form', { editPostId: post.id })}
                        className="w-6 h-6 rounded flex items-center justify-center" style={{ color: '#60a5fa' }}>
                        <EditIcon size={11} />
                      </button>
                      <button onClick={() => handleDeletePost(post.id)}
                        className="w-6 h-6 rounded flex items-center justify-center" style={{ color: '#f87171' }}>
                        <TrashIcon size={11} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function EmptyState({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="py-14 text-center">
      <div className="text-4xl mb-3">{icon}</div>
      <div className="text-sm" style={{ color: '#64748b' }}>{label}</div>
    </div>
  );
}
