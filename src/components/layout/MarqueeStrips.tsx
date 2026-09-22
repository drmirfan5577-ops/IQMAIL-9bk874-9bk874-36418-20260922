import { MOTIVATIONAL_QUOTES, MARKETING_CTAS } from "@/constants";

export default function MarqueeStrips() {
  const quotesText = MOTIVATIONAL_QUOTES.join("   ·   ");
  const ctasText = MARKETING_CTAS.join("   |   ");

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex flex-col">
      {/* Strip 1: Motivational Quotes */}
      <div className="overflow-hidden bg-[rgba(0,212,255,0.08)] border-b border-[rgba(0,212,255,0.15)] py-1">
        <div className="flex whitespace-nowrap">
          <span className="animate-marquee text-[11px] text-[#00d4ff] font-medium tracking-wide inline-block">
            {quotesText}
          </span>
        </div>
      </div>
      {/* Strip 2: Marketing CTAs */}
      <div className="overflow-hidden bg-[rgba(168,85,247,0.06)] border-b border-[rgba(168,85,247,0.12)] py-1">
        <div className="flex whitespace-nowrap">
          <span
            className="text-[11px] font-medium tracking-wide inline-block"
            style={{
              animation: "marquee2 30s linear infinite",
              color: "#c084fc",
            }}
          >
            {ctasText}
          </span>
        </div>
      </div>
    </div>
  );
}
