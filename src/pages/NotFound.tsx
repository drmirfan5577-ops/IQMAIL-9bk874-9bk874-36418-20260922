import { useNavigate } from "react-router-dom";
import { Home, Mail } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <div className="text-8xl font-orbitron font-black text-gradient mb-4">404</div>
        <p className="text-white font-semibold text-xl mb-2">Page Not Found</p>
        <p className="text-[rgba(255,255,255,0.4)] text-sm mb-8">This route doesn't exist in the IQMAIL universe.</p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => navigate("/dashboard")} className="btn-primary flex items-center gap-2">
            <Home size={16} /> Dashboard
          </button>
          <button onClick={() => navigate("/inbox")} className="btn-secondary flex items-center gap-2">
            <Mail size={16} /> Inbox
          </button>
        </div>
      </div>
    </div>
  );
}
