"use client";
import { useEffect, useState } from "react";
import { profile } from "@/data/portfolio";

/** Live clock in the portfolio owner's timezone (renders "--:--" until mounted). */
export default function LocalTime({ seconds = false }: { seconds?: boolean }) {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      ...(seconds ? { second: "2-digit" } : {}),
      timeZone: profile.timezone,
    });
    const update = () => setTime(fmt.format(new Date()));
    const first = setTimeout(update, 0);
    const id = setInterval(update, seconds ? 1000 : 15_000);
    return () => { clearTimeout(first); clearInterval(id); };
  }, [seconds]);
  return <span className="tabular-nums">{time || (seconds ? "--:--:--" : "--:--")}</span>;
}
