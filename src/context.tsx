import React, { createContext, useContext, useState, useCallback } from 'react';
import type {
  User, Category, Post, Comment, Like, Bookmark, Report, Notification,
  NavState, Page, ToastItem, ToastType, ModalOptions, CreatePostData, CreateCommentData,
} from './types';
import {
  USERS, CATEGORIES, INITIAL_POSTS, INITIAL_COMMENTS,
  INITIAL_LIKES, INITIAL_BOOKMARKS, INITIAL_NOTIFICATIONS, INITIAL_REPORTS,
  CURRENT_USER_ID,
} from './data';

const STORAGE_VERSION = 'saih-v1';

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(`${STORAGE_VERSION}:${key}`);
    if (raw) return JSON.parse(raw) as T;
  } catch {}
  return fallback;
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(`${STORAGE_VERSION}:${key}`, JSON.stringify(value));
  } catch {}
}

function usePersisted<T>(key: string, initial: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setStateRaw] = useState<T>(() => loadFromStorage(key, initial));
  const setState = useCallback((action: React.SetStateAction<T>) => {
    setStateRaw(prev => {
      const next = typeof action === 'function' ? (action as (p: T) => T)(prev) : action;
      saveToStorage(key, next);
      return next;
    });
  }, [key]);
  return [state, setState as React.Dispatch<React.SetStateAction<T>>];
}

interface AppContextType {
  // Data
  users: User[];
  categories: Category[];
  posts: Post[];
  comments: Comment[];
  likes: Like[];
  bookmarks: Bookmark[];
  reports: Report[];
  notifications: Notification[];
  currentUser: User;

  // Navigation
  navState: NavState;
  navigate: (page: Page, options?: Partial<NavState>) => void;

  // Toast
  toasts: ToastItem[];
  showToast: (type: ToastType, message: string) => void;
  dismissToast: (id: string) => void;

  // Modal
  modal: ModalOptions | null;
  showModal: (options: ModalOptions) => void;
  closeModal: () => void;

  // Post CRUD
  createPost: (data: CreatePostData) => Post;
  updatePost: (id: string, data: Partial<Post>) => void;
  deletePost: (id: string) => void;
  incrementView: (postId: string) => void;

  // Comment CRUD
  createComment: (data: CreateCommentData) => Comment;
  updateComment: (id: string, content: string) => void;
  deleteComment: (id: string) => void;

  // Like / Bookmark
  toggleLike: (targetId: string, targetType: 'post' | 'comment') => void;
  isLiked: (targetId: string, targetType: 'post' | 'comment') => boolean;
  toggleBookmark: (postId: string) => void;
  isBookmarked: (postId: string) => boolean;

  // Report
  reportContent: (targetId: string, targetType: 'post' | 'comment', reason: string) => void;
  resolveReport: (id: string, action: 'resolved' | 'rejected') => void;

  // Notifications
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  unreadCount: number;

  // Admin helpers
  getUserById: (id: string) => User | undefined;
  getCategoryById: (id: string) => Category | undefined;
  getPostById: (id: string) => Post | undefined;
  getCommentsByPostId: (postId: string) => Comment[];
}

const AppContext = createContext<AppContextType | null>(null);

let idCounter = 1000;
function genId(): string {
  return String(++idCounter);
}

