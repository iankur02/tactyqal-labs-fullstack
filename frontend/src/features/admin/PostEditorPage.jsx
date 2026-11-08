import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Save, Send, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  fetchAdminPost,
  createPost,
  updatePost,
  deletePost,
  adminPostQueryKey,
} from '@/api/adminPosts';
import { fetchCategories, categoriesQueryKey } from '@/api/categories';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { Input, Textarea, Select } from '@/components/ui/FormField';
import Spinner from '@/components/ui/Spinner';
import { ConfirmDialog } from '@/components/ui/Modal';
import ErrorState from '@/features/blog/components/ErrorState';
import SlugField from './components/SlugField';
import ImageUploader from './components/ImageUploader';
import RichTextEditor from './components/RichTextEditor';

const schema = z.object({
  title: z.string().trim().min(3, 'Title needs at least 3 characters').max(180),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9-]+$/, 'Only lowercase letters, numbers, and hyphens')
    .optional()
    .or(z.literal('')),
  excerpt: z.string().trim().min(10, 'Excerpt needs at least 10 characters').max(400),
  content: z.string().refine((v) => v.replace(/<[^>]+>/g, '').trim().length > 0, {
    message: 'Content cannot be empty',
  }),
  category: z.string().min(1, 'Please choose a category'),
  tagsInput: z.string().optional(),
  seoTitle: z.string().trim().max(180).optional(),
  seoDescription: z.string().trim().max(300).optional(),
});

const toTags = (s) =>
  (s || '')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 12);

