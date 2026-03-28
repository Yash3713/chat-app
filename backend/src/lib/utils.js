import jwt from "jsonwebtoken";

export const generteJwtToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_TOKEN, {
    expiresIn: "7d",
  });
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, //MS
    httpOnly: true, // prevent XSS
    sameSite: "strict", // CSRF
    secure: process.env.NODE_ENV != "development",
  });

  return token;
};
