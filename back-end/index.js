const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3001;

const userRoutes = require("./src/routes/user_routes");
const postRoutes = require("./src/routes/post_routes");

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(express.json());

// untuk routing post
app.use("/posts", postRoutes);

app.use("/", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
