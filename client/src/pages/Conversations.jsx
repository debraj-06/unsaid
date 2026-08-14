import ConversationCard from "../components/ConversationCard";

const conversations = [
  {
    question: "What changed your perspective on life?",
    responses: 213,
  },
  {
    question: "What is something you are still trying to forgive yourself for?",
    responses: 147,
  },
  {
    question: "When was the last time you felt completely understood?",
    responses: 96,
  },
];

function Conversations() {
  return (
    <div>

      <p className="text-xs font-semibold tracking-[0.16em] text-[#9b90a3] uppercase">
        conversations
      </p>

      <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-[#302936] dark:text-[#f3edf7]">
        Talk without performing.
      </h1>

      <p className="mt-3 max-w-xl text-sm leading-6 text-[#928895]">
        Open questions. Honest answers. No pressure to build a public persona.
      </p>

      <div className="mt-8 space-y-3">

        {conversations.map((item) => (
          <ConversationCard
            key={item.question}
            item={item}
          />
        ))}

      </div>

    </div>
  );
}

export default Conversations;