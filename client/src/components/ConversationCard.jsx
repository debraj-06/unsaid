import { ArrowUpRight, MessageCircle } from "lucide-react";

function ConversationCard({ item }) {
  return (
    <article className="rounded-[26px] border border-[#e7dfeb] bg-[#f8f4fa] p-5 dark:border-[#322b39] dark:bg-[#201c25] sm:p-6">

      <div className="flex items-center justify-between">

        <span className="rounded-full bg-white px-3 py-1.5 text-[10px] font-semibold text-[#83768f] shadow-sm dark:bg-[#29232e] dark:text-[#b8aabe]">
          open conversation
        </span>

        <MessageCircle size={17} className="text-[#9c90a5]" />

      </div>

      <h3 className="mt-5 max-w-[580px] text-xl font-semibold leading-8 tracking-[-0.02em] text-[#332d38] dark:text-[#f1eaf4]">
        {item.question}
      </h3>

      <div className="mt-5 flex items-center justify-between">

        <span className="text-xs text-[#9b909f]">
          {item.responses} people joined
        </span>

        <button className="flex items-center gap-1.5 text-xs font-semibold text-[#55465f] dark:text-[#d7c8df]">
          Join conversation
          <ArrowUpRight size={14} />
        </button>

      </div>

    </article>
  );
}

export default ConversationCard;