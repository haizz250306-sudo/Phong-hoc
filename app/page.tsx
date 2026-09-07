"use client"

import { useMemo, useState } from "react"
import {
  Building2,
  Users,
  Clock,
  RotateCcw,
  DoorOpen,
  BookOpen,
  KeyRound,
  X,
  AlertTriangle,
  CheckCircle2,
  Ban,
} from "lucide-react"

type RoomStatus = "available" | "in-class" | "booked"

type Room = {
  id: string
  name: string
  capacity: number
  status: RoomStatus
  /** Giờ lớp chính khóa tiếp theo bắt đầu, dạng "HH:MM" */
  nextClass: string
  /** Tên lớp đang học (khi status = in-class) */
  className?: string
  /** Kết thúc lớp đang học */
  classEnd?: string
  /** Người mượn (khi status = booked) */
  borrower?: string
  /** Thời điểm trả phòng dự kiến của người mượn */
  bookedUntil?: string
}

const NOW = "08:00"
const BUFFER_MINUTES = 15

/** Danh sách 20 phòng ban đầu: 12 trống, 6 đang có lớp, 2 đang mượn. */
function createInitialRooms(): Room[] {
  return [
    { id: "A101", name: "A101", capacity: 40, status: "available", nextClass: "09:30" },
    { id: "A102", name: "A102", capacity: 60, status: "available", nextClass: "09:45" },
    { id: "A103", name: "A103", capacity: 100, status: "available", nextClass: "10:15" },
    {
      id: "A104",
      name: "A104",
      capacity: 40,
      status: "in-class",
      nextClass: "09:30",
      className: "Triết học Mác - Lênin",
      classEnd: "09:30",
    },
    { id: "A105", name: "A105", capacity: 60, status: "available", nextClass: "09:30" },
    {
      id: "A106",
      name: "A106",
      capacity: 100,
      status: "booked",
      nextClass: "10:00",
      borrower: "TS. Nguyễn Văn An",
      bookedUntil: "09:15",
    },
    { id: "A107", name: "A107", capacity: 40, status: "available", nextClass: "10:30" },
    {
      id: "A108",
      name: "A108",
      capacity: 60,
      status: "in-class",
      nextClass: "09:30",
      className: "Luật Hành chính",
      classEnd: "09:30",
    },
    { id: "A109", name: "A109", capacity: 100, status: "available", nextClass: "09:30" },
    { id: "A110", name: "A110", capacity: 40, status: "available", nextClass: "09:15" },
    {
      id: "B101",
      name: "B101",
      capacity: 60,
      status: "in-class",
      nextClass: "09:30",
      className: "Kinh tế chính trị",
      classEnd: "09:30",
    },
    { id: "B102", name: "B102", capacity: 100, status: "available", nextClass: "10:00" },
    { id: "B103", name: "B103", capacity: 40, status: "available", nextClass: "09:30" },
    {
      id: "B104",
      name: "B104",
      capacity: 60,
      status: "booked",
      nextClass: "09:45",
      borrower: "CLB Nghiên cứu Khoa học",
      bookedUntil: "09:00",
    },
    {
      id: "B105",
      name: "B105",
      capacity: 100,
      status: "in-class",
      nextClass: "09:30",
      className: "Tư tưởng Hồ Chí Minh",
      classEnd: "09:30",
    },
    { id: "B106", name: "B106", capacity: 40, status: "available", nextClass: "09:45" },
    { id: "B107", name: "B107", capacity: 60, status: "available", nextClass: "10:30" },
    {
      id: "B108",
      name: "B108",
      capacity: 100,
      status: "in-class",
      nextClass: "09:30",
      className: "Quản trị Văn phòng",
      classEnd: "09:30",
    },
    { id: "B109", name: "B109", capacity: 40, status: "available", nextClass: "09:30" },
    {
      id: "B110",
      name: "B110",
      capacity: 60,
      status: "in-class",
      nextClass: "09:30",
      className: "Lịch sử Đảng CSVN",
      classEnd: "09:30",
    },
  ]
}

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number)
  return h * 60 + m
}

function addMinutes(hhmm: string, minutes: number): string {
  const total = toMinutes(hhmm) + minutes
  const h = Math.floor(total / 60) % 24
  const m = total % 60
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
}

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h > 0 && m > 0) return `${h} tiếng ${m} phút`
  if (h > 0) return `${h} tiếng`
  return `${m} phút`
}

const DURATION_OPTIONS = [30, 60, 75, 90]

