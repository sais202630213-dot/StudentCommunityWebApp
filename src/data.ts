import type { User, Category, Post, Comment, Like, Bookmark, Notification, Report } from './types';

export const USERS: User[] = [
  {
    id: 'u1',
    username: 'admin',
    displayName: '김민준',
    email: 'minjun.kim@saih.ac.kr',
    role: 'admin',
    grade: undefined,
    classNum: undefined,
    bio: '서울인공지능고등학교 커뮤니티 관리자입니다.',
    joinDate: '2024-03-01',
    postCount: 18,
    commentCount: 42,
  },
  {
    id: 'u2',
    username: 'seoyeon_lee',
    displayName: '이서연',
    email: 'seoyeon.lee@saih.ac.kr',
    role: 'student',
    grade: 2,
    classNum: '2반',
    bio: '딥러닝과 컴퓨터 비전에 관심 많은 2학년입니다. 캐글 노빗 도전 중!',
    joinDate: '2024-03-15',
    postCount: 34,
    commentCount: 128,
  },
  {
    id: 'u3',
    username: 'junhyuk_park',
    displayName: '박준혁',
    email: 'junhyuk.park@saih.ac.kr',
    role: 'student',
    grade: 1,
    classNum: '1반',
    bio: '알고리즘 좋아하는 1학년. 백준 골드 목표!',
    joinDate: '2024-09-02',
    postCount: 21,
    commentCount: 67,
  },
  {
    id: 'u4',
    username: 'jia_choi',
    displayName: '최지아',
    email: 'jia.choi@saih.ac.kr',
    role: 'student',
    grade: 3,
    classNum: '1반',
    bio: '졸업 준비 중인 3학년. AI 연구자 목표. 논문 스터디 운영 중.',
    joinDate: '2023-03-02',
    postCount: 52,
    commentCount: 213,
  },
  {
    id: 'u5',
    username: 'woojin_jung',
    displayName: '정우진',
    email: 'woojin.jung@saih.ac.kr',
    role: 'student',
    grade: 2,
    classNum: '3반',
    bio: '강화학습 프로젝트 진행 중. 오픈소스 기여자 도전 중입니다.',
    joinDate: '2024-03-15',
    postCount: 28,
    commentCount: 95,
  },
  {
    id: 'u6',
    username: 'sohee_han',
    displayName: '한소희',
    email: 'sohee.han@saih.ac.kr',
    role: 'student',
    grade: 1,
    classNum: '2반',
    bio: '올해 입학한 1학년! 파이썬 배우는 중. 모르는 거 다 알고 싶어요.',
    joinDate: '2024-09-02',
    postCount: 9,
    commentCount: 38,
  },
];

export const CURRENT_USER_ID = 'u2';

export const CATEGORIES: Category[] = [
  {
    id: 'notice',
    name: '공지사항',
    slug: 'notice',
    description: '학교 및 커뮤니티 공식 공지',
    icon: '📢',
    color: 'red',
    postCount: 12,
  },
  {
    id: 'ai-ml',
    name: 'AI·머신러닝',
    slug: 'ai-ml',
    description: 'AI, 머신러닝, 딥러닝 토론 및 질문',
    icon: '🤖',
    color: 'blue',
    postCount: 87,
  },
  {
    id: 'programming',
    name: '프로그래밍',
    slug: 'programming',
    description: '알고리즘, 자료구조, 개발 언어',
    icon: '💻',
    color: 'green',
    postCount: 134,
  },
  {
    id: 'project',
    name: '프로젝트 쇼케이스',
    slug: 'project',
    description: '학생 프로젝트 공유 및 피드백',
    icon: '🚀',
    color: 'purple',
    postCount: 45,
  },
  {
    id: 'club',
    name: '동아리',
    slug: 'club',
    description: '동아리 모집, 활동 후기, 공지',
    icon: '🎯',
    color: 'yellow',
    postCount: 29,
  },
  {
    id: 'career',
    name: '취업·진로',
    slug: 'career',
    description: '취업, 대학 입시, 진로 상담',
    icon: '🎓',
    color: 'orange',
    postCount: 56,
  },
  {
    id: 'free',
    name: '자유게시판',
    slug: 'free',
    description: '자유롭게 이야기하는 공간',
    icon: '💬',
    color: 'gray',
    postCount: 203,
  },
];

