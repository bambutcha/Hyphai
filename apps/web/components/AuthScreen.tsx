'use client';

import { useState } from 'react';
import { FormField } from '@/components/ui/FormField';
import { api, getErrorMessage, setAuthToken } from '@/lib/api';
import { localizeErrorMessage } from '@/lib/errors';
import { validateAuthForm, validateDisplayName, validateEmail, validatePassword, type AuthFieldErrors } from '@/lib/validateAuth';

interface AuthScreenProps {
  initialError?: string | null;
  onAuthenticated: () => void;
}

export function AuthScreen({ initialError = null, onAuthenticated }: AuthScreenProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [fieldErrors, setFieldErrors] = useState<AuthFieldErrors>({});
  const [error, setError] = useState<string | null>(
    initialError ? localizeErrorMessage(initialError) : null,
  );
  const [loading, setLoading] = useState(false);

  const handleModeSwitch = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setFieldErrors({});
    setError(null);
  };

  const patchFieldError = (field: keyof AuthFieldErrors, message: string | null) => {
    setFieldErrors((prev) => {
      const next = { ...prev };
      if (message) next[field] = message;
      else delete next[field];
      return next;
    });
  };

  const handleFieldBlur = (field: keyof AuthFieldErrors) => {
    if (field === 'email') {
      if (!email.trim()) return;
      patchFieldError('email', validateEmail(email));
      return;
    }
    if (field === 'password') {
      if (!password) return;
      patchFieldError('password', validatePassword(password));
      return;
    }
    if (field === 'displayName' && mode === 'register') {
      patchFieldError('displayName', validateDisplayName(displayName));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateAuthForm(mode, email, password, displayName);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    setError(null);
    try {
      const result =
        mode === 'login'
          ? await api.login(email.trim(), password)
          : await api.register(email.trim(), password, displayName.trim());
      setAuthToken(result.token);
      onAuthenticated();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-emerald-900/40 bg-zinc-900 p-8 shadow-xl">
        <h1 className="text-2xl font-semibold text-emerald-400">Hyphai</h1>
        <p className="mt-1 text-sm text-zinc-500">Войди, чтобы продолжить</p>
        <form noValidate onSubmit={handleSubmit} className="mt-6 space-y-4">
          {mode === 'register' && (
            <FormField
              name="displayName"
              type="text"
              placeholder="Имя"
              value={displayName}
              onChange={(e) => {
                setDisplayName(e.target.value);
                if (fieldErrors.displayName) patchFieldError('displayName', null);
              }}
              onBlur={() => handleFieldBlur('displayName')}
              error={fieldErrors.displayName}
            />
          )}
          <FormField
            name="email"
            type="text"
            inputMode="email"
            autoComplete="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (fieldErrors.email) patchFieldError('email', null);
            }}
            onBlur={() => handleFieldBlur('email')}
            error={fieldErrors.email}
          />
          <FormField
            name="password"
            type="password"
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            placeholder="Пароль (мин. 6)"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (fieldErrors.password) patchFieldError('password', null);
            }}
            onBlur={() => handleFieldBlur('password')}
            error={fieldErrors.password}
          />
          {error && (
            <p className="rounded-lg bg-red-950/50 px-3 py-2 text-sm text-red-400" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-emerald-600 py-3 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
          >
            {loading ? '…' : mode === 'login' ? 'Войти' : 'Регистрация'}
          </button>
        </form>
        <button
          type="button"
          onClick={handleModeSwitch}
          className="mt-4 w-full text-sm text-zinc-500 hover:text-emerald-400"
        >
          {mode === 'login' ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
        </button>
      </div>
    </div>
  );
}
