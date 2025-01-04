import React, { useState } from "react";
import "../styles/post.css";
import axios from "axios";

const convertTime = (time) => {
  const isoDateObject = new Date(time);
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };
  const formattedDate = isoDateObject.toLocaleDateString("id-ID", options);
  return formattedDate;
};

const Post = ({ post = {}, refresh, handleLike }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedContent, setUpdatedContent] = useState(post.post_content || "");
  const [comment, setComment] = useState("");

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setUpdatedContent(post.post_content);
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3001/posts/${post.post_id}`,
        {
          token: localStorage.getItem("token"),
          content: updatedContent,
        }
      );
      alert(response.data.message);
      setIsEditing(false);
      refresh();
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Failed to update post");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:3001/posts/${post.post_id}`,
        {
          data: {
            token: localStorage.getItem("token"),
          },
        }
      );
      alert(response.data.message);
      refresh(); // Refresh posts after delete
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post");
    }
  };

  const handleCommentSubmit = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3001/posts/${post.post_id}/comments`,
        {
          token: localStorage.getItem("token"),
          comment: comment,
        }
      );
      alert(response.data.message);
      refresh();
      setComment("");
    } catch (error) {
      console.error("Error posting comment:", error.message);
      alert("Failed to post comment");
    }
  };

  return (
    <div className="post-container">
      <div className="post-header">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTtsBeH_z-vguCCSjLivF047pncp18hC041w&usqp=CAU"
          alt="Profile Avatar"
          className="avatar"
        />
        <div className="post-info">
          <p className="author">{post.sender}</p>
          <p className="time">{convertTime(post.created_at)}</p>
        </div>
      </div>
      {isEditing ? (
        <div>
          <textarea
            value={updatedContent}
            onChange={(e) => setUpdatedContent(e.target.value)}
          />
          <button onClick={handleUpdate}>Update</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      ) : (
        <p className="post-content">{post.post_content}</p>
      )}

      <div className="post-actions">
        <button
          className="like-button"
          onClick={() => handleLike(post.post_id)}
        >
          Like
        </button>
        {post.sender === (localStorage.getItem("username") || "") && (
          <>
            <button onClick={handleEdit}>Edit</button>
            <button onClick={handleDelete}>Delete</button>
          </>
        )}
      </div>

      <div className="post-footer">
        <p className="likes">{post.like_count} likes</p>
        {post.likers?.length ? (
          <div className="likers">
            <p className="likes">oleh {post.likers.toString()}</p>
          </div>
        ) : null}
      </div>

      <div className="comments">
        <textarea
          placeholder="Add a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button onClick={handleCommentSubmit}>Post Comment</button>

        <div className="comment-list">
          {post.comments?.map((comment, index) => (
            <div key={index} className="comment">
              <p>
                {comment.author}: {comment.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Post;