export const INITIAL_POSTS: Post[] = [
  // 공지사항
  {
    id: 'p1',
    title: '[공지] 2025 서울인공지능고 AI 해커톤 참가자 모집',
    content: `안녕하세요, 커뮤니티 관리자 김민준입니다.

**2025 SAIH AI 해커톤**이 다음 달 개최됩니다! 🎉

## 행사 개요
- **일시**: 2025년 10월 18일 (토) ~ 10월 19일 (일)
- **장소**: 본교 AI Lab (4층 컴퓨터실 전체)
- **주제**: "AI로 해결하는 우리 학교 문제"
- **참가 자격**: 재학생 전체 (팀 구성: 2~4인)

## 참가 신청 방법
구글 폼을 통해 팀 단위 신청 (아래 링크)
마감: 2025년 10월 10일 (금) 23:59

## 시상 내역
- 대상 1팀: 상금 100만원 + 대학 입시 추천서
- 최우수상 2팀: 상금 50만원
- 우수상 3팀: 상금 30만원
- 장려상 5팀: 소정의 상품

여러분의 많은 참여 부탁드립니다!`,
    authorId: 'u1',
    categoryId: 'notice',
    tags: ['해커톤', '공지', '행사'],
    isAnonymous: false,
    createdAt: '2025-09-20T09:00:00',
    updatedAt: '2025-09-20T09:00:00',
    viewCount: 1247,
    likeCount: 89,
    commentCount: 23,
    isNotice: true,
    isPinned: true,
    attachments: [{ id: 'a1', name: '해커톤_공지문.pdf', size: 524288, type: 'application/pdf' }],
  },
  {
    id: 'p2',
    title: '[공지] 커뮤니티 이용 규칙 업데이트 안내',
    content: `커뮤니티 이용 규칙이 일부 업데이트되었습니다.

## 주요 변경 사항

1. **익명 게시글 제한**: 자유게시판 외 익명 게시글 등록 불가
2. **첨부파일 용량**: 게시글당 최대 50MB → 100MB 확장
3. **도배 방지**: 동일 사용자 1시간 내 5회 이상 게시 제한
4. **댓글 신고 시스템**: 신고 누적 3회 시 자동 블라인드

위 규칙을 위반하는 경우 사전 경고 없이 계정이 제한될 수 있습니다.
커뮤니티를 깨끗하게 만들어 주셔서 감사합니다! 🙏`,
    authorId: 'u1',
    categoryId: 'notice',
    tags: ['공지', '규칙'],
    isAnonymous: false,
    createdAt: '2025-09-15T14:00:00',
    updatedAt: '2025-09-15T14:00:00',
    viewCount: 892,
    likeCount: 45,
    commentCount: 8,
    isNotice: true,
    isPinned: false,
    attachments: [],
  },
  // AI·머신러닝
  {
    id: 'p3',
    title: 'GPT-4o vs Claude 3.5 Sonnet 직접 비교해봤습니다 (코딩 태스크)',
    content: `안녕하세요! 이서연입니다.

방학 동안 GPT-4o와 Claude 3.5 Sonnet을 직접 코딩 문제에 적용해보고 비교해봤어요.

## 테스트 방법
- 백준 실버~골드 알고리즘 문제 20개
- 파이썬 코드 리팩토링 10개
- 버그 찾기 15개

## 결과 요약

### GPT-4o
✅ 다이나믹 프로그래밍 설명이 더 직관적
✅ 코드 완성 속도 빠름
❌ 가끔 hallucination으로 없는 라이브러리 사용
❌ 복잡한 수학 증명에서 오류

### Claude 3.5 Sonnet
✅ 버그 찾기 정확도 압도적 우위
✅ 코드 스타일 일관성 유지
✅ 긴 컨텍스트 처리 훨씬 안정적
❌ 창의적 접근보다 보수적

## 결론
코딩 디버깅/코드리뷰 → Claude 추천
빠른 코드 생성/설명 → GPT-4o 추천

여러분은 어떻게 쓰시나요? 댓글로 공유해주세요!`,
    authorId: 'u2',
    categoryId: 'ai-ml',
    tags: ['GPT', 'Claude', 'LLM비교', '코딩'],
    isAnonymous: false,
    createdAt: '2025-09-22T18:30:00',
    updatedAt: '2025-09-22T18:30:00',
    viewCount: 543,
    likeCount: 67,
    commentCount: 14,
    isNotice: false,
    isPinned: false,
    attachments: [],
  },
  {
    id: 'p4',
    title: '딥러닝 기초 스터디 6기 모집합니다! (10월 시작)',
    content: `안녕하세요, 박준혁입니다!

**딥러닝 기초 스터디 6기**를 모집합니다. 처음 딥러닝을 배우는 분들 환영해요!

## 커리큘럼 (8주)
1. Python & NumPy 리뷰
2. 선형대수/미적분 기초
3. 신경망 기초 (퍼셉트론, 역전파)
4. PyTorch 입문
5. CNN (이미지 분류)
6. RNN/LSTM (시계열/텍스트)
7. Transfer Learning & Fine-tuning
8. 미니 프로젝트 발표

## 모집 조건
- 파이썬 기초 문법 숙지자
- 주 2회 (화/목 저녁 6시) 참여 가능한 분
- 1~2학년 우선 (3학년은 상황 봐서)

**선착순 6명** 모집입니다. 댓글 달아주세요!`,
    authorId: 'u3',
    categoryId: 'ai-ml',
    tags: ['스터디', '딥러닝', 'PyTorch', '모집'],
    isAnonymous: false,
    createdAt: '2025-09-21T15:00:00',
    updatedAt: '2025-09-21T15:00:00',
    viewCount: 289,
    likeCount: 34,
    commentCount: 9,
    isNotice: false,
    isPinned: false,
    attachments: [],
  },
  {
    id: 'p5',
    title: '논문 리뷰: "Attention is All You Need" (Transformer 원본 논문)',
    content: `안녕하세요, 최지아입니다.

AI 스터디 발표 자료 정리해서 올립니다. Transformer를 처음 공부하시는 분들께 도움이 됐으면 해요.

## 논문 정보
- 제목: Attention Is All You Need
- 저자: Vaswani et al. (Google Brain/Research, 2017)
- 인용수: 130,000+ (2025 기준)

## 핵심 아이디어

### 기존 Seq2Seq의 한계
기존 RNN/LSTM 기반 모델은:
- 순차적 처리 → 병렬화 불가
- 장거리 의존성 포착 어려움
- 기울기 소실 문제

### Self-Attention의 등장
Q(Query), K(Key), V(Value) 벡터를 이용해 시퀀스 내 모든 위치 간 관계를 직접 계산합니다.

\`\`\`
Attention(Q,K,V) = softmax(QK^T / √d_k) × V
\`\`\`

### Multi-Head Attention
여러 개의 Attention을 병렬로 실행해 다양한 관점에서 정보를 포착합니다.

## 의의
- GPT, BERT, ViT, Stable Diffusion 등 현대 AI의 근간
- 자연어처리 + 비전 + 멀티모달 모두 적용

다음 달에는 BERT 논문 리뷰 예정입니다!`,
    authorId: 'u4',
    categoryId: 'ai-ml',
    tags: ['논문리뷰', 'Transformer', 'Attention', '딥러닝'],
    isAnonymous: false,
    createdAt: '2025-09-18T20:00:00',
    updatedAt: '2025-09-18T20:00:00',
    viewCount: 712,
    likeCount: 95,
    commentCount: 18,
    isNotice: false,
    isPinned: false,
    attachments: [{ id: 'a2', name: 'Transformer_논문리뷰.pdf', size: 2097152, type: 'application/pdf' }],
  },
  {
    id: 'p6',
    title: 'ML 경진대회 첫 참가 후기 - 캐글 주택 가격 예측',
    content: `정우진입니다. 이번 여름에 캐글 첫 도전한 후기 공유해요!

## 대회: House Prices - Advanced Regression Techniques

### 첫 제출 (LB 0.152)
- 단순 선형 회귀, 특별한 feature engineering 없음
- 상위 80%대... 충격적

### 개선 과정
1. **EDA (탐색적 데이터 분석)** - 결측값 패턴 파악
2. **Feature Engineering** - 로그 변환, 범주형 인코딩
3. **앙상블** - XGBoost + LightGBM + Ridge

### 최종 결과 (LB 0.118, 상위 15%)
- 오버피팅 방지를 위한 교차 검증
- Optuna로 하이퍼파라미터 튜닝

## 배운 점
1. EDA가 절반이다
2. 피처 하나 잘 만드는 게 모델 바꾸는 것보다 효과적
3. 앙상블은 정말 강력함

다음에는 NLP 대회 도전해볼게요! 같이 팀 하실 분?`,
    authorId: 'u5',
    categoryId: 'ai-ml',
    tags: ['캐글', '머신러닝', 'XGBoost', '대회후기'],
    isAnonymous: false,
    createdAt: '2025-09-17T22:00:00',
    updatedAt: '2025-09-17T22:00:00',
    viewCount: 398,
    likeCount: 52,
    commentCount: 11,
    isNotice: false,
    isPinned: false,
    attachments: [],
  },
  // 프로그래밍
  {
    id: 'p7',
    title: 'Python 알고리즘 스터디 5기 모집 - 백준 실버 → 골드 목표',
    content: `이서연입니다! 알고리즘 스터디 5기를 모집합니다.

## 스터디 정보
- **목표**: 백준 실버 → 골드 달성
- **기간**: 10월 ~ 12월 (12주)
- **방식**: 주 2회 문제풀이 + 코드리뷰

## 커리큘럼
- 1~2주: 시간복잡도, 정렬, 탐색
- 3~4주: 스택/큐/덱, 연결리스트
- 5~6주: 재귀, DFS/BFS
- 7~8주: 다이나믹 프로그래밍 기초
- 9~10주: 그리디, 이분탐색
- 11~12주: 그래프, 최단경로

## 지원 조건
- 현재 백준 브론즈 이상
- 파이썬 또는 C++ 사용자
- 꾸준히 참여 가능한 분

신청은 댓글로! 선착순 8명.`,
    authorId: 'u2',
    categoryId: 'programming',
    tags: ['스터디', '알고리즘', '백준', 'Python'],
    isAnonymous: false,
    createdAt: '2025-09-23T10:00:00',
    updatedAt: '2025-09-23T10:00:00',
    viewCount: 267,
    likeCount: 41,
    commentCount: 16,
    isNotice: false,
    isPinned: false,
    attachments: [],
  },
  {
    id: 'p8',
    title: '백준 플래티넘 달성 후기 - 2년 걸렸습니다',
    content: `박준혁입니다. 드디어 플래티넘 찍었어요! 🎉

입학하자마자 백준 시작해서 딱 2년 걸렸네요.

## 등급 변화
- 입학 초: 브론즈 5
- 6개월: 실버 4
- 1년: 골드 3
- 1.5년: 플래 5 (벽 여기서 오래 막힘)
- 2년: 플래 3 달성 ✅

## 막혔던 구간 & 해결법

### 골드 → 플래 (제일 힘들었음)
- 세그먼트 트리, 펜윅 트리에서 3개월 막힘
- 알고리즘 분류별로 10문제씩 집중 풀기
- 틀린 문제 꼭 다음날 다시 풀기

## 추천 문제집
1. 그리디: 11047, 11399, 1931
2. DP: 1149, 9461, 11053
3. 세그트리: 2042, 10868, 11505

플래 도전하는 분들 화이팅이에요!!`,
    authorId: 'u3',
    categoryId: 'programming',
    tags: ['백준', '플래티넘', '알고리즘', '후기'],
    isAnonymous: false,
    createdAt: '2025-09-20T19:00:00',
    updatedAt: '2025-09-20T19:00:00',
    viewCount: 834,
    likeCount: 112,
    commentCount: 27,
    isNotice: false,
    isPinned: false,
    attachments: [],
  },
  {
    id: 'p9',
    title: 'React 18 새 기능 정리 - Concurrent Mode, Suspense, Server Components',
    content: `최지아입니다. 웹 개발 관심 있는 분들을 위해 React 18 주요 변경사항 정리했어요.

## 1. Concurrent Mode (기본 활성화)

\`\`\`jsx
// React 18: createRoot 사용
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
\`\`\`

이제 렌더링이 중단 가능(interruptible)하여 더 부드러운 UX를 제공합니다.

## 2. Automatic Batching

React 17까지는 이벤트 핸들러 밖의 setState는 개별적으로 처리됐지만, 18부터는 자동 배치됩니다.

## 3. useTransition

\`\`\`jsx
const [isPending, startTransition] = useTransition();

startTransition(() => {
  setSearchQuery(query); // 낮은 우선순위로 처리
});
\`\`\`

## 4. Suspense 개선
서버 사이드 스트리밍 지원으로 TTFB 개선.

웹 개발 공부하시는 분들, 질문 있으면 댓글 달아요!`,
    authorId: 'u4',
    categoryId: 'programming',
    tags: ['React', '웹개발', 'JavaScript', 'Frontend'],
    isAnonymous: false,
    createdAt: '2025-09-19T16:00:00',
    updatedAt: '2025-09-19T16:00:00',
    viewCount: 456,
    likeCount: 73,
    commentCount: 12,
    isNotice: false,
    isPinned: false,
    attachments: [],
  },
  {
    id: 'p10',
    title: '코딩테스트 준비 완전 로드맵 (2025 최신판)',
    content: `정우진입니다. 취준 준비하면서 만든 코딩테스트 로드맵 공유해요.

## 단계별 공략

### 1단계: 기초 (1~2개월)
- 언어 선택 (Python 추천, 문법 정리)
- 시간/공간 복잡도 개념
- 기본 자료구조 (배열, 스택, 큐, 해시맵)

### 2단계: 핵심 알고리즘 (2~3개월)
- 정렬 (병합정렬, 퀵정렬 원리 이해)
- 탐색 (DFS, BFS, 이분탐색)
- 다이나믹 프로그래밍
- 그리디

### 3단계: 심화 (2~3개월)
- 그래프 이론 (다익스트라, 벨만포드, 플로이드)
- 트리 (세그먼트 트리, LCA)
- 문자열 알고리즘

## 기업별 특이사항
- **네이버**: 구현 중심, 시뮬레이션 많음
- **카카오**: 창의적 문제, 수학적 사고
- **삼성**: 이분탐색, BFS/DFS

화이팅!`,
    authorId: 'u5',
    categoryId: 'programming',
    tags: ['코딩테스트', '취준', '알고리즘', '로드맵'],
    isAnonymous: false,
    createdAt: '2025-09-16T21:00:00',
    updatedAt: '2025-09-16T21:00:00',
    viewCount: 921,
    likeCount: 138,
    commentCount: 22,
    isNotice: false,
    isPinned: false,
    attachments: [],
  },
  // 프로젝트 쇼케이스
  {
    id: 'p11',
    title: '교내 AI 날씨 예보 서비스 개발 완료! (소개 및 피드백 요청)',
    content: `안녕하세요! 최지아입니다.

3개월간 개발한 **SAIH Weather AI** 서비스가 드디어 완성됐어요! 🎉

## 서비스 소개
학교 인근 날씨 데이터를 기반으로 AI가 향후 3일 날씨를 예측하는 웹 서비스입니다.

## 기술 스택
- **모델**: LSTM + 기상청 API 데이터 학습
- **백엔드**: FastAPI + PostgreSQL
- **프론트엔드**: React + Tailwind
- **배포**: AWS EC2 + Nginx

## 성능
- 예측 정확도 (MAE): 기온 ±0.8°C, 강수확률 ±12%p
- 기상청 단기예보와 비교 시 83% 정확도

## 개선하고 싶은 점
- 미세먼지 예측 추가
- 알림 기능 (비 올 예정 시 푸시)
- 우리 학교 옥상 실측 센서 연동 (선생님께 건의 중)

피드백 주시면 정말 감사해요! GitHub 링크는 DM으로 요청주세요.`,
    authorId: 'u4',
    categoryId: 'project',
    tags: ['AI', 'LSTM', 'FastAPI', '날씨예측', '웹서비스'],
    isAnonymous: false,
    createdAt: '2025-09-21T13:00:00',
    updatedAt: '2025-09-21T13:00:00',
    viewCount: 478,
    likeCount: 81,
    commentCount: 19,
    isNotice: false,
    isPinned: false,
    attachments: [{ id: 'a3', name: '서비스_아키텍처.png', size: 1048576, type: 'image/png' }],
  },
  {
    id: 'p12',
    title: '청각장애인 수어 인식 AI 앱 - 데모 영상 공유',
    content: `이서연입니다. 1년 넘게 준비한 프로젝트를 공유합니다.

## 프로젝트 소개
실시간 카메라로 수어를 인식해 텍스트로 변환해주는 모바일 앱입니다.

## 개발 동기
청각장애를 가진 할머니와의 소통을 돕고 싶었어요.

## 기술 구현
- **데이터셋**: 국립국어원 수어 코퍼스 + 직접 촬영 3,000개
- **모델**: MediaPipe Hands → LSTM → 분류
- **인식률**: 50개 수어 단어 기준 94.3%
- **플랫폼**: Flutter (iOS/Android 동시 지원)

## 현재 한계
- 연속 문장 인식은 아직 어려움
- 조명/배경 변화에 민감
- 훈련 데이터 부족

## 수상 실적
- 2025 서울시 청소년 AI 경진대회 **최우수상** 🏆
- 한국정보올림피아드 학교 대표 선발

더 나은 서비스로 발전시키고 싶어요. 같이 해볼 분 계신가요?`,
    authorId: 'u2',
    categoryId: 'project',
    tags: ['수어인식', 'MediaPipe', 'Flutter', '사회공헌', '수상'],
    isAnonymous: false,
    createdAt: '2025-09-19T14:00:00',
    updatedAt: '2025-09-19T14:00:00',
    viewCount: 892,
    likeCount: 167,
    commentCount: 31,
    isNotice: false,
    isPinned: false,
    attachments: [],
  },
  {
    id: 'p13',
    title: '학교 시간표 최적화 앱 v2.0 출시 - 전교생 사용 가능!',
    content: `박준혁입니다! 시간표 앱 v2.0 드디어 나왔어요!

## 새로운 기능 (v2.0)
- ✅ 과목별 선생님 공강 시간 자동 분석
- ✅ 시험 일정 캘린더 연동
- ✅ 학생별 숙제/과제 관리
- ✅ 알림 기능 개선
- ✅ 다크모드 지원

## 기술 스택
- React Native + Expo
- Firebase Firestore (실시간 동기화)
- 백트래킹 알고리즘으로 최적 시간표 계산

## 사용 현황
현재 **47명**이 사용 중이에요!
전교생이 쓸 수 있도록 계속 개선할게요.

아래 QR코드로 설치 가능합니다 (링크는 댓글에)`,
    authorId: 'u3',
    categoryId: 'project',
    tags: ['앱개발', 'React Native', '시간표', '실사용'],
    isAnonymous: false,
    createdAt: '2025-09-17T11:00:00',
    updatedAt: '2025-09-17T11:00:00',
    viewCount: 634,
    likeCount: 93,
    commentCount: 24,
    isNotice: false,
    isPinned: false,
    attachments: [],
  },
  // 동아리
  {
    id: 'p14',
    title: 'AI 연구 동아리 NeuralNet 2025-2학기 신입 모집 🧠',
    content: `안녕하세요! NeuralNet 동아리 회장 정우진입니다.

## 동아리 소개
NeuralNet은 딥러닝 이론부터 실전 프로젝트까지 다루는 AI 연구 동아리입니다.

## 2024년 성과
- 논문 스터디 24회 진행
- 교내 AI 해커톤 2위 🥈
- 학교 대표 AI 경진대회 출전

## 활동 내용
- 매주 목요일 논문 리뷰
- 격주 프로젝트 발표
- 방학 중 집중 캠프

## 지원 자격
- Python 기본 문법 가능한 분
- 주 1회 이상 정기 참여 가능한 분
- 학년 무관

## 모집 기간
~2025년 10월 5일 (일)

지원서는 구글 폼으로 받습니다. 댓글에 링크 달게요!`,
    authorId: 'u5',
    categoryId: 'club',
    tags: ['동아리', '모집', 'AI', '딥러닝'],
    isAnonymous: false,
    createdAt: '2025-09-22T12:00:00',
    updatedAt: '2025-09-22T12:00:00',
    viewCount: 312,
    likeCount: 48,
    commentCount: 15,
    isNotice: false,
    isPinned: false,
    attachments: [],
  },
  {
    id: 'p15',
    title: '드론 AI 동아리 팀원 모집 - 자율비행 드론 제작',
    content: `이서연입니다. 드론 AI 팀원 모집해요!

## 프로젝트 목표
컴퓨터 비전 기반 **자율비행 드론** 제작 (내년 대회 목표)

## 필요한 역할
1. **AI/CV 개발자** (2명): YOLO, OpenCV 활용 장애물 감지
2. **하드웨어 담당** (1명): 라즈베리파이, 드론 조립
3. **제어 시스템** (1명): PID 컨트롤러, ROS

## 참고할 기술
- YOLOv8 실시간 객체 감지
- ArduPilot/PX4 FC
- ROS2 Humble

## 일정
- 10월: 드론 조립 + 기본 비행
- 11~12월: AI 연동 테스트
- 내년 봄: 대회 출전

관심 있는 분은 댓글 남겨주세요!`,
    authorId: 'u2',
    categoryId: 'club',
    tags: ['드론', 'CV', 'ROS', '하드웨어', '모집'],
    isAnonymous: false,
    createdAt: '2025-09-20T17:00:00',
    updatedAt: '2025-09-20T17:00:00',
    viewCount: 198,
    likeCount: 37,
    commentCount: 8,
    isNotice: false,
    isPinned: false,
    attachments: [],
  },
  // 취업·진로
  {
    id: 'p16',
    title: 'AI 관련 대학 & 전공 선택 가이드 (2026 입시 기준)',
    content: `최지아입니다. 졸업 앞두고 직접 조사한 내용 정리했어요.

## AI/CS 관련 주요 학교·학과

### 서울대학교
- 컴퓨터공학부 (AI 연계전공 가능)
- 인공지능학부 (신설, 경쟁률 매우 높음)
- 내신 1.0~1.5 / 수능 최상위

### 카이스트
- AI대학원 (학사 후 진학)
- 전산학부에서 AI 연구 가장 활발

### 연세대학교
- 컴퓨터과학과
- 인공지능학과 (2023 신설)
- 수시 학생부종합 비중 높음

### 성균관대학교
- 소프트웨어학과 (삼성과 연계 강점)
- AI융합학과

## 입시 전략 (우리 학교 기준)
- 수시 우선! 소프트웨어 특기자 전형 적극 활용
- GitHub 포트폴리오 필수
- 대회 수상 실적 > 내신 (일부 전형)

궁금한 점 댓글로!`,
    authorId: 'u4',
    categoryId: 'career',
    tags: ['입시', '대학', 'AI전공', '진로'],
    isAnonymous: false,
    createdAt: '2025-09-18T20:30:00',
    updatedAt: '2025-09-18T20:30:00',
    viewCount: 1023,
    likeCount: 145,
    commentCount: 29,
    isNotice: false,
    isPinned: false,
    attachments: [{ id: 'a4', name: '2026_AI입시가이드.pdf', size: 3145728, type: 'application/pdf' }],
  },
  {
    id: 'p17',
    title: '네이버 AI 랩 견학 다녀왔어요 (후기 + Q&A 내용 공유)',
    content: `박준혁입니다! 지난주 네이버 AI 랩 견학 다녀왔어요.

## 방문 개요
- 일시: 2025.09.13 (토)
- 장소: 네이버 1784 (분당)
- 인원: 우리 학교 희망자 12명

## 인상 깊었던 것들

### 1. 클로바 X 개발팀 발표
한국어 특화 LLM을 어떻게 학습시키는지 과정을 보여줬어요.
데이터 품질 관리가 생각보다 훨씬 어렵다는 게 신기했어요.

### 2. NAVER 1784 로봇 시스템
건물 전체에 자율주행 로봇이 돌아다니는데 진짜 미래 같았어요.

### 3. 연구원분 Q&A
Q: AI 연구자가 되려면 뭐가 중요한가요?
A: "수학 기초 (선형대수, 확률) + 논문 읽는 습관 + 뭐든 직접 구현해보는 것"

Q: 고등학생 때 뭐하면 좋을까요?
A: "캐글 도전하고, 프로젝트 하나 완성해서 깃헙에 올려놓으세요"

다들 가볼 기회 있으면 꼭 신청해요!`,
    authorId: 'u3',
    categoryId: 'career',
    tags: ['네이버', '견학', '진로', 'AI연구'],
    isAnonymous: false,
    createdAt: '2025-09-16T18:00:00',
    updatedAt: '2025-09-16T18:00:00',
    viewCount: 567,
    likeCount: 78,
    commentCount: 14,
    isNotice: false,
    isPinned: false,
    attachments: [],
  },
  // 자유게시판
  {
    id: 'p18',
    title: '1학년 입학 첫 한달 솔직 후기 ㅋㅋ',
    content: `한소희입니다! 입학 한 달 됐어서 솔직한 후기 남겨요.

## 예상했던 것 vs 실제

### 수업 난이도
예상: 엄청 어려울 것 같았음
실제: **어렵긴 한데 재밌음** ㅋㅋ 파이썬 처음 배우는데 과제가 빡세긴 해요

### 급식
예상: 학교 급식이니까 별로겠지
실제: **진짜 맛있음** (삼겹살 나온 날은 천국...)

### 선배들
예상: 무섭거나 거리 있을 것 같았음
실제: **다들 친절하고 질문 잘 받아줌**

### 분위기
예상: 공부만 하는 딱딱한 분위기
실제: **열정 있는 사람들끼리 시너지** 나는 느낌

## 힘든 점
- 집이 멀어서 통학 2시간... ㅠㅠ
- 과제량이 은근 많음
- 잠이 항상 부족함

그래도 이 학교 온 거 후회 안 해요! 동기들 다 좋고 배우는 게 재밌음 ㅎㅎ`,
    authorId: 'u6',
    categoryId: 'free',
    tags: ['1학년', '입학후기', '솔직후기'],
    isAnonymous: false,
    createdAt: '2025-09-23T21:00:00',
    updatedAt: '2025-09-23T21:00:00',
    viewCount: 489,
    likeCount: 72,
    commentCount: 20,
    isNotice: false,
    isPinned: false,
    attachments: [],
  },
  {
    id: 'p19',
    title: '오늘 급식 삼겹살 나왔는데 진짜 최고였다',
    content: `이서연입니다.

오늘 점심 삼겹살 + 된장찌개 + 깍두기 조합이 진짜 레전드였어요...

급식 선생님 감사합니다 🙏

근데 진지하게 우리 학교 급식 퀄리티가 왜 이렇게 높은 건지 아는 사람?
다른 학교 친구들이 부러워함 ㅋㅋ`,
    authorId: 'u2',
    categoryId: 'free',
    tags: ['급식', '맛있음'],
    isAnonymous: false,
    createdAt: '2025-09-23T13:30:00',
    updatedAt: '2025-09-23T13:30:00',
    viewCount: 234,
    likeCount: 56,
    commentCount: 12,
    isNotice: false,
    isPinned: false,
    attachments: [],
  },
  {
    id: 'p20',
    title: '기말고사 끝나고 같이 뭐 할지 아이디어 받아요!',
    content: `박준혁입니다. 이번 기말고사 12월 20일에 끝나는데요.

종례 끝나고 같이 뭐 할지 아이디어 모아요!

아이디어:
1. 노래방 🎤
2. 볼링 🎳
3. 각자 집에서 디코로 게임 (LOL, 발로란트 등)
4. 영화관 🎬
5. 떡볶이집에서 뒷풀이

투표해주세요! 아니면 다른 의견도 환영`,
    authorId: 'u3',
    categoryId: 'free',
    tags: ['기말고사', '뒷풀이', '투표'],
    isAnonymous: false,
    createdAt: '2025-09-22T20:00:00',
    updatedAt: '2025-09-22T20:00:00',
    viewCount: 178,
    likeCount: 29,
    commentCount: 23,
    isNotice: false,
    isPinned: false,
    attachments: [],
  },
];

