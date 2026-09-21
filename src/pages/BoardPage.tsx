import { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context';
import { SearchIcon, PlusIcon, EyeIcon, HeartIcon, MessageIcon, FilterIcon, ChevronLeftIcon, ChevronRightIcon, NoticeIcon } from '../icons';

const CATEGORY_COLORS: Record<string, string> = {
  notice: '#ef4444', 'ai-ml': '#3b82f6', programming: '#22c55e',
  project: '#a855f7', club: '#eab308', career: '#f97316', free: '#64748b',
};

function formatDate(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}분 전`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}시간 전`;
  return d.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
}

function formatNum(n: number) {
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return String(n);
}

type SortKey = 'newest' | 'popular' | 'comments' | 'views';

const PAGE_SIZE = 15;

export default function BoardPage() {
  const { posts, categories, navState, navigate, getCategoryById, getUserById } = useApp();

  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortKey>('newest');
  const [filterCat, setFilterCat] = useState<string>(navState.categoryId ?? '');
  const [page, setPage] = useState(1);

  // 사이드바나 헤더에서 카테고리 변경 시 필터 동기화
  useEffect(() => {
    setFilterCat(navState.categoryId ?? '');
    setPage(1);
  }, [navState.categoryId]);

  const selectedCategory = filterCat ? categories.find(c => c.id === filterCat) : null;

  const filtered = useMemo(() => {
    let list = [...posts];
    if (filterCat) list = list.filter(p => p.categoryId === filterCat);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(p => p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q)));
    }
    switch (sort) {
      case 'newest': list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
      case 'popular': list.sort((a, b) => b.likeCount - a.likeCount); break;
      case 'comments': list.sort((a, b) => b.commentCount - a.commentCount); break;
      case 'views': list.sort((a, b) => b.viewCount - a.viewCount); break;
    }
    return list;
  }, [posts, filterCat, search, sort]);

  const notices = filtered.filter(p => p.isNotice || p.isPinned);
  const regular = filtered.filter(p => !p.isNotice && !p.isPinned);
  const totalPages = Math.max(1, Math.ceil(regular.length / PAGE_SIZE));
  const paginated = regular.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleCatFilter(id: string) {
    setFilterCat(id);
    setPage(1);
  }

  function handleSort(s: SortKey) {
    setSort(s);
    setPage(1);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
  }

  return (
    <div className="space-y-4 fade-in-up">
      {/* Board header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-display flex items-center gap-2" style={{ color: '#e2e8f0' }}>
            {selectedCategory ? (
              <>
                <span className="text-2xl">{selectedCategory.icon}</span>
                {selectedCategory.name}
              </>
            ) : '전체 게시판'}
          </h1>
          <p className="text-sm mt-1" style={{ color: '#64748b' }}>
            {selectedCategory?.description ?? '모든 게시글을 볼 수 있는 공간입니다'}
          </p>
        </div>
        <button onClick={() => navigate('post-form', filterCat ? { categoryId: filterCat } : {})}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium btn-primary text-white shrink-0">
          <PlusIcon size={15} />
          글쓰기
        </button>
      </div>

      {/* Filter bar */}
      <div className="rounded-xl border p-4 space-y-3" style={{ backgroundColor: '#0a1626', borderColor: 'rgba(59,130,246,0.12)' }}>
        {/* Search */}
        <form onSubmit={handleSearch}>
          <div className="relative">
            <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#64748b' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="제목, 내용, 태그 검색..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm outline-none transition-all"
              style={{ backgroundColor: 'rgba(15,31,56,0.8)', border: '1px solid rgba(59,130,246,0.15)', color: '#e2e8f0' }}
              onFocus={e => e.currentTarget.style.borderColor = 'rgba(59,130,246,0.4)'}
              onBlur={e => e.currentTarget.style.borderColor = 'rgba(59,130,246,0.15)'}
            />
          </div>
        </form>

        <div className="flex flex-wrap gap-2 items-center justify-between">
          {/* Category filter */}
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => handleCatFilter('')}
              className="px-3 py-1 rounded-full text-xs font-medium border transition-all"
              style={{
                borderColor: !filterCat ? 'rgba(59,130,246,0.5)' : 'rgba(59,130,246,0.15)',
                backgroundColor: !filterCat ? 'rgba(59,130,246,0.15)' : 'transparent',
                color: !filterCat ? '#60a5fa' : '#64748b',
              }}>
              전체
            </button>
            {categories.map(cat => (
              <button key={cat.id}
                onClick={() => handleCatFilter(cat.id)}
                className="px-3 py-1 rounded-full text-xs font-medium border transition-all"
                style={{
                  borderColor: filterCat === cat.id ? `${CATEGORY_COLORS[cat.id]}60` : 'rgba(59,130,246,0.12)',
                  backgroundColor: filterCat === cat.id ? `${CATEGORY_COLORS[cat.id]}15` : 'transparent',
                  color: filterCat === cat.id ? CATEGORY_COLORS[cat.id] : '#64748b',
                }}>
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-1">
            <FilterIcon size={12} style={{ color: '#64748b' }} />
            {(['newest', 'popular', 'comments', 'views'] as SortKey[]).map((s, i) => {
              const labels = ['최신순', '인기순', '댓글순', '조회순'];
              return (
                <button key={s}
                  onClick={() => handleSort(s)}
                  className="px-2.5 py-1 rounded-lg text-xs transition-all"
                  style={{
                    backgroundColor: sort === s ? 'rgba(59,130,246,0.15)' : 'transparent',
                    color: sort === s ? '#60a5fa' : '#64748b',
                  }}>
                  {labels[i]}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between text-xs" style={{ color: '#64748b' }}>
        <span>총 {filtered.length}개의 게시글{search && ` · "${search}" 검색 결과`}</span>
      </div>

      {/* Posts list */}
      <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: '#0a1626', borderColor: 'rgba(59,130,246,0.12)' }}>
        {/* Header row */}
        <div className="hidden sm:grid px-4 py-2.5 text-xs font-medium border-b" style={{ gridTemplateColumns: '1fr 90px 80px 60px 50px 50px', borderColor: 'rgba(59,130,246,0.1)', color: '#475569' }}>
          <span>제목</span>
          <span className="text-center">작성자</span>
          <span className="text-center">날짜</span>
          <span className="text-center flex items-center justify-center gap-1"><EyeIcon size={10} />조회</span>
          <span className="text-center flex items-center justify-center gap-1"><HeartIcon size={10} />추천</span>
          <span className="text-center flex items-center justify-center gap-1"><MessageIcon size={10} />댓글</span>
        </div>

        {/* Pinned/notice posts */}
        {notices.length > 0 && (
          <>
            {notices.map(post => {
              const cat = getCategoryById(post.categoryId);
              const author = getUserById(post.authorId);
              return (
                <PostRow key={post.id} post={post} cat={cat} author={author} isNotice onClick={() => navigate('post-detail', { postId: post.id })} />
              );
            })}
            <div className="border-b border-dashed" style={{ borderColor: 'rgba(59,130,246,0.1)' }} />
          </>
        )}

        {/* Regular posts */}
        {paginated.length === 0 ? (
          <div className="py-16 text-center">
            <div className="text-4xl mb-3">📭</div>
            <div className="text-sm font-medium mb-1" style={{ color: '#e2e8f0' }}>게시글이 없습니다</div>
            <div className="text-xs mb-4" style={{ color: '#64748b' }}>
              {search ? `"${search}"에 해당하는 게시글을 찾을 수 없습니다` : '첫 번째 게시글을 작성해보세요!'}
            </div>
            {!search && (
              <button onClick={() => navigate('post-form', filterCat ? { categoryId: filterCat } : {})}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium btn-primary text-white">
                <PlusIcon size={15} />
                글쓰기
              </button>
            )}
          </div>
        ) : paginated.map(post => {
          const cat = getCategoryById(post.categoryId);
          const author = getUserById(post.authorId);
          return <PostRow key={post.id} post={post} cat={cat} author={author} onClick={() => navigate('post-detail', { postId: post.id })} />;
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30"
            style={{ backgroundColor: 'rgba(59,130,246,0.1)', color: '#94a3b8' }}>
            <ChevronLeftIcon size={16} />
          </button>
          {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
            const p = totalPages <= 7 ? i + 1 : page <= 4 ? i + 1 : page >= totalPages - 3 ? totalPages - 6 + i : page - 3 + i;
            return (
              <button key={p} onClick={() => setPage(p)}
                className="w-8 h-8 rounded-lg text-sm font-medium transition-all"
                style={{ backgroundColor: page === p ? '#3b82f6' : 'rgba(59,130,246,0.1)', color: page === p ? '#fff' : '#94a3b8' }}>
                {p}
              </button>
            );
          })}
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30"
            style={{ backgroundColor: 'rgba(59,130,246,0.1)', color: '#94a3b8' }}>
            <ChevronRightIcon size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

interface PostRowProps {
  post: import('../types').Post;
  cat?: import('../types').Category;
  author?: import('../types').User;
  isNotice?: boolean;
  onClick: () => void;
}

function PostRow({ post, cat, author, isNotice, onClick }: PostRowProps) {
  return (
    <button onClick={onClick}
      className="w-full text-left transition-colors border-b"
      style={{ borderColor: 'rgba(59,130,246,0.06)' }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(59,130,246,0.04)'}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}>
      {/* Mobile layout */}
      <div className="sm:hidden px-4 py-3 flex flex-col gap-1">
        <div className="flex items-center gap-2">
          {isNotice && (
            <span className="px-1.5 py-0.5 rounded text-xs shrink-0" style={{ backgroundColor: 'rgba(239,68,68,0.15)', color: '#f87171' }}>공지</span>
          )}
          {cat && (
            <span className="text-xs shrink-0" style={{ color: CATEGORY_COLORS[post.categoryId] }}>{cat.name}</span>
          )}
        </div>
        <div className="text-sm font-medium" style={{ color: '#e2e8f0' }}>{post.title}</div>
        <div className="flex items-center gap-3 text-xs" style={{ color: '#475569' }}>
          <span>{post.isAnonymous ? '익명' : author?.displayName}</span>
          <span className="flex items-center gap-1"><HeartIcon size={10} />{post.likeCount}</span>
          <span className="flex items-center gap-1"><MessageIcon size={10} />{post.commentCount}</span>
          <span className="flex items-center gap-1"><EyeIcon size={10} />{post.viewCount}</span>
          <span className="ml-auto">{formatDate(post.createdAt)}</span>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden sm:grid items-center px-4 py-3 gap-2" style={{ gridTemplateColumns: '1fr 90px 80px 60px 50px 50px' }}>
        <div className="flex items-center gap-2 min-w-0">
          {isNotice && (
            <span className="px-1.5 py-0.5 rounded text-xs shrink-0" style={{ backgroundColor: 'rgba(239,68,68,0.15)', color: '#f87171' }}>공지</span>
          )}
          {cat && !isNotice && (
            <span className="text-xs px-1.5 py-0.5 rounded shrink-0" style={{ backgroundColor: `${CATEGORY_COLORS[post.categoryId]}15`, color: CATEGORY_COLORS[post.categoryId] }}>
              {cat.name}
            </span>
          )}
          <span className="text-sm truncate" style={{ color: '#e2e8f0' }}>
            {post.title}
            {post.commentCount > 0 && (
              <span className="ml-1.5 text-xs" style={{ color: '#3b82f6' }}>[{post.commentCount}]</span>
            )}
          </span>
          {post.tags.length > 0 && (
            <span className="hidden xl:block text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(139,92,246,0.1)', color: '#a78bfa' }}>
              {post.tags[0]}
            </span>
          )}
        </div>
        <span className="text-xs text-center truncate" style={{ color: '#94a3b8' }}>
          {post.isAnonymous ? '익명' : author?.displayName}
        </span>
        <span className="text-xs text-center" style={{ color: '#475569' }}>{formatDate(post.createdAt)}</span>
        <span className="text-xs text-center" style={{ color: '#475569' }}>{formatNum(post.viewCount)}</span>
        <span className="text-xs text-center" style={{ color: post.likeCount > 50 ? '#f97316' : '#475569' }}>{post.likeCount}</span>
        <span className="text-xs text-center" style={{ color: post.commentCount > 10 ? '#3b82f6' : '#475569' }}>{post.commentCount}</span>
      </div>
    </button>
  );
}
