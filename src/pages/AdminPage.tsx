import { useState, useEffect } from "react";
import { Shield, Users, Zap, ToggleLeft, ToggleRight, Ban, CheckCircle, Trash2, Eye, EyeOff, Lock, Crown } from "lucide-react";
import { useAppStore } from "@/stores/appStore";
import { ADMIN_SECRET_PASSWORD } from "@/constants";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const MOCK_USERS = [
  { id: "usr_1789", name: "Dr. Irfan", email: "irfan@iqmail.online", status: "active", role: "admin", verified: true },
  { id: "usr_2001", name: "Ali Hassan", email: "ali@iqmail.online", status: "active", role: "user", verified: true },
  { id: "usr_2002", name: "Sara Ahmed", email: "sara@iqmail.online", status: "suspended", role: "user", verified: false },
  { id: "usr_2003", name: "Umar Khan", email: "umar@iqmail.online", status: "active", role: "user", verified: true },
  { id: "usr_2004", name: "Fatima Malik", email: "fatima@iqmail.online", status: "banned", role: "user", verified: false },
];

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [tab, setTab] = useState<"users" | "features" | "security" | "integrations">("users");
  const [users, setUsers] = useState(MOCK_USERS);
  const { featureFlags, toggleFeatureFlag } = useAppStore();

  useEffect(() => {
    document.title = "IQMAIL Admin — Restricted Access";
    return () => { document.title = "IQMAIL"; };
  }, []);

  const handleAdminAuth = () => {
    if (password === ADMIN_SECRET_PASSWORD) {
      setAuthenticated(true);
      toast.success("Admin access granted");
    } else {
      toast.error("Invalid admin password");
    }
  };

  const updateUserStatus = (id: string, status: string) => {
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, status } : u));
    toast.success(`User ${status}`);
  };

  const deleteUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    toast.success("User deleted");
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-sm glass-strong rounded-3xl p-8 neon-border">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-[rgba(168,85,247,0.2)] border border-[rgba(168,85,247,0.3)] flex items-center justify-center mx-auto mb-4">
              <Crown size={32} className="text-[#a855f7]" />
            </div>
            <h1 className="font-orbitron text-[#a855f7] font-bold text-xl">ADMIN PANEL</h1>
            <p className="text-[rgba(255,255,255,0.4)] text-xs mt-1">Restricted — Authorized Personnel Only</p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-[rgba(255,255,255,0.4)] mb-1.5 block">Admin Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.3)]" />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAdminAuth()}
                  placeholder="Enter admin password"
                  className="w-full glass rounded-xl pl-9 pr-10 py-3 text-white text-sm focus:outline-none placeholder-[rgba(255,255,255,0.2)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.3)]"
                >
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
            <button
              onClick={handleAdminAuth}
              className="w-full py-3 rounded-xl font-bold text-white transition-all"
              style={{ background: "linear-gradient(135deg, #a855f7, #7c3aed)" }}
            >
              Access Admin Panel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pt-2">
      {/* Admin Header */}
      <div className="glass-strong rounded-2xl p-4 border border-[rgba(168,85,247,0.3)] flex items-center gap-3">
        <Crown size={20} className="text-[#a855f7]" />
        <div>
          <p className="text-[#a855f7] font-bold font-orbitron text-sm">GOD MODE ADMIN</p>
          <p className="text-[rgba(255,255,255,0.4)] text-xs">Full command & control authority active</p>
        </div>
        <div className="ml-auto w-2 h-2 rounded-full bg-[#a855f7] animate-pulse" />
      </div>

      {/* Admin Tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {(["users", "features", "security", "integrations"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all shrink-0 capitalize",
              tab === t ? "bg-[#a855f7] text-white" : "glass text-[rgba(255,255,255,0.5)] hover:text-white"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Users Tab */}
      {tab === "users" && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-semibold text-sm">User Management ({users.length})</h3>
          </div>
          {users.map((u) => (
            <div key={u.id} className="glass rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[rgba(168,85,247,0.1)] flex items-center justify-center text-[#a855f7] font-bold shrink-0">
                  {u.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-white font-medium">{u.name}</span>
                    <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full",
                      u.status === "active" ? "bg-[rgba(34,197,94,0.15)] text-[#22c55e]" :
                      u.status === "suspended" ? "bg-[rgba(245,158,11,0.15)] text-[#f59e0b]" :
                      "bg-[rgba(239,68,68,0.15)] text-red-400"
                    )}>● {u.status}</span>
                  </div>
                  <p className="text-xs text-[rgba(255,255,255,0.4)]">{u.email} · {u.id}</p>
                  <p className="text-[10px] text-[rgba(255,255,255,0.3)] mt-0.5 capitalize">{u.role} · {u.verified ? "✓ Verified" : "✗ Unverified"}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-3 flex-wrap">
                {u.status !== "active" && (
                  <button onClick={() => updateUserStatus(u.id, "active")} className="text-[11px] glass px-2 py-1 rounded-lg text-[#22c55e] flex items-center gap-1">
                    <CheckCircle size={10} /> Activate
                  </button>
                )}
                {u.status !== "suspended" && (
                  <button onClick={() => updateUserStatus(u.id, "suspended")} className="text-[11px] glass px-2 py-1 rounded-lg text-[#f59e0b]">
                    Suspend
                  </button>
                )}
                {u.status !== "banned" && (
                  <button onClick={() => updateUserStatus(u.id, "banned")} className="text-[11px] glass px-2 py-1 rounded-lg text-red-400 flex items-center gap-1">
                    <Ban size={10} /> Ban
                  </button>
                )}
                {u.role !== "admin" && (
                  <button onClick={() => deleteUser(u.id)} className="text-[11px] glass px-2 py-1 rounded-lg text-red-400 flex items-center gap-1 ml-auto">
                    <Trash2 size={10} /> Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Feature Flags */}
      {tab === "features" && (
        <div className="space-y-2">
          <h3 className="text-white font-semibold text-sm">Global Feature Flags</h3>
          <div className="glass rounded-2xl overflow-hidden">
            {Object.entries(featureFlags).map(([key, enabled], i, arr) => (
              <div
                key={key}
                className={cn("flex items-center justify-between p-4",
                  i < arr.length - 1 ? "border-b border-[rgba(255,255,255,0.05)]" : ""
                )}
              >
                <div>
                  <p className="text-sm text-white font-medium capitalize">{key}</p>
                  <p className="text-xs text-[rgba(255,255,255,0.3)]">{enabled ? "Active for all users" : "Disabled globally"}</p>
                </div>
                <button
                  onClick={() => { toggleFeatureFlag(key); toast.success(`${key} ${!enabled ? "enabled" : "disabled"}`); }}
                  className="text-[#a855f7]"
                >
                  {enabled ? <ToggleRight size={28} /> : <ToggleLeft size={28} className="text-[rgba(255,255,255,0.2)]" />}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Security */}
      {tab === "security" && (
        <div className="space-y-3">
          <h3 className="text-white font-semibold text-sm">Security Overview</h3>
          {[
            { label: "Brute Force Protection", status: "Active", icon: Shield, detail: "Lock after 5 failed attempts" },
            { label: "Session Timeout", status: "15 min", icon: Zap, detail: "Auto-logout on inactivity" },
            { label: "JWT Rotation", status: "Enabled", icon: Shield, detail: "Tokens refresh every login" },
            { label: "Device Fingerprinting", status: "Active", icon: Shield, detail: "Track & flag new devices" },
          ].map(({ label, status, icon: Icon, detail }) => (
            <div key={label} className="glass rounded-2xl p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[rgba(168,85,247,0.1)] flex items-center justify-center">
                <Icon size={16} className="text-[#a855f7]" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-white font-medium">{label}</p>
                <p className="text-xs text-[rgba(255,255,255,0.4)]">{detail}</p>
              </div>
              <span className="text-xs text-[#22c55e] glass px-2 py-0.5 rounded-lg">● {status}</span>
            </div>
          ))}
        </div>
      )}

      {/* Integrations Admin */}
      {tab === "integrations" && (
        <div className="space-y-3">
          <h3 className="text-white font-semibold text-sm">Integration Vault — Admin</h3>
          <div className="glass rounded-2xl p-4 space-y-3">
            {["Resend API Key", "Cloudflare API Token", "Google OAuth Secret", "Stripe Secret Key"].map((key) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm text-[rgba(255,255,255,0.7)]">{key}</span>
                <span className="text-xs glass px-2 py-0.5 rounded-lg text-[rgba(255,255,255,0.3)]">Not configured</span>
              </div>
            ))}
          </div>
          <div className="glass rounded-2xl p-4 border border-[rgba(255,107,53,0.2)]">
            <p className="text-xs text-[rgba(255,255,255,0.5)]">
              ⚠️ API keys entered here are stored locally (demo). In production, use OnSpace Cloud Secrets Vault.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
