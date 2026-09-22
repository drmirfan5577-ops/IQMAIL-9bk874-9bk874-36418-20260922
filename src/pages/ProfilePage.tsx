import { useState } from "react";
import { User, Shield, Key, Fingerprint, Bell, Moon, Globe, ChevronRight, Camera, Edit3, LogOut } from "lucide-react";
import { useAppStore } from "@/stores/appStore";
import { mockLogout } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { getInitials } from "@/lib/utils";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const { user, setUser } = useAppStore();
  const navigate = useNavigate();
  const [editName, setEditName] = useState(false);
  const [nameInput, setNameInput] = useState(user?.name || "");

  const handleLogout = () => {
    mockLogout();
    setUser(null);
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const saveName = () => {
    if (user && nameInput.trim()) {
      setUser({ ...user, name: nameInput.trim() });
      toast.success("Name updated");
      setEditName(false);
    }
  };

  const settingSections = [
    {
      title: "Security",
      items: [
        { icon: Key, label: "Change Password", sub: "Last changed: Never", action: () => toast.info("Password change coming soon"), color: "#00d4ff" },
        { icon: Shield, label: "Two-Factor Auth", sub: user?.twoFAEnabled ? "Enabled via Email OTP" : "Not enabled", action: () => toast.info("2FA settings"), color: "#22c55e" },
        { icon: Fingerprint, label: "Biometric Login", sub: user?.biometricEnabled ? "Enabled" : "Not enrolled", action: () => toast.info("Enroll biometric"), color: "#a855f7" },
      ],
    },
    {
      title: "Preferences",
      items: [
        { icon: Bell, label: "Notifications", sub: "Email, Push alerts", action: () => navigate("/notifications"), color: "#f59e0b" },
        { icon: Moon, label: "Appearance", sub: "Dark mode (Glassmorphism)", action: () => toast.info("Appearance settings"), color: "#64748b" },
        { icon: Globe, label: "Language & Region", sub: "English (US)", action: () => toast.info("Language settings"), color: "#06b6d4" },
      ],
    },
  ];

  return (
    <div className="space-y-5">
      {/* Profile Card */}
      <div className="glass-strong rounded-3xl p-6 neon-border relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-5"
          style={{ background: "radial-gradient(circle, #a855f7, transparent)", transform: "translate(25%, -25%)" }} />
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#00d4ff] to-[#0066ff] flex items-center justify-center neon-glow">
              <span className="font-orbitron font-black text-navy-900 text-2xl">{getInitials(user?.name || "U")}</span>
            </div>
            <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl bg-[#00d4ff] flex items-center justify-center text-navy-900">
              <Camera size={12} />
            </button>
          </div>
          <div className="flex-1">
            {editName ? (
              <div className="flex gap-2">
                <input
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="glass rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none flex-1"
                  onKeyDown={(e) => e.key === "Enter" && saveName()}
                />
                <button onClick={saveName} className="btn-primary text-xs py-1.5 px-3">Save</button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h2 className="text-white font-bold text-xl">{user?.name}</h2>
                <button onClick={() => setEditName(true)} className="text-[rgba(255,255,255,0.3)] hover:text-[#00d4ff] transition-colors">
                  <Edit3 size={13} />
                </button>
              </div>
            )}
            <p className="text-[rgba(255,255,255,0.5)] text-sm">{user?.email}</p>
            <div className="flex gap-2 mt-2 flex-wrap">
              <span className="text-[10px] glass px-2 py-0.5 rounded-lg text-[#22c55e]">● Verified</span>
              <span className="text-[10px] glass px-2 py-0.5 rounded-lg text-[#00d4ff]">ID: {user?.id}</span>
              <span className="text-[10px] glass px-2 py-0.5 rounded-lg text-[rgba(255,255,255,0.4)] capitalize">{user?.role}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Sections */}
      {settingSections.map((section) => (
        <div key={section.title}>
          <h3 className="text-[rgba(255,255,255,0.4)] text-xs font-medium uppercase tracking-widest mb-2 px-1">{section.title}</h3>
          <div className="glass rounded-2xl overflow-hidden">
            {section.items.map(({ icon: Icon, label, sub, action, color }, i) => (
              <button
                key={label}
                onClick={action}
                className={cn(
                  "w-full flex items-center gap-3 p-4 text-left hover:glass-strong transition-all",
                  i < section.items.length - 1 ? "border-b border-[rgba(255,255,255,0.05)]" : ""
                )}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
                  <Icon size={16} style={{ color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium">{label}</p>
                  <p className="text-xs text-[rgba(255,255,255,0.4)] mt-0.5">{sub}</p>
                </div>
                <ChevronRight size={14} className="text-[rgba(255,255,255,0.2)] shrink-0" />
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Danger Zone */}
      <div>
        <h3 className="text-[rgba(255,255,255,0.4)] text-xs font-medium uppercase tracking-widest mb-2 px-1">Account</h3>
        <div className="glass rounded-2xl overflow-hidden">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-4 text-left hover:glass-strong transition-all"
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)]">
              <LogOut size={16} className="text-red-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-red-400 font-medium">Sign Out</p>
              <p className="text-xs text-[rgba(255,255,255,0.3)]">Clear session & logout</p>
            </div>
          </button>
        </div>
      </div>

      {/* Version */}
      <div className="text-center py-4">
        <p className="text-[10px] text-[rgba(255,255,255,0.2)]">IQMAIL v1.0.0 · ESOneWorld · © 2026</p>
      </div>
    </div>
  );
}
