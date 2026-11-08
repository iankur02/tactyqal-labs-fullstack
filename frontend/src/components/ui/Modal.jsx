import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { X, AlertTriangle } from 'lucide-react';

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Modal({ open, onClose, title, description, children, size = 'md', initialFocusRef }) {
  const panelRef = useRef(null);
  const previouslyFocused = useRef(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement;

    // Focus initial element (or first focusable in panel)
    const focusTimer = requestAnimationFrame(() => {
      const target =
        initialFocusRef?.current || panelRef.current?.querySelector(FOCUSABLE);
      target?.focus?.();
    });

    // Trap Tab within the panel
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose?.();
        return;
      }
      if (e.key !== 'Tab') return;

      const nodes = Array.from(panelRef.current?.querySelectorAll(FOCUSABLE) || []);
      if (nodes.length === 0) return;

      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement;

      if (e.shiftKey && (active === first || !panelRef.current.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      cancelAnimationFrame(focusTimer);
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
      previouslyFocused.current?.focus?.();
    };
  }, [open, onClose, initialFocusRef]);

  const widths = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl' };
  const motionProps = reduce
    ? { initial: { opacity: 1 }, animate: { opacity: 1 }, exit: { opacity: 1 } }
    : {
        initial: { opacity: 0, y: 12, scale: 0.98 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 8, scale: 0.98 },
        transition: { duration: 0.2 },
      };

  return createPortal(
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.15 }}
            className="absolute inset-0 bg-brand-950/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'modal-title' : undefined}
            aria-describedby={description ? 'modal-desc' : undefined}
            {...motionProps}
            className={`relative w-full ${widths[size]} rounded-xl2 bg-white p-6 shadow-lift`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                {title ? (
                  <h2 id="modal-title" className="text-lg font-semibold text-brand-950">
                    {title}
                  </h2>
                ) : null}
                {description ? (
                  <p id="modal-desc" className="mt-1 text-sm text-brand-950/60">
                    {description}
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-1 text-brand-950/40 hover:bg-brand-950/5 hover:text-brand-950"
                aria-label="Close dialog"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {children ? <div className="mt-5">{children}</div> : null}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}

export function ConfirmDialog({
  open,
  onCancel,
  onConfirm,
  title = 'Are you sure?',
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'danger',
  busy = false,
}) {
  const confirmBtnRef = useRef(null);

  const btnClass =
    tone === 'danger'
      ? 'bg-rose-600 text-white hover:bg-rose-500'
      : 'bg-brand-600 text-white hover:bg-brand-500';

  return (
    <Modal
      open={open}
      onClose={busy ? undefined : onCancel}
      size="sm"
      initialFocusRef={confirmBtnRef}
    >
      <div className="flex gap-4">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-rose-100 text-rose-600">
          <AlertTriangle className="h-5 w-5" aria-hidden />
        </span>
        <div>
          <h3 className="text-base font-semibold text-brand-950">{title}</h3>
          {description ? <p className="mt-1 text-sm text-brand-950/60">{description}</p> : null}
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <button type="button" onClick={onCancel} disabled={busy} className="btn-secondary text-sm">
          {cancelLabel}
        </button>
        <button
          ref={confirmBtnRef}
          type="button"
          onClick={onConfirm}
          disabled={busy}
          className={`rounded-full px-5 py-2.5 text-sm font-semibold transition disabled:opacity-60 ${btnClass}`}
        >
          {busy ? 'Working…' : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}