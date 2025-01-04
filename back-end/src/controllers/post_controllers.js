const jwt = require("jsonwebtoken");
const pool = require("../database/database_connection");

const createPost = async (req, res) => {
  try {
    const { token, content } = req.body;

    const decodedToken = jwt.verify(token, "your-secret-key");
    const userId = decodedToken.id;

    const [result] = await pool.execute(
      "INSERT INTO posts (user_id, content) VALUES (?, ?)",
      [userId, content]
    );

    console.log(userId, result);

    res.status(201).json({
      message: "Post created successfully",
      postId: result.insertId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const query = `
      SELECT
        p.id as post_id,
        p.created_at as created_at,
        p.content as post_content,
        COUNT(l.id) as like_count,
        GROUP_CONCAT(u.username) as likers,
        u_post.username as sender
      FROM
        posts p
      LEFT JOIN
        likes l ON p.id = l.post_id
      LEFT JOIN
        users u ON l.user_id = u.id
      LEFT JOIN
        users u_post ON p.user_id = u_post.id
      GROUP BY
        p.id, p.content, sender
      ORDER BY
        p.created_at DESC;
        `;
    let [posts] = await pool.execute(query);

    posts = posts.map((post) => ({
      ...post,
      likers: post.likers ? post.likers.split(",") : [],
    }));

    res.status(200).json({
      message: "Get All posts successfully",
      posts: posts,
    });
  } catch (error) {
    console.error("Error fetching posts:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const likePost = async (req, res) => {
  try {
    const { post_id, token } = req.body;

    const decodedToken = jwt.verify(token, "your-secret-key");
    const userId = decodedToken.id;
    const [existingLike] = await pool.execute(
      "SELECT * FROM likes WHERE post_id = ? AND user_id = ?",
      [post_id, userId]
    );

    if (existingLike.length > 0) {
      return res
        .status(400)
        .json({ message: "You have already liked this post" });
    }
    const [result] = await pool.execute(
      "INSERT INTO likes (post_id, user_id) VALUES (?, ?)",
      [post_id, userId]
    );

    res.status(201).json({
      message: "Post liked successfully",
      likeId: result.insertId,
    });
  } catch (error) {
    console.error("Error liking post:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updatePost = async (req, res) => {
  try {
    const { token, content } = req.body;
    const postId = req.params.id;

    const decodedToken = jwt.verify(token, "your-secret-key");
    const userId = decodedToken.id;

    const [post] = await pool.execute(
      "SELECT * FROM posts WHERE id = ? AND user_id = ?",
      [postId, userId]
    );

    if (post.length === 0) {
      return res
        .status(404)
        .json({ message: "Post not found or unauthorized" });
    }

    await pool.execute("UPDATE posts SET content = ? WHERE id = ?", [
      content,
      postId,
    ]);

    res.status(200).json({ message: "Post updated successfully" });
  } catch (error) {
    console.error("Error updating post:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deletePost = async (req, res) => {
  try {
    const { token } = req.body;
    const postId = req.params.id;

    const decodedToken = jwt.verify(token, "your-secret-key");
    const userId = decodedToken.id;

    const [post] = await pool.execute(
      "SELECT * FROM posts WHERE id = ? AND user_id = ?",
      [postId, userId]
    );

    if (post.length === 0) {
      return res
        .status(404)
        .json({ message: "Post not found or unauthorized" });
    }

    await pool.execute("DELETE FROM posts WHERE id = ?", [postId]);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const addComment = async (req, res) => {
  try {
    const { token, comment } = req.body;
    const postId = req.params.id;

    const decodedToken = jwt.verify(token, "your-secret-key");
    const userId = decodedToken.id;

    const [result] = await pool.execute(
      "INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)",
      [postId, userId, comment]
    );

    res.status(201).json({
      message: "Comment added successfully",
      commentId: result.insertId,
    });
  } catch (error) {
    console.error("Error adding comment:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  likePost,
  updatePost,
  deletePost,
  addComment,
};
