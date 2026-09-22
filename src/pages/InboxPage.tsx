import { useState } from "react";
import { Mail, Star, Trash2, Archive, Search, Filter, RefreshCw, Paperclip } from "lucide-react";
import { MOCK_EMAILS } from "@/constants";
import { formatTimeAgo } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Email } from "@/types";

const FOLDERS = [
  { key: "inbox", label: "Inbox", icon: "📥" },
  { key: "sent", label: "Sent", icon: "📤" },
  { key: "drafts", label: "Drafts", icon: "📝" },
  { key: "trash", label: "Trash", icon: "🗑" },
];

export default function InboxPage() {
  const [folder, setFolder] = useState<Email["folder"]>("inbox");
  const [search, setSearch] = useState("");
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [emails, setEmails] = useState<Email[]>(MOCK_EMAILS);

  const filtered = emails.filter(
    (e) =>
      e.folder === folder &&
      (search === "" ||
        e.subject.toLowerCase().includes(search.toLowerCase()) ||
        e.fromName.toLowerCase().includes(search.toLowerCase()))
  );

  const toggleStar = (id: string) => {
    setEmails((prev) => prev.map((e) => (e.id === id ? { ...e, starred: !e.starred } : e)));
  };

  const markRead = (id: string) => {
    setEmails((prev) => prev.map((e) => (e.id === id ? { ...e, read: true } : e)));
  };

  if (selectedEmail) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setSelectedEmail(null)}
          className="flex items-center gap-2 text-[#00d4ff] text-sm hover:underline"
        >
          ← Back to {folder}
        </button>
        <div className="glass-strong rounded-3xl p-6 neon-border">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <h2 className="text-white font-bold text-lg leading-tight">{selectedEmail.subject}</h2>
              <div className="flex items-center gap-3 mt-2">
                <div className="w-8 h-8 rounded-full bg-[rgba(0,212,255,0.15)] flex items-center justify-center text-sm text-[#00d4ff] font-bold">
                  {selectedEmail.fromName[0]}
                </div>
                <div>
                  <p className="text-sm text-white font-medium">{selectedEmail.fromName}</p>
                  <p className="text-xs text-[rgba(255,255,255,0.4)]">{selectedEmail.from}</p>
                </div>
              </div>
            </div>
            <span className="text-xs text-[rgba(255,255,255,0.3)] whitespace-nowrap shrink-0">
              {formatTimeAgo(selectedEmail.timestamp)}
            </span>
          </div>
          {selectedEmail.attachments && selectedEmail.attachments.length > 0 && (
            <div className="flex gap-2 mb-4 flex-wrap">
              {selectedEmail.attachments.map((a) => (
                <span key={a.name} className="flex items-center gap-1 text-xs glass px-2 py-1 rounded-lg text-[rgba(255,255,255,0.5)]">
                  <Paperclip size={10} /> {a.name}
                </span>
              ))}
            </div>
          )}
          <div className="glass rounded-2xl p-4">
            <pre className="text-sm text-[rgba(255,255,255,0.8)] whitespace-pre-wrap font-inter leading-relaxed">
              {selectedEmail.body}
            </pre>
          </div>
          <div className="flex gap-2 mt-5 flex-wrap">
            <button className="btn-primary text-sm py-2 px-4">Reply</button>
            <button className="btn-secondary text-sm py-2 px-4">Forward</button>
            <button
              onClick={() => toggleStar(selectedEmail.id)}
              className={cn("btn-secondary text-sm py-2 px-4", selectedEmail.starred ? "text-yellow-400" : "")}
            >
              {selectedEmail.starred ? "★ Starred" : "☆ Star"}
            </button>
            <button className="btn-secondary text-sm py-2 px-4 text-red-400">
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Folder Tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {FOLDERS.map(({ key, label, icon }) => {
          const count = emails.filter((e) => e.folder === key && !e.read).length;
          return (
            <button
              key={key}
              onClick={() => setFolder(key as Email["folder"])}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all shrink-0",
                folder === key ? "bg-[#00d4ff] text-navy-900" : "glass text-[rgba(255,255,255,0.6)] hover:text-white"
              )}
            >
              <span>{icon}</span>
              {label}
              {count > 0 && (
                <span className={cn("rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                  folder === key ? "bg-navy-900 text-[#00d4ff]" : "bg-[rgba(0,212,255,0.2)] text-[#00d4ff]")}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.3)]" />
        <input
          type="text"
          placeholder="Search emails..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full glass rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-[rgba(255,255,255,0.3)] focus:outline-none"
        />
        <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.3)] hover:text-white">
          <Filter size={14} />
        </button>
      </div>

      {/* Email List */}
      {filtered.length === 0 ? (
        <div className="glass rounded-3xl p-12 text-center">
          <Mail size={48} className="text-[rgba(255,255,255,0.1)] mx-auto mb-3" />
          <p className="text-[rgba(255,255,255,0.3)]">No emails in {folder}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((email) => (
            <button
              key={email.id}
              onClick={() => { setSelectedEmail(email); markRead(email.id); }}
              className={cn(
                "w-full text-left glass rounded-2xl p-4 transition-all hover:glass-strong border",
                !email.read ? "border-[rgba(0,212,255,0.2)]" : "border-transparent"
              )}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-sm font-bold"
                  style={{ background: "rgba(0,212,255,0.1)", color: "#00d4ff" }}>
                  {email.fromName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className={cn("text-sm font-semibold truncate", !email.read ? "text-white" : "text-[rgba(255,255,255,0.6)]")}>
                      {email.fromName}
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      {email.starred && <span className="text-yellow-400 text-xs">★</span>}
                      <span className="text-[10px] text-[rgba(255,255,255,0.3)]">{formatTimeAgo(email.timestamp)}</span>
                    </div>
                  </div>
                  <p className={cn("text-xs mt-0.5 truncate", !email.read ? "text-[rgba(255,255,255,0.8)]" : "text-[rgba(255,255,255,0.4)]")}>
                    {email.subject}
                  </p>
                  <p className="text-[11px] text-[rgba(255,255,255,0.3)] truncate mt-0.5">{email.preview}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    {email.tags.map((tag) => (
                      <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded-md glass text-[rgba(255,255,255,0.4)] capitalize">{tag}</span>
                    ))}
                    {email.attachments && email.attachments.length > 0 && (
                      <Paperclip size={10} className="text-[rgba(255,255,255,0.3)]" />
                    )}
                    {!email.read && (
                      <span className="ml-auto w-2 h-2 rounded-full bg-[#00d4ff]" />
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
