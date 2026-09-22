import { useAppStore } from "@/stores/appStore";
import { Undo2, Redo2, X, Plus, Edit3, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function FABMenu() {
  const { fabOpen, setFabOpen } = useAppStore();

  if (!fabOpen) return null;

  const actions = [
    { icon: Edit3, label: "Compose Email", color: "#00d4ff", action: () => toast.info("Compose coming soon") },
    { icon: Undo2, label: "Undo Last Action", color: "#a855f7", action: () => toast.info("Undo action") },
    { icon: Redo2, label: "Redo Last Action", color: "#22c55e", action: () => toast.info("Redo action") },
    { icon: Trash2, label: "Clear Selection", color: "#ef4444", action: () => toast.info("Cleared") },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center pb-24">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[rgba(0,0,0,0.6)] backdrop-blur-sm"
        onClick={() => setFabOpen(false)}
      />
      {/* FAB Panel - half screen overlay */}
      <div className="relative z-10 w-full max-w-md mx-4 glass-strong rounded-3xl p-6 border border-[rgba(0,212,255,0.2)]">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-orbitron text-[#00d4ff] font-bold text-lg">Quick Actions</h3>
          <button
            onClick={() => setFabOpen(false)}
            className="w-9 h-9 rounded-xl glass flex items-center justify-center text-[rgba(255,255,255,0.5)] hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {actions.map(({ icon: Icon, label, color, action }) => (
            <button
              key={label}
              onClick={() => { action(); setFabOpen(false); }}
              className="flex flex-col items-center gap-3 p-4 glass rounded-2xl hover:glass-strong transition-all group"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center transition-all group-hover:scale-110"
                style={{ background: `${color}20`, border: `1px solid ${color}40` }}
              >
                <Icon size={22} style={{ color }} />
              </div>
              <span className="text-sm text-[rgba(255,255,255,0.8)] font-medium text-center">{label}</span>
            </button>
          ))}
        </div>
        <button
          onClick={() => setFabOpen(false)}
          className="mt-4 w-full py-3 glass rounded-xl text-[rgba(255,255,255,0.5)] hover:text-white transition-colors text-sm font-medium"
        >
          Close
        </button>
      </div>
    </div>
  );
}
