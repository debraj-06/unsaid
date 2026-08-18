import {
  Check,
  Clock3,
  Gavel,
  LoaderCircle,
  MessageSquareText,
  Scale,
  ShieldQuestion,
  X,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  createCourtCase,
  getCourtCases,
  getMyCourtCases,
  voteOnCourtCase,
} from "../services/courtService";


// ==========================================
// CONSTANTS
// ==========================================

const MAX_REASONING = 500;

const MIN_CASE_LENGTH = 20;

const MAX_CASE_LENGTH = 1000;

const MIN_VOTES_FOR_RESULT = 10;


// ==========================================
// FORMAT TIME LEFT
// ==========================================

function formatTimeLeft(
  closesAt
) {
  const end =
    new Date(
      closesAt
    ).getTime();

  const remaining =
    end - Date.now();

  if (
    remaining <= 0
  ) {
    return "Voting ended";
  }

  const hours =
    Math.floor(
      remaining /
        (1000 * 60 * 60)
    );

  const minutes =
    Math.floor(
      (remaining %
        (1000 * 60 * 60)) /
        (1000 * 60)
    );

  if (
    hours > 0
  ) {
    return `${hours}h ${minutes}m left`;
  }

  return `${Math.max(
    1,
    minutes
  )}m left`;
}


// ==========================================
// RESULT DATA
// ==========================================

function getTotalVotes(
  courtCase
) {
  return Number(
    courtCase?.voteCount || 0
  );
}


function getDecisionLabel(
  decision
) {
  if (
    decision ===
    "right"
  ) {
    return "You were right";
  }

  if (
    decision ===
    "wrong"
  ) {
    return "You were wrong";
  }

  if (
    decision ===
    "both_wrong"
  ) {
    return "Both were wrong";
  }

  return "Not enough information";
}


// ==========================================
// PERCENTAGE
// ==========================================

function getPercentage(
  count,
  total
) {
  if (
    !total
  ) {
    return 0;
  }

  return Math.round(
    (count / total) * 100
  );
}


// ==========================================
// DECISION BUTTON
// ==========================================

function DecisionButton({
  value,
  selected,
  disabled,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={() =>
        onClick(
          value
        )
      }
      disabled={
        disabled
      }
      className={`
        flex
        min-h-[52px]
        w-full
        items-center
        justify-between
        gap-3
        rounded-[16px]
        border
        px-4
        text-left
        transition-all
        duration-200

        ${
          selected
            ? `
              border-[#9a87a6]
              bg-[#eee8f4]
              text-[#342b3b]

              dark:border-[#786382]
              dark:bg-[#30273a]
              dark:text-[#f0e6f4]
            `
            : `
              border-[#e5dce8]
              bg-white
              text-[#544957]

              hover:border-[#cfc0d6]
              hover:bg-[#fbf9fc]

              dark:border-[#39313f]
              dark:bg-[#1b191f]
              dark:text-[#cfc4d4]

              dark:hover:border-[#4b4051]
              dark:hover:bg-[#211d25]
            `
        }

        disabled:cursor-not-allowed
        disabled:opacity-50
      `}
    >
      <span
        className="
          text-xs
          font-semibold
        "
      >
        {getDecisionLabel(
          value
        )}
      </span>

      {selected && (
        <span
          className="
            grid
            h-6
            w-6
            shrink-0
            place-items-center
            rounded-full
            bg-[#302839]
            text-white

            dark:bg-[#eee8ff]
            dark:text-[#302839]
          "
        >
          <Check
            size={13}
            strokeWidth={2.5}
          />
        </span>
      )}
    </button>
  );
}


// ==========================================
// RESULT BAR
// ==========================================

function ResultBar({
  label,
  count,
  total,
}) {
  const percentage =
    getPercentage(
      count,
      total
    );

  return (
    <div
      className="
        space-y-1.5
      "
    >
      <div
        className="
          flex
          items-center
          justify-between
          gap-3
        "
      >
        <span
          className="
            text-[10px]
            font-medium
            text-[#6f6475]

            dark:text-[#aaa0b1]
          "
        >
          {label}
        </span>

        <span
          className="
            text-[10px]
            font-semibold
            text-[#514657]

            dark:text-[#d9cede]
          "
        >
          {percentage}%
        </span>
      </div>

      <div
        className="
          h-2
          overflow-hidden
          rounded-full
          bg-[#eee8f1]

          dark:bg-[#2b2530]
        "
      >
        <div
          className="
            h-full
            rounded-full
            bg-[#8e789a]
            transition-all
            duration-500
          "
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}


// ==========================================
// COURT CASE CARD
// ==========================================

function CourtCaseCard({
  courtCase,
  onVoted,
}) {
  const [
    selectedDecision,
    setSelectedDecision,
  ] = useState(
    courtCase?.myVote
      ?.decision || ""
  );

  const [
    reasoning,
    setReasoning,
  ] = useState(
    courtCase?.myVote
      ?.reasoning || ""
  );

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    showReasoning,
    setShowReasoning,
  ] = useState(
    Boolean(
      courtCase?.myVote
        ?.reasoning
    )
  );


  useEffect(() => {
    setSelectedDecision(
      courtCase?.myVote
        ?.decision || ""
    );

    setReasoning(
      courtCase?.myVote
        ?.reasoning || ""
    );
  }, [
    courtCase?.id,
    courtCase?.myVote?.decision,
    courtCase?.myVote?.reasoning,
  ]);


  const totalVotes =
    getTotalVotes(
      courtCase
    );

  const hasResult =
    totalVotes >=
    MIN_VOTES_FOR_RESULT ||
    courtCase.status ===
      "closed";

  const alreadyVoted =
    Boolean(
      courtCase.hasVoted
    );

  const canVote =
    !alreadyVoted &&
    !submitting &&
    !hasResult;


  const handleVote =
    async () => {
      if (
        !selectedDecision ||
        !canVote
      ) {
        return;
      }

      try {
        setSubmitting(
          true
        );

        setError("");

        const data =
          await voteOnCourtCase(
            courtCase.id,
            selectedDecision,
            reasoning.trim()
          );

        if (
          data?.courtCase
        ) {
          onVoted?.(
            data.courtCase
          );
        }
      } catch (error) {
        console.error(
          "Court vote error:",
          error
        );

        setError(
          error.message ||
            "Unable to record your vote."
        );
      } finally {
        setSubmitting(
          false
        );
      }
    };


  return (
    <article
      className="
        overflow-hidden
        rounded-[26px]

        border
        border-[#e4dce8]

        bg-white

        shadow-[0_10px_30px_rgba(48,41,54,0.04)]

        dark:border-[#352e3c]
        dark:bg-[#1b191f]
        dark:shadow-none
      "
    >

      {/* HEADER */}

      <div
        className="
          flex
          items-center
          justify-between
          gap-3

          border-b
          border-[#eee7f0]

          px-5
          py-4

          dark:border-[#2d2732]
        "
      >
        <div
          className="
            flex
            items-center
            gap-2
          "
        >
          <div
            className="
              grid
              h-8
              w-8
              place-items-center
              rounded-full

              bg-[#eee8f3]

              text-[#806d8f]

              dark:bg-[#2b2432]
              dark:text-[#c6b5d0]
            "
          >
            <Gavel
              size={15}
              strokeWidth={1.8}
            />
          </div>

          <div>
            <p
              className="
                text-[11px]
                font-semibold
                text-[#44394b]

                dark:text-[#eee7f2]
              "
            >
              Anonymous Court
            </p>

            <p
              className="
                mt-0.5
                text-[9px]
                text-[#9b919f]

                dark:text-[#817786]
              "
            >
              No identities. Just perspectives.
            </p>
          </div>
        </div>

        <div
          className="
            flex
            shrink-0
            items-center
            gap-1.5

            text-[9px]
            font-medium
            text-[#948998]

            dark:text-[#827687]
          "
        >
          <Clock3
            size={12}
          />

          {formatTimeLeft(
            courtCase.closesAt
          )}
        </div>
      </div>


      {/* SITUATION */}

      <div
        className="
          px-5
          py-5
        "
      >
        <p
          className="
            whitespace-pre-wrap
            break-words

            text-[15px]
            leading-7
            text-[#403747]

            dark:text-[#e2d8e5]
          "
        >
          {courtCase.situation}
        </p>
      </div>


      {/* RESULT */}

      {hasResult ? (
        <div
          className="
            border-t
            border-[#eee7f0]

            bg-[#fbf9fc]

            px-5
            py-5

            dark:border-[#2d2732]
            dark:bg-[#17141b]
          "
        >
          <div
            className="
              flex
              items-center
              gap-2
            "
          >
            <Scale
              size={15}
              className="
                text-[#806d8f]

                dark:text-[#c6b5d0]
              "
            />

            <p
              className="
                text-xs
                font-semibold
                text-[#493d50]

                dark:text-[#eee7f2]
              "
            >
              The court has spoken
            </p>
          </div>

          <div
            className="
              mt-4
              space-y-3
            "
          >
            <ResultBar
              label="You were right"
              count={
                courtCase.results
                  ?.right || 0
              }
              total={
                totalVotes
              }
            />

            <ResultBar
              label="You were wrong"
              count={
                courtCase.results
                  ?.wrong || 0
              }
              total={
                totalVotes
              }
            />

            <ResultBar
              label="Both were wrong"
              count={
                courtCase.results
                  ?.bothWrong || 0
              }
              total={
                totalVotes
              }
            />

            <ResultBar
              label="Not enough information"
              count={
                courtCase.results
                  ?.notEnoughInfo || 0
              }
              total={
                totalVotes
              }
            />
          </div>

          <p
            className="
              mt-4
              text-[9px]
              text-[#9a8f9e]

              dark:text-[#817786]
            "
          >
            Based on{" "}
            {totalVotes}{" "}
            anonymous vote
            {totalVotes === 1
              ? ""
              : "s"}.
          </p>
        </div>
      ) : alreadyVoted ? (
        <div
          className="
            border-t
            border-[#eee7f0]

            px-5
            py-5

            dark:border-[#2d2732]
          "
        >
          <div
            className="
              flex
              items-center
              gap-2
            "
          >
            <Check
              size={15}
              className="
                text-[#806d8f]

                dark:text-[#c6b5d0]
              "
            />

            <p
              className="
                text-xs
                font-semibold
                text-[#493d50]

                dark:text-[#eee7f2]
              "
            >
              Your vote is in.
            </p>
          </div>

          <p
            className="
              mt-1
              text-[10px]
              text-[#9a909f]

              dark:text-[#817786]
            "
          >
            The court is still deliberating.
            Results appear after enough votes.
          </p>
        </div>
      ) : (
        <div
          className="
            border-t
            border-[#eee7f0]

            px-5
            py-5

            dark:border-[#2d2732]
          "
        >
          <div
            className="
              flex
              items-center
              gap-2
            "
          >
            <ShieldQuestion
              size={15}
              className="
                text-[#806d8f]

                dark:text-[#c6b5d0]
              "
            />

            <p
              className="
                text-xs
                font-semibold
                text-[#493d50]

                dark:text-[#eee7f2]
              "
            >
              What do you think?
            </p>
          </div>


          <div
            className="
              mt-4
              grid
              grid-cols-1
              gap-2

              sm:grid-cols-2
            "
          >
            <DecisionButton
              value="right"
              selected={
                selectedDecision ===
                "right"
              }
              disabled={
                !canVote
              }
              onClick={
                setSelectedDecision
              }
            />

            <DecisionButton
              value="wrong"
              selected={
                selectedDecision ===
                "wrong"
              }
              disabled={
                !canVote
              }
              onClick={
                setSelectedDecision
              }
            />

            <DecisionButton
              value="both_wrong"
              selected={
                selectedDecision ===
                "both_wrong"
              }
              disabled={
                !canVote
              }
              onClick={
                setSelectedDecision
              }
            />

            <DecisionButton
              value="not_enough_info"
              selected={
                selectedDecision ===
                "not_enough_info"
              }
              disabled={
                !canVote
              }
              onClick={
                setSelectedDecision
              }
            />
          </div>


          {/* REASONING */}

          <button
            type="button"
            onClick={() =>
              setShowReasoning(
                (
                  current
                ) =>
                  !current
              )
            }
            className="
              mt-4
              inline-flex
              items-center
              gap-1.5

              text-[10px]
              font-semibold

              text-[#806d8f]

              hover:text-[#665475]

              dark:text-[#c6b5d0]
              dark:hover:text-white
            "
          >
            <MessageSquareText
              size={13}
            />

            {showReasoning
              ? "Hide reasoning"
              : "Add reasoning (optional)"}
          </button>


          {showReasoning && (
            <div
              className="
                mt-3
              "
            >
              <textarea
                value={
                  reasoning
                }
                onChange={(
                  event
                ) =>
                  setReasoning(
                    event.target.value
                  )
                }
                maxLength={
                  MAX_REASONING
                }
                rows={4}
                placeholder="Why do you think so?"
                className="
                  min-h-[100px]
                  w-full
                  resize-none
                  rounded-[16px]

                  border
                  border-[#e2d9e5]

                  bg-[#faf8fb]

                  p-3

                  text-xs
                  leading-5
                  text-[#403747]

                  outline-none

                  placeholder:text-[#a59aa8]

                  focus:border-[#95819e]
                  focus:ring-2
                  focus:ring-[#eee6f1]

                  dark:border-[#39323e]
                  dark:bg-[#151319]
                  dark:text-[#eee7f2]

                  dark:placeholder:text-[#756b7b]
                "
              />

              <div
                className="
                  mt-1
                  text-right
                  text-[9px]
                  text-[#aaa0ad]

                  dark:text-[#746a79]
                "
              >
                {
                  reasoning.length
                }
                /
                {MAX_REASONING}
              </div>
            </div>
          )}


          {error && (
            <div
              className="
                mt-3
                rounded-[14px]

                border
                border-red-200

                bg-red-50

                px-3
                py-2.5

                text-[10px]
                leading-5

                text-red-600

                dark:border-red-900/40
                dark:bg-red-950/20
                dark:text-red-400
              "
            >
              {error}
            </div>
          )}


          <button
            type="button"
            onClick={
              handleVote
            }
            disabled={
              !selectedDecision ||
              !canVote
            }
            className="
              mt-4
              inline-flex
              min-h-[44px]
              w-full
              items-center
              justify-center
              gap-2
              rounded-full

              bg-[#302839]

              px-5

              text-xs
              font-semibold
              text-white

              transition

              hover:bg-[#40334a]

              disabled:cursor-not-allowed
              disabled:opacity-40

              dark:bg-[#eee8ff]
              dark:text-[#302839]
              dark:hover:bg-white
            "
          >
            {submitting ? (
              <>
                <LoaderCircle
                  size={14}
                  className="
                    animate-spin
                  "
                />

                Recording vote...
              </>
            ) : (
              <>
                <Gavel
                  size={14}
                />

                Cast my vote
              </>
            )}
          </button>
        </div>
      )}


      {/* FOOTER */}

      <div
        className="
          flex
          items-center
          justify-between
          gap-3

          border-t
          border-[#eee7f0]

          px-5
          py-3

          dark:border-[#2d2732]
        "
      >
        <span
          className="
            text-[9px]
            text-[#9a909f]

            dark:text-[#817786]
          "
        >
          {totalVotes}{" "}
          vote
          {totalVotes === 1
            ? ""
            : "s"}
        </span>

        {!hasResult && (
          <span
            className="
              text-[9px]
              text-[#9a909f]

              dark:text-[#817786]
            "
          >
            {Math.max(
              0,
              MIN_VOTES_FOR_RESULT -
                totalVotes
            )}{" "}
            more needed for the result
          </span>
        )}
      </div>
    </article>
  );
}


// ==========================================
// COURT PAGE
// ==========================================

function Court() {
  const [
    cases,
    setCases,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    creating,
    setCreating,
  ] = useState(false);

  const [
    createOpen,
    setCreateOpen,
  ] = useState(false);

  const [
    situation,
    setSituation,
  ] = useState("");

  const [
    error,
    setError,
  ] = useState("");

  const [
    success,
    setSuccess,
  ] = useState("");


  // ==========================================
  // LOAD CASES
  // ==========================================

  const loadCases =
    useCallback(
      async () => {
        try {
          setLoading(
            true
          );

          setError("");

          const data =
            await getCourtCases();

          setCases(
            Array.isArray(
              data?.cases
            )
              ? data.cases
              : []
          );
        } catch (error) {
          console.error(
            "Court loading error:",
            error
          );

          setError(
            error.message ||
              "Unable to load the court."
          );
        } finally {
          setLoading(
            false
          );
        }
      },
      []
    );


  useEffect(() => {
    loadCases();
  }, [
    loadCases,
  ]);


  // ==========================================
  // CREATE CASE
  // ==========================================

  const handleCreate =
    async () => {
      const clean =
        situation.trim();

      if (
        clean.length <
        MIN_CASE_LENGTH
      ) {
        setError(
          `Your situation needs at least ${MIN_CASE_LENGTH} characters.`
        );

        return;
      }

      if (
        clean.length >
        MAX_CASE_LENGTH
      ) {
        setError(
          `Your situation cannot exceed ${MAX_CASE_LENGTH} characters.`
        );

        return;
      }

      try {
        setCreating(
          true
        );

        setError("");

        setSuccess("");

        const data =
          await createCourtCase(
            clean
          );

        const newCase =
          data?.courtCase;

        if (
          newCase
        ) {
          setCases(
            (
              current
            ) => [
              newCase,
              ...current,
            ]
          );
        }

        setSituation("");

        setCreateOpen(
          false
        );

        setSuccess(
          "Your case is now before the court."
        );
      } catch (error) {
        console.error(
          "Create court case error:",
          error
        );

        setError(
          error.message ||
            "Unable to create your case."
        );
      } finally {
        setCreating(
          false
        );
      }
    };


  // ==========================================
  // VOTED
  // ==========================================

  const handleVoted =
    (
      updatedCase
    ) => {
      if (
        !updatedCase
      ) {
        return;
      }

      setCases(
        (
          current
        ) =>
          current.map(
            (
              courtCase
            ) =>
              courtCase.id ===
              updatedCase.id
                ? updatedCase
                : courtCase
          )
      );
    };


  return (
    <div
      className="
        mx-auto
        w-full
        max-w-[900px]

        space-y-6

        px-3
        pb-20
        pt-3

        sm:px-5
        sm:pt-5
      "
    >

      {/* ======================================
          HERO
      ====================================== */}

      <section
        className="
          rounded-[28px]
          border
          border-[#e4dce8]

          bg-white

          p-5

          dark:border-[#352e3c]
          dark:bg-[#1b191f]

          sm:p-7
        "
      >
        <div
          className="
            flex
            items-center
            gap-2

            text-[9px]
            font-bold
            uppercase
            tracking-[0.18em]

            text-[#95899f]

            dark:text-[#9c90a4]
          "
        >
          <Gavel
            size={13}
          />

          the court is open
        </div>


        <div
          className="
            mt-3
            flex
            flex-col
            gap-5

            sm:flex-row
            sm:items-end
            sm:justify-between
          "
        >
          <div>
            <h1
              className="
                text-3xl
                font-semibold
                tracking-[-0.05em]

                text-[#302936]

                dark:text-[#f4edf7]

                sm:text-4xl
              "
            >
              Ask the court.
            </h1>

            <p
              className="
                mt-3
                max-w-[580px]

                text-sm
                leading-6

                text-[#8f8595]

                dark:text-[#9b90a2]
              "
            >
              Put a real situation before strangers.
              Get perspectives without revealing who you are.
            </p>
          </div>


          <button
            type="button"
            onClick={() => {
              setError("");

              setSuccess("");

              setCreateOpen(
                true
              );
            }}
            className="
              inline-flex
              min-h-[46px]
              shrink-0
              items-center
              justify-center
              gap-2
              rounded-full

              bg-[#302839]

              px-5

              text-xs
              font-semibold
              text-white

              transition

              hover:bg-[#40334a]

              dark:bg-[#eee8ff]
              dark:text-[#302839]
              dark:hover:bg-white
            "
          >
            <Scale
              size={15}
            />

            Put a case before the court
          </button>
        </div>
      </section>


      {/* ======================================
          INFO
      ====================================== */}

      <div
        className="
          grid
          grid-cols-1
          gap-3

          sm:grid-cols-3
        "
      >
        <div
          className="
            rounded-[20px]
            border
            border-[#e7dfe9]
            bg-white
            p-4

            dark:border-[#352e3c]
            dark:bg-[#1b191f]
          "
        >
          <p
            className="
              text-xs
              font-semibold
              text-[#44394b]

              dark:text-[#eee7f2]
            "
          >
            Anonymous
          </p>

          <p
            className="
              mt-1
              text-[10px]
              leading-5
              text-[#958a99]

              dark:text-[#817786]
            "
          >
            Nobody sees who submitted or voted.
          </p>
        </div>


        <div
          className="
            rounded-[20px]
            border
            border-[#e7dfe9]
            bg-white
            p-4

            dark:border-[#352e3c]
            dark:bg-[#1b191f]
          "
        >
          <p
            className="
              text-xs
              font-semibold
              text-[#44394b]

              dark:text-[#eee7f2]
            "
          >
            One vote
          </p>

          <p
            className="
              mt-1
              text-[10px]
              leading-5
              text-[#958a99]

              dark:text-[#817786]
            "
          >
            Each person gets one decision per case.
          </p>
        </div>


        <div
          className="
            rounded-[20px]
            border
            border-[#e7dfe9]
            bg-white
            p-4

            dark:border-[#352e3c]
            dark:bg-[#1b191f]
          "
        >
          <p
            className="
              text-xs
              font-semibold
              text-[#44394b]

              dark:text-[#eee7f2]
            "
          >
            10 votes
          </p>

          <p
            className="
              mt-1
              text-[10px]
              leading-5
              text-[#958a99]

              dark:text-[#817786]
            "
          >
            The verdict appears after enough votes.
          </p>
        </div>
      </div>


      {/* ======================================
          SUCCESS
      ====================================== */}

      {success && (
        <div
          className="
            rounded-[16px]

            border
            border-emerald-200

            bg-emerald-50

            px-4
            py-3

            text-xs
            text-emerald-700

            dark:border-emerald-900/40
            dark:bg-emerald-950/20
            dark:text-emerald-400
          "
        >
          {success}
        </div>
      )}


      {/* ======================================
          ERROR
      ====================================== */}

      {error && (
        <div
          className="
            rounded-[16px]

            border
            border-red-200

            bg-red-50

            px-4
            py-3

            text-xs
            text-red-700

            dark:border-red-900/40
            dark:bg-red-950/20
            dark:text-red-400
          "
        >
          {error}
        </div>
      )}


      {/* ======================================
          CASE LIST
      ====================================== */}

      <section
        className="
          space-y-4
        "
      >
        <div
          className="
            flex
            items-center
            justify-between
            gap-3
          "
        >
          <div>
            <p
              className="
                text-sm
                font-semibold

                text-[#3e3545]

                dark:text-[#eee7f2]
              "
            >
              Cases waiting for you
            </p>

            <p
              className="
                mt-1
                text-[10px]
                text-[#9a909f]

                dark:text-[#817786]
              "
            >
              Read carefully. Judge fairly.
            </p>
          </div>
        </div>


        {loading ? (
          <div
            className="
              flex
              min-h-[260px]
              items-center
              justify-center

              rounded-[24px]

              border
              border-[#e6dee9]

              bg-white

              dark:border-[#352e3c]
              dark:bg-[#1b191f]
            "
          >
            <div
              className="
                flex
                items-center
                gap-2

                text-xs
                text-[#948a99]

                dark:text-[#817786]
              "
            >
              <LoaderCircle
                size={16}
                className="
                  animate-spin
                "
              />

              Loading the court...
            </div>
          </div>
        ) : cases.length === 0 ? (
          <div
            className="
              rounded-[24px]

              border
              border-dashed
              border-[#ddd4e2]

              bg-white

              px-6
              py-12

              text-center

              dark:border-[#39323e]
              dark:bg-[#1b191f]
            "
          >
            <Gavel
              size={26}
              className="
                mx-auto

                text-[#9b8ca3]
              "
            />

            <p
              className="
                mt-3
                text-sm
                font-semibold

                text-[#44394b]

                dark:text-[#eee7f2]
              "
            >
              The court is quiet.
            </p>

            <p
              className="
                mx-auto
                mt-1
                max-w-[340px]

                text-xs
                leading-5

                text-[#958a99]

                dark:text-[#817786]
              "
            >
              Put the first case before it.
            </p>
          </div>
        ) : (
          cases.map(
            (
              courtCase
            ) => (
              <CourtCaseCard
                key={
                  courtCase.id
                }
                courtCase={
                  courtCase
                }
                onVoted={
                  handleVoted
                }
              />
            )
          )
        )}
      </section>


      {/* ======================================
          CREATE MODAL
      ====================================== */}

      {createOpen && (
        <div
          className="
            fixed
            inset-0
            z-[200]

            flex
            items-center
            justify-center

            bg-black/55

            px-4

            backdrop-blur-sm
          "
          onClick={() =>
            setCreateOpen(
              false
            )
          }
        >
          <div
            className="
              w-full
              max-w-[620px]

              rounded-[28px]

              border
              border-[#3a3340]

              bg-[#1b191f]

              p-5

              shadow-[0_24px_80px_rgba(0,0,0,0.45)]

              sm:p-6
            "
            onClick={(
              event
            ) =>
              event.stopPropagation()
            }
          >
            <div
              className="
                flex
                items-start
                justify-between
                gap-4
              "
            >
              <div>
                <div
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >
                  <Gavel
                    size={17}
                    className="
                      text-[#c6b5d0]
                    "
                  />

                  <h2
                    className="
                      text-base
                      font-semibold
                      text-[#f2eaf4]
                    "
                  >
                    Put your situation before the court
                  </h2>
                </div>

                <p
                  className="
                    mt-2
                    text-xs
                    leading-5
                    text-[#918696]
                  "
                >
                  Describe what happened.
                  Don't include private information
                  that could identify someone.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setCreateOpen(
                    false
                  )
                }
                className="
                  grid
                  h-8
                  w-8
                  shrink-0
                  place-items-center
                  rounded-full

                  text-[#918696]

                  hover:bg-white/5
                  hover:text-white
                "
                aria-label="Close"
              >
                <X
                  size={16}
                />
              </button>
            </div>


            <textarea
              autoFocus
              value={
                situation
              }
              onChange={(
                event
              ) =>
                setSituation(
                  event.target.value
                )
              }
              maxLength={
                MAX_CASE_LENGTH
              }
              rows={7}
              placeholder="Tell the court what happened..."
              className="
                mt-5
                min-h-[180px]
                w-full
                resize-none
                rounded-[20px]

                border
                border-[#3a333f]

                bg-[#151319]

                p-4

                text-sm
                leading-6
                text-[#eee7f2]

                outline-none

                placeholder:text-[#716877]

                focus:border-[#806d8f]
                focus:ring-2
                focus:ring-[#30253a]
              "
            />


            <div
              className="
                mt-2
                flex
                items-center
                justify-between
                gap-3
              "
            >
              <p
                className="
                  text-[9px]
                  leading-4
                  text-[#746a79]
                "
              >
                Keep it factual enough that strangers can
                understand both sides.
              </p>

              <span
                className="
                  shrink-0
                  text-[9px]
                  text-[#746a79]
                "
              >
                {situation.length}/
                {MAX_CASE_LENGTH}
              </span>
            </div>


            <div
              className="
                mt-5
                flex
                flex-col
                gap-2

                sm:flex-row
                sm:justify-end
              "
            >
              <button
                type="button"
                onClick={() => {
                  setSituation("");

                  setCreateOpen(
                    false
                  );
                }}
                className="
                  min-h-[44px]
                  rounded-full

                  border
                  border-[#403745]

                  px-5

                  text-xs
                  font-semibold
                  text-[#bcb1c1]

                  hover:bg-white/5
                "
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  handleCreate
                }
                disabled={
                  creating ||
                  situation.trim()
                    .length <
                    MIN_CASE_LENGTH
                }
                className="
                  inline-flex
                  min-h-[44px]
                  items-center
                  justify-center
                  gap-2
                  rounded-full

                  bg-[#eee8ff]

                  px-5

                  text-xs
                  font-semibold
                  text-[#302839]

                  hover:bg-white

                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
              >
                {creating ? (
                  <>
                    <LoaderCircle
                      size={14}
                      className="
                        animate-spin
                      "
                    />

                    Sending to court...
                  </>
                ) : (
                  <>
                    <Gavel
                      size={14}
                    />

                    Submit case
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


export default Court;