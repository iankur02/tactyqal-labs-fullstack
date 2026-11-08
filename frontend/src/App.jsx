import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from '@/layouts/PublicLayout';
import AdminLayout from '@/layouts/AdminLayout';
import ProtectedRoute from '@/routes/ProtectedRoute';
import PublicOnlyRoute from '@/routes/PublicOnlyRoute';
import Spinner from '@/components/ui/Spinner';

// Public — split per-route so first paint stays tiny
const HomePage = lazy(() => import('@/features/homepage/HomePage'));
const BlogListPage = lazy(() => import('@/features/blog/BlogListPage'));
const BlogDetailPage = lazy(() => import('@/features/blog/BlogDetailPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

// Admin — single chunk, lazy-loaded on first /admin hit
const LoginPage = lazy(() => import('@/features/admin/LoginPage'));
const DashboardPage = lazy(() => import('@/features/admin/DashboardPage'));
const PostsListPage = lazy(() => import('@/features/admin/PostsListPage'));
const PostEditorPage = lazy(() => import('@/features/admin/PostEditorPage'));
const CategoriesPage = lazy(() => import('@/features/admin/CategoriesPage'));

function RouteFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Spinner size="lg" label="Loading…" />
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        {/* Public site */}
        <Route element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="blog" element={<BlogListPage />} />
          <Route path="blog/:slug" element={<BlogDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Admin login (public only) */}
        <Route
          path="/admin/login"
          element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          }
        />

        {/* Admin app (protected) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="posts" element={<PostsListPage />} />
          <Route path="posts/new" element={<PostEditorPage />} />
          <Route path="posts/:id/edit" element={<PostEditorPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
}