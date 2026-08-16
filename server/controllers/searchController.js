const User = require("../models/User");
const Thought = require("../models/Thought");
const Comment = require("../models/Comment");


// ==========================================
// ESCAPE REGEX
// ==========================================

const escapeRegex = (value) => {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
};


// ==========================================
// FORMAT THOUGHT
// ==========================================

const formatThought = async (
  thought,
  userId,
  commentCountOverride = null
) => {
  if (!thought) {
    return null;
  }

  const likes = Array.isArray(
    thought.likes
  )
    ? thought.likes
    : [];

  const bookmarks = Array.isArray(
    thought.bookmarks
  )
    ? thought.bookmarks
    : [];

  const commentCount =
    commentCountOverride !== null
      ? commentCountOverride
      : await Comment.countDocuments({
          thought: thought._id,
        });

  const author =
    thought.author || {};

  return {
    id: thought._id,

    username:
      author.username || "unknown",

    content:
      thought.content,

    likesCount:
      likes.length,

    likedByMe:
      likes.some(
        (id) =>
          id.toString() ===
          userId.toString()
      ),

    bookmarkedByMe:
      bookmarks.some(
        (id) =>
          id.toString() ===
          userId.toString()
      ),

    commentCount,

    createdAt:
      thought.createdAt,

    updatedAt:
      thought.updatedAt,
  };
};


// ==========================================
// GET PEOPLE TO DISCOVER
// ==========================================

const getDiscoverPeople = async (
  userId
) => {
  const users =
    await User.find({
      _id: {
        $ne: userId,
      },
    })
      .select(
        "_id username bio createdAt followers following"
      )
      .sort({
        createdAt: -1,
      })
      .limit(8);

  if (
    users.length === 0
  ) {
    return [];
  }

  const userIds =
    users.map(
      (user) =>
        user._id
    );

  const thoughtCounts =
    await Thought.aggregate([
      {
        $match: {
          author: {
            $in:
              userIds,
          },
        },
      },

      {
        $group: {
          _id:
            "$author",

          count: {
            $sum: 1,
          },
        },
      },
    ]);

  const thoughtCountMap =
    new Map(
      thoughtCounts.map(
        (item) => [
          item._id.toString(),
          item.count,
        ]
      )
    );

  return users.map(
    (user) => ({
      id:
        user._id,

      username:
        user.username,

      bio:
        user.bio || "",

      thoughtCount:
        thoughtCountMap.get(
          user._id.toString()
        ) || 0,

      followersCount:
        Array.isArray(
          user.followers
        )
          ? user.followers.length
          : 0,

      followingCount:
        Array.isArray(
          user.following
        )
          ? user.following.length
          : 0,

      createdAt:
        user.createdAt,
    })
  );
};


// ==========================================
// GET TRENDING TOPICS
// ==========================================

const getTrendingTopics =
  async () => {
    try {
      const fourteenDaysAgo =
        new Date(
          Date.now() -
            14 *
              24 *
              60 *
              60 *
              1000
        );

      const thoughts =
        await Thought.find({
          createdAt: {
            $gte:
              fourteenDaysAgo,
          },
        })
          .select(
            "content createdAt"
          )
          .sort({
            createdAt: -1,
          })
          .limit(1000);

      const topicMap =
        new Map();

      for (
        const thought of
        thoughts
      ) {
        const content =
          typeof thought.content ===
          "string"
            ? thought.content
            : "";

        const matches =
          content.match(
            /(^|\s)#([a-zA-Z0-9_]{2,30})\b/g
          ) || [];

        const uniqueTopics =
          [
            ...new Set(
              matches.map(
                (match) =>
                  match
                    .trim()
                    .slice(1)
                    .toLowerCase()
              )
            ),
          ];

        for (
          const topic of
          uniqueTopics
        ) {
          const current =
            topicMap.get(
              topic
            ) || {
              count: 0,
              latestAt:
                thought.createdAt,
            };

          current.count += 1;

          if (
            new Date(
              thought.createdAt
            ).getTime() >
            new Date(
              current.latestAt
            ).getTime()
          ) {
            current.latestAt =
              thought.createdAt;
          }

          topicMap.set(
            topic,
            current
          );
        }
      }

      return [
        ...topicMap.entries(),
      ]
        .map(
          ([
            topic,
            data,
          ]) => ({
            topic,

            count:
              data.count,

            latestAt:
              data.latestAt,
          })
        )
        .sort(
          (a, b) => {
            if (
              b.count !==
              a.count
            ) {
              return (
                b.count -
                a.count
              );
            }

            return (
              new Date(
                b.latestAt
              ).getTime() -
              new Date(
                a.latestAt
              ).getTime()
            );
          }
        )
        .slice(0, 8);
    } catch (error) {
      console.error(
        "Get trending topics error:",
        error
      );

      return [];
    }
  };