export default function Page() {
  const [rooms, setRooms] = useState<Room[]>(createInitialRooms)
  const [activeRoom, setActiveRoom] = useState<Room | null>(null)

  const stats = useMemo(() => {
    return {
      total: rooms.length,
      available: rooms.filter((r) => r.status === "available").length,
      inClass: rooms.filter((r) => r.status === "in-class").length,
      booked: rooms.filter((r) => r.status === "booked").length,
    }
  }, [rooms])

  function handleReset() {
    setRooms(createInitialRooms())
    setActiveRoom(null)
  }

  function handleCancelBooking(id: string) {
    setRooms((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: "available", borrower: undefined, bookedUntil: undefined } : r,
      ),
    )
  }

  function handleConfirmBooking(id: string, minutes: number) {
    setRooms((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: "booked",
              borrower: "Bạn (Giảng viên / SV)",
              bookedUntil: addMinutes(NOW, minutes),
            }
          : r,
      ),
    )
    setActiveRoom(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-background to-slate-200">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-10">
        <Header now={NOW} onReset={handleReset} />

        <section
          aria-label="Thống kê nhanh"
          className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4"
        >
          <StatCard
            icon={<Building2 className="size-5" />}
            label="Tổng số phòng"
            value={stats.total}
            tone="navy"
          />
          <StatCard
            icon={<DoorOpen className="size-5" />}
            label="Phòng trống"
            value={stats.available}
            tone="green"
          />
          <StatCard
            icon={<BookOpen className="size-5" />}
            label="Đang có lớp"
            value={stats.inClass}
            tone="red"
          />
          <StatCard
            icon={<KeyRound className="size-5" />}
            label="Đang mượn"
            value={stats.booked}
            tone="amber"
          />
        </section>

        <Legend />

        <section aria-label="Lưới phòng học" className="mt-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4 xl:grid-cols-5">
            {rooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                onOpen={() => setActiveRoom(room)}
                onCancel={() => handleCancelBooking(room.id)}
              />
            ))}
          </div>
        </section>
      </div>

      {activeRoom && (
        <BookingModal
          room={activeRoom}
          now={NOW}
          onClose={() => setActiveRoom(null)}
          onConfirm={handleConfirmBooking}
        />
      )}
    </div>
  )
}

function Header({ now, onReset }: { now: string; onReset: () => void }) {
  return (
    <header className="flex flex-col gap-4 rounded-2xl border border-white/60 bg-white/60 p-5 shadow-[0_8px_30px_rgb(15,23,42,0.06)] backdrop-blur-xl md:flex-row md:items-center md:justify-between md:p-6">
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

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-xl border border-white/70 bg-white/70 px-4 py-2.5 shadow-sm backdrop-blur">
          <Clock className="size-5 text-primary" />
          <div className="leading-none">
            <span className="block text-xs text-muted-foreground">Thời gian hệ thống</span>
            <span className="font-mono text-lg font-bold tabular-nums text-foreground">
              {now} AM
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <RotateCcw className="size-4" />
          <span className="hidden sm:inline">Khôi phục Hệ thống</span>
          <span className="sm:hidden">Reset</span>
        </button>
      </div>
    </header>
  )
}

const STAT_TONES = {
  navy: "text-primary bg-primary/10",
  green: "text-emerald-600 bg-emerald-500/10",
  red: "text-red-600 bg-red-500/10",
  amber: "text-amber-600 bg-amber-500/10",
} as const

function StatCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode
  label: string
  value: number
  tone: keyof typeof STAT_TONES
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/60 bg-white/60 p-4 shadow-[0_8px_30px_rgb(15,23,42,0.05)] backdrop-blur-xl">
      <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${STAT_TONES[tone]}`}>
        {icon}
      </div>
      <div className="leading-tight">
        <div className="text-2xl font-bold tabular-nums text-foreground">{value}</div>
        <div className="text-xs text-muted-foreground">{label}</div>
      </div>
    </div>
  )
}

function Legend() {
  const items = [
    { label: "Trống", className: "bg-emerald-500" },
    { label: "Đang có lớp", className: "bg-red-500" },
    { label: "Đang mượn tạm", className: "bg-amber-500" },
  ]
  return (
    <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
      <span className="text-sm font-medium text-muted-foreground">Chú thích:</span>
      {items.map((item) => (
        <span key={item.label} className="flex items-center gap-2 text-sm text-foreground">
          <span className={`size-3 rounded-full ${item.className}`} aria-hidden="true" />
          {item.label}
        </span>
      ))}
    </div>
  )
}

const ROOM_STYLES: Record<
  RoomStatus,
  { card: string; badge: string; badgeText: string; dot: string }
> = {
  available: {
    card: "border-emerald-200 bg-emerald-50/80 hover:border-emerald-300 hover:shadow-emerald-500/10 cursor-pointer",
    badge: "bg-emerald-500/15 text-emerald-700",
    badgeText: "Trống",
    dot: "bg-emerald-500",
  },
  "in-class": {
    card: "border-red-200 bg-red-50/80",
    badge: "bg-red-500/15 text-red-700",
    badgeText: "Đang có lớp",
    dot: "bg-red-500",
  },
  booked: {
    card: "border-amber-200 bg-amber-50/80",
    badge: "bg-amber-500/15 text-amber-700",
    badgeText: "Đang mượn",
    dot: "bg-amber-500",
  },
}

function RoomCard({
  room,
  onOpen,
  onCancel,
}: {
  room: Room
  onOpen: () => void
  onCancel: () => void
}) {
  const style = ROOM_STYLES[room.status]
  const isAvailable = room.status === "available"

  const content = (
    <>
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-xl font-bold text-foreground">{room.name}</div>
          <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="size-3.5" />
            {room.capacity} chỗ
          </div>
        </div>
        <span
          className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${style.badge}`}
        >
          <span className={`size-1.5 rounded-full ${style.dot}`} aria-hidden="true" />
          {style.badgeText}
        </span>
      </div>

      <div className="mt-3 min-h-[42px] text-sm">
        {room.status === "available" && (
          <p className="font-medium text-emerald-700">
            Trống đến <span className="font-bold">{room.nextClass}</span>
          </p>
        )}
        {room.status === "in-class" && (
          <p className="text-red-700">
            <span className="line-clamp-1 font-semibold">{room.className}</span>
            <span className="text-xs text-red-600/80">đến {room.classEnd}</span>
          </p>
        )}
        {room.status === "booked" && (
          <p className="text-amber-700">
            <span className="line-clamp-1 font-semibold">{room.borrower}</span>
            <span className="text-xs text-amber-600/90">mượn đến {room.bookedUntil}</span>
          </p>
        )}
      </div>

      {isAvailable && (
        <div className="mt-1 flex items-center justify-end text-xs font-semibold text-emerald-700 opacity-0 transition-opacity group-hover:opacity-100">
          Bấm để mượn phòng →
        </div>
      )}

      {room.status === "booked" && (
        <button
          type="button"
          onClick={onCancel}
          className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-1"
        >
          <Ban className="size-3.5" />
          Hủy mượn
        </button>
      )}
    </>
  )

  const baseClass =
    "group flex flex-col rounded-2xl border p-4 shadow-[0_6px_20px_rgb(15,23,42,0.05)] backdrop-blur-sm transition-all duration-200"

  if (isAvailable) {
    return (
      <button
        type="button"
        onClick={onOpen}
        className={`${baseClass} ${style.card} text-left hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2`}
      >
        {content}
      </button>
    )
  }

  return <div className={`${baseClass} ${style.card}`}>{content}</div>
}

