import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import PostForm from "../components/PostForm";
import Post from "../components/Post";
import axios from "axios";
import "../styles/home.css";

const Home = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);

  const getPosts = async () => {
    try {
      const response = await axios.get("http://localhost:3001/posts");
      console.log("Fetched posts:", response.data.posts);
      setPosts(response.data.posts);
    } catch (error) {
      console.error("Error fetching posts:", error.message);
    }
  };

  const handleLike = async (postId) => {
    try {
      const response = await axios.post("http://localhost:3001/posts/like", {
        post_id: postId,
        token: localStorage.getItem("token"),
      });
      alert(response.data.message);
      getPosts();
    } catch (error) {
      console.error("Error liking post:", error.message);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    } else {
      getPosts();
    }
  }, [navigate]);

  return (
    <>
      <Header />
      <div className="home-container">
        <PostForm refresh={getPosts} />
        {posts.map((post) => (
          <Post
            key={post.post_id}
            post={post}
            refresh={getPosts}
            handleLike={handleLike}
          />
        ))}
      </div>
    </>
  );
};

export default Home;
