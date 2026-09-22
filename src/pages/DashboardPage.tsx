import { useNavigate } from "react-router-dom";
import { Mail, Send, FileText, Bell, BarChart2, Shield, Zap, Users, TrendingUp, Clock } from "lucide-react";
import { useAppStore } from "@/stores/appStore";
import { MOCK_EMAILS } from "@/constants";
import { formatTimeAgo, getInitials } from "@/lib/utils";

export default function DashboardPage() {
  const { user, notifications, featureFlags } = useAppStore();
  const navigate = useNavigate();

  const unreadEmails = MOCK_EMAILS.filter((e) => !e.read && e.folder === "inbox").length;
  const drafts = MOCK_EMAILS.filter((e) => e.folder === "drafts").length;
  const unreadNotifs = notifications.filter((n) => !n.read).length;
  const sentToday = MOCK_EMAILS.filter((e) => e.folder === "sent").length;

  const quickActions = [
    { icon: Mail, label: "Inbox", count: unreadEmails, color: "#00d4ff", path: "/inbox", bg: "rgba(0,212,255,0.1)" },
    { icon: Send, label: "Sent", count: sentToday, color: "#22c55e", path: "/inbox", bg: "rgba(34,197,94,0.1)" },
    { icon: FileText, label: "Drafts", count: drafts, color: "#f59e0b", path: "/drafts", bg: "rgba(245,158,11,0.1)" },
    { icon: Bell, label: "Alerts", count: unreadNotifs, color: "#a855f7", path: "/notifications", bg: "rgba(168,85,247,0.1)" },
  ];

  const stats = [
    { label: "Open Rate", value: "—", sub: "Awaiting data", icon: TrendingUp, color: "#00d4ff" },
    { label: "Campaigns", value: "0", sub: "Create first", icon: Zap, color: "#a855f7" },
    { label: "Contacts", value: "—", sub: "Import contacts", icon: Users, color: "#22c55e" },
    { label: "Uptime", value: "99.9%", sub: "This month", icon: Shield, color: "#f59e0b" },
  ];

  const recentEmails = MOCK_EMAILS.filter((e) => e.folder === "inbox").slice(0, 3);

  return (
    <div className="space-y-5">
      {/* Welcome Hero */}
      <div className="glass-strong rounded-3xl p-6 neon-border relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-5 pointer-events-none"
          style={{ background: "radial-gradient(circle, #00d4ff, transparent)", transform: "translate(25%, -25%)" }} />
        <div className="relative">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#00d4ff] flex items-center justify-center neon-glow shrink-0">
              <span className="font-orbitron font-black text-navy-900 text-xl">{getInitials(user?.name || "U")}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[rgba(255,255,255,0.4)] text-xs mb-0.5">🎉 Welcome back</p>
              <h2 className="text-white font-bold text-2xl font-orbitron truncate">{user?.name || "User"}</h2>
              <p className="text-[rgba(255,255,255,0.4)] text-xs mt-0.5">Member · {user?.email}</p>
              <p className="text-[rgba(255,255,255,0.3)] text-xs">ID: {user?.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-4 flex-wrap">
            {user?.verified && (
              <span className="flex items-center gap-1 text-xs text-[#22c55e] glass px-2 py-1 rounded-lg">
                <Shield size={10} /> Verified
              </span>
            )}
            {user?.twoFAEnabled && (
              <span className="flex items-center gap-1 text-xs text-[#00d4ff] glass px-2 py-1 rounded-lg">
                <Zap size={10} /> 2FA Active
              </span>
            )}
            <span className="flex items-center gap-1 text-xs text-[rgba(255,255,255,0.4)] glass px-2 py-1 rounded-lg">
              <Clock size={10} /> Active Now
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-3">
        {quickActions.map(({ icon: Icon, label, count, color, path, bg }) => (
          <button
            key={label}
            onClick={() => navigate(path)}
            className="glass rounded-2xl p-3 flex flex-col items-center gap-2 hover:glass-strong transition-all group"
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center relative group-hover:scale-110 transition-transform"
              style={{ background: bg, border: `1px solid ${color}30` }}
            >
              <Icon size={20} style={{ color }} />
              {count > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center"
                  style={{ background: color, color: "#0a0e1a" }}
                >
                  {count}
                </span>
              )}
            </div>
            <span className="text-[10px] text-[rgba(255,255,255,0.6)] font-medium">{label}</span>
          </button>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map(({ label, value, sub, icon: Icon, color }) => (
          <div key={label} className="glass rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <Icon size={16} style={{ color }} />
              <span className="text-xs text-[rgba(255,255,255,0.3)]">↗</span>
            </div>
            <div className="font-orbitron font-bold text-xl text-white">{value}</div>
            <div className="text-sm font-medium mt-0.5" style={{ color }}>{label}</div>
            <div className="text-[11px] text-[rgba(255,255,255,0.3)] mt-0.5">{sub}</div>
          </div>
        ))}
      </div>

      {/* Recent Emails */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-semibold text-sm">Recent Emails</h3>
          <button onClick={() => navigate("/inbox")} className="text-[#00d4ff] text-xs hover:underline">View All</button>
        </div>
        <div className="space-y-2">
          {recentEmails.map((email) => (
            <button
              key={email.id}
              onClick={() => navigate("/inbox")}
              className="w-full glass rounded-2xl p-4 text-left hover:glass-strong transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[rgba(0,212,255,0.1)] flex items-center justify-center shrink-0">
                  <Mail size={14} className="text-[#00d4ff]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-sm font-medium truncate ${!email.read ? "text-white" : "text-[rgba(255,255,255,0.6)]"}`}>
                      {email.fromName}
                    </span>
                    <span className="text-[10px] text-[rgba(255,255,255,0.3)] shrink-0">{formatTimeAgo(email.timestamp)}</span>
                  </div>
                  <p className={`text-xs truncate mt-0.5 ${!email.read ? "text-[rgba(255,255,255,0.7)]" : "text-[rgba(255,255,255,0.4)]"}`}>
                    {email.subject}
                  </p>
                  {!email.read && <span className="inline-block w-2 h-2 rounded-full bg-[#00d4ff] mt-1" />}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Feature Status */}
      <div>
        <h3 className="text-white font-semibold text-sm mb-3">Platform Status</h3>
        <div className="glass rounded-2xl p-4 space-y-2">
          {Object.entries(featureFlags).map(([key, enabled]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm text-[rgba(255,255,255,0.6)] capitalize">{key}</span>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${enabled ? "bg-[rgba(34,197,94,0.1)] text-[#22c55e]" : "bg-[rgba(255,255,255,0.05)] text-[rgba(255,255,255,0.3)]"}`}
              >
                {enabled ? "● Active" : "○ Inactive"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
