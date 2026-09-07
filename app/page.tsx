"use client"

import { useState } from "react"
import { Building2, DoorOpen, ShieldCheck } from "lucide-react"
import { RoomLookup } from "@/components/room-lookup"
import { AdminScheduler } from "@/components/admin-scheduler"

type Tab = "lookup" | "admin"

export default function Page() {
  const [tab, setTab] = useState<Tab>("lookup")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-background to-slate-200">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-10">
        <header className="flex flex-col gap-4 rounded-2xl border border-white/60 bg-white/60 p-5 shadow-[0_8px_30px_rgb(15,23,42,0.06)] backdrop-blur-xl md:p-6">
          <div className="flex items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Building2 className="size-6" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Học viện Hành chính &amp; Quản trị Công
              </p>
              <h1 className="text-balance text-lg font-bold leading-tight text-foreground md:text-xl">
                Hệ thống Tra cứu &amp; Phân bổ Phòng học HVHC&amp;QTC
              </h1>
            </div>
          </div>

          <nav className="flex gap-2" aria-label="Chế độ xem">
            <TabButton active={tab === "lookup"} onClick={() => setTab("lookup")} icon={<DoorOpen className="size-4" />}>
              Tra cứu phòng
            </TabButton>
            <TabButton active={tab === "admin"} onClick={() => setTab("admin")} icon={<ShieldCheck className="size-4" />}>
              Quản trị &amp; Xếp lịch
            </TabButton>
          </nav>
        </header>

        <main className="mt-6">{tab === "lookup" ? <RoomLookup /> : <AdminScheduler />}</main>
      </div>
    </div>
  )
}

function TabButton({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all",
        active
          ? "border-primary bg-primary text-primary-foreground shadow-sm"
          : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-accent",
      ].join(" ")}
    >
      {icon}
      {children}
    </button>
  )
}
