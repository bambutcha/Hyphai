const ERROR_MESSAGES: Record<string, string> = {
  'Invalid credentials': 'Неверный email или пароль',
  'Session expired. Please sign in again.': 'Сессия истекла. Войдите снова',
  Unauthorized: 'Сессия истекла. Войдите снова',
  'Email already registered': 'Этот email уже зарегистрирован',
  'Email and password required': 'Укажите email и пароль',
  'Email and password (min 6 chars) required': 'Укажите email и пароль (мин. 6 символов)',
  'Content is required': 'Введите текст сообщения',
  'Title must be 1-120 characters': 'Название: от 1 до 120 символов',
  'Not found': 'Не найдено',
  'Cannot reach server. Check your connection.': 'Не удалось связаться с сервером. Проверьте подключение',
  'Server error. Try again in a moment.': 'Ошибка сервера. Попробуйте позже',
  'Something went wrong': 'Произошла ошибка',
  'LLM not configured': 'LLM не настроен. Добавьте OPENROUTER_API_KEY в .env',
  'LLM unavailable': 'Модель временно недоступна. Попробуйте позже или выберите «Авто (free router)»',
  'LLM model not found': 'Модель снята с OpenRouter. Выберите другую в списке',
  'LLM rate limited':
    'Лимит free-модели на OpenRouter. API уже пробует запасные; подождите или выберите GPT-OSS 120B',
  'LLM timeout': 'Ответ модели занял слишком много времени. Попробуйте снова',
  'LLM empty response': 'Модель вернула пустой ответ. Смените модель или повторите',
};

export function localizeErrorMessage(message: string): string {
  const exact = ERROR_MESSAGES[message.trim()];
  if (exact) return exact;

  if (message.startsWith('Request failed (')) {
    return 'Не удалось выполнить запрос';
  }

  return message;
}
