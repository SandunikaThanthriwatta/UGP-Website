import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    req.isAuth = false;
    return next();
  }
  let decoded;
  try {
    decoded = jwt.verify(token, "scalkdkuqyeuhdq,hdgqmdqhdjqdhhqdgqbqh");
    if (!decoded) {
      req.auth = false;
      return next();
    }
  } catch (err) {
    req.isAuth = false;
    return next();
  }

  req.userId = decoded.userId;
  req.isAuth = true;
  next();
};

export default auth;