function now(): string {
  return new Date().toISOString();
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = usePersisted<Post[]>('posts', INITIAL_POSTS);
  const [comments, setComments] = usePersisted<Comment[]>('comments', INITIAL_COMMENTS);
  const [likes, setLikes] = usePersisted<Like[]>('likes', INITIAL_LIKES);
  const [bookmarks, setBookmarks] = usePersisted<Bookmark[]>('bookmarks', INITIAL_BOOKMARKS);
  const [reports, setReports] = usePersisted<Report[]>('reports', INITIAL_REPORTS);
  const [notifications, setNotifications] = usePersisted<Notification[]>('notifications', INITIAL_NOTIFICATIONS);
  const [navState, setNavState] = useState<NavState>({ page: 'home' });
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [modal, setModal] = useState<ModalOptions | null>(null);

  const currentUser = USERS.find(u => u.id === CURRENT_USER_ID)!;

  const navigate = useCallback((page: Page, options?: Partial<NavState>) => {
    setNavState({ page, ...options });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const showToast = useCallback((type: ToastType, message: string) => {
    const id = genId();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showModal = useCallback((options: ModalOptions) => {
    setModal(options);
  }, []);

  const closeModal = useCallback(() => {
    setModal(null);
  }, []);

  // Post CRUD
  const createPost = useCallback((data: CreatePostData): Post => {
    const post: Post = {
      id: 'p' + genId(),
      ...data,
      authorId: CURRENT_USER_ID,
      createdAt: now(),
      updatedAt: now(),
      viewCount: 0,
      likeCount: 0,
      commentCount: 0,
      isPinned: false,
    };
    setPosts(prev => [post, ...prev]);
    USERS.find(u => u.id === CURRENT_USER_ID)!.postCount += 1;
    return post;
  }, []);

  const updatePost = useCallback((id: string, data: Partial<Post>) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, ...data, updatedAt: now() } : p));
  }, []);

  const deletePost = useCallback((id: string) => {
    setPosts(prev => prev.filter(p => p.id !== id));
    setComments(prev => prev.filter(c => c.postId !== id));
  }, []);

  const incrementView = useCallback((postId: string) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, viewCount: p.viewCount + 1 } : p));
  }, []);

  // Comment CRUD
  const createComment = useCallback((data: CreateCommentData): Comment => {
    const comment: Comment = {
      id: 'c' + genId(),
      ...data,
      authorId: CURRENT_USER_ID,
      createdAt: now(),
      updatedAt: now(),
      likeCount: 0,
      isDeleted: false,
    };
    setComments(prev => [...prev, comment]);
    setPosts(prev => prev.map(p => p.id === data.postId ? { ...p, commentCount: p.commentCount + 1 } : p));
    USERS.find(u => u.id === CURRENT_USER_ID)!.commentCount += 1;
    return comment;
  }, []);

  const updateComment = useCallback((id: string, content: string) => {
    setComments(prev => prev.map(c => c.id === id ? { ...c, content, updatedAt: now() } : c));
  }, []);

  const deleteComment = useCallback((id: string) => {
    const comment = comments.find(c => c.id === id);
    if (!comment) return;
    setComments(prev => prev.map(c => c.id === id ? { ...c, isDeleted: true, content: '삭제된 댓글입니다.' } : c));
    setPosts(prev => prev.map(p => p.id === comment.postId ? { ...p, commentCount: Math.max(0, p.commentCount - 1) } : p));
  }, [comments]);

  // Like
  const toggleLike = useCallback((targetId: string, targetType: 'post' | 'comment') => {
    const existing = likes.find(l => l.userId === CURRENT_USER_ID && l.targetId === targetId && l.targetType === targetType);
    if (existing) {
      setLikes(prev => prev.filter(l => l.id !== existing.id));
      if (targetType === 'post') {
        setPosts(prev => prev.map(p => p.id === targetId ? { ...p, likeCount: Math.max(0, p.likeCount - 1) } : p));
      } else {
        setComments(prev => prev.map(c => c.id === targetId ? { ...c, likeCount: Math.max(0, c.likeCount - 1) } : c));
      }
    } else {
      const like: Like = { id: 'l' + genId(), userId: CURRENT_USER_ID, targetId, targetType, createdAt: now() };
      setLikes(prev => [...prev, like]);
      if (targetType === 'post') {
        setPosts(prev => prev.map(p => p.id === targetId ? { ...p, likeCount: p.likeCount + 1 } : p));
      } else {
        setComments(prev => prev.map(c => c.id === targetId ? { ...c, likeCount: c.likeCount + 1 } : c));
      }
    }
  }, [likes]);

  const isLiked = useCallback((targetId: string, targetType: 'post' | 'comment') => {
    return likes.some(l => l.userId === CURRENT_USER_ID && l.targetId === targetId && l.targetType === targetType);
  }, [likes]);

  // Bookmark
  const toggleBookmark = useCallback((postId: string) => {
    const existing = bookmarks.find(b => b.userId === CURRENT_USER_ID && b.postId === postId);
    if (existing) {
      setBookmarks(prev => prev.filter(b => b.id !== existing.id));
    } else {
      const bookmark: Bookmark = { id: 'bk' + genId(), userId: CURRENT_USER_ID, postId, createdAt: now() };
      setBookmarks(prev => [...prev, bookmark]);
    }
  }, [bookmarks]);

  const isBookmarked = useCallback((postId: string) => {
    return bookmarks.some(b => b.userId === CURRENT_USER_ID && b.postId === postId);
  }, [bookmarks]);

  // Report
  const reportContent = useCallback((targetId: string, targetType: 'post' | 'comment', reason: string) => {
    const report: Report = {
      id: 'r' + genId(),
      reporterId: CURRENT_USER_ID,
      targetId,
      targetType,
      reason,
      createdAt: now(),
      status: 'pending',
    };
    setReports(prev => [...prev, report]);
  }, []);

  const resolveReport = useCallback((id: string, action: 'resolved' | 'rejected') => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: action } : r));
  }, []);

  // Notifications
  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  }, []);

  const unreadCount = notifications.filter(n => n.userId === CURRENT_USER_ID && !n.isRead).length;

  // Helpers
  const getUserById = useCallback((id: string) => USERS.find(u => u.id === id), []);
  const getCategoryById = useCallback((id: string) => CATEGORIES.find(c => c.id === id), []);
  const getPostById = useCallback((id: string) => posts.find(p => p.id === id), [posts]);
  const getCommentsByPostId = useCallback((postId: string) => comments.filter(c => c.postId === postId), [comments]);

  return (
    <AppContext.Provider value={{
      users: USERS,
      categories: CATEGORIES,
      posts,
      comments,
      likes,
      bookmarks,
      reports,
      notifications,
      currentUser,
      navState,
      navigate,
      toasts,
      showToast,
      dismissToast,
      modal,
      showModal,
      closeModal,
      createPost,
      updatePost,
      deletePost,
      incrementView,
      createComment,
      updateComment,
      deleteComment,
      toggleLike,
      isLiked,
      toggleBookmark,
      isBookmarked,
      reportContent,
      resolveReport,
      markNotificationRead,
      markAllNotificationsRead,
      unreadCount,
      getUserById,
      getCategoryById,
      getPostById,
      getCommentsByPostId,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
