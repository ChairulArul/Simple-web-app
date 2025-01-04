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

const Post = (props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedContent, setUpdatedContent] = useState(props.post.post_content);
  const [comment, setComment] = useState("");

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setUpdatedContent(props.post.post_content); // Reset to original content
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3001/posts/${props.post.post_id}`,
        {
          token: localStorage.getItem("token"),
          content: updatedContent,
        }
      );
      alert(response.data.message);
      setIsEditing(false);
      props.refresh(); // Refresh posts after update
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Failed to update post");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:3001/posts/${props.post.post_id}`,
        {
          data: {
            token: localStorage.getItem("token"),
          },
        }
      );
      alert(response.data.message);
      props.refresh(); // Refresh posts after delete
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post");
    }
  };

  const handleCommentSubmit = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3001/posts/${props.post.post_id}/comments`,
        {
          token: localStorage.getItem("token"),
          comment: comment,
        }
      );
      alert(response.data.message);
      props.refresh(); // Refresh posts after adding comment
      setComment(""); // Reset comment input
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
          <p className="author">{props.post.sender}</p>
          <p className="time">{convertTime(props.post.created_at)}</p>
        </div>
      </div>
      {isEditing ? (
        <div>
          <textarea
            value={updatedContent}
            onChange={(e) => setUpdatedContent(e.target.value)}
            className="edit-textarea"
          />
          <button onClick={handleUpdate} className="update-button">
            Update
          </button>
          <button onClick={handleCancel} className="cancel-button">
            Cancel
          </button>
        </div>
      ) : (
        <p className="post-content">{props.post.post_content}</p>
      )}

      <div className="post-actions">
        <button
          className="like-button"
          onClick={() => props.handleLike(props.post.post_id)}
        >
          Like
        </button>
        {props.post.sender === localStorage.getItem("username") && (
          <>
            <button onClick={handleEdit} className="edit-button">
              Edit
            </button>
            <button onClick={handleDelete} className="delete-button">
              Delete
            </button>
          </>
        )}
      </div>

      <div className="post-footer">
        <p className="likes">{props.post.like_count} likes</p>
        {props.post.likers.length > 0 && (
          <div className="likers">
            <p className="likes">oleh {props.post.likers.join(", ")}</p>
          </div>
        )}
      </div>

      <div className="comments">
        <textarea
          placeholder="Add a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="comment-input"
        />
        <button onClick={handleCommentSubmit} className="comment-button">
          Post Comment
        </button>

        <div className="comment-list">
          {props.post.comments &&
            props.post.comments.map((comment, index) => (
              <div key={index} className="comment">
                <p>
                  <strong>{comment.author}</strong>: {comment.content}
                </p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Post;
