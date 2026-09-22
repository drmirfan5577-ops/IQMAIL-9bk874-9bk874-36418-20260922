import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/stores/appStore";
import { Mail, LayoutDashboard, FileText, Bell, User, Settings, Shield, BarChart2, Plug, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const leftItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Mail, label: "Inbox", path: "/inbox" },
  { icon: FileText, label: "Drafts", path: "/drafts" },
  { icon: Bell, label: "Notifications", path: "/notifications" },
  { icon: BarChart2, label: "Analytics", path: "/analytics" },
];

const rightItems = [
  { icon: User, label: "Profile", path: "/profile" },
  { icon: Settings, label: "Settings", path: "/profile" },
  { icon: Plug, label: "Integrations", path: "/integrations" },
  { icon: Shield, label: "Security", path: "/profile" },
];

interface SidebarProps {
  side: "left" | "right";
}

export default function StarSidebar({ side }: SidebarProps) {
  const { leftSidebarOpen, rightSidebarOpen, setLeftSidebarOpen, setRightSidebarOpen } = useAppStore();
  const navigate = useNavigate();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isOpen = side === "left" ? leftSidebarOpen : rightSidebarOpen;
  const setOpen = side === "left" ? setLeftSidebarOpen : setRightSidebarOpen;
  const items = side === "left" ? leftItems : rightItems;

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setOpen(false), 5000);
  };

  useEffect(() => {
    if (isOpen) resetTimer();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isOpen]);

  const handleNav = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <>
      {/* Star trigger button */}
      <button
        onClick={() => { setOpen(!isOpen); }}
        className={cn(
          "fixed top-1/2 -translate-y-1/2 z-50 w-8 h-12 glass-strong flex items-center justify-center transition-all duration-300",
          side === "left" ? "left-0 rounded-r-xl" : "right-0 rounded-l-xl",
          isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        )}
        aria-label={`${side} sidebar trigger`}
      >
        <Star size={14} className="text-[#00d4ff]" fill="rgba(0,212,255,0.3)" />
      </button>

      {/* Sidebar panel */}
      <div
        className={cn(
          "fixed top-1/2 -translate-y-1/2 z-50 glass-strong rounded-2xl p-3 transition-all duration-300 flex flex-col gap-2",
          side === "left" ? "left-2" : "right-2",
          isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        )}
        onMouseMove={resetTimer}
        style={{ width: 160 }}
      >
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-[rgba(255,255,255,0.4)] uppercase tracking-widest font-medium">
            {side === "left" ? "Navigate" : "Account"}
          </span>
          <button onClick={() => setOpen(false)} className="text-[rgba(255,255,255,0.3)] hover:text-white text-xs">✕</button>
        </div>
        {items.map(({ icon: Icon, label, path }) => (
          <button
            key={path + label}
            onClick={() => handleNav(path)}
            className="flex items-center gap-3 p-2 rounded-xl hover:glass transition-all text-left group"
          >
            <div className="w-8 h-8 rounded-lg glass flex items-center justify-center group-hover:neon-glow transition-all">
              <Icon size={14} className="text-[#00d4ff]" />
            </div>
            <span className="text-sm text-[rgba(255,255,255,0.8)] group-hover:text-white font-medium">{label}</span>
          </button>
        ))}
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
