const express = require("express");
const routes = express.Router();

const postsControllers = require("../controllers/post_controllers");

// Routing untuk get posts
routes.get("/", postsControllers.getAllPosts);

// Routing untuk create post
routes.post("/", postsControllers.createPost);

module.exports = routes;
