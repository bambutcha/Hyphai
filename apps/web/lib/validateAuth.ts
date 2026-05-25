const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(value: string): string | null {
  if (!value.trim()) return 'Введите email, например name@example.com';
  if (!EMAIL_RE.test(value.trim())) return 'Некорректный email. Используйте формат name@example.com';
  return null;
}

export function validatePassword(value: string): string | null {
  if (!value) return 'Введите пароль';
  if (value.length < 6) return 'Пароль должен быть не короче 6 символов';
  return null;
}

export function validateDisplayName(value: string): string | null {
  if (!value.trim()) return 'Введите имя — оно будет отображаться в чате';
  return null;
}

export type AuthFieldErrors = {
  email?: string;
  password?: string;
  displayName?: string;
};

export function validateAuthForm(
  mode: 'login' | 'register',
  email: string,
  password: string,
  displayName: string,
): AuthFieldErrors {
  const errors: AuthFieldErrors = {};
  const emailError = validateEmail(email);
  const passwordError = validatePassword(password);
  if (emailError) errors.email = emailError;
  if (passwordError) errors.password = passwordError;
  if (mode === 'register') {
    const nameError = validateDisplayName(displayName);
    if (nameError) errors.displayName = nameError;
  }
  return errors;
}
