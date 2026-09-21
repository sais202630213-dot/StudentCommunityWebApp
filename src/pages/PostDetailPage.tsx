import { useState, useEffect } from 'react';
import { useApp } from '../context';
import {
  HeartIcon, BookmarkIcon, ShareIcon, FlagIcon, EditIcon, TrashIcon,
  MessageIcon, EyeIcon, ChevronLeftIcon, ReplyIcon, ThumbsUpIcon, TagIcon, PaperclipIcon,
} from '../icons';

const CATEGORY_COLORS: Record<string, string> = {
  notice: '#ef4444', 'ai-ml': '#3b82f6', programming: '#22c55e',
  project: '#a855f7', club: '#eab308', career: '#f97316', free: '#64748b',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function formatTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return '방금 전';
  if (m < 60) return `${m}분 전`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}시간 전`;
  return d.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return bytes + 'B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + 'KB';
  return (bytes / 1024 / 1024).toFixed(1) + 'MB';
}

export default function PostDetailPage() {
  const {
    navState, navigate, getPostById, getCommentsByPostId, getUserById, getCategoryById,
    currentUser, toggleLike, isLiked, toggleBookmark, isBookmarked,
    createComment, updateComment, deleteComment, deletePost,
    incrementView, showToast, showModal, reportContent,
  } = useApp();

  const postRaw = getPostById(navState.postId ?? '');
  const [commentText, setCommentText] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [showReportModal, setShowReportModal] = useState<{ targetId: string; type: 'post' | 'comment' } | null>(null);
  const [reportReason, setReportReason] = useState('');

  useEffect(() => {
    if (postRaw) incrementView(postRaw.id);
  }, [postRaw?.id]);

  if (!postRaw) {
    return (
      <div className="flex flex-col items-center justify-center py-24 fade-in-up">
        <div className="text-5xl mb-4">🔍</div>
        <div className="text-lg font-semibold mb-2" style={{ color: '#e2e8f0' }}>게시글을 찾을 수 없습니다</div>
        <div className="text-sm mb-6" style={{ color: '#64748b' }}>삭제되었거나 존재하지 않는 게시글입니다</div>
        <button onClick={() => navigate('board')} className="btn-primary text-white px-5 py-2 rounded-lg text-sm font-medium">
          게시판으로 돌아가기
        </button>
      </div>
    );
  }

  const post = postRaw!;
  const author = getUserById(post.authorId);
  const category = getCategoryById(post.categoryId);
  const allComments = getCommentsByPostId(post.id);
  const topComments = allComments.filter(c => !c.parentId);
  const liked = isLiked(post.id, 'post');
  const bookmarked = isBookmarked(post.id);
  const isOwner = post.authorId === currentUser.id;

  function handleDeletePost() {
    showModal({
      title: '게시글 삭제',
      message: '이 게시글을 삭제하시겠습니까? 삭제된 게시글은 복구할 수 없습니다.',
      confirmLabel: '삭제',
      danger: true,
      onConfirm: () => {
        deletePost(post.id);
        showToast('success', '게시글이 삭제되었습니다.');
        navigate('board', { categoryId: post.categoryId });
      },
    });
  }

  function handleSubmitComment(e: React.FormEvent, parentId?: string) {
    e.preventDefault();
    const text = parentId ? replyText : commentText;
    if (!text.trim()) return;
    createComment({ postId: post.id, content: text.trim(), parentId });
    if (parentId) { setReplyText(''); setReplyTo(null); }
    else setCommentText('');
    showToast('success', '댓글이 등록되었습니다.');
  }

  function handleUpdateComment(e: React.FormEvent) {
    e.preventDefault();
    if (!editingComment || !editText.trim()) return;
    updateComment(editingComment, editText.trim());
    setEditingComment(null);
    showToast('success', '댓글이 수정되었습니다.');
  }

  function handleDeleteComment(commentId: string) {
    showModal({
      title: '댓글 삭제',
      message: '이 댓글을 삭제하시겠습니까?',
      confirmLabel: '삭제',
      danger: true,
      onConfirm: () => {
        deleteComment(commentId);
        showToast('success', '댓글이 삭제되었습니다.');
      },
    });
  }

  function handleShare() {
    navigator.clipboard?.writeText(window.location.href).then(
      () => showToast('success', '링크가 클립보드에 복사되었습니다.'),
      () => showToast('info', '공유 링크: ' + post.title)
    );
  }

  function handleReport(targetId: string, type: 'post' | 'comment') {
    setShowReportModal({ targetId, type });
  }

  function submitReport() {
    if (!showReportModal || !reportReason.trim()) return;
    reportContent(showReportModal.targetId, showReportModal.type, reportReason.trim());
    showToast('success', '신고가 접수되었습니다.');
    setShowReportModal(null);
    setReportReason('');
  }

  return (
    <div className="space-y-4 fade-in-up max-w-3xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs" style={{ color: '#64748b' }}>
        <button onClick={() => navigate('home')} className="hover:text-blue-400 transition-colors">홈</button>
        <ChevronLeftIcon size={12} className="rotate-180" />
        <button onClick={() => navigate('board')} className="hover:text-blue-400 transition-colors">게시판</button>
        {category && (
          <>
            <ChevronLeftIcon size={12} className="rotate-180" />
            <button onClick={() => navigate('board', { categoryId: category.id })} className="hover:text-blue-400 transition-colors">
              {category.name}
            </button>
          </>
        )}
      </div>

      {/* Post card */}
      <article className="rounded-xl border overflow-hidden" style={{ backgroundColor: '#0a1626', borderColor: 'rgba(59,130,246,0.12)' }}>
        {/* Post header */}
        <div className="px-6 pt-6 pb-4 border-b" style={{ borderColor: 'rgba(59,130,246,0.1)' }}>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {post.isNotice && (
              <span className="px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: 'rgba(239,68,68,0.15)', color: '#f87171' }}>공지</span>
            )}
            {category && (
              <span className="px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: `${CATEGORY_COLORS[post.categoryId]}15`, color: CATEGORY_COLORS[post.categoryId] }}>
                {category.icon} {category.name}
              </span>
            )}
          </div>
          <h1 className="text-xl font-bold font-display leading-snug mb-4" style={{ color: '#e2e8f0' }}>{post.title}</h1>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
                {post.isAnonymous ? '익' : author?.displayName[0]}
              </div>
              <div>
                <div className="text-sm font-medium" style={{ color: '#e2e8f0' }}>
                  {post.isAnonymous ? '익명' : author?.displayName}
                  {author?.role === 'admin' && !post.isAnonymous && (
                    <span className="ml-2 px-1.5 py-0.5 rounded text-xs" style={{ backgroundColor: 'rgba(239,68,68,0.15)', color: '#f87171' }}>관리자</span>
                  )}
                  {author?.grade && !post.isAnonymous && (
                    <span className="ml-2 text-xs" style={{ color: '#64748b' }}>{author.grade}학년 {author.classNum}</span>
                  )}
                </div>
                <div className="text-xs" style={{ color: '#475569' }}>{formatDate(post.createdAt)}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs" style={{ color: '#475569' }}>
              <span className="flex items-center gap-1"><EyeIcon size={12} />{post.viewCount}</span>
              <span className="flex items-center gap-1"><HeartIcon size={12} />{post.likeCount}</span>
              <span className="flex items-center gap-1"><MessageIcon size={12} />{post.commentCount}</span>
            </div>
          </div>
        </div>

        {/* Post content */}
        <div className="px-6 py-5">
          <div className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: '#cbd5e1' }}>
            {post.content}
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-5">
              {post.tags.map(tag => (
                <span key={tag} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs"
                  style={{ backgroundColor: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', color: '#a78bfa' }}>
                  <TagIcon size={10} />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Attachments */}
          {post.attachments.length > 0 && (
            <div className="mt-5 p-3 rounded-lg border" style={{ borderColor: 'rgba(59,130,246,0.12)', backgroundColor: 'rgba(15,31,56,0.5)' }}>
              <div className="text-xs font-medium mb-2 flex items-center gap-1" style={{ color: '#94a3b8' }}>
                <PaperclipIcon size={12} />
                첨부파일 ({post.attachments.length})
              </div>
              {post.attachments.map(att => (
                <button key={att.id}
                  onClick={() => showToast('info', `${att.name} 다운로드 (데모 환경)`)}
                  className="flex items-center gap-2 py-1.5 text-sm transition-colors w-full text-left"
                  style={{ color: '#60a5fa' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#93c5fd'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#60a5fa'}>
                  📎 {att.name}
                  <span className="text-xs" style={{ color: '#475569' }}>({formatBytes(att.size)})</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Action bar */}
        <div className="px-6 pb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button onClick={() => { toggleLike(post.id, 'post'); if (!liked) showToast('success', '추천했습니다!'); }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{ backgroundColor: liked ? 'rgba(239,68,68,0.15)' : 'rgba(59,130,246,0.1)', color: liked ? '#f87171' : '#94a3b8', border: `1px solid ${liked ? 'rgba(239,68,68,0.3)' : 'rgba(59,130,246,0.15)'}` }}>
              <HeartIcon size={15} filled={liked} />
              추천 {post.likeCount}
            </button>
            <button onClick={() => { toggleBookmark(post.id); showToast(bookmarked ? 'info' : 'success', bookmarked ? '북마크가 해제되었습니다.' : '북마크에 저장했습니다.'); }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all"
              style={{ backgroundColor: bookmarked ? 'rgba(139,92,246,0.15)' : 'rgba(59,130,246,0.1)', color: bookmarked ? '#a78bfa' : '#94a3b8', border: `1px solid ${bookmarked ? 'rgba(139,92,246,0.3)' : 'rgba(59,130,246,0.15)'}` }}>
              <BookmarkIcon size={15} filled={bookmarked} />
            </button>
            <button onClick={handleShare}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all"
              style={{ backgroundColor: 'rgba(59,130,246,0.1)', color: '#94a3b8', border: '1px solid rgba(59,130,246,0.15)' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#60a5fa'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#94a3b8'}>
              <ShareIcon size={15} />
            </button>
            <button onClick={() => handleReport(post.id, 'post')}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all"
              style={{ backgroundColor: 'rgba(59,130,246,0.1)', color: '#94a3b8', border: '1px solid rgba(59,130,246,0.15)' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#f87171'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#94a3b8'}>
              <FlagIcon size={15} />
            </button>
          </div>

          {isOwner && (
            <div className="flex items-center gap-2">
              <button onClick={() => navigate('post-form', { editPostId: post.id })}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all"
                style={{ backgroundColor: 'rgba(59,130,246,0.1)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.2)' }}>
                <EditIcon size={14} />
                수정
              </button>
              <button onClick={handleDeletePost}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all"
                style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}>
                <TrashIcon size={14} />
                삭제
              </button>
            </div>
          )}
        </div>
      </article>

      {/* Comments */}
      <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: '#0a1626', borderColor: 'rgba(59,130,246,0.12)' }}>
        <div className="px-5 py-3 border-b flex items-center gap-2" style={{ borderColor: 'rgba(59,130,246,0.1)' }}>
          <MessageIcon size={15} style={{ color: '#60a5fa' }} />
          <span className="font-semibold text-sm font-display" style={{ color: '#e2e8f0' }}>댓글 {post.commentCount}</span>
        </div>

        {/* Comment form */}
        <div className="px-5 py-4 border-b" style={{ borderColor: 'rgba(59,130,246,0.08)' }}>
          <form onSubmit={e => handleSubmitComment(e)} className="flex gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 mt-0.5"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
              {currentUser.displayName[0]}
            </div>
            <div className="flex-1 space-y-2">
              <textarea
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                placeholder="댓글을 작성하세요... (Ctrl+Enter로 등록)"
                rows={3}
                className="w-full px-3 py-2 rounded-lg text-sm resize-none outline-none transition-all"
                style={{ backgroundColor: 'rgba(15,31,56,0.8)', border: '1px solid rgba(59,130,246,0.15)', color: '#e2e8f0' }}
                onFocus={e => e.currentTarget.style.borderColor = 'rgba(59,130,246,0.4)'}
                onBlur={e => e.currentTarget.style.borderColor = 'rgba(59,130,246,0.15)'}
                onKeyDown={e => { if (e.ctrlKey && e.key === 'Enter') handleSubmitComment(e as any); }}
              />
              <div className="flex justify-end">
                <button type="submit" disabled={!commentText.trim()}
                  className="btn-primary text-white px-4 py-1.5 rounded-lg text-sm font-medium">
                  등록
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Comment list */}
        <div>
          {topComments.length === 0 ? (
            <div className="py-10 text-center text-sm" style={{ color: '#64748b' }}>
              첫 번째 댓글을 남겨보세요!
            </div>
          ) : topComments.map(comment => {
            const replies = allComments.filter(c => c.parentId === comment.id);
            const commentAuthor = getUserById(comment.authorId);
            const isCommentOwner = comment.authorId === currentUser.id;
            const commentLiked = isLiked(comment.id, 'comment');

            return (
              <div key={comment.id} className="border-b" style={{ borderColor: 'rgba(59,130,246,0.06)' }}>
                {/* Main comment */}
                <div className="px-5 py-4">
                  <div className="flex gap-3">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                      style={{ background: comment.isDeleted ? '#1e293b' : 'linear-gradient(135deg, #1d4ed8, #7c3aed)' }}>
                      {comment.isDeleted ? '✕' : commentAuthor?.displayName[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      {!comment.isDeleted && (
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium" style={{ color: '#e2e8f0' }}>{commentAuthor?.displayName}</span>
                          {commentAuthor?.grade && (
                            <span className="text-xs" style={{ color: '#475569' }}>{commentAuthor.grade}학년</span>
                          )}
                          <span className="text-xs" style={{ color: '#475569' }}>{formatTime(comment.createdAt)}</span>
                          {comment.updatedAt !== comment.createdAt && (
                            <span className="text-xs" style={{ color: '#374151' }}>(수정됨)</span>
                          )}
                        </div>
                      )}

                      {editingComment === comment.id ? (
                        <form onSubmit={handleUpdateComment} className="space-y-2">
                          <textarea value={editText} onChange={e => setEditText(e.target.value)} rows={2}
                            className="w-full px-3 py-2 rounded-lg text-sm resize-none outline-none"
                            style={{ backgroundColor: 'rgba(15,31,56,0.8)', border: '1px solid rgba(59,130,246,0.3)', color: '#e2e8f0' }} />
                          <div className="flex gap-2">
                            <button type="submit" className="px-3 py-1 rounded-lg text-xs font-medium btn-primary text-white">저장</button>
                            <button type="button" onClick={() => setEditingComment(null)}
                              className="px-3 py-1 rounded-lg text-xs font-medium" style={{ backgroundColor: 'rgba(59,130,246,0.1)', color: '#94a3b8' }}>취소</button>
                          </div>
                        </form>
                      ) : (
                        <p className="text-sm leading-relaxed" style={{ color: comment.isDeleted ? '#475569' : '#cbd5e1' }}>
                          {comment.content}
                        </p>
                      )}

                      {!comment.isDeleted && editingComment !== comment.id && (
                        <div className="flex items-center gap-3 mt-2">
                          <button onClick={() => { toggleLike(comment.id, 'comment'); }}
                            className="flex items-center gap-1 text-xs transition-colors"
                            style={{ color: commentLiked ? '#f87171' : '#64748b' }}>
                            <ThumbsUpIcon size={12} filled={commentLiked} />
                            {comment.likeCount > 0 && comment.likeCount}
                          </button>
                          <button onClick={() => { setReplyTo(comment.id); setReplyText(''); }}
                            className="flex items-center gap-1 text-xs transition-colors"
                            style={{ color: '#64748b' }}
                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#60a5fa'}
                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#64748b'}>
                            <ReplyIcon size={12} />
                            답글
                          </button>
                          {isCommentOwner && (
                            <>
                              <button onClick={() => { setEditingComment(comment.id); setEditText(comment.content); }}
                                className="text-xs transition-colors" style={{ color: '#64748b' }}
                                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#60a5fa'}
                                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#64748b'}>수정</button>
                              <button onClick={() => handleDeleteComment(comment.id)}
                                className="text-xs transition-colors" style={{ color: '#64748b' }}
                                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#f87171'}
                                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#64748b'}>삭제</button>
                            </>
                          )}
                          <button onClick={() => handleReport(comment.id, 'comment')}
                            className="text-xs transition-colors" style={{ color: '#64748b' }}
                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#f87171'}
                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#64748b'}>신고</button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Reply form */}
                  {replyTo === comment.id && (
                    <div className="mt-3 ml-10">
                      <form onSubmit={e => handleSubmitComment(e, comment.id)} className="flex gap-2">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5"
                          style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
                          {currentUser.displayName[0]}
                        </div>
                        <div className="flex-1 space-y-2">
                          <textarea value={replyText} onChange={e => setReplyText(e.target.value)} rows={2}
                            placeholder={`@${commentAuthor?.displayName} 님에게 답글...`}
                            className="w-full px-3 py-2 rounded-lg text-sm resize-none outline-none"
                            style={{ backgroundColor: 'rgba(15,31,56,0.8)', border: '1px solid rgba(59,130,246,0.3)', color: '#e2e8f0' }} />
                          <div className="flex gap-2">
                            <button type="submit" disabled={!replyText.trim()}
                              className="px-3 py-1 rounded-lg text-xs font-medium btn-primary text-white">등록</button>
                            <button type="button" onClick={() => setReplyTo(null)}
                              className="px-3 py-1 rounded-lg text-xs font-medium" style={{ backgroundColor: 'rgba(59,130,246,0.1)', color: '#94a3b8' }}>취소</button>
                          </div>
                        </div>
                      </form>
                    </div>
                  )}
                </div>

                {/* Replies */}
                {replies.map(reply => {
                  const replyAuthor = getUserById(reply.authorId);
                  const isReplyOwner = reply.authorId === currentUser.id;
                  const replyLiked = isLiked(reply.id, 'comment');
                  return (
                    <div key={reply.id} className="pl-10 pr-5 py-3" style={{ backgroundColor: 'rgba(15,31,56,0.4)' }}>
                      <div className="flex gap-3">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                          style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}>
                          {replyAuthor?.displayName[0]}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium" style={{ color: '#e2e8f0' }}>{replyAuthor?.displayName}</span>
                            <span className="text-xs" style={{ color: '#475569' }}>{formatTime(reply.createdAt)}</span>
                          </div>
                          {editingComment === reply.id ? (
                            <form onSubmit={handleUpdateComment} className="space-y-1">
                              <textarea value={editText} onChange={e => setEditText(e.target.value)} rows={2}
                                className="w-full px-3 py-2 rounded-lg text-xs resize-none outline-none"
                                style={{ backgroundColor: 'rgba(15,31,56,0.8)', border: '1px solid rgba(59,130,246,0.3)', color: '#e2e8f0' }} />
                              <div className="flex gap-2">
                                <button type="submit" className="px-3 py-1 rounded-lg text-xs btn-primary text-white">저장</button>
                                <button type="button" onClick={() => setEditingComment(null)}
                                  className="px-3 py-1 rounded-lg text-xs" style={{ backgroundColor: 'rgba(59,130,246,0.1)', color: '#94a3b8' }}>취소</button>
                              </div>
                            </form>
                          ) : (
                            <p className="text-xs leading-relaxed" style={{ color: '#cbd5e1' }}>{reply.content}</p>
                          )}
                          {editingComment !== reply.id && (
                            <div className="flex items-center gap-3 mt-1.5">
                              <button onClick={() => toggleLike(reply.id, 'comment')}
                                className="flex items-center gap-1 text-xs" style={{ color: replyLiked ? '#f87171' : '#64748b' }}>
                                <ThumbsUpIcon size={10} filled={replyLiked} />
                                {reply.likeCount > 0 && reply.likeCount}
                              </button>
                              {isReplyOwner && (
                                <>
                                  <button onClick={() => { setEditingComment(reply.id); setEditText(reply.content); }}
                                    className="text-xs transition-colors" style={{ color: '#64748b' }}
                                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#60a5fa'}
                                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#64748b'}>수정</button>
                                  <button onClick={() => handleDeleteComment(reply.id)}
                                    className="text-xs transition-colors" style={{ color: '#64748b' }}
                                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#f87171'}
                                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#64748b'}>삭제</button>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Report modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
          onClick={e => { if (e.target === e.currentTarget) { setShowReportModal(null); setReportReason(''); } }}>
          <div className="modal-in rounded-2xl border p-6 w-full max-w-md" style={{ backgroundColor: '#0a1626', borderColor: 'rgba(239,68,68,0.3)' }}>
            <h3 className="font-bold text-base mb-3 font-display" style={{ color: '#e2e8f0' }}>신고하기</h3>
            <p className="text-sm mb-4" style={{ color: '#94a3b8' }}>신고 사유를 선택하거나 직접 입력해주세요.</p>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {['스팸/광고', '욕설/혐오', '불법 정보', '개인정보 침해', '주제 부적합', '기타'].map(r => (
                <button key={r} onClick={() => setReportReason(r)}
                  className="px-3 py-2 rounded-lg text-xs text-left transition-all"
                  style={{ backgroundColor: reportReason === r ? 'rgba(239,68,68,0.15)' : 'rgba(59,130,246,0.08)', border: `1px solid ${reportReason === r ? 'rgba(239,68,68,0.4)' : 'rgba(59,130,246,0.12)'}`, color: reportReason === r ? '#f87171' : '#94a3b8' }}>
                  {r}
                </button>
              ))}
            </div>
            <textarea value={reportReason} onChange={e => setReportReason(e.target.value)} placeholder="신고 사유를 상세히 입력해주세요..." rows={3}
              className="w-full px-3 py-2 rounded-lg text-sm resize-none outline-none mb-4"
              style={{ backgroundColor: 'rgba(15,31,56,0.8)', border: '1px solid rgba(59,130,246,0.15)', color: '#e2e8f0' }} />
            <div className="flex gap-2 justify-end">
              <button onClick={() => { setShowReportModal(null); setReportReason(''); }}
                className="px-4 py-2 rounded-lg text-sm" style={{ backgroundColor: 'rgba(59,130,246,0.1)', color: '#94a3b8' }}>취소</button>
              <button onClick={submitReport} disabled={!reportReason.trim()}
                className="px-4 py-2 rounded-lg text-sm font-medium btn-primary text-white disabled:opacity-40">신고 접수</button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex gap-3">
        <button onClick={() => navigate('board', { categoryId: post.categoryId })}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all"
          style={{ backgroundColor: 'rgba(59,130,246,0.1)', color: '#94a3b8', border: '1px solid rgba(59,130,246,0.15)' }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#60a5fa'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#94a3b8'}>
          <ChevronLeftIcon size={15} />
          목록
        </button>
        <button onClick={() => navigate('post-form')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium btn-primary text-white">
          글쓰기
        </button>
      </div>
    </div>
  );
}
