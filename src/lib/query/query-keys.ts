export const queryKeys = {
  // Authentication
  auth: {
    all: ['auth'] as const,
    user: () => [...queryKeys.auth.all, 'user'] as const,
    token: () => [...queryKeys.auth.all, 'token'] as const,
  },

  // Users & Profiles
  users: {
    all: ['users'] as const,
    profile: () => [...queryKeys.users.all, 'profile'] as const,
    parentProfile: () => [...queryKeys.users.all, 'parent-profile'] as const,
    parentDetail: (id: string) => [...queryKeys.users.all, 'parent-detail', id] as const,
    nounuProfile: () => [...queryKeys.users.all, 'nounu-profile'] as const,
    nounuDetail: (id: string) => [...queryKeys.users.all, 'nounu-detail', id] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
    medias: (userId: string) => [...queryKeys.users.all, 'medias', userId] as const,
  },

  // Nounus (Babysitters)
  nounus: {
    all: ['nounus'] as const,
    lists: () => [...queryKeys.nounus.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.nounus.lists(), filters] as const,
    details: () => [...queryKeys.nounus.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.nounus.details(), id] as const,
    search: (filters: Record<string, any>) => [...queryKeys.nounus.all, 'search', filters] as const,
    reviews: (nounuId: string) => [...queryKeys.nounus.detail(nounuId), 'reviews'] as const,
    likes: (nounuId: string) => [...queryKeys.nounus.detail(nounuId), 'likes'] as const,
  },

  // Parents
  parents: {
    all: ['parents'] as const,
    lists: () => [...queryKeys.parents.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.parents.lists(), filters] as const,
    details: () => [...queryKeys.parents.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.parents.details(), id] as const,
    search: (filters: Record<string, any>) => [...queryKeys.parents.all, 'search', filters] as const,
  },

  // Messages & Chats
  messages: {
    all: ['messages'] as const,
    rooms: () => [...queryKeys.messages.all, 'rooms'] as const,
    room: (roomId: string) => [...queryKeys.messages.rooms(), roomId] as const,
    roomMessages: (roomId: string) => [...queryKeys.messages.room(roomId), 'messages'] as const,
    unreadCount: () => [...queryKeys.messages.all, 'unread-count'] as const,
    adminUnreadCount: () => [...queryKeys.messages.all, 'admin-unread-count'] as const,
  },

  // Notifications
  notifications: {
    all: ['notifications'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.notifications.all, 'list', filters] as const,
    unreadCount: () => [...queryKeys.notifications.all, 'unread-count'] as const,
    schedule: () => [...queryKeys.notifications.all, 'schedule'] as const,
  },

  // Jobs
  jobs: {
    all: ['jobs'] as const,
    lists: () => [...queryKeys.jobs.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.jobs.lists(), filters] as const,
    details: () => [...queryKeys.jobs.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.jobs.details(), id] as const,
    applications: (jobId: string) => [...queryKeys.jobs.detail(jobId), 'applications'] as const,
    myJobs: () => [...queryKeys.jobs.all, 'my-jobs'] as const,
    userJobs: () => [...queryKeys.jobs.all, 'user-jobs'] as const,
  },

  // Contracts
  contracts: {
    all: ['contracts'] as const,
    lists: () => [...queryKeys.contracts.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.contracts.lists(), filters] as const,
    detail: (id: string) => [...queryKeys.contracts.all, 'detail', id] as const,
  },

  // Subscriptions & Payments
  subscriptions: {
    all: ['subscriptions'] as const,
    status: (userId?: string) => [...queryKeys.subscriptions.all, 'status', userId] as const,
    plans: () => [...queryKeys.subscriptions.all, 'plans'] as const,
    activePacks: () => [...queryKeys.subscriptions.all, 'active-packs'] as const,
    payment: (transactionId: string) => [...queryKeys.subscriptions.all, 'payment', transactionId] as const,
    paymentStatus: (transactionId: string) => [...queryKeys.subscriptions.payment(transactionId), 'status'] as const,
  },

  // Media
  media: {
    all: ['media'] as const,
    upload: () => [...queryKeys.media.all, 'upload'] as const,
    delete: (mediaId: number) => [...queryKeys.media.all, 'delete', mediaId] as const,
  },

  // Admin
  admin: {
    all: ['admin'] as const,
    stats: () => [...queryKeys.admin.all, 'stats'] as const,
    users: (filters: Record<string, any>) => [...queryKeys.admin.all, 'users', filters] as const,
    nounus: (filters: Record<string, any>) => [...queryKeys.admin.all, 'nounus', filters] as const,
    nounusPending: (filters: Record<string, any>) => [...queryKeys.admin.all, 'nounus-pending', filters] as const,
    parents: (filters: Record<string, any>) => [...queryKeys.admin.all, 'parents', filters] as const,
    jobs: (filters: Record<string, any>) => [...queryKeys.admin.all, 'jobs', filters] as const,
    chats: (filters: Record<string, any>) => [...queryKeys.admin.all, 'chats', filters] as const,
    payments: (filters: Record<string, any>) => [...queryKeys.admin.all, 'payments', filters] as const,
    subscriptions: (filters: Record<string, any>) => [...queryKeys.admin.all, 'subscriptions', filters] as const,
    packs: (filters: Record<string, any>) => [...queryKeys.admin.all, 'packs', filters] as const,
    settings: () => [...queryKeys.admin.all, 'settings'] as const,
    parameters: (filters: Record<string, any>) => [...queryKeys.admin.all, 'parameters', filters] as const,
    permissions: (filters: Record<string, any>) => [...queryKeys.admin.all, 'permissions', filters] as const,
    typeParameters: (filters: Record<string, any>) => [...queryKeys.admin.all, 'type-parameters', filters] as const,
    rolePermissions: (roleId: string) => [...queryKeys.admin.all, 'role-permissions', roleId] as const,
  },
} as const;
