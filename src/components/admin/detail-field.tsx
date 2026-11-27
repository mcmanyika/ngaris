export function DetailField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-[#032842]/8 bg-white p-4">
      <p className="text-[11px] font-semibold tracking-wide text-[#032842]/40 uppercase">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-[#032842]">{value}</p>
    </div>
  );
}
