const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const pool = require("../database/database_connection");

// Fungsi untuk menambah postingan
const createPost = async (req, res) => {
  try {
    const { token, content } = req.body;

    // untuk mengembalikan token menjadi data sebenarnya
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

// Fungsi untuk mengambil data posts dari database
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

    // Untuk convert string menjadi array
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

// Fungsi untuk menambah like pada post
const likePost = async (req, res) => {
  try {
    const { post_id, token } = req.body;

    // Verifikasi token
    const decodedToken = jwt.verify(token, "your-secret-key");
    const userId = decodedToken.id;

    // Cek jika user sudah pernah like post ini
    const [existingLike] = await pool.execute(
      "SELECT * FROM likes WHERE post_id = ? AND user_id = ?",
      [post_id, userId]
    );

    if (existingLike.length > 0) {
      return res
        .status(400)
        .json({ message: "You have already liked this post" });
    }

    // Menambahkan like baru
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

// Fungsi untuk memperbarui konten post
const updatePost = async (req, res) => {
  try {
    const { token, content } = req.body;
    const postId = req.params.id;

    // Verifikasi token
    const decodedToken = jwt.verify(token, "your-secret-key");
    const userId = decodedToken.id;

    // Cek apakah post milik user
    const [post] = await pool.execute(
      "SELECT * FROM posts WHERE id = ? AND user_id = ?",
      [postId, userId]
    );

    if (post.length === 0) {
      return res
        .status(404)
        .json({ message: "Post not found or unauthorized" });
    }

    // Perbarui post
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

// Fungsi untuk menghapus post
const deletePost = async (req, res) => {
  try {
    const { token } = req.body;
    const postId = req.params.id;

    // Verifikasi token
    const decodedToken = jwt.verify(token, "your-secret-key");
    const userId = decodedToken.id;

    // Cek apakah post milik user
    const [post] = await pool.execute(
      "SELECT * FROM posts WHERE id = ? AND user_id = ?",
      [postId, userId]
    );

    if (post.length === 0) {
      return res
        .status(404)
        .json({ message: "Post not found or unauthorized" });
    }

    // Hapus post
    await pool.execute("DELETE FROM posts WHERE id = ?", [postId]);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Fungsi untuk menambahkan komentar pada post
const addComment = async (req, res) => {
  try {
    const { token, comment } = req.body;
    const postId = req.params.id;

    // Verifikasi token
    const decodedToken = jwt.verify(token, "your-secret-key");
    const userId = decodedToken.id;

    // Menambahkan komentar
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

// Fungsi untuk mengirim email
const sendResetEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", // Atau gunakan layanan email lain
    auth: {
      user: "your-email@gmail.com", // Ganti dengan email Anda
      pass: "your-email-password", // Ganti dengan password email Anda
    },
  });

  const resetUrl = `http://localhost:3000/reset-password/${token}`;
  const mailOptions = {
    from: "your-email@gmail.com",
    to: email,
    subject: "Password Reset Request",
    text: `To reset your password, please click the following link: ${resetUrl}`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error.message);
  }
};

// Fungsi untuk meminta reset password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Cari user berdasarkan email
    const [user] = await pool.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (user.length === 0) {
      return res.status(404).json({ message: "Email not found" });
    }

    // Buat token untuk reset password
    const token = jwt.sign({ id: user[0].id }, "your-secret-key", {
      expiresIn: "1h", // Token valid selama 1 jam
    });

    // Kirim email dengan token untuk reset password
    await sendResetEmail(email, token);

    res.status(200).json({
      message: "Password reset email sent successfully",
    });
  } catch (error) {
    console.error("Error handling forgot password:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Fungsi untuk mengatur ulang password
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Verifikasi token
    const decodedToken = jwt.verify(token, "your-secret-key");
    const userId = decodedToken.id;

    // Perbarui password user
    await pool.execute("UPDATE users SET password = ? WHERE id = ?", [
      newPassword,
      userId,
    ]);

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error resetting password:", error.message);
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
  forgotPassword,
  resetPassword,
};
