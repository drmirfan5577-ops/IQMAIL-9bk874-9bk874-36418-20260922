import { useState } from "react";
import { Plug, Plus, Check, RefreshCw, Key, AlertCircle } from "lucide-react";
import { INTEGRATIONS } from "@/constants";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { Integration } from "@/types";

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>(INTEGRATIONS);
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [showKeyFor, setShowKeyFor] = useState<string | null>(null);
  const [connecting, setConnecting] = useState<string | null>(null);

  const connect = async (id: string) => {
    setConnecting(id);
    await new Promise((r) => setTimeout(r, 1200));
    setIntegrations((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: "connected" } : i))
    );
    setConnecting(null);
    setShowKeyFor(null);
    toast.success("Integration connected! (Demo mode)");
  };

  const disconnect = (id: string) => {
    setIntegrations((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: "disconnected" } : i))
    );
    toast.info("Integration disconnected");
  };

  const connected = integrations.filter((i) => i.status === "connected").length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white font-bold font-orbitron text-lg">Integration Vault</h2>
          <p className="text-[rgba(255,255,255,0.4)] text-xs">{connected}/{integrations.length} connected</p>
        </div>
      </div>

      {/* Resend Priority Banner */}
      <div className="glass-strong rounded-2xl p-4 border border-[rgba(255,107,53,0.3)]">
        <div className="flex items-start gap-3">
          <span className="text-2xl shrink-0">📧</span>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-white font-semibold text-sm">Resend API</h3>
              <span className="text-[10px] bg-[rgba(255,107,53,0.2)] text-[#ff6b35] px-2 py-0.5 rounded-full font-medium">Priority</span>
            </div>
            <p className="text-xs text-[rgba(255,255,255,0.4)] mt-1">Required for transactional emails (Welcome, OTP, Reset)</p>
            <button
              onClick={() => setShowKeyFor("int_resend")}
              className="mt-3 flex items-center gap-1.5 text-xs text-[#ff6b35] hover:underline"
            >
              <Key size={11} /> Configure API Key
            </button>
          </div>
        </div>
      </div>

      {/* API Key Input Modal */}
      {showKeyFor && (
        <div className="glass-strong rounded-2xl p-4 border border-[rgba(0,212,255,0.2)]">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-white text-sm font-semibold">
              Configure {integrations.find((i) => i.id === showKeyFor)?.name} API Key
            </h4>
            <button onClick={() => setShowKeyFor(null)} className="text-[rgba(255,255,255,0.3)] text-xs">✕</button>
          </div>
          <div className="flex gap-2">
            <input
              type="password"
              placeholder="Paste your API key here..."
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              className="flex-1 glass rounded-xl px-3 py-2.5 text-sm text-white placeholder-[rgba(255,255,255,0.2)] focus:outline-none"
            />
            <button
              onClick={() => connect(showKeyFor)}
              disabled={connecting === showKeyFor}
              className="btn-primary text-sm py-2 px-4 disabled:opacity-50"
            >
              {connecting === showKeyFor ? (
                <RefreshCw size={14} className="animate-spin" />
              ) : (
                "Connect"
              )}
            </button>
          </div>
          <p className="text-[11px] text-[rgba(255,255,255,0.3)] mt-2 flex items-center gap-1">
            <AlertCircle size={10} /> Keys are stored securely in your browser (demo)
          </p>
        </div>
      )}

      {/* Integration Grid */}
      <div className="grid grid-cols-2 gap-3">
        {integrations.map((integ) => (
          <div
            key={integ.id}
            className={cn(
              "glass rounded-2xl p-4 transition-all",
              integ.status === "connected" ? "border border-[rgba(34,197,94,0.2)]" : ""
            )}
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                style={{ background: `${integ.color}20`, border: `1px solid ${integ.color}30` }}
              >
                {integ.icon}
              </div>
              {integ.status === "connected" && (
                <span className="w-5 h-5 rounded-full bg-[#22c55e] flex items-center justify-center">
                  <Check size={10} className="text-white" />
                </span>
              )}
            </div>
            <p className="text-sm text-white font-semibold">{integ.name}</p>
            <p className="text-[11px] text-[rgba(255,255,255,0.4)] mt-0.5 line-clamp-2">{integ.description}</p>
            <div className="mt-3">
              {integ.status === "connected" ? (
                <button
                  onClick={() => disconnect(integ.id)}
                  className="text-[11px] text-red-400 hover:underline"
                >
                  Disconnect
                </button>
              ) : (
                <button
                  onClick={() => setShowKeyFor(integ.id)}
                  className="text-[11px] text-[#00d4ff] hover:underline flex items-center gap-1"
                >
                  <Plug size={10} /> Connect
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Add More Slot */}
        <button
          onClick={() => toast.info("Custom integration coming soon")}
          className="glass rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:glass-strong transition-all border-2 border-dashed border-[rgba(255,255,255,0.1)]"
        >
          <div className="w-10 h-10 rounded-xl glass flex items-center justify-center">
            <Plus size={18} className="text-[rgba(255,255,255,0.4)]" />
          </div>
          <span className="text-xs text-[rgba(255,255,255,0.3)] text-center">Add Integration</span>
        </button>
      </div>
    </div>
  );
}
