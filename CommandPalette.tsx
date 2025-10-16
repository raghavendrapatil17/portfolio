import React, { useEffect, useRef, useState } from 'react';

interface CommandItem { id: string; label: string; action: () => void; keywords?: string; }

const SECTIONS = ['home','about','skills','education','experience','projects','certifications','contact'];

const buildItems = (): CommandItem[] => SECTIONS.map(id => ({
  id, label: `Go to ${id.charAt(0).toUpperCase()+id.slice(1)}`, action: () => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, keywords: id
}));

export const CommandPalette: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement|null>(null);
  const items = buildItems();
  const filtered = items.filter(i => i.label.toLowerCase().includes(query.toLowerCase()) || (i.keywords||'').includes(query.toLowerCase()));

  useEffect(()=>{
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase()==='k') { e.preventDefault(); setOpen(o=>!o); }
      if (e.key==='Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return ()=> window.removeEventListener('keydown', onKey);
  },[]);
  useEffect(()=>{ if(open) setTimeout(()=> inputRef.current?.focus(), 0); else setQuery(''); },[open]);

  if(!open) return null;
  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center pt-24 bg-background/70 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="w-full max-w-lg rounded-xl border border-border bg-card shadow-lg overflow-hidden">
        <div className="p-3 border-b border-border">
          <input ref={inputRef} value={query} onChange={e=>setQuery(e.target.value)} placeholder="Type a command or section..." className="w-full bg-transparent outline-none text-sm" aria-label="Command search" />
        </div>
        <ul className="max-h-80 overflow-y-auto text-sm">
          {filtered.length===0 && <li className="p-4 text-muted-foreground">No matches</li>}
          {filtered.map(i=> (
            <li key={i.id}>
              <button onClick={()=>{ i.action(); setOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-accent/40 focus:bg-accent/40 focus:outline-none flex items-center gap-2">
                <span className="flex-1">{i.label}</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wide">{i.id}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="px-4 py-2 border-t border-border text-[10px] text-muted-foreground flex justify-between">
          <span>Press Esc to close</span>
          <span><kbd className="px-1.5 py-0.5 bg-muted rounded">Ctrl</kbd>+<kbd className="px-1.5 py-0.5 bg-muted rounded">K</kbd></span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;