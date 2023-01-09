const db = require("../database/connect");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registration = (req, res) => {
  const q = "SELECT * FROM users WHERE username = ?";

  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length > 0) {
      return res.status(409).json("User already exists!");
    }
  });
  // console.log(result);
  // New Registration
  // Hash password
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(req.body.password, salt);

  const insertQ =
    "INSERT INTO users (`username`,`email`, `password`, `name`) VALUE (?)";
  const values = [
    req.body.username,
    req.body.email,
    hashedPassword,
    req.body.name,
  ];

 db.query(insertQ, [values], (err, data) => {
    if (err) {
      return res.status(500).json(err);
    }

    return res.status(200).json("User created Successfully!");
  });
};
const login = async (req, res) => {
  const q = "SELECT * FROM users WHERE username= ?";

  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.status(409).json(err);
    if (data.length === 0) return res.status(404).json("Username not found!");

    const checkedPassword = bcrypt.compareSync(
      req.body.password,
      data[0].password
    );
    if (!checkedPassword)
      return res.status(400).json("Wrong password or username");

    const token = jwt.sign({ id: data[0].id }, "secretKey");
    const { password, ...others } = data[0];
    res
      .cookie("accessToken", token, {
        httpOnly: true,
      })
      .status(200)
      .json(others);
  });
};
const logout = (req, res) => {
  res
    .clearCookie("accessToken", {
      secure: true,
      sameSite: "none",
    })
    .status(200).json("Logged out!");
};

module.exports = [registration, login, logout];
