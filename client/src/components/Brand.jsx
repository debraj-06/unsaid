import { Link } from "react-router-dom";

function Brand() {
  return (
    <Link to="/" className="group flex items-center gap-3">
      <div className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-[14px] bg-[#25212f] text-white transition group-hover:rotate-[-4deg] dark:bg-[#eee8ff] dark:text-[#25212f]">
        <span className="text-sm font-bold">u</span>

        <span className="absolute -bottom-2 -right-1 h-5 w-5 rounded-full bg-[#a58cff]" />
      </div>

      <div>
        <p className="text-[17px] font-bold tracking-[-0.03em] text-[#29252f] dark:text-[#f6f2ff]">
          unsaid
        </p>

        <p className="text-[10px] tracking-[0.14em] text-[#948d9d] uppercase">
          say it here
        </p>
      </div>
    </Link>
  );
}

export default Brand;