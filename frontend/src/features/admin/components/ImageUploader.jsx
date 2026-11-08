import { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadImage } from '@/api/adminPosts';
import { resolveImageUrl } from '@/utils/images';

export default function ImageUploader({ value, onChange }) {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const preview = resolveImageUrl(value?.url);

  const handleFile = async (file) => {
    if (!file) return;
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      toast.error('Only JPEG, PNG, or WebP images are allowed');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB');
      return;
    }
    setUploading(true);
    try {
      const result = await uploadImage(file);
      onChange(result);
    } catch (err) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-950/60">
        Featured image
      </label>
      {preview ? (
        <div className="relative overflow-hidden rounded-xl border border-brand-950/10 bg-surface-50">
          <img src={preview} alt="Featured" className="aspect-[16/10] w-full object-cover" />
          <button
            type="button"
            onClick={() => onChange({ url: '', publicId: '' })}
            className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-brand-950 shadow hover:bg-white"
            aria-label="Remove image"
          >
            <X className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="absolute bottom-2 right-2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-brand-950 shadow hover:bg-white"
          >
            Replace
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-brand-950/15 bg-white px-4 py-8 text-sm text-brand-950/60 transition hover:border-brand-500/40 hover:bg-brand-500/[0.02] disabled:opacity-60"
        >
          {uploading ? (
            <>
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-500/30 border-t-brand-500" />
              <span>Uploadingâ€¦</span>
            </>
          ) : (
            <>
              <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-500/10 text-brand-600">
                <Upload className="h-4 w-4" />
              </span>
              <span className="font-medium">Click to upload</span>
              <span className="text-xs text-brand-950/40">JPEG, PNG, or WebP up to 5MB</span>
            </>
          )}
        </button>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(e) => handleFile(e.target.files?.[0])}
        className="hidden"
      />
    </div>
  );
}