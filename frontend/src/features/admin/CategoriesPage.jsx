import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchCategories, categoriesQueryKey } from '@/api/categories';
import api from '@/api/client';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { formatDate } from '@/utils/formatDate';
import { Input, Textarea } from '@/components/ui/FormField';
import { Modal, ConfirmDialog } from '@/components/ui/Modal';
import Spinner from '@/components/ui/Spinner';
import ErrorState from '@/features/blog/components/ErrorState';
import EmptyState from '@/features/blog/components/EmptyState';

// Admin-aware wrappers around the shared /categories endpoints.
// Live in this file (not an api module) because only this page mutates.
async function createCategory(payload) {
  const { data } = await api.post('/categories', payload);
  return data.data;
}
async function updateCategory(id, payload) {
  const { data } = await api.put(`/categories/${id}`, payload);
  return data.data;
}
async function deleteCategory(id) {
  await api.delete(`/categories/${id}`);
}

const schema = z.object({
  name: z.string().trim().min(2, 'Name needs at least 2 characters').max(60),
  description: z.string().trim().max(300).optional(),
});

export default function CategoriesPage() {
  useDocumentTitle('Categories');
  const qc = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const query = useQuery({ queryKey: categoriesQueryKey, queryFn: fetchCategories });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { name: '', description: '' } });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: categoriesQueryKey });
    qc.invalidateQueries({ queryKey: ['adminStats'] });
  };

  const saveMutation = useMutation({
    mutationFn: (values) =>
      editing?._id ? updateCategory(editing._id, values) : createCategory(values),
    onSuccess: () => {
      toast.success(editing?._id ? 'Category updated' : 'Category created');
      invalidate();
      closeModal();
    },
    onError: (err) => toast.error(err.message || 'Save failed'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteCategory(id),
    onSuccess: () => {
      toast.success('Category deleted');
      invalidate();
      setDeleting(null);
    },
    onError: (err) => toast.error(err.message || 'Delete failed'),
  });

  const openCreate = () => {
    reset({ name: '', description: '' });
    setEditing({});
  };
  const openEdit = (cat) => {
    reset({ name: cat.name, description: cat.description || '' });
    setEditing(cat);
  };
  const closeModal = () => setEditing(null);

  return (
    <div className="px-4 py-8 sm:px-8 lg:px-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl text-brand-950 sm:text-3xl">Categories</h1>
          <p className="mt-1 text-sm text-brand-950/60">
            {query.data ? `${query.data.length} ${query.data.length === 1 ? 'category' : 'categories'}` : 'Organise your blog.'}
          </p>
        </div>
        <button onClick={openCreate} className="btn-primary text-sm">
          <Plus className="h-4 w-4" /> New category
        </button>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl2 border border-brand-950/10 bg-white shadow-soft">
        {query.isLoading ? (
          <div className="p-14"><Spinner label="Loading…" /></div>
        ) : query.isError ? (
          <div className="p-6">
            <ErrorState title="Couldn't load categories" description={query.error?.message} onRetry={() => query.refetch()} />
          </div>
        ) : query.data?.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title="No categories yet"
              description="Categories help readers find related articles."
              action={
                <button onClick={openCreate} className="btn-primary mt-6 text-sm">
                  <Plus className="h-4 w-4" /> Create category
                </button>
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-50 text-xs uppercase tracking-wider text-brand-950/50">
                <tr>
                  <th className="px-5 py-3 font-semibold">Name</th>
                  <th className="px-5 py-3 font-semibold">Slug</th>
                  <th className="px-5 py-3 font-semibold">Description</th>
                  <th className="px-5 py-3 font-semibold">Created</th>
                  <th className="px-5 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-950/5">
                {query.data.map((c) => (
                  <tr key={c._id} className="hover:bg-surface-50/50">
                    <td className="px-5 py-3.5 font-medium text-brand-950">{c.name}</td>
                    <td className="px-5 py-3.5 font-mono text-xs text-brand-950/60">{c.slug}</td>
                    <td className="max-w-[280px] truncate px-5 py-3.5 text-brand-950/60">{c.description || '—'}</td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-brand-950/60">{formatDate(c.createdAt)}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => openEdit(c)}
                          className="grid h-8 w-8 place-items-center rounded-lg text-brand-950/60 hover:bg-brand-950/5 hover:text-brand-600"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleting(c)}
                          className="grid h-8 w-8 place-items-center rounded-lg text-brand-950/60 hover:bg-rose-50 hover:text-rose-600"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        open={Boolean(editing)}
        onClose={closeModal}
        title={editing?._id ? 'Edit category' : 'New category'}
      >
        <form
          onSubmit={handleSubmit((values) => saveMutation.mutate(values))}
          className="space-y-4"
        >
          <Input
            label="Name"
            required
            placeholder="e.g. Growth"
            error={errors.name?.message}
            {...register('name')}
          />
          <Textarea
            label="Description"
            rows={3}
            placeholder="Optional short description…"
            error={errors.description?.message}
            {...register('description')}
          />
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={closeModal} className="btn-secondary text-sm">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting || saveMutation.isPending} className="btn-primary text-sm">
              {saveMutation.isPending ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleting)}
        onCancel={() => setDeleting(null)}
        onConfirm={() => deleteMutation.mutate(deleting._id)}
        busy={deleteMutation.isPending}
        title={`Delete "${deleting?.name}"?`}
        description="Categories can only be deleted if no posts reference them."
        confirmLabel="Delete"
      />
    </div>
  );
}