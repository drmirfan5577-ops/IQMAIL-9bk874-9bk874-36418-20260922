import { BarChart2, TrendingUp, Mail, Users, Zap, Eye } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, LineChart, Line, Area, AreaChart } from "recharts";

const emailData = [
  { day: "Mon", sent: 4, received: 8 },
  { day: "Tue", sent: 7, received: 12 },
  { day: "Wed", sent: 3, received: 6 },
  { day: "Thu", sent: 9, received: 15 },
  { day: "Fri", sent: 6, received: 10 },
  { day: "Sat", sent: 2, received: 4 },
  { day: "Sun", sent: 1, received: 3 },
];

const openRateData = [
  { month: "Jun", rate: 0 },
  { month: "Jul", rate: 0 },
  { month: "Aug", rate: 0 },
  { month: "Sep", rate: 72 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-strong rounded-xl p-3 border border-[rgba(0,212,255,0.2)]">
        <p className="text-xs text-[rgba(255,255,255,0.5)] mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} className="text-sm font-semibold" style={{ color: p.color }}>
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AnalyticsPage() {
  const stats = [
    { label: "Total Emails", value: "6", change: "+100%", icon: Mail, color: "#00d4ff" },
    { label: "Open Rate", value: "72%", change: "New", icon: Eye, color: "#22c55e" },
    { label: "Campaigns", value: "0", change: "—", icon: Zap, color: "#a855f7" },
    { label: "Contacts", value: "0", change: "Import", icon: Users, color: "#f59e0b" },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-white font-bold font-orbitron text-lg">Analytics</h2>
        <p className="text-[rgba(255,255,255,0.4)] text-xs">Your email performance overview</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map(({ label, value, change, icon: Icon, color }) => (
          <div key={label} className="glass rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}15` }}>
                <Icon size={14} style={{ color }} />
              </div>
              <span className="text-[10px] glass px-1.5 py-0.5 rounded-lg" style={{ color }}>
                {change}
              </span>
            </div>
            <div className="font-orbitron font-bold text-2xl text-white">{value}</div>
            <div className="text-xs text-[rgba(255,255,255,0.4)] mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Email Activity Chart */}
      <div className="glass rounded-3xl p-5">
        <h3 className="text-white font-semibold text-sm mb-4">Weekly Email Activity</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={emailData} barGap={4}>
            <XAxis dataKey="day" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
            <Bar dataKey="received" fill="#00d4ff" radius={[4, 4, 0, 0]} opacity={0.8} name="Received" />
            <Bar dataKey="sent" fill="#a855f7" radius={[4, 4, 0, 0]} opacity={0.8} name="Sent" />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex gap-4 justify-center mt-2">
          <div className="flex items-center gap-1.5 text-xs text-[rgba(255,255,255,0.5)]">
            <span className="w-3 h-2 rounded-sm bg-[#00d4ff]" /> Received
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[rgba(255,255,255,0.5)]">
            <span className="w-3 h-2 rounded-sm bg-[#a855f7]" /> Sent
          </div>
        </div>
      </div>

      {/* Open Rate Trend */}
      <div className="glass rounded-3xl p-5">
        <h3 className="text-white font-semibold text-sm mb-4">Open Rate Trend</h3>
        <ResponsiveContainer width="100%" height={140}>
          <AreaChart data={openRateData}>
            <defs>
              <linearGradient id="rateGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(34,197,94,0.3)" }} />
            <Area type="monotone" dataKey="rate" stroke="#22c55e" fill="url(#rateGrad)" strokeWidth={2} name="Open Rate %" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Tip */}
      <div className="glass rounded-2xl p-4 border border-[rgba(0,212,255,0.1)]">
        <div className="flex items-start gap-3">
          <TrendingUp size={18} className="text-[#00d4ff] shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-white font-medium">Grow your analytics</p>
            <p className="text-xs text-[rgba(255,255,255,0.4)] mt-0.5">
              Connect Resend API & start campaigns to see real engagement metrics here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
