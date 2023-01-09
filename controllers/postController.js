const db = require('../database/connect');
const jwt = require('jsonwebtoken');
const getPosts  = (req,res) => {
    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("Not logged in!")

    jwt.verify(token, "secretKey", (err, userInfo) => {
        const q = 'SELECT p.*, u.id AS userId, name, profilePic FROM posts as p JOIN users as u ON (u.id = p.userId) LEFT JOIN relationships AS r ON (p.userId = r.followedUserId ) WHERE r.followerUserId=? OR p.userId =?';

        db.query(q, [userInfo.id, userInfo.id], (err,data) => {
         if(err) return res.status(500).json(err);
         return res.status(200).json(data);
        });
    });

   
};

module.exports = [getPosts]