// ==========================================
// UNIVERSAL SEARCH
// ==========================================

const universalSearch = async (
  req,
  res
) => {
  try {
    const query =
      typeof req.query.q ===
      "string"
        ? req.query.q.trim()
        : "";

    if (!query) {
      return res.json({
        users: [],
        thoughts: [],
      });
    }

    if (
      query.length >
      100
    ) {
      return res.status(400).json({
        message:
          "Search query is too long",
      });
    }

    const escaped =
      escapeRegex(query);

    const regex =
      new RegExp(
        escaped,
        "i"
      );

    const users =
      await User.find({
        username: {
          $regex:
            regex,
        },
      })
        .select(
          "_id username bio followers following"
        )
        .sort({
          username: 1,
        })
        .limit(10);

    const thoughts =
      await Thought.find({
        content: {
          $regex:
            regex,
        },
      })
        .populate(
          "author",
          "username"
        )
        .sort({
          createdAt: -1,
        })
        .limit(20);

    const formattedUsers =
      users.map(
        (user) => ({
          id:
            user._id,

          username:
            user.username,

          bio:
            user.bio || "",

          followersCount:
            Array.isArray(
              user.followers
            )
              ? user.followers.length
              : 0,

          followingCount:
            Array.isArray(
              user.following
            )
              ? user.following.length
              : 0,
        })
      );

    const formattedThoughts =
      await Promise.all(
        thoughts.map(
          (thought) =>
            formatThought(
              thought,
              req.userId
            )
        )
      );

    return res.json({
      users:
        formattedUsers,

      thoughts:
        formattedThoughts,
    });
  } catch (error) {
    console.error(
      "Universal search error:",
      error
    );

    return res.status(500).json({
      message:
        "Something went wrong while searching",
    });
  }
};


// ==========================================
// MENTION SEARCH
// ==========================================

const mentionSearch = async (
  req,
  res
) => {
  try {
    const query =
      typeof req.query.q ===
      "string"
        ? req.query.q.trim()
        : "";

    if (!query) {
      return res.json({
        users: [],
      });
    }

    if (
      query.length >
      30
    ) {
      return res.status(400).json({
        message:
          "Mention query is too long",
      });
    }

    const escaped =
      escapeRegex(query);

    const regex =
      new RegExp(
        `^${escaped}`,
        "i"
      );

    const users =
      await User.find({
        username: {
          $regex:
            regex,
        },
      })
        .select(
          "_id username bio followers following"
        )
        .sort({
          username: 1,
        })
        .limit(8);

    return res.json({
      users:
        users.map(
          (user) => ({
            id:
              user._id,

            username:
              user.username,

            bio:
              user.bio || "",

            followersCount:
              Array.isArray(
                user.followers
              )
                ? user.followers.length
                : 0,

            followingCount:
              Array.isArray(
                user.following
              )
                ? user.following.length
                : 0,
          })
        ),
    });
  } catch (error) {
    console.error(
      "Mention search error:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to search users",
    });
  }
};


