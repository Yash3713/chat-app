import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      res.status(401).json({ messge: "Unauthorized - No Token found  " });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_TOKEN);
    if (!decodedToken) {
      res.status(401).json({ messge: "Unauthorized - Invalid Token " });
    }
    const user = await User.findById(decodedToken.userId).select("-password");
    if (!user) {
      res.status(404).json({ messge: "User not found " });
    }
    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
