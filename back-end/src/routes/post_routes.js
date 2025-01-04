const express = require("express");
const routes = express.Router();

const postsControllers = require("../controllers/post_controllers");

routes.get("/", postsControllers.getAllPosts);

routes.post("/", postsControllers.createPost);

routes.post("/like", postsControllers.likePost);

routes.put("/:id", postsControllers.updatePost);

routes.delete("/:id", postsControllers.deletePost);

routes.post("/:id/comments", postsControllers.addComment);

module.exports = routes;
