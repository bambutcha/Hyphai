'use client';

import { motion, useReducedMotion } from 'motion/react';
import { useState } from 'react';
import { FormField } from '@/components/ui/FormField';
import { HyphaeBackground } from '@/components/visual/HyphaeBackground';
import { GlassPanel } from '@/components/visual/GlassPanel';
import { GlowButton } from '@/components/visual/GlowButton';
import { api, getErrorMessage, setAuthToken } from '@/lib/api';
import { localizeErrorMessage } from '@/lib/errors';
import { fadeScale, motionTransition } from '@/lib/motion';
import {
  validateAuthForm,
  validateDisplayName,
  validateEmail,
  validatePassword,
  type AuthFieldErrors,
} from '@/lib/validateAuth';

interface AuthScreenProps {
  initialError?: string | null;
  onAuthenticated: () => void;
}

export function AuthScreen({ initialError = null, onAuthenticated }: AuthScreenProps) {
  const reduced = useReducedMotion();
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
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[var(--hyphai-bg-deep)] px-4 pt-safe pb-safe">
      <HyphaeBackground />
      <motion.div
        variants={fadeScale}
        initial="hidden"
        animate="visible"
        transition={motionTransition(!!reduced)}
        className="relative z-10 w-full max-w-md"
      >
        <GlassPanel className="p-6 sm:p-8 shadow-[0_0_80px_rgba(52,211,153,0.12)]">
          <h1 className="font-display text-3xl font-bold tracking-tight text-emerald-400">Hyphai</h1>
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
            <GlowButton
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? '…' : mode === 'login' ? 'Войти' : 'Регистрация'}
            </GlowButton>
          </form>
          <button
            type="button"
            onClick={handleModeSwitch}
            className="hyphai-interactive hyphai-focus mt-4 w-full rounded-lg py-2.5 text-sm text-zinc-500 hover:bg-zinc-900/40 hover:text-emerald-400"
          >
            {mode === 'login' ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
          </button>
        </GlassPanel>
      </motion.div>
    </div>
  );
}
