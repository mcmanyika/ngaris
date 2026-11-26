import {
  Eye,
  FolderKanban,
  Handshake,
  ShieldCheck,
} from "lucide-react";

const items = [
  { icon: ShieldCheck, label: "Verify", meta: "Vetted providers" },
  { icon: Handshake, label: "Select", meta: "Choose together" },
  { icon: FolderKanban, label: "Manage", meta: "We run the work" },
  { icon: Eye, label: "Oversee", meta: "Live from abroad" },
];

export function FeatureStrip() {
  return (
    <section className="relative z-10 -mt-px border-y border-white/10 bg-[#021a2e]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-4">
          {items.map((item, index) => (
            <div
              key={item.label}
              className="group relative flex items-center gap-3 px-3 py-4 sm:justify-center sm:px-4 sm:py-5"
            >
              {index > 0 ? (
                <span
                  aria-hidden
                  className="absolute top-1/2 left-0 hidden h-8 w-px -translate-y-1/2 bg-white/12 sm:block"
                />
              ) : null}
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/8 text-[#EDB254] transition-colors duration-300 group-hover:bg-[#EDB254]/20 group-hover:text-[#EDB254]">
                <item.icon className="h-4 w-4" strokeWidth={1.75} />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold tracking-tight text-white">
                  {item.label}
                </p>
                <p className="truncate text-[11px] text-white/50">
                  {item.meta}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
