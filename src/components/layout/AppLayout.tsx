import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { isAuthenticated, updateLastActivity } from "@/lib/auth";
import { useAppStore } from "@/stores/appStore";
import AnimatedBackground from "./AnimatedBackground";
import MarqueeStrips from "./MarqueeStrips";
import TopHeader from "./TopHeader";
import BottomNav from "./BottomNav";
import StarSidebar from "./StarSidebar";
import FABMenu from "./FABMenu";
import BackgroundManager from "@/components/features/BackgroundManager";

export default function AppLayout() {
  const navigate = useNavigate();
  const { setUser } = useAppStore();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
    }

    // Session timeout watcher
    const interval = setInterval(() => {
      if (!isAuthenticated()) {
        setUser(null);
        navigate("/login");
      } else {
        updateLastActivity();
      }
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      <MarqueeStrips />
      <TopHeader />
      <StarSidebar side="left" />
      <StarSidebar side="right" />

      {/* Main Content */}
      <main className="pt-[80px] pb-[80px] px-4 max-w-2xl mx-auto">
        <Outlet />
      </main>

      <BottomNav />
      <FABMenu />
      <BackgroundManager />
    </div>
  );
}
