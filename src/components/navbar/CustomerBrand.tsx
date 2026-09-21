import Link from "next/link";

export default function CustomerBrand() {
  return (
    <Link
      href="/"
      aria-label="GameXpress home"
      className="group inline-flex shrink-0 items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
    >
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 text-base font-black tracking-tight text-white shadow-sm transition-colors group-hover:bg-blue-500">
        GX
      </span>
      <span className="hidden min-[360px]:block md:hidden lg:block">
        <span className="block text-[17px] font-bold leading-none tracking-tight text-white">
          GameXpress
        </span>
        <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
          Digital services
        </span>
      </span>
    </Link>
  );
}
