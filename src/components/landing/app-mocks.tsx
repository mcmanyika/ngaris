import {
  Camera,
  CheckCircle2,
  FileText,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";

export function DashboardMock() {
  return (
    <div className="grid gap-3 p-4 text-white sm:grid-cols-[140px_1fr]">
      <aside className="hidden rounded-lg bg-white/5 p-3 text-[11px] text-white/60 sm:block">
        <p className="mb-3 text-[10px] tracking-wide text-[#C49A55] uppercase">
          Workspace
        </p>
        {["Overview", "Projects", "Approvals", "Finance", "Messages"].map(
          (item, i) => (
            <div
              key={item}
              className={`rounded-md px-2 py-1.5 ${i === 0 ? "bg-[#C49A55]/15 text-[#C49A55]" : "hover:bg-white/5"}`}
            >
              {item}
            </div>
          ),
        )}
      </aside>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] tracking-wide text-[#C49A55] uppercase">
              Active projects
            </p>
            <p className="font-[family-name:var(--font-display)] text-lg">
              12 live · 3 at risk
            </p>
          </div>
          <span className="rounded-md bg-emerald-500/15 px-2 py-1 text-[10px] text-emerald-300">
            Synced
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Contract value", value: "$2.4M" },
            { label: "Pending approvals", value: "7" },
            { label: "Open defects", value: "4" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg border border-white/8 bg-white/5 p-2.5"
            >
              <p className="text-[10px] text-white/45">{stat.label}</p>
              <p className="mt-1 font-[family-name:var(--font-display)] text-base">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
        <div className="rounded-lg border border-white/8 bg-white/[0.03] p-3">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span>Borrowdale Residence</span>
            <span className="text-white/45">62%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-[62%] rounded-full bg-[#C49A55]" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProgressMock() {
  return (
    <div className="space-y-3 p-4 text-white">
      <div className="flex items-center justify-between">
        <p className="font-[family-name:var(--font-display)] text-base">
          Weekly site report
        </p>
        <span className="rounded-md bg-[#C49A55]/15 px-2 py-1 text-[10px] text-[#C49A55]">
          Approved
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[Camera, FileText, ShieldCheck].map((Icon, i) => (
          <div
            key={i}
            className="flex aspect-[4/3] items-center justify-center rounded-lg border border-white/10 bg-white/5"
          >
            <Icon className="h-5 w-5 text-[#C49A55]" />
          </div>
        ))}
      </div>
      <ul className="space-y-2 text-xs text-white/75">
        {[
          "Wall plate inspection passed",
          "Materials received · PO-184",
          "2 defects assigned to contractor",
        ].map((item) => (
          <li key={item} className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-300" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ApprovalsMock() {
  return (
    <div className="space-y-2 p-4 text-white">
      <p className="text-[10px] tracking-wide text-[#C49A55] uppercase">
        Approval queue
      </p>
      {[
        { title: "Variation · Kitchen finishes", amount: "+$4,200" },
        { title: "Milestone · Roof structure", amount: "$18,500" },
        { title: "Payment request · PO-191", amount: "$6,750" },
      ].map((row) => (
        <div
          key={row.title}
          className="flex items-center justify-between rounded-lg border border-white/8 bg-white/5 px-3 py-2.5"
        >
          <div>
            <p className="text-xs">{row.title}</p>
            <p className="text-[10px] text-white/45">{row.amount}</p>
          </div>
          <div className="flex gap-1.5">
            <span className="rounded-md bg-white/10 px-2 py-1 text-[10px]">
              Review
            </span>
            <span className="rounded-md bg-[#C49A55] px-2 py-1 text-[10px] text-[#0D2536]">
              Approve
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function MessagesMock() {
  return (
    <div className="space-y-3 p-4 text-white">
      <div className="flex items-center gap-2 text-xs text-white/55">
        <MessageSquare className="h-3.5 w-3.5 text-[#C49A55]" />
        Project thread · Borrowdale
      </div>
      {[
        { who: "Site supervisor", text: "Slab pour complete. Photos uploaded." },
        { who: "You", text: "Looks good — proceed to wall plate." },
      ].map((msg) => (
        <div
          key={msg.text}
          className={`max-w-[85%] rounded-lg px-3 py-2 text-xs ${
            msg.who === "You"
              ? "ml-auto bg-[#C49A55]/20 text-white"
              : "bg-white/8 text-white/80"
          }`}
        >
          <p className="mb-1 text-[10px] text-white/45">{msg.who}</p>
          {msg.text}
        </div>
      ))}
    </div>
  );
}
