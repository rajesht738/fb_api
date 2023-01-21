const db = require('../database/connect');
const jwt = require('jsonwebtoken');
const moment = require('moment/moment');
const getPosts  = (req,res) => {
    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("Not logged in!")

    jwt.verify(token, "secretKey", (err, userInfo) => {
        const q = 'SELECT p.*, u.id AS userId, name, profilePic FROM posts as p JOIN users as u ON (u.id = p.userId) LEFT JOIN relationships AS r ON (p.userId = r.followedUserId ) WHERE r.followerUserId=? OR p.userId =? ORDER BY p.createdAt DESC';

        db.query(q, [userInfo.id, userInfo.id], (err,data) => {
         if(err) return res.status(500).json(err);
         return res.status(200).json(data);
        });
    });
};
const addPost  = (req,res) => {
    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("Not logged in!")

    jwt.verify(token, "secretKey", (err, userInfo) => {
        const q = "INSERT INTO posts (`desc`, `img`,`createdAt`,`userId`) VALUES (?)";

        const values = [
            req.body.desc,
            req.body.img,
            moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
            userInfo.id
        ]


        db.query(q, [values], (err,data) => {
         if(err) return res.status(500).json(err);
         return res.status(200).json("Post has been created!");
        });
    });
};


module.exports = [getPosts, addPost]