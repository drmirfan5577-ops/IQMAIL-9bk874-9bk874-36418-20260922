import { useState, useEffect, useRef } from "react";
import { FileText, Save, Trash2, Plus, Clock, Send } from "lucide-react";
import { MOCK_EMAILS } from "@/constants";
import { formatTimeAgo } from "@/lib/utils";
import { toast } from "sonner";
import type { Email } from "@/types";

interface Draft extends Email {
  autoSaved?: boolean;
}

export default function DraftsPage() {
  const [drafts, setDrafts] = useState<Draft[]>(
    MOCK_EMAILS.filter((e) => e.folder === "drafts") as Draft[]
  );
  const [composing, setComposing] = useState<Draft | null>(null);
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const autoSaveRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerAutoSave = () => {
    if (autoSaveRef.current) clearTimeout(autoSaveRef.current);
    autoSaveRef.current = setTimeout(() => {
      if (to || subject || body) {
        toast.success("Draft auto-saved", { duration: 1500 });
      }
    }, 2000);
  };

  useEffect(() => {
    return () => { if (autoSaveRef.current) clearTimeout(autoSaveRef.current); };
  }, []);

  const createNew = () => {
    setTo("");
    setSubject("");
    setBody("");
    setComposing(null);
  };

  const openDraft = (draft: Draft) => {
    setComposing(draft);
    setTo(draft.to);
    setSubject(draft.subject);
    setBody(draft.body);
  };

  const saveDraft = () => {
    if (!subject && !body) { toast.error("Write something first"); return; }
    const newDraft: Draft = {
      id: `draft_${Date.now()}`,
      from: "me@iqmail.online",
      fromName: "Me",
      to: to || "(no recipient)",
      subject: subject || "(no subject)",
      body,
      preview: body.slice(0, 80),
      read: true,
      starred: false,
      folder: "drafts",
      timestamp: new Date().toISOString(),
      tags: ["draft"],
      autoSaved: false,
    };
    if (composing) {
      setDrafts((prev) => prev.map((d) => d.id === composing.id ? { ...d, to, subject, body, timestamp: new Date().toISOString() } : d));
    } else {
      setDrafts((prev) => [newDraft, ...prev]);
    }
    toast.success("Draft saved successfully");
    setComposing(null);
    setTo(""); setSubject(""); setBody("");
  };

  const deleteDraft = (id: string) => {
    setDrafts((prev) => prev.filter((d) => d.id !== id));
    toast.success("Draft deleted");
    if (composing?.id === id) setComposing(null);
  };

  const sendDraft = () => {
    toast.success("Email sent! (Demo mode)");
    if (composing) deleteDraft(composing.id);
    setTo(""); setSubject(""); setBody("");
  };

  const isEditing = composing !== null || to !== "" || subject !== "" || body !== "";

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white font-bold font-orbitron text-lg">Drafts Manager</h2>
          <p className="text-[rgba(255,255,255,0.4)] text-xs">{drafts.length} draft(s) · Auto-save enabled</p>
        </div>
        <button
          onClick={createNew}
          className="btn-primary text-sm py-2 px-4 flex items-center gap-2"
        >
          <Plus size={16} /> New Draft
        </button>
      </div>

      {/* Compose Area */}
      {isEditing && (
        <div className="glass-strong rounded-3xl p-5 neon-border space-y-3">
          <h3 className="text-[#00d4ff] font-semibold text-sm flex items-center gap-2">
            <FileText size={14} />
            {composing ? "Edit Draft" : "New Draft"}
          </h3>
          <div>
            <label className="text-xs text-[rgba(255,255,255,0.4)] mb-1 block">To</label>
            <input
              type="email"
              value={to}
              onChange={(e) => { setTo(e.target.value); triggerAutoSave(); }}
              placeholder="recipient@email.com"
              className="w-full glass rounded-xl px-4 py-2.5 text-sm text-white placeholder-[rgba(255,255,255,0.2)] focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-[rgba(255,255,255,0.4)] mb-1 block">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => { setSubject(e.target.value); triggerAutoSave(); }}
              placeholder="Email subject..."
              className="w-full glass rounded-xl px-4 py-2.5 text-sm text-white placeholder-[rgba(255,255,255,0.2)] focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-[rgba(255,255,255,0.4)] mb-1 block">Message</label>
            <textarea
              value={body}
              onChange={(e) => { setBody(e.target.value); triggerAutoSave(); }}
              placeholder="Write your message..."
              rows={6}
              className="w-full glass rounded-xl px-4 py-3 text-sm text-white placeholder-[rgba(255,255,255,0.2)] focus:outline-none resize-none leading-relaxed"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={saveDraft} className="btn-primary text-sm py-2 px-4 flex items-center gap-2">
              <Save size={14} /> Save Draft
            </button>
            <button onClick={sendDraft} className="btn-secondary text-sm py-2 px-4 flex items-center gap-2 text-[#22c55e]">
              <Send size={14} /> Send Now
            </button>
            <button
              onClick={() => { setComposing(null); setTo(""); setSubject(""); setBody(""); }}
              className="btn-secondary text-sm py-2 px-4"
            >
              Discard
            </button>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-[rgba(255,255,255,0.3)]">
            <Clock size={10} />
            Auto-saves every 2 seconds while typing
          </div>
        </div>
      )}

      {/* Draft List */}
      {drafts.length === 0 ? (
        <div className="glass rounded-3xl p-12 text-center">
          <FileText size={48} className="text-[rgba(255,255,255,0.1)] mx-auto mb-3" />
          <p className="text-[rgba(255,255,255,0.3)]">No drafts saved</p>
          <p className="text-[rgba(255,255,255,0.2)] text-xs mt-1">Start composing to create a draft</p>
        </div>
      ) : (
        <div className="space-y-2">
          {drafts.map((draft) => (
            <div
              key={draft.id}
              className="glass rounded-2xl p-4 hover:glass-strong transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[rgba(245,158,11,0.1)] flex items-center justify-center shrink-0">
                  <FileText size={16} className="text-[#f59e0b]" />
                </div>
                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => openDraft(draft)}>
                  <p className="text-sm font-medium text-white truncate">{draft.subject}</p>
                  <p className="text-xs text-[rgba(255,255,255,0.4)] truncate mt-0.5">To: {draft.to}</p>
                  <p className="text-[11px] text-[rgba(255,255,255,0.3)] truncate mt-0.5">{draft.preview}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Clock size={9} className="text-[rgba(255,255,255,0.2)]" />
                    <span className="text-[10px] text-[rgba(255,255,255,0.3)]">{formatTimeAgo(draft.timestamp)}</span>
                    {draft.autoSaved && (
                      <span className="text-[10px] text-[#f59e0b] glass px-1.5 py-0.5 rounded-md">Auto-saved</span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => deleteDraft(draft.id)}
                  className="w-8 h-8 rounded-lg glass flex items-center justify-center text-[rgba(255,255,255,0.3)] hover:text-red-400 transition-colors shrink-0"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
