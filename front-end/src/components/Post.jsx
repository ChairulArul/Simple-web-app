import React from "react";
import "../styles/post.css";

// Perbaikan: Nama fungsi menggunakan huruf besar dan sesuai konsistensi penggunaan
const convertTime = (time) => {
  const isoDateObject = new Date(time); // Perbaikan: Gunakan Date dengan huruf kapital
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
          {/* Perbaikan: Pastikan nama fungsi sesuai dengan yang dideklarasikan */}
          <p className="time">{convertTime(props.post.created_at)}</p>
        </div>
      </div>
      <p className="post-content">{props.post.post_content}</p>
      <div className="post-actions">
        <button className="like-button">Like</button>
      </div>
      <div className="post-footer">
        <p className="likes">{props.post.like_count} likes</p>
        {props.post.likers.length ? (
          <div className="likers">
            <p className="likes">oleh {props.post.likers.toString()}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Post;
