import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import AppLayout from "@/components/layout/AppLayout";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import InboxPage from "@/pages/InboxPage";
import DraftsPage from "@/pages/DraftsPage";
import NotificationsPage from "@/pages/NotificationsPage";
import ProfilePage from "@/pages/ProfilePage";
import AnalyticsPage from "@/pages/AnalyticsPage";
import IntegrationsPage from "@/pages/IntegrationsPage";
import AdminPage from "@/pages/AdminPage";
import NotFound from "@/pages/NotFound";
import AnimatedBackground from "@/components/layout/AnimatedBackground";
import MarqueeStrips from "@/components/layout/MarqueeStrips";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "rgba(13, 18, 38, 0.95)",
            border: "1px solid rgba(0,212,255,0.2)",
            color: "#ffffff",
            fontFamily: "Inter, sans-serif",
            fontSize: "13px",
            backdropFilter: "blur(20px)",
          },
        }}
      />
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <div className="relative min-h-screen">
              <AnimatedBackground />
              <MarqueeStrips />
              <div className="pt-[40px]">
                <LoginPage />
              </div>
            </div>
          }
        />

        {/* Secret Admin Route */}
        <Route
          path="/secret-admin"
          element={
            <div className="relative min-h-screen">
              <AnimatedBackground />
              <AdminPage />
            </div>
          }
        />

        {/* Protected App Routes */}
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="inbox" element={<InboxPage />} />
          <Route path="drafts" element={<DraftsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="integrations" element={<IntegrationsPage />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
