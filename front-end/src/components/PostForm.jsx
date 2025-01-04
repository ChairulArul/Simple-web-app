import axios from "axios";
import React, { useState } from "react";
import "../styles/post-form.css";

const PostForm = (props) => {
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!content) {
        alert("Isi postingan");
        return;
      }

      const response = await axios.post("http://localhost:3001/posts", {
        token: localStorage.getItem("token"),
        content: content,
      });

      const message = response.data.message;
      alert(message);
    } catch (error) {
      console.error(error);
      alert("Gagal membuat postingan");
    } finally {
      setContent("");
      props.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-post-form">
      <textarea
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button className="post-button" type="submit">
        Post
      </button>
    </form>
  );
};

export default PostForm;