// ==========================================
// EXPLORE
// ==========================================

const explore = async (
  req,
  res
) => {
  try {
    const sort =
      req.query.sort ===
      "popular"
        ? "popular"
        : "latest";

    const people =
      await getDiscoverPeople(
        req.userId
      );

    const trending =
      await getTrendingTopics();

    // ========================================
    // LATEST
    // ========================================

    if (
      sort ===
      "latest"
    ) {
      const thoughts =
        await Thought.find()
          .populate(
            "author",
            "username"
          )
          .sort({
            createdAt: -1,
          })
          .limit(30);

      const formatted =
        await Promise.all(
          thoughts.map(
            (thought) =>
              formatThought(
                thought,
                req.userId
              )
          )
        );

      return res.json({
        sort:
          "latest",

        thoughts:
          formatted,

        people,

        trending,
      });
    }

    // ========================================
    // POPULAR
    // ========================================

    const now =
      new Date();

    const pipeline = [
      {
        $lookup: {
          from:
            "users",

          localField:
            "author",

          foreignField:
            "_id",

          as:
            "authorData",
        },
      },

      {
        $unwind:
          "$authorData",
      },

      {
        $lookup: {
          from:
            "comments",

          localField:
            "_id",

          foreignField:
            "thought",

          as:
            "commentData",
        },
      },

      {
        $addFields: {
          likesCount: {
            $size: {
              $ifNull: [
                "$likes",
                [],
              ],
            },
          },

          commentCount: {
            $size: {
              $ifNull: [
                "$commentData",
                [],
              ],
            },
          },
        },
      },

      {
        $addFields: {
          ageInHours: {
            $divide: [
              {
                $subtract: [
                  now,
                  "$createdAt",
                ],
              },

              1000 *
                60 *
                60,
            ],
          },
        },
      },

      {
        $addFields: {
          recencyScore: {
            $divide: [
              24,

              {
                $add: [
                  24,

                  {
                    $max: [
                      0,
                      "$ageInHours",
                    ],
                  },
                ],
              },
            ],
          },
        },
      },

      {
        $addFields: {
          popularityScore: {
            $add: [
              {
                $multiply: [
                  "$likesCount",
                  3,
                ],
              },

              {
                $multiply: [
                  "$commentCount",
                  2,
                ],
              },

              "$recencyScore",
            ],
          },
        },
      },

      {
        $sort: {
          popularityScore:
            -1,

          createdAt:
            -1,
        },
      },

      {
        $limit: 30,
      },
    ];

    const popular =
      await Thought.aggregate(
        pipeline
      );

    const formatted =
      await Promise.all(
        popular.map(
          async (
            item
          ) => {
            const likes =
              Array.isArray(
                item.likes
              )
                ? item.likes
                : [];

            const bookmarks =
              Array.isArray(
                item.bookmarks
              )
                ? item.bookmarks
                : [];

            return {
              id:
                item._id,

              username:
                item.authorData
                  .username,

              content:
                item.content,

              likesCount:
                Number(
                  item.likesCount ||
                    likes.length
                ),

              likedByMe:
                likes.some(
                  (id) =>
                    id.toString() ===
                    req.userId.toString()
                ),

              bookmarkedByMe:
                bookmarks.some(
                  (id) =>
                    id.toString() ===
                    req.userId.toString()
                ),

              commentCount:
                Number(
                  item.commentCount ||
                    0
                ),

              createdAt:
                item.createdAt,

              updatedAt:
                item.updatedAt,
            };
          }
        )
      );

    return res.json({
      sort:
        "popular",

      thoughts:
        formatted,

      people,

      trending,
    });
  } catch (error) {
    console.error(
      "Explore error:",
      error
    );

    return res.status(500).json({
      message:
        "Something went wrong while loading Discover",
    });
  }
};


// ==========================================
// EXPORTS
// ==========================================

module.exports = {
  universalSearch,
  mentionSearch,
  explore,
};