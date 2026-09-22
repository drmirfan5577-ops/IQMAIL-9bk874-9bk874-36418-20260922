import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Fingerprint, Shield, Mail, Lock, AlertTriangle, CheckCircle } from "lucide-react";
import { mockLogin, checkPasswordStrength, isAuthenticated, isLockedOut, getLockoutTimeRemaining, getFailedAttempts, MAX_FAILED_ATTEMPTS } from "@/lib/auth";
import { useAppStore } from "@/stores/appStore";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "otp" | "biometric">("login");
  const [email, setEmail] = useState("irfan@iqmail.online");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [lockoutTimer, setLockoutTimer] = useState(0);
  const { setUser } = useAppStore();
  const navigate = useNavigate();
  const strength = checkPasswordStrength(password);

  useEffect(() => {
    if (isAuthenticated()) navigate("/dashboard");
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isLockedOut()) {
      interval = setInterval(() => {
        const remaining = getLockoutTimeRemaining();
        setLockoutTimer(Math.ceil(remaining / 1000));
        if (remaining <= 0) clearInterval(interval);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const result = mockLogin(email, password);
    setLoading(false);

    if (result.success && result.user) {
      setUser(result.user);
      toast.success("Welcome back! Logged in successfully.");
      navigate("/dashboard");
    } else {
      toast.error(result.error || "Login failed");
    }
  };

  const handleOtpInput = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }
  };

  const handleOtpVerify = () => {
    const code = otp.join("");
    if (code === "123456") {
      toast.success("OTP Verified!");
      setMode("login");
    } else {
      toast.error("Invalid OTP. (Demo: use 123456)");
    }
  };

  const handleBiometric = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    toast.info("Biometric not enrolled. Use password instead.");
    setMode("login");
  };

  const failed = getFailedAttempts();
  const locked = isLockedOut();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, #00d4ff, transparent)" }} />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, #a855f7, transparent)" }} />

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8 animate-float">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-[#00d4ff] flex items-center justify-center neon-glow animate-pulse-ring">
              <Mail size={28} className="text-navy-900" />
            </div>
          </div>
          <h1 className="font-orbitron text-4xl font-black text-gradient mb-1">IQMAIL</h1>
          <p className="text-[rgba(255,255,255,0.5)] text-sm">Enterprise Digital Authentication Platform</p>
          <p className="text-[rgba(168,85,247,0.7)] text-xs mt-1">by ESOneWorld</p>
        </div>

        {/* Main Card */}
        <div className="glass-strong rounded-3xl p-8 neon-border">
          {/* Mode Tabs */}
          <div className="flex gap-2 mb-6 glass rounded-xl p-1">
            {[
              { key: "login", label: "Password", icon: Lock },
              { key: "otp", label: "OTP", icon: Shield },
              { key: "biometric", label: "Biometric", icon: Fingerprint },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setMode(key as typeof mode)}
                className={cn(
                  "flex-1 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all",
                  mode === key ? "bg-[#00d4ff] text-navy-900" : "text-[rgba(255,255,255,0.5)] hover:text-white"
                )}
              >
                <Icon size={13} />
                {label}
              </button>
            ))}
          </div>

          {/* Lockout Warning */}
          {locked && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] mb-4">
              <AlertTriangle size={16} className="text-red-400 shrink-0" />
              <span className="text-red-400 text-sm">Account locked for {Math.floor(lockoutTimer / 60)}:{String(lockoutTimer % 60).padStart(2, "0")}</span>
            </div>
          )}

          {/* Attempts Warning */}
          {failed > 0 && failed < MAX_FAILED_ATTEMPTS && !locked && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-[rgba(251,191,36,0.1)] border border-[rgba(251,191,36,0.2)] mb-4">
              <AlertTriangle size={16} className="text-yellow-400 shrink-0" />
              <span className="text-yellow-400 text-sm">{MAX_FAILED_ATTEMPTS - failed} attempt(s) remaining</span>
            </div>
          )}

          {/* Password Login */}
          {mode === "login" && (
            <div className="space-y-4">
              <div>
                <label className="text-xs text-[rgba(255,255,255,0.5)] mb-1.5 block font-medium" htmlFor="email">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.3)]" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full glass rounded-xl pl-9 pr-4 py-3 text-white text-sm focus:outline-none focus:border-[#00d4ff] border border-transparent transition-all placeholder-[rgba(255,255,255,0.2)]"
                    placeholder="your@email.com"
                    autoComplete="email"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-[rgba(255,255,255,0.5)] mb-1.5 block font-medium" htmlFor="password">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.3)]" />
                  <input
                    id="password"
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    className="w-full glass rounded-xl pl-9 pr-10 py-3 text-white text-sm focus:outline-none focus:border-[#00d4ff] border border-transparent transition-all placeholder-[rgba(255,255,255,0.2)]"
                    placeholder="Enter password"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.3)] hover:text-white transition-colors"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {/* Password Strength */}
                {password.length > 0 && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className="h-1 flex-1 rounded-full transition-all"
                          style={{
                            background: i <= strength.score ? strength.color : "rgba(255,255,255,0.1)",
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-[11px]" style={{ color: strength.color }}>{strength.label}</span>
                  </div>
                )}
              </div>
              <button
                onClick={handleLogin}
                disabled={loading || locked}
                className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-navy-900 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Shield size={18} />
                    Secure Sign In
                  </>
                )}
              </button>
              <p className="text-center text-[11px] text-[rgba(255,255,255,0.3)]">
                Demo: any email + 6+ char password
              </p>
            </div>
          )}

          {/* OTP */}
          {mode === "otp" && (
            <div className="space-y-5">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full glass mx-auto mb-3 flex items-center justify-center">
                  <Shield size={28} className="text-[#00d4ff]" />
                </div>
                <p className="text-[rgba(255,255,255,0.6)] text-sm">Enter the 6-digit OTP sent to your email</p>
                <p className="text-[#00d4ff] text-xs mt-1">Demo OTP: 123456</p>
              </div>
              <div className="flex gap-2 justify-center">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpInput(e.target.value, i)}
                    className="w-11 h-12 glass rounded-xl text-center text-white font-bold text-lg focus:outline-none focus:border-[#00d4ff] border border-transparent transition-all"
                  />
                ))}
              </div>
              <button onClick={handleOtpVerify} className="w-full btn-primary">
                Verify OTP
              </button>
            </div>
          )}

          {/* Biometric */}
          {mode === "biometric" && (
            <div className="text-center space-y-5">
              <button
                onClick={handleBiometric}
                disabled={loading}
                className="w-32 h-32 rounded-full glass mx-auto flex items-center justify-center border-2 border-[rgba(0,212,255,0.3)] hover:border-[#00d4ff] transition-all group animate-pulse-ring disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-10 h-10 border-2 border-[#00d4ff] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Fingerprint size={56} className="text-[#00d4ff] group-hover:scale-110 transition-transform" />
                )}
              </button>
              <div>
                <p className="text-white font-medium">Touch to Authenticate</p>
                <p className="text-[rgba(255,255,255,0.4)] text-sm mt-1">Use your fingerprint or Face ID</p>
              </div>
              <button onClick={handleBiometric} className="w-full btn-primary">
                {loading ? "Scanning..." : "Scan Biometric"}
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-[11px] text-[rgba(255,255,255,0.2)] mt-6">
          © 2026 IQMAIL · ESOneWorld Digital Solutions · All rights reserved
        </p>
      </div>
    </div>
  );
}
