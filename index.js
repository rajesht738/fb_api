const express = require("express");

const app = express();


const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const commentRoute = require("./routes/comments");
const likesRoute = require("./routes/likes");
const postRoute = require("./routes/posts");

const cors = require("cors");
const cookieParser = require("cookie-parser");

app.use((req,res,next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next()
})
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000"
}));
app.use(cookieParser());



app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/comment", commentRoute);
app.use("/api/posts", postRoute);

app.use("/api/likes", likesRoute);

app.listen(8800, () => {
  console.log("Api is working!");
});
