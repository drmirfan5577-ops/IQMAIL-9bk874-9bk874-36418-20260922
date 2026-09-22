import { Bell, CheckCheck, Info, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { useAppStore } from "@/stores/appStore";
import { formatTimeAgo } from "@/lib/utils";
import { cn } from "@/lib/utils";

const typeConfig = {
  info: { icon: Info, color: "#00d4ff", bg: "rgba(0,212,255,0.1)" },
  success: { icon: CheckCircle, color: "#22c55e", bg: "rgba(34,197,94,0.1)" },
  warning: { icon: AlertTriangle, color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
  error: { icon: XCircle, color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
};

export default function NotificationsPage() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useAppStore();
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white font-bold font-orbitron text-lg">Notifications</h2>
          <p className="text-[rgba(255,255,255,0.4)] text-xs">{unreadCount} unread · {notifications.length} total</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllNotificationsRead}
            className="flex items-center gap-1.5 text-[#00d4ff] text-xs hover:underline"
          >
            <CheckCheck size={13} /> Mark all read
          </button>
        )}
      </div>

      {/* Notification List */}
      {notifications.length === 0 ? (
        <div className="glass rounded-3xl p-12 text-center">
          <Bell size={48} className="text-[rgba(255,255,255,0.1)] mx-auto mb-3" />
          <p className="text-[rgba(255,255,255,0.3)]">No notifications</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((notif) => {
            const { icon: Icon, color, bg } = typeConfig[notif.type];
            return (
              <button
                key={notif.id}
                onClick={() => markNotificationRead(notif.id)}
                className={cn(
                  "w-full text-left glass rounded-2xl p-4 hover:glass-strong transition-all border",
                  !notif.read ? "border-[rgba(0,212,255,0.15)]" : "border-transparent"
                )}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: bg }}
                  >
                    <Icon size={18} style={{ color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className={cn("text-sm font-semibold", !notif.read ? "text-white" : "text-[rgba(255,255,255,0.6)]")}>
                        {notif.title}
                      </span>
                      <div className="flex items-center gap-2 shrink-0">
                        {!notif.read && <span className="w-2 h-2 rounded-full" style={{ background: color }} />}
                        <span className="text-[10px] text-[rgba(255,255,255,0.3)]">{formatTimeAgo(notif.timestamp)}</span>
                      </div>
                    </div>
                    <p className="text-xs text-[rgba(255,255,255,0.5)] mt-0.5">{notif.message}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
