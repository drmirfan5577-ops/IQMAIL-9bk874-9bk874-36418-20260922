import { useEffect, useState } from "react";
import { updateLastActivity, SESSION_TIMEOUT_MS } from "@/lib/auth";

export function useSessionTimer() {
  const [timeLeft, setTimeLeft] = useState(SESSION_TIMEOUT_MS);

  useEffect(() => {
    const events = ["mousedown", "keydown", "touchstart", "scroll"];
    
    const resetTimer = () => {
      updateLastActivity();
      setTimeLeft(SESSION_TIMEOUT_MS);
    };

    events.forEach((e) => window.addEventListener(e, resetTimer, { passive: true }));

    const interval = setInterval(() => {
      const lastActivity = localStorage.getItem("iqmail_last_activity");
      if (lastActivity) {
        const elapsed = Date.now() - parseInt(lastActivity);
        setTimeLeft(Math.max(0, SESSION_TIMEOUT_MS - elapsed));
      }
    }, 10000);

    return () => {
      events.forEach((e) => window.removeEventListener(e, resetTimer));
      clearInterval(interval);
    };
  }, []);

  return {
    timeLeft,
    minutesLeft: Math.floor(timeLeft / 60000),
  };
}