export default function PostEditorPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [confirmDelete, setConfirmDelete] = useState(false);

  useDocumentTitle(isEdit ? 'Edit post' : 'New post');

  const categoriesQuery = useQuery({
    queryKey: categoriesQueryKey,
    queryFn: fetchCategories,
  });

  const postQuery = useQuery({
    queryKey: adminPostQueryKey(id),
    queryFn: () => fetchAdminPost(id),
    enabled: isEdit,
  });

  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      category: '',
      tagsInput: '',
      seoTitle: '',
      seoDescription: '',
    },
  });

  const [featuredImage, setFeaturedImage] = useState({ url: '', publicId: '' });

  // Populate form when editing
  useEffect(() => {
    if (!postQuery.data) return;
    const p = postQuery.data;
    reset({
      title: p.title || '',
      slug: p.slug || '',
      excerpt: p.excerpt || '',
      content: p.content || '',
      category: p.category?._id || '',
      tagsInput: (p.tags || []).join(', '),
      seoTitle: p.seoTitle || '',
      seoDescription: p.seoDescription || '',
    });
    setFeaturedImage(p.featuredImage || { url: '', publicId: '' });
  }, [postQuery.data, reset]);

  const title = watch('title');

  // Warn on unload if there are unsaved changes
  useEffect(() => {
    const handler = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);

  const saveMutation = useMutation({
    mutationFn: async ({ values, status }) => {
      const payload = {
        title: values.title.trim(),
        slug: values.slug?.trim() || undefined,
        excerpt: values.excerpt.trim(),
        content: values.content,
        category: values.category,
        tags: toTags(values.tagsInput),
        status,
        seoTitle: values.seoTitle?.trim() || undefined,
        seoDescription: values.seoDescription?.trim() || undefined,
        featuredImage,
      };
      return isEdit ? updatePost(id, payload) : createPost(payload);
    },
    onSuccess: (post, vars) => {
      // Sync the form baseline with the server's canonical values.
      // `keepDirty: false` flips isDirty to false → no bogus "leave site?" prompt.
      reset(
        {
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          category: post.category?._id || post.category,
          tagsInput: (post.tags || []).join(', '),
          seoTitle: post.seoTitle || '',
          seoDescription: post.seoDescription || '',
        },
        { keepDirty: false }
      );
      setFeaturedImage(post.featuredImage || { url: '', publicId: '' });

      toast.success(vars.status === 'published' ? 'Post published' : 'Draft saved');
      qc.invalidateQueries({ queryKey: ['adminPosts'] });
      qc.invalidateQueries({ queryKey: ['adminStats'] });
      qc.invalidateQueries({ queryKey: ['posts'] });
      qc.invalidateQueries({ queryKey: adminPostQueryKey(id) });

      if (vars.status === 'published') {
        setTimeout(() => navigate('/admin/posts'), 200);
      } else if (!isEdit) {
        navigate(`/admin/posts/${post._id}/edit`, { replace: true });
      }
    },
    onError: (err) => toast.error(err.message || 'Save failed'),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deletePost(id),
    onSuccess: () => {
      toast.success('Post deleted');
      qc.invalidateQueries({ queryKey: ['adminPosts'] });
      qc.invalidateQueries({ queryKey: ['adminStats'] });
      navigate('/admin/posts');
    },
    onError: (err) => toast.error(err.message || 'Delete failed'),
  });

  const submitAs = (status) =>
    handleSubmit((values) => saveMutation.mutate({ values, status }))();

  const categoryOptions = useMemo(
    () =>
      (categoriesQuery.data || []).map((c) => ({ value: c._id, label: c.name })),
    [categoriesQuery.data]
  );

  if (isEdit && postQuery.isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" label="Loading post…" />
      </div>
    );
  }
  if (isEdit && postQuery.isError) {
    return (
      <div className="px-4 py-8 sm:px-8 lg:px-10">
        <ErrorState
          title="Couldn't load this post"
          description={postQuery.error?.message}
          onRetry={() => postQuery.refetch()}
        />
      </div>
    );
  }

  return (
    <div className="px-4 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <Link
          to="/admin/posts"
          className="inline-flex items-center gap-1.5 text-sm text-brand-950/60 hover:text-brand-600"
        >
          <ArrowLeft className="h-4 w-4" /> All posts
        </Link>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="font-display text-2xl text-brand-950 sm:text-3xl">
            {isEdit ? 'Edit post' : 'New post'}
          </h1>
          <div className="flex gap-2">
            {isEdit ? (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50"
              >
                <Trash2 className="h-4 w-4" /> Delete
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => submitAs('draft')}
              disabled={saveMutation.isPending}
              className="btn-secondary text-sm"
            >
              <Save className="h-4 w-4" /> Save draft
            </button>
            <button
              type="button"
              onClick={() => submitAs('published')}
              disabled={saveMutation.isPending}
              className="btn-primary text-sm"
            >
              <Send className="h-4 w-4" /> Publish
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Main column */}
          <div className="space-y-5 rounded-xl2 border border-brand-950/10 bg-white p-6 shadow-soft">
            <Input
              label="Title"
              required
              placeholder="How to launch your first product"
              error={errors.title?.message}
              {...register('title')}
            />

            <Controller
              control={control}
              name="slug"
              render={({ field }) => (
                <SlugField
                  title={title}
                  value={field.value || ''}
                  onChange={field.onChange}
                  autoSlug={!isEdit}
                  error={errors.slug?.message}
                />
              )}
            />

            <Textarea
              label="Excerpt"
              required
              rows={3}
              placeholder="A short teaser shown on the blog listing…"
              error={errors.excerpt?.message}
              hint={`${(watch('excerpt') || '').length}/400`}
              {...register('excerpt')}
            />

            <Controller
              control={control}
              name="content"
              render={({ field }) => (
                <RichTextEditor
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.content?.message}
                />
              )}
            />

            <div className="space-y-4 border-t border-brand-950/10 pt-5">
              <h3 className="text-sm font-semibold text-brand-950">SEO</h3>
              <Input
                label="SEO title"
                placeholder="Defaults to post title"
                error={errors.seoTitle?.message}
                {...register('seoTitle')}
              />
              <Textarea
                label="SEO description"
                rows={2}
                placeholder="Shown in search results…"
                error={errors.seoDescription?.message}
                {...register('seoDescription')}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="rounded-xl2 border border-brand-950/10 bg-white p-5 shadow-soft">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-950/50">
                Category
              </h3>
              <div className="mt-3">
                <Select
                  required
                  placeholder="Choose category…"
                  options={categoryOptions}
                  error={errors.category?.message}
                  {...register('category')}
                />
                {categoryOptions.length === 0 && !categoriesQuery.isLoading ? (
                  <p className="mt-2 text-xs text-brand-950/50">
                    <Link to="/admin/categories" className="font-semibold text-brand-600 hover:text-brand-500">
                      Create a category
                    </Link>{' '}
                    to get started.
                  </p>
                ) : null}
              </div>
            </div>

            <div className="rounded-xl2 border border-brand-950/10 bg-white p-5 shadow-soft">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-950/50">
                Tags
              </h3>
              <div className="mt-3">
                <Input
                  placeholder="launch, mvp, no-code"
                  hint="Comma-separated, up to 12 tags."
                  {...register('tagsInput')}
                />
                {toTags(watch('tagsInput')).length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {toTags(watch('tagsInput')).map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-surface-100 px-2.5 py-0.5 text-[11px] font-medium text-brand-950/70"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="rounded-xl2 border border-brand-950/10 bg-white p-5 shadow-soft">
              <ImageUploader value={featuredImage} onChange={setFeaturedImage} />
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        onCancel={() => setConfirmDelete(false)}
        onConfirm={() => deleteMutation.mutate()}
        busy={deleteMutation.isPending}
        title="Delete this post?"
        description="This action cannot be undone."
        confirmLabel="Delete"
      />
    </div>
  );
}