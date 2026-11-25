import Image from "next/image";
import {
  BarChart3,
  ClipboardList,
  FolderKanban,
  LayoutDashboard,
} from "lucide-react";

export function TabletMock() {
  return (
    <div className="relative mx-auto w-full max-w-[420px]">
      <div
        className="pointer-events-none absolute -inset-8 rounded-full bg-[#EDB254]/15 blur-3xl"
        aria-hidden
      />
      <div className="relative rounded-[1.75rem] border-[10px] border-[#1a2f42] bg-[#032842] p-2 shadow-[0_40px_80px_rgba(0,0,0,0.45)]">
        <div className="overflow-hidden rounded-[1.1rem] bg-white">
          <div className="grid min-h-[340px] grid-cols-[72px_1fr] sm:min-h-[380px] sm:grid-cols-[88px_1fr]">
            <aside className="bg-[#032842] px-2 py-3 text-white">
              <div className="mb-4 flex h-7 w-7 items-center justify-center rounded-md bg-[#EDB254]/20 text-[#EDB254]">
                <LayoutDashboard className="h-3.5 w-3.5" />
              </div>
              <nav className="space-y-1 text-[9px] text-white/55 sm:text-[10px]">
                {[
                  { icon: FolderKanban, label: "Projects", active: true },
                  { icon: ClipboardList, label: "Reports", active: false },
                  { icon: BarChart3, label: "Finance", active: false },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`flex flex-col items-center gap-1 rounded-md px-1 py-2 ${
                      item.active ? "bg-white/10 text-[#EDB254]" : ""
                    }`}
                  >
                    <item.icon className="h-3.5 w-3.5" />
                    <span>{item.label}</span>
                  </div>
                ))}
              </nav>
            </aside>

            <div className="bg-[#F7F9FB] p-3 sm:p-4">
              <div className="mb-3 flex items-start justify-between gap-2">
                <div>
                  <p className="text-[10px] font-semibold tracking-wide text-[#032842]/45 uppercase">
                    Active project
                  </p>
                  <p className="text-sm font-semibold text-[#032842] sm:text-base">
                    Borrowdale Residence
                  </p>
                </div>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-medium text-emerald-700">
                  On track
                </span>
              </div>

              <div className="mb-3 rounded-xl bg-white p-3 shadow-sm">
                <div className="mb-1.5 flex items-center justify-between text-[11px]">
                  <span className="text-[#032842]/55">Progress</span>
                  <span className="font-semibold text-[#032842]">68%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[#E8EEF3]">
                  <div className="h-full w-[68%] rounded-full bg-[#EDB254]" />
                </div>
              </div>

              <div className="mb-3 grid grid-cols-2 gap-2">
                {[
                  { label: "Budget used", value: "$184k" },
                  { label: "Next milestone", value: "Roof" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl bg-white p-2.5 shadow-sm"
                  >
                    <p className="text-[9px] text-[#032842]/45">{stat.label}</p>
                    <p className="mt-0.5 text-sm font-semibold text-[#032842]">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-1.5">
                {[
                  "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=400&q=80",
                  "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=400&q=80",
                  "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=80",
                ].map((src) => (
                  <div
                    key={src}
                    className="relative aspect-[4/3] overflow-hidden rounded-lg"
                  >
                    <Image
                      src={src}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="100px"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
