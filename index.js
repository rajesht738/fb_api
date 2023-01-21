const express = require("express");

const app = express();


const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const commentRoute = require("./routes/comments");
const likesRoute = require("./routes/likes");
const postRoute = require("./routes/posts");

const cors = require("cors");
const cookieParser = require("cookie-parser");
const multer = require("multer");

app.use((req,res,next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next()
})
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000"
}));
app.use(cookieParser());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../social/public/upload')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + file.originalname;
    cb(null, uniqueSuffix)
  }
})

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req,res) => {
  const file = req.file;
  console.log(file);
  res.status(200).json(file.filename);
})
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/comment", commentRoute);
app.use("/api/posts", postRoute);

app.use("/api/likes", likesRoute);

app.listen(8800, () => {
  console.log("Api is working!");
});