export const INITIAL_COMMENTS: Comment[] = [
  // Post p3 comments
  { id: 'c1', postId: 'p3', authorId: 'u4', content: '진짜 유용한 비교예요! 저도 코드리뷰는 Claude가 훨씬 낫다고 느꼈어요. GPT는 가끔 없는 함수 쓰는 게 좀 무섭...', parentId: undefined, createdAt: '2025-09-22T19:00:00', updatedAt: '2025-09-22T19:00:00', likeCount: 8, isDeleted: false },
  { id: 'c2', postId: 'p3', authorId: 'u5', content: '저는 GPT-4o가 수학 문제 풀이 설명은 더 잘 하던데요. 사람마다 다른 것 같아요!', parentId: undefined, createdAt: '2025-09-22T19:30:00', updatedAt: '2025-09-22T19:30:00', likeCount: 5, isDeleted: false },
  { id: 'c3', postId: 'p3', authorId: 'u2', content: '맞아요 ㅋㅋ 수학은 GPT가 확실히 나은 것 같아요. 제가 코딩 위주로만 비교했네요!', parentId: 'c2', createdAt: '2025-09-22T20:00:00', updatedAt: '2025-09-22T20:00:00', likeCount: 3, isDeleted: false },
  { id: 'c4', postId: 'p3', authorId: 'u3', content: '오 이거 진짜 궁금했는데 감사합니다 서연 선배! Gemini도 비교해주시면 더 좋겠어요 ㅎㅎ', parentId: undefined, createdAt: '2025-09-22T21:00:00', updatedAt: '2025-09-22T21:00:00', likeCount: 4, isDeleted: false },

  // Post p8 comments
  { id: 'c5', postId: 'p8', authorId: 'u2', content: '와 정말 대단해요!!! 저는 아직 골드도 못 찍었는데... 세그트리 공부법 더 자세히 알려줄 수 있어요?', parentId: undefined, createdAt: '2025-09-20T20:00:00', updatedAt: '2025-09-20T20:00:00', likeCount: 6, isDeleted: false },
  { id: 'c6', postId: 'p8', authorId: 'u3', content: '감사합니다! 세그트리는 11437 LCA 문제 풀고 나서 갑자기 열렸어요. 그 문제 꼭 해보세요!', parentId: 'c5', createdAt: '2025-09-20T20:30:00', updatedAt: '2025-09-20T20:30:00', likeCount: 7, isDeleted: false },
  { id: 'c7', postId: 'p8', authorId: 'u4', content: '플래 달성 축하해요! 다음 목표는 다이아? ㅋㅋ', parentId: undefined, createdAt: '2025-09-20T21:00:00', updatedAt: '2025-09-20T21:00:00', likeCount: 3, isDeleted: false },

  // Post p12 comments
  { id: 'c8', postId: 'p12', authorId: 'u5', content: '와 진짜 멋있다... 최우수상 축하해요!! 이런 의미있는 프로젝트라니...', parentId: undefined, createdAt: '2025-09-19T15:00:00', updatedAt: '2025-09-19T15:00:00', likeCount: 15, isDeleted: false },
  { id: 'c9', postId: 'p12', authorId: 'u3', content: '할머니를 위해 만들었다는 게 너무 감동이에요 ㅠㅠ 저도 참여하고 싶은데 어떻게 하면 되나요?', parentId: undefined, createdAt: '2025-09-19T15:30:00', updatedAt: '2025-09-19T15:30:00', likeCount: 8, isDeleted: false },
  { id: 'c10', postId: 'p12', authorId: 'u2', content: '고마워요! DM으로 연락 주세요 :) 같이 발전시키면 좋겠어요!', parentId: 'c9', createdAt: '2025-09-19T16:00:00', updatedAt: '2025-09-19T16:00:00', likeCount: 6, isDeleted: false },

  // Post p18 comments
  { id: 'c11', postId: 'p18', authorId: 'u2', content: '동생 같아서 귀엽다 ㅋㅋㅋ 뭐든 모르는 거 있으면 물어봐요!', parentId: undefined, createdAt: '2025-09-23T21:30:00', updatedAt: '2025-09-23T21:30:00', likeCount: 11, isDeleted: false },
  { id: 'c12', postId: 'p18', authorId: 'u3', content: '저도 1학년 때 이런 느낌이었어요 ㅎㅎ 금방 적응돼요!', parentId: undefined, createdAt: '2025-09-23T22:00:00', updatedAt: '2025-09-23T22:00:00', likeCount: 7, isDeleted: false },
  { id: 'c13', postId: 'p18', authorId: 'u6', content: '선배들 친절하게 답변해줘서 감사해요! 잘 부탁드립니다 ㅎㅎ', parentId: 'c11', createdAt: '2025-09-23T22:15:00', updatedAt: '2025-09-23T22:15:00', likeCount: 4, isDeleted: false },

  // Post p4 (스터디 모집)
  { id: 'c14', postId: 'p4', authorId: 'u6', content: '저 참가하고 싶어요!! 파이썬 기초는 할 줄 아는데 딥러닝은 처음이에요. 가능할까요?', parentId: undefined, createdAt: '2025-09-21T16:00:00', updatedAt: '2025-09-21T16:00:00', likeCount: 2, isDeleted: false },
  { id: 'c15', postId: 'p4', authorId: 'u3', content: '물론이죠! 기초부터 시작하는 스터디니까 괜찮아요 :)', parentId: 'c14', createdAt: '2025-09-21T16:30:00', updatedAt: '2025-09-21T16:30:00', likeCount: 3, isDeleted: false },

  // Post p11 (날씨 서비스)
  { id: 'c16', postId: 'p11', authorId: 'u2', content: '와 대박이다 지아 선배!!! 이거 실제로 쓸 수 있어요? 링크 주세요!', parentId: undefined, createdAt: '2025-09-21T14:00:00', updatedAt: '2025-09-21T14:00:00', likeCount: 9, isDeleted: false },
  { id: 'c17', postId: 'p11', authorId: 'u4', content: '아직 beta 버전이라서 DM으로 링크 드릴게요! 피드백 주시면 반영할게요 :)', parentId: 'c16', createdAt: '2025-09-21T14:30:00', updatedAt: '2025-09-21T14:30:00', likeCount: 5, isDeleted: false },
];

