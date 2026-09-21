import { useApp } from '../context';
import { TrendingUpIcon, MessageIcon, EyeIcon, HeartIcon, NoticeIcon, PlusIcon, ChevronRightIcon, BoardIcon } from '../icons';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
}

function formatNum(n: number) {
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return String(n);
}

const CATEGORY_COLORS: Record<string, string> = {
  'notice': '#ef4444',
  'ai-ml': '#3b82f6',
  'programming': '#22c55e',
  'project': '#a855f7',
  'club': '#eab308',
  'career': '#f97316',
  'free': '#64748b',
};

export default function HomePage() {
  const { posts, categories, navigate, getCategoryById, getUserById } = useApp();

  const pinnedPosts = posts.filter(p => p.isPinned);
  const noticePosts = posts.filter(p => p.isNotice).slice(0, 3);
  const hotPosts = [...posts].filter(p => !p.isNotice).sort((a, b) => b.likeCount - a.likeCount).slice(0, 5);
  const recentPosts = [...posts].filter(p => !p.isNotice).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 8);

  const categoryGroups = ['ai-ml', 'programming', 'project'].map(catId => ({
    category: categories.find(c => c.id === catId)!,
    posts: posts.filter(p => p.categoryId === catId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 4),
  }));

  return (
    <div className="space-y-6 fade-in-up">
      {/* Hero banner */}
      <div className="relative rounded-2xl overflow-hidden p-8"
        style={{ background: 'linear-gradient(135deg, #0f1f38 0%, #1a1040 50%, #0f1f38 100%)', border: '1px solid rgba(139,92,246,0.2)' }}>
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(59,130,246,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(139,92,246,0.3) 0%, transparent 50%)' }} />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4"
            style={{ backgroundColor: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', color: '#60a5fa', fontFamily: 'JetBrains Mono, monospace' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            SAIH Community v2.0
          </div>
          <h1 className="text-2xl font-bold font-display mb-2" style={{ color: '#e2e8f0' }}>
            AI 교육의 미래를<br />
            <span className="gradient-text">함께 만들어갑니다</span>
          </h1>
          <p className="text-sm mb-6" style={{ color: '#94a3b8' }}>
            서울인공지능고등학교 학생들의 지식 공유와 성장의 공간
          </p>
          <div className="flex flex-wrap gap-4">
            {[
              { label: '전체 회원', value: '1,247', unit: '명' },
              { label: '게시글', value: '566', unit: '개' },
              { label: '오늘 방문', value: '892', unit: '명' },
              { label: '진행 프로젝트', value: '23', unit: '개' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="text-xl font-bold font-display gradient-text">{s.value}<span className="text-sm">{s.unit}</span></div>
                <div className="text-xs" style={{ color: '#64748b' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Notice */}
      {noticePosts.length > 0 && (
        <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: '#0a1626', borderColor: 'rgba(59,130,246,0.12)' }}>
          <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'rgba(59,130,246,0.1)' }}>
            <div className="flex items-center gap-2">
              <NoticeIcon size={15} style={{ color: '#ef4444' }} />
              <span className="font-semibold text-sm font-display" style={{ color: '#e2e8f0' }}>공지사항</span>
            </div>
            <button onClick={() => navigate('board', { categoryId: 'notice' })}
              className="text-xs flex items-center gap-1 transition-colors"
              style={{ color: '#64748b' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#60a5fa'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#64748b'}>
              더보기 <ChevronRightIcon size={12} />
            </button>
          </div>
          <div className="divide-y" style={{ borderColor: 'rgba(59,130,246,0.06)' }}>
            {noticePosts.map(post => (
              <button key={post.id} onClick={() => navigate('post-detail', { postId: post.id })}
                className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors"
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(59,130,246,0.04)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}>
                <span className="px-2 py-0.5 rounded text-xs font-medium shrink-0" style={{ backgroundColor: 'rgba(239,68,68,0.15)', color: '#f87171' }}>공지</span>
                <span className="flex-1 text-sm truncate" style={{ color: '#e2e8f0' }}>{post.title}</span>
                <span className="text-xs shrink-0" style={{ color: '#475569' }}>{formatDate(post.createdAt)}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Hot posts */}
      <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: '#0a1626', borderColor: 'rgba(59,130,246,0.12)' }}>
        <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'rgba(59,130,246,0.1)' }}>
          <div className="flex items-center gap-2">
            <TrendingUpIcon size={15} style={{ color: '#f97316' }} />
            <span className="font-semibold text-sm font-display" style={{ color: '#e2e8f0' }}>인기글</span>
          </div>
          <button onClick={() => navigate('board')}
            className="text-xs flex items-center gap-1 transition-colors" style={{ color: '#64748b' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#60a5fa'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#64748b'}>
            더보기 <ChevronRightIcon size={12} />
          </button>
        </div>
        <div className="divide-y" style={{ borderColor: 'rgba(59,130,246,0.06)' }}>
          {hotPosts.map((post, idx) => {
            const cat = getCategoryById(post.categoryId);
            const author = getUserById(post.authorId);
            return (
              <button key={post.id} onClick={() => navigate('post-detail', { postId: post.id })}
                className="w-full flex items-start gap-3 px-4 py-3 text-left transition-colors"
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(59,130,246,0.04)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}>
                <span className="text-xl font-bold font-display w-6 text-center mt-0.5"
                  style={{ color: idx === 0 ? '#f97316' : idx === 1 ? '#94a3b8' : idx === 2 ? '#b45309' : '#374151' }}>
                  {idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: `${CATEGORY_COLORS[post.categoryId]}20`, color: CATEGORY_COLORS[post.categoryId] }}>
                      {cat?.icon} {cat?.name}
                    </span>
                  </div>
                  <div className="text-sm font-medium truncate" style={{ color: '#e2e8f0' }}>{post.title}</div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs" style={{ color: '#64748b' }}>{post.isAnonymous ? '익명' : author?.displayName}</span>
                    <span className="flex items-center gap-1 text-xs" style={{ color: '#64748b' }}>
                      <HeartIcon size={11} />
                      {post.likeCount}
                    </span>
                    <span className="flex items-center gap-1 text-xs" style={{ color: '#64748b' }}>
                      <MessageIcon size={11} />
                      {post.commentCount}
                    </span>
                    <span className="flex items-center gap-1 text-xs" style={{ color: '#64748b' }}>
                      <EyeIcon size={11} />
                      {formatNum(post.viewCount)}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Category cards */}
      <div>
        <h2 className="text-sm font-semibold font-display mb-3 flex items-center gap-2" style={{ color: '#94a3b8' }}>
          <BoardIcon size={14} />
          게시판 바로가기
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {categories.map(cat => (
            <button key={cat.id} onClick={() => navigate('board', { categoryId: cat.id })}
              className="flex flex-col items-start p-4 rounded-xl border transition-all text-left"
              style={{ backgroundColor: '#0a1626', borderColor: 'rgba(59,130,246,0.12)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${CATEGORY_COLORS[cat.id]}40`; (e.currentTarget as HTMLElement).style.backgroundColor = `${CATEGORY_COLORS[cat.id]}08`; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(59,130,246,0.12)'; (e.currentTarget as HTMLElement).style.backgroundColor = '#0a1626'; }}>
              <span className="text-2xl mb-2">{cat.icon}</span>
              <div className="font-semibold text-sm font-display" style={{ color: '#e2e8f0' }}>{cat.name}</div>
              <div className="text-xs mt-1 line-clamp-1" style={{ color: '#64748b' }}>{cat.description}</div>
              <div className="text-xs mt-2 font-mono" style={{ color: CATEGORY_COLORS[cat.id] }}>
                {cat.postCount}개
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent posts by category */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {categoryGroups.map(({ category, posts: catPosts }) => (
          <div key={category.id} className="rounded-xl border overflow-hidden" style={{ backgroundColor: '#0a1626', borderColor: 'rgba(59,130,246,0.12)' }}>
            <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'rgba(59,130,246,0.1)' }}>
              <span className="text-sm font-semibold font-display flex items-center gap-2" style={{ color: '#e2e8f0' }}>
                <span>{category.icon}</span>
                {category.name}
              </span>
              <button onClick={() => navigate('board', { categoryId: category.id })}
                className="text-xs transition-colors" style={{ color: '#64748b' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#60a5fa'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#64748b'}>
                더보기
              </button>
            </div>
            <div className="divide-y" style={{ borderColor: 'rgba(59,130,246,0.06)' }}>
              {catPosts.map(post => {
                const author = getUserById(post.authorId);
                return (
                  <button key={post.id} onClick={() => navigate('post-detail', { postId: post.id })}
                    className="w-full flex flex-col gap-1 px-4 py-2.5 text-left transition-colors"
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(59,130,246,0.04)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}>
                    <div className="text-sm truncate" style={{ color: '#e2e8f0' }}>{post.title}</div>
                    <div className="flex items-center gap-2 text-xs" style={{ color: '#475569' }}>
                      <span>{post.isAnonymous ? '익명' : author?.displayName}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1"><HeartIcon size={10} />{post.likeCount}</span>
                      <span className="flex items-center gap-1"><MessageIcon size={10} />{post.commentCount}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Recent all posts */}
      <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: '#0a1626', borderColor: 'rgba(59,130,246,0.12)' }}>
        <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'rgba(59,130,246,0.1)' }}>
          <span className="font-semibold text-sm font-display" style={{ color: '#e2e8f0' }}>최신글</span>
          <button onClick={() => navigate('board')} className="text-xs flex items-center gap-1 transition-colors" style={{ color: '#64748b' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#60a5fa'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#64748b'}>
            전체 보기 <ChevronRightIcon size={12} />
          </button>
        </div>
        <div className="divide-y" style={{ borderColor: 'rgba(59,130,246,0.06)' }}>
          {recentPosts.map(post => {
            const cat = getCategoryById(post.categoryId);
            const author = getUserById(post.authorId);
            return (
              <button key={post.id} onClick={() => navigate('post-detail', { postId: post.id })}
                className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors"
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(59,130,246,0.04)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}>
                <span className="text-xs px-2 py-0.5 rounded shrink-0" style={{ backgroundColor: `${CATEGORY_COLORS[post.categoryId]}15`, color: CATEGORY_COLORS[post.categoryId] }}>
                  {cat?.name}
                </span>
                <span className="flex-1 text-sm truncate" style={{ color: '#e2e8f0' }}>{post.title}</span>
                <div className="flex items-center gap-3 shrink-0 text-xs" style={{ color: '#475569' }}>
                  <span className="hidden sm:block">{post.isAnonymous ? '익명' : author?.displayName}</span>
                  <span className="flex items-center gap-1"><MessageIcon size={11} />{post.commentCount}</span>
                  <span className="flex items-center gap-1"><HeartIcon size={11} />{post.likeCount}</span>
                  <span className="hidden sm:block">{formatDate(post.createdAt)}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Write CTA */}
      <button onClick={() => navigate('post-form')}
        className="w-full py-4 rounded-xl border-2 border-dashed flex items-center justify-center gap-2 text-sm font-medium transition-all"
        style={{ borderColor: 'rgba(59,130,246,0.2)', color: '#64748b' }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(59,130,246,0.4)'; (e.currentTarget as HTMLElement).style.color = '#60a5fa'; (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(59,130,246,0.04)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(59,130,246,0.2)'; (e.currentTarget as HTMLElement).style.color = '#64748b'; (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}>
        <PlusIcon size={16} />
        새 게시글 작성하기
      </button>
    </div>
  );
}
