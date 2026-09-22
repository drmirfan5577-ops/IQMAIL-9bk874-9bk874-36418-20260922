import { useState } from "react";
import { X, Palette, Sliders } from "lucide-react";
import { useAppStore } from "@/stores/appStore";
import { BACKGROUND_THEMES } from "@/constants";
import { cn } from "@/lib/utils";

const TINT_COLORS = ["#00d4ff", "#a855f7", "#ff0080", "#f59e0b", "#22c55e", "#ef4444"];

export default function BackgroundManager() {
  const [activeTab, setActiveTab] = useState<"themes" | "filters">("themes");
  const { isBgManagerOpen, setBgManagerOpen, backgroundTheme, setBackgroundTheme, visualFilters, setVisualFilters } = useAppStore();

  if (!isBgManagerOpen) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[rgba(0,0,0,0.5)] backdrop-blur-sm" onClick={() => setBgManagerOpen(false)} />
      <div className="relative z-10 w-full max-w-sm glass-strong rounded-3xl p-6 border border-[rgba(0,212,255,0.2)]">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Palette size={18} className="text-[#00d4ff]" />
            <h3 className="font-orbitron text-white font-bold">Background Manager</h3>
          </div>
          <button
            onClick={() => setBgManagerOpen(false)}
            className="w-8 h-8 rounded-xl glass flex items-center justify-center text-[rgba(255,255,255,0.5)] hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5 glass rounded-xl p-1">
          {(["themes", "filters"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-all",
                activeTab === tab
                  ? "bg-[#00d4ff] text-navy-900"
                  : "text-[rgba(255,255,255,0.5)] hover:text-white"
              )}
            >
              {tab === "themes" ? "Themes" : "Visual Filters"}
            </button>
          ))}
        </div>

        {/* Themes Tab */}
        {activeTab === "themes" && (
          <div className="grid grid-cols-4 gap-2">
            {BACKGROUND_THEMES.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setBackgroundTheme(theme)}
                className={cn(
                  "aspect-square rounded-xl border-2 transition-all relative overflow-hidden",
                  backgroundTheme.id === theme.id
                    ? "border-[#00d4ff] neon-glow scale-105"
                    : "border-transparent hover:border-[rgba(0,212,255,0.4)]"
                )}
                style={{ background: theme.preview }}
                title={theme.name}
              >
                {theme.type === "animated" && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[8px] text-white opacity-70">✦</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Filters Tab */}
        {activeTab === "filters" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[rgba(255,255,255,0.7)]">⚙ Enable Filters</span>
              <button
                onClick={() => setVisualFilters({ enabled: !visualFilters.enabled })}
                className={cn(
                  "w-12 h-6 rounded-full transition-all relative",
                  visualFilters.enabled ? "bg-[#00d4ff]" : "bg-[rgba(255,255,255,0.2)]"
                )}
              >
                <span
                  className={cn(
                    "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
                    visualFilters.enabled ? "left-7" : "left-1"
                  )}
                />
              </button>
            </div>

            {[
              { key: "glassIntensity" as const, label: "Glass Intensity", max: 100 },
              { key: "blurLevel" as const, label: "Blur Level", max: 50 },
              { key: "tintOpacity" as const, label: "Tint Opacity", max: 100 },
              { key: "neonGlow" as const, label: "Neon Glow", max: 100 },
            ].map(({ key, label, max }) => (
              <div key={key}>
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-[rgba(255,255,255,0.6)]">{label}</span>
                  <span className="text-xs text-[#00d4ff] font-bold">{visualFilters[key]}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={max}
                  value={visualFilters[key]}
                  onChange={(e) => setVisualFilters({ [key]: parseInt(e.target.value) })}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{ accentColor: "#00d4ff" }}
                />
              </div>
            ))}

            {/* Color Tint */}
            <div>
              <span className="text-xs text-[rgba(255,255,255,0.6)] block mb-2">Color Tint</span>
              <div className="flex gap-2 flex-wrap">
                {TINT_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setVisualFilters({ colorTint: color })}
                    className={cn(
                      "w-8 h-8 rounded-full border-2 transition-all",
                      visualFilters.colorTint === color ? "border-white scale-110" : "border-transparent"
                    )}
                    style={{ background: color }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