export const INITIAL_LIKES: Like[] = [
  { id: 'l1', userId: 'u2', targetId: 'p3', targetType: 'post', createdAt: '2025-09-22T19:00:00' },
  { id: 'l2', userId: 'u2', targetId: 'p8', targetType: 'post', createdAt: '2025-09-20T20:00:00' },
  { id: 'l3', userId: 'u2', targetId: 'p12', targetType: 'post', createdAt: '2025-09-19T15:00:00' },
  { id: 'l4', userId: 'u2', targetId: 'p16', targetType: 'post', createdAt: '2025-09-18T21:00:00' },
  { id: 'l5', userId: 'u2', targetId: 'c7', targetType: 'comment', createdAt: '2025-09-20T21:00:00' },
  { id: 'l6', userId: 'u2', targetId: 'c8', targetType: 'comment', createdAt: '2025-09-19T15:30:00' },
];

export const INITIAL_BOOKMARKS: Bookmark[] = [
  { id: 'b1', userId: 'u2', postId: 'p5', createdAt: '2025-09-18T21:00:00' },
  { id: 'b2', userId: 'u2', postId: 'p10', createdAt: '2025-09-16T22:00:00' },
  { id: 'b3', userId: 'u2', postId: 'p16', createdAt: '2025-09-18T21:30:00' },
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: 'n1', userId: 'u2', type: 'comment', title: '댓글 알림', message: '최지아님이 회원님의 게시글에 댓글을 남겼습니다.', postId: 'p3', isRead: false, createdAt: '2025-09-22T19:00:00' },
  { id: 'n2', userId: 'u2', type: 'like', title: '좋아요 알림', message: '박준혁님이 회원님의 게시글을 추천했습니다.', postId: 'p7', isRead: false, createdAt: '2025-09-23T10:30:00' },
  { id: 'n3', userId: 'u2', type: 'reply', title: '대댓글 알림', message: '정우진님이 회원님의 댓글에 답글을 달았습니다.', postId: 'p3', isRead: false, createdAt: '2025-09-22T20:00:00' },
  { id: 'n4', userId: 'u2', type: 'notice', title: '공지사항', message: '새로운 공지사항이 등록되었습니다: 2025 AI 해커톤 모집', postId: 'p1', isRead: true, createdAt: '2025-09-20T09:00:00' },
  { id: 'n5', userId: 'u2', type: 'like', title: '좋아요 알림', message: '한소희님이 회원님의 게시글을 추천했습니다.', postId: 'p7', isRead: true, createdAt: '2025-09-21T15:00:00' },
];

export const INITIAL_REPORTS: Report[] = [
  { id: 'r1', reporterId: 'u3', targetId: 'p19', targetType: 'post', reason: '커뮤니티와 무관한 게시글', createdAt: '2025-09-23T14:00:00', status: 'pending' },
  { id: 'r2', reporterId: 'u4', targetId: 'c4', targetType: 'comment', reason: '스팸성 댓글', createdAt: '2025-09-22T21:30:00', status: 'pending' },
  { id: 'r3', reporterId: 'u2', targetId: 'p20', targetType: 'post', reason: '게시판 성격과 맞지 않음', createdAt: '2025-09-22T20:30:00', status: 'resolved' },
];
