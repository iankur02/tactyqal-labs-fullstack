import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft, LogIn } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { Input } from '@/components/ui/FormField';

const schema = z.object({
  email: z.string().trim().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

export default function LoginPage() {
  useDocumentTitle('Sign in');
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/admin';
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { email: '', password: '' } });

  const onSubmit = async (values) => {
    setServerError('');
    try {
      await signIn(values.email, values.password);
      navigate(from, { replace: true });
    } catch (err) {
      setServerError(err?.message || 'Sign-in failed');
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-surface-50">
      <div className="container-x py-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-brand-950/60 hover:text-brand-600"
        >
          <ArrowLeft className="h-4 w-4" /> Back to site
        </Link>
      </div>

      <div className="flex flex-1 items-start justify-center px-4 pb-16">
        <div className="w-full max-w-md">
          <div className="rounded-xl2 border border-brand-950/10 bg-white p-8 shadow-lift">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-950 text-white">
              <span className="font-display text-xl leading-none">T</span>
            </span>
            <h1 className="mt-5 font-display text-2xl text-brand-950">Sign in to Tactyqal Admin</h1>
            <p className="mt-1 text-sm text-brand-950/60">
              Authorised editors and admins only.
            </p>

            {serverError ? (
              <div
                role="alert"
                className="mt-5 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{serverError}</span>
              </div>
            ) : null}

            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
              <Input
                label="Email"
                type="email"
                autoComplete="email"
                placeholder="admin@tactyqal.local"
                required
                error={errors.email?.message}
                {...register('email')}
              />
              <Input
                label="Password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                required
                error={errors.password?.message}
                {...register('password')}
              />
              <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
                {isSubmitting ? 'Signing in…' : (<>Sign in <LogIn className="h-4 w-4" /></>)}
              </button>
            </form>
          </div>
          <p className="mt-6 text-center text-xs text-brand-950/40">
            This page is protected. Repeated failed attempts are rate-limited.
          </p>
        </div>
      </div>
    </div>
  );
}