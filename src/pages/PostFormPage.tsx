import { useState, useEffect } from 'react';
import { useApp } from '../context';
import { XIcon, PlusIcon, PaperclipIcon, ChevronLeftIcon } from '../icons';
import type { Attachment } from '../types';

export default function PostFormPage() {
  const { navState, navigate, categories, getPostById, createPost, updatePost, showToast, showModal } = useApp();

  const editPost = navState.editPostId ? getPostById(navState.editPostId) : undefined;
  const isEdit = Boolean(editPost);

  const [categoryId, setCategoryId] = useState(editPost?.categoryId ?? navState.categoryId ?? '');
  const [title, setTitle] = useState(editPost?.title ?? '');
  const [content, setContent] = useState(editPost?.content ?? '');
  const [tags, setTags] = useState<string[]>(editPost?.tags ?? []);
  const [tagInput, setTagInput] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(editPost?.isAnonymous ?? false);
  const [isNotice, setIsNotice] = useState(editPost?.isNotice ?? false);
  const [attachments] = useState<Attachment[]>(editPost?.attachments ?? []);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; content?: string; category?: string }>({});

  useEffect(() => {
    if (!navState.editPostId && navState.categoryId) {
      setCategoryId(navState.categoryId);
    }
  }, [navState]);

  function validate() {
    const errs: typeof errors = {};
    if (!title.trim()) errs.title = '제목을 입력해주세요.';
    else if (title.trim().length < 2) errs.title = '제목은 2자 이상이어야 합니다.';
    if (!content.trim()) errs.content = '본문을 입력해주세요.';
    else if (content.trim().length < 10) errs.content = '본문은 10자 이상이어야 합니다.';
    if (!categoryId) errs.category = '게시판을 선택해주세요.';
    return errs;
  }

  function handleAddTag(e: React.KeyboardEvent) {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().replace(/^#/, '');
      if (newTag && !tags.includes(newTag) && tags.length < 5) {
        setTags(prev => [...prev, newTag]);
      }
      setTagInput('');
    }
  }

  function handleRemoveTag(tag: string) {
    setTags(prev => prev.filter(t => t !== tag));
  }

  async function handleSubmit(e: React.FormEvent, isDraft = false) {
    e.preventDefault();
    if (!isDraft) {
      const errs = validate();
      if (Object.keys(errs).length > 0) {
        setErrors(errs);
        return;
      }
    }

    setSaving(true);
    await new Promise(r => setTimeout(r, 600)); // simulate

    if (isEdit && editPost) {
      updatePost(editPost.id, { title: title.trim(), content: content.trim(), categoryId, tags, isAnonymous, isNotice });
      showToast('success', '게시글이 수정되었습니다.');
      navigate('post-detail', { postId: editPost.id });
    } else if (isDraft) {
      showToast('info', '임시저장 되었습니다.');
      setSaving(false);
      return;
    } else {
      const newPost = createPost({ title: title.trim(), content: content.trim(), categoryId, tags, isAnonymous, isNotice, attachments });
      showToast('success', '게시글이 등록되었습니다!');
      navigate('post-detail', { postId: newPost.id });
    }
    setSaving(false);
  }

  function handleCancel() {
    if (title.trim() || content.trim()) {
      showModal({
        title: '작성 취소',
        message: '작성 중인 내용이 있습니다. 취소하시겠습니까? 작성 중인 내용은 저장되지 않습니다.',
        confirmLabel: '취소',
        danger: true,
        onConfirm: () => navigate(isEdit ? 'post-detail' : 'board', isEdit ? { postId: editPost?.id } : {}),
      });
    } else {
      navigate(isEdit ? 'post-detail' : 'board', isEdit ? { postId: editPost?.id } : {});
    }
  }

  const charCount = content.length;
  const titleCount = title.length;

  return (
    <div className="max-w-2xl fade-in-up">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={handleCancel} className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
          style={{ backgroundColor: 'rgba(59,130,246,0.1)', color: '#94a3b8' }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#60a5fa'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#94a3b8'}>
          <ChevronLeftIcon size={18} />
        </button>
        <h1 className="text-xl font-bold font-display" style={{ color: '#e2e8f0' }}>
          {isEdit ? '게시글 수정' : '새 게시글 작성'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#94a3b8' }}>
            게시판 <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {categories.map(cat => (
              <button key={cat.id} type="button"
                onClick={() => { setCategoryId(cat.id); setErrors(e => ({ ...e, category: undefined })); }}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-left transition-all"
                style={{
                  backgroundColor: categoryId === cat.id ? `rgba(59,130,246,0.15)` : 'rgba(15,31,56,0.8)',
                  border: `1px solid ${categoryId === cat.id ? 'rgba(59,130,246,0.4)' : 'rgba(59,130,246,0.12)'}`,
                  color: categoryId === cat.id ? '#60a5fa' : '#94a3b8',
                }}>
                <span>{cat.icon}</span>
                <span className="truncate">{cat.name}</span>
              </button>
            ))}
          </div>
          {errors.category && <p className="text-xs mt-1" style={{ color: '#f87171' }}>{errors.category}</p>}
        </div>

        {/* Title */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium" style={{ color: '#94a3b8' }}>
              제목 <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <span className="text-xs" style={{ color: titleCount > 80 ? '#f87171' : '#475569' }}>{titleCount}/100</span>
          </div>
          <input
            value={title}
            onChange={e => { setTitle(e.target.value.slice(0, 100)); setErrors(prev => ({ ...prev, title: undefined })); }}
            placeholder="제목을 입력하세요"
            className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all"
            style={{
              backgroundColor: 'rgba(15,31,56,0.8)',
              border: `1px solid ${errors.title ? 'rgba(239,68,68,0.5)' : 'rgba(59,130,246,0.15)'}`,
              color: '#e2e8f0',
            }}
            onFocus={e => e.currentTarget.style.borderColor = errors.title ? 'rgba(239,68,68,0.6)' : 'rgba(59,130,246,0.4)'}
            onBlur={e => e.currentTarget.style.borderColor = errors.title ? 'rgba(239,68,68,0.5)' : 'rgba(59,130,246,0.15)'}
          />
          {errors.title && <p className="text-xs mt-1" style={{ color: '#f87171' }}>{errors.title}</p>}
        </div>

        {/* Content */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium" style={{ color: '#94a3b8' }}>
              본문 <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <span className="text-xs" style={{ color: '#475569' }}>{charCount}자</span>
          </div>
          <textarea
            value={content}
            onChange={e => { setContent(e.target.value); setErrors(prev => ({ ...prev, content: undefined })); }}
            placeholder="내용을 입력하세요&#10;&#10;마크다운 문법을 지원합니다:&#10;**굵게** _기울임_ `코드`&#10;## 제목&#10;- 목록"
            rows={14}
            className="w-full px-4 py-3 rounded-lg text-sm resize-none outline-none transition-all font-mono"
            style={{
              backgroundColor: 'rgba(15,31,56,0.8)',
              border: `1px solid ${errors.content ? 'rgba(239,68,68,0.5)' : 'rgba(59,130,246,0.15)'}`,
              color: '#e2e8f0',
              lineHeight: '1.6',
            }}
            onFocus={e => e.currentTarget.style.borderColor = errors.content ? 'rgba(239,68,68,0.6)' : 'rgba(59,130,246,0.4)'}
            onBlur={e => e.currentTarget.style.borderColor = errors.content ? 'rgba(239,68,68,0.5)' : 'rgba(59,130,246,0.15)'}
          />
          {errors.content && <p className="text-xs mt-1" style={{ color: '#f87171' }}>{errors.content}</p>}
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#94a3b8' }}>태그 (최대 5개)</label>
          <div className="rounded-lg px-3 py-2 flex flex-wrap gap-2 min-h-[44px] items-center"
            style={{ backgroundColor: 'rgba(15,31,56,0.8)', border: '1px solid rgba(59,130,246,0.15)' }}>
            {tags.map(tag => (
              <span key={tag} className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs"
                style={{ backgroundColor: 'rgba(139,92,246,0.15)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.2)' }}>
                #{tag}
                <button type="button" onClick={() => handleRemoveTag(tag)}
                  className="transition-colors ml-0.5" style={{ color: '#a78bfa' }}>
                  <XIcon size={10} />
                </button>
              </span>
            ))}
            {tags.length < 5 && (
              <input
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder={tags.length === 0 ? "태그 입력 후 Enter (예: AI, Python)" : "+ 태그 추가"}
                className="flex-1 min-w-24 bg-transparent outline-none text-xs"
                style={{ color: '#e2e8f0' }}
              />
            )}
          </div>
          <p className="text-xs mt-1" style={{ color: '#475569' }}>Enter 또는 쉼표(,)로 태그를 추가하세요</p>
        </div>

        {/* Attachments */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#94a3b8' }}>파일 첨부</label>
          <button type="button"
            onClick={() => showToast('info', '파일 업로드는 데모 환경에서 지원하지 않습니다.')}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border-2 border-dashed text-sm transition-all"
            style={{ borderColor: 'rgba(59,130,246,0.2)', color: '#64748b' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(59,130,246,0.4)'; (e.currentTarget as HTMLElement).style.color = '#60a5fa'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(59,130,246,0.2)'; (e.currentTarget as HTMLElement).style.color = '#64748b'; }}>
            <PaperclipIcon size={15} />
            파일 선택 (최대 100MB)
          </button>
          {attachments.length > 0 && (
            <div className="mt-2 space-y-1">
              {attachments.map(att => (
                <div key={att.id} className="flex items-center gap-2 text-xs" style={{ color: '#60a5fa' }}>
                  📎 {att.name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Options */}
        <div className="flex flex-wrap gap-4 py-3 px-4 rounded-lg" style={{ backgroundColor: 'rgba(15,31,56,0.5)', border: '1px solid rgba(59,130,246,0.1)' }}>
          <label className="flex items-center gap-2 cursor-pointer">
            <div className="relative" onClick={() => setIsAnonymous(v => !v)}>
              <div className="w-10 h-5 rounded-full transition-colors" style={{ backgroundColor: isAnonymous ? '#3b82f6' : '#1e3a5f' }} />
              <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform" style={{ transform: isAnonymous ? 'translateX(20px)' : 'translateX(0)' }} />
            </div>
            <span className="text-sm" style={{ color: '#94a3b8' }}>익명으로 작성</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <div className="relative" onClick={() => setIsNotice(v => !v)}>
              <div className="w-10 h-5 rounded-full transition-colors" style={{ backgroundColor: isNotice ? '#ef4444' : '#1e3a5f' }} />
              <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform" style={{ transform: isNotice ? 'translateX(20px)' : 'translateX(0)' }} />
            </div>
            <span className="text-sm" style={{ color: '#94a3b8' }}>공지로 등록 (관리자)</span>
          </label>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={handleCancel}
            className="px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
            style={{ backgroundColor: 'rgba(59,130,246,0.1)', color: '#94a3b8', border: '1px solid rgba(59,130,246,0.15)' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#e2e8f0'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#94a3b8'}>
            취소
          </button>
          <button type="button" onClick={e => handleSubmit(e, true)}
            disabled={saving}
            className="px-5 py-2.5 rounded-lg text-sm font-medium transition-all disabled:opacity-40"
            style={{ backgroundColor: 'rgba(59,130,246,0.1)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.3)' }}>
            임시저장
          </button>
          <button type="submit" disabled={saving}
            className="flex-1 btn-primary text-white px-5 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2">
            {saving ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                {isEdit ? '수정 중...' : '등록 중...'}
              </>
            ) : (
              <>
                <PlusIcon size={15} />
                {isEdit ? '수정 완료' : '게시글 등록'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
