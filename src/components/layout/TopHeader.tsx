import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, LogOut, Settings, Palette, User } from "lucide-react";
import { getGregorianDate, getHijriDate } from "@/lib/utils";
import { mockLogout } from "@/lib/auth";
import { useAppStore } from "@/stores/appStore";
import { toast } from "sonner";

export default function TopHeader() {
  const [time, setTime] = useState(new Date());
  const navigate = useNavigate();
  const { user, setUser, notifications, setBgManagerOpen } = useAppStore();
  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    mockLogout();
    setUser(null);
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const timeStr = time.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  return (
    <header className="fixed top-[40px] left-0 right-0 z-40 glass-dark border-b border-[rgba(0,212,255,0.1)]">
      <div className="flex items-center justify-between px-4 py-2">
        {/* Left: Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/dashboard")}
        >
          <div className="w-8 h-8 rounded-lg bg-[#00d4ff] flex items-center justify-center neon-glow">
            <span className="text-navy-900 font-bold text-sm">✉</span>
          </div>
          <span className="font-orbitron font-bold text-[#00d4ff] text-lg tracking-wider neon-text">
            IQMAIL
          </span>
        </div>

        {/* Center: Bismillah + Date/Time */}
        <div className="hidden md:flex flex-col items-center">
          <span className="text-[10px] text-[#c084fc] font-medium tracking-widest">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </span>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-[11px] text-[rgba(255,255,255,0.5)]">{getGregorianDate()}</span>
            <span className="text-[#00d4ff] text-xs">|</span>
            <span className="text-[11px] text-[rgba(255,255,255,0.5)]">{getHijriDate()}</span>
            <span className="text-[#00d4ff] text-xs">|</span>
            <span className="text-[11px] text-[#00d4ff] font-mono font-bold">{timeStr}</span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setBgManagerOpen(true)}
            className="w-9 h-9 rounded-lg glass flex items-center justify-center text-[rgba(255,255,255,0.6)] hover:text-[#00d4ff] transition-colors"
            aria-label="Background Manager"
          >
            <Palette size={16} />
          </button>
          <button
            onClick={() => navigate("/notifications")}
            className="relative w-9 h-9 rounded-lg glass flex items-center justify-center text-[rgba(255,255,255,0.6)] hover:text-[#00d4ff] transition-colors"
            aria-label="Notifications"
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#00d4ff] text-navy-900 text-[9px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="w-9 h-9 rounded-lg glass flex items-center justify-center text-[rgba(255,255,255,0.6)] hover:text-[#00d4ff] transition-colors"
            aria-label="Profile"
          >
            <User size={16} />
          </button>
          <button
            onClick={handleLogout}
            className="w-9 h-9 rounded-lg glass flex items-center justify-center text-[rgba(255,255,255,0.6)] hover:text-red-400 transition-colors"
            aria-label="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