function BookingModal({
  room,
  now,
  onClose,
  onConfirm,
}: {
  room: Room
  now: string
  onClose: () => void
  onConfirm: (id: string, minutes: number) => void
}) {
  const gapMinutes = toMinutes(room.nextClass) - toMinutes(now)
  const usableMinutes = gapMinutes - BUFFER_MINUTES
  const [selected, setSelected] = useState<number | null>(null)

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl border border-white/60 bg-white/90 shadow-2xl backdrop-blur-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 border-b border-border bg-primary px-5 py-4 text-primary-foreground">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-white/15">
              <DoorOpen className="size-5" />
            </div>
            <div>
              <h2 id="booking-title" className="text-lg font-bold leading-tight">
                Mượn phòng {room.name}
              </h2>
              <p className="text-xs text-primary-foreground/80">Sức chứa {room.capacity} chỗ</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="rounded-lg p-1.5 text-primary-foreground/80 transition-colors hover:bg-white/15 hover:text-primary-foreground"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="space-y-5 p-5">
          <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-sm">
            <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-600" />
            <p className="text-amber-800">
              Phòng <span className="font-bold">{room.name}</span> đang trống. Lớp học chính khóa
              tiếp theo bắt đầu lúc <span className="font-bold">{room.nextClass}</span>{" "}
              <span className="text-amber-700">
                (Bạn còn {formatDuration(gapMinutes)} sử dụng).
              </span>
            </p>
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold text-foreground">Chọn thời gian mượn</p>
            <div className="grid grid-cols-2 gap-2.5">
              {DURATION_OPTIONS.map((minutes) => {
                const locked = minutes > usableMinutes
                const active = selected === minutes
                return (
                  <button
                    key={minutes}
                    type="button"
                    disabled={locked}
                    onClick={() => setSelected(minutes)}
                    className={[
                      "relative flex flex-col items-center gap-0.5 rounded-xl border px-3 py-3 text-sm font-semibold transition-all",
                      locked
                        ? "cursor-not-allowed border-dashed border-border bg-muted text-muted-foreground/60"
                        : active
                          ? "border-primary bg-primary text-primary-foreground shadow-sm"
                          : "border-border bg-card text-foreground hover:border-primary/50 hover:bg-accent",
                    ].join(" ")}
                  >
                    <span>{minutes} phút</span>
                    {locked && (
                      <span className="text-[10px] font-medium text-muted-foreground/70">
                        Khóa · trừ 15&apos; dọn phòng
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
            <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="size-3.5" />
              Hệ thống tự động trừ <span className="font-semibold">15 phút buffer</span> để dọn
              phòng trước giờ lớp chính khóa.
            </p>
          </div>

          <button
            type="button"
            disabled={selected === null}
            onClick={() => selected !== null && onConfirm(room.id, selected)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
          >
            <CheckCircle2 className="size-5" />
            Xác nhận mượn phòng ngay
          </button>
        </div>
      </div>
    </div>
  )
}
