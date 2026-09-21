export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatar?: string;
  role: UserRole;
  grade?: number;
  classNum?: string;
  bio?: string;
  joinDate: string;
  postCount: number;
  commentCount: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  postCount: number;
}

export interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  categoryId: string;
  tags: string[];
  isAnonymous: boolean;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  isNotice: boolean;
  isPinned: boolean;
  attachments: Attachment[];
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
  likeCount: number;
  isDeleted: boolean;
}

export interface Like {
  id: string;
  userId: string;
  targetId: string;
  targetType: 'post' | 'comment';
  createdAt: string;
}

export interface Bookmark {
  id: string;
  userId: string;
  postId: string;
  createdAt: string;
}

export interface Report {
  id: string;
  reporterId: string;
  targetId: string;
  targetType: 'post' | 'comment';
  reason: string;
  createdAt: string;
  status: 'pending' | 'resolved' | 'rejected';
}

export interface Notification {
  id: string;
  userId: string;
  type: 'comment' | 'like' | 'reply' | 'notice' | 'report';
  title: string;
  message: string;
  postId?: string;
  isRead: boolean;
  createdAt: string;
}

export type Page = 'home' | 'board' | 'post-detail' | 'post-form' | 'mypage';

export interface NavState {
  page: Page;
  categoryId?: string;
  postId?: string;
  editPostId?: string;
}

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

export interface ModalOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  danger?: boolean;
}

export interface CreatePostData {
  title: string;
  content: string;
  categoryId: string;
  tags: string[];
  isAnonymous: boolean;
  isNotice: boolean;
  attachments: Attachment[];
}

export interface CreateCommentData {
  postId: string;
  content: string;
  parentId?: string;
}
