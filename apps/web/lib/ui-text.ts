export const uiText = {
  sidebar: {
    tagline: 'Универсальный чат · живая сеть',
    newChat: 'Новый чат',
    empty: 'Пока нет диалогов',
    loadingChats: 'Загрузка чатов…',
    deleteAria: 'Удалить диалог',
    renameAria: 'Переименовать',
    logout: 'Выйти',
    retry: 'Повторить',
  },
  empty: {
    welcomeTitle: 'Добро пожаловать в Hyphai',
    welcomeSubtitle: 'Живая сеть диалогов. Создайте первый чат — грибница свяжет вас с собеседником.',
    welcomeCta: 'Создать первый чат',
    pickTitle: 'Выберите диалог',
    pickSubtitle: 'Выберите чат слева или создайте новый, чтобы начать переписку.',
    pickCta: 'Новый чат',
  },
  messages: {
    placeholder: 'Введите сообщение…',
    send: 'Отправить',
    loadingMessages: 'Загрузка сообщений…',
    retry: 'Повторить',
    modelLabel: 'Модель',
  },
  meta: {
    title: 'Hyphai — универсальный чат',
    description: 'Универсальный чат как живая сеть. OpenSpec harness.',
  },
  landing: {
    heroTitle: 'Hyphai',
    heroSubtitle:
      'Универсальный чат как живая сеть разговоров. Грибница связывает диалоги — от идеи до ответа за секунды.',
    cta: 'Попробовать',
    previewLabel: 'Превью чата',
    previewUser: 'Что такое мицелий?',
    previewAssistant:
      'Мицелий — это сеть гифов гриба, «корневая система», через которую гриб получает питание и обменивается сигналами.',
    features: [
      {
        title: 'Живые ответы',
        description: 'Стриминг от LLM — текст появляется по мере генерации, как в лучших чатах.',
      },
      {
        title: 'Сеть диалогов',
        description: 'Создавайте чаты, переименовывайте, переключайтесь — грибница держит всё связным.',
      },
      {
        title: 'Выбор модели',
        description: 'OpenRouter free-модели с прозрачным fallback, если провайдер перегружен.',
      },
    ],
  },
  shell: {
    openMenu: 'Открыть меню',
    closeMenu: 'Закрыть меню',
  },
  toast: {
    chatCreated: 'Чат создан',
    chatDeleted: 'Диалог удалён',
    chatRenamed: 'Название сохранено',
    createFailed: 'Не удалось создать чат',
    deleteFailed: 'Не удалось удалить диалог',
    renameFailed: 'Не удалось переименовать',
  },
  model: {
    badgeLabel: (name: string) => `Модель: ${name}`,
    fallbackBadge: (requested: string, used: string) =>
      `Запрошено: ${requested} · ответил: ${used}`,
  },
  share: {
    title: 'Поделиться диалогом',
    enable: 'Включить ссылку',
    disable: 'Отключить ссылку',
    copy: 'Копировать ссылку',
    copied: 'Ссылка скопирована',
    failed: 'Не удалось настроить доступ',
    readOnly: 'Только просмотр',
  },
  fork: {
    action: 'Ветка',
    success: 'Ветка создана',
    failed: 'Не удалось создать ветку',
  },
} as const;
