const ERROR_MESSAGES: Record<string, string> = {
  'Invalid credentials': 'Неверный email или пароль',
  'Session expired. Please sign in again.': 'Сессия истекла. Войдите снова',
  Unauthorized: 'Сессия истекла. Войдите снова',
  'Email already registered': 'Этот email уже зарегистрирован',
  'Email and password required': 'Укажите email и пароль',
  'Email and password (min 6 chars) required': 'Укажите email и пароль (мин. 6 символов)',
  'Content is required': 'Введите текст сообщения',
  'Not found': 'Не найдено',
  'Cannot reach server. Check your connection.': 'Не удалось связаться с сервером. Проверьте подключение',
  'Server error. Try again in a moment.': 'Ошибка сервера. Попробуйте позже',
  'Something went wrong': 'Произошла ошибка',
};

export function localizeErrorMessage(message: string): string {
  const exact = ERROR_MESSAGES[message.trim()];
  if (exact) return exact;

  if (message.startsWith('Request failed (')) {
    return 'Не удалось выполнить запрос';
  }

  return message;
}
