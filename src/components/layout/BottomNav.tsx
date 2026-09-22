import { useNavigate, useLocation } from "react-router-dom";
import { Mail, LayoutDashboard, BarChart2, Plug, Settings, Plus, AlignJustify } from "lucide-react";
import { useAppStore } from "@/stores/appStore";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Mail, label: "Inbox", path: "/inbox", color: "#00d4ff" },
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard", color: "#a855f7" },
  { icon: BarChart2, label: "Analytics", path: "/analytics", color: "#f59e0b" },
  { icon: Plug, label: "Integrations", path: "/integrations", color: "#22c55e" },
  { icon: Settings, label: "Settings", path: "/profile", color: "#94a3b8" },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setFabOpen } = useAppStore();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 glass-dark border-t border-[rgba(0,212,255,0.1)] px-2 py-2">
      <div className="flex items-center justify-around max-w-2xl mx-auto">
        {navItems.map(({ icon: Icon, label, path, color }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 min-w-[56px]",
                isActive ? "glass-strong" : "hover:glass"
              )}
              aria-label={label}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                  isActive ? "neon-glow" : ""
                )}
                style={{
                  background: isActive ? color : "transparent",
                  color: isActive ? "#0a0e1a" : color,
                }}
              >
                <Icon size={20} />
              </div>
              <span
                className="text-[10px] font-medium"
                style={{ color: isActive ? color : "rgba(255,255,255,0.5)" }}
              >
                {label}
              </span>
            </button>
          );
        })}
        {/* Extra slot */}
        <button
          onClick={() => setFabOpen(true)}
          className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl hover:glass transition-all duration-200"
          aria-label="More"
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ color: "#64748b" }}>
            <AlignJustify size={20} />
          </div>
          <span className="text-[10px] font-medium text-[rgba(255,255,255,0.5)]">More</span>
        </button>
      </div>
    </nav>
  );
}
