import { useEffect, useRef } from 'react';
import {
  Bold, Italic, Underline, List, ListOrdered, Quote, Code,
  Heading1, Heading2, Heading3, Link as LinkIcon, Undo2, Redo2,
} from 'lucide-react';

function ToolButton({ icon: Icon, label, onClick }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      title={label}
      aria-label={label}
      className="grid h-8 w-8 place-items-center rounded-md text-brand-950/70 hover:bg-brand-950/5 hover:text-brand-950"
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

export default function RichTextEditor({ value, onChange, error, placeholder = 'Write your article…' }) {
  const ref = useRef(null);
  const focusedRef = useRef(false);

  useEffect(() => {
    if (ref.current && !focusedRef.current && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value || '';
    }
  }, [value]);

  const exec = (cmd, val = null) => {
    ref.current?.focus();
    // eslint-disable-next-line no-undef
    document.execCommand(cmd, false, val);
    onChange(ref.current?.innerHTML || '');
  };

  const handleLink = () => {
    const url = window.prompt('Enter URL (https://…)');
    if (url) exec('createLink', url);
  };

  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-950/60">
        Content
      </label>
      <div
        className={`overflow-hidden rounded-xl border bg-white ${
          error ? 'border-rose-400' : 'border-brand-950/15 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20'
        }`}
      >
        <div className="flex flex-wrap items-center gap-0.5 border-b border-brand-950/10 bg-surface-50 p-1">
          <ToolButton icon={Bold} label="Bold" onClick={() => exec('bold')} />
          <ToolButton icon={Italic} label="Italic" onClick={() => exec('italic')} />
          <ToolButton icon={Underline} label="Underline" onClick={() => exec('underline')} />
          <span className="mx-1 h-5 w-px bg-brand-950/10" />
          <ToolButton icon={Heading1} label="Heading 1" onClick={() => exec('formatBlock', 'h2')} />
          <ToolButton icon={Heading2} label="Heading 2" onClick={() => exec('formatBlock', 'h3')} />
          <ToolButton icon={Heading3} label="Paragraph" onClick={() => exec('formatBlock', 'p')} />
          <span className="mx-1 h-5 w-px bg-brand-950/10" />
          <ToolButton icon={List} label="Bullet list" onClick={() => exec('insertUnorderedList')} />
          <ToolButton icon={ListOrdered} label="Numbered list" onClick={() => exec('insertOrderedList')} />
          <ToolButton icon={Quote} label="Quote" onClick={() => exec('formatBlock', 'blockquote')} />
          <ToolButton icon={Code} label="Code" onClick={() => exec('formatBlock', 'pre')} />
          <ToolButton icon={LinkIcon} label="Link" onClick={handleLink} />
          <span className="mx-1 h-5 w-px bg-brand-950/10" />
          <ToolButton icon={Undo2} label="Undo" onClick={() => exec('undo')} />
          <ToolButton icon={Redo2} label="Redo" onClick={() => exec('redo')} />
        </div>
        <div
          ref={ref}
          contentEditable
          suppressContentEditableWarning
          role="textbox"
          aria-multiline="true"
          aria-label="Article content"
          data-placeholder={placeholder}
          onFocus={() => (focusedRef.current = true)}
          onBlur={() => (focusedRef.current = false)}
          onInput={() => onChange(ref.current?.innerHTML || '')}
          className="prose-tactyqal min-h-[280px] max-w-none px-4 py-3 text-sm focus:outline-none empty:before:pointer-events-none empty:before:text-brand-950/30 empty:before:content-[attr(data-placeholder)]"
        />
      </div>
      {error ? <p className="mt-1.5 text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}