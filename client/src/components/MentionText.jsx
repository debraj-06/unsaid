import { Link } from "react-router-dom";


function MentionText({
  content = "",
  className = "",
}) {
  if (!content) {
    return null;
  }

  /*
   * Matches:
   *
   * @luffy
   * @luffy_fan
   * @someone123
   *
   * Username format:
   * letters
   * numbers
   * underscore
   *
   * This intentionally does not match
   * @ by itself.
   */

  const parts =
    content.split(
      /(@[a-zA-Z0-9_]+)/
    );


  return (
    <span
      className={`
        whitespace-pre-wrap
        break-words
        ${className}
      `}
    >
      {parts.map(
        (part, index) => {
          if (
            /^@[a-zA-Z0-9_]+$/.test(
              part
            )
          ) {
            const username =
              part.slice(1);

            return (
              <Link
                key={`${part}-${index}`}
                to={`/user/${username}`}
                className="
                  font-medium
                  text-[#705b7d]
                  underline-offset-2
                  hover:underline

                  dark:text-[#c8b2d3]
                "
              >
                {part}
              </Link>
            );
          }

          return (
            <span
              key={`text-${index}`}
            >
              {part}
            </span>
          );
        }
      )}
    </span>
  );
}

export default MentionText;