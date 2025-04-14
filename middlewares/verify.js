import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";

export const verifyUser = (req, res, next) => {
  if (req.cookies.access_token) {
    const token = req.cookies.access_token;
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return next(errorHandler(401, "Invalid access token."));
      req.user = user;
      return next();
    });
  } else {
    return next(errorHandler(401, "No access token."));
  }
